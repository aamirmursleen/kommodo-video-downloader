import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import worker from "../public/_worker.js";

const originalFetch = globalThis.fetch;
const baseUrl = "https://kommodovideodownloader.nafran.com";
const recordingUrl = "https://kommodo.ai/recordings/example_123?onlyRecording=1";

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function apiRequest(target = recordingUrl, init = {}) {
  const url = new URL("/api/resolve", baseUrl);
  if (target !== null) url.searchParams.set("url", target);
  return new Request(url, init);
}

function successfulKommodoResponse(overrides = {}) {
  const data = {
    props: {
      pageProps: {
        recording: {
          hlsUrl: "https://api.prod.komododecks.com/video/example.m3u8",
          title: "  Example   recording  ",
          durationSeconds: 42,
          ...overrides
        }
      }
    }
  };
  return new Response(`<html><script id="__NEXT_DATA__" type="application/json">${JSON.stringify(data)}</script></html>`, {
    status: 200,
    headers: { "content-type": "text/html", "content-length": "500" }
  });
}

test("serves static assets through the Pages binding", async () => {
  let requestedUrl = "";
  const env = {
    ASSETS: {
      fetch(request) {
        requestedUrl = request.url;
        return new Response("home");
      }
    }
  };

  const response = await worker.fetch(new Request(baseUrl), env);

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "home");
  assert.equal(requestedUrl, `${baseUrl}/`);
});

test("rejects unsupported methods", async () => {
  const response = await worker.fetch(apiRequest(recordingUrl, { method: "POST" }), {});

  assert.equal(response.status, 405);
  assert.deepEqual(await response.json(), { ok: false, error: "Method not allowed." });
});

test("validates recording URLs before fetching", async (t) => {
  const cases = [
    [null, 400, "Missing URL."],
    ["not a url", 400, "Paste a complete Kommodo recording URL."],
    ["http://kommodo.ai/recordings/example", 400, "Use a secure https Kommodo link."],
    ["https://example.com/recordings/example", 400, "Paste a kommodo.ai recording URL."],
    ["https://user:pass@kommodo.ai/recordings/example", 400, "Paste a kommodo.ai recording URL."],
    ["https://kommodo.ai:444/recordings/example", 400, "Paste a kommodo.ai recording URL."],
    ["https://kommodo.ai/not-recordings/example", 400, "This does not look like a Kommodo recording URL."],
    [`https://kommodo.ai/recordings/${"x".repeat(2100)}`, 400, "The recording URL is too long."]
  ];

  for (const [target, expectedStatus, expectedError] of cases) {
    await t.test(expectedError, async () => {
      const response = await worker.fetch(apiRequest(target), {});
      const body = await response.json();
      assert.equal(response.status, expectedStatus);
      assert.equal(body.ok, false);
      assert.equal(body.error, expectedError);
    });
  }
});

test("resolves an approved Kommodo playlist and normalizes metadata", async () => {
  globalThis.fetch = async () => successfulKommodoResponse();

  const response = await worker.fetch(apiRequest(), {});
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.equal(body.recordingId, "example_123");
  assert.equal(body.title, "Example recording");
  assert.equal(body.durationSeconds, 42);
  assert.equal(new URL(body.hlsUrl).hostname, "api.prod.komododecks.com");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
});

test("uses safe HTML fallbacks when structured data is unavailable", async () => {
  globalThis.fetch = async () => new Response(
    '<html><head><title>Fallback &amp; title</title></head><body>{"hlsUrl":"https://recordings-prod-cdn.komododecks.com/fallback.m3u8"}</body></html>',
    { status: 200 }
  );

  const response = await worker.fetch(apiRequest(), {});
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.title, "Fallback & title");
  assert.equal(new URL(body.hlsUrl).hostname, "recordings-prod-cdn.komododecks.com");
});

test("blocks unapproved or malformed playlist hosts", async (t) => {
  await t.test("unapproved host", async () => {
    globalThis.fetch = async () => successfulKommodoResponse({ hlsUrl: "https://example.com/video.m3u8" });
    const response = await worker.fetch(apiRequest(), {});
    assert.equal(response.status, 502);
    assert.equal((await response.json()).error, "Kommodo returned an unsupported video host.");
  });

  await t.test("malformed URL", async () => {
    globalThis.fetch = async () => successfulKommodoResponse({ hlsUrl: "not a playlist URL" });
    const response = await worker.fetch(apiRequest(), {});
    assert.equal(response.status, 502);
    assert.equal((await response.json()).error, "Kommodo returned an invalid video playlist.");
  });
});

test("rejects oversized pages and missing playlists", async (t) => {
  await t.test("announced oversized page", async () => {
    globalThis.fetch = async () => new Response("small", {
      status: 200,
      headers: { "content-length": "2000001" }
    });
    const response = await worker.fetch(apiRequest(), {});
    assert.equal(response.status, 502);
    assert.equal((await response.json()).error, "The recording page is unexpectedly large.");
  });

  await t.test("missing playlist", async () => {
    globalThis.fetch = async () => new Response("<html><title>No video</title></html>", { status: 200 });
    const response = await worker.fetch(apiRequest(), {});
    assert.equal(response.status, 404);
    assert.equal((await response.json()).error, "Could not find a downloadable HLS playlist on this recording page.");
  });
});

test("returns safe upstream and network errors", async (t) => {
  await t.test("upstream status", async () => {
    globalThis.fetch = async () => new Response("unavailable", { status: 503 });
    const response = await worker.fetch(apiRequest(), {});
    assert.equal(response.status, 502);
    assert.equal((await response.json()).error, "Kommodo returned HTTP 503.");
  });

  await t.test("network failure", async () => {
    globalThis.fetch = async () => { throw new Error("private network detail"); };
    const response = await worker.fetch(apiRequest(), {});
    assert.equal(response.status, 500);
    assert.equal((await response.json()).error, "The recording could not be resolved. Try a fresh public share link.");
  });
});

test("rate limits repeated resolver calls by visitor IP", async () => {
  globalThis.fetch = async () => successfulKommodoResponse();
  let response;

  for (let index = 0; index < 31; index += 1) {
    response = await worker.fetch(apiRequest(recordingUrl, {
      headers: { "cf-connecting-ip": "203.0.113.77" }
    }), {});
  }

  assert.equal(response.status, 429);
  assert.equal((await response.json()).error, "Too many requests. Please wait a minute and try again.");
});
