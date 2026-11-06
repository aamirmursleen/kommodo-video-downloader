import { createHash } from "node:crypto";
import { copyFile, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { pages, renderPage, renderSitemap } from "./site-pages.mjs";

const root = resolve(import.meta.dirname);
const dist = resolve(root, "dist");
const publicDir = resolve(root, "public");

await rm(dist, { recursive: true, force: true });
await cp(publicDir, dist, { recursive: true });
await mkdir(resolve(dist, "vendor"), { recursive: true });
await cp(
  resolve(root, "node_modules/mux.js/dist/mux.min.js"),
  resolve(dist, "vendor/mux.min.js")
);

async function fingerprintAsset(relativePath) {
  const sourcePath = resolve(dist, relativePath);
  const contents = await readFile(sourcePath);
  const hash = createHash("sha256").update(contents).digest("hex").slice(0, 10);
  const extension = extname(relativePath);
  const fingerprintedPath = `${relativePath.slice(0, -extension.length)}.${hash}${extension}`;
  await copyFile(sourcePath, resolve(dist, fingerprintedPath));
  return `/${fingerprintedPath}`;
}

const stylesheetHref = await fingerprintAsset("styles.css");
const appHref = await fingerprintAsset("app.js");
const muxHref = await fingerprintAsset("vendor/mux.min.js");
const remuxHref = await fingerprintAsset("mp4-remux.js");

const homepagePath = resolve(dist, "index.html");
const homepage = (await readFile(homepagePath, "utf8"))
  .replace('href="/styles.css"', `href="${stylesheetHref}"`)
  .replace('src="/vendor/mux.min.js"', `src="${muxHref}"`)
  .replace('src="/mp4-remux.js"', `src="${remuxHref}"`)
  .replace('src="/app.js"', `src="${appHref}"`);
await writeFile(homepagePath, homepage);

for (const page of pages) {
  const pageDir = resolve(dist, page.slug);
  await mkdir(pageDir, { recursive: true });
  await writeFile(resolve(pageDir, "index.html"), renderPage(page, pages, { stylesheetHref }));
}

await writeFile(resolve(dist, "sitemap.xml"), renderSitemap(pages));

console.log(`Built Cloudflare Pages output in dist/ with ${pages.length} resource pages.`);
