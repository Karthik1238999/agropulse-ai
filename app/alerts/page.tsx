"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Droplets,
  Leaf,
  ShieldAlert,
  Thermometer,
  X,
} from "lucide-react";
import { useState } from "react";
import { farmZones } from "@/lib/farmData";

type AlertItem = {
  id: number;
  title: string;
  description: string;
  zone: string;
  severity: "Critical" | "Warning" | "Info";
  icon: React.ReactNode;
};

const initialAlerts: AlertItem[] = [
  {
    id: 1,
    title: "Low soil moisture detected",
    description:
      "South Field moisture is below the preferred range. Irrigation is recommended.",
    zone: "South Field",
    severity: "Warning",
    icon: <Droplets size={17} />,
  },
  {
    id: 2,
    title: "Elevated temperature",
    description:
      "South Field temperature is higher than the farm average.",
    zone: "South Field",
    severity: "Warning",
    icon: <Thermometer size={17} />,
  },
  {
    id: 3,
    title: "Crop health requires attention",
    description:
      "Maize health in South Field is below the other farm zones.",
    zone: "South Field",
    severity: "Info",
    icon: <Leaf size={17} />,
  },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts);

  const dismissAlert = (id: number) => {
    setAlerts((current) => current.filter((alert) => alert.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#050706] text-[#f4f7f4]">
      <div className="min-h-screen">
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

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ff6b6b]/10">
                <ShieldAlert size={17} className="text-[#ff6b6b]" />
              </div>

              <div>
                <h1 className="text-sm font-semibold">Alerts</h1>
                <p className="text-[9px] uppercase tracking-[0.15em] text-[#667269]">
                  Farm monitoring
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#7dff9a] shadow-[0_0_10px_#7dff9a]" />
            <span className="hidden text-[10px] text-[#78837c] sm:block">
              Monitoring active
            </span>
          </div>
        </header>

        <div className="mx-auto max-w-[1200px] px-5 py-8 lg:px-8">
          <div className="mb-8">
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#667269]">
              Command Center
            </p>

            <h2 className="text-3xl font-semibold tracking-[-0.03em]">
              Farm <span className="text-[#7dff9a]">Alerts</span>
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#78837c]">
              Monitor important crop, soil and environmental conditions across
              your farm.
            </p>
          </div>

          {/* Alert summary */}
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5">
              <div className="flex items-center gap-2 text-[#ff6b6b]">
                <ShieldAlert size={16} />
                <span className="text-[10px] uppercase tracking-[0.14em]">
                  Active alerts
                </span>
              </div>

              <p className="mt-4 text-3xl font-semibold">{alerts.length}</p>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5">
              <div className="flex items-center gap-2 text-[#f6c453]">
                <AlertTriangle size={16} />
                <span className="text-[10px] uppercase tracking-[0.14em]">
                  Zones requiring attention
                </span>
              </div>

              <p className="mt-4 text-3xl font-semibold">
                {farmZones.filter((zone) => zone.status !== "Healthy").length}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5">
              <div className="flex items-center gap-2 text-[#7dff9a]">
                <CheckCircle2 size={16} />
                <span className="text-[10px] uppercase tracking-[0.14em]">
                  Healthy zones
                </span>
              </div>

              <p className="mt-4 text-3xl font-semibold">
                {farmZones.filter((zone) => zone.status === "Healthy").length}
              </p>
            </div>
          </div>

          {/* Alerts */}
          <div className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c]">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <div>
                <h3 className="text-sm font-semibold">Active notifications</h3>
                <p className="mt-1 text-[10px] text-[#667269]">
                  AI-generated farm intelligence
                </p>
              </div>
            </div>

            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7dff9a]/10">
                  <CheckCircle2
                    size={22}
                    className="text-[#7dff9a]"
                  />
                </div>

                <h3 className="mt-4 text-sm font-semibold">
                  No active alerts
                </h3>

                <p className="mt-2 max-w-sm text-xs leading-5 text-[#667269]">
                  All monitored farm conditions are currently within the
                  configured thresholds.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.05]">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex gap-4 px-5 py-5 transition hover:bg-white/[0.015]"
                  >
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        alert.severity === "Warning"
                          ? "bg-[#f6c453]/10 text-[#f6c453]"
                          : alert.severity === "Critical"
                            ? "bg-[#ff6b6b]/10 text-[#ff6b6b]"
                            : "bg-[#7dff9a]/10 text-[#7dff9a]"
                      }`}
                    >
                      {alert.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-medium">
                          {alert.title}
                        </h4>

                        <span
                          className={`rounded-full px-2 py-1 text-[8px] uppercase tracking-wider ${
                            alert.severity === "Warning"
                              ? "bg-[#f6c453]/10 text-[#f6c453]"
                              : alert.severity === "Critical"
                                ? "bg-[#ff6b6b]/10 text-[#ff6b6b]"
                                : "bg-[#7dff9a]/10 text-[#7dff9a]"
                          }`}
                        >
                          {alert.severity}
                        </span>
                      </div>

                      <p className="mt-2 max-w-2xl text-xs leading-5 text-[#78837c]">
                        {alert.description}
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="rounded-lg bg-white/[0.04] px-2 py-1 text-[9px] text-[#667269]">
                          {alert.zone}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#4f5b53] transition hover:bg-white/[0.05] hover:text-white"
                      aria-label="Dismiss alert"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 border-t border-white/[0.05] pt-4 text-[10px] text-[#4f5b53]">
            AgroPulse AI · Intelligent farm monitoring
          </div>
        </div>
      </div>
    </main>
  );
}