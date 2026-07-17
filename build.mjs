import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
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

for (const page of pages) {
  const pageDir = resolve(dist, page.slug);
  await mkdir(pageDir, { recursive: true });
  await writeFile(resolve(pageDir, "index.html"), renderPage(page, pages));
}

await writeFile(resolve(dist, "sitemap.xml"), renderSitemap(pages));

console.log(`Built Cloudflare Pages output in dist/ with ${pages.length} resource pages.`);
