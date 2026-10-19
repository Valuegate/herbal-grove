import "server-only";

import { ConvexHttpClient } from "convex/browser";

import { api } from "@/convex/_generated/api";
import { discoverResearchCandidates } from "@/lib/scout/discovery/tavily";
import { extractWithTavily } from "@/lib/scout/extraction/tavilyExtract";
import { classifyContent } from "@/lib/scout/ai/classifyContents";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export type ScoutRunResult = {
  discovered: number;
  processed: number;
  saved: number;
  skippedExisting: number;
  skippedIrrelevant: number;
  failed: number;
};

function normalizeUrl(value: string) {
  try {
    const url = new URL(value);
    url.hash = "";
    if (url.pathname.endsWith("/")) url.pathname = url.pathname.slice(0, -1);
    return url.toString();
  } catch {
    return value;
  }
}

function getSourceName(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "web";
  }
}

export async function runScout(): Promise<ScoutRunResult> {
  const candidates = await discoverResearchCandidates();

  const result: ScoutRunResult = {
    discovered: candidates.length,
    processed: 0,
    saved: 0,
    skippedExisting: 0,
    skippedIrrelevant: 0,
    failed: 0,
  };

  // Drop URLs we've already saved.
  const newCandidates = [];
  for (const candidate of candidates) {
    try {
      const existing = await convex.query(api.researchDiscoveries.getDiscoveryBySourceUrl, {
        sourceUrl: candidate.url,
      });

      if (existing) {
        result.skippedExisting++;
        continue;
      }

      newCandidates.push(candidate);
    } catch (error) {
      result.failed++;
      console.error(`Failed to check existing discovery ${candidate.url}:`, error);
    }
  }

  if (newCandidates.length === 0) return result;

  // Extract all new candidate pages through Tavily.
  let extractedPages;
  try {
    extractedPages = await extractWithTavily(newCandidates.map((candidate) => candidate.url));
  } catch (error) {
    console.error("Scout extraction failed:", error);
    result.failed += newCandidates.length;
    return result;
  }

  const extractedByUrl = new Map(extractedPages.map((page) => [normalizeUrl(page.url), page]));

  for (const candidate of newCandidates) {
    try {
      const extracted = extractedByUrl.get(normalizeUrl(candidate.url));

      if (!extracted || !extracted.content.trim()) {
        result.failed++;
        continue;
      }

      result.processed++;

      const classification = await classifyContent(extracted.content);

      if (!classification.relevant || classification.plants.length === 0) {
        result.skippedIrrelevant++;
        continue;
      }

      await convex.mutation(api.researchDiscoveries.createDiscovery, {
        source: getSourceName(candidate.url),
        sourceUrl: candidate.url,
        title: candidate.title || undefined,
        content: extracted.content,
        publishedAt: candidate.publishedAt,
        discoveredAt: Date.now(),
        topics: classification.topics,
        plants: classification.plants,
        contentType: classification.contentType,
        evidenceType: classification.evidenceType,
        relevanceScore: classification.relevanceScore,
        images: extracted.images,
      });

      result.saved++;
    } catch (error) {
      result.failed++;
      console.error(`Scout failed to process ${candidate.url}:`, error);
    }
  }

  return result;
}