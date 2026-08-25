import {
  CropRecord,
  loadCropDataset,
} from "@/lib/cropData";

export type CropInput = {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
};

export type CropRecommendation = {
  crop: string;
  score: number;
  matches: number;
  totalSamples: number;
};

function normalizeDistance(
  value: number,
  min: number,
  max: number,
) {
  if (max === min) {
    return 0;
  }

  return (value - min) / (max - min);
}

function calculateDistance(
  input: CropInput,
  record: CropRecord,
  ranges: Record<
    keyof CropInput,
    { min: number; max: number }
  >,
) {
  const features: (keyof CropInput)[] = [
    "N",
    "P",
    "K",
    "temperature",
    "humidity",
    "ph",
    "rainfall",
  ];

  let total = 0;

  for (const feature of features) {
    const inputValue = normalizeDistance(
      input[feature],
      ranges[feature].min,
      ranges[feature].max,
    );

    const recordValue = normalizeDistance(
      record[feature],
      ranges[feature].min,
      ranges[feature].max,
    );

    total += Math.pow(inputValue - recordValue, 2);
  }

  return Math.sqrt(total);
}

function calculateRanges(records: CropRecord[]) {
  const features: (keyof CropInput)[] = [
    "N",
    "P",
    "K",
    "temperature",
    "humidity",
    "ph",
    "rainfall",
  ];

  const ranges = {} as Record<
    keyof CropInput,
    { min: number; max: number }
  >;

  for (const feature of features) {
    const values = records.map(
      (record) => record[feature],
    );

    ranges[feature] = {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }

  return ranges;
}

export async function recommendCrop(
  input: CropInput,
): Promise<CropRecommendation> {
  const records = await loadCropDataset();

  if (!records.length) {
    throw new Error("Crop dataset is empty");
  }

  const ranges = calculateRanges(records);

  const distances = records.map((record) => ({
    record,
    distance: calculateDistance(
      input,
      record,
      ranges,
    ),
  }));

  distances.sort(
    (a, b) => a.distance - b.distance,
  );

  const nearestRecords = distances.slice(0, 25);

  const cropScores = new Map<string, number>();

  for (const item of nearestRecords) {
    const crop = item.record.label;

    const similarity =
      1 / (1 + item.distance);

    cropScores.set(
      crop,
      (cropScores.get(crop) ?? 0) +
        similarity,
    );
  }

  const rankedCrops = Array.from(
    cropScores.entries(),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const bestCrop = rankedCrops[0];

  if (!bestCrop) {
    throw new Error(
      "Unable to generate crop recommendation",
    );
  }

  const totalScore = rankedCrops.reduce(
    (sum, [, score]) => sum + score,
    0,
  );

  const confidence =
    totalScore > 0
      ? Math.round(
          (bestCrop[1] / totalScore) * 100,
        )
      : 0;

  return {
    crop: bestCrop[0],
    score: confidence,
    matches: nearestRecords.filter(
      (item) =>
        item.record.label === bestCrop[0],
    ).length,
    totalSamples: records.length,
  };
}