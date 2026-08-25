import { NextResponse } from "next/server";

import { getDatasetAnalytics } from "@/lib/analyticsData";

export async function GET() {
  try {
    const analytics = await getDatasetAnalytics();

    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("Dataset analytics error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load crop dataset analytics.",
      },
      { status: 500 },
    );
  }
}