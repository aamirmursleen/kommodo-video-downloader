const SITE_URL = "https://kommodovideodownloader.nafran.com";
const SITE_NAME = "Kommodo Downloader";
const AUTHOR_NAME = "Muhammad Aamir Mursleen";
const PUBLISHED_DATE = "2026-07-18";
const CONTACT_EMAIL = "mursleenaamir@gmail.com";

export const pages = [
  {
    slug: "guides",
    navTitle: "Guides",
    title: "Kommodo Download Guides and Technical Resources",
    description: "Explore practical Kommodo download guides, browser video technology explainers, troubleshooting help, recording formats, and privacy resources.",
    eyebrow: "Knowledge center",
    heading: "Save, understand, and troubleshoot your recordings.",
    intro: "Choose a practical guide, explore the technology behind browser-side MP4 creation, or solve a download problem without guesswork.",
    kind: "hub",
    body: `
      <section>
        <h2 id="start">Choose the guide that matches your goal</h2>
        <p>Start with the step-by-step instructions when you simply need an MP4. Explore the architecture, HLS, formats, and browser-processing guides when you want the technical details. If something fails, the troubleshooting guide turns each visible symptom into a practical next action.</p>
        <p>The articles describe the behavior of this open-source downloader as it exists today. They do not pretend that every recording is identical. A public share link, browser memory, the recording host, CORS permissions, and the media format can all affect the result. Each guide makes those boundaries explicit so that you can make an informed choice.</p>
        {{GUIDE_GRID}}
      </section>
      <section>
        <h2 id="organization">Learn at your own pace</h2>
        <p>The library has three layers. The first covers the user journey: finding a public link, pasting it into the downloader, reading progress, and saving the MP4. The second explains the technical path: resolving the share page, reading an HLS playlist, fetching media segments in the browser, and transmuxing compatible streams into an MP4 container. The third covers trust: privacy, responsible use, terms, copyright requests, project ownership, and contact information.</p>
        <p>Every page links to related pages rather than repeating the same generic explanation. This lets a reader move from a quick answer to deeper technical detail while keeping each article focused on one intent.</p>
      </section>
      <section>
        <h2 id="responsible-use">Use the information responsibly</h2>
        <p>Downloading technology does not create permission to copy a recording. Use the downloader only for content you created, content shared with you for download, or content you are otherwise authorized to save. Public accessibility and copyright permission are different questions. Review the <a href="/terms/">Terms of Use</a>, <a href="/disclaimer/">Disclaimer</a>, and <a href="/dmca/">DMCA and Copyright Policy</a> before relying on the service.</p>
        <p>For project updates or corrections, visit the <a href="/contact/">Contact page</a> or inspect the <a href="https://github.com/aamirmursleen/kommodo-video-downloader" target="_blank" rel="noopener noreferrer">open-source repository</a>.</p>
      </section>
    `,
    toc: [
      ["start", "Choose a guide"],
      ["organization", "How it is organized"],
      ["responsible-use", "Responsible use"]
    ],
    related: ["how-to-use", "how-it-works", "troubleshooting"]
  },
  {
    slug: "how-to-use",
    navTitle: "How to use",
    title: "How to Use the Kommodo Video Downloader",
    description: "Follow a clear step-by-step guide to paste a public Kommodo recording link, monitor browser-side progress, and save the completed video as MP4.",
    eyebrow: "Step-by-step guide",
    heading: "Download an authorized Kommodo recording in a few clear steps.",
    intro: "This guide explains what to prepare, what each progress stage means, and how to save and verify the finished MP4.",
    kind: "article",
    body: `
      <section>
        <h2 id="before">Before you begin</h2>
        <p>Confirm that the recording belongs to you or that the owner has authorized you to download it. A link that opens publicly is not automatically a license to copy, publish, or redistribute the recording. If the recording contains customer calls, internal meetings, personal information, or confidential material, follow the rules of the organization that owns it.</p>
        <p>Use a current desktop browser when possible. The downloader holds media segments in browser memory while preparing the MP4, so a long or high-resolution recording can require considerably more memory than an ordinary webpage. Close memory-heavy tabs before processing a large recording and make sure your device has enough free storage for the final file.</p>
        <div class="article-note"><strong>Best starting point:</strong> use the original public URL that begins with <code>https://kommodo.ai/recordings/</code>. Shortened URLs, private dashboard URLs, and expired links are not supported.</div>
      </section>
      <section>
        <h2 id="steps">Download the recording</h2>
        <ol class="article-steps">
          <li><strong>Open the Kommodo share page.</strong> Confirm that the recording plays or that its public page loads without requiring another person's account.</li>
          <li><strong>Copy the complete address.</strong> Keep the recording identifier and any query parameters that Kommodo included in the share URL.</li>
          <li><strong>Open the downloader.</strong> Return to the <a href="/#downloader">Kommodo Downloader hero</a>, where the link field is the first primary control.</li>
          <li><strong>Paste the link.</strong> Use the Paste button or paste manually. The field accepts secure Kommodo recording URLs and rejects unrelated hosts.</li>
          <li><strong>Select Download video.</strong> Keep the tab open. The status panel will move from resolving the recording to downloading segments and preparing the MP4.</li>
          <li><strong>Select Save MP4.</strong> When the success panel appears, choose a folder and let your browser finish saving the file.</li>
        </ol>
        <p>The tool does not ask for a Kommodo password and should never require you to paste account credentials. If a private recording needs authentication, ask the owner to provide an authorized export or a suitable public share link instead of sharing login details.</p>
      </section>
      <section>
        <h2 id="link-check">Recognize a supported Kommodo recording link</h2>
        <p>A supported address starts with <code>https://kommodo.ai/recordings/</code> and ends with the recording identifier. The link may include a query string supplied by Kommodo; keep it intact when copying. A dashboard address, editing URL, shortened redirect, or media-playlist URL is not the input this Kommodo video downloader expects. Paste the public recording page rather than attempting to locate technical media files yourself.</p>
        <p>Test the link in a private browsing window before downloading. If the page opens without another person's session, the resolver can usually inspect it. If it asks for a login, reports that the recording is unavailable, or redirects to a workspace, request a fresh authorized share link. This check separates access problems from browser-conversion problems and avoids spending time troubleshooting a recording the downloader cannot legitimately reach.</p>
        <p>Do not remove characters from the identifier, publish the URL in a support ticket, or share it with people who were not meant to view the recording. Treat a working public recording link as sensitive access information.</p>
      </section>
      <section>
        <h2 id="progress">Read the progress panel</h2>
        <p><strong>Finding your recording</strong> means the lightweight resolver is reading the public share page and locating its approved HLS playlist. <strong>Downloading your video</strong> means the visitor's browser is requesting the media segments from the Kommodo delivery host. The segment counter shows completed pieces, Downloaded shows received bytes, Speed is an average since the transfer began, and ETA estimates the remaining segment time.</p>
        <p><strong>Preparing your MP4</strong> means the browser has received the segments and is reorganizing compatible audio and video tracks into an MP4 container. This is normally a transmux operation, not a quality-reducing re-encode. Progress may appear slower near the end on recordings with many segments because the browser is assembling a large in-memory file.</p>
      </section>
      <section>
        <h2 id="verify">Save and verify the result</h2>
        <p>After saving, confirm that the file name ends in <code>.mp4</code>, the file size is plausible, and the beginning, middle, and end play correctly. Check audio sync on a section with visible speech. If the video is important, keep the original share link until verification is complete and store the MP4 according to your organization's retention and privacy rules.</p>
        <p>The browser creates a temporary Blob URL for the Save MP4 link. That URL belongs to the current tab and is released when a new download begins or the page closes. If you close the tab before saving, you must process the recording again.</p>
      </section>
      <section>
        <h2 id="large">Tips for long recordings</h2>
        <ul>
          <li>Prefer a desktop or laptop with sufficient memory and storage.</li>
          <li>Use a stable network and avoid switching Wi-Fi networks during the transfer.</li>
          <li>Keep the tab active if your browser aggressively suspends background pages.</li>
          <li>Do not start several large downloads in parallel.</li>
          <li>If a fresh public link still fails, use the <a href="/troubleshooting/">troubleshooting guide</a> to identify the stage and likely cause.</li>
        </ul>
        <p>For a deeper explanation of why the browser needs memory and how media segments become one file, read <a href="/how-it-works/">How the downloader works</a> and <a href="/hls-to-mp4/">HLS to MP4 explained</a>.</p>
      </section>
    `,
    toc: [
      ["before", "Before you begin"],
      ["steps", "Download steps"],
      ["link-check", "Supported links"],
      ["progress", "Read progress"],
      ["verify", "Verify the MP4"],
      ["large", "Long recordings"]
    ],
    related: ["troubleshooting", "how-it-works", "download-kommodo-recordings"]
  },
  {
    slug: "how-it-works",
    navTitle: "Technology",
    title: "How the Kommodo Downloader Technology Works",
    description: "Understand the complete technical architecture behind resolving Kommodo share pages, fetching HLS segments in the browser, and producing an MP4 file.",
    eyebrow: "Technical architecture",
    heading: "How the whole downloader works, from URL resolution to MP4.",
    intro: "A transparent look at the network path, HLS parsing, concurrent downloads, progress calculation, transmuxing, and browser file creation.",
    kind: "article",
    body: `
      <section>
        <h2 id="overview">The architecture at a glance</h2>
        <p>The downloader separates a small server-side discovery task from the large video transfer. That distinction is the core of the architecture. The Cloudflare Pages Worker reads an approved public Kommodo share page because the share page itself does not expose browser-readable CORS headers. It extracts a signed HLS playlist URL and returns limited metadata. The visitor's browser then requests the playlist and media segments directly from approved Kommodo delivery hosts.</p>
        <div class="tech-flow" role="img" aria-label="Kommodo share URL goes to a Cloudflare resolver, the approved playlist returns to the browser, and video segments travel from the Kommodo CDN to the browser">
          <span>Public share URL</span><i>→</i><span>Restricted resolver</span><i>→</i><span>Approved HLS URL</span><i>→</i><span>Visitor browser</span><i>↔</i><span>Kommodo CDN</span>
        </div>
        <p>This approach keeps the application simple and reduces server bandwidth. It also makes the transfer path more transparent: the resolver handles page discovery, while the browser handles the recording bytes. Cloudflare's advanced Pages mode allows a module Worker to handle the API route and forward all other requests to the static asset binding, matching the architecture described in the <a href="https://developers.cloudflare.com/pages/functions/advanced-mode/" target="_blank" rel="noopener noreferrer">Cloudflare Pages documentation</a>.</p>
      </section>
      <section>
        <h2 id="resolver">1. Validate and resolve the share page</h2>
        <p>The browser sends the pasted URL to <code>/api/resolve</code>. Before making any outbound request, the Worker checks the scheme, hostname, port, credentials, path shape, and total URL length. Only secure <code>kommodo.ai</code> recording URLs pass. The resolver is rate limited per visible visitor IP on a best-effort Worker-isolate basis and refuses unexpectedly large page responses.</p>
        <p>The Worker parses the page's structured application data, searches for the first HLS URL, and validates the result again. The playlist must use HTTPS and an approved <code>komododecks.com</code> host. The response contains the recording identifier, a length-limited title, optional duration, and the signed playlist URL. It never returns the full page HTML to the browser.</p>
        <p>This restricted allowlist is important. A general URL fetcher could become a server-side request forgery tool. Limiting both the input host and the output media host narrows the Worker to its intended purpose.</p>
      </section>
      <section>
        <h2 id="hls">2. Read the HLS playlists</h2>
        <p>HTTP Live Streaming represents a recording with text playlists and smaller media resources. Apple describes HLS as HTTP delivery that can support prerecorded content, multiple bit rates, encryption, and adaptive selection. The browser first fetches the resolved <code>.m3u8</code> playlist. If it is a master playlist containing several variants, the downloader follows the highest-bandwidth listed stream. It limits nesting depth so a malformed playlist cannot cause unbounded recursion.</p>
        <p>The media playlist contains <code>#EXTINF</code> duration entries followed by segment URLs. The parser resolves relative URLs against the playlist URL, records each duration, and calculates the estimated total. Encrypted playlists are rejected because this tool does not request keys or bypass access controls. A maximum segment count also protects the browser from accidentally attempting an unreasonable in-memory job.</p>
        <p>Read <a href="/hls-to-mp4/">HLS to MP4 explained</a> for a closer look at master playlists, media playlists, transport streams, codecs, and containers.</p>
      </section>
      <section>
        <h2 id="download">3. Download segments in the visitor's browser</h2>
        <p>The browser creates up to eight asynchronous workers. Each worker takes the next segment, requests it with the Fetch API, reads the response stream in chunks, and stores the completed segment in its original playlist position. Chunk reads update the received byte count without waiting for the whole segment. Completed segments update the progress percentage, segment count, average speed, and estimated time remaining.</p>
        <p>Cross-origin requests only work when the media host permits them. As the <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS" target="_blank" rel="noopener noreferrer">MDN CORS guide</a> explains, browsers enforce the same-origin policy unless the remote server returns appropriate access-control headers. The downloader cannot override a media host that declines browser access. Segment requests retry a limited number of times to recover from brief network errors, but repeated failures stop the job rather than creating a silently incomplete file.</p>
        <p>Because these requests originate in the visitor's browser, the Kommodo delivery host sees the visitor's network connection for the video transfer. The application server is not a video proxy.</p>
      </section>
      <section>
        <h2 id="transmux">4. Transmux compatible media into MP4</h2>
        <p>After all segments arrive, the browser passes them to the locally bundled <a href="https://github.com/videojs/mux.js" target="_blank" rel="noopener noreferrer">mux.js</a> transmuxer. Transmuxing changes the container structure while preserving compatible encoded audio and video tracks. It is different from transcoding, which decodes and re-encodes the media and can change quality, file size, and CPU cost.</p>
        <p>The transmuxer emits an MP4 initialization segment followed by media fragments. The application collects these parts in order and creates a <code>Blob</code> with the <code>video/mp4</code> MIME type. It then calls <code>URL.createObjectURL()</code> to create a temporary browser URL for the Save MP4 link. MDN documents Blob URLs as local identifiers that allow a browser to reference in-memory binary data.</p>
        <p>The implementation revokes the previous object URL before another job and when the page closes. This avoids keeping obsolete browser objects alive longer than necessary.</p>
      </section>
      <section>
        <h2 id="boundaries">Security, privacy, and practical boundaries</h2>
        <p>The public code uses a restrictive Content Security Policy, serves mux.js from the same origin, rejects unrelated resolver hosts, checks playlist hosts, limits response size and segment count, uses text-only DOM updates for remote titles, and returns generic network errors that do not expose internal details. No API key is required by the project.</p>
        <p>Browser-side processing also has limits. The current implementation keeps the segment arrays and resulting MP4 in memory, so very large recordings may exceed device or browser capacity. It supports compatible unencrypted HLS transport streams; encrypted media, unusual codecs, discontinuities, separate audio arrangements, or fragmented MP4 inputs may require a different pipeline. A successful playlist fetch does not guarantee that every media combination can be transmuxed.</p>
        <p>For operational details, see <a href="/browser-side-processing/">Browser-side processing and privacy</a>, <a href="/kommodo-recording-formats/">Recording formats and compatibility</a>, and the <a href="/troubleshooting/">troubleshooting guide</a>. The source is available for inspection in the <a href="https://github.com/aamirmursleen/kommodo-video-downloader" target="_blank" rel="noopener noreferrer">GitHub repository</a>.</p>
      </section>
    `,
    toc: [
      ["overview", "Architecture"],
      ["resolver", "URL resolver"],
      ["hls", "HLS playlists"],
      ["download", "Segment transfer"],
      ["transmux", "MP4 transmuxing"],
      ["boundaries", "Boundaries"]
    ],
    related: ["hls-to-mp4", "browser-side-processing", "kommodo-recording-formats"]
  },
  {
    slug: "hls-to-mp4",
    navTitle: "HLS to MP4",
    title: "Kommodo HLS to MP4: Playlists and Transmuxing",
    description: "Learn how the Kommodo video downloader reads HLS playlists and segments, then transmuxes compatible H.264 and AAC media into an MP4 file.",
    eyebrow: "Media technology",
    heading: "HLS to MP4, explained without the alphabet soup.",
    intro: "Understand what changes, what stays untouched, and why joining video segments is more complex than concatenating files.",
    kind: "article",
    body: `
      <section>
        <h2 id="hls-basics">What HLS actually contains</h2>
        <p>HTTP Live Streaming is a delivery system, not one single video file format. Apple designed HLS to deliver live and prerecorded media over ordinary HTTP servers and content delivery networks. A small UTF-8 playlist describes available renditions or lists a sequence of media resources. The media can be packaged as MPEG-2 transport stream segments or fragmented MP4, depending on the publisher.</p>
        <p>A URL ending in <code>.m3u8</code> usually points to a playlist. A master playlist lists alternate streams, often with bandwidth, resolution, and codec information. A media playlist lists the actual segments for one rendition and normally pairs each segment with an <code>#EXTINF</code> duration. The downloader must understand which kind of playlist it received before it can fetch the video.</p>
        <p>The <a href="https://developer.apple.com/documentation/HTTP-Live-Streaming" target="_blank" rel="noopener noreferrer">Apple HLS overview</a> is the authoritative starting point for the protocol. This downloader implements only the subset required by the compatible Kommodo recordings it has been designed to process.</p>
      </section>
      <section>
        <h2 id="selection">Master playlist and quality selection</h2>
        <p>When a master playlist offers several variants, a player normally adapts between them as network conditions change. A downloader has a different goal: it needs a stable set of segments that can become one file. The current browser tool reads the listed bandwidth value and selects the highest-bandwidth variant. It then follows that variant until it reaches a media playlist.</p>
        <p>Highest bandwidth is a practical approximation for highest quality, not a mathematical guarantee. A publisher can label variants imperfectly, use different codecs, or offer separate audio groups. Resolution, frame rate, codec efficiency, and source quality also matter. The tool does not combine independent video and audio rendition groups; recordings that use a more complex arrangement may need an export supplied by the platform.</p>
        <div class="article-note"><strong>Quality rule:</strong> transmuxing cannot add detail that is absent from the selected stream. It preserves a compatible representation rather than enhancing it.</div>
      </section>
      <section>
        <h2 id="segments">Why segments cannot always be joined blindly</h2>
        <p>Transport stream segments contain timing information, encoded audio and video packets, and metadata needed to preserve continuity. Simple byte concatenation sometimes creates a playable transport stream, but it does not create a standards-compliant MP4. MP4 uses boxes and sample tables that describe track timing, byte ranges, codec configuration, and media fragments.</p>
        <p>A transmuxer parses the transport packets, reconstructs track information, creates an MP4 initialization segment, and emits media fragments in the correct order. Timestamps must remain coherent. Discontinuities, missing segments, codec changes, or malformed packet boundaries can make the result fail even when most of the bytes downloaded successfully.</p>
        <p>This project uses <a href="https://github.com/videojs/mux.js" target="_blank" rel="noopener noreferrer">mux.js</a>, an open-source media transmuxing library. It is bundled locally with the website so the conversion dependency does not need to execute from a third-party CDN.</p>
      </section>
      <section>
        <h2 id="container-codec">Container versus codec</h2>
        <p>A container organizes tracks; a codec defines how audio or video is encoded. MP4 is a container. H.264 is a video codec, and AAC is an audio codec. MPEG-2 transport stream is another container commonly used for segmented delivery. Moving H.264 and AAC from transport stream packaging into MP4 packaging can be done without decoding the underlying pictures and sound.</p>
        <p>That operation is transmuxing. It is typically faster and avoids generation loss because the encoded samples remain intact. Transcoding is different: it decodes the samples and encodes them again, which is necessary when the destination cannot accept the original codec or when resolution, bitrate, or compression must change. This downloader is a transmuxer, not a general-purpose transcoder.</p>
        <p>Read <a href="/kommodo-recording-formats/">Kommodo recording formats and compatibility</a> for a practical table of formats, expected behavior, and limitations.</p>
      </section>
      <section>
        <h2 id="blob">Create the downloadable browser file</h2>
        <p>After mux.js emits MP4 parts, JavaScript creates one Blob representing the completed file. A Blob is immutable binary data managed by the browser. The application creates a temporary Blob URL and assigns it to a normal download link. Selecting Save MP4 asks the browser to persist those in-memory bytes to local storage.</p>
        <p>The process explains both the privacy advantage and the memory limitation. The video does not need to be uploaded to an application conversion server, but the browser must retain enough data to assemble the result. The Blob URL is temporary and tied to the page lifecycle; it is not a permanent public address.</p>
      </section>
      <section>
        <h2 id="unsupported">Cases that need a different workflow</h2>
        <ul>
          <li><strong>Encrypted HLS:</strong> this tool intentionally rejects playlists with media key declarations.</li>
          <li><strong>Unsupported codecs:</strong> MP4 packaging cannot make an incompatible codec universally playable.</li>
          <li><strong>Separate audio groups:</strong> a complex master playlist may require explicit track selection and muxing logic.</li>
          <li><strong>Very large recordings:</strong> browser memory can become the limiting resource.</li>
          <li><strong>Expired signed URLs:</strong> the playlist or segments may return an authorization error after the link expires.</li>
          <li><strong>Fragmented MP4 input:</strong> the MPEG-TS transmux path is not a general merger for every HLS segment format.</li>
        </ul>
        <p>If you are unsure which case applies, start with the <a href="/troubleshooting/">download troubleshooting checklist</a> and note the exact stage at which the status panel stops.</p>
      </section>
    `,
    toc: [
      ["hls-basics", "HLS basics"],
      ["selection", "Quality selection"],
      ["segments", "Media segments"],
      ["container-codec", "Container vs codec"],
      ["blob", "Browser file"],
      ["unsupported", "Unsupported cases"]
    ],
    related: ["how-it-works", "kommodo-recording-formats", "browser-side-processing"]
  },
  {
    slug: "browser-side-processing",
    navTitle: "Browser processing",
    title: "Kommodo Video Downloader: Browser Processing and Privacy",
    description: "See how the Kommodo video downloader processes media in your browser, which limited task uses Cloudflare, and where privacy boundaries remain.",
    eyebrow: "Privacy architecture",
    heading: "What browser-side processing means—and what it does not mean.",
    intro: "A precise map of where the share URL, playlists, segments, metadata, and finished MP4 travel during a download.",
    kind: "article",
    body: `
      <section>
        <h2 id="meaning">The practical meaning of browser-side</h2>
        <p>Browser-side processing means the visitor's browser performs the large media requests and MP4 assembly. It does not mean that the entire workflow is offline or that no third party receives network information. The browser still connects to the website, the resolver, and Kommodo's approved media hosts. Each party can receive ordinary technical information needed to serve those requests.</p>
        <p>The important architectural distinction is that this application's server does not relay the video segments. After the resolver returns an approved playlist URL, the browser uses the Fetch API to request the playlist and segments directly from Kommodo's delivery infrastructure. The bytes then remain in browser-managed memory until the MP4 is saved or the page is closed.</p>
      </section>
      <section>
        <h2 id="data-flow">The data flow, item by item</h2>
        <div class="table-scroll"><table class="data-table">
          <caption>Downloader data flow</caption>
          <thead><tr><th scope="col">Data</th><th scope="col">Where it goes</th><th scope="col">Why</th></tr></thead>
          <tbody>
            <tr><td>Public recording URL</td><td>Cloudflare resolver and Kommodo page</td><td>Locate the approved HLS playlist</td></tr>
            <tr><td>Playlist and segments</td><td>Kommodo hosts to visitor browser</td><td>Receive the recording data</td></tr>
            <tr><td>Recording title</td><td>Resolver response and browser UI</td><td>Create a useful file name</td></tr>
            <tr><td>MP4 Blob</td><td>Visitor browser memory</td><td>Prepare the local save action</td></tr>
            <tr><td>Contact email</td><td>Email provider, only if you contact us</td><td>Reply to support or legal requests</td></tr>
          </tbody>
        </table></div>
        <p>The application has no user account system and does not intentionally place analytics cookies or advertising cookies. Cloudflare and other network providers may still process IP address, user agent, timestamps, request paths, and security signals as part of delivery, abuse prevention, and routine logs. Because the resolver request contains the share URL, avoid using links you are not permitted to submit.</p>
      </section>
      <section>
        <h2 id="cors">Why CORS controls the browser transfer</h2>
        <p>Browsers apply the same-origin policy to scripts. A script loaded from this site cannot freely read a response from another domain. Cross-Origin Resource Sharing lets the remote server opt in by returning access-control response headers. MDN describes CORS as the HTTP-header mechanism through which a server identifies permitted origins.</p>
        <p>The Kommodo share page does not provide the browser access needed for this tool to parse its HTML directly, which is why the restricted resolver exists. Compatible playlist and segment hosts do provide browser-readable responses. If those headers change, the browser may block the transfer even if the recording still plays inside Kommodo's own interface. The downloader does not and cannot disable browser security.</p>
        <p>More detail is available in the <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS" target="_blank" rel="noopener noreferrer">MDN CORS documentation</a> and the project's <a href="/how-it-works/">technical architecture guide</a>.</p>
      </section>
      <section>
        <h2 id="memory">Memory, temporary URLs, and device limits</h2>
        <p>The current implementation stores downloaded segment buffers, transmuxed MP4 parts, and the final Blob in browser memory. The exact peak is larger than the final file because intermediate representations can overlap. Browser and operating-system limits vary, so there is no universal maximum recording size.</p>
        <p>A Blob URL is a local browser reference, not an uploaded web address. The application revokes it when a new job resets the state and again when the page closes. Your browser may also release related memory after navigation or process cleanup. Until you choose Save MP4, the result is not safely stored as a normal file.</p>
      </section>
      <section>
        <h2 id="controls">Security controls in the open-source implementation</h2>
        <ul>
          <li>The resolver accepts only secure Kommodo recording URLs with a strict path shape.</li>
          <li>Returned HLS URLs must use approved Komododecks hosts and HTTPS.</li>
          <li>Remote titles are displayed with <code>textContent</code>, not interpreted as HTML.</li>
          <li>Page and segment counts have safety limits, and failed segments receive bounded retries.</li>
          <li>The media library is bundled on the same origin and the Content Security Policy restricts scripts to the site.</li>
          <li>API errors avoid returning network exception details that could expose implementation information.</li>
        </ul>
        <p>These controls reduce risk; they do not promise absolute security or privacy. Review the <a href="/privacy-policy/">Privacy Policy</a> for the operational policy and the <a href="https://github.com/aamirmursleen/kommodo-video-downloader" target="_blank" rel="noopener noreferrer">source code</a> for the exact implementation.</p>
      </section>
      <section>
        <h2 id="privacy-checklist">Privacy checklist before processing a recording</h2>
        <p>Decide whether browser-side processing is appropriate before pasting the share URL. Confirm that the recording owner permits a local copy, that the device is trusted, and that the destination folder follows your organization's access and retention rules. Close screen-sharing software if the recording title or progress should not be visible, and avoid public or managed computers where browser downloads may be inspected by another administrator.</p>
        <p>The finished MP4 can be more portable—and therefore easier to redistribute—than the original share page. Protect it with the same care as the underlying meeting. Use device encryption when available, restrict synchronized folders, and delete temporary or duplicate copies according to policy. For highly confidential, regulated, private, or exceptionally large recordings, an official export managed by the recording owner may provide a more appropriate audit trail than a public-link workflow.</p>
      </section>
      <section>
        <h2 id="choices">Your choices</h2>
        <p>You can use the project locally from its source code, avoid contacting support, close the page to release its temporary in-memory result, and refrain from submitting a share URL. You can also ask a recording owner for an official platform export when browser processing is unsuitable for the sensitivity or size of a recording.</p>
        <p>For common failure symptoms related to CORS, expired signatures, memory pressure, or unsupported media, continue to <a href="/troubleshooting/">Troubleshooting Kommodo downloads</a>.</p>
      </section>
    `,
    toc: [
      ["meaning", "What browser-side means"],
      ["data-flow", "Data flow"],
      ["cors", "CORS"],
      ["memory", "Memory and Blob URLs"],
      ["controls", "Security controls"],
      ["privacy-checklist", "Privacy checklist"],
      ["choices", "Your choices"]
    ],
    related: ["privacy-policy", "how-it-works", "troubleshooting"]
  },
  {
    slug: "troubleshooting",
    navTitle: "Troubleshooting",
    title: "Troubleshooting Kommodo Recording Downloads",
    description: "Diagnose invalid links, expired recordings, CORS failures, stalled segments, browser memory limits, MP4 conversion errors, and save problems.",
    eyebrow: "Problem solving",
    heading: "Find the failed stage, then fix the right problem.",
    intro: "Use the status panel and technical details to separate link, playlist, network, memory, conversion, and browser-save failures.",
    kind: "article",
    body: `
      <section>
        <h2 id="first-checks">Begin with five quick checks</h2>
        <ol>
          <li>Open the recording link in a new private window and confirm that the public page loads.</li>
          <li>Make sure the hostname is <code>kommodo.ai</code> and the path begins with <code>/recordings/</code>.</li>
          <li>Copy a fresh link from Kommodo if the original may be old or truncated.</li>
          <li>Use a current desktop browser and close memory-heavy tabs.</li>
          <li>Try the download once more on a stable network without a VPN or filtering extension that might block media hosts.</li>
        </ol>
        <p>Do not publish the recording URL in a support issue. Share links can grant access to the recording. When reporting a bug, provide the visible error stage, browser name and version, approximate recording duration, and whether the public page opens—without including the recording identifier.</p>
      </section>
      <section>
        <h2 id="resolve-errors">The failure occurs while finding the recording</h2>
        <p><strong>Paste a Kommodo recording link from kommodo.ai</strong> means the URL points to another hostname. Return to the public recording page rather than a dashboard, redirect service, or copied text that contains extra punctuation. <strong>This does not look like a Kommodo recording link</strong> means the path shape is wrong or the recording identifier is missing.</p>
        <p><strong>Could not find a downloadable HLS playlist</strong> usually means the public page structure changed, the recording does not expose a compatible playlist, or access is restricted. <strong>Kommodo returned HTTP 404</strong> can indicate a deleted or mistyped recording. An authorization status can indicate an expired or private link. Create a new authorized share link before investigating the media stage.</p>
        <p><strong>Unsupported video host</strong> is a security boundary. The resolver found a URL outside its approved Komododecks host family and refused to return it. Do not try to bypass that check; report the behavior through the <a href="/contact/">Contact page</a> so the host change can be reviewed safely.</p>
      </section>
      <section>
        <h2 id="playlist-errors">The failure occurs while reading the playlist</h2>
        <p>A playlist HTTP error can mean the signed URL expired between resolution and download, the media host is temporarily unavailable, or a network product blocked the request. Refresh the public link and retry. If the problem is consistent across browsers and networks, the recording host may have changed its access policy.</p>
        <p><strong>The resolved file is not an HLS playlist</strong> means the response did not begin with the expected HLS marker. An intermediary may have returned an error page instead of media. <strong>This recording is encrypted</strong> is intentional: the tool will not request encryption keys or work around protected delivery.</p>
        <p>CORS errors appear when the browser is not permitted to read the remote response. Extensions, enterprise policies, and remote response headers can affect the result. The <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors" target="_blank" rel="noopener noreferrer">MDN CORS error guide</a> explains why JavaScript often receives only a general failure message.</p>
      </section>
      <section>
        <h2 id="segment-errors">Segments stall, retry, or fail</h2>
        <p>The technical details panel records bounded segment retries. One retry can be a harmless network interruption. Repeated failure at the same segment suggests an expired signed resource or a missing object. Failures scattered across different segments suggest network instability, filtering, or temporary CDN errors.</p>
        <p>Average speed begins low and stabilizes as more bytes arrive. ETA is based on completed segments rather than exact remaining bytes, so segments of uneven size can make it move up or down. A background tab may slow when the browser applies power-saving policies. Keep the tab visible and the device awake during a long transfer.</p>
        <p>If the connection changed during a download, start over with a fresh link. The current tool does not persist partial segments or resume an interrupted job.</p>
      </section>
      <section>
        <h2 id="memory-errors">The tab becomes slow or closes</h2>
        <p>Browser assembly is memory intensive. Downloaded segment arrays, MP4 fragments, and the final Blob can exist at the same time. A one-gigabyte final file can therefore require substantially more than one gigabyte of available memory. Mobile browsers and low-memory devices may close the tab without a detailed application error.</p>
        <p>Close other tabs and applications, restart the browser, and use a desktop with more memory. Process one recording at a time. If the same long recording repeatedly exhausts the browser, request an official export or use an authorized desktop media workflow designed to write incrementally to disk.</p>
      </section>
      <section>
        <h2 id="conversion-errors">The MP4 converter fails</h2>
        <p><strong>The MP4 converter did not load</strong> can indicate that a security extension blocked the local script or that the build is incomplete. Refresh the site and confirm that other static assets load. <strong>The browser could not convert this HLS stream into MP4</strong> means the transmuxer produced no compatible output.</p>
        <p>Possible causes include unsupported codecs, fragmented MP4 segments instead of transport streams, separate audio renditions, timestamp discontinuities, or damaged media. Review <a href="/kommodo-recording-formats/">recording format compatibility</a> and <a href="/hls-to-mp4/">how HLS transmuxing works</a>. The downloader does not re-encode unsupported media.</p>
      </section>
      <section>
        <h2 id="save-errors">The MP4 is ready but does not save</h2>
        <p>Check whether the browser blocked automatic downloads, whether the chosen folder has enough storage, and whether a security product quarantined the file. Select Save MP4 again before closing the page. A Blob URL is temporary; reopening it in a different browser session will not work.</p>
        <p>After saving, test the beginning, middle, and end. If only part of the recording plays, do not treat the file as a successful archive. Repeat with a fresh link and stable network, or obtain an official export from the owner.</p>
      </section>
    `,
    toc: [
      ["first-checks", "Quick checks"],
      ["resolve-errors", "Resolver errors"],
      ["playlist-errors", "Playlist errors"],
      ["segment-errors", "Segment failures"],
      ["memory-errors", "Memory problems"],
      ["conversion-errors", "Conversion errors"],
      ["save-errors", "Save problems"]
    ],
    related: ["how-to-use", "kommodo-recording-formats", "contact"]
  },
  {
    slug: "download-kommodo-recordings",
    navTitle: "Download guide",
    title: "How to Download Kommodo Recordings Responsibly",
    description: "Learn how to identify an authorized Kommodo share link, download the recording as MP4, organize the file, and respect privacy and copyright.",
    eyebrow: "Practical guide",
    heading: "Save the recording you are allowed to keep—and handle it carefully.",
    intro: "A responsible workflow for meeting owners, clients, collaborators, and teams that need a local copy of an authorized Kommodo recording.",
    kind: "article",
    body: `
      <section>
        <h2 id="permission">Start with permission, not the download button</h2>
        <p>Before copying a recording, identify who created it, who appears in it, and what rules apply. The recording owner may have shared a link for viewing only. Employment agreements, client contracts, meeting notices, confidentiality terms, privacy laws, and platform terms can all affect whether you may download, retain, edit, or redistribute the file.</p>
        <p>A public URL is a technical access method, not proof of copyright permission. Download when you created the recording, the owner explicitly approved the copy, the organization requires an archive, or another lawful basis clearly applies. When in doubt, ask the owner for written permission or an official export.</p>
        <div class="article-note"><strong>Responsible-use rule:</strong> do not use this tool to bypass authentication, encryption, paywalls, access controls, or a clear instruction not to copy the recording.</div>
      </section>
      <section>
        <h2 id="link">Identify the correct share link</h2>
        <p>The supported link uses HTTPS, the <code>kommodo.ai</code> hostname, and a path that begins with <code>/recordings/</code>. Copy the URL from the public recording page or from a share action supplied by the owner. Do not paste a workspace dashboard URL, a browser-history redirect, or a link shortened by an unknown service.</p>
        <p>Open the link in a private browsing window. If it requires someone else's account, stop. The downloader does not accept credentials and is not intended to turn private dashboard access into a public export. Ask the owner for the correct authorized method.</p>
      </section>
      <section>
        <h2 id="download">Process the recording in the browser</h2>
        <p>Paste the link into the main downloader field and select Download video. The restricted resolver locates an approved media playlist, then the browser requests the recording segments directly. Keep the page open while the progress panel shows the received size, average speed, completed segments, and estimated time.</p>
        <p>When the browser finishes transmuxing compatible media, select Save MP4. Choose a file name that includes a useful project or meeting identifier and a date without exposing sensitive participant data. The detailed <a href="/how-to-use/">how-to-use guide</a> explains each interface stage.</p>
      </section>
      <section>
        <h2 id="verify">Verify before deleting or sharing anything</h2>
        <p>Open the saved MP4 in a trusted player. Check the first minute, a point near the middle, and the final minute. Confirm that audio is present, speech stays synchronized, and the duration matches the original. If the recording is an important record, calculate and store a checksum according to your organization's archive process.</p>
        <p>Do not delete the source or tell colleagues that the archive is complete until the MP4 has been verified. If playback stops early or the duration is wrong, repeat with a fresh share link and stable network. See <a href="/troubleshooting/">Troubleshooting Kommodo recording downloads</a> for failure-specific help.</p>
      </section>
      <section>
        <h2 id="permission-record">Keep a simple permission and provenance record</h2>
        <p>When a Kommodo recording supports client work, research, compliance, or an internal decision, record why the local copy was created. Note the recording owner, the person who approved the download, the approval date, the authorized purpose, the intended storage location, and the retention deadline. Keep that note beside the MP4 or in the organization’s records system without exposing the public share link.</p>
        <p>This small provenance record helps future reviewers understand where the file came from and whether it may be reused. It is especially valuable when filenames change, staff members leave, or the original recording page expires. A download log does not replace legal consent or organizational policy, but it reduces ambiguity and discourages the MP4 from becoming an unexplained copy that remains accessible indefinitely.</p>
      </section>
      <section>
        <h2 id="storage">Store and name the file safely</h2>
        <p>Recordings often contain more sensitive information than their title suggests. Store the MP4 in an access-controlled folder, encrypt devices where appropriate, follow retention schedules, and avoid consumer file-sharing links unless the owner has approved them. Limit access to people who need the recording for the authorized purpose.</p>
        <p>A practical name can use <code>YYYY-MM-DD-project-topic.mp4</code>. Avoid including email addresses, health information, financial information, or other private details in the file name because names can appear in backups, search indexes, and sync logs.</p>
      </section>
      <section>
        <h2 id="reuse">Editing, publishing, and redistribution</h2>
        <p>Permission to retain a meeting copy does not automatically include permission to publish clips, train a model, create promotional material, or distribute the file. Obtain the rights needed for the next use. Consider participant consent, confidential screens, third-party music or images, and personal data before editing or sharing.</p>
        <p>For the site's operational boundaries, read the <a href="/terms/">Terms of Use</a>, <a href="/disclaimer/">Disclaimer</a>, <a href="/privacy-policy/">Privacy Policy</a>, and <a href="/dmca/">DMCA and Copyright Policy</a>. These pages are general information and are not a substitute for advice from a qualified professional.</p>
      </section>
      <section>
        <h2 id="alternatives">When to use another method</h2>
        <p>Use an official platform export when a recording is private, encrypted, exceptionally large, legally sensitive, or incompatible with browser transmuxing. An official export may preserve metadata, captions, multiple audio tracks, or platform-specific information that a browser MP4 workflow does not retain.</p>
        <p>Use this tool when you have a supported public share link, clear permission, a compatible browser, and a straightforward need for an MP4 copy. The <a href="/how-it-works/">technical architecture</a> explains exactly what the tool can and cannot do.</p>
      </section>
    `,
    toc: [
      ["permission", "Permission"],
      ["link", "Correct share link"],
      ["download", "Browser download"],
      ["verify", "Verify the file"],
      ["permission-record", "Permission record"],
      ["storage", "Safe storage"],
      ["reuse", "Reuse and sharing"],
      ["alternatives", "Alternatives"]
    ],
    related: ["how-to-use", "privacy-policy", "terms"]
  },
  {
    slug: "kommodo-recording-formats",
    navTitle: "Formats",
    title: "Kommodo Recording Formats and MP4 Compatibility",
    description: "Understand HLS, M3U8, MPEG-TS, MP4, H.264, AAC, transmuxing, browser compatibility, and the media cases this downloader cannot process.",
    eyebrow: "Compatibility guide",
    heading: "Containers, codecs, playlists, and what the browser can save.",
    intro: "A practical format guide for understanding why one recording converts cleanly while another needs an official export or different media workflow.",
    kind: "article",
    body: `
      <section>
        <h2 id="layers">Four different layers people call a video format</h2>
        <p>Video discussions often use the word format for several different things. A delivery protocol moves media across a network. A playlist describes streams and segments. A container organizes tracks and timing. A codec compresses the pictures or sound. Identifying the layer prevents confusion when diagnosing compatibility.</p>
        <div class="table-scroll"><table class="data-table">
          <caption>Media layers and examples</caption>
          <thead><tr><th scope="col">Layer</th><th scope="col">Example</th><th scope="col">Purpose</th></tr></thead>
          <tbody>
            <tr><td>Delivery</td><td>HLS</td><td>Move adaptive media over HTTP</td></tr>
            <tr><td>Playlist</td><td>M3U8</td><td>List variants or media segments</td></tr>
            <tr><td>Container</td><td>MPEG-TS or MP4</td><td>Organize encoded tracks and timing</td></tr>
            <tr><td>Codec</td><td>H.264 or AAC</td><td>Compress video or audio samples</td></tr>
          </tbody>
        </table></div>
        <p>The downloader receives an HLS playlist, reads media packaged in compatible transport streams, and writes compatible encoded tracks into an MP4 container.</p>
      </section>
      <section>
        <h2 id="hls">HLS and M3U8</h2>
        <p>HLS is designed for streaming. A master M3U8 playlist can offer several quality levels. A media playlist lists the small resources that make up one timeline. Apple notes that HLS can support live and prerecorded content, alternate bit rates, encryption, and authentication. Those capabilities mean that not every HLS presentation is a simple sequence this tool can download.</p>
        <p>The downloader follows a limited number of master-playlist levels and selects the highest listed bandwidth. It reads <code>#EXTINF</code> durations and resolves relative segment URLs. It rejects playlists that declare encryption keys. It does not attempt digital-rights-management workarounds or credential injection.</p>
      </section>
      <section>
        <h2 id="transport-stream">MPEG-TS segments</h2>
        <p>MPEG-2 transport stream was designed to carry synchronized media in environments where independent packets and resilience matter. In HLS, a recording can be split into many <code>.ts</code> resources. Each segment contains packets belonging to audio, video, and supporting tables. The downloader preserves playlist order even though it requests several segments concurrently.</p>
        <p>Compatible transport streams commonly carry H.264 video and AAC audio. mux.js can parse the transport packets and emit MP4 initialization information and media fragments. If segments are corrupt, use unsupported stream types, or change configuration mid-recording, the transmuxer may fail.</p>
      </section>
      <section>
        <h2 id="mp4">MP4, H.264, and AAC</h2>
        <p>MP4 is a widely supported container, not a codec. H.264 video and AAC audio are commonly accepted inside MP4 and play across many browsers, operating systems, editors, and presentation tools. When those codecs already exist in the transport stream, the downloader can repackage the samples without re-encoding them.</p>
        <p>The output normally preserves the selected stream's resolution, encoded quality, frame rate, and audio characteristics. It does not upscale, denoise, compress to a new bitrate, or repair poor source quality. File size is therefore closely related to the bytes in the chosen HLS rendition plus MP4 packaging overhead.</p>
      </section>
      <section>
        <h2 id="matrix">Practical compatibility matrix</h2>
        <div class="table-scroll"><table class="data-table compatibility-table">
          <caption>Downloader compatibility matrix</caption>
          <thead><tr><th scope="col">Media case</th><th scope="col">Expected result</th><th scope="col">Reason</th></tr></thead>
          <tbody>
            <tr><td>Unencrypted HLS with H.264 and AAC in TS</td><td>Usually supported</td><td>Matches the mux.js transmux path</td></tr>
            <tr><td>Master playlist with simple variants</td><td>Supported</td><td>Highest bandwidth variant is selected</td></tr>
            <tr><td>Encrypted playlist</td><td>Rejected</td><td>Tool does not retrieve media keys</td></tr>
            <tr><td>Separate alternate audio groups</td><td>May be unsupported</td><td>Requires explicit multi-track selection</td></tr>
            <tr><td>Fragmented MP4 HLS segments</td><td>May be unsupported</td><td>Current pipeline targets transport streams</td></tr>
            <tr><td>Unusual or incompatible codec</td><td>Unsupported</td><td>Transmuxing does not transcode codecs</td></tr>
            <tr><td>Extremely large recording</td><td>Device dependent</td><td>Assembly requires browser memory</td></tr>
          </tbody>
        </table></div>
      </section>
      <section>
        <h2 id="preflight">Run a compatibility preflight</h2>
        <p>You do not need to inspect raw media files before every download. Start with observable signals. Confirm that the public Kommodo recording page loads, note its approximate duration, use a current desktop browser, and leave enough free memory and storage for a file that may be large. A short recording that reaches the MP4 preparation stage is a useful test of the same browser and network before attempting an hour-long session.</p>
        <p>Pay attention to the stage where the downloader stops. Failure while resolving the page suggests an invalid, private, or expired link. Failure while reading the playlist can indicate an unsupported HLS structure or browser access restriction. Repeated segment errors point to the network or media host. Failure after all segments arrive more often indicates a codec, container, timestamp, or memory limitation. These clues are more reliable than guessing from a file extension.</p>
        <p>If the recording contains separate audio tracks, captions, chapters, encryption, or compliance metadata that must be retained, request an official Kommodo export. A basic MP4 is intended for compatible audio and video playback, not complete platform preservation.</p>
      </section>
      <section>
        <h2 id="metadata">Metadata that may not survive</h2>
        <p>The output focuses on playable audio and video. Platform comments, analytics, chapters, transcripts, captions, speaker labels, thumbnails, multiple audio languages, and share-page metadata may not be embedded in the resulting MP4. A title is used to suggest a file name, but that is not the same as preserving the platform's full record.</p>
        <p>If you need captions, compliance metadata, or multiple tracks, ask for an official export. Keep related text files and permissions records beside the MP4 according to your archive policy.</p>
      </section>
      <section>
        <h2 id="diagnose">How to diagnose a format problem</h2>
        <p>Use the stage that fails. An encrypted-playlist message identifies protection immediately. A failure after all segments download points more strongly to container, codec, timestamps, or memory. A failure before segment discovery points to the link or playlist structure. Do not infer the codec from the file extension alone.</p>
        <p>Continue with <a href="/hls-to-mp4/">HLS to MP4 explained</a> for the media pipeline or <a href="/troubleshooting/">Troubleshooting Kommodo downloads</a> for symptom-based actions.</p>
      </section>
    `,
    toc: [
      ["layers", "Media layers"],
      ["hls", "HLS and M3U8"],
      ["transport-stream", "MPEG-TS"],
      ["mp4", "MP4 and codecs"],
      ["matrix", "Compatibility matrix"],
      ["preflight", "Compatibility preflight"],
      ["metadata", "Metadata"],
      ["diagnose", "Diagnosis"]
    ],
    related: ["hls-to-mp4", "troubleshooting", "how-it-works"]
  },
  {
    slug: "faq",
    navTitle: "FAQ",
    title: "Kommodo Video Downloader Frequently Asked Questions",
    description: "Get clear answers about supported Kommodo links, MP4 output, browser processing, privacy, recording quality, large files, errors, and authorized use.",
    eyebrow: "Frequently asked questions",
    heading: "Clear answers before you start a download.",
    intro: "The fastest way to understand supported links, privacy, output quality, browser limits, common errors, and responsible use.",
    kind: "faq",
    faqs: [
      ["Which Kommodo links are supported?", "The downloader accepts secure public URLs on kommodo.ai with a /recordings/ path and a recording identifier. Workspace dashboard URLs, unrelated hosts, shortened redirects, and links that require another person's account are not supported."],
      ["Does the downloader upload my video to its server?", "The application server resolves the public share page to an approved HLS playlist. Compatible playlists and video segments then travel directly from Kommodo delivery hosts to your browser. The application server is not a video-segment proxy."],
      ["Why is a resolver needed at all?", "The public share page does not provide the cross-origin response headers needed for browser JavaScript to read its HTML. A restricted Cloudflare Worker validates the Kommodo URL, reads that page, extracts an approved playlist URL, and returns limited metadata."],
      ["Will the MP4 have the same quality?", "The tool selects the highest listed bandwidth in a simple master playlist and transmuxes compatible tracks without re-encoding. It cannot improve the source, and highest bandwidth is not a guarantee of highest perceptual quality."],
      ["Does it work on phones and tablets?", "The interface is responsive, but long or high-resolution recordings may exceed mobile browser memory. A current desktop browser is the safer choice for large files."],
      ["Why did a private or expired recording fail?", "The downloader does not accept login credentials or bypass access controls. Ask the owner for an authorized public share link or official export. Signed playlists can also expire, so retry with a fresh link."],
      ["What does browser-side processing mean?", "Your browser fetches compatible video segments, stores them temporarily in memory, transmuxes the media into MP4, and creates a local Blob URL for the save action. Network providers and Kommodo still receive ordinary request information."],
      ["Can I close the page and return to the finished file?", "No. The generated Blob URL is temporary and belongs to the current page. Save the MP4 before closing or refreshing. The current implementation does not persist partial downloads."],
      ["Is encrypted HLS supported?", "No. The parser rejects playlists that declare encryption keys. The tool is not designed to retrieve keys, bypass authentication, or defeat digital access controls."],
      ["Why can conversion fail after every segment downloads?", "The media may use an unsupported codec, fragmented MP4 segments, separate audio groups, timestamp discontinuities, or more memory than the browser can provide. Transmuxing is not general transcoding."],
      ["Is the project affiliated with Kommodo?", "No. Kommodo Downloader is an independent open-source Nafran project. Kommodo and related names belong to their respective owners, and references identify compatibility only."],
      ["May I download any recording with a public URL?", "No. Technical access does not create copyright or privacy permission. Download only recordings you own or are authorized to save, and obtain any permission needed before editing, publishing, or redistributing them."],
      ["Is the downloader free and open source?", "Yes. The public website does not charge a usage fee, and the source is published under the MIT license. Availability and behavior are provided without a guarantee."],
      ["How should I report a problem?", "Use the Contact page or GitHub issues. Include the error stage, browser version, approximate duration, and steps to reproduce. Do not publish a private recording URL, personal data, or confidential media." ]
    ],
    body: `
      <section>
        <h2 id="answers">Downloader questions and answers</h2>
        <p>These answers describe the current public implementation. Browser behavior, Kommodo delivery settings, signed URLs, and media formats can change, so use the technical details panel and linked guides when a general answer does not match a specific recording.</p>
        {{FAQ_LIST}}
      </section>
      <section>
        <h2 id="next">Where to go next</h2>
        <p>For a first download, read <a href="/how-to-use/">How to use the Kommodo Video Downloader</a>. For engineering detail, read <a href="/how-it-works/">How the technology works</a> and <a href="/hls-to-mp4/">HLS to MP4 explained</a>. If a job fails, use the <a href="/troubleshooting/">troubleshooting guide</a>.</p>
        <p>Questions about data handling, authorized use, or copyright belong in the <a href="/privacy-policy/">Privacy Policy</a>, <a href="/terms/">Terms</a>, and <a href="/dmca/">DMCA and Copyright Policy</a>.</p>
      </section>
    `,
    toc: [
      ["answers", "Questions and answers"],
      ["next", "Next resources"]
    ],
    related: ["how-to-use", "troubleshooting", "privacy-policy"]
  },
  {
    slug: "privacy-policy",
    navTitle: "Privacy",
    title: "Privacy Policy for Kommodo Video Downloader",
    description: "Learn what the Kommodo Video Downloader processes, how browser-side media transfer works, what infrastructure logs may contain, and your choices.",
    eyebrow: "Privacy policy",
    heading: "A plain-language account of what the service processes.",
    intro: "Effective July 18, 2026. This policy covers the public downloader website and its restricted recording-link resolver.",
    kind: "legal",
    body: `
      <section>
        <h2 id="scope">Scope and service operator</h2>
        <p>This Privacy Policy applies to ${SITE_NAME}, an independent open-source project published by Nafran and ${AUTHOR_NAME}. It covers the website at ${SITE_URL}, the same-origin resolver endpoint, and messages sent to the published contact email. It does not cover Kommodo, GitHub, Cloudflare, your browser, your internet provider, or any other third-party service.</p>
        <p>The downloader has no user account system, payment form, advertising network, or application database for customer profiles. It does not intentionally set analytics or advertising cookies. This does not mean the service is anonymous or that infrastructure providers process no technical data.</p>
      </section>
      <section>
        <h2 id="processed">Information processed during a download</h2>
        <p>When you submit a public Kommodo recording URL, the resolver processes that URL to retrieve the public share page and locate an approved HLS playlist. The resolver may process a recording identifier, page title, playlist URL, duration metadata, request timestamp, IP address, user agent, security signals, and ordinary HTTP request information. The application does not intentionally store this information in a dedicated product database.</p>
        <p>Cloudflare and other infrastructure providers may maintain routine access, security, performance, and abuse-prevention logs. Those logs may include an IP address, request path, query string containing the submitted share URL, timestamps, user agent, response status, and related network information. Retention and processing by a provider are governed by that provider's policies and operational settings.</p>
        <p>After resolution, compatible playlists and media segments are fetched by your browser from approved Kommodo delivery hosts. Those hosts receive ordinary network information, which may include your IP address, request headers, signed media URL, and timing. The resulting MP4 is assembled in browser memory and is not intentionally uploaded to this application's server.</p>
      </section>
      <section>
        <h2 id="contact-data">Information you choose to send</h2>
        <p>If you contact us by email or GitHub, we process the information in your message, such as your name, email address, issue description, attachments, and correspondence history, to review and respond. Do not send recording URLs, credentials, private videos, identification documents, or sensitive personal information unless specifically necessary and authorized.</p>
        <p>Copyright notices and counter-notices may require identity, contact, signature, and legal statements. Those messages may be retained as needed to review the request, document the response, protect rights, and meet legal obligations. A counter-notice may be shared with the original claimant when applicable.</p>
      </section>
      <section>
        <h2 id="purposes">Purposes and legal bases</h2>
        <p>Information is processed to operate the requested downloader function, secure the resolver, prevent abuse, diagnose errors, maintain service reliability, answer messages, administer the open-source project, enforce the Terms, and respond to lawful requests. Depending on the applicable law and context, processing may rely on performing the service you requested, legitimate interests in operating and protecting the service, consent for optional communications, or compliance with legal obligations.</p>
      </section>
      <section>
        <h2 id="sharing">Service providers and disclosure</h2>
        <p>The site uses Cloudflare for hosting, content delivery, serverless request processing, security, and related infrastructure. The source repository and issue tracker are hosted by GitHub. Email is handled by the relevant email provider. Kommodo and its delivery hosts receive requests necessary to access the public share page and media.</p>
        <p>Information may also be disclosed when reasonably necessary to comply with law, respond to valid legal process, investigate abuse, protect users or the public, enforce agreements, or defend legal rights. We do not state that personal information is sold, and the current project has no advertising-data business model.</p>
      </section>
      <section>
        <h2 id="retention">Retention and security</h2>
        <p>The application does not intentionally retain finished MP4 files. Browser memory and Blob URLs are temporary and controlled by your device. Contact, support, and legal correspondence may be retained for as long as reasonably needed for the purpose, security, dispute, or legal record. Infrastructure logs may follow provider-controlled retention periods.</p>
        <p>Security measures include HTTPS, strict resolver allowlists, response-size limits, rate limiting, security headers, locally served application scripts, and open-source review. No online service can guarantee absolute security. You are responsible for protecting the recording URL, saved MP4, device, browser profile, and storage location.</p>
      </section>
      <section>
        <h2 id="choices">Your choices and requests</h2>
        <p>You can choose not to submit a recording URL, close the page to release its temporary in-memory result, avoid sending contact information, use the open-source project locally, or request an official export from the recording owner. Depending on applicable law, you may have rights to request access, correction, deletion, restriction, objection, portability, or information about processing.</p>
        <p>Send a privacy request to <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>. Describe the request and the interaction you had with the service. We may need to verify identity and cannot delete information controlled solely by another provider. You may also have a right to contact a local data-protection authority.</p>
      </section>
      <section>
        <h2 id="children">Children, transfers, and changes</h2>
        <p>The service is not directed to children, and we do not knowingly create accounts for children. Internet infrastructure and service providers may process information in countries other than your own. Applicable safeguards depend on the provider, location, and governing law.</p>
        <p>This policy may change when the architecture, providers, law, or project practices change. The effective date at the top will be updated. Material changes may also be announced on the website or repository. Continued use after an update is subject to the revised policy.</p>
      </section>
    `,
    toc: [
      ["scope", "Scope"],
      ["processed", "Download data"],
      ["contact-data", "Contact data"],
      ["purposes", "Purposes"],
      ["sharing", "Sharing"],
      ["retention", "Retention"],
      ["choices", "Your choices"],
      ["children", "Other terms"]
    ],
    related: ["browser-side-processing", "terms", "contact"]
  },
  {
    slug: "terms",
    navTitle: "Terms",
    title: "Terms of Use for Kommodo Video Downloader",
    description: "Review authorized-use requirements, prohibited conduct, intellectual-property terms, service limitations, disclaimers, and responsibilities for the downloader.",
    eyebrow: "Terms of use",
    heading: "Use the tool only when you have the right to use the recording.",
    intro: "Effective July 18, 2026. By using the website, you agree to these terms and to comply with applicable law and recording-owner instructions.",
    kind: "legal",
    body: `
      <section>
        <h2 id="acceptance">Acceptance and eligibility</h2>
        <p>These Terms govern access to ${SITE_NAME}, its public website, resolver, documentation, and related open-source project. By using the hosted service, you confirm that you can enter a binding agreement under applicable law and accept these Terms. If you use the service for an organization, you confirm that you are authorized to act for that organization.</p>
        <p>If you do not agree, do not submit a recording URL or use the hosted downloader. Separate open-source license terms apply to copying, modifying, and distributing the source code.</p>
      </section>
      <section>
        <h2 id="authorized-use">Authorized recordings only</h2>
        <p>You may use the service only for a recording that you own, created, are expressly authorized to download, or may otherwise lawfully copy. You are responsible for obtaining copyright permission, participant consent, workplace approval, privacy authorization, and any other right required for downloading, retaining, editing, publishing, or distributing the recording.</p>
        <p>A public or technically accessible URL does not prove that you have permission. The service does not grant a license to Kommodo content, recordings, names, voices, images, presentations, music, software, or other materials.</p>
      </section>
      <section>
        <h2 id="prohibited">Prohibited conduct</h2>
        <p>You must not use the service to infringe copyright, violate privacy, breach confidentiality, harass or exploit another person, obtain trade secrets, violate a contract, or break applicable law. You must not use it to bypass authentication, encryption, digital-rights management, paywalls, access controls, or platform restrictions.</p>
        <p>You must not probe unrelated networks through the resolver, submit non-Kommodo targets, automate abusive request volumes, interfere with availability, introduce malicious code, misrepresent affiliation, remove legal notices, or use the service to facilitate unauthorized surveillance or data collection. You must not publish private recording URLs or credentials in support requests.</p>
      </section>
      <section>
        <h2 id="service">Service operation and changes</h2>
        <p>The service attempts to resolve supported public links and process compatible HLS media in the browser. Compatibility depends on browser behavior, memory, network conditions, signed URL validity, remote CORS headers, playlist structure, codecs, and third-party availability. We may change, limit, suspend, or discontinue any feature without guaranteeing notice or continued compatibility.</p>
        <p>Rate limits, host allowlists, response limits, and other protective controls may be applied or changed. We may block requests that appear abusive, unlawful, unsafe, or outside the intended purpose.</p>
      </section>
      <section>
        <h2 id="ownership">Ownership, open source, and third-party marks</h2>
        <p>The website design, original documentation, and project materials are owned by their respective authors and licensed as indicated. Source code in the repository is offered under its published license. That license does not grant rights to third-party recordings, brands, services, or content.</p>
        <p>This is an independent project and is not endorsed by, sponsored by, or affiliated with Kommodo. Kommodo and related names, marks, services, and content belong to their respective owners. Compatibility references are descriptive.</p>
      </section>
      <section>
        <h2 id="your-data">Your content and responsibility</h2>
        <p>The hosted application does not claim ownership of your recording. You remain responsible for the URL you submit, the MP4 you save, how you name and store it, who receives it, and what you do with it. You should verify the output before relying on it as an archive or record.</p>
        <p>You are responsible for device security, storage capacity, backups, retention schedules, access controls, and compliance obligations. Do not use the service as the sole preservation method for critical legal, medical, financial, compliance, or evidentiary material.</p>
      </section>
      <section>
        <h2 id="disclaimers">No warranties</h2>
        <p>The hosted service and documentation are provided on an as-is and as-available basis to the maximum extent permitted by law. No warranty is made that the service will be uninterrupted, secure, error-free, compatible with a particular recording, or suitable for a particular purpose. No warranty is made about the accuracy, completeness, duration, synchronization, metadata, or playability of a generated file.</p>
        <p>Nothing in these Terms excludes a warranty or right that cannot lawfully be excluded. Read the separate <a href="/disclaimer/">Disclaimer</a> for additional operational limitations.</p>
      </section>
      <section>
        <h2 id="liability">Limitation and indemnity</h2>
        <p>To the maximum extent permitted by applicable law, the project maintainers and contributors will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, lost data, lost profits, business interruption, privacy incidents, unauthorized use, or reliance on an incomplete file arising from the service.</p>
        <p>You agree to be responsible for claims, losses, and costs arising from your unlawful use, your violation of these Terms, or your infringement of another person's rights, to the extent permitted by law. Local law may not allow every limitation, so some provisions may not apply to you.</p>
      </section>
      <section>
        <h2 id="general">General terms and contact</h2>
        <p>If a provision is unenforceable, the remaining provisions continue to the extent allowed by law. Failure to enforce a provision is not a waiver. These Terms and the referenced policies form the agreement for hosted-service use. Questions can be sent through the <a href="/contact/">Contact page</a>.</p>
        <p>We may update these Terms as the project, service, or law changes. The effective date will be revised. If a change materially affects your use, stop using the service unless you accept the revised terms.</p>
      </section>
    `,
    toc: [
      ["acceptance", "Acceptance"],
      ["authorized-use", "Authorized use"],
      ["prohibited", "Prohibited conduct"],
      ["service", "Service operation"],
      ["ownership", "Ownership"],
      ["your-data", "Your responsibility"],
      ["disclaimers", "No warranties"],
      ["liability", "Liability"],
      ["general", "General terms"]
    ],
    related: ["disclaimer", "privacy-policy", "dmca"]
  },
  {
    slug: "disclaimer",
    navTitle: "Disclaimer",
    title: "Disclaimer for Kommodo Video Downloader",
    description: "Read the independent-project, no-affiliation, authorized-use, technical limitation, legal information, and no-warranty disclaimers for the downloader.",
    eyebrow: "Disclaimer",
    heading: "An independent tool with clear technical and legal limits.",
    intro: "Effective July 18, 2026. This page explains important boundaries that apply to the hosted service and its documentation.",
    kind: "legal",
    body: `
      <section>
        <h2 id="independent">Independent project and no affiliation</h2>
        <p>${SITE_NAME} is an independent open-source Nafran project. It is not endorsed by, sponsored by, operated by, or affiliated with Kommodo. Kommodo and related product names, services, content, and marks belong to their respective owners. References on this website identify technical compatibility and the source of user-provided share links.</p>
        <p>No statement on this website should be understood as a representation that Kommodo approves this tool or that the tool is an official export feature.</p>
      </section>
      <section>
        <h2 id="permission">No permission is created by technical access</h2>
        <p>The ability to open or process a public recording URL does not establish ownership, copyright permission, participant consent, confidentiality approval, or a right to redistribute the recording. You are solely responsible for determining whether your intended download and use are authorized.</p>
        <p>Do not use the tool to bypass access controls, encryption, authentication, paywalls, technical restrictions, or owner instructions. Obtain advice from a qualified professional when rights or obligations are unclear.</p>
      </section>
      <section>
        <h2 id="technical">Technical limitations</h2>
        <p>The service depends on third-party share pages, signed playlists, CORS headers, network availability, browser features, device memory, media formats, codecs, and mux.js behavior. Any of those can change or fail. A recording may resolve but still be too large, encrypted, expired, corrupt, or incompatible with browser transmuxing.</p>
        <p>The generated MP4 may omit captions, chapters, comments, transcripts, speaker labels, alternate audio tracks, thumbnails, analytics, and platform metadata. The output should be checked for duration, audio, synchronization, completeness, and playability before it is used, shared, archived, or relied upon.</p>
      </section>
      <section>
        <h2 id="no-advice">No legal, compliance, or professional advice</h2>
        <p>The guides, Privacy Policy, Terms, DMCA page, and other content provide general operational information. They are not legal advice, a compliance opinion, or a substitute for advice tailored to your jurisdiction, organization, contract, or recording. Copyright, privacy, employment, communications, and data-protection requirements vary.</p>
        <p>The legal pages should be reviewed by qualified counsel before being relied upon for a business or regulated workflow. Technical explanations are educational and may become outdated as browsers, media standards, Cloudflare, Kommodo, or the project changes.</p>
      </section>
      <section>
        <h2 id="warranty">No warranty and limitation</h2>
        <p>The website, resolver, documentation, and open-source materials are provided as is and as available, without warranties to the maximum extent permitted by law. There is no guarantee of uninterrupted availability, compatibility, security, accuracy, completeness, merchantability, fitness for a particular purpose, or non-infringement.</p>
        <p>To the maximum extent permitted by law, maintainers and contributors are not responsible for lost or incomplete recordings, privacy incidents, unauthorized use, device problems, third-party service changes, business interruption, lost profits, or other damages arising from use or inability to use the service. Some jurisdictions limit exclusions, so mandatory rights remain unaffected.</p>
      </section>
      <section>
        <h2 id="links">Third-party links and services</h2>
        <p>The site links to Kommodo, GitHub, Cloudflare, Apple, MDN, and other external resources. Those services control their own content, security, availability, and policies. A link is provided for context and does not constitute endorsement or responsibility for the external service.</p>
        <p>For binding hosted-service rules, read the <a href="/terms/">Terms of Use</a>. For data handling, read the <a href="/privacy-policy/">Privacy Policy</a>. Copyright concerns can be submitted under the <a href="/dmca/">DMCA and Copyright Policy</a>.</p>
      </section>
    `,
    toc: [
      ["independent", "No affiliation"],
      ["permission", "Permission"],
      ["technical", "Technical limits"],
      ["no-advice", "No advice"],
      ["warranty", "No warranty"],
      ["links", "Third parties"]
    ],
    related: ["terms", "dmca", "about"]
  },
  {
    slug: "dmca",
    navTitle: "DMCA",
    title: "DMCA and Copyright Policy",
    description: "Learn how to submit a copyright notice or counter-notice, what information to include, how requests are reviewed, and where to send them.",
    eyebrow: "Copyright policy",
    heading: "A clear channel for copyright notices and counter-notices.",
    intro: "Effective July 18, 2026. This policy explains how to report material on this website or repository that you believe infringes copyright.",
    kind: "legal",
    body: `
      <section>
        <h2 id="scope">Scope of this policy</h2>
        <p>This process concerns material hosted or controlled by the ${SITE_NAME} website or its project repository. The downloader does not intentionally host visitor recordings or copy video segments through its server. A recording available through Kommodo remains on third-party infrastructure, so a request about the underlying recording may need to be sent directly to the platform or party that hosts it.</p>
        <p>We may remove or disable access to website text, code, images, links, or other project material that is properly identified in a valid notice. We may forward a notice to the person responsible for the material and retain it as part of the request record.</p>
      </section>
      <section>
        <h2 id="notice">What to include in a copyright notice</h2>
        <p>Send a written notice that substantially includes the following information:</p>
        <ol>
          <li>A physical or electronic signature of the copyright owner or a person authorized to act for the owner.</li>
          <li>Identification of the copyrighted work claimed to be infringed, or a representative list if one notice covers multiple works.</li>
          <li>Identification of the material claimed to be infringing and information reasonably sufficient to locate it, including the exact URL on this website or repository.</li>
          <li>Your name, mailing address, telephone number, and email address.</li>
          <li>A statement that you have a good-faith belief that use of the material is not authorized by the copyright owner, its agent, or the law.</li>
          <li>A statement that the information in the notice is accurate and, under penalty of perjury, that you are the owner or authorized to act for the owner.</li>
        </ol>
        <p>The statutory framework appears in <a href="https://www.law.cornell.edu/uscode/text/17/512" target="_blank" rel="noopener noreferrer">17 U.S.C. § 512</a>, and the <a href="https://www.copyright.gov/512/" target="_blank" rel="noopener noreferrer">U.S. Copyright Office Section 512 resources</a> provide additional guidance. Consider consulting a lawyer before submitting a notice.</p>
      </section>
      <section>
        <h2 id="send">Where to send the notice</h2>
        <p>Email the notice to <a href="mailto:${CONTACT_EMAIL}?subject=Copyright%20Notice">${CONTACT_EMAIL}</a> with the subject <strong>Copyright Notice</strong>. You may also identify a public repository file or issue URL. Do not attach the allegedly infringing recording unless requested; provide the precise location and enough information to evaluate the claim.</p>
        <p>This published contact is the project's copyright contact. Publication on this page does not represent that a statutory designated-agent registration has been completed for every jurisdiction or safe-harbor program.</p>
      </section>
      <section>
        <h2 id="review">How notices may be handled</h2>
        <p>We may check whether the notice identifies material under our control and contains the required information. We may request clarification, remove or disable access to material, notify the person who provided it, forward relevant information, document the response, or decline a request that is incomplete, misdirected, fraudulent, or does not identify material we control.</p>
        <p>Submitting knowingly false claims can create legal consequences. Consider fair use, license, public domain, and other lawful uses before making a claim. Removal is not a final judicial determination of ownership or infringement.</p>
      </section>
      <section>
        <h2 id="counter">Counter-notification</h2>
        <p>If your material was removed or disabled because of a copyright notice and you believe that happened through mistake or misidentification, you may send a written counter-notice. It should substantially include:</p>
        <ol>
          <li>Your physical or electronic signature.</li>
          <li>Identification of the removed material and the location where it appeared before removal.</li>
          <li>A statement under penalty of perjury that you have a good-faith belief the material was removed or disabled because of mistake or misidentification.</li>
          <li>Your name, address, and telephone number.</li>
          <li>The jurisdiction and service-of-process consent statements required by applicable Section 512 procedure.</li>
        </ol>
        <p>A counter-notice may be forwarded to the original claimant. The U.S. Copyright Office explains that Section 512 counter-notices require contact details, jurisdictional consent, and agreement to accept service of process. Obtain legal advice if you do not understand those consequences.</p>
      </section>
      <section>
        <h2 id="repeat">Repeat infringement and abuse</h2>
        <p>Where applicable and appropriate, access by repeat infringers may be restricted or terminated. The hosted downloader does not provide user accounts or public uploads, so the available response depends on the material and system involved.</p>
        <p>We may protect the project and users from abusive notices, fraudulent impersonation, exposure of private data, or attempts to use copyright procedure for unrelated disputes. Personal information in notices is handled as described in the <a href="/privacy-policy/">Privacy Policy</a>.</p>
      </section>
      <section>
        <h2 id="platform">Requests about a Kommodo recording</h2>
        <p>If your complaint concerns the recording itself rather than text, code, or a link controlled by this project, contact the recording owner and the service that hosts the media. Include the Kommodo share-page location in a report to the appropriate host, but do not post it publicly here. This project generally cannot remove a video stored on a third-party platform.</p>
      </section>
    `,
    toc: [
      ["scope", "Scope"],
      ["notice", "Notice contents"],
      ["send", "Send a notice"],
      ["review", "Review process"],
      ["counter", "Counter-notice"],
      ["repeat", "Repeat infringement"],
      ["platform", "Hosted recordings"]
    ],
    related: ["terms", "privacy-policy", "contact"]
  },
  {
    slug: "contact",
    navTitle: "Contact",
    title: "Contact Kommodo Video Downloader Support",
    description: "Contact the project for technical corrections, accessibility feedback, privacy requests, copyright notices, security concerns, or open-source questions.",
    eyebrow: "Contact",
    heading: "Send the right information without exposing a recording.",
    intro: "Choose the appropriate channel for support, security, privacy, copyright, accessibility, or open-source contributions.",
    kind: "support",
    body: `
      <section>
        <h2 id="email">Email contact</h2>
        <p>For private operational, privacy, copyright, or accessibility matters, email <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>. Use a descriptive subject such as <strong>Downloader support</strong>, <strong>Privacy request</strong>, <strong>Accessibility feedback</strong>, or <strong>Copyright notice</strong>.</p>
        <p>Never send a password, account session, API key, private video, identification document, or confidential recording link in an initial message. Describe the problem without the sensitive URL. If more information is genuinely needed, a safer exchange can be discussed.</p>
      </section>
      <section>
        <h2 id="technical">Technical and open-source issues</h2>
        <p>For reproducible public bugs, feature proposals, or code contributions, use the <a href="https://github.com/aamirmursleen/kommodo-video-downloader/issues" target="_blank" rel="noopener noreferrer">GitHub issue tracker</a>. Include:</p>
        <ul>
          <li>The status stage and exact non-sensitive error message.</li>
          <li>Browser name, version, operating system, and device type.</li>
          <li>Approximate recording duration and whether it is high resolution.</li>
          <li>Whether the public recording page loads in a private browser window.</li>
          <li>Steps that reproduce the problem without revealing the recording ID.</li>
        </ul>
        <p>Check the <a href="/troubleshooting/">troubleshooting guide</a> and existing issues before opening a new report. Public issues are visible to everyone.</p>
      </section>
      <section>
        <h2 id="security">Security reports</h2>
        <p>Send suspected vulnerabilities privately by email with the subject <strong>Security report</strong>. Include the affected URL or component, the security impact, safe reproduction steps, and any suggested mitigation. Do not access another person's data, disrupt the service, publish a working exploit, or perform broad automated scanning.</p>
        <p>API credentials are not required for the public project. If you discover a credential in the repository or deployed assets, report its file and location without copying the secret into a public issue.</p>
      </section>
      <section>
        <h2 id="legal">Privacy and copyright requests</h2>
        <p>Privacy requests should identify your interaction with the service and the right you wish to exercise. Read the <a href="/privacy-policy/">Privacy Policy</a> for scope and limitations. Copyright notices and counter-notices should include the information listed in the <a href="/dmca/">DMCA and Copyright Policy</a>.</p>
        <p>This project normally cannot remove a recording hosted by Kommodo or another third party. A complaint about the underlying video should be directed to the recording owner and hosting platform.</p>
      </section>
      <section>
        <h2 id="response">Response expectations</h2>
        <p>Messages are reviewed as capacity permits. No guaranteed response time, support level, or resolution is offered. Clear, focused, non-sensitive reports are easier to investigate. Commercial support, legal representation, and emergency response are not provided through this address.</p>
        <p>For background about the maintainer and project, visit <a href="/about/">About the project</a>.</p>
      </section>
    `,
    toc: [
      ["email", "Email"],
      ["technical", "Technical issues"],
      ["security", "Security"],
      ["legal", "Privacy and copyright"],
      ["response", "Response expectations"]
    ],
    related: ["troubleshooting", "privacy-policy", "about"]
  },
  {
    slug: "about",
    navTitle: "About",
    title: "About the Kommodo Video Downloader Project",
    description: "Learn who built the independent Kommodo downloader, why the project is open source, how its browser-first architecture works, and how to contribute.",
    eyebrow: "About the project",
    heading: "An open-source tool built to make one task clear.",
    intro: "Kommodo Downloader is an independent Nafran project created by Muhammad Aamir Mursleen and published for transparent, authorized browser exports.",
    kind: "support",
    body: `
      <section>
        <h2 id="purpose">Why the project exists</h2>
        <p>Kommodo Downloader focuses on one practical job: take an authorized public Kommodo recording link, show honest progress, and prepare a compatible MP4 in the visitor's browser. The interface keeps the link field at the top because the task should be obvious before a visitor reads documentation.</p>
        <p>The project is intentionally narrow. It does not provide user accounts, cloud video storage, recording discovery, access-control bypasses, or a general-purpose URL proxy. Clear limits are part of the product design.</p>
      </section>
      <section>
        <h2 id="builder">Builder and authorship</h2>
        <p>The project was created by <a href="https://github.com/aamirmursleen" target="_blank" rel="noopener noreferrer">${AUTHOR_NAME}</a> as part of Nafran. Technical articles on this site are based on the behavior of the published source, direct testing of the downloader, and primary documentation for the web and media technologies involved.</p>
        <p>Pages include a publication and update date so readers can judge freshness. Corrections are welcome through the <a href="/contact/">Contact page</a> or public repository.</p>
      </section>
      <section>
        <h2 id="open-source">Why open source matters here</h2>
        <p>A downloader handles sensitive-looking URLs and large media transfers, so users should be able to inspect the code path. The <a href="https://github.com/aamirmursleen/kommodo-video-downloader" target="_blank" rel="noopener noreferrer">GitHub repository</a> exposes the resolver allowlists, browser transfer logic, HLS parsing, mux.js integration, build process, tests, and security headers.</p>
        <p>The source is published under the MIT license. Third-party components retain their own licenses, and the project license does not grant rights to download or redistribute third-party recordings.</p>
      </section>
      <section>
        <h2 id="principles">Product principles</h2>
        <ul>
          <li><strong>Make the primary action obvious.</strong> The recording link field leads the page.</li>
          <li><strong>Explain the state.</strong> Progress, segments, speed, and ETA reduce uncertainty.</li>
          <li><strong>Keep video transfer in the browser.</strong> The server resolves; it does not proxy media segments.</li>
          <li><strong>Reject unsafe scope expansion.</strong> Strict hosts, paths, and media checks keep the endpoint focused.</li>
          <li><strong>Document limitations.</strong> Browser memory, CORS, encryption, and format compatibility are visible constraints.</li>
          <li><strong>Respect users.</strong> The current service has no sign-up, advertising cookies, or paywall.</li>
        </ul>
      </section>
      <section>
        <h2 id="independence">Independence and compatibility</h2>
        <p>This is not an official Kommodo product and is not endorsed by or affiliated with Kommodo. The name is used descriptively so users understand which public recording links the tool accepts. All third-party marks and content belong to their respective owners.</p>
        <p>Start with the <a href="/guides/">Guide library</a>, read the <a href="/how-it-works/">technical architecture</a>, or review the <a href="/terms/">Terms of Use</a> before downloading.</p>
      </section>
    `,
    toc: [
      ["purpose", "Purpose"],
      ["builder", "Builder"],
      ["open-source", "Open source"],
      ["principles", "Principles"],
      ["independence", "Independence"]
    ],
    related: ["guides", "how-it-works", "contact"]
  }
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderHeader() {
  return `
    <header class="site-header" aria-label="Main navigation">
      <div class="nav-shell">
        <a class="brand" href="/" aria-label="Kommodo Video Downloader home">
          <span class="brand-symbol" aria-hidden="true">↓</span>
          <span>Kommodo Downloader</span>
        </a>
        <nav class="nav-links" aria-label="Primary navigation">
          <a href="/#downloader">Downloader</a>
          <a href="/guides/">Guides</a>
          <a href="/how-it-works/">Technology</a>
          <a class="nav-button" href="https://github.com/aamirmursleen/kommodo-video-downloader" target="_blank" rel="noopener noreferrer">View source</a>
        </nav>
      </div>
    </header>`;
}

function renderFooter() {
  return `
    <footer class="site-footer article-footer">
      <div class="footer-brand">
        <span class="brand-symbol" aria-hidden="true">↓</span>
        <div><strong>Kommodo Downloader</strong><small>An independent open-source tool by <a href="https://www.nafran.com/" rel="noopener">Nafran</a></small></div>
      </div>
      <nav aria-label="Footer navigation">
        <a href="/guides/">Guides</a>
        <a href="/faq/">FAQ</a>
        <a href="/about/">About</a>
        <a href="/contact/">Contact</a>
        <a href="/privacy-policy/">Privacy</a>
        <a href="/terms/">Terms</a>
        <a href="/disclaimer/">Disclaimer</a>
        <a href="/dmca/">DMCA</a>
      </nav>
      <p class="legal">Use only for recordings you own or are authorized to download. This project is not affiliated with Kommodo.</p>
    </footer>`;
}

function renderGuideGrid(allPages) {
  return `<div class="guide-grid">${allPages
    .filter((item) => item.kind === "article")
    .map((item, index) => `
      <a class="guide-card" href="/${item.slug}/">
        <span>${String(index + 1).padStart(2, "0")}</span>
        <strong>${escapeHtml(item.navTitle)}</strong>
        <p>${escapeHtml(item.description)}</p>
        <i aria-hidden="true">→</i>
      </a>`)
    .join("")}</div>`;
}

function renderFaqList(faqs = []) {
  return `<div class="article-faq">${faqs.map(([question, answer]) => `
    <details>
      <summary>${escapeHtml(question)}<span aria-hidden="true">+</span></summary>
      <p>${escapeHtml(answer)}</p>
    </details>`).join("")}</div>`;
}

function renderRelated(page, allPages) {
  const selected = page.related
    .map((slug) => allPages.find((item) => item.slug === slug))
    .filter(Boolean);
  return `
    <section class="related-section" aria-labelledby="related-title">
      <div><p class="eyebrow">Continue learning</p><h2 id="related-title">Related resources</h2></div>
      <div class="related-grid">${selected.map((item) => `
        <a href="/${item.slug}/">
          <span>${item.kind === "article" ? "Guide" : "Resource"}</span>
          <strong>${escapeHtml(item.title)}</strong>
          <i aria-hidden="true">→</i>
        </a>`).join("")}</div>
    </section>`;
}

function renderStructuredData(page) {
  const url = `${SITE_URL}/${page.slug}/`;
  const main = page.kind === "article"
    ? {
        "@type": "TechArticle",
        headline: page.title,
        description: page.description,
        url,
        mainEntityOfPage: url,
        datePublished: PUBLISHED_DATE,
        dateModified: PUBLISHED_DATE,
        image: `${SITE_URL}/og.png`,
        author: { "@type": "Person", name: AUTHOR_NAME, url: `${SITE_URL}/about/` },
        publisher: { "@type": "Organization", name: "Nafran", url: "https://www.nafran.com/" }
      }
    : page.kind === "faq"
      ? {
          "@type": "FAQPage",
          name: page.title,
          description: page.description,
          url,
          mainEntity: page.faqs.map(([question, answer]) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer }
          }))
        }
      : {
          "@type": page.kind === "hub" ? "CollectionPage" : "WebPage",
          name: page.title,
          description: page.description,
          url,
          dateModified: PUBLISHED_DATE,
          author: { "@type": "Person", name: AUTHOR_NAME, url: `${SITE_URL}/about/` }
        };

  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      ...(page.kind === "article"
        ? [{ "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides/` }]
        : []),
      {
        "@type": "ListItem",
        position: page.kind === "article" ? 3 : 2,
        name: page.navTitle,
        item: url
      }
    ]
  };

  return JSON.stringify({ "@context": "https://schema.org", "@graph": [main, breadcrumb] }).replaceAll("<", "\\u003c");
}

function renderBreadcrumbs(page) {
  return `
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="/">Home</a><span aria-hidden="true">/</span>
      ${page.kind === "article" ? '<a href="/guides/">Guides</a><span aria-hidden="true">/</span>' : ""}
      <a href="/${page.slug}/" aria-current="page">${escapeHtml(page.navTitle)}</a>
    </nav>`;
}

function renderToc(page) {
  return `
    <aside class="article-toc" aria-label="On this page">
      <strong>On this page</strong>
      <nav aria-label="On this page links">${page.toc.map(([id, label]) => `<a href="#${id}">${escapeHtml(label)}</a>`).join("")}</nav>
      <a class="toc-download" href="/#downloader">Open downloader <span aria-hidden="true">→</span></a>
    </aside>`;
}

export function renderPage(page, allPages = pages, options = {}) {
  const canonical = `${SITE_URL}/${page.slug}/`;
  const stylesheetHref = options.stylesheetHref || "/styles.css";
  const body = page.body
    .replace("{{GUIDE_GRID}}", renderGuideGrid(allPages))
    .replace("{{FAQ_LIST}}", renderFaqList(page.faqs));
  const readLabel = page.kind === "article" ? "Technical guide" : page.kind === "legal" ? "Policy" : "Resource";
  const isHub = page.kind === "hub";

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(page.title)}</title>
    <meta name="description" content="${page.description}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="author" content="${AUTHOR_NAME}">
    <link rel="canonical" href="${canonical}">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#ffffff">
    <meta property="og:type" content="${page.kind === "article" ? "article" : "website"}">
    <meta property="og:site_name" content="Kommodo Video Downloader">
    <meta property="og:title" content="${escapeHtml(page.title)}">
    <meta property="og:description" content="${page.description}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${SITE_URL}/og.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Kommodo Video Downloader link field and download button">
    ${page.kind === "article" ? `<meta property="article:published_time" content="${PUBLISHED_DATE}"><meta property="article:modified_time" content="${PUBLISHED_DATE}">` : ""}
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(page.title)}">
    <meta name="twitter:description" content="${page.description}">
    <meta name="twitter:image" content="${SITE_URL}/og.png">
    <link rel="stylesheet" href="${escapeHtml(stylesheetHref)}">
    <script type="application/ld+json">${renderStructuredData(page)}</script>
  </head>
  <body class="article-page${isHub ? " hub-page" : ""}">
    <a class="skip-link" href="#main-content">Skip to content</a>
    ${renderHeader()}
    <main id="main-content" class="article-main">
      ${renderBreadcrumbs(page)}
      <article>
        <header class="article-hero">
          <p class="eyebrow">${escapeHtml(page.eyebrow)}</p>
          <h1>${escapeHtml(page.heading)}</h1>
          <p class="article-intro">${escapeHtml(page.intro)}</p>
          ${isHub ? `<div class="hub-actions"><a class="hub-primary" href="/#downloader">Open downloader <span aria-hidden="true">→</span></a><a class="hub-secondary" href="/how-to-use/">Start with the basics</a></div>` : ""}
          <div class="article-byline">
            ${isHub
              ? `<span>7 focused guides</span><span>Open-source technology</span><span>Updated <time datetime="${PUBLISHED_DATE}">July 18, 2026</time></span>`
              : `<span>${readLabel}</span><span>Published <time datetime="${PUBLISHED_DATE}">July 18, 2026</time></span><span>By <a href="/about/">${AUTHOR_NAME}</a></span>`}
          </div>
        </header>
        <div class="article-layout${isHub ? " hub-layout" : ""}">
          ${renderToc(page)}
          <div class="article-content">${body}</div>
        </div>
        ${renderRelated(page, allPages)}
      </article>
    </main>
    ${renderFooter()}
  </body>
</html>
`;
  return html.replace(/[ \t]+$/gm, "");
}

export function renderSitemap(allPages = pages) {
  const urls = [
    { loc: `${SITE_URL}/`, priority: "1.0", changefreq: "weekly" },
    ...allPages.map((page) => ({
      loc: `${SITE_URL}/${page.slug}/`,
      priority: page.slug === "guides" ? "0.9" : page.kind === "article" ? "0.8" : "0.5",
      changefreq: page.kind === "article" || page.kind === "hub" ? "monthly" : "yearly"
    }))
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((item) => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${PUBLISHED_DATE}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;
}
