"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Droplets,
  Leaf,
  ShieldCheck,
  Thermometer,
  TrendingUp,
  AlertTriangle,
  Database,
  Sprout,
  FlaskConical,
  CloudRain,
  BarChart3,
} from "lucide-react";

import {
  farmSummary,
  farmZones,
  getAverageHealth,
  getAverageMoisture,
  getAverageTemperature,
  getZone,
} from "@/lib/farmData";

import type { DatasetAnalytics } from "@/lib/analyticsData";

export default function AnalyticsPage() {
  const searchParams = useSearchParams();
  const zoneName = searchParams.get("zone");

  const selectedZone = zoneName
    ? getZone(zoneName)
    : undefined;

  const health =
    selectedZone?.health ?? getAverageHealth();

  const moisture =
    selectedZone?.moisture ?? getAverageMoisture();

  const temperature =
    selectedZone?.temperature ??
    getAverageTemperature();

  const risk =
    selectedZone?.risk ?? farmSummary.risk;

  const displayName =
    selectedZone?.name ?? "Whole Farm";

  const displayCrop =
    selectedZone?.crop ?? "All crop zones";

  const [dataset, setDataset] =
    useState<DatasetAnalytics | null>(null);

  const [datasetError, setDatasetError] =
    useState<string | null>(null);

  const [loadingDataset, setLoadingDataset] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAnalytics() {
      try {
        setLoadingDataset(true);

        const response = await fetch(
          "/api/analytics",
          { cache: "no-store" },
        );

        const data: {
          success: boolean;
          analytics?: DatasetAnalytics;
          error?: string;
        } = await response.json();

        if (!response.ok || !data.success || !data.analytics) {
          throw new Error(
            data.error ??
              "Unable to load crop dataset analytics.",
          );
        }

        if (mounted) {
          setDataset(data.analytics);
          setDatasetError(null);
        }
      } catch (error) {
        console.error(
          "Dataset analytics error:",
          error,
        );

        if (mounted) {
          setDatasetError(
            "Unable to load crop dataset analytics.",
          );
        }
      } finally {
        if (mounted) {
          setLoadingDataset(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      mounted = false;
    };
  }, []);

  const selectedCropDataset = useMemo(() => {
    if (!dataset || !selectedZone) {
      return null;
    }

    return (
      dataset.crops.find(
        (crop) =>
          crop.crop.toLowerCase() ===
          selectedZone.crop.toLowerCase(),
      ) ?? null
    );
  }, [dataset, selectedZone]);

  return (
    <main className="min-h-screen bg-[#050706] text-[#f4f7f4]">
      <div className="min-h-screen">
        {/* Header */}
        <header className="flex h-[72px] items-center justify-between border-b border-white/[0.06] bg-[#050706]/95 px-5 backdrop-blur-xl lg:px-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl border border-white/[0.07] px-3 py-2 text-xs text-[#8d9891] transition hover:bg-white/[0.04] hover:text-white"
            >
              <ArrowLeft size={14} />
              Dashboard
            </Link>

            <div className="hidden h-5 w-px bg-white/10 sm:block" />

            <div>
              <h1 className="text-sm font-semibold">
                Farm Analytics
              </h1>

              <p className="text-[9px] uppercase tracking-[0.15em] text-[#667269]">
                Data intelligence
              </p>
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
        <div className="mx-auto max-w-[1400px] p-5 lg:p-8">
          {/* Page title */}
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#667269]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7dff9a] shadow-[0_0_8px_#7dff9a]" />

              Agricultural intelligence
            </div>

            <h2 className="text-3xl font-semibold tracking-[-0.03em]">
              {displayName}{" "}
              <span className="text-[#7dff9a]">
                Analytics
              </span>
            </h2>

            <p className="mt-2 text-sm text-[#78837c]">
              {displayCrop} · Real-time field performance
              and environmental intelligence.
            </p>
          </div>

          {/* Farm Metric cards */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={<Leaf size={16} />}
              label="Crop Health"
              value={`${health}`}
              unit="/100"
              status={
                health >= 90
                  ? "Excellent"
                  : health >= 80
                    ? "Good"
                    : "Needs attention"
              }
              positive={health >= 80}
            />

            <MetricCard
              icon={<Droplets size={16} />}
              label="Soil Moisture"
              value={`${moisture}`}
              unit="%"
              status={
                moisture >= 55 &&
                moisture <= 75
                  ? "Optimal"
                  : "Monitor"
              }
              positive={
                moisture >= 55 &&
                moisture <= 75
              }
            />

            <MetricCard
              icon={<Thermometer size={16} />}
              label="Temperature"
              value={`${temperature}`}
              unit="°C"
              status={
                temperature < 30
                  ? "Normal"
                  : "High"
              }
              positive={temperature < 30}
            />

            <MetricCard
              icon={<ShieldCheck size={16} />}
              label="Risk Level"
              value={risk}
              unit=""
              status={
                risk === "Low"
                  ? "Stable"
                  : risk === "Moderate"
                    ? "Watch"
                    : "Critical"
              }
              positive={risk === "Low"}
            />
          </div>

          {/* Dataset Intelligence */}
          <section className="mt-5 rounded-2xl border border-[#7dff9a]/10 bg-[#0a0f0c] p-5">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7dff9a]/10">
                  <Database
                    size={17}
                    className="text-[#7dff9a]"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Crop Dataset Intelligence
                  </p>

                  <p className="mt-1 text-[10px] text-[#667269]">
                    Agricultural reference dataset used
                    by AgroPulse AI
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7dff9a] shadow-[0_0_8px_#7dff9a]" />

                <span className="text-[9px] text-[#7dff9a]">
                  Dataset connected
                </span>
              </div>
            </div>

            {loadingDataset && (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  1,
                  2,
                  3,
                  4,
                ].map((item) => (
                  <div
                    key={item}
                    className="h-[100px] animate-pulse rounded-xl border border-white/[0.05] bg-white/[0.02]"
                  />
                ))}
              </div>
            )}

            {datasetError && (
              <div className="rounded-xl border border-[#ff6b6b]/15 bg-[#ff6b6b]/[0.04] p-4">
                <p className="text-xs text-[#ff8a8a]">
                  {datasetError}
                </p>

                <p className="mt-1 text-[10px] text-[#8d9891]">
                  Check that Crop_recommendation.csv is
                  available inside public/data/.
                </p>
              </div>
            )}

            {dataset && !loadingDataset && (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <DatasetMetric
                    icon={<Database size={15} />}
                    label="Dataset Samples"
                    value={dataset.totalSamples.toLocaleString()}
                  />

                  <DatasetMetric
                    icon={<Sprout size={15} />}
                    label="Crop Types"
                    value={String(
                      dataset.cropCount,
                    )}
                  />

                  <DatasetMetric
                    icon={<FlaskConical size={15} />}
                    label="Average N"
                    value={dataset.averages.N.toFixed(
                      1,
                    )}
                  />

                  <DatasetMetric
                    icon={<FlaskConical size={15} />}
                    label="Average P"
                    value={dataset.averages.P.toFixed(
                      1,
                    )}
                  />
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <DatasetMetric
                    icon={<FlaskConical size={15} />}
                    label="Average K"
                    value={dataset.averages.K.toFixed(
                      1,
                    )}
                  />

                  <DatasetMetric
                    icon={<Thermometer size={15} />}
                    label="Average Temperature"
                    value={`${dataset.averages.temperature.toFixed(
                      1,
                    )}°C`}
                  />

                  <DatasetMetric
                    icon={<Droplets size={15} />}
                    label="Average Humidity"
                    value={`${dataset.averages.humidity.toFixed(
                      1,
                    )}%`}
                  />

                  <DatasetMetric
                    icon={<CloudRain size={15} />}
                    label="Average Rainfall"
                    value={`${dataset.averages.rainfall.toFixed(
                      1,
                    )} mm`}
                  />
                </div>
              </>
            )}
          </section>

          {/* Main analytics grid */}
          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Health chart */}
            <div className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    Crop Health Trend
                  </p>

                  <p className="mt-1 text-[10px] text-[#667269]">
                    7-day health trajectory
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-[#7dff9a]/[0.06] px-2.5 py-1.5">
                  <TrendingUp
                    size={12}
                    className="text-[#7dff9a]"
                  />

                  <span className="text-[9px] text-[#7dff9a]">
                    Improving
                  </span>
                </div>
              </div>

              <div className="mt-8 flex h-[220px] items-end gap-3">
                {[
                  Math.max(0, health - 8),
                  Math.max(0, health - 6),
                  Math.max(0, health - 5),
                  Math.max(0, health - 3),
                  Math.max(0, health - 2),
                  Math.max(0, health - 1),
                  health,
                ].map((value, index) => (
                  <div
                    key={index}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <span className="text-[9px] text-[#667269]">
                      {value}
                    </span>

                    <div className="flex h-[170px] w-full items-end">
                      <div
                        className="w-full rounded-t-lg bg-[#7dff9a]/20 transition-all"
                        style={{
                          height: `${Math.max(
                            15,
                            value * 1.55,
                          )}px`,
                        }}
                      >
                        <div className="h-1 w-full rounded-t-lg bg-[#7dff9a]" />
                      </div>
                    </div>

                    <span className="text-[8px] text-[#4f5b53]">
                      {index === 6
                        ? "Today"
                        : `Day ${index + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI insight */}
            <div className="rounded-2xl border border-[#7dff9a]/10 bg-[#0a0f0c] p-5">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7dff9a]/10">
                  <Leaf
                    size={15}
                    className="text-[#7dff9a]"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    AI Insight
                  </p>

                  <p className="text-[9px] text-[#667269]">
                    Field intelligence
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-[#aab4ad]">
                {selectedZone
                  ? `${selectedZone.name} is currently showing ${selectedZone.status.toLowerCase()} crop conditions. Soil moisture is ${selectedZone.moisture}% and temperature is ${selectedZone.temperature}°C.`
                  : `Overall farm health is ${farmSummary.cropHealth}/100 with ${farmSummary.soilMoisture}% average soil moisture. Current farm risk is ${farmSummary.risk.toLowerCase()}.`}
              </p>

              {selectedCropDataset && (
                <div className="mt-4 rounded-xl border border-[#7dff9a]/10 bg-[#7dff9a]/[0.035] p-3">
                  <p className="text-[9px] uppercase tracking-wider text-[#667269]">
                    Dataset reference ·{" "}
                    {selectedCropDataset.crop}
                  </p>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <SmallDatasetValue
                      label="N"
                      value={selectedCropDataset.averageN.toFixed(
                        1,
                      )}
                    />

                    <SmallDatasetValue
                      label="P"
                      value={selectedCropDataset.averageP.toFixed(
                        1,
                      )}
                    />

                    <SmallDatasetValue
                      label="K"
                      value={selectedCropDataset.averageK.toFixed(
                        1,
                      )}
                    />

                    <SmallDatasetValue
                      label="pH"
                      value={selectedCropDataset.averagePh.toFixed(
                        2,
                      )}
                    />
                  </div>
                </div>
              )}

              <div className="mt-5 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                <p className="text-[9px] uppercase tracking-wider text-[#667269]">
                  Recommendation
                </p>

                <p className="mt-2 text-xs leading-5 text-[#d7ded9]">
                  Continue monitoring moisture levels and
                  maintain current irrigation strategy.
                </p>
              </div>
            </div>
          </div>

          {/* Dataset crop intelligence */}
          {dataset && (
            <section className="mt-5 rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7dff9a]/10">
                  <BarChart3
                    size={17}
                    className="text-[#7dff9a]"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Crop Intelligence
                  </p>

                  <p className="mt-1 text-[10px] text-[#667269]">
                    Environmental averages from the crop
                    recommendation dataset
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {dataset.crops.map((crop) => (
                  <div
                    key={crop.crop}
                    className={`rounded-xl border p-4 transition ${
                      selectedZone?.crop.toLowerCase() ===
                      crop.crop.toLowerCase()
                        ? "border-[#7dff9a]/20 bg-[#7dff9a]/[0.04]"
                        : "border-white/[0.05] bg-white/[0.015]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sprout
                          size={14}
                          className="text-[#7dff9a]"
                        />

                        <p className="text-xs font-medium capitalize">
                          {crop.crop}
                        </p>
                      </div>

                      <span className="rounded-full bg-white/[0.04] px-2 py-1 text-[8px] text-[#667269]">
                        {crop.samples} samples
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <CropValue
                        label="N"
                        value={crop.averageN}
                      />

                      <CropValue
                        label="P"
                        value={crop.averageP}
                      />

                      <CropValue
                        label="K"
                        value={crop.averageK}
                      />

                      <CropValue
                        label="pH"
                        value={crop.averagePh}
                      />

                      <CropValue
                        label="Temp"
                        value={crop.averageTemperature}
                        suffix="°C"
                      />

                      <CropValue
                        label="Rain"
                        value={crop.averageRainfall}
                        suffix="mm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Zone performance */}
          <div className="mt-5 rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5">
            <div className="mb-5">
              <p className="text-sm font-semibold">
                Zone Performance
              </p>

              <p className="mt-1 text-[10px] text-[#667269]">
                Comparison across farm zones
              </p>
            </div>

            <div className="space-y-3">
              {farmZones.map((zone) => (
                <Link
                  key={zone.name}
                  href={`/analytics?zone=${encodeURIComponent(
                    zone.name,
                  )}`}
                  className={`block rounded-xl border p-4 transition ${
                    selectedZone?.name === zone.name
                      ? "border-[#7dff9a]/20 bg-[#7dff9a]/[0.04]"
                      : "border-white/[0.05] bg-white/[0.015] hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="w-full md:w-[180px]">
                      <p className="text-xs font-medium">
                        {zone.name}
                      </p>

                      <p className="mt-1 text-[9px] text-[#667269]">
                        {zone.crop}
                      </p>
                    </div>

                    <div className="flex-1">
                      <div className="mb-2 flex justify-between">
                        <span className="text-[9px] text-[#667269]">
                          Health
                        </span>

                        <span className="text-[9px] text-[#d7ded9]">
                          {zone.health}/100
                        </span>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                        <div
                          className="h-full rounded-full bg-[#7dff9a]"
                          style={{
                            width: `${zone.health}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="w-[90px]">
                      <p className="text-[9px] text-[#667269]">
                        Moisture
                      </p>

                      <p className="mt-1 text-xs font-medium">
                        {zone.moisture}%
                      </p>
                    </div>

                    <div className="w-[90px]">
                      <p className="text-[9px] text-[#667269]">
                        Temperature
                      </p>

                      <p className="mt-1 text-xs font-medium">
                        {zone.temperature}°C
                      </p>
                    </div>

                    <div className="w-[80px]">
                      <span
                        className={`rounded-full px-2 py-1 text-[9px] ${
                          zone.status === "Healthy"
                            ? "bg-[#7dff9a]/10 text-[#7dff9a]"
                            : zone.status === "Watch"
                              ? "bg-[#f6c453]/10 text-[#f6c453]"
                              : "bg-[#ff6b6b]/10 text-[#ff6b6b]"
                        }`}
                      >
                        {zone.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Warning */}
          {selectedZone?.status === "Watch" && (
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#f6c453]/15 bg-[#f6c453]/[0.04] p-4">
              <AlertTriangle
                size={17}
                className="mt-0.5 text-[#f6c453]"
              />

              <div>
                <p className="text-xs font-medium text-[#f6c453]">
                  Attention required
                </p>

                <p className="mt-1 text-[10px] leading-5 text-[#a99a72]">
                  {selectedZone.name} is currently marked as
                  a watch zone. Review irrigation and crop
                  stress conditions in the Decision Center.
                </p>
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/map"
              className="flex items-center justify-center rounded-xl border border-white/[0.07] px-4 py-3 text-xs text-[#8d9891] transition hover:bg-white/[0.04] hover:text-white"
            >
              Open Farm Map
            </Link>

            <Link
              href="/predictions"
              className="flex items-center justify-center rounded-xl border border-white/[0.07] px-4 py-3 text-xs text-[#8d9891] transition hover:bg-white/[0.04] hover:text-white"
            >
              View AI Predictions
            </Link>

            <Link
              href="/decision-center"
              className="flex flex-1 items-center justify-center rounded-xl border border-[#7dff9a]/15 bg-[#7dff9a]/[0.05] px-4 py-3 text-xs font-medium text-[#7dff9a] transition hover:bg-[#7dff9a]/10"
            >
              Open Decision Center
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 border-t border-white/[0.05] pt-4 text-center text-[10px] text-[#4f5b53]">
            AgroPulse AI · North Valluru Farm Intelligence
          </div>
        </div>
      </div>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
  unit,
  status,
  positive,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  status: string;
  positive: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5">
      <div className="flex items-center gap-2">
        <span className="text-[#7dff9a]">
          {icon}
        </span>

        <span className="text-[10px] uppercase tracking-[0.14em] text-[#667269]">
          {label}
        </span>
      </div>

      <div className="mt-4 flex items-end gap-1">
        <span className="text-3xl font-semibold tracking-[-0.04em]">
          {value}
        </span>

        {unit && (
          <span className="mb-1 text-xs text-[#667269]">
            {unit}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            positive
              ? "bg-[#7dff9a]"
              : "bg-[#f6c453]"
          }`}
        />

        <span
          className={`text-[9px] ${
            positive
              ? "text-[#7dff9a]"
              : "text-[#f6c453]"
          }`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

function DatasetMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-4">
      <div className="flex items-center gap-2">
        <span className="text-[#7dff9a]">
          {icon}
        </span>

        <span className="text-[9px] uppercase tracking-[0.12em] text-[#667269]">
          {label}
        </span>
      </div>

      <p className="mt-3 text-2xl font-semibold tracking-[-0.03em]">
        {value}
      </p>
    </div>
  );
}

function SmallDatasetValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-white/[0.025] p-2">
      <p className="text-[8px] uppercase text-[#667269]">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium text-[#d7ded9]">
        {value}
      </p>
    </div>
  );
}

function CropValue({
  label,
  value,
  suffix = "",
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div>
      <p className="text-[8px] uppercase text-[#667269]">
        {label}
      </p>

      <p className="mt-1 text-[11px] font-medium text-[#d7ded9]">
        {value.toFixed(1)}
        {suffix}
      </p>
    </div>
  );
}