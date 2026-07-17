import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { pages, renderPage, renderSitemap } from "../site-pages.mjs";

const requiredSlugs = [
  "guides",
  "how-to-use",
  "how-it-works",
  "hls-to-mp4",
  "browser-side-processing",
  "troubleshooting",
  "download-kommodo-recordings",
  "kommodo-recording-formats",
  "faq",
  "privacy-policy",
  "terms",
  "disclaimer",
  "dmca",
  "contact"
];

function visibleWordCount(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

test("publishes at least ten useful topic-cluster and trust pages", () => {
  assert.ok(pages.length >= 10, `Expected at least 10 pages, received ${pages.length}`);
  const slugs = new Set(pages.map((page) => page.slug));
  for (const slug of requiredSlugs) assert.ok(slugs.has(slug), `Missing /${slug}/`);
});

test("every page has unique search metadata", () => {
  const slugs = pages.map((page) => page.slug);
  const titles = pages.map((page) => page.title);
  const descriptions = pages.map((page) => page.description);

  assert.equal(new Set(slugs).size, slugs.length, "Duplicate page slug");
  assert.equal(new Set(titles).size, titles.length, "Duplicate page title");
  assert.equal(new Set(descriptions).size, descriptions.length, "Duplicate meta description");

  for (const page of pages) {
    assert.ok(page.title.length >= 20 && page.title.length <= 65, `${page.slug} title length`);
    assert.ok(page.description.length >= 100 && page.description.length <= 165, `${page.slug} description length`);
  }
});

test("rendered pages include indexable metadata, breadcrumbs, and structured data", () => {
  for (const page of pages) {
    const html = renderPage(page, pages);
    const canonical = `https://kommodovideodownloader.nafran.com/${page.slug}/`;

    assert.match(html, /^<!DOCTYPE html>/, `${page.slug} doctype`);
    assert.ok(html.includes(`<link rel="canonical" href="${canonical}">`), `${page.slug} canonical`);
    assert.ok(html.includes(`<meta name="description" content="${page.description}">`), `${page.slug} description`);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${page.slug} should have one h1`);
    assert.ok(html.includes('class="breadcrumbs"'), `${page.slug} breadcrumbs`);
    assert.ok(html.includes('"@type":"BreadcrumbList"'), `${page.slug} BreadcrumbList JSON-LD`);
    assert.ok(html.includes(`href="/${page.slug}/" aria-current="page"`), `${page.slug} self breadcrumb`);
    assert.ok(!html.includes("SEO target"), `${page.slug} should not expose SEO copy`);
  }
});

test("technical guides are substantial and contain scannable sections", () => {
  const technicalPages = pages.filter((page) => page.kind === "article");
  assert.ok(technicalPages.length >= 7, "Expected at least seven educational articles");

  for (const page of technicalPages) {
    const html = renderPage(page, pages);
    assert.ok(visibleWordCount(html) >= 900, `${page.slug} needs more task-specific depth`);
    assert.ok((html.match(/<h2[ >]/g) || []).length >= 3, `${page.slug} needs at least three h2 sections`);
    assert.ok((html.match(/href="\/[^"]+\/"/g) || []).length >= 5, `${page.slug} needs internal links`);
    assert.ok(html.includes('"@type":"TechArticle"'), `${page.slug} TechArticle JSON-LD`);
    assert.match(`${page.title} ${page.description}`, /Kommodo/i, `${page.slug} metadata must identify its Kommodo search intent`);
  }
});

test("trust and support pages contain meaningful operational detail", () => {
  const trustPages = pages.filter((page) => page.kind !== "article");
  for (const page of trustPages) {
    const html = renderPage(page, pages);
    assert.ok(visibleWordCount(html) >= 280, `${page.slug} is too thin`);
    assert.ok((html.match(/<h2[ >]/g) || []).length >= 2, `${page.slug} needs at least two h2 sections`);
  }
});

test("sitemap contains the homepage and every generated page exactly once", () => {
  const sitemap = renderSitemap(pages);
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

  assert.equal(urls[0], "https://kommodovideodownloader.nafran.com/");
  assert.equal(urls.length, pages.length + 1);
  assert.equal(new Set(urls).size, urls.length);
  for (const page of pages) {
    assert.ok(urls.includes(`https://kommodovideodownloader.nafran.com/${page.slug}/`));
  }
});

test("homepage exposes the content hub and key trust pages", async () => {
  const home = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
  for (const path of ["/guides/", "/faq/", "/privacy-policy/", "/terms/", "/dmca/", "/contact/"]) {
    assert.ok(home.includes(`href="${path}"`), `Homepage missing ${path}`);
  }
  assert.ok(home.includes('"@type": "WebApplication"'), "Homepage needs WebApplication schema");
  assert.ok(!home.includes('"@type": "FAQPage"'), "Homepage must not claim FAQ content it does not display");
});

test("guides page renders as a dedicated responsive knowledge hub", async () => {
  const guideHub = pages.find((page) => page.slug === "guides");
  const html = renderPage(guideHub, pages);
  const css = await readFile(new URL("../public/styles.css", import.meta.url), "utf8");

  assert.ok(html.includes('<body class="article-page hub-page">'), "Guides needs its own page layout");
  assert.ok(html.includes('class="hub-actions"'), "Guides needs prominent next actions");
  assert.ok(html.includes('class="article-layout hub-layout"'), "Guides must not use the narrow article layout");
  assert.equal((html.match(/class="guide-card"/g) || []).length, 7, "Guides should expose all seven articles");
  assert.ok(css.includes(".hub-page .guide-grid"), "Guides needs a full-width card grid");
  assert.ok(css.includes("repeat(3, minmax(0, 1fr))"), "Guide cards need three desktop columns");
});
