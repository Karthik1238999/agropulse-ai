"use client";

import { useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  ArrowLeft,
  Droplets,
  Leaf,
  Map as MapIcon,
  Thermometer,
  ShieldAlert,
  Sprout,
  BrainCircuit,
  Navigation,
  RefreshCw,
} from "lucide-react";

type LayerType = "health" | "moisture" | "temperature" | "risk";

type Zone = {
  id: string;
  name: string;
  crop: string;
  health: number;
  moisture: number;
  temperature: number;
  risk: number;
  status: string;
  center: [number, number];
  polygon: [number, number][];
  recommendation: string;
};

const zones: Zone[] = [
  {
    id: "north",
    name: "North Field",
    crop: "Rice",
    health: 94,
    moisture: 72,
    temperature: 26.4,
    risk: 8,
    status: "Healthy",
    center: [16.5204, 80.6325],
    polygon: [
      [16.523, 80.628],
      [16.523, 80.637],
      [16.518, 80.637],
      [16.518, 80.628],
    ],
    recommendation:
      "North Field is performing exceptionally well. Maintain the current irrigation schedule.",
  },
  {
    id: "east",
    name: "East Field",
    crop: "Cotton",
    health: 87,
    moisture: 64,
    temperature: 27.8,
    risk: 17,
    status: "Healthy",
    center: [16.518, 80.643],
    polygon: [
      [16.522, 80.639],
      [16.522, 80.648],
      [16.514, 80.648],
      [16.514, 80.639],
    ],
    recommendation:
      "Cotton health is stable. Monitor moisture levels during the next irrigation cycle.",
  },
  {
    id: "south",
    name: "South Field",
    crop: "Maize",
    health: 76,
    moisture: 48,
    temperature: 29.6,
    risk: 54,
    status: "Watch",
    center: [16.512, 80.635],
    polygon: [
      [16.516, 80.628],
      [16.516, 80.638],
      [16.508, 80.638],
      [16.508, 80.628],
    ],
    recommendation:
      "AI detected a moisture imbalance. Inspect irrigation and soil moisture within 24 hours.",
  },
  {
    id: "west",
    name: "West Field",
    crop: "Chilli",
    health: 91,
    moisture: 69,
    temperature: 27.1,
    risk: 11,
    status: "Healthy",
    center: [16.513, 80.624],
    polygon: [
      [16.517, 80.618],
      [16.517, 80.628],
      [16.509, 80.628],
      [16.509, 80.618],
    ],
    recommendation:
      "Chilli crop conditions are favorable. Continue normal monitoring.",
  },
];

function getLayerValue(zone: Zone, layer: LayerType) {
  switch (layer) {
    case "health":
      return zone.health;
    case "moisture":
      return zone.moisture;
    case "temperature":
      return zone.temperature;
    case "risk":
      return zone.risk;
  }
}

function getLayerLabel(layer: LayerType) {
  switch (layer) {
    case "health":
      return "Crop Health";
    case "moisture":
      return "Soil Moisture";
    case "temperature":
      return "Temperature";
    case "risk":
      return "Risk";
  }
}

function getZoneColor(zone: Zone, layer: LayerType) {
  const value = getLayerValue(zone, layer);

  if (layer === "health") {
    if (value >= 90) return "#7dff9a";
    if (value >= 80) return "#b9e96b";
    return "#f6c453";
  }

  if (layer === "moisture") {
    if (value >= 65) return "#55d6be";
    if (value >= 55) return "#f6c453";
    return "#ff6b6b";
  }

  if (layer === "temperature") {
    if (value <= 27) return "#7dff9a";
    if (value <= 29) return "#f6c453";
    return "#ff6b6b";
  }

  if (value <= 20) return "#7dff9a";
  if (value <= 40) return "#f6c453";
  return "#ff6b6b";
}

function MapRecenter({ zone }: { zone: Zone | null }) {
  const map = useMap();

  if (zone) {
    map.flyTo(zone.center, 15, {
      duration: 0.8,
    });
  }

  return null;
}

export default function MapClient() {
  const [activeLayer, setActiveLayer] = useState<LayerType>("health");
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const selectedValue = useMemo(() => {
    if (!selectedZone) return null;

    return getLayerValue(selectedZone, activeLayer);
  }, [selectedZone, activeLayer]);

  const refreshMap = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 900);
  };

  return (
    <main className="min-h-screen bg-[#050706] text-[#f4f7f4]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[-15%] h-[500px] w-[500px] rounded-full bg-[#7dff9a]/[0.035] blur-[120px]" />

        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>
      </div>

      <div className="relative min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 flex h-[72px] items-center justify-between border-b border-white/[0.07] bg-[#050706]/90 px-5 backdrop-blur-xl lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-xs text-[#8d9891] transition hover:border-[#7dff9a]/20 hover:text-white"
            >
              <ArrowLeft size={15} />
              Dashboard
            </button>

            <div className="hidden h-6 w-px bg-white/[0.08] sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#7dff9a]/20 bg-[#7dff9a]/[0.06]">
                <MapIcon size={17} className="text-[#7dff9a]" />
              </div>

              <div>
                <h1 className="text-sm font-semibold">Farm Digital Twin</h1>
                <p className="text-[9px] uppercase tracking-[0.18em] text-[#667269]">
                  Spatial Intelligence
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-[#7dff9a]/10 bg-[#7dff9a]/[0.05] px-3 py-1.5 text-[9px] text-[#7dff9a] sm:block">
              ● LIVE DATA
            </span>

            <button
              onClick={refreshMap}
              className="rounded-xl border border-white/[0.07] p-2.5 text-[#8d9891] transition hover:bg-white/[0.04] hover:text-white"
              title="Refresh map data"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 lg:p-7">
          <div className="mx-auto max-w-[1600px]">
            {/* Heading */}
            <div className="mb-5">
              <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#667269]">
                <Navigation size={12} className="text-[#7dff9a]" />
                Andhra Pradesh · Green Valley Farm
              </div>

              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <h2 className="text-3xl font-semibold tracking-[-0.03em]">
                    Farm Map
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#78837c]">
                    Explore your farm&apos;s virtual sensor mesh and inspect
                    crop-health conditions across individual field zones.
                  </p>
                </div>

                <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-[#667269]">
                    Active Layer
                  </p>

                  <p className="mt-1 text-xs font-medium text-[#7dff9a]">
                    {getLayerLabel(activeLayer)}
                  </p>
                </div>
              </div>
            </div>

            {/* Main layout */}
            <div className="grid gap-4 xl:grid-cols-[1fr_330px]">
              {/* Map */}
              <div className="relative h-[620px] overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0a0f0c]">
                {/* Layer controls */}
                <div className="absolute left-4 top-4 z-[1000] flex flex-wrap gap-2">
                  {[
                    {
                      id: "health" as LayerType,
                      label: "Crop Health",
                      icon: Leaf,
                    },
                    {
                      id: "moisture" as LayerType,
                      label: "Moisture",
                      icon: Droplets,
                    },
                    {
                      id: "temperature" as LayerType,
                      label: "Temperature",
                      icon: Thermometer,
                    },
                    {
                      id: "risk" as LayerType,
                      label: "Risk",
                      icon: ShieldAlert,
                    },
                  ].map((layer) => {
                    const Icon = layer.icon;
                    const active = activeLayer === layer.id;

                    return (
                      <button
                        key={layer.id}
                        onClick={() => setActiveLayer(layer.id)}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-medium backdrop-blur-xl transition ${
                          active
                            ? "border-[#7dff9a]/25 bg-[#102116]/95 text-[#7dff9a]"
                            : "border-white/[0.08] bg-[#080b09]/90 text-[#8d9891] hover:bg-[#101712]"
                        }`}
                      >
                        <Icon size={13} />
                        {layer.label}
                      </button>
                    );
                  })}
                </div>

                {/* Map status */}
                <div className="absolute bottom-4 left-4 z-[1000] rounded-xl border border-white/[0.07] bg-[#080b09]/90 px-3 py-2 backdrop-blur-xl">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#7dff9a] shadow-[0_0_10px_#7dff9a]" />
                    <span className="text-[10px] text-[#8d9891]">
                      Virtual sensor mesh active
                    </span>
                  </div>
                </div>

                <MapContainer
                  center={[16.516, 80.633]}
                  zoom={14}
                  scrollWheelZoom={true}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {zones.map((zone) => {
                    const color = getZoneColor(zone, activeLayer);

                    return (
                      <Polygon
                        key={zone.id}
                        positions={zone.polygon}
                        pathOptions={{
                          color,
                          fillColor: color,
                          fillOpacity: 0.28,
                          weight: 2,
                        }}
                        eventHandlers={{
                          click: () => setSelectedZone(zone),
                        }}
                      >
                        <Popup>
                          <div className="min-w-[180px] text-black">
                            <strong>{zone.name}</strong>
                            <br />
                            Crop: {zone.crop}
                            <br />
                            Health: {zone.health}/100
                            <br />
                            Moisture: {zone.moisture}%
                            <br />
                            Temperature: {zone.temperature}°C
                            <br />
                            Risk: {zone.risk}%
                          </div>
                        </Popup>
                      </Polygon>
                    );
                  })}

                  {zones.map((zone) => (
                    <CircleMarker
                      key={`marker-${zone.id}`}
                      center={zone.center}
                      radius={6}
                      pathOptions={{
                        color: "#ffffff",
                        weight: 2,
                        fillColor: getZoneColor(zone, activeLayer),
                        fillOpacity: 1,
                      }}
                      eventHandlers={{
                        click: () => setSelectedZone(zone),
                      }}
                    />
                  ))}

                  <MapRecenter zone={selectedZone} />
                </MapContainer>
              </div>

              {/* Side panel */}
              <aside className="space-y-4">
                {/* Selected zone */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5">
                  <div className="flex items-center gap-2">
                    <Sprout size={15} className="text-[#7dff9a]" />
                    <h3 className="text-sm font-medium">Zone Intelligence</h3>
                  </div>

                  {!selectedZone ? (
                    <div className="mt-6 rounded-xl border border-dashed border-white/[0.08] p-5 text-center">
                      <MapIcon
                        size={22}
                        className="mx-auto text-[#4f5b53]"
                      />

                      <p className="mt-3 text-xs text-[#78837c]">
                        Select a field on the map
                      </p>

                      <p className="mt-1 text-[10px] text-[#4f5b53]">
                        Click any zone to inspect its digital twin data.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mt-5 flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-semibold">
                            {selectedZone.name}
                          </h4>
                          <p className="mt-1 text-[10px] text-[#667269]">
                            {selectedZone.crop}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2 py-1 text-[9px] ${
                            selectedZone.status === "Healthy"
                              ? "bg-[#7dff9a]/10 text-[#7dff9a]"
                              : "bg-[#f6c453]/10 text-[#f6c453]"
                          }`}
                        >
                          {selectedZone.status}
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-2">
                        <Metric
                          icon={Leaf}
                          label="Health"
                          value={`${selectedZone.health}`}
                          suffix="/100"
                        />

                        <Metric
                          icon={Droplets}
                          label="Moisture"
                          value={`${selectedZone.moisture}`}
                          suffix="%"
                        />

                        <Metric
                          icon={Thermometer}
                          label="Temp"
                          value={`${selectedZone.temperature}`}
                          suffix="°C"
                        />

                        <Metric
                          icon={ShieldAlert}
                          label="Risk"
                          value={`${selectedZone.risk}`}
                          suffix="%"
                        />
                      </div>

                      <div className="mt-4 rounded-xl border border-[#7dff9a]/10 bg-[#7dff9a]/[0.035] p-4">
                        <div className="flex items-center gap-2">
                          <BrainCircuit
                            size={14}
                            className="text-[#7dff9a]"
                          />
                          <span className="text-[10px] font-medium text-[#7dff9a]">
                            AI RECOMMENDATION
                          </span>
                        </div>

                        <p className="mt-3 text-[11px] leading-5 text-[#8d9891]">
                          {selectedZone.recommendation}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Farm overview */}
                <div className="rounded-2xl border border-white/[0.07] bg-[#0a0f0c] p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Farm Overview</h3>
                    <span className="text-[9px] text-[#7dff9a]">
                      4 ZONES
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    {zones.map((zone) => {
                      const value = getLayerValue(zone, activeLayer);

                      return (
                        <button
                          key={zone.id}
                          onClick={() => setSelectedZone(zone)}
                          className="flex w-full items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] p-3 text-left transition hover:border-[#7dff9a]/15 hover:bg-[#7dff9a]/[0.025]"
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{
                              backgroundColor: getZoneColor(
                                zone,
                                activeLayer,
                              ),
                            }}
                          />

                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-medium">
                              {zone.name}
                            </p>
                            <p className="mt-0.5 text-[9px] text-[#667269]">
                              {zone.crop}
                            </p>
                          </div>

                          <span className="text-xs font-semibold">
                            {value}
                            {activeLayer === "temperature" ? "°" : "%"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* AI system status */}
                <div className="rounded-2xl border border-[#7dff9a]/10 bg-[#0b120d] p-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7dff9a]/10">
                      <BrainCircuit
                        size={15}
                        className="text-[#7dff9a]"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-medium">AI Spatial Engine</p>
                      <p className="text-[9px] text-[#667269]">
                        Digital twin operational
                      </p>
                    </div>

                    <span className="ml-auto h-2 w-2 rounded-full bg-[#7dff9a] shadow-[0_0_10px_#7dff9a]" />
                  </div>

                  <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div className="h-full w-[92%] rounded-full bg-[#7dff9a]" />
                  </div>

                  <p className="mt-2 text-[9px] text-[#667269]">
                    92% spatial confidence
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  suffix: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.05] bg-white/[0.018] p-3">
      <div className="flex items-center gap-1.5">
        <Icon size={11} className="text-[#7dff9a]" />
        <span className="text-[9px] text-[#667269]">{label}</span>
      </div>

      <div className="mt-2">
        <span className="text-lg font-semibold">{value}</span>
        <span className="ml-1 text-[9px] text-[#667269]">{suffix}</span>
      </div>
    </div>
  );
}