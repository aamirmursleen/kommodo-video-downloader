// Converts the fragmented MP4 produced by mux.js (ftyp + moov + moof/mdat pairs)
// into a regular "progressive" MP4 with a real duration and a full sample index.
// Fragmented output leaves the duration as 0xFFFFFFFF ("unknown"), which many
// desktop players show as 13:15:21 and cannot seek. Classic script: exposes
// globalThis.Mp4Remux so it works in the browser and in Node tests.
(function (root) {
  const MOVIE_TIMESCALE = 1000;
  const UINT32_MAX = 0xffffffff;

  function readType(bytes, offset) {
    return String.fromCharCode(bytes[offset], bytes[offset + 1], bytes[offset + 2], bytes[offset + 3]);
  }

  function view(bytes) {
    return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  }

  // Returns the boxes directly inside bytes[start, end).
  function parseBoxes(bytes, start = 0, end = bytes.byteLength) {
    const dv = view(bytes);
    const boxes = [];
    let offset = start;
    while (offset + 8 <= end) {
      let size = dv.getUint32(offset);
      const type = readType(bytes, offset + 4);
      let headerSize = 8;
      if (size === 1) {
        size = Number(dv.getBigUint64(offset + 8));
        headerSize = 16;
      } else if (size === 0) {
        size = end - offset;
      }
      if (size < headerSize || offset + size > end) {
        throw new Error(`Malformed MP4 box "${type}".`);
      }
      boxes.push({ type, start: offset, end: offset + size, bodyStart: offset + headerSize });
      offset += size;
    }
    return boxes;
  }

  function children(bytes, box) {
    return parseBoxes(bytes, box.bodyStart, box.end);
  }

  function find(boxes, type) {
    return boxes.find((box) => box.type === type);
  }

  function box(type, ...payloads) {
    const size = 8 + payloads.reduce((sum, item) => sum + item.byteLength, 0);
    const out = new Uint8Array(size);
    const dv = view(out);
    dv.setUint32(0, size);
    for (let index = 0; index < 4; index += 1) out[4 + index] = type.charCodeAt(index);
    let offset = 8;
    for (const item of payloads) {
      out.set(item, offset);
      offset += item.byteLength;
    }
    return out;
  }

  function fullBox(type, version, flags, body) {
    const header = new Uint8Array(4);
    view(header).setUint32(0, ((version << 24) | flags) >>> 0);
    return box(type, header, body);
  }

  function u32Table(rows) {
    const width = rows.length ? rows[0].length : 0;
    const out = new Uint8Array(4 + rows.length * width * 4);
    const dv = view(out);
    dv.setUint32(0, rows.length);
    let offset = 4;
    for (const row of rows) {
      for (const value of row) {
        dv.setUint32(offset, value >>> 0);
        offset += 4;
      }
    }
    return out;
  }

  function slice(bytes, b) {
    return bytes.subarray(b.start, b.end);
  }

  function readTrex(bytes, mvex) {
    const defaults = new Map();
    if (!mvex) return defaults;
    for (const trex of children(bytes, mvex).filter((item) => item.type === "trex")) {
      const dv = view(bytes);
      const body = trex.bodyStart + 4;
      defaults.set(dv.getUint32(body), {
        duration: dv.getUint32(body + 8),
        size: dv.getUint32(body + 12),
        flags: dv.getUint32(body + 16)
      });
    }
    return defaults;
  }

  function readTrackId(bytes, trak) {
    const tkhd = find(children(bytes, trak), "tkhd");
    const dv = view(bytes);
    const version = bytes[tkhd.bodyStart];
    return dv.getUint32(tkhd.bodyStart + (version === 1 ? 20 : 12));
  }

  function readMediaTimescale(bytes, trak) {
    const mdia = find(children(bytes, trak), "mdia");
    const mdhd = find(children(bytes, mdia), "mdhd");
    const version = bytes[mdhd.bodyStart];
    return view(bytes).getUint32(mdhd.bodyStart + (version === 1 ? 20 : 12));
  }

  function readFragment(bytes, moof, tracks, trexDefaults) {
    const dv = view(bytes);
    for (const traf of children(bytes, moof).filter((item) => item.type === "traf")) {
      const trafBoxes = children(bytes, traf);
      const tfhd = find(trafBoxes, "tfhd");
      const tfhdFlags = dv.getUint32(tfhd.bodyStart) & 0xffffff;
      let cursor = tfhd.bodyStart + 4;
      const trackId = dv.getUint32(cursor);
      cursor += 4;
      const track = tracks.get(trackId);
      if (!track) throw new Error(`Fragment references unknown track ${trackId}.`);
      const trex = trexDefaults.get(trackId) || { duration: 0, size: 0, flags: 0 };

      let baseOffset = moof.start;
      if (tfhdFlags & 0x1) {
        baseOffset = Number(dv.getBigUint64(cursor));
        cursor += 8;
      }
      if (tfhdFlags & 0x2) cursor += 4;
      const defaultDuration = tfhdFlags & 0x8 ? dv.getUint32((cursor += 4) - 4) : trex.duration;
      const defaultSize = tfhdFlags & 0x10 ? dv.getUint32((cursor += 4) - 4) : trex.size;
      const defaultFlags = tfhdFlags & 0x20 ? dv.getUint32((cursor += 4) - 4) : trex.flags;

      const tfdt = find(trafBoxes, "tfdt");
      if (tfdt && track.baseDecodeTime === null) {
        track.baseDecodeTime = bytes[tfdt.bodyStart] === 1
          ? Number(dv.getBigUint64(tfdt.bodyStart + 4))
          : dv.getUint32(tfdt.bodyStart + 4);
      }

      let nextDataOffset = baseOffset;
      for (const trun of trafBoxes.filter((item) => item.type === "trun")) {
        const version = bytes[trun.bodyStart];
        const flags = dv.getUint32(trun.bodyStart) & 0xffffff;
        const count = dv.getUint32(trun.bodyStart + 4);
        let offset = trun.bodyStart + 8;
        let dataOffset = nextDataOffset;
        if (flags & 0x1) {
          dataOffset = baseOffset + dv.getInt32(offset);
          offset += 4;
        }
        let firstSampleFlags = null;
        if (flags & 0x4) {
          firstSampleFlags = dv.getUint32(offset);
          offset += 4;
        }

        let runBytes = 0;
        let chunkStart = dataOffset;
        let chunkBytes = 0;
        let chunkSamples = 0;
        let chunkTime = 0;
        const closeChunk = () => {
          if (!chunkSamples) return;
          if (chunkStart < 0 || chunkStart + chunkBytes > bytes.byteLength) {
            throw new Error("Fragment sample data is out of range.");
          }
          track.chunks.push({ data: bytes.subarray(chunkStart, chunkStart + chunkBytes), sampleCount: chunkSamples });
          chunkStart += chunkBytes;
          chunkBytes = 0;
          chunkSamples = 0;
          chunkTime = 0;
        };
        for (let index = 0; index < count; index += 1) {
          const sample = { duration: defaultDuration, size: defaultSize, flags: defaultFlags, cto: 0 };
          if (flags & 0x100) { sample.duration = dv.getUint32(offset); offset += 4; }
          if (flags & 0x200) { sample.size = dv.getUint32(offset); offset += 4; }
          if (flags & 0x400) { sample.flags = dv.getUint32(offset); offset += 4; }
          else if (index === 0 && firstSampleFlags !== null) sample.flags = firstSampleFlags;
          if (flags & 0x800) {
            sample.cto = version === 1 ? dv.getInt32(offset) : dv.getUint32(offset);
            offset += 4;
          }
          runBytes += sample.size;
          track.samples.push(sample);
          chunkBytes += sample.size;
          chunkSamples += 1;
          chunkTime += sample.duration;
          // About one second per chunk keeps audio and video interleaved.
          if (chunkTime >= track.timescale) closeChunk();
        }
        closeChunk();
        nextDataOffset = dataOffset + runBytes;
      }
    }
  }

  function patchDuration(bytes, durationOffsetV0, durationOffsetV1, duration) {
    const out = bytes.slice();
    const dv = view(out);
    const body = 8;
    if (out[body] === 1) {
      dv.setBigUint64(body + durationOffsetV1, BigInt(duration));
    } else {
      if (duration > UINT32_MAX) throw new Error("The recording is too long for a standard MP4 header.");
      dv.setUint32(body + durationOffsetV0, duration);
    }
    return out;
  }

  function buildSampleTable(bytes, stbl, track, chunkOffsets) {
    const stsd = find(children(bytes, stbl), "stsd");
    const samples = track.samples;

    const stts = [];
    for (const sample of samples) {
      const last = stts[stts.length - 1];
      if (last && last[1] === sample.duration) last[0] += 1;
      else stts.push([1, sample.duration]);
    }

    const parts = [slice(bytes, stsd), fullBox("stts", 0, 0, u32Table(stts))];

    if (samples.some((sample) => sample.cto !== 0)) {
      const signed = samples.some((sample) => sample.cto < 0);
      const ctts = [];
      for (const sample of samples) {
        const last = ctts[ctts.length - 1];
        if (last && last[1] === sample.cto) last[0] += 1;
        else ctts.push([1, sample.cto]);
      }
      parts.push(fullBox("ctts", signed ? 1 : 0, 0, u32Table(ctts)));
    }

    const syncSamples = [];
    samples.forEach((sample, index) => {
      if (!(sample.flags & 0x10000)) syncSamples.push([index + 1]);
    });
    if (syncSamples.length !== samples.length) {
      parts.push(fullBox("stss", 0, 0, u32Table(syncSamples)));
    }

    const stsc = [];
    track.chunks.forEach((chunk, index) => {
      const last = stsc[stsc.length - 1];
      if (!last || last[1] !== chunk.sampleCount) stsc.push([index + 1, chunk.sampleCount, 1]);
    });
    parts.push(fullBox("stsc", 0, 0, u32Table(stsc)));

    const stsz = new Uint8Array(8 + samples.length * 4);
    const stszView = view(stsz);
    stszView.setUint32(4, samples.length);
    samples.forEach((sample, index) => stszView.setUint32(8 + index * 4, sample.size));
    parts.push(fullBox("stsz", 0, 0, stsz));

    const useCo64 = chunkOffsets.some((value) => value > UINT32_MAX);
    const co = new Uint8Array(4 + chunkOffsets.length * (useCo64 ? 8 : 4));
    const coView = view(co);
    coView.setUint32(0, chunkOffsets.length);
    chunkOffsets.forEach((value, index) => {
      if (useCo64) coView.setBigUint64(4 + index * 8, BigInt(value));
      else coView.setUint32(4 + index * 4, value);
    });
    parts.push(fullBox(useCo64 ? "co64" : "stco", 0, 0, co));

    return box("stbl", ...parts);
  }

  function buildTrak(bytes, trak, track, chunkOffsets, movieDuration) {
    const out = [];
    for (const child of children(bytes, trak)) {
      if (child.type === "tkhd") {
        out.push(patchDuration(slice(bytes, child), 20, 28, track.movieDuration));
      } else if (child.type === "edts") {
        // Replaced below.
      } else if (child.type === "mdia") {
        const mdia = [];
        for (const mdiaChild of children(bytes, child)) {
          if (mdiaChild.type === "mdhd") {
            mdia.push(patchDuration(slice(bytes, mdiaChild), 16, 24, track.mediaDuration));
          } else if (mdiaChild.type === "minf") {
            const minf = children(bytes, mdiaChild).map((minfChild) => (
              minfChild.type === "stbl"
                ? buildSampleTable(bytes, minfChild, track, chunkOffsets)
                : slice(bytes, minfChild)
            ));
            mdia.push(box("minf", ...minf));
          } else {
            mdia.push(slice(bytes, mdiaChild));
          }
        }
        // An edit list keeps audio and video aligned when one starts later.
        if (track.startDelay > 0 && track.startDelay < movieDuration) {
          const elst = u32Table([
            [track.startDelay, UINT32_MAX, 0x00010000],
            [track.movieDuration - track.startDelay, 0, 0x00010000]
          ]);
          out.push(box("edts", fullBox("elst", 0, 0, elst)));
        }
        out.push(box("mdia", ...mdia));
      } else {
        out.push(slice(bytes, child));
      }
    }
    return box("trak", ...out);
  }

  function buildMoov(bytes, moovChildren, trackOrder, tracks, chunkOffsets, movieDuration) {
    const out = [];
    for (const child of moovChildren) {
      if (child.type === "mvhd") {
        const mvhd = slice(bytes, child).slice();
        const dv = view(mvhd);
        const version = mvhd[8];
        dv.setUint32(8 + (version === 1 ? 20 : 12), MOVIE_TIMESCALE);
        out.push(patchDuration(mvhd, 16, 24, movieDuration));
      } else if (child.type === "trak") {
        const id = trackOrder.get(child.start);
        out.push(buildTrak(bytes, child, tracks.get(id), chunkOffsets.get(id), movieDuration));
      } else if (child.type !== "mvex") {
        out.push(slice(bytes, child));
      }
    }
    return box("moov", ...out);
  }

  // parts: Uint8Array chunks in output order (init segment first). Each part
  // must contain whole boxes, which is how mux.js emits them.
  function remuxFragmentedMp4(parts) {
    let ftyp = null;
    let moovBytes = null;
    let moovChildren = null;
    let trexDefaults = new Map();
    const tracks = new Map();
    const trackOrder = new Map();

    for (const part of parts) {
      for (const top of parseBoxes(part)) {
        if (top.type === "ftyp" && !ftyp) {
          ftyp = slice(part, top);
        } else if (top.type === "moov" && !moovBytes) {
          moovBytes = part;
          moovChildren = children(part, top);
          trexDefaults = readTrex(part, find(moovChildren, "mvex"));
          for (const trak of moovChildren.filter((item) => item.type === "trak")) {
            const id = readTrackId(part, trak);
            trackOrder.set(trak.start, id);
            tracks.set(id, {
              timescale: readMediaTimescale(part, trak),
              baseDecodeTime: null,
              samples: [],
              chunks: []
            });
          }
        } else if (top.type === "moof") {
          if (!moovBytes) throw new Error("Fragment found before the MP4 header.");
          readFragment(part, top, tracks, trexDefaults);
        }
      }
    }

    if (!ftyp || !moovBytes) throw new Error("The converted video is missing its MP4 header.");
    for (const [id, track] of tracks) {
      if (!track.samples.length) {
        tracks.delete(id);
        for (const [start, trackId] of trackOrder) if (trackId === id) trackOrder.delete(start);
      }
    }
    if (!tracks.size) throw new Error("The converted video contains no samples.");
    moovChildren = moovChildren.filter((child) => child.type !== "trak" || trackOrder.has(child.start));

    const earliest = Math.min(...[...tracks.values()].map((track) => (track.baseDecodeTime || 0) / track.timescale));
    let movieDuration = 0;
    for (const track of tracks.values()) {
      track.mediaDuration = track.samples.reduce((sum, sample) => sum + sample.duration, 0);
      const startSeconds = (track.baseDecodeTime || 0) / track.timescale - earliest;
      track.startDelay = Math.round(startSeconds * MOVIE_TIMESCALE);
      track.movieDuration = track.startDelay + Math.round((track.mediaDuration / track.timescale) * MOVIE_TIMESCALE);
      movieDuration = Math.max(movieDuration, track.movieDuration);
    }

    // Interleave chunks by decode time so players read audio and video together.
    const ordered = [];
    for (const [id, track] of tracks) {
      let time = (track.baseDecodeTime || 0) / track.timescale;
      let sampleIndex = 0;
      for (const chunk of track.chunks) {
        ordered.push({ id, time, chunk });
        for (let index = 0; index < chunk.sampleCount; index += 1) {
          time += track.samples[sampleIndex].duration / track.timescale;
          sampleIndex += 1;
        }
      }
    }
    ordered.sort((a, b) => a.time - b.time);

    const mdatPayload = ordered.reduce((sum, item) => sum + item.chunk.data.byteLength, 0);
    const mdatHeaderSize = mdatPayload + 8 > UINT32_MAX ? 16 : 8;

    const layoutOffsets = (base) => {
      const offsets = new Map([...tracks.keys()].map((id) => [id, []]));
      let offset = base + mdatHeaderSize;
      for (const item of ordered) {
        offsets.get(item.id).push(offset);
        offset += item.chunk.data.byteLength;
      }
      return offsets;
    };

    // Build once to measure moov, then again with the final offsets
    // (moov first so playback can start before the whole file is read).
    let moov = buildMoov(moovBytes, moovChildren, trackOrder, tracks, layoutOffsets(0), movieDuration);
    let base = ftyp.byteLength + moov.byteLength;
    moov = buildMoov(moovBytes, moovChildren, trackOrder, tracks, layoutOffsets(base), movieDuration);
    if (ftyp.byteLength + moov.byteLength !== base) {
      // Switching stco -> co64 changed the size; one more pass settles it.
      base = ftyp.byteLength + moov.byteLength;
      moov = buildMoov(moovBytes, moovChildren, trackOrder, tracks, layoutOffsets(base), movieDuration);
    }

    const mdatHeader = new Uint8Array(mdatHeaderSize);
    const mdatView = view(mdatHeader);
    if (mdatHeaderSize === 16) {
      mdatView.setUint32(0, 1);
      mdatView.setBigUint64(8, BigInt(mdatPayload + 16));
    } else {
      mdatView.setUint32(0, mdatPayload + 8);
    }
    mdatHeader.set([0x6d, 0x64, 0x61, 0x74], 4);

    return {
      parts: [ftyp, moov, mdatHeader, ...ordered.map((item) => item.chunk.data)],
      durationSeconds: movieDuration / MOVIE_TIMESCALE
    };
  }

  root.Mp4Remux = { remuxFragmentedMp4, parseBoxes };
})(globalThis);
