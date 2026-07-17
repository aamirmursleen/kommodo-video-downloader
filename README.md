# Komodo Video Downloader

Open-source Komodo video downloader for saving Kommodo recordings as MP4 from a browser.

Live site: https://kommodovideodownloader.nafran.com/

## What it does

- Accepts a Kommodo recording URL.
- Resolves the signed HLS playlist through a lightweight Cloudflare Pages Function.
- Downloads the video segments directly in the visitor's browser when Kommodo CORS allows it.
- Shows segment count, download speed, ETA, total bytes, and assembly progress.
- Transmuxes HLS MPEG-TS segments into MP4 in the browser with mux.js.

## Why there is a resolver

Kommodo recording pages do not expose browser-readable CORS headers, so client-side JavaScript cannot parse the share page directly. The Pages Function only resolves the recording page into the signed playlist URL. The actual video segment downloads are fetched from the visitor's browser, not proxied through the server.

Use this only for recordings you own or have permission to download.

## Development

```bash
npm install
npm run build
npm run dev
```

## Deploy

```bash
npm run build
npm run deploy
```

The deployment target is Cloudflare Pages.

## Author

Muhammad Aamir Mursleen  
GitHub: https://github.com/aamirmursleen
