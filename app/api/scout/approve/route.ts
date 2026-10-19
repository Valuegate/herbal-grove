import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { saveResearchChunks } from "@/lib/scout/saveResearchChunks";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: Request) {
  try {
    const { discoveryId } = await request.json();

    if (!discoveryId) {
      return NextResponse.json(
        {
          error: "Discovery ID is required.",
        },
        { status: 400 }
      );
    }

    const typedDiscoveryId = discoveryId as Id<"researchDiscoveries">;

    const discovery = await convex.query(api.researchDiscoveries.getDiscoveryById,{discoveryId:typedDiscoveryId})

    if (!discovery) {
      return NextResponse.json(
        {
          error: "Discovery not found.",
        },
        { status: 404 }
      );
    }

    if (discovery.status !== "pending") {
      return NextResponse.json(
        {
          error:
            "Only pending discoveries can be approved.",
        },
        { status: 400 }
      );
    }

    /*Remove any partial chunks from an earlier failed indexing attempt before trying again.*/
    await convex.mutation(api.researchChunks.deleteResearchChunksByDiscovery, {discoveryId: typedDiscoveryId});

    const chunkCount = await saveResearchChunks(
      convex,
      typedDiscoveryId,
      discovery.content
    );

    await convex.mutation(
      api.researchDiscoveries.approveDiscovery,{discoveryId: typedDiscoveryId});

    return NextResponse.json({
      success: true,
      chunkCount,
    });
  } catch (error) {
    console.error(
      "Research discovery approval failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to approve discovery.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}