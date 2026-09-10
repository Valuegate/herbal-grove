import "server-only";

import * as cheerio from "cheerio";
import type { DiscoveredContent } from "./types";

export async function discoverWebPage(
  url: string
): Promise<DiscoveredContent> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch page: ${response.status} ${response.statusText}`
    );
  }

  const html = await response.text();

  const $ = cheerio.load(html);

  // Remove elements that don't contain useful research content
  $("script, style, nav, footer, header, noscript").remove();

  const title = $("title").first().text().trim();

  const content = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim();

  const images = $("img")
    .map((_, element) => {
      const src = $(element).attr("src");
      const altText = $(element).attr("alt");

      if (!src) {
        return null;
      }

      return {
        url: new URL(src, url).href,
        altText: altText?.trim() || undefined,
      };
    })
    .get()
    .filter((image) => image !== null);

  return {
    source: "web",
    sourceUrl: url,
    title: title || undefined,
    content,
    images,
  };
}