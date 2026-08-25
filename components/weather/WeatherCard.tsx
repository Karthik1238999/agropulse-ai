"use client";

import { useEffect, useState } from "react";
import {
  Cloud,
  CloudRain,
  Droplets,
  Loader2,
  Thermometer,
  Wind,
  Sun,
  CloudSun,
} from "lucide-react";

type WeatherData = {
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  weatherCode: number;
  weatherDescription: string;
  isDay: boolean;
  updatedAt: string;
};

type WeatherResponse = {
  success: boolean;
  weather?: WeatherData;
  error?: string;
};

function WeatherIcon({
  code,
  isDay,
}: {
  code: number;
  isDay: boolean;
}) {
  if (code === 0) {
    return (
      <Sun
        size={28}
        className="text-[#7dff9a]"
      />
    );
  }

  if (code >= 1 && code <= 3) {
    return (
      <CloudSun
        size={28}
        className="text-[#7dff9a]"
      />
    );
  }

  if (code >= 51 && code <= 67) {
    return (
      <CloudRain
        size={28}
        className="text-[#7dff9a]"
      />
    );
  }

  if (code >= 80 && code <= 82) {
    return (
      <CloudRain
        size={28}
        className="text-[#7dff9a]"
      />
    );
  }

  if (code >= 95) {
    return (
      <CloudRain
        size={28}
        className="text-[#f6c453]"
      />
    );
  }

  return (
    <Cloud
      size={28}
      className="text-[#7dff9a]"
    />
  );
}

export default function WeatherCard() {
  const [weather, setWeather] =
    useState<WeatherData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  async function loadWeather() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "/api/weather",
        {
          cache: "no-store",
        },
      );

      const data: WeatherResponse =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ??
            "Unable to load weather.",
        );
      }

      setWeather(data.weather ?? null);
    } catch (err) {
      console.error(
        "Weather loading error:",
        err,
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load weather.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadWeather();
    }, 0);

    const interval = setInterval(
      loadWeather,
      10 * 60 * 1000,
    );

    return () => {
      clearTimeout(initialLoad);
      clearInterval(interval);
    };
  }, []);

  if (loading && !weather) {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5">
        <div className="flex items-center gap-2">
          <Loader2
            size={15}
            className="animate-spin text-[#7dff9a]"
          />

          <span className="text-xs text-[#78837c]">
            Loading live weather...
          </span>
        </div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="rounded-2xl border border-[#ff6b6b]/15 bg-[#0d0b0b] p-5">
        <p className="text-xs font-medium text-[#ff6b6b]">
          Weather unavailable
        </p>

        <p className="mt-2 text-[10px] text-[#8d9891]">
          {error}
        </p>

        <button
          onClick={loadWeather}
          className="mt-3 rounded-lg border border-white/[0.07] px-3 py-2 text-[10px] text-[#8d9891] hover:bg-white/[0.04]"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[#7dff9a]/10 bg-gradient-to-br from-[#0b160e] to-[#080c09] p-5">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7dff9a] shadow-[0_0_8px_#7dff9a]" />

            <span className="text-[9px] uppercase tracking-[0.18em] text-[#667269]">
              Live weather
            </span>
          </div>

          <h2 className="mt-2 text-sm font-medium">
            {weather.location}
          </h2>
        </div>

        <WeatherIcon
          code={weather.weatherCode}
          isDay={weather.isDay}
        />

      </div>

      {/* Main temperature */}
      <div className="mt-5 flex items-end gap-3">

        <span className="text-5xl font-semibold tracking-tight">
          {weather.temperature.toFixed(1)}°
        </span>

        <div className="mb-2">
          <p className="text-xs text-[#8d9891]">
            {weather.weatherDescription}
          </p>

          <p className="mt-1 text-[9px] text-[#667269]">
            Real-time conditions
          </p>
        </div>

      </div>

      {/* Metrics */}
      <div className="mt-5 grid grid-cols-3 gap-2">

        <WeatherMetric
          icon={Droplets}
          label="Humidity"
          value={`${weather.humidity}%`}
        />

        <WeatherMetric
          icon={CloudRain}
          label="Rain"
          value={`${weather.rainfall} mm`}
        />

        <WeatherMetric
          icon={Wind}
          label="Wind"
          value={`${weather.windSpeed} km/h`}
        />

      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3">

        <span className="text-[9px] text-[#4f5b53]">
          Updated automatically
        </span>

        <button
          onClick={loadWeather}
          disabled={loading}
          className="text-[9px] text-[#7dff9a] transition hover:text-white disabled:opacity-50"
        >
          {loading
            ? "Refreshing..."
            : "Refresh"}
        </button>

      </div>

    </div>
  );
}

function WeatherMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">

      <Icon
        size={13}
        className="text-[#7dff9a]"
      />

      <p className="mt-2 text-[9px] text-[#667269]">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium">
        {value}
      </p>

    </div>
  );
}