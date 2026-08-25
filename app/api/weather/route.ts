import { NextResponse } from "next/server";

import { getFarmWeather } from "@/lib/weather";

export async function GET() {
  try {
    const weather = await getFarmWeather();

    return NextResponse.json({
      success: true,
      weather,
    });
  } catch (error) {
    console.error("Weather API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to fetch farm weather",
      },
      {
        status: 500,
      },
    );
  }
}