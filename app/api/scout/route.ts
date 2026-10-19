import { NextResponse } from "next/server";

import { runScout } from "@/lib/scout/runScout";

export async function POST() {
  try {
    const result = await runScout();

    return NextResponse.json({
      success: true,
      message: "Research Scout crawl completed.",
      result,
    });
  } catch (error) {
    console.error("Research Scout crawl failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Research Scout crawl failed.",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}