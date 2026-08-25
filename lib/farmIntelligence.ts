import {
  farmZones,
  type FarmRisk,
} from "@/lib/farmData";

export type FieldIntelligence = {
  field: (typeof farmZones)[number];

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

  recommendations: string[];
};

export function getFieldIntelligence(
  zoneName: string,
): FieldIntelligence | undefined {
  const zone = farmZones.find(
    (field) => field.name === zoneName,
  );

  if (!zone) {
    return undefined;
  }

  const recommendations: string[] = [];

  /*
   * Moisture analysis
   */

  if (zone.moisture < 40) {
    recommendations.push(
      "Soil moisture is critically low. Immediate irrigation is recommended.",
    );
  } else if (zone.moisture < 55) {
    recommendations.push(
      "Soil moisture is below the preferred range. Inspect irrigation within 24 hours.",
    );
  } else if (zone.moisture > 80) {
    recommendations.push(
      "Soil moisture is high. Avoid unnecessary irrigation and monitor drainage.",
    );
  } else {
    recommendations.push(
      "Soil moisture is within a favorable range for current crop conditions.",
    );
  }

  /*
   * Temperature analysis
   */

  if (zone.temperature >= 35) {
    recommendations.push(
      "Temperature is critically elevated. Monitor crop heat stress and increase field observations.",
    );
  } else if (zone.temperature >= 32) {
    recommendations.push(
      "Elevated temperature may increase crop water demand.",
    );
  } else {
    recommendations.push(
      "Temperature is currently within a normal range for field monitoring.",
    );
  }

  /*
   * Crop health
   */

  if (zone.health < 70) {
    recommendations.push(
      "Crop health requires immediate inspection for possible stress or disease indicators.",
    );
  } else if (zone.health < 85) {
    recommendations.push(
      "Crop health should be monitored closely over the next few days.",
    );
  } else {
    recommendations.push(
      "Crop health is currently within a healthy range.",
    );
  }

  /*
   * Risk-specific recommendation
   */

  if (zone.risk === "High") {
    recommendations.push(
      "Prioritize this field for immediate agricultural intervention.",
    );
  } else if (zone.risk === "Moderate") {
    recommendations.push(
      "Continue close monitoring until moisture and environmental conditions stabilize.",
    );
  } else {
    recommendations.push(
      "Continue the current irrigation and monitoring schedule.",
    );
  }

  return {
    field: zone,

    id: zone.id,
    name: zone.name,
    crop: zone.crop,

    health: zone.health,
    moisture: zone.moisture,
    temperature: zone.temperature,

    humidity: zone.humidity,
    rainfall: zone.rainfall,

    nitrogen: zone.nitrogen,
    phosphorus: zone.phosphorus,
    potassium: zone.potassium,
    ph: zone.ph,

    risk: zone.risk,

    recommendations,
  };
}

export function getFarmIntelligence() {
  const health = Math.round(
    farmZones.reduce(
      (sum, zone) => sum + zone.health,
      0,
    ) / farmZones.length,
  );

  const risk = farmZones.some(
    (zone) => zone.risk === "High",
  )
    ? "High"
    : farmZones.some(
          (zone) => zone.risk === "Moderate",
        )
      ? "Moderate"
      : "Low";

  const attentionFields = farmZones.filter(
    (zone) => zone.status !== "Healthy",
  );

  return {
    health,

    risk,

    attentionFields,

    healthyFields: farmZones.filter(
      (zone) => zone.status === "Healthy",
    ),

    attentionCount:
      attentionFields.length,

    riskDistribution: {
      low: farmZones.filter(
        (zone) => zone.risk === "Low",
      ).length,

      moderate: farmZones.filter(
        (zone) => zone.risk === "Moderate",
      ).length,

      high: farmZones.filter(
        (zone) => zone.risk === "High",
      ).length,
    },
  };
}