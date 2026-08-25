"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  CloudRain,
  Droplets,
  Leaf,
  ShieldAlert,
  Sprout,
  Thermometer,
  TrendingDown,
  TrendingUp,
  Loader2,
  RefreshCw,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  farmSummary,
  farmZones,
  aiPrediction,
  type FarmZone,
} from "@/lib/farmData";

/* =======================================================
   TYPES
======================================================= */

type CropPrediction = {
  crop: string;
  score: number;
  matches?: number;
  totalSamples?: number;
};

type ZonePrediction = {
  zone: string;
  currentCrop: string;
  recommendedCrop: string;
  currentHealth: number;
  predictedHealth: number;
  confidence: number;
  outlook: string;
  score: number;
};

type PredictionState = {
  loading: boolean;
  error: string | null;
  predictions: ZonePrediction[];
};

/* =======================================================
   FORECAST CHART
======================================================= */

const forecastDays = [
  "Today",
  "Aug 26",
  "Aug 27",
  "Aug 28",
  "Aug 29",
  "Aug 30",
  "Aug 31",
];

/* =======================================================
   API CALL
======================================================= */

async function predictCrop(
  zone: FarmZone,
): Promise<CropPrediction> {
  const response = await fetch("/api/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      N: zone.nitrogen,
      P: zone.phosphorus,
      K: zone.potassium,
      temperature: zone.temperature,
      humidity: zone.humidity,
      ph: zone.ph,
      rainfall: zone.rainfall,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.error ?? "Crop prediction failed.",
    );
  }

  return data.prediction;
}

/* =======================================================
   PREDICT ALL FARM ZONES
======================================================= */

async function loadZonePredictions(): Promise<
  ZonePrediction[]
> {
  const results = await Promise.all(
    farmZones.map(async (zone) => {
      const prediction = await predictCrop(zone);

      const score = Number(prediction.score ?? 0);

      /*
       * The crop recommendation score comes from the
       * dataset matching algorithm.
       *
       * We convert that into an AgroPulse forecast
       * indicator for the UI.
       */
      const improvement =
        score >= 80
          ? 5
          : score >= 60
            ? 3
            : score >= 40
              ? 1
              : 0;

      const predictedHealth = Math.min(
        100,
        zone.health + improvement,
      );

      const confidence = Math.min(
        99,
        Math.max(50, Math.round(score)),
      );

      let outlook = "Stable";

      if (score >= 80) {
        outlook = "Excellent";
      } else if (score >= 60) {
        outlook = "Positive";
      } else if (score >= 40) {
        outlook = "Monitor";
      } else {
        outlook = "Needs attention";
      }

      return {
        zone: zone.name,
        currentCrop: zone.crop,
        recommendedCrop: prediction.crop,
        currentHealth: zone.health,
        predictedHealth,
        confidence,
        outlook,
        score,
      };
    }),
  );

  return results;
}

/* =======================================================
   PAGE
======================================================= */

export default function PredictionsPage() {
  const [state, setState] =
    useState<PredictionState>({
      loading: true,
      error: null,
      predictions: [],
    });

  const [lastUpdated, setLastUpdated] =
    useState<string | null>(null);

  async function loadPredictions() {
    try {
      setState((previous) => ({
        ...previous,
        loading: true,
        error: null,
      }));

      const predictions =
        await loadZonePredictions();

      setState({
        loading: false,
        error: null,
        predictions,
      });

      setLastUpdated(
        new Date().toLocaleTimeString(),
      );
    } catch (error) {
      console.error(
        "Prediction loading error:",
        error,
      );

      setState({
        loading: false,
        predictions: [],
        error:
          error instanceof Error
            ? error.message
            : "Unable to load AI predictions.",
      });
    }
  }

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadPredictions();
    }, 0);

    return () => clearTimeout(initialLoad);
  }, []);

  /* =====================================================
     FARM-WIDE AI VALUES
  ===================================================== */

  const farmPrediction = useMemo(() => {
    if (!state.predictions.length) {
      return {
        predictedHealth:
          aiPrediction.predictedHealth,
        confidence: aiPrediction.confidence,
      };
    }

    const predictedHealth = Math.round(
      state.predictions.reduce(
        (sum, item) =>
          sum + item.predictedHealth,
        0,
      ) / state.predictions.length,
    );

    const confidence = Math.round(
      state.predictions.reduce(
        (sum, item) =>
          sum + item.confidence,
        0,
      ) / state.predictions.length,
    );

    return {
      predictedHealth,
      confidence,
    };
  }, [state.predictions]);

  /* =====================================================
     CHART DATA
  ===================================================== */

  const predictionData = forecastDays.map(
    (day, index) => {
      const base =
        farmSummary.cropHealth;

      const target =
        farmPrediction.predictedHealth;

      const progress =
        index / (forecastDays.length - 1);

      const health = Math.round(
        base +
          (target - base) * progress,
      );

      return {
        day,
        health,
      };
    },
  );

  /* =====================================================
     PREDICTION CARDS
  ===================================================== */

  const predictions = [
    {
      title: "Crop health",
      value: String(
        farmPrediction.predictedHealth,
      ),
      unit: "/100",
      change:
        farmPrediction.predictedHealth >=
        farmSummary.cropHealth
          ? "Improving"
          : "Declining",
      icon: Leaf,
      status:
        farmPrediction.predictedHealth >= 90
          ? "Excellent"
          : farmPrediction.predictedHealth >= 80
            ? "Good"
            : "Watch",
    },
    {
      title: "Disease pressure",
      value: String(
        aiPrediction.diseasePressure,
      ),
      unit: "%",
      change: "Low risk",
      icon: ShieldAlert,
      status: "Low",
    },
    {
      title: "Water stress",
      value: String(
        aiPrediction.waterStress,
      ),
      unit: "%",
      change: "Low risk",
      icon: Droplets,
      status: "Low",
    },
    {
      title: "Heat stress",
      value: String(
        aiPrediction.heatStress,
      ),
      unit: "%",
      change: "Moderate",
      icon: Thermometer,
      status: "Watch",
    },
  ];

  return (
    <main className="min-h-screen bg-[#050706] text-[#f4f7f4]">
      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[15%] top-[-15%] h-[500px] w-[500px] rounded-full bg-[#7dff9a]/[0.035] blur-[120px]" />

        <div className="absolute right-[-10%] top-[30%] h-[400px] w-[400px] rounded-full bg-emerald-400/[0.025] blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1500px] p-5 lg:p-8">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/"
              className="mb-5 flex w-fit items-center gap-2 text-xs text-[#78837c] transition hover:text-[#7dff9a]"
            >
              <ArrowLeft size={14} />
              Back to dashboard
            </Link>

            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#667269]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7dff9a] shadow-[0_0_8px_#7dff9a]" />

              Predictive intelligence
            </div>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              AI Predictions
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#78837c]">
              AgroPulse analyzes soil nutrients,
              environmental conditions and the crop
              recommendation dataset to generate
              zone-level predictions.
            </p>
          </div>

          {/* =================================================
              AI ENGINE
          ================================================= */}

          <div className="flex items-center justify-between gap-4">
            <button
              onClick={loadPredictions}
              disabled={state.loading}
              className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-3 text-[10px] text-[#8d9891] transition hover:bg-white/[0.05] disabled:opacity-50"
            >
              {state.loading ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : (
                <RefreshCw size={14} />
              )}

              Refresh AI
            </button>

            <div className="flex items-center gap-2 rounded-xl border border-[#7dff9a]/10 bg-[#7dff9a]/[0.04] px-4 py-3">
              <BrainCircuit
                size={16}
                className="text-[#7dff9a]"
              />

              <div>
                <p className="text-xs font-medium">
                  AI Engine{" "}
                  {state.loading
                    ? "Processing"
                    : "Active"}
                </p>

                <p className="mt-0.5 text-[9px] text-[#667269]">
                  {farmPrediction.confidence}%
                  average confidence
                </p>
              </div>

              <span
                className={`ml-2 h-2 w-2 rounded-full ${
                  state.loading
                    ? "animate-pulse bg-[#f6c453]"
                    : "bg-[#7dff9a] shadow-[0_0_8px_#7dff9a]"
                }`}
              />
            </div>
          </div>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {state.error && (
          <div className="mb-4 rounded-2xl border border-[#ff6b6b]/20 bg-[#ff6b6b]/[0.05] p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert
                size={17}
                className="mt-0.5 text-[#ff6b6b]"
              />

              <div>
                <p className="text-xs font-medium text-[#ff6b6b]">
                  AI prediction error
                </p>

                <p className="mt-1 text-[10px] leading-5 text-[#b89b9b]">
                  {state.error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =================================================
            MAIN PREDICTION
        ================================================= */}

        <div className="grid gap-4 xl:grid-cols-[1.5fr_0.7fr]">
          <div className="rounded-2xl border border-[#7dff9a]/10 bg-gradient-to-br from-[#0b160e] to-[#080c09] p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp
                    size={16}
                    className="text-[#7dff9a]"
                  />

                  <h2 className="text-sm font-medium">
                    7-day crop health forecast
                  </h2>
                </div>

                <div className="mt-4 flex items-end gap-3">
                  <span className="text-5xl font-semibold tracking-tight">
                    {farmPrediction.predictedHealth}
                  </span>

                  <span className="mb-2 text-sm text-[#667269]">
                    predicted health
                  </span>

                  <span className="mb-2 rounded-full bg-[#7dff9a]/10 px-2 py-1 text-[10px] text-[#7dff9a]">
                    {farmPrediction.predictedHealth >=
                    farmSummary.cropHealth
                      ? `+${farmPrediction.predictedHealth - farmSummary.cropHealth}`
                      : `${farmPrediction.predictedHealth - farmSummary.cropHealth}`}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-[#7dff9a]/10 bg-[#7dff9a]/[0.04] px-4 py-3">
                <p className="text-[9px] uppercase tracking-[0.15em] text-[#667269]">
                  Confidence
                </p>

                <p className="mt-1 text-lg font-semibold text-[#7dff9a]">
                  {farmPrediction.confidence}%
                </p>
              </div>
            </div>

            <div className="mt-6 h-[300px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <AreaChart
                  data={predictionData}
                  margin={{
                    top: 15,
                    right: 15,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="predictionGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#7dff9a"
                        stopOpacity={0.25}
                      />

                      <stop
                        offset="100%"
                        stopColor="#7dff9a"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    vertical={false}
                    stroke="rgba(255,255,255,0.045)"
                  />

                  <XAxis
                    dataKey="day"
                    tick={{
                      fill: "#667269",
                      fontSize: 10,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    domain={[70, 100]}
                    tick={{
                      fill: "#667269",
                      fontSize: 10,
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#0b100d",
                      border:
                        "1px solid rgba(255,255,255,.08)",
                      borderRadius: "12px",
                      color: "#f4f7f4",
                      fontSize: "11px",
                    }}
                    itemStyle={{
                      color: "#7dff9a",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="health"
                    stroke="#7dff9a"
                    strokeWidth={2}
                    fill="url(#predictionGradient)"
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: "#7dff9a",
                      stroke: "#050706",
                      strokeWidth: 3,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5">
            <div className="flex items-center gap-2">
              <BrainCircuit
                size={16}
                className="text-[#7dff9a]"
              />

              <h2 className="text-sm font-medium">
                AI forecast summary
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              <SummaryItem
                icon={CheckCircle2}
                title="Overall outlook"
                text={
                  farmPrediction.predictedHealth >=
                  farmSummary.cropHealth
                    ? "Positive"
                    : "Needs monitoring"
                }
              />

              <SummaryItem
                icon={Droplets}
                title="Water availability"
                text={
                  farmSummary.soilMoisture >= 60
                    ? "Sufficient"
                    : "Needs monitoring"
                }
              />

              <SummaryItem
                icon={CloudRain}
                title="Rainfall impact"
                text="Dataset analyzed"
              />

              <SummaryItem
                icon={Thermometer}
                title="Heat conditions"
                text={
                  farmSummary.temperature > 30
                    ? "High"
                    : "Normal"
                }
              />
            </div>

            <div className="mt-6 rounded-xl border border-[#7dff9a]/10 bg-[#7dff9a]/[0.035] p-4">
              <p className="text-[9px] uppercase tracking-[0.16em] text-[#667269]">
                AI recommendation
              </p>

              <p className="mt-2 text-xs leading-5 text-[#8d9891]">
                Analyze the zone-level crop
                recommendations below before changing
                the current crop plan. Predictions are
                generated from the supplied environmental
                values and Crop Recommendation dataset.
              </p>
            </div>

            {lastUpdated && (
              <p className="mt-4 text-[9px] text-[#4f5b53]">
                Last AI analysis: {lastUpdated}
              </p>
            )}
          </div>
        </div>

        {/* =================================================
            METRIC CARDS
        ================================================= */}

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {predictions.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon
                      size={15}
                      className="text-[#7dff9a]"
                    />

                    <span className="text-[10px] uppercase tracking-[0.12em] text-[#667269]">
                      {item.title}
                    </span>
                  </div>

                  <span className="text-[9px] text-[#7dff9a]">
                    {item.status}
                  </span>
                </div>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl font-semibold">
                    {item.value}
                  </span>

                  <span className="text-xs text-[#667269]">
                    {item.unit}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-1.5">
                  {item.change.includes(
                    "Improving",
                  ) ||
                  item.change.includes("%") ? (
                    <TrendingUp
                      size={11}
                      className="text-[#7dff9a]"
                    />
                  ) : (
                    <TrendingDown
                      size={11}
                      className="text-[#7dff9a]"
                    />
                  )}

                  <span className="text-[10px] text-[#7dff9a]">
                    {item.change}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* =================================================
            ZONE AI PREDICTIONS
        ================================================= */}

        <div className="mt-4 rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5">
          <div className="mb-5 flex items-center gap-2">
            <Sprout
              size={16}
              className="text-[#7dff9a]"
            />

            <div>
              <h2 className="text-sm font-medium">
                AI zone predictions
              </h2>

              <p className="mt-1 text-[10px] text-[#667269]">
                Live recommendations generated from
                Crop_recommendation.csv
              </p>
            </div>
          </div>

          {state.loading ? (
            <div className="flex min-h-[180px] items-center justify-center">
              <div className="flex items-center gap-3 text-xs text-[#78837c]">
                <Loader2
                  size={18}
                  className="animate-spin text-[#7dff9a]"
                />

                Running AI analysis for all farm zones...
              </div>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {state.predictions.map((zone) => (
                <div
                  key={zone.zone}
                  className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium">
                        {zone.zone}
                      </p>

                      <p className="mt-1 text-[10px] text-[#667269]">
                        Current: {zone.currentCrop}
                      </p>
                    </div>

                    <Leaf
                      size={14}
                      className="text-[#7dff9a]"
                    />
                  </div>

                  {/* Current vs predicted */}
                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-[9px] text-[#667269]">
                        Current health
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {zone.currentHealth}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={15}
                      className="mb-2 text-[#7dff9a]"
                    />

                    <div className="text-right">
                      <p className="text-[9px] text-[#667269]">
                        Predicted
                      </p>

                      <p className="mt-1 text-lg font-semibold text-[#7dff9a]">
                        {zone.predictedHealth}
                      </p>
                    </div>
                  </div>

                  {/* AI crop recommendation */}
                  <div className="mt-4 rounded-xl border border-[#7dff9a]/10 bg-[#7dff9a]/[0.035] p-3">
                    <p className="text-[9px] uppercase tracking-[0.12em] text-[#667269]">
                      AI crop recommendation
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#7dff9a]">
                      {zone.recommendedCrop}
                    </p>

                    <p className="mt-1 text-[9px] text-[#78837c]">
                      Dataset match score:{" "}
                      {zone.score}%
                    </p>
                  </div>

                  {/* Confidence */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[9px] text-[#667269]">
                      <span>
                        AI confidence
                      </span>

                      <span>
                        {zone.confidence}%
                      </span>
                    </div>

                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-[#7dff9a]"
                        style={{
                          width: `${zone.confidence}%`,
                        }}
                      />
                    </div>
                  </div>

                  <p className="mt-3 text-[10px] text-[#8d9891]">
                    Outlook:{" "}
                    <span className="text-[#7dff9a]">
                      {zone.outlook}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* =================================================
            ATTENTION
        ================================================= */}

        <div className="mt-4 rounded-2xl border border-[#f6c453]/15 bg-[#0d0d09] p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f6c453]/10">
                <ShieldAlert
                  size={18}
                  className="text-[#f6c453]"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-medium">
                    Prediction requires attention
                  </h2>

                  <span className="rounded-full bg-[#f6c453]/10 px-2 py-1 text-[9px] text-[#f6c453]">
                    Monitor zones
                  </span>
                </div>

                <p className="mt-2 max-w-2xl text-xs leading-5 text-[#8d9891]">
                  South Field currently has the lowest
                  crop-health score. Review its moisture,
                  nutrient balance and AI recommendation
                  before taking action.
                </p>
              </div>
            </div>

            <Link
              href="/decision-center"
              className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#f6c453]/15 bg-[#f6c453]/[0.05] px-4 py-3 text-xs font-medium text-[#f6c453] transition hover:bg-[#f6c453]/10"
            >
              Open Decision Center
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="mt-6 border-t border-white/[0.05] pt-4 text-center text-[10px] text-[#4f5b53]">
          AgroPulse AI · Predictive Farm Intelligence
        </div>
      </div>
    </main>
  );
}

/* =======================================================
   SUMMARY ITEM
======================================================= */

function SummaryItem({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7dff9a]/[0.06]">
        <Icon
          size={14}
          className="text-[#7dff9a]"
        />
      </div>

      <div className="flex-1">
        <p className="text-[10px] text-[#667269]">
          {title}
        </p>

        <p className="mt-1 text-xs font-medium">
          {text}
        </p>
      </div>
    </div>
  );
}