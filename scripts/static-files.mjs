// The one list of files published exactly as they sit in the repo.
// The build copies these; the check proves each one arrived byte for byte.
// Everything matched by BUILD_ONLY is build machinery and is never published.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export const BUILD_ONLY = [
  /^node_modules\//,
  /^_site\//,
  /^\.cache\//,
  /^\.github\//,
  /^_includes\//,
  /^_data\//,
  /^scripts\//,
  /^package(-lock)?\.json$/,
  /^eleventy\.config\.mjs$/,
  /^README\.md$/,
  // The source of a migrated page. Its output is the page's old URL.
  /\.njk$/,
];

export function isBuildOnly(file) {
  return BUILD_ONLY.some((re) => re.test(file));
}

// Tracked files plus new files not yet committed (so a local preview shows
// them), minus anything .gitignore excludes. In CI this is exactly the commit.
export function listStaticFiles(root = process.cwd()) {
  let files;
  try {
    const out = execFileSync(
      "git",
      ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
      { cwd: root, maxBuffer: 256 * 1024 * 1024 },
    );
    files = out.toString("utf8").split("\0").filter(Boolean);
  } catch {
    files = walk(root, root);
  }
  return [...new Set(files)]
    .filter((f) => !isBuildOnly(f))
    .filter((f) => fs.existsSync(path.join(root, f)))
    .sort();
}

// Fallback when git is unavailable (a downloaded zip, say).
function walk(dir, root) {
  const skip = new Set([".git", "node_modules", "_site", ".cache", ".DS_Store"]);
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(full, root));
    else found.push(path.relative(root, full).split(path.sep).join("/"));
  }
  return found;
}
