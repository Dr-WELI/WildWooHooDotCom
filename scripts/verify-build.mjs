// Runs after every build, locally and in CI. A failure stops the deploy,
// so the live site keeps its last good version.
//
// 1. Every static file reached _site byte for byte (un-migrated pages,
//    images, scripts and stylesheets are untouched).
// 2. Every URL in sitemap.xml still resolves (no public URL lost).
// 3. Every built page carries the GA4 tag, links only to files that exist,
//    and holds no em-dash or curly quote (the house style rule).

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { listStaticFiles } from "./static-files.mjs";

const OUT = "_site";
const GA4 = "G-49XFV97ZRF";
const errors = [];
const sha = (p) => crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");

// 1. Static parity
const files = listStaticFiles();
const staticSet = new Set(files);
for (const f of files) {
  const out = path.join(OUT, f);
  if (!fs.existsSync(out)) errors.push(`static file missing from the build: /${f}`);
  else if (sha(f) !== sha(out)) errors.push(`static file changed by the build: /${f}`);
}

// Resolve a site URL path to the file GitHub Pages would serve.
function resolves(urlPath) {
  let p = decodeURIComponent(urlPath.split("#")[0].split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  const file = path.join(OUT, p);
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return true;
  return fs.existsSync(path.join(file, "index.html"));
}

// 2. Public URLs from the sitemap
const sitemap = fs.readFileSync(path.join(OUT, "sitemap.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>https:\/\/wildwoohoo\.com(\/[^<]*)<\/loc>/g)].map((m) => m[1]);
for (const loc of locs) if (!resolves(loc)) errors.push(`sitemap URL no longer resolves: ${loc}`);

// 3. Built pages
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });
}
const built = walk(OUT)
  .map((p) => path.relative(OUT, p).split(path.sep).join("/"))
  .filter((p) => p.endsWith(".html") && !staticSet.has(p));

const BANNED = [0x2014, 0x2018, 0x2019, 0x201c, 0x201d].map((c) => String.fromCharCode(c));
const BANNED_ENTITIES = ["&mdash;", "&lsquo;", "&rsquo;", "&ldquo;", "&rdquo;"];

for (const rel of built) {
  const html = fs.readFileSync(path.join(OUT, rel), "utf8");
  if (!html.includes(GA4)) errors.push(`/${rel}: GA4 tag missing`);
  for (const ch of BANNED) {
    if (html.includes(ch)) errors.push(`/${rel}: contains U+${ch.charCodeAt(0).toString(16).toUpperCase()}`);
  }
  for (const ent of BANNED_ENTITIES) if (html.includes(ent)) errors.push(`/${rel}: contains ${ent}`);
  const refs = [...html.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)].map((m) => m[1])
    .concat([...html.matchAll(/\ssrcset="([^"]*)"/g)].flatMap((m) =>
      m[1].split(",").map((s) => s.trim().split(/\s+/)[0]).filter((u) => u.startsWith("/"))));
  for (const ref of refs) {
    if (ref.startsWith("//")) continue;
    if (!resolves(ref)) errors.push(`/${rel}: broken internal link or asset ${ref}`);
  }
}

if (errors.length) {
  console.error(`[verify] FAILED with ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`[verify] OK: ${files.length} static files identical, ${locs.length} sitemap URLs resolve, ${built.length} built page(s) checked.`);
