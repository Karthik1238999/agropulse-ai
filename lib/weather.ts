// lib/weather.ts

export type FarmWeather = {
  location: string;
  latitude: number;
  longitude: number;

  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;

  weatherCode: number;
  weatherDescription: string;

  isDay: boolean;

  updatedAt: string;
};

const FARM_LOCATION = {
  name: "AgroPulse Farm",
  latitude: 16.5062,
  longitude: 80.648,
};

/*
 * Open-Meteo does not require an API key.
 *
 * Weather data:
 * - Current temperature
 * - Relative humidity
 * - Precipitation
 * - Wind speed
 * - Weather condition
 */

function getWeatherDescription(code: number): string {
  switch (code) {
    case 0:
      return "Clear sky";

    case 1:
      return "Mainly clear";

    case 2:
      return "Partly cloudy";

    case 3:
      return "Overcast";

    case 45:
    case 48:
      return "Foggy";

    case 51:
    case 53:
    case 55:
      return "Drizzle";

    case 56:
    case 57:
      return "Freezing drizzle";

    case 61:
    case 63:
    case 65:
      return "Rain";

    case 66:
    case 67:
      return "Freezing rain";

    case 71:
    case 73:
    case 75:
      return "Snow";

    case 77:
      return "Snow grains";

    case 80:
    case 81:
    case 82:
      return "Rain showers";

    case 85:
    case 86:
      return "Snow showers";

    case 95:
      return "Thunderstorm";

    case 96:
    case 99:
      return "Thunderstorm with hail";

    default:
      return "Unknown";
  }
}

export async function getFarmWeather(): Promise<FarmWeather> {
  const url = new URL(
    "https://api.open-meteo.com/v1/forecast",
  );

  url.searchParams.set(
    "latitude",
    String(FARM_LOCATION.latitude),
  );

  url.searchParams.set(
    "longitude",
    String(FARM_LOCATION.longitude),
  );

  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "relative_humidity_2m",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "is_day",
    ].join(","),
  );

  url.searchParams.set("timezone", "auto");

  const response = await fetch(url.toString(), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Weather service returned ${response.status}`,
    );
  }

  const data = await response.json();

  if (!data.current) {
    throw new Error(
      "Weather service returned invalid data.",
    );
  }

  const current = data.current;

  return {
    location: FARM_LOCATION.name,

    latitude: FARM_LOCATION.latitude,
    longitude: FARM_LOCATION.longitude,

    temperature: Number(
      current.temperature_2m ?? 0,
    ),

    humidity: Number(
      current.relative_humidity_2m ?? 0,
    ),

    rainfall: Number(
      current.precipitation ?? 0,
    ),

    windSpeed: Number(
      current.wind_speed_10m ?? 0,
    ),

    weatherCode: Number(
      current.weather_code ?? 0,
    ),

    weatherDescription:
      getWeatherDescription(
        Number(current.weather_code ?? 0),
      ),

    isDay: Boolean(
      Number(current.is_day ?? 1),
    ),

    updatedAt: new Date().toISOString(),
  };
}