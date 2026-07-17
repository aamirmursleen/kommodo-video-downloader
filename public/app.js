const form = document.querySelector("#download-form");
const urlInput = document.querySelector("#recording-url");
const button = document.querySelector("#download-button");
const stepEl = document.querySelector("#status-step");
const detailEl = document.querySelector("#status-detail");
const percentEl = document.querySelector("#status-percent");
const progressEl = document.querySelector("#main-progress");
const progressBar = document.querySelector(".bar");
const bytesEl = document.querySelector("#status-bytes");
const speedEl = document.querySelector("#status-speed");
const segmentsEl = document.querySelector("#status-segments");
const etaEl = document.querySelector("#status-eta");
const logEl = document.querySelector("#download-log");
const resultPanel = document.querySelector("#result-panel");
const resultTitle = document.querySelector("#result-title");
const resultMeta = document.querySelector("#result-meta");
const saveLink = document.querySelector("#save-link");

const MAX_WORKERS = 8;
let activeObjectUrl = null;

const state = {
  totalSegments: 0,
  doneSegments: 0,
  bytes: 0,
  startedAt: 0,
  totalDuration: 0,
  doneDuration: 0
};

function setStep(step, detail = "") {
  stepEl.textContent = step;
  detailEl.textContent = detail;
  addLog(`${step}${detail ? `: ${detail}` : ""}`);
}

function addLog(message) {
  const li = document.createElement("li");
  li.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  logEl.prepend(li);
}

function setBusy(isBusy) {
  button.disabled = isBusy;
  button.textContent = isBusy ? "Working..." : "Download MP4";
}

function resetProgress() {
  state.totalSegments = 0;
  state.doneSegments = 0;
  state.bytes = 0;
  state.startedAt = performance.now();
  state.totalDuration = 0;
  state.doneDuration = 0;
  updateProgress(0);
  bytesEl.textContent = "0 MB";
  speedEl.textContent = "0 MB/s";
  segmentsEl.textContent = "0 / 0";
  etaEl.textContent = "ETA --";
  resultPanel.hidden = true;
  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = null;
  }
}

function updateProgress(percent) {
  const safePercent = Math.max(0, Math.min(100, percent));
  percentEl.textContent = `${Math.round(safePercent)}%`;
  progressEl.style.width = `${safePercent}%`;
  progressBar.setAttribute("aria-valuenow", String(Math.round(safePercent)));
}

function updateStats() {
  const elapsed = Math.max((performance.now() - state.startedAt) / 1000, 0.1);
  const mb = state.bytes / 1024 / 1024;
  const speed = mb / elapsed;
  const percent = state.totalSegments
    ? (state.doneSegments / state.totalSegments) * 78
    : 0;
  const remainingSegments = Math.max(state.totalSegments - state.doneSegments, 0);
  const segmentsPerSecond = state.doneSegments / elapsed;
  const eta = segmentsPerSecond > 0 ? remainingSegments / segmentsPerSecond : 0;

  updateProgress(percent);
  bytesEl.textContent = `${mb.toFixed(mb >= 100 ? 0 : 1)} MB`;
  speedEl.textContent = `${speed.toFixed(speed >= 10 ? 1 : 2)} MB/s`;
  segmentsEl.textContent = `${state.doneSegments} / ${state.totalSegments}`;
  etaEl.textContent = eta > 0 ? `ETA ${formatTime(eta)}` : "ETA --";
}

function formatTime(seconds) {
  const whole = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(whole / 60);
  const rest = whole % 60;
  if (minutes === 0) return `${rest}s`;
  return `${minutes}m ${String(rest).padStart(2, "0")}s`;
}

function formatBytes(bytes) {
  const mb = bytes / 1024 / 1024;
  if (mb < 1024) return `${mb.toFixed(mb >= 100 ? 0 : 1)} MB`;
  return `${(mb / 1024).toFixed(2)} GB`;
}

function slugify(value) {
  return (value || "kommodo-recording")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "kommodo-recording";
}

function normalizeInput(value) {
  const trimmed = value.trim();
  if (!trimmed) throw new Error("Paste a Kommodo recording URL first.");
  const parsed = new URL(trimmed);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Use an http or https URL.");
  }
  return parsed.toString();
}

function isPlaylistUrl(value) {
  try {
    return new URL(value).pathname.endsWith(".m3u8");
  } catch {
    return false;
  }
}

async function resolveRecording(inputUrl) {
  if (isPlaylistUrl(inputUrl)) {
    return {
      hlsUrl: inputUrl,
      title: "Kommodo recording",
      recordingId: "direct-playlist"
    };
  }

  const endpoint = `/api/resolve?url=${encodeURIComponent(inputUrl)}`;
  const response = await fetch(endpoint, { cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "Could not resolve the Kommodo recording.");
  }
  return payload;
}

async function fetchPlaylist(hlsUrl) {
  const response = await fetch(hlsUrl, { cache: "no-store", mode: "cors" });
  if (!response.ok) {
    throw new Error(`Playlist request failed with HTTP ${response.status}.`);
  }
  return response.text();
}

function parsePlaylist(text, playlistUrl) {
  if (!text.includes("#EXTM3U")) {
    throw new Error("The resolved file is not an HLS playlist.");
  }
  if (text.includes("#EXT-X-KEY")) {
    throw new Error("This recording appears to be encrypted HLS, which this browser downloader cannot convert.");
  }

  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const segments = [];
  let duration = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.startsWith("#EXTINF:")) {
      duration = Number.parseFloat(line.slice(8).split(",")[0]) || 0;
      continue;
    }
    if (line.startsWith("#")) continue;
    segments.push({
      url: new URL(line, playlistUrl).toString(),
      duration
    });
    duration = 0;
  }

  if (!segments.length) {
    throw new Error("No downloadable video segments were found in the playlist.");
  }

  return {
    segments,
    totalDuration: segments.reduce((sum, item) => sum + item.duration, 0)
  };
}

async function fetchSegment(segment, index, attempt = 1) {
  try {
    const response = await fetch(segment.url, {
      cache: "no-store",
      mode: "cors"
    });
    if (!response.ok) {
      throw new Error(`Segment ${index + 1} returned HTTP ${response.status}.`);
    }

    if (!response.body) {
      const buffer = new Uint8Array(await response.arrayBuffer());
      state.bytes += buffer.byteLength;
      return buffer;
    }

    const reader = response.body.getReader();
    const chunks = [];
    let total = 0;
    let lastPaint = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      total += value.byteLength;
      state.bytes += value.byteLength;
      const now = performance.now();
      if (now - lastPaint > 220) {
        updateStats();
        lastPaint = now;
      }
    }

    const merged = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      merged.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return merged;
  } catch (error) {
    if (attempt < 3) {
      addLog(`Retrying segment ${index + 1}`);
      return fetchSegment(segment, index, attempt + 1);
    }
    throw error;
  }
}

async function downloadSegments(segments) {
  const output = new Array(segments.length);
  let cursor = 0;

  async function worker() {
    while (cursor < segments.length) {
      const index = cursor;
      cursor += 1;
      output[index] = await fetchSegment(segments[index], index);
      state.doneSegments += 1;
      state.doneDuration += segments[index].duration || 0;
      updateStats();
    }
  }

  const workerCount = Math.min(MAX_WORKERS, segments.length);
  await Promise.all(Array.from({ length: workerCount }, worker));
  return output;
}

async function transmuxToMp4(buffers) {
  if (!window.muxjs?.mp4?.Transmuxer) {
    throw new Error("MP4 converter failed to load. Refresh and try again.");
  }

  setStep("Assembling MP4", "Converting downloaded HLS segments in your browser.");
  updateProgress(82);

  const transmuxer = new window.muxjs.mp4.Transmuxer({
    keepOriginalTimestamps: false
  });
  const parts = [];
  let initAdded = false;

  transmuxer.on("data", (segment) => {
    if (segment.initSegment && !initAdded) {
      parts.push(segment.initSegment);
      initAdded = true;
    }
    if (segment.data) parts.push(segment.data);
  });

  for (let index = 0; index < buffers.length; index += 1) {
    transmuxer.push(buffers[index]);
    if (index % 24 === 0) {
      const percent = 82 + (index / Math.max(buffers.length - 1, 1)) * 16;
      updateProgress(percent);
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
  }
  transmuxer.flush();

  if (!parts.length) {
    throw new Error("The browser could not convert this HLS stream into MP4.");
  }

  updateProgress(99);
  return new Blob(parts, { type: "video/mp4" });
}

async function handleSubmit(event) {
  event.preventDefault();
  setBusy(true);
  resetProgress();
  logEl.innerHTML = "";

  try {
    const inputUrl = normalizeInput(urlInput.value);
    setStep("Resolving recording", "Finding the signed HLS playlist.");
    updateProgress(4);

    const resolved = await resolveRecording(inputUrl);
    const title = resolved.title || "Kommodo recording";

    setStep("Reading playlist", "Loading segment list from Kommodo CDN.");
    updateProgress(10);
    const playlistText = await fetchPlaylist(resolved.hlsUrl);
    const playlist = parsePlaylist(playlistText, resolved.hlsUrl);

    state.totalSegments = playlist.segments.length;
    state.totalDuration = playlist.totalDuration;
    state.startedAt = performance.now();
    segmentsEl.textContent = `0 / ${state.totalSegments}`;
    setStep("Downloading segments", `${state.totalSegments} segments, estimated duration ${formatTime(state.totalDuration)}.`);
    updateProgress(12);

    const segmentBuffers = await downloadSegments(playlist.segments);
    setStep("Segments downloaded", `${formatBytes(state.bytes)} received by your browser.`);

    const mp4Blob = await transmuxToMp4(segmentBuffers);
    activeObjectUrl = URL.createObjectURL(mp4Blob);
    const fileName = `${slugify(title || resolved.recordingId)}.mp4`;

    saveLink.href = activeObjectUrl;
    saveLink.download = fileName;
    resultTitle.textContent = fileName;
    resultMeta.textContent = `${formatBytes(mp4Blob.size)} MP4 generated in your browser.`;
    resultPanel.hidden = false;

    setStep("Download ready", "Click Save MP4 to store the file.");
    updateProgress(100);
  } catch (error) {
    setStep("Download failed", error.message || "Unknown error.");
    addLog("If this is a private or expired recording, open it in Kommodo and copy a fresh share link.");
  } finally {
    setBusy(false);
  }
}

form.addEventListener("submit", handleSubmit);
