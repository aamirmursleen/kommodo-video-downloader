const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/resolve") {
      if (request.method === "OPTIONS") return new Response(null, { status: 204 });
      if (request.method !== "GET") {
        return json({ ok: false, error: "Method not allowed." }, 405);
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

    const parsed = new URL(target);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return json({ ok: false, error: "Only http and https links are supported." }, 400);
    }

    const allowedHosts = new Set(["kommodo.ai", "www.kommodo.ai"]);
    if (!allowedHosts.has(parsed.hostname)) {
      return json({ ok: false, error: "Paste a kommodo.ai recording URL." }, 400);
    }

    if (!parsed.pathname.startsWith("/recordings/")) {
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
      }
    });

    if (!response.ok) {
      return json({ ok: false, error: `Kommodo returned HTTP ${response.status}.` }, 502);
    }

    const html = await response.text();
    const data = readNextData(html);
    const hlsUrl = findFirst(data, "hlsUrl") || readEscapedValue(html, "hlsUrl");
    if (!hlsUrl) {
      return json({ ok: false, error: "Could not find a downloadable HLS playlist on this recording page." }, 404);
    }

    const recordingId = parsed.pathname.split("/").filter(Boolean).at(1) || "";
    const title =
      findFirst(data, "title") ||
      findFirst(data, "name") ||
      readTitle(html) ||
      `Kommodo recording ${recordingId}`;
    const durationSeconds =
      Number(findFirst(data, "duration")) ||
      Number(findFirst(data, "durationSeconds")) ||
      null;

    return json({
      ok: true,
      recordingId,
      title,
      durationSeconds,
      hlsUrl
    });
  } catch (error) {
    return json({ ok: false, error: error.message || "Resolver failed." }, 500);
  }
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
