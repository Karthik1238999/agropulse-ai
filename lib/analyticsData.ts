import {
  CropRecord,
  loadCropDataset,
} from "@/lib/cropData";

export type CropStatistics = {
  crop: string;
  samples: number;
  averageN: number;
  averageP: number;
  averageK: number;
  averageTemperature: number;
  averageHumidity: number;
  averagePh: number;
  averageRainfall: number;
};

export type DatasetAnalytics = {
  totalSamples: number;
  cropCount: number;

  averages: {
    N: number;
    P: number;
    K: number;
    temperature: number;
    humidity: number;
    ph: number;
    rainfall: number;
  };

  crops: CropStatistics[];
};

function average(values: number[]) {
  if (!values.length) return 0;

  return Number(
    (
      values.reduce((sum, value) => sum + value, 0) /
      values.length
    ).toFixed(2),
  );
}

export async function getDatasetAnalytics(): Promise<DatasetAnalytics> {
  const records = await loadCropDataset();

  if (!records.length) {
    throw new Error("Crop dataset is empty");
  }

  const cropMap = new Map<string, CropRecord[]>();

  for (const record of records) {
    const existing = cropMap.get(record.label) ?? [];

    existing.push(record);

    cropMap.set(record.label, existing);
  }

  const crops: CropStatistics[] = Array.from(
    cropMap.entries(),
  )
    .map(([crop, cropRecords]) => ({
      crop,
      samples: cropRecords.length,

      averageN: average(
        cropRecords.map((record) => record.N),
      ),

      averageP: average(
        cropRecords.map((record) => record.P),
      ),

      averageK: average(
        cropRecords.map((record) => record.K),
      ),

      averageTemperature: average(
        cropRecords.map(
          (record) => record.temperature,
        ),
      ),

      averageHumidity: average(
        cropRecords.map(
          (record) => record.humidity,
        ),
      ),

      averagePh: average(
        cropRecords.map((record) => record.ph),
      ),

      averageRainfall: average(
        cropRecords.map(
          (record) => record.rainfall,
        ),
      ),
    }))
    .sort((a, b) => a.crop.localeCompare(b.crop));

  return {
    totalSamples: records.length,

    cropCount: crops.length,

    averages: {
      N: average(records.map((record) => record.N)),
      P: average(records.map((record) => record.P)),
      K: average(records.map((record) => record.K)),
      temperature: average(
        records.map(
          (record) => record.temperature,
        ),
      ),
      humidity: average(
        records.map(
          (record) => record.humidity,
        ),
      ),
      ph: average(
        records.map((record) => record.ph),
      ),
      rainfall: average(
        records.map(
          (record) => record.rainfall,
        ),
      ),
    },

    crops,
  };
}