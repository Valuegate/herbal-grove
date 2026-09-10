import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";

import { api } from "@/convex/_generated/api";
import { discoverWebPage } from "@/lib/scout/sources/web";
import { classifyContent } from "@/lib/scout/ai/classifyContents";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required." },
        { status: 400 }
      );
    }

    const discovered = await discoverWebPage(url);

    const classification = await classifyContent(discovered.content);

    const discoveryId = await convex.mutation(
      api.researchDiscoveries.createDiscovery,
      {
        source: discovered.source,
        sourceUrl: discovered.sourceUrl,
        sourceId: discovered.sourceId,

        title: discovered.title,
        content: discovered.content,

        author: discovered.author,
        publishedAt: discovered.publishedAt,
        discoveredAt: Date.now(),

        topics: classification.topics,
        plants: classification.plants,

        contentType: classification.contentType,
        evidenceType: classification.evidenceType,
        relevanceScore: classification.relevanceScore,

        images: discovered.images,
      }
    );

    return NextResponse.json({
      discoveryId,
      discovered,
      classification,
    });
  } catch (error) {
    console.error("Scout discovery failed:", error);

    return NextResponse.json(
      {
        error: "Scout discovery failed.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}