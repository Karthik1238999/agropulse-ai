"use client";

import {
  CloudRain,
  CloudSun,
  Droplets,
  Thermometer,
  Wind,
  X,
} from "lucide-react";

export type WeatherData = {
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

type FarmWeatherOverlayProps = {
  weather: WeatherData | null;
  loading?: boolean;
  error?: string | null;
  onClose?: () => void;
};

export default function FarmWeatherOverlay({
  weather,
  loading = false,
  error = null,
  onClose,
}: FarmWeatherOverlayProps) {
  if (loading) {
    return (
      <div className="absolute bottom-4 left-4 z-[1000] w-[300px] rounded-2xl border border-white/10 bg-[#080c09]/95 p-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7dff9a]/10">
            <CloudSun
              size={17}
              className="animate-pulse text-[#7dff9a]"
            />
          </div>

          <div>
            <p className="text-xs font-medium text-white">
              Loading weather
            </p>

            <p className="mt-1 text-[9px] text-[#667269]">
              Fetching live farm conditions...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute bottom-4 left-4 z-[1000] w-[300px] rounded-2xl border border-[#ff6b6b]/10 bg-[#0d0909]/95 p-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#ff6b6b]/10">
            <CloudRain
              size={17}
              className="text-[#ff6b6b]"
            />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium text-white">
              Weather unavailable
            </p>

            <p className="mt-1 text-[9px] leading-4 text-[#667269]">
              {error}
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto rounded-lg p-1 text-[#667269] transition hover:bg-white/[0.05] hover:text-white"
              aria-label="Close weather panel"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const updatedTime = new Date(
    weather.updatedAt,
  );

  const formattedUpdatedTime = updatedTime.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  const weatherIcon =
    weather.weatherCode === 0 ||
    weather.weatherCode === 1
      ? CloudSun
      : weather.weatherCode >= 51
        ? CloudRain
        : CloudSun;

  const WeatherIcon = weatherIcon;

  return (
    <div className="absolute bottom-4 left-4 z-[1000] w-[330px] overflow-hidden rounded-2xl border border-white/10 bg-[#080c09]/95 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-white/[0.06] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7dff9a]/10">
            <WeatherIcon
              size={19}
              className="text-[#7dff9a]"
            />
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-[0.15em] text-[#667269]">
              Live weather
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              {weather.location}
            </p>

            <p className="mt-1 text-[9px] text-[#667269]">
              Updated {formattedUpdatedTime}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#667269] transition hover:bg-white/[0.05] hover:text-white"
            aria-label="Close weather panel"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Main weather */}
      <div className="p-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-4xl font-semibold tracking-[-0.05em] text-white">
              {weather.temperature.toFixed(1)}°
            </p>

            <p className="mt-1 text-[10px] text-[#78837c]">
              {weather.weatherDescription}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[9px] uppercase tracking-wider text-[#667269]">
              Day status
            </p>

            <p className="mt-1 text-[10px] font-medium text-[#7dff9a]">
              {weather.isDay ? "Daytime" : "Night"}
            </p>
          </div>
        </div>

        {/* Weather metrics */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <WeatherMetric
            icon={<Droplets size={12} />}
            label="Humidity"
            value={`${weather.humidity.toFixed(0)}%`}
          />

          <WeatherMetric
            icon={<CloudRain size={12} />}
            label="Rain"
            value={`${weather.rainfall.toFixed(
              1,
            )} mm`}
          />

          <WeatherMetric
            icon={<Wind size={12} />}
            label="Wind"
            value={`${weather.windSpeed.toFixed(
              1,
            )} km/h`}
          />

          <WeatherMetric
            icon={<Thermometer size={12} />}
            label="Feels"
            value={`${weather.temperature.toFixed(
              1,
            )}°C`}
          />
        </div>

        {/* Location */}
        <div className="mt-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[8px] uppercase tracking-wider text-[#4f5b53]">
              Coordinates
            </span>

            <span className="text-[9px] text-[#667269]">
              {weather.latitude.toFixed(4)},{" "}
              {weather.longitude.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Live status */}
        <div className="mt-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7dff9a] shadow-[0_0_8px_#7dff9a]" />

          <span className="text-[8px] uppercase tracking-[0.14em] text-[#7dff9a]">
            Live weather data
          </span>
        </div>
      </div>
    </div>
  );
}

function WeatherMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
      <div className="flex items-center gap-2">
        <span className="text-[#7dff9a]">
          {icon}
        </span>

        <span className="text-[8px] uppercase tracking-wider text-[#667269]">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-[#dce5df]">
        {value}
      </p>
    </div>
  );
}