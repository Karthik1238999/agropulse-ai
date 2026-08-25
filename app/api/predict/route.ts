import { NextRequest, NextResponse } from "next/server";

import {
  recommendCrop,
  type CropInput,
} from "@/lib/cropRecommendation";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Crop prediction API is working.",
    method: "POST",
    endpoint: "/api/predict",
    requiredFields: [
      "N",
      "P",
      "K",
      "temperature",
      "humidity",
      "ph",
      "rainfall",
    ],
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const input: CropInput = {
      N: Number(body.N),
      P: Number(body.P),
      K: Number(body.K),
      temperature: Number(body.temperature),
      humidity: Number(body.humidity),
      ph: Number(body.ph),
      rainfall: Number(body.rainfall),
    };

    const values = Object.values(input);

    if (
      values.some(
        (value) => !Number.isFinite(value),
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "All prediction values must be valid numbers.",
        },
        { status: 400 },
      );
    }

    const prediction = await recommendCrop(input);

    return NextResponse.json({
      success: true,
      prediction,
    });
  } catch (error) {
    console.error(
      "Crop prediction error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate crop prediction.",
      },
      { status: 500 },
    );
  }
}