export type FarmRisk = "Low" | "Moderate" | "High";

export type FarmZone = {
  id: string;
  name: string;
  crop: string;

  health: number;
  moisture: number;
  temperature: number;

  humidity: number;
  rainfall: number;

  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;

  risk: FarmRisk;
  status: "Healthy" | "Watch" | "Critical";

  coordinates: [number, number];
  polygon: [number, number][];
};

export const FARM_CENTER: [number, number] = [
  16.35189,
  80.7809,
];

export const FARM_BOUNDARY: [number, number][] = [
  [16.35325, 80.77895],
  [16.35355, 80.78115],
  [16.35285, 80.78305],
  [16.35115, 80.78345],
  [16.34985, 80.7822],
  [16.34955, 80.77985],
  [16.35045, 80.77855],
];

export const farmZones: FarmZone[] = [
  {
    id: "north-field",
    name: "North Field",
    crop: "Rice",

    health: 94,
    moisture: 68,
    temperature: 29.2,

    humidity: 74,
    rainfall: 2.4,

    nitrogen: 82,
    phosphorus: 71,
    potassium: 78,
    ph: 6.6,

    risk: "Low",
    status: "Healthy",

    coordinates: [
      16.35265,
      80.78045,
    ],

    polygon: [
      [16.35325, 80.77895],
      [16.35355, 80.78115],
      [16.35255, 80.78135],
      [16.35195, 80.78015],
    ],
  },

  {
    id: "east-field",
    name: "East Field",
    crop: "Cotton",

    health: 87,
    moisture: 61,
    temperature: 30.1,

    humidity: 69,
    rainfall: 1.8,

    nitrogen: 76,
    phosphorus: 68,
    potassium: 73,
    ph: 6.8,

    risk: "Low",
    status: "Healthy",

    coordinates: [
      16.35205,
      80.78215,
    ],

    polygon: [
      [16.35355, 80.78115],
      [16.35285, 80.78305],
      [16.35165, 80.78275],
      [16.35255, 80.78135],
    ],
  },

  {
    id: "south-field",
    name: "South Field",
    crop: "Maize",

    health: 76,
    moisture: 48,
    temperature: 31.4,

    humidity: 61,
    rainfall: 0.6,

    nitrogen: 64,
    phosphorus: 57,
    potassium: 62,
    ph: 6.4,

    risk: "Moderate",
    status: "Watch",

    coordinates: [
      16.35035,
      80.78145,
    ],

    polygon: [
      [16.35195, 80.78015],
      [16.35115, 80.78345],
      [16.34985, 80.7822],
      [16.34955, 80.77985],
      [16.35045, 80.77855],
    ],
  },

  {
    id: "west-field",
    name: "West Field",
    crop: "Chilli",

    health: 91,
    moisture: 64,
    temperature: 29.7,

    humidity: 72,
    rainfall: 2.1,

    nitrogen: 79,
    phosphorus: 73,
    potassium: 81,
    ph: 6.7,

    risk: "Low",
    status: "Healthy",

    coordinates: [
      16.35135,
      80.77915,
    ],

    polygon: [
      [16.35325, 80.77895],
      [16.35195, 80.78015],
      [16.35045, 80.77855],
    ],
  },
];

export function getFarmZone(
  zoneName?: string | null,
  zoneId?: string | null,
): FarmZone | undefined {
  if (zoneId) {
    const zoneById = farmZones.find(
      (zone) => zone.id === zoneId,
    );

    if (zoneById) {
      return zoneById;
    }
  }

  if (zoneName) {
    const zoneByName = farmZones.find(
      (zone) => zone.name === zoneName,
    );

    if (zoneByName) {
      return zoneByName;
    }
  }

  return undefined;
}

export const farmSummary = {
  cropHealth: Math.round(
    farmZones.reduce(
      (sum, zone) => sum + zone.health,
      0,
    ) / farmZones.length,
  ),

  soilMoisture: Math.round(
    farmZones.reduce(
      (sum, zone) => sum + zone.moisture,
      0,
    ) / farmZones.length,
  ),

  temperature: Number(
    (
      farmZones.reduce(
        (sum, zone) => sum + zone.temperature,
        0,
      ) / farmZones.length
    ).toFixed(1),
  ),

  risk: farmZones.some(
    (zone) => zone.risk === "High",
  )
    ? "High"
    : farmZones.some(
          (zone) => zone.risk === "Moderate",
        )
      ? "Moderate"
      : "Low",
};

export const aiPrediction = {
  predictedHealth: Math.min(
    100,
    farmSummary.cropHealth + 4,
  ),

  confidence: 92,

  diseasePressure: 18,

  waterStress: 24,

  heatStress: 46,

  recommendation:
    "Prioritize irrigation checks in South Field while maintaining current schedules elsewhere.",
};

export function getAverageHealth() {
  return farmSummary.cropHealth;
}

export function getAverageMoisture() {
  return farmSummary.soilMoisture;
}

export function getAverageTemperature() {
  return farmSummary.temperature;
}

export function getZone(
  zoneName?: string | null,
) {
  return getFarmZone(zoneName);
}