import { cp, rm } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname);
const dist = resolve(root, "dist");
const publicDir = resolve(root, "public");

await rm(dist, { recursive: true, force: true });
await cp(publicDir, dist, { recursive: true });

console.log("Built Cloudflare Pages output in dist/");
