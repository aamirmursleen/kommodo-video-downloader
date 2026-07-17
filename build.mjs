import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

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

console.log("Built Cloudflare Pages output in dist/");
