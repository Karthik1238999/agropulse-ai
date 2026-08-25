"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowUpRight,
  CloudSun,
  Droplets,
  Leaf,
  Map,
  Navigation,
  RefreshCw,
  ShieldCheck,
  Thermometer,
  Wind,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { farmZones } from "@/lib/farmData";

const FarmMap = dynamic(
  () => import("@/components/map/FarmMap"),
  {
    ssr: false,

    loading: () => (
      <div className="flex h-full items-center justify-center bg-[#0a0f0c]">
        <div className="text-center">

          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#7dff9a]/20 border-t-[#7dff9a]" />

          <p className="mt-3 text-xs text-[#667269]">
            Loading farm intelligence map...
          </p>

        </div>
      </div>
    ),
  },
);

type WeatherData = {
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

type WeatherResponse = {
  success: boolean;
  weather?: WeatherData;
  error?: string;
};

const legend = [
  {
    label: "Healthy",
    color: "#7dff9a",
  },
  {
    label: "Needs attention",
    color: "#f6c453",
  },
  {
    label: "Critical",
    color: "#ff6b6b",
  },
];

export default function MapPage() {
  const [refreshing, setRefreshing] =
    useState(false);

  const [weather, setWeather] =
    useState<WeatherData | null>(null);

  const [weatherLoading, setWeatherLoading] =
    useState(true);

  const [weatherError, setWeatherError] =
    useState<string | null>(null);

  async function loadWeather() {
    try {
      setWeatherLoading(true);
      setWeatherError(null);

      const response = await fetch(
        "/api/weather",
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data: WeatherResponse =
        await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.weather
      ) {
        throw new Error(
          data.error ??
            "Unable to load weather data.",
        );
      }

      setWeather(data.weather);

    } catch (error) {
      console.error(
        "Farm map weather error:",
        error,
      );

      setWeatherError(
        error instanceof Error
          ? error.message
          : "Unable to load weather.",
      );

    } finally {
      setWeatherLoading(false);
    }
  }

  useEffect(() => {
    const initialLoad =
      window.setTimeout(() => {
        void loadWeather();
      }, 0);

    return () =>
      clearTimeout(initialLoad);
  }, []);

  async function handleRefresh() {
    setRefreshing(true);

    await loadWeather();

    setTimeout(() => {
      setRefreshing(false);
    }, 300);
  }

  const averageHealth = Math.round(
    farmZones.reduce(
      (sum, zone) =>
        sum + zone.health,
      0,
    ) / farmZones.length,
  );

  const averageMoisture = Math.round(
    farmZones.reduce(
      (sum, zone) =>
        sum + zone.moisture,
      0,
    ) / farmZones.length,
  );

  const attentionZone =
    farmZones.find(
      (zone) =>
        zone.risk === "Moderate" ||
        zone.risk === "High",
    );

  return (
    <main className="min-h-screen bg-[#050706] text-[#f4f7f4]">

      <div className="relative min-h-screen overflow-hidden">

        {/* Background */}

        <div className="pointer-events-none fixed inset-0 overflow-hidden">

          <div className="absolute left-[15%] top-[-10%] h-[450px] w-[450px] rounded-full bg-[#7dff9a]/[0.025] blur-[120px]" />

          <div className="absolute bottom-[-10%] right-[-10%] h-[450px] w-[450px] rounded-full bg-emerald-400/[0.025] blur-[120px]" />

        </div>

        {/* Header */}

        <header className="relative z-20 flex h-[72px] items-center justify-between border-b border-white/[0.06] bg-[#050706]/90 px-5 backdrop-blur-xl lg:px-8">

          <div className="flex items-center gap-4">

            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl border border-white/[0.07] px-3 py-2 text-xs text-[#8d9891] transition hover:bg-white/[0.04] hover:text-white"
            >
              <ArrowLeft size={14} />
              Dashboard
            </Link>

            <div className="hidden h-5 w-px bg-white/10 sm:block" />

            <div className="flex items-center gap-2">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7dff9a]/10">

                <Map
                  size={16}
                  className="text-[#7dff9a]"
                />

              </div>

              <div>

                <h1 className="text-sm font-semibold">
                  Farm Map
                </h1>

                <p className="text-[9px] uppercase tracking-[0.15em] text-[#667269]">
                  Spatial intelligence
                </p>

              </div>

            </div>

          </div>

          <div className="hidden items-center gap-2 sm:flex">

            <span className="h-2 w-2 rounded-full bg-[#7dff9a] shadow-[0_0_10px_#7dff9a]" />

            <span className="text-[10px] text-[#78837c]">
              Live farm data
            </span>

          </div>

        </header>

        {/* Content */}

        <div className="relative mx-auto max-w-[1600px] p-5 lg:p-8">

          <div className="mb-5 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#667269]">

                <span className="h-1.5 w-1.5 rounded-full bg-[#7dff9a]" />

                Spatial intelligence

              </div>

              <h2 className="text-3xl font-semibold sm:text-4xl">

                Green Valley{" "}

                <span className="text-[#7dff9a]">
                  Farm Map
                </span>

              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#78837c]">
                Explore crop health, soil moisture
                and environmental conditions across
                your farm zones.
              </p>

            </div>

            <div className="flex flex-wrap items-center gap-2">

              <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-2.5">

                <Navigation
                  size={13}
                  className="text-[#7dff9a]"
                />

                <span className="text-xs">
                  North Valluru, Andhra Pradesh, IN
                </span>

              </div>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5 text-xs text-[#8d9891] transition hover:bg-white/[0.05] hover:text-white disabled:opacity-60"
              >

                <RefreshCw
                  size={13}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />

                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}

              </button>

            </div>

          </div>

          {/* Summary */}

          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">

            <SummaryCard
              icon={<Leaf size={15} />}
              label="Farm health"
              value={`${averageHealth}/100`}
              detail="Current average"
            />

            <SummaryCard
              icon={<Droplets size={15} />}
              label="Average moisture"
              value={`${averageMoisture}%`}
              detail="Across all zones"
            />

            <SummaryCard
              icon={<Thermometer size={15} />}
              label="Farm temperature"
              value={
                weather
                  ? `${weather.temperature.toFixed(1)}°C`
                  : weatherLoading
                    ? "..."
                    : "--"
              }
              detail={
                weather
                  ? weather.weatherDescription
                  : weatherError
                    ? "Unavailable"
                    : "Loading"
              }
            />

          </div>

          {/* Map */}

          <div className="relative h-[600px] overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0f0c]">

            <FarmMap
              weather={weather}
              weatherLoading={weatherLoading}
              weatherError={weatherError}
            />

            <div className="absolute right-4 top-4 z-[1000] rounded-xl border border-white/10 bg-[#080c09]/95 p-3 shadow-xl backdrop-blur-xl">

              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#667269]">
                Zone status
              </p>

              <div className="space-y-2">

                {legend.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2"
                  >

                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          item.color,
                        boxShadow: `0 0 8px ${item.color}`,
                      }}
                    />

                    <span className="text-[10px] text-[#8d9891]">
                      {item.label}
                    </span>

                  </div>
                ))}

              </div>

            </div>

            <div className="absolute bottom-4 right-4 z-[1000] rounded-xl border border-white/10 bg-[#080c09]/90 px-3 py-2 text-[9px] text-[#667269] backdrop-blur-xl">
              Click a field to inspect AI intelligence
            </div>

          </div>

          {/* Weather */}

          <section className="mt-4 rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <CloudSun
                    size={16}
                    className="text-[#7dff9a]"
                  />

                  <h3 className="text-sm font-semibold">
                    Live farm weather
                  </h3>

                </div>

                <p className="mt-1 text-[9px] text-[#667269]">
                  Real-time environmental conditions
                </p>

              </div>

              {weather && (
                <span className="rounded-full bg-[#7dff9a]/5 px-2 py-1 text-[8px] text-[#7dff9a]">
                  Live
                </span>
              )}

            </div>

            {weatherLoading ? (
              <p className="text-xs text-[#667269]">
                Loading live weather...
              </p>
            ) : weatherError ? (
              <p className="text-xs text-[#ff6b6b]">
                {weatherError}
              </p>
            ) : weather ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">

                <WeatherCard
                  icon={<Thermometer size={15} />}
                  label="Temperature"
                  value={`${weather.temperature.toFixed(1)}°C`}
                  detail={weather.weatherDescription}
                />

                <WeatherCard
                  icon={<Droplets size={15} />}
                  label="Humidity"
                  value={`${weather.humidity}%`}
                  detail="Current humidity"
                />

                <WeatherCard
                  icon={<Wind size={15} />}
                  label="Wind speed"
                  value={`${weather.windSpeed.toFixed(1)} km/h`}
                  detail="Current wind"
                />

                <WeatherCard
                  icon={<CloudSun size={15} />}
                  label="Rainfall"
                  value={`${weather.rainfall} mm`}
                  detail="Current rainfall"
                />

              </div>
            ) : null}

          </section>

          {/* Bottom cards */}

          <div className="mt-4 grid gap-3 md:grid-cols-2">

            <div className="rounded-2xl border border-[#7dff9a]/10 bg-[#0b160e] p-5">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7dff9a]/10">

                  <ShieldCheck
                    size={17}
                    className="text-[#7dff9a]"
                  />

                </div>

                <div>

                  <p className="text-sm font-medium">
                    AI Spatial Intelligence
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#78837c]">
                    Field boundaries, crop health,
                    moisture and environmental data
                    are combined to identify zones
                    requiring attention.
                  </p>

                </div>

              </div>

              <Link
                href="/decision-center"
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#7dff9a]/15 bg-[#7dff9a]/[0.05] px-4 py-2.5 text-xs font-medium text-[#7dff9a]"
              >
                Open Decision Center
                <ArrowUpRight size={13} />
              </Link>

            </div>

            {attentionZone && (
              <div className="rounded-2xl border border-[#f6c453]/10 bg-[#0d0d09] p-5">

                <div className="flex items-start gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f6c453]/10">

                    <Droplets
                      size={17}
                      className="text-[#f6c453]"
                    />

                  </div>

                  <div>

                    <p className="text-sm font-medium">
                      Field requiring attention
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#78837c]">
                      {attentionZone.name} currently
                      requires additional monitoring.
                    </p>

                  </div>

                </div>

                <Link
                  href={`/decision-center?zone=${encodeURIComponent(
                    attentionZone.name,
                  )}&id=${attentionZone.id}`}
                  className="mt-4 flex items-center justify-between rounded-xl border border-[#f6c453]/10 bg-[#f6c453]/[0.035] px-3 py-2.5"
                >

                  <div>

                    <p className="text-xs font-medium">
                      {attentionZone.name}
                    </p>

                    <p className="mt-1 text-[9px] text-[#667269]">
                      {attentionZone.crop} ·{" "}
                      {attentionZone.moisture}% moisture
                    </p>

                  </div>

                  <span className="rounded-full bg-[#f6c453]/10 px-2 py-1 text-[9px] text-[#f6c453]">
                    {attentionZone.risk} risk
                  </span>

                </Link>

              </div>
            )}

          </div>

          <div className="mt-6 border-t border-white/[0.05] pt-4 text-[10px] text-[#4f5b53]">
            AgroPulse AI · Spatial Intelligence
          </div>

        </div>
      </div>
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-4">

      <div className="flex items-center gap-2">

        <span className="text-[#7dff9a]">
          {icon}
        </span>

        <span className="text-[10px] uppercase tracking-[0.14em] text-[#667269]">
          {label}
        </span>

      </div>

      <div className="mt-3 flex items-end justify-between gap-2">

        <span className="text-2xl font-semibold">
          {value}
        </span>

        <span className="text-right text-[9px] text-[#7dff9a]">
          {detail}
        </span>

      </div>

    </div>
  );
}

function WeatherCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">

      <div className="flex items-center gap-2 text-[#7dff9a]">

        {icon}

        <span className="text-[9px] uppercase tracking-wider text-[#667269]">
          {label}
        </span>

      </div>

      <div className="mt-4">

        <span className="text-2xl font-semibold">
          {value}
        </span>

        <p className="mt-1 text-[9px] text-[#667269]">
          {detail}
        </p>

      </div>

    </div>
  );
}