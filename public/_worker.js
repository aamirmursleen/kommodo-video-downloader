const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer"
};

const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 30;
const rateBuckets = new Map();

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/resolve") {
      if (request.method !== "GET") {
        return json({ ok: false, error: "Method not allowed." }, 405);
      }
      if (isRateLimited(request)) {
        return json({ ok: false, error: "Too many requests. Please wait a minute and try again." }, 429);
      }
      return resolveKommodo(url);
    }

    return env.ASSETS.fetch(request);
  }
};

async function resolveKommodo(requestUrl) {
  try {
    const target = requestUrl.searchParams.get("url");
    if (!target) return json({ ok: false, error: "Missing URL." }, 400);
    if (target.length > 2048) return json({ ok: false, error: "The recording URL is too long." }, 400);

    let parsed;
    try {
      parsed = new URL(target);
    } catch {
      return json({ ok: false, error: "Paste a complete Kommodo recording URL." }, 400);
    }
    if (parsed.protocol !== "https:") {
      return json({ ok: false, error: "Use a secure https Kommodo link." }, 400);
    }

    const allowedHosts = new Set(["kommodo.ai", "www.kommodo.ai"]);
    if (!allowedHosts.has(parsed.hostname.toLowerCase()) || parsed.username || parsed.password || parsed.port) {
      return json({ ok: false, error: "Paste a kommodo.ai recording URL." }, 400);
    }

    if (!/^\/recordings\/[a-z0-9_-]+\/?$/i.test(parsed.pathname)) {
      return json({ ok: false, error: "This does not look like a Kommodo recording URL." }, 400);
    }

    const response = await fetch(parsed.toString(), {
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "Mozilla/5.0 KomodoVideoDownloader/1.0"
      },
      cf: {
        cacheTtl: 0,
        cacheEverything: false
      },
      redirect: "manual"
    });

    if (!response.ok) {
      return json({ ok: false, error: `Kommodo returned HTTP ${response.status}.` }, 502);
    }

    const announcedLength = Number(response.headers.get("content-length") || 0);
    if (announcedLength > 2_000_000) {
      return json({ ok: false, error: "The recording page is unexpectedly large." }, 502);
    }

    const html = await response.text();
    if (html.length > 2_000_000) {
      return json({ ok: false, error: "The recording page is unexpectedly large." }, 502);
    }
    const data = readNextData(html);
    const hlsUrl = findFirst(data, "hlsUrl") || readEscapedValue(html, "hlsUrl");
    if (!hlsUrl) {
      return json({ ok: false, error: "Could not find a downloadable HLS playlist on this recording page." }, 404);
    }

    let parsedHlsUrl;
    try {
      parsedHlsUrl = new URL(hlsUrl);
    } catch {
      return json({ ok: false, error: "Kommodo returned an invalid video playlist." }, 502);
    }
    if (!isAllowedVideoHost(parsedHlsUrl)) {
      return json({ ok: false, error: "Kommodo returned an unsupported video host." }, 502);
    }

    const recordingId = parsed.pathname.split("/").filter(Boolean).at(1) || "";
    const rawTitle =
      findFirst(data, "title") ||
      findFirst(data, "name") ||
      readTitle(html) ||
      `Kommodo recording ${recordingId}`;
    const title = String(rawTitle).replace(/\s+/g, " ").trim().slice(0, 160);
    const durationSeconds =
      Number(findFirst(data, "duration")) ||
      Number(findFirst(data, "durationSeconds")) ||
      null;

    return json({
      ok: true,
      recordingId,
      title,
      durationSeconds,
      hlsUrl: parsedHlsUrl.toString()
    });
  } catch {
    return json({ ok: false, error: "The recording could not be resolved. Try a fresh public share link." }, 500);
  }
}

function isAllowedVideoHost(url) {
  const hostname = url.hostname.toLowerCase();
  return (
    url.protocol === "https:" &&
    !url.username &&
    !url.password &&
    !url.port &&
    (hostname === "komododecks.com" || hostname.endsWith(".komododecks.com"))
  );
}

function isRateLimited(request) {
  const ip = request.headers.get("cf-connecting-ip");
  if (!ip) return false;

  const now = Date.now();
  const recent = (rateBuckets.get(ip) || []).filter((timestamp) => now - timestamp < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    rateBuckets.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateBuckets.set(ip, recent);

  if (rateBuckets.size > 5000) {
    for (const [key, timestamps] of rateBuckets) {
      if (!timestamps.some((timestamp) => now - timestamp < RATE_WINDOW_MS)) rateBuckets.delete(key);
      if (rateBuckets.size <= 4000) break;
    }
  }
  return false;
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: JSON_HEADERS
  });
}

function readNextData(html) {
  const match = html.match(/<script[^>]+id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/i);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function readEscapedValue(html, key) {
  const pattern = new RegExp(`"${key}"\\s*:\\s*"([^"]+)"`);
  const match = html.match(pattern);
  if (!match) return null;
  return match[1]
    .replace(/\\u0026/g, "&")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

function readTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match) return null;
  return match[1]
    .replace(/\s+/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function findFirst(value, wantedKey) {
  const stack = [value];
  const seen = new WeakSet();

  while (stack.length) {
    const item = stack.pop();
    if (!item || typeof item !== "object") continue;
    if (seen.has(item)) continue;
    seen.add(item);

    if (Object.prototype.hasOwnProperty.call(item, wantedKey) && item[wantedKey]) {
      return item[wantedKey];
    }

    for (const child of Object.values(item)) {
      if (child && typeof child === "object") stack.push(child);
    }
  }

  return null;
}
