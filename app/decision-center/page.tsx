"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  Droplets,
  Leaf,
  ShieldCheck,
  Thermometer,
  TriangleAlert,
} from "lucide-react";

import { farmZones } from "@/lib/farmData";
import { getFieldIntelligence } from "@/lib/farmIntelligence";

/* ============================================================
   DECISION CENTER CONTENT
============================================================ */

function DecisionCenterContent() {
  const searchParams = useSearchParams();

  const requestedZone =
    searchParams.get("zone");

  const requestedId =
    searchParams.get("id");

  /*
   * First try ID.
   * Then try zone name.
   * Finally use the first field.
   */

  const selectedZone =
    requestedId
      ? farmZones.find(
          (zone) => zone.id === requestedId,
        )
      : requestedZone
        ? farmZones.find(
            (zone) =>
              zone.name === requestedZone,
          )
        : farmZones[0];

  /*
   * Field not found
   */

  if (!selectedZone) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050706] px-5 text-[#f4f7f4]">

        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff6b6b]/10">

            <TriangleAlert
              size={24}
              className="text-[#ff6b6b]"
            />

          </div>

          <h1 className="mt-5 text-xl font-semibold">
            Field not found
          </h1>

          <p className="mt-2 max-w-md text-sm text-[#667269]">
            The requested field does not exist in
            the current farm data.
          </p>

          <Link
            href="/map"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#7dff9a] px-4 py-2.5 text-xs font-semibold text-[#071008]"
          >
            <ArrowLeft size={14} />
            Back to Farm Map
          </Link>

        </div>

      </main>
    );
  }

  /*
   * Get intelligence.
   */

  const intelligence =
    getFieldIntelligence(
      selectedZone.name,
    );

  /*
   * Safety check.
   */

  if (!intelligence) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050706] px-5 text-[#f4f7f4]">

        <div className="text-center">

          <h1 className="text-xl font-semibold">
            Intelligence unavailable
          </h1>

          <p className="mt-2 text-sm text-[#667269]">
            AgroPulse AI could not calculate
            intelligence for this field.
          </p>

          <Link
            href="/map"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#7dff9a] px-4 py-2.5 text-xs font-semibold text-[#071008]"
          >
            <ArrowLeft size={14} />
            Back to Farm Map
          </Link>

        </div>

      </main>
    );
  }

  /*
   * Dynamic risk.
   */

  const isHigh =
    intelligence.risk === "High";

  const isModerate =
    intelligence.risk === "Moderate";

  const isLow =
    intelligence.risk === "Low";

  /*
   * Health status.
   */

  const healthStatus =
    intelligence.health >= 85
      ? "Excellent"
      : intelligence.health >= 75
        ? "Watch"
        : "Critical";

  /*
   * Moisture status.
   */

  const moistureStatus =
    intelligence.moisture < 35
      ? "Critical"
      : intelligence.moisture < 50
        ? "Low"
        : intelligence.moisture <= 75
          ? "Optimal"
          : "High";

  /*
   * Temperature status.
   */

  const temperatureStatus =
    intelligence.temperature > 35
      ? "Critical"
      : intelligence.temperature > 32
        ? "Elevated"
        : "Normal";

  /*
   * AI confidence.
   */

  const confidence =
    isHigh
      ? 88
      : isModerate
        ? 92
        : 95;

  return (
    <main className="min-h-screen bg-[#050706] text-[#f4f7f4]">

      {/* HEADER */}

      <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-white/[0.06] bg-[#050706]/90 px-5 backdrop-blur-xl lg:px-8">

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

              <ShieldCheck
                size={16}
                className="text-[#7dff9a]"
              />

            </div>

            <div>

              <h1 className="text-sm font-semibold">
                Decision Center
              </h1>

              <p className="text-[9px] uppercase tracking-[0.15em] text-[#667269]">
                AI recommendations
              </p>

            </div>

          </div>

        </div>

        <div className="flex items-center gap-2">

          <span
            className={`h-2 w-2 rounded-full ${
              isHigh
                ? "bg-[#ff6b6b] shadow-[0_0_10px_#ff6b6b]"
                : isModerate
                  ? "bg-[#f6c453] shadow-[0_0_10px_#f6c453]"
                  : "bg-[#7dff9a] shadow-[0_0_10px_#7dff9a]"
            }`}
          />

          <span className="hidden text-[10px] text-[#78837c] sm:block">
            AI analysis active
          </span>

        </div>

      </header>

      {/* MAIN */}

      <div className="mx-auto max-w-[1300px] p-5 lg:p-8">

        {/* HEADING */}

        <div className="mb-7">

          <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#667269]">

            <span className="h-1.5 w-1.5 rounded-full bg-[#7dff9a] shadow-[0_0_8px_#7dff9a]" />

            Farm intelligence

          </div>

          <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">

            Decision{" "}

            <span className="text-[#7dff9a]">
              Center
            </span>

          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#78837c]">
            AI-generated recommendations based on
            current field conditions.
          </p>

        </div>

        {/* SELECTED FIELD */}

        <div className="mb-3 rounded-2xl border border-[#7dff9a]/10 bg-gradient-to-br from-[#0b160e] to-[#080c09] p-5">

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#7dff9a]/10">

                <Leaf
                  size={20}
                  className="text-[#7dff9a]"
                />

              </div>

              <div>

                <p className="text-[10px] uppercase tracking-[0.15em] text-[#667269]">
                  Selected field
                </p>

                <h3 className="mt-1 text-xl font-semibold">
                  {intelligence.name}
                </h3>

                <p className="mt-1 text-xs text-[#78837c]">
                  {intelligence.crop}
                  {" · "}
                  AI field analysis
                </p>

              </div>

            </div>

            <span
              className={`rounded-full px-3 py-1.5 text-[10px] font-medium ${
                isHigh
                  ? "bg-[#ff6b6b]/10 text-[#ff6b6b]"
                  : isModerate
                    ? "bg-[#f6c453]/10 text-[#f6c453]"
                    : "bg-[#7dff9a]/10 text-[#7dff9a]"
              }`}
            >
              {intelligence.risk} risk
            </span>

          </div>

        </div>

        {/* METRICS */}

        <div className="grid gap-3 sm:grid-cols-3">

          <MetricCard
            icon={<Leaf size={15} />}
            label="Crop Health"
            value={`${intelligence.health}/100`}
            status={healthStatus}
          />

          <MetricCard
            icon={<Droplets size={15} />}
            label="Soil Moisture"
            value={`${intelligence.moisture}%`}
            status={moistureStatus}
          />

          <MetricCard
            icon={<Thermometer size={15} />}
            label="Temperature"
            value={`${intelligence.temperature.toFixed(1)}°C`}
            status={temperatureStatus}
          />

        </div>

        {/* RECOMMENDATION + CONFIDENCE */}

        <div className="mt-3 grid gap-3 lg:grid-cols-[1.4fr_0.6fr]">

          {/* Recommendation */}

          <div
            className={`rounded-2xl border p-6 ${
              isHigh
                ? "border-[#ff6b6b]/15 bg-[#100909]"
                : isModerate
                  ? "border-[#f6c453]/15 bg-[#0d0d09]"
                  : "border-[#7dff9a]/10 bg-[#0a0f0c]"
            }`}
          >

            <div className="flex items-start gap-3">

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  isHigh
                    ? "bg-[#ff6b6b]/10"
                    : isModerate
                      ? "bg-[#f6c453]/10"
                      : "bg-[#7dff9a]/10"
                }`}
              >

                {isHigh ? (
                  <TriangleAlert
                    size={18}
                    className="text-[#ff6b6b]"
                  />
                ) : isModerate ? (
                  <TriangleAlert
                    size={18}
                    className="text-[#f6c453]"
                  />
                ) : (
                  <BrainCircuit
                    size={18}
                    className="text-[#7dff9a]"
                  />
                )}

              </div>

              <div>

                <p className="text-[10px] uppercase tracking-[0.16em] text-[#667269]">
                  AI recommendation
                </p>

                <h3 className="mt-1 text-lg font-semibold">

                  {isHigh
                    ? "Immediate attention required"
                    : isModerate
                      ? "Attention recommended"
                      : "Field performing normally"}

                </h3>

              </div>

            </div>

            <div className="mt-5 space-y-3">

              {intelligence.recommendations.map(
                (recommendation) => (
                  <p
                    key={recommendation}
                    className="text-sm leading-7 text-[#9aa59e]"
                  >
                    {recommendation}
                  </p>
                ),
              )}

            </div>

            {/* ACTIONS */}

            <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.025] p-4">

              <p className="text-[9px] uppercase tracking-[0.15em] text-[#667269]">
                Recommended actions
              </p>

              <div className="mt-3 space-y-2">

                {intelligence.recommendations.map(
                  (recommendation) => (
                    <div
                      key={`action-${recommendation}`}
                      className="flex items-start gap-2"
                    >

                      <CheckCircle2
                        size={15}
                        className="mt-0.5 shrink-0 text-[#7dff9a]"
                      />

                      <p className="text-xs leading-5 text-[#d7ded9]">
                        {recommendation}
                      </p>

                    </div>
                  ),
                )}

              </div>

            </div>

          </div>

          {/* AI CONFIDENCE */}

          <div className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-6">

            <div className="flex items-center gap-2">

              <BrainCircuit
                size={16}
                className="text-[#7dff9a]"
              />

              <span className="text-sm font-medium">
                AI confidence
              </span>

            </div>

            <div className="mt-7 flex items-end gap-2">

              <span className="text-5xl font-semibold">
                {confidence}
              </span>

              <span className="mb-2 text-sm text-[#667269]">
                %
              </span>

            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

              <div
                className="h-full rounded-full bg-[#7dff9a] transition-all duration-500"
                style={{
                  width: `${confidence}%`,
                }}
              />

            </div>

            <p className="mt-4 text-[10px] leading-5 text-[#667269]">
              Confidence is calculated from crop
              health, moisture, temperature and
              current environmental conditions.
            </p>

            <div className="mt-6 space-y-3 border-t border-white/[0.05] pt-5">

              <ConfidenceData
                label="Health"
                value={`${intelligence.health}/100`}
              />

              <ConfidenceData
                label="Moisture"
                value={`${intelligence.moisture}%`}
              />

              <ConfidenceData
                label="Temperature"
                value={`${intelligence.temperature.toFixed(1)}°C`}
              />

              <ConfidenceData
                label="Humidity"
                value={`${intelligence.humidity}%`}
              />

            </div>

          </div>

        </div>

        {/* FIELD INTELLIGENCE */}

        <div className="mt-3 rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-6">

          <div className="mb-5">

            <h3 className="text-sm font-semibold">
              Field intelligence
            </h3>

            <p className="mt-1 text-[9px] text-[#667269]">
              Current environmental and soil indicators
            </p>

          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

            <FieldDataCard
              label="Humidity"
              value={`${intelligence.humidity}%`}
            />

            <FieldDataCard
              label="Rainfall"
              value={`${intelligence.rainfall} mm`}
            />

            <FieldDataCard
              label="Nitrogen"
              value={`${intelligence.nitrogen}`}
            />

            <FieldDataCard
              label="Phosphorus"
              value={`${intelligence.phosphorus}`}
            />

            <FieldDataCard
              label="Potassium"
              value={`${intelligence.potassium}`}
            />

            <FieldDataCard
              label="Soil pH"
              value={`${intelligence.ph}`}
            />

            <FieldDataCard
              label="Crop"
              value={intelligence.crop}
            />

            <FieldDataCard
              label="Field Risk"
              value={intelligence.risk}
            />

          </div>

        </div>

        {/* FIELD NAVIGATION */}

        <div className="mt-3 rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5">

          <div className="mb-4">

            <h3 className="text-sm font-semibold">
              Analyze another field
            </h3>

            <p className="mt-1 text-[9px] text-[#667269]">
              Select a field to view its AI intelligence.
            </p>

          </div>

          <div className="flex flex-wrap gap-2">

            {farmZones.map((zone) => {

              const active =
                zone.name ===
                selectedZone.name;

              return (
                <Link
                  key={zone.id}
                  href={`/decision-center?zone=${encodeURIComponent(
                    zone.name,
                  )}&id=${encodeURIComponent(
                    zone.id,
                  )}`}
                  className={`rounded-xl border px-4 py-2.5 text-xs transition ${
                    active
                      ? "border-[#7dff9a]/20 bg-[#7dff9a]/10 text-[#7dff9a]"
                      : "border-white/[0.07] bg-white/[0.02] text-[#78837c] hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  {zone.name}
                </Link>
              );
            })}

          </div>

        </div>

        {/* ACTION BUTTONS */}

        <div className="mt-3 grid gap-3 sm:grid-cols-2">

          <Link
            href="/map"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] py-3 text-xs font-medium text-[#8d9891] transition hover:bg-white/[0.05] hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to Farm Map
          </Link>

          <Link
            href={`/analytics?zone=${encodeURIComponent(
              selectedZone.name,
            )}&id=${encodeURIComponent(
              selectedZone.id,
            )}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#7dff9a]/15 bg-[#7dff9a]/[0.05] py-3 text-xs font-medium text-[#7dff9a] transition hover:bg-[#7dff9a]/10"
          >
            View Analytics
            <ArrowUpRight size={14} />
          </Link>

        </div>

        {/* FOOTER */}

        <div className="mt-8 flex flex-col justify-between gap-2 border-t border-white/[0.05] pt-4 text-[10px] text-[#4f5b53] sm:flex-row">

          <span>
            AgroPulse AI · Decision Intelligence
          </span>

          <span className="flex items-center gap-2">

            <span className="h-1.5 w-1.5 rounded-full bg-[#7dff9a]" />

            Decision systems operational

          </span>

        </div>

      </div>

    </main>
  );
}

/* ============================================================
   METRIC CARD
============================================================ */

function MetricCard({
  icon,
  label,
  value,
  status,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  status: string;
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

      <div className="mt-4 flex items-end justify-between">

        <span className="text-2xl font-semibold">
          {value}
        </span>

        <span className="text-[9px] text-[#7dff9a]">
          {status}
        </span>

      </div>

    </div>
  );
}

/* ============================================================
   CONFIDENCE DATA
============================================================ */

function ConfidenceData({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">

      <span className="text-[9px] uppercase tracking-wider text-[#667269]">
        {label}
      </span>

      <span className="text-[10px] font-medium text-[#cbd4ce]">
        {value}
      </span>

    </div>
  );
}

/* ============================================================
   FIELD DATA CARD
============================================================ */

function FieldDataCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">

      <p className="text-[8px] uppercase tracking-wider text-[#667269]">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-[#d7ded9]">
        {value}
      </p>

    </div>
  );
}

/* ============================================================
   PAGE
============================================================ */

export default function DecisionCenter() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#050706] text-sm text-[#7dff9a]">
          Loading decision center...
        </div>
      }
    >
      <DecisionCenterContent />
    </Suspense>
  );
}