"use client";

import Link from "next/link";
import { ArrowLeft, Bell, Database, MapPin, Save, Settings } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [aiAlerts, setAiAlerts] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [saved, setSaved] = useState(false);

  const saveSettings = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#050706] text-[#f4f7f4]">
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7dff9a]/10">
              <Settings size={17} className="text-[#7dff9a]" />
            </div>

            <div>
              <h1 className="text-sm font-semibold">Settings</h1>
              <p className="text-[9px] uppercase tracking-[0.15em] text-[#667269]">
                System configuration
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1000px] px-5 py-8 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#667269]">
            AgroPulse configuration
          </p>

          <h2 className="text-3xl font-semibold tracking-[-0.03em]">
            System <span className="text-[#7dff9a]">Settings</span>
          </h2>
        </div>

        <div className="space-y-4">
          {/* Farm */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5">
            <div className="flex items-center gap-3">
              <MapPin size={17} className="text-[#7dff9a]" />

              <div>
                <h3 className="text-sm font-semibold">Farm location</h3>
                <p className="mt-1 text-[10px] text-[#667269]">
                  Current monitored farm
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-xs text-[#78837c]">Farm</p>
              <p className="mt-1 text-sm font-medium">Green Valley Farm</p>

              <p className="mt-4 text-xs text-[#78837c]">Region</p>
              <p className="mt-1 text-sm font-medium">
                North Valluru, Andhra Pradesh
              </p>
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5">
            <div className="flex items-center gap-3">
              <Bell size={17} className="text-[#7dff9a]" />

              <div>
                <h3 className="text-sm font-semibold">Notifications</h3>
                <p className="mt-1 text-[10px] text-[#667269]">
                  Configure farm monitoring notifications
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <Toggle
                label="Farm notifications"
                description="Receive important farm monitoring notifications."
                enabled={notifications}
                onChange={setNotifications}
              />

              <Toggle
                label="AI alerts"
                description="Allow AgroPulse AI to highlight potential risks."
                enabled={aiAlerts}
                onChange={setAiAlerts}
              />

              <Toggle
                label="Automatic data refresh"
                description="Refresh dashboard intelligence automatically."
                enabled={autoRefresh}
                onChange={setAutoRefresh}
              />
            </div>
          </section>

          {/* Data */}
          <section className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5">
            <div className="flex items-center gap-3">
              <Database size={17} className="text-[#7dff9a]" />

              <div>
                <h3 className="text-sm font-semibold">Data intelligence</h3>
                <p className="mt-1 text-[10px] text-[#667269]">
                  AgroPulse farm data configuration
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <InfoBox label="Data source" value="Farm Dataset" />
              <InfoBox label="AI engine" value="AgroPulse Intelligence" />
              <InfoBox label="Monitoring mode" value="Live simulation" />
              <InfoBox label="Map provider" value="OpenStreetMap" />
            </div>
          </section>

          <div className="flex items-center justify-between pt-2">
            <div>
              {saved && (
                <span className="text-xs text-[#7dff9a]">
                  Settings saved successfully.
                </span>
              )}
            </div>

            <button
              onClick={saveSettings}
              className="flex items-center gap-2 rounded-xl bg-[#7dff9a] px-5 py-3 text-xs font-semibold text-[#071008] transition hover:bg-[#9affad]"
            >
              <Save size={14} />
              Save settings
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Toggle({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
      <div>
        <p className="text-xs font-medium">{label}</p>
        <p className="mt-1 text-[10px] leading-5 text-[#667269]">
          {description}
        </p>
      </div>

      <button
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-[#7dff9a]" : "bg-white/10"
        }`}
        aria-label={label}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full transition ${
            enabled
              ? "left-6 bg-[#071008]"
              : "left-1 bg-[#78837c]"
          }`}
        />
      </button>
    </div>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">
      <p className="text-[9px] uppercase tracking-wider text-[#667269]">
        {label}
      </p>

      <p className="mt-2 text-xs font-medium text-[#dce5de]">
        {value}
      </p>
    </div>
  );
}