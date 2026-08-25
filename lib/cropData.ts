import fs from "node:fs/promises";
import path from "node:path";

export type CropRecord = {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  label: string;
};

export async function loadCropDataset(): Promise<CropRecord[]> {
  const filePath = path.join(
    process.cwd(),
    "public",
    "data",
    "Crop_recommendation.csv",
  );

  try {
    const csv = await fs.readFile(filePath, "utf-8");

    const lines = csv
      .trim()
      .split(/\r?\n/)
      .filter(Boolean);

    if (lines.length < 2) {
      throw new Error(
        "Crop recommendation dataset is empty.",
      );
    }

    const headers = lines[0]
      .split(",")
      .map((header) => header.trim());

    return lines.slice(1).map((line) => {
      const values = line.split(",");

      const record: Record<string, string> = {};

      headers.forEach((header, index) => {
        record[header] =
          values[index]?.trim() ?? "";
      });

      return {
        N: Number(record.N),
        P: Number(record.P),
        K: Number(record.K),
        temperature: Number(record.temperature),
        humidity: Number(record.humidity),
        ph: Number(record.ph),
        rainfall: Number(record.rainfall),
        label: record.label,
      };
    });
  } catch (error) {
    console.error(
      "Failed to load crop dataset:",
      error,
    );

    throw new Error(
      "Unable to load crop recommendation dataset.",
    );
  }
}