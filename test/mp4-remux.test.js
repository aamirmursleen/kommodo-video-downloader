import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import test from "node:test";
import "../public/mp4-remux.js";

const require = createRequire(import.meta.url);
const muxjs = require("mux.js");
const { remuxFragmentedMp4, parseBoxes } = globalThis.Mp4Remux;

// Same transmux path as public/app.js: push every TS segment, flush once.
async function transmuxFixtures() {
  const transmuxer = new muxjs.mp4.Transmuxer({ keepOriginalTimestamps: false });
  const parts = [];
  let initAdded = false;
  transmuxer.on("data", (segment) => {
    if (segment.initSegment && !initAdded) {
      parts.push(segment.initSegment);
      initAdded = true;
    }
    if (segment.data) parts.push(segment.data);
  });
  for (const name of ["segment0.ts", "segment1.ts"]) {
    transmuxer.push(new Uint8Array(await readFile(new URL(`./fixtures/${name}`, import.meta.url))));
  }
  transmuxer.flush();
  return parts;
}

function concat(parts) {
  const out = new Uint8Array(parts.reduce((sum, part) => sum + part.byteLength, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.byteLength;
  }
  return out;
}

function findPath(bytes, path, boxes = parseBoxes(bytes)) {
  const [type, ...rest] = path;
  const matches = boxes.filter((box) => box.type === type);
  if (!rest.length) return matches;
  return matches.flatMap((box) => findPath(bytes, rest, parseBoxes(bytes, box.bodyStart, box.end)));
}

function u32(bytes, offset) {
  return new DataView(bytes.buffer, bytes.byteOffset).getUint32(offset);
}

test("mux.js output has the unknown duration that players show as 13:15:21", async () => {
  const file = concat(await transmuxFixtures());
  const [mvhd] = findPath(file, ["moov", "mvhd"]);
  assert.equal(u32(file, mvhd.bodyStart + 16), 0xffffffff);
  assert.ok(findPath(file, ["moof"]).length > 0);
});

test("remuxes fragmented MP4 into a standard MP4 with a real duration", async () => {
  const { parts, durationSeconds } = remuxFragmentedMp4(await transmuxFixtures());
  const file = concat(parts);

  assert.ok(Math.abs(durationSeconds - 2) < 0.1, `Expected ~2s, received ${durationSeconds}`);
  assert.deepEqual(parseBoxes(file).map((box) => box.type), ["ftyp", "moov", "mdat"]);
  assert.equal(findPath(file, ["moov", "mvex"]).length, 0);

  const [mvhd] = findPath(file, ["moov", "mvhd"]);
  const timescale = u32(file, mvhd.bodyStart + 12);
  assert.ok(Math.abs(u32(file, mvhd.bodyStart + 16) / timescale - 2) < 0.1);

  const traks = findPath(file, ["moov", "trak"]);
  assert.equal(traks.length, 2);

  // Every chunk offset must land inside mdat, and sample sizes must fill it exactly.
  const [mdat] = parseBoxes(file).filter((box) => box.type === "mdat");
  let sampleBytes = 0;
  for (const stco of findPath(file, ["moov", "trak", "mdia", "minf", "stbl", "stco"])) {
    const count = u32(file, stco.bodyStart + 4);
    for (let index = 0; index < count; index += 1) {
      const offset = u32(file, stco.bodyStart + 8 + index * 4);
      assert.ok(offset >= mdat.bodyStart && offset < mdat.end);
    }
  }
  for (const stsz of findPath(file, ["moov", "trak", "mdia", "minf", "stbl", "stsz"])) {
    const count = u32(file, stsz.bodyStart + 8);
    for (let index = 0; index < count; index += 1) sampleBytes += u32(file, stsz.bodyStart + 12 + index * 4);
  }
  assert.equal(sampleBytes, mdat.end - mdat.bodyStart);

  // The first video sample must be a keyframe so playback can start.
  const [videoStss] = findPath(file, ["moov", "trak", "mdia", "minf", "stbl", "stss"]);
  assert.equal(u32(file, videoStss.bodyStart + 8), 1);
});

test("rejects input without an MP4 header", () => {
  assert.throws(() => remuxFragmentedMp4([new Uint8Array(0)]), /missing its MP4 header/);
});
