# Kommodo Video Downloader

An open-source Kommodo video downloader for saving authorized recordings as MP4 files from your browser.

Live site: https://kommodovideodownloader.nafran.com/

## What it does

- Accepts a Kommodo recording URL.
- Resolves the signed HLS playlist through a lightweight Cloudflare Pages Function.
- Downloads the video segments directly in the visitor's browser when Kommodo CORS allows it.
- Shows segment count, download speed, ETA, total bytes, and assembly progress.
- Transmuxes HLS MPEG-TS segments into MP4 in the browser with mux.js.
- Selects the highest-quality stream when a recording offers multiple HLS variants.
- Uses a responsive, accessible interface with clear success and error states.

## Guides and policies

The production build generates a focused resource cluster with practical guides, technical explainers, FAQ, Privacy Policy, Terms, Disclaimer, DMCA and Copyright Policy, Contact, and About pages. Every page includes a canonical URL, unique metadata, breadcrumb and page-type structured data, internal links, and sitemap coverage.

The legal pages are operational templates and general information, not legal advice. They should be reviewed by qualified counsel before being relied upon for a business or regulated workflow.

## Why there is a resolver

Kommodo recording pages do not expose browser-readable CORS headers, so client-side JavaScript cannot parse the share page directly. The Pages Function only resolves the recording page into the signed playlist URL. The actual video segment downloads are fetched from the visitor's browser, not proxied through the server.

Use this only for recordings you own or have permission to download.

## Security model

- The resolver accepts only HTTPS recording URLs on `kommodo.ai`.
- Resolved playlists must use an approved `komododecks.com` host.
- Resolver requests are rate limited and page responses have strict size limits.
- The browser converter is bundled locally and protected by a restrictive Content Security Policy.
- No API keys or service credentials are required by this project.

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
