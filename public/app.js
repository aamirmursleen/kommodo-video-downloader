const form = document.querySelector("#download-form");
const urlInput = document.querySelector("#recording-url");
const button = document.querySelector("#download-button");
const buttonLabel = button.querySelector(".button-label");
const buttonArrow = button.querySelector(".button-arrow");
const pasteButton = document.querySelector("#paste-button");
const formMessage = document.querySelector("#form-message");
const statusPanel = document.querySelector("#download-status");
const statusKickerText = document.querySelector("#status-kicker-text");
const stepEl = document.querySelector("#status-step");
const detailEl = document.querySelector("#status-detail");
const percentEl = document.querySelector("#status-percent");
const progressEl = document.querySelector("#main-progress");
const progressSteps = [...document.querySelectorAll(".progress-steps span")];
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
const MAX_SEGMENTS = 5000;
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

function setUiState(uiState) {
  statusPanel.dataset.state = uiState;
  statusPanel.setAttribute("aria-busy", String(uiState === "working"));

  const labels = {
    idle: "Ready when you are",
    working: "Working in your browser",
    success: "Download complete",
    error: "Something went wrong"
  };
  statusKickerText.textContent = labels[uiState] || labels.idle;
}

function setProgressStage(activeIndex) {
  progressSteps.forEach((item, index) => {
    item.classList.toggle("active", index === activeIndex);
    item.classList.toggle("done", index < activeIndex);
  });
}

function addLog(message) {
  const li = document.createElement("li");
  li.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  logEl.prepend(li);
}

function setBusy(isBusy) {
  button.disabled = isBusy;
  pasteButton.disabled = isBusy;
  buttonLabel.textContent = isBusy ? "Preparing video" : "Download video";
  buttonArrow.textContent = isBusy ? "…" : "→";
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
  formMessage.classList.remove("error");
  formMessage.textContent = "Use a public recording you own or have permission to download.";
  setUiState("idle");
  setProgressStage(0);
  resultPanel.hidden = true;

  if (activeObjectUrl) {
    URL.revokeObjectURL(activeObjectUrl);
    activeObjectUrl = null;
  }
}

function updateProgress(percent) {
  const safePercent = Math.max(0, Math.min(100, percent));
  percentEl.textContent = `${Math.round(safePercent)}%`;
  progressEl.value = safePercent;
  progressEl.textContent = `${Math.round(safePercent)}%`;
}

function updateStats() {
  const elapsed = Math.max((performance.now() - state.startedAt) / 1000, 0.1);
  const mb = state.bytes / 1024 / 1024;
  const speed = mb / elapsed;
  const percent = state.totalSegments
    ? 12 + (state.doneSegments / state.totalSegments) * 66
    : 12;
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

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error("Paste a complete link beginning with https://");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Use an http or https URL.");
  }

  const allowedHosts = new Set(["kommodo.ai", "www.kommodo.ai"]);
  if (!allowedHosts.has(parsed.hostname.toLowerCase())) {
    throw new Error("Paste a Kommodo recording link from kommodo.ai.");
  }
  if (!/^\/recordings\/[a-z0-9_-]+\/?$/i.test(parsed.pathname)) {
    throw new Error("This does not look like a Kommodo recording link.");
  }
  return parsed.toString();
}

async function resolveRecording(inputUrl) {
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

function findVariantPlaylists(text, playlistUrl) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const variants = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.startsWith("#EXT-X-STREAM-INF:")) continue;

    const bandwidthMatch = line.match(/BANDWIDTH=(\d+)/i);
    const bandwidth = Number(bandwidthMatch?.[1] || 0);
    const nextLine = lines.slice(index + 1).find((item) => !item.startsWith("#"));
    if (nextLine) {
      variants.push({
        url: new URL(nextLine, playlistUrl).toString(),
        bandwidth
      });
    }
  }

  return variants.sort((a, b) => b.bandwidth - a.bandwidth);
}

async function loadMediaPlaylist(hlsUrl, depth = 0) {
  if (depth > 2) {
    throw new Error("The HLS playlist has too many nested levels.");
  }

  const text = await fetchPlaylist(hlsUrl);
  const variants = findVariantPlaylists(text, hlsUrl);
  if (!variants.length) return { text, url: hlsUrl };

  addLog(`Selected the highest-quality stream from ${variants.length} available option${variants.length === 1 ? "" : "s"}.`);
  return loadMediaPlaylist(variants[0].url, depth + 1);
}

function parsePlaylist(text, playlistUrl) {
  if (!text.includes("#EXTM3U")) {
    throw new Error("The resolved file is not an HLS playlist.");
  }
  if (text.includes("#EXT-X-KEY")) {
    throw new Error("This recording is encrypted and cannot be converted by this browser tool.");
  }

  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const segments = [];
  let duration = 0;

  for (const line of lines) {
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
  if (segments.length > MAX_SEGMENTS) {
    throw new Error("This recording is too large to prepare safely in one browser tab.");
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
    throw new Error("The MP4 converter did not load. Refresh the page and try again.");
  }

  setStep("Preparing your MP4", "Converting the downloaded video in this browser.");
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

  // mux.js emits fragmented MP4 with an "unknown" duration that many desktop
  // players show as 13:15:21 and cannot seek. Rewrite it as a standard MP4.
  try {
    const remuxed = window.Mp4Remux.remuxFragmentedMp4(parts);
    return new Blob(remuxed.parts, { type: "video/mp4" });
  } catch (error) {
    addLog(`Saved as a streaming MP4; some players may show the wrong length (${error.message}).`);
    return new Blob(parts, { type: "video/mp4" });
  }
}

async function handleSubmit(event) {
  event.preventDefault();
  setBusy(true);
  resetProgress();
  logEl.innerHTML = "";

  try {
    const inputUrl = normalizeInput(urlInput.value);
    setUiState("working");
    setProgressStage(0);
    setStep("Finding your recording", "Resolving the secure video playlist.");
    updateProgress(4);

    const resolved = await resolveRecording(inputUrl);
    const title = resolved.title || "Kommodo recording";

    setStep("Reading video details", "Loading the available recording segments.");
    updateProgress(10);
    const mediaPlaylist = await loadMediaPlaylist(resolved.hlsUrl);
    const playlist = parsePlaylist(mediaPlaylist.text, mediaPlaylist.url);

    state.totalSegments = playlist.segments.length;
    state.totalDuration = playlist.totalDuration;
    state.startedAt = performance.now();
    segmentsEl.textContent = `0 / ${state.totalSegments}`;
    setProgressStage(1);
    setStep("Downloading your video", `${state.totalSegments} segments · about ${formatTime(state.totalDuration)} of video.`);
    updateProgress(12);

    const segmentBuffers = await downloadSegments(playlist.segments);
    setStep("Video received", `${formatBytes(state.bytes)} downloaded directly to this browser.`);

    setProgressStage(2);
    const mp4Blob = await transmuxToMp4(segmentBuffers);
    activeObjectUrl = URL.createObjectURL(mp4Blob);
    const fileName = `${slugify(title || resolved.recordingId)}.mp4`;

    saveLink.href = activeObjectUrl;
    saveLink.download = fileName;
    resultTitle.textContent = fileName;
    resultMeta.textContent = `${formatBytes(mp4Blob.size)} MP4 generated in your browser.`;
    resultPanel.hidden = false;

    setStep("Your MP4 is ready", "Select Save MP4 to store the file.");
    updateProgress(100);
    setUiState("success");
    setProgressStage(3);
  } catch (error) {
    const message = error.message || "The recording could not be prepared.";
    setStep("Download failed", message);
    setUiState("error");
    formMessage.classList.add("error");
    formMessage.textContent = message;
    addLog("If the recording is private or expired, copy a fresh public share link from Kommodo.");
  } finally {
    setBusy(false);
  }
}

form.addEventListener("submit", handleSubmit);

pasteButton.addEventListener("click", async () => {
  try {
    if (!navigator.clipboard || !window.isSecureContext) {
      throw new Error("Clipboard access is unavailable in this browser.");
    }
    const clipboardText = (await navigator.clipboard.readText()).trim();
    if (!clipboardText) throw new Error("Your clipboard does not contain a link.");
    urlInput.value = clipboardText;
    formMessage.classList.remove("error");
    formMessage.textContent = "Link pasted. Select Download video when you’re ready.";
    urlInput.focus();
  } catch (error) {
    formMessage.classList.add("error");
    formMessage.textContent = error.message || "Paste the link into the field manually.";
    urlInput.focus();
  }
});

urlInput.addEventListener("input", () => {
  if (!formMessage.classList.contains("error")) return;
  formMessage.classList.remove("error");
  formMessage.textContent = "Use a public recording you own or have permission to download.";
});

window.addEventListener("beforeunload", () => {
  if (activeObjectUrl) URL.revokeObjectURL(activeObjectUrl);
});
