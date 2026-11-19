// wildwoohoo.com build. Read README.md first.
//
// Two kinds of page live side by side while the site migrates:
//   1. Static files (every page not yet migrated, every image, script and
//      stylesheet). Copied to _site byte for byte, at the same path.
//   2. Migrated pages: a .njk file beside where its index.html used to be.
//      It renders through the shared layout to the same URL.
// scripts/verify-build.mjs proves after every build that no static file
// changed and no public URL was lost.

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { listStaticFiles } from "./scripts/static-files.mjs";

const OUTPUT = "_site";

function copyStatic() {
  const files = listStaticFiles();
  let copied = 0;
  for (const file of files) {
    const dest = path.join(OUTPUT, file);
    const src = fs.statSync(file);
    let out = null;
    try { out = fs.statSync(dest); } catch { /* not copied yet */ }
    if (out && out.size === src.size && out.mtimeMs >= src.mtimeMs) continue;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(file, dest);
    copied++;
  }
  return { files, copied };
}

// Cache-busting from content: a URL's ?v= changes only when its bytes do,
// so nobody has to remember to bump it by hand on a migrated page.
const BUNDLES = {
  "/assets/css/wwh-system.css": ["_includes/css/tokens.css", "_includes/css/system.css"],
};
function bust(url) {
  const clean = String(url).split("?")[0];
  const sources = BUNDLES[clean] || [clean.replace(/^\//, "")];
  const hash = crypto.createHash("sha256");
  for (const file of sources) hash.update(fs.readFileSync(file));
  return `${clean}?v=${hash.digest("hex").slice(0, 10)}`;
}

export default function (eleventyConfig) {
  let staticFiles = new Set();

  eleventyConfig.on("eleventy.before", () => {
    const { files, copied } = copyStatic();
    staticFiles = new Set(files);
    console.log(`[wwh] static files: ${files.length} (${copied} copied this run)`);
  });

  // A page must have one source. If both method/index.html and
  // method/index.njk exist, stop the build rather than guess.
  eleventyConfig.on("eleventy.after", ({ results }) => {
    const clashes = results
      .map((r) => path.relative(OUTPUT, r.outputPath).split(path.sep).join("/"))
      .filter((p) => staticFiles.has(p));
    if (clashes.length) {
      throw new Error(
        `[wwh] These paths have both a static file and a template: ${clashes.join(", ")}. ` +
        "When a page is migrated to .njk, delete its old .html.",
      );
    }
  });

  // Only .njk files are templates. Every .html in the repo stays static,
  // which is what keeps un-migrated pages untouched.
  eleventyConfig.setTemplateFormats(["njk"]);

  eleventyConfig.addFilter("bust", bust);

  // Images on migrated pages: WebP plus the original format, three widths,
  // width and height set, metadata (EXIF, GPS) stripped by sharp.
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html",
    formats: ["webp", "auto"],
    widths: [640, 1024, 1600],
    outputDir: path.join(OUTPUT, "assets/img/r"),
    urlPath: "/assets/img/r/",
    fixOrientation: true,
    filenameFormat(id, src, width, format) {
      const name = path.basename(src, path.extname(src))
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      return `${name}-${id}-${width}.${format}`;
    },
    sharpJpegOptions: { quality: 80, mozjpeg: true, progressive: true },
    sharpWebpOptions: { quality: 76 },
    sharpPngOptions: { compressionLevel: 9 },
    htmlOptions: {
      imgAttributes: { loading: "lazy", decoding: "async" },
    },
  });

  return {
    dir: { input: ".", output: OUTPUT, includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
  };
}
