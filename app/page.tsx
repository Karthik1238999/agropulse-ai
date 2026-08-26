"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bell,
  ChevronRight,
  CloudSun,
  Droplets,
  Leaf,
  LogIn,
  LogOut,
  Map,
  Settings,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Wind,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

import {
  farmSummary,
  aiPrediction,
  farmZones,
} from "@/lib/farmData";

import {
  getFarmIntelligence,
  getFieldIntelligence,
} from "@/lib/farmIntelligence";

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

export default function DashboardPage() {
  /* -------------------------------------------------------
     Firebase authentication
  ------------------------------------------------------- */

  const [user, setUser] = useState<User | null>(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  /* -------------------------------------------------------
     Dashboard state
  ------------------------------------------------------- */

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [weather, setWeather] =
    useState<WeatherData | null>(null);

  const [weatherLoading, setWeatherLoading] =
    useState(true);

  const [weatherError, setWeatherError] =
    useState("");

  /* -------------------------------------------------------
     Firebase auth listener
  ------------------------------------------------------- */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setAuthLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  /* -------------------------------------------------------
     Weather
  ------------------------------------------------------- */

  useEffect(() => {
    async function loadWeather() {
      try {
        setWeatherLoading(true);
        setWeatherError("");

        const response = await fetch(
          "/api/weather",
          {
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
          "Dashboard weather error:",
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

    loadWeather();
  }, []);

  /* -------------------------------------------------------
     Farm intelligence
  ------------------------------------------------------- */

  const farmIntelligence =
    getFarmIntelligence();

  const attentionFields =
    farmIntelligence.attentionFields;

  const healthyZones =
    farmIntelligence.healthyFields;

  const attentionZones =
    farmIntelligence.attentionCount;

  const riskDistribution =
    farmIntelligence.riskDistribution;

  const primaryAttentionField =
    attentionFields.length > 0
      ? attentionFields[0]
      : null;

  const primaryFieldIntelligence =
    primaryAttentionField
      ? getFieldIntelligence(
          primaryAttentionField.name,
        )
      : null;

  /* -------------------------------------------------------
     Dashboard stats
  ------------------------------------------------------- */

  const stats = [
    {
      label: "Crop Health",
      value: String(
        farmIntelligence.health,
      ),
      unit: "/100",
      change:
        farmIntelligence.health >= 85
          ? "Excellent"
          : farmIntelligence.health >= 70
            ? "Good"
            : "Needs attention",
      icon: Leaf,
      status:
        farmIntelligence.health >= 85
          ? "Healthy"
          : "Watch",
    },
    {
      label: "Soil Moisture",
      value: String(
        farmSummary.soilMoisture,
      ),
      unit: "%",
      change:
        farmSummary.soilMoisture >= 60
          ? "Optimal"
          : "Below optimal",
      icon: Droplets,
      status:
        farmSummary.soilMoisture >= 60
          ? "Optimal"
          : "Watch",
    },
    {
      label: "Temperature",
      value: weather
        ? weather.temperature.toFixed(1)
        : "--",
      unit: "°C",
      change: weather
        ? weather.weatherDescription
        : "Loading",
      icon: Thermometer,
      status: weather
        ? "Live"
        : "Loading",
    },
    {
      label: "Risk Level",
      value: farmIntelligence.risk,
      unit: "",
      change:
        riskDistribution.high > 0
          ? `${riskDistribution.high} high risk`
          : riskDistribution.moderate > 0
            ? `${riskDistribution.moderate} moderate`
            : "All stable",
      icon: ShieldCheck,
      status:
        farmIntelligence.risk === "Low"
          ? "Stable"
          : farmIntelligence.risk,
    },
  ];

  /* -------------------------------------------------------
     Sign out
  ------------------------------------------------------- */

  async function handleSignOut() {
    try {
      await signOut(auth);

      window.location.href = "/login";
    } catch (error) {
      console.error(
        "Sign out failed:",
        error,
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#050706] text-[#f4f7f4]">
      <div className="relative min-h-screen overflow-hidden">

        {/* Background glow */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute left-[10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[#7dff9a]/[0.025] blur-[130px]" />

          <div className="absolute right-[-10%] top-[30%] h-[450px] w-[450px] rounded-full bg-emerald-400/[0.02] blur-[120px]" />

          <div className="absolute bottom-[-15%] left-[30%] h-[450px] w-[450px] rounded-full bg-[#7dff9a]/[0.015] blur-[120px]" />
        </div>

        {/* Header */}
        <header className="relative z-30 flex h-[72px] items-center justify-between border-b border-white/[0.06] bg-[#050706]/90 px-5 backdrop-blur-xl lg:px-8">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7dff9a]/10">
              <Leaf
                size={18}
                className="text-[#7dff9a]"
              />
            </div>

            <div>
              <h1 className="text-sm font-semibold tracking-tight">
                AgroPulse{" "}
                <span className="text-[#7dff9a]">
                  AI
                </span>
              </h1>

              <p className="text-[8px] uppercase tracking-[0.18em] text-[#667269]">
                Agricultural Intelligence
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            <DashboardNavLink
              href="/"
              label="Dashboard"
              active
            />

            <DashboardNavLink
              href="/analytics"
              label="Analytics"
            />

            <DashboardNavLink
              href="/predictions"
              label="Predictions"
            />

            <DashboardNavLink
              href="/decision-center"
              label="Decision Center"
            />

            <DashboardNavLink
              href="/map"
              label="Farm Map"
            />
          </nav>

          {/* Header actions */}
          <div className="flex items-center gap-2">

            {/* AI status */}
            <div className="hidden items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7dff9a] shadow-[0_0_8px_#7dff9a]" />

              <span className="text-[9px] text-[#78837c]">
                AI systems operational
              </span>
            </div>

            {/* Alerts */}
            <div className="relative">
              <button
                onClick={() =>
                  setShowNotifications(
                    !showNotifications,
                  )
                }
                className="rounded-xl border border-white/[0.06] p-2.5 text-[#8d9891] transition hover:bg-white/[0.04] hover:text-white"
                title="Notifications"
              >
                <Bell size={17} />
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 z-50 w-[300px] rounded-2xl border border-white/[0.08] bg-[#0a0f0c] p-4 shadow-2xl">

                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold">
                      Notifications
                    </h3>

                    <span className="rounded-full bg-[#f6c453]/10 px-2 py-1 text-[8px] text-[#f6c453]">
                      {attentionZones} alert
                      {attentionZones !== 1
                        ? "s"
                        : ""}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">

                    {attentionFields.length >
                    0 ? (
                      attentionFields.map(
                        (field) => (
                          <NotificationItem
                            key={field.name}
                            title={`${field.name} requires attention`}
                            description={`${field.crop} · ${field.moisture}% moisture · ${field.risk} risk.`}
                          />
                        ),
                      )
                    ) : (
                      <NotificationItem
                        title="All fields stable"
                        description="No fields currently require additional attention."
                      />
                    )}

                    {weather &&
                      weather.temperature >
                        32 && (
                        <NotificationItem
                          title="Temperature elevated"
                          description={`Current farm temperature is ${weather.temperature.toFixed(1)}°C.`}
                        />
                      )}
                  </div>

                  <a
                    href="/alerts"
                    className="mt-4 flex items-center justify-center rounded-xl bg-white/[0.04] py-2 text-[10px] text-[#7dff9a] transition hover:bg-white/[0.07]"
                  >
                    View all alerts
                  </a>
                </div>
              )}
            </div>

            {/* Settings */}
            <button
              onClick={() => {
                window.location.href =
                  "/settings";
              }}
              className="rounded-xl border border-white/[0.06] p-2.5 text-[#8d9891] transition hover:bg-white/[0.04] hover:text-white"
              title="Settings"
            >
              <Settings size={17} />
            </button>

            {/* Authentication */}
            {authLoading ? (
              <div className="hidden h-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 sm:flex">
                <span className="text-[9px] text-[#667269]">
                  Loading...
                </span>
              </div>
            ) : user ? (
              <div className="flex items-center gap-2">

                {/* User profile */}
                <div className="hidden items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 sm:flex">

                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7dff9a]/10 text-[9px] font-semibold text-[#7dff9a]">
                      {(
                        user.displayName ||
                        user.email ||
                        "U"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <div className="max-w-[130px]">
                    <p className="truncate text-[9px] font-medium text-white">
                      {user.displayName ||
                        "AgroPulse User"}
                    </p>

                    <p className="truncate text-[8px] text-[#667269]">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Sign out */}
                <button
                  onClick={handleSignOut}
                  className="hidden items-center gap-2 rounded-xl border border-white/[0.06] px-3 py-2.5 text-[10px] text-[#8d9891] transition hover:border-[#ff6b6b]/20 hover:bg-[#ff6b6b]/5 hover:text-[#ff7b7b] sm:flex"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  window.location.href =
                    "/login";
                }}
                className="hidden items-center gap-2 rounded-xl bg-[#7dff9a] px-3 py-2.5 text-[10px] font-semibold text-[#071008] transition hover:bg-[#9affad] sm:flex"
              >
                <LogIn size={14} />
                Login
              </button>
            )}
          </div>
        </header>

        {/* Main */}
        <div className="relative mx-auto max-w-[1600px] px-5 py-7 lg:px-8 lg:py-9">

          {/* Hero */}
          <section className="mb-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">

              <div>
                <div className="mb-3 flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#667269]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7dff9a] shadow-[0_0_8px_#7dff9a]" />

                  Live farm intelligence
                </div>

                <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                  Good morning,
                  <br />

                  <span className="text-[#7dff9a]">
                    Green Valley Farm.
                  </span>
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#78837c]">
                  AgroPulse AI is monitoring your crop health,
                  soil conditions and environmental signals across
                  the farm.
                </p>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">

                <Map
                  size={15}
                  className="text-[#7dff9a]"
                />

                <div>
                  <p className="text-[9px] uppercase tracking-wider text-[#667269]">
                    Monitoring area
                  </p>

                  <p className="mt-1 text-xs font-medium">
                    North Valluru
                  </p>

                  <p className="text-[9px] text-[#667269]">
                    Andhra Pradesh, India
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <motion.div
                  key={stat.label}
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.06,
                  }}
                  className="group rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5 transition hover:border-[#7dff9a]/20"
                >
                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">
                      <span className="text-[#7dff9a]">
                        <Icon size={16} />
                      </span>

                      <span className="text-[9px] uppercase tracking-[0.14em] text-[#667269]">
                        {stat.label}
                      </span>
                    </div>

                    <span className="rounded-full bg-[#7dff9a]/5 px-2 py-1 text-[8px] text-[#7dff9a]">
                      {stat.status}
                    </span>
                  </div>

                  <div className="mt-5 flex items-end justify-between">

                    <div>
                      <span className="text-3xl font-semibold tracking-[-0.04em]">
                        {stat.value}
                      </span>

                      {stat.unit && (
                        <span className="ml-1 text-xs text-[#667269]">
                          {stat.unit}
                        </span>
                      )}
                    </div>

                    <span className="max-w-[120px] text-right text-[9px] text-[#7dff9a]">
                      {stat.change}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </section>

          {/* Main grid */}
          <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">

            {/* Farm overview */}
            <section className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c]">

              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">

                <div>
                  <h3 className="text-sm font-semibold">
                    Farm intelligence
                  </h3>

                  <p className="mt-1 text-[9px] text-[#667269]">
                    AI-derived current zone performance
                  </p>
                </div>

                <a
                  href="/map"
                  className="flex items-center gap-1 rounded-lg border border-white/[0.06] px-3 py-2 text-[9px] text-[#78837c] transition hover:bg-white/[0.04] hover:text-white"
                >
                  View map
                  <ArrowUpRight size={11} />
                </a>
              </div>

              <div className="divide-y divide-white/[0.05]">
                {farmZones.map((zone) => {

                  const intelligence =
                    getFieldIntelligence(
                      zone.name,
                    );

                  return (
                    <ZoneRow
                      key={zone.name}
                      name={zone.name}
                      crop={zone.crop}
                      health={zone.health}
                      moisture={zone.moisture}
                      temperature={
                        zone.temperature
                      }
                      risk={
                        intelligence?.risk ??
                        zone.risk
                      }
                      status={
                        intelligence?.risk ===
                        "High"
                          ? "Critical"
                          : intelligence?.risk ===
                              "Moderate"
                            ? "Watch"
                            : "Healthy"
                      }
                    />
                  );
                })}
              </div>

              {/* Zone summary */}
              <div className="grid grid-cols-2 gap-3 border-t border-white/[0.06] p-5">

                <div className="rounded-xl bg-[#7dff9a]/[0.03] p-4">

                  <div className="flex items-center justify-between">
                    <p className="text-[9px] uppercase tracking-wider text-[#667269]">
                      Healthy zones
                    </p>

                    <Leaf
                      size={14}
                      className="text-[#7dff9a]"
                    />
                  </div>

                  <p className="mt-2 text-2xl font-semibold text-[#7dff9a]">
                    {healthyZones.length}
                  </p>

                  <p className="mt-1 text-[9px] text-[#667269]">
                    of {farmZones.length} monitored zones
                  </p>
                </div>

                <div className="rounded-xl bg-[#f6c453]/[0.03] p-4">

                  <div className="flex items-center justify-between">
                    <p className="text-[9px] uppercase tracking-wider text-[#667269]">
                      Attention needed
                    </p>

                    <Bell
                      size={14}
                      className="text-[#f6c453]"
                    />
                  </div>

                  <p className="mt-2 text-2xl font-semibold text-[#f6c453]">
                    {attentionZones}
                  </p>

                  <p className="mt-1 text-[9px] text-[#667269]">
                    field
                    {attentionZones !== 1
                      ? "s"
                      : ""}{" "}
                    require monitoring
                  </p>
                </div>
              </div>

              {/* Risk distribution */}
              <div className="border-t border-white/[0.06] px-5 py-4">

                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[9px] uppercase tracking-wider text-[#667269]">
                    AI risk distribution
                  </p>

                  <span className="text-[9px] text-[#667269]">
                    {farmZones.length} total fields
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">

                  <RiskBox
                    label="Low"
                    value={riskDistribution.low}
                    className="text-[#7dff9a]"
                    background="bg-[#7dff9a]/[0.03]"
                  />

                  <RiskBox
                    label="Moderate"
                    value={
                      riskDistribution.moderate
                    }
                    className="text-[#f6c453]"
                    background="bg-[#f6c453]/[0.03]"
                  />

                  <RiskBox
                    label="High"
                    value={riskDistribution.high}
                    className="text-[#ff6b6b]"
                    background="bg-[#ff6b6b]/[0.03]"
                  />
                </div>
              </div>
            </section>

            {/* AI prediction */}
            <section className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c]">

              <div className="border-b border-white/[0.06] px-5 py-4">

                <div className="flex items-center gap-2">
                  <Sparkles
                    size={15}
                    className="text-[#7dff9a]"
                  />

                  <h3 className="text-sm font-semibold">
                    AI crop prediction
                  </h3>
                </div>

                <p className="mt-1 text-[9px] text-[#667269]">
                  Predicted crop health over the next period
                </p>
              </div>

              <div className="p-5">

                <div className="flex items-end justify-between">

                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-[#667269]">
                      Predicted health
                    </p>

                    <div className="mt-2">
                      <span className="text-5xl font-semibold tracking-[-0.05em]">
                        {aiPrediction.predictedHealth}
                      </span>

                      <span className="ml-1 text-sm text-[#667269]">
                        /100
                      </span>
                    </div>
                  </div>

                  <span className="rounded-full border border-[#7dff9a]/10 bg-[#7dff9a]/5 px-2 py-1 text-[9px] text-[#7dff9a]">
                    {aiPrediction.confidence}% confidence
                  </span>
                </div>

                <div className="mt-7 space-y-5">

                  <PredictionRow
                    label="Disease pressure"
                    value={
                      aiPrediction.diseasePressure <
                      30
                        ? "Low"
                        : aiPrediction.diseasePressure <
                            60
                          ? "Moderate"
                          : "High"
                    }
                    percentage={
                      aiPrediction.diseasePressure
                    }
                  />

                  <PredictionRow
                    label="Water stress"
                    value={
                      aiPrediction.waterStress <
                      30
                        ? "Low"
                        : aiPrediction.waterStress <
                            60
                          ? "Moderate"
                          : "High"
                    }
                    percentage={
                      aiPrediction.waterStress
                    }
                  />

                  <PredictionRow
                    label="Heat stress"
                    value={
                      aiPrediction.heatStress <
                      30
                        ? "Low"
                        : aiPrediction.heatStress <
                            60
                          ? "Moderate"
                          : "High"
                    }
                    percentage={
                      aiPrediction.heatStress
                    }
                  />
                </div>

                {/* AI recommendation */}
                <div className="mt-6 rounded-xl border border-[#7dff9a]/10 bg-[#7dff9a]/[0.03] p-4">

                  <div className="flex items-start gap-2">
                    <Sparkles
                      size={13}
                      className="mt-0.5 shrink-0 text-[#7dff9a]"
                    />

                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-[#667269]">
                        AI recommendation
                      </p>

                      <p className="mt-2 text-[10px] leading-5 text-[#aeb9b1]">
                        {aiPrediction.recommendation}
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href="/predictions"
                  className="mt-5 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-2">

                    <Sparkles
                      size={13}
                      className="text-[#7dff9a]"
                    />

                    <span className="text-[10px] text-[#c4ccc6]">
                      Open AI prediction analysis
                    </span>
                  </div>

                  <ChevronRight
                    size={14}
                    className="text-[#667269]"
                  />
                </a>
              </div>
            </section>
          </div>

          {/* Field requiring attention */}
          {primaryFieldIntelligence && (
            <section className="mt-5 rounded-2xl border border-[#f6c453]/10 bg-[#0d0d09] p-5">

              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f6c453]/10">
                    <Droplets
                      size={18}
                      className="text-[#f6c453]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">
                        AI attention alert
                      </h3>

                      <span className="rounded-full bg-[#f6c453]/10 px-2 py-1 text-[8px] text-[#f6c453]">
                        {primaryFieldIntelligence.risk} risk
                      </span>
                    </div>

                    <p className="mt-1 text-[10px] text-[#667269]">
                      {primaryFieldIntelligence.field.name}
                      {" · "}
                      {primaryFieldIntelligence.crop}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 sm:min-w-[300px]">

                  <AttentionMetric
                    label="Health"
                    value={`${primaryFieldIntelligence.health}`}
                  />

                  <AttentionMetric
                    label="Moisture"
                    value={`${primaryFieldIntelligence.moisture}%`}
                  />

                  <AttentionMetric
                    label="Temp"
                    value={`${primaryFieldIntelligence.temperature.toFixed(1)}°`}
                  />
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-[#f6c453]/10 bg-[#f6c453]/[0.035] p-4">

                <p className="text-[9px] uppercase tracking-wider text-[#667269]">
                  AI recommendations
                </p>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">

                  {primaryFieldIntelligence.recommendations.map(
                    (recommendation) => (
                      <div
                        key={recommendation}
                        className="flex items-start gap-2 text-[10px] leading-5 text-[#aeb9b1]"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f6c453]" />

                        <span>
                          {recommendation}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Environmental panel */}
          <section className="mt-5 rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5">

            <div className="mb-5 flex items-center justify-between">

              <div>
                <h3 className="text-sm font-semibold">
                  Environmental conditions
                </h3>

                <p className="mt-1 text-[9px] text-[#667269]">
                  Live weather conditions from the farm location
                </p>
              </div>

              <CloudSun
                size={18}
                className="text-[#7dff9a]"
              />
            </div>

            {weatherLoading ? (
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-5 text-center text-xs text-[#667269]">
                Loading live weather...
              </div>
            ) : weatherError ? (
              <div className="rounded-xl border border-[#ff6b6b]/10 bg-[#ff6b6b]/[0.03] p-5 text-center text-xs text-[#ff6b6b]">
                {weatherError}
              </div>
            ) : weather ? (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">

                  <EnvironmentCard
                    icon={<Thermometer size={15} />}
                    label="Temperature"
                    value={`${weather.temperature.toFixed(1)}°C`}
                    detail={
                      weather.weatherDescription
                    }
                  />

                  <EnvironmentCard
                    icon={<Droplets size={15} />}
                    label="Humidity"
                    value={`${weather.humidity}%`}
                    detail="Live"
                  />

                  <EnvironmentCard
                    icon={<Wind size={15} />}
                    label="Wind"
                    value={`${weather.windSpeed.toFixed(1)} km/h`}
                    detail="Current"
                  />

                  <EnvironmentCard
                    icon={<CloudSun size={15} />}
                    label="Rainfall"
                    value={`${weather.rainfall} mm`}
                    detail="Current"
                  />
                </div>

                <div className="mt-4 flex flex-col justify-between gap-2 rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-[9px] text-[#667269] sm:flex-row">
                  <span>
                    {weather.location} ·{" "}
                    {weather.weatherDescription}
                  </span>

                  <span>
                    Updated{" "}
                    {new Date(
                      weather.updatedAt,
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </>
            ) : null}
          </section>

          {/* Bottom actions */}
          <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">

            <ActionCard
              href="/analytics"
              icon={<Sparkles size={17} />}
              title="Analytics"
              description="Explore farm trends and metrics."
            />

            <ActionCard
              href="/decision-center"
              icon={<ShieldCheck size={17} />}
              title="Decision Center"
              description="Review AI recommendations."
            />

            <ActionCard
              href="/alerts"
              icon={<Bell size={17} />}
              title="Alerts"
              description={`${attentionZones} field${
                attentionZones !== 1
                  ? "s"
                  : ""
              } currently require attention.`}
            />
          </section>

          {/* Footer */}
          <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-white/[0.05] pt-4 text-[9px] text-[#4f5b53] sm:flex-row">

            <span>
              AgroPulse AI · Agricultural Intelligence Platform
            </span>

            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7dff9a]" />

              AI intelligence + live weather connected
            </span>
          </footer>
        </div>
      </div>
    </main>
  );
}

/* -------------------------------------------------------
   Components
------------------------------------------------------- */

function DashboardNavLink({
  href,
  label,
  active = false,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`rounded-lg px-3 py-2 text-[9px] transition ${
        active
          ? "bg-[#7dff9a]/10 text-[#7dff9a]"
          : "text-[#667269] hover:bg-white/[0.04] hover:text-white"
      }`}
    >
      {label}
    </a>
  );
}

function NotificationItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
      <div className="flex items-start gap-2">
        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f6c453]" />

        <div>
          <p className="text-[10px] font-medium">
            {title}
          </p>

          <p className="mt-1 text-[9px] leading-4 text-[#667269]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function ZoneRow({
  name,
  crop,
  health,
  moisture,
  temperature,
  risk,
  status,
}: {
  name: string;
  crop: string;
  health: number;
  moisture: number;
  temperature: number;
  risk: string;
  status: string;
}) {
  const statusColor =
    status === "Healthy"
      ? "text-[#7dff9a]"
      : status === "Watch"
        ? "text-[#f6c453]"
        : "text-[#ff6b6b]";

  const statusDot =
    status === "Healthy"
      ? "bg-[#7dff9a]"
      : status === "Watch"
        ? "bg-[#f6c453]"
        : "bg-[#ff6b6b]";

  return (
    <div className="px-5 py-4 transition hover:bg-white/[0.015]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="min-w-[180px]">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${statusDot}`}
            />

            <p className="text-xs font-medium">
              {name}
            </p>
          </div>

          <p className="mt-1 pl-4 text-[9px] text-[#667269]">
            {crop}
          </p>
        </div>

        <div className="grid flex-1 grid-cols-3 gap-3 sm:max-w-[500px]">

          <MetricMini
            label="Health"
            value={`${health}`}
          />

          <MetricMini
            label="Moisture"
            value={`${moisture}%`}
          />

          <MetricMini
            label="Temp"
            value={`${temperature.toFixed(1)}°`}
          />
        </div>

        <div className="flex items-center justify-between gap-4 sm:min-w-[110px] sm:justify-end">

          <div className="text-right">
            <p className="text-[8px] uppercase tracking-wider text-[#667269]">
              Risk
            </p>

            <p
              className={`mt-1 text-[10px] font-medium ${statusColor}`}
            >
              {risk}
            </p>
          </div>

          <ChevronRight
            size={13}
            className="text-[#4f5b53]"
          />
        </div>
      </div>
    </div>
  );
}

function MetricMini({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[8px] uppercase tracking-wider text-[#4f5b53]">
        {label}
      </p>

      <p className="mt-1 text-xs font-medium text-[#cbd4ce]">
        {value}
      </p>
    </div>
  );
}

function PredictionRow({
  label,
  value,
  percentage,
}: {
  label: string;
  value: string;
  percentage: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">

        <span className="text-[10px] text-[#78837c]">
          {label}
        </span>

        <span className="text-[9px] text-[#667269]">
          {value} · {percentage}%
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">

        <div
          className="h-full rounded-full bg-[#7dff9a]"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function EnvironmentCard({
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

      <div className="mt-4 flex items-end justify-between gap-2">

        <span className="text-2xl font-semibold tracking-[-0.03em]">
          {value}
        </span>

        <span className="text-right text-[9px] text-[#667269]">
          {detail}
        </span>
      </div>
    </div>
  );
}

function RiskBox({
  label,
  value,
  className,
  background,
}: {
  label: string;
  value: number;
  className: string;
  background: string;
}) {
  return (
    <div
      className={`rounded-xl ${background} p-3`}
    >
      <p className="text-[8px] uppercase tracking-wider text-[#667269]">
        {label}
      </p>

      <p
        className={`mt-1 text-xl font-semibold ${className}`}
      >
        {value}
      </p>
    </div>
  );
}

function AttentionMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[8px] uppercase tracking-wider text-[#667269]">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-[#cbd4ce]">
        {value}
      </p>
    </div>
  );
}

function ActionCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className="group rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5 transition hover:border-[#7dff9a]/20 hover:bg-[#0b110d]"
    >
      <div className="flex items-center justify-between">

        <span className="text-[#7dff9a]">
          {icon}
        </span>

        <ArrowUpRight
          size={14}
          className="text-[#4f5b53] transition group-hover:text-[#7dff9a]"
        />
      </div>

      <h3 className="mt-5 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-1 text-[10px] leading-5 text-[#667269]">
        {description}
      </p>
    </a>
  );
}