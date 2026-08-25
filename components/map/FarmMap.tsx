"use client";

import "leaflet/dist/leaflet.css";

import {
  CircleMarker,
  MapContainer,
  Polygon,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import { useEffect } from "react";

import FarmWeatherOverlay, {
  type WeatherData,
} from "@/components/map/FarmWeatherOverlay";

import {
  FARM_CENTER,
  FARM_BOUNDARY,
  farmZones,
} from "@/lib/farmData";

/*
 * Fix Leaflet default marker icons.
 */

const defaultIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon =
  defaultIcon;

/*
 * Automatically center map.
 */

function FarmMapController() {
  const map = useMap();

  useEffect(() => {
    map.setView(FARM_CENTER, 15);

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

/*
 * Crop health color.
 */

function getZoneColor(
  health: number,
) {
  if (health >= 90) {
    return "#7dff9a";
  }

  if (health >= 80) {
    return "#b8e986";
  }

  if (health >= 70) {
    return "#f6c453";
  }

  return "#ff6b6b";
}

/*
 * Risk color.
 */

function getRiskColor(
  risk: "Low" | "Moderate" | "High",
) {
  if (risk === "Low") {
    return "#7dff9a";
  }

  if (risk === "Moderate") {
    return "#f6c453";
  }

  return "#ff6b6b";
}

type FarmMapProps = {
  weather: WeatherData | null;
  weatherLoading?: boolean;
  weatherError?: string | null;
};

export default function FarmMap({
  weather,
  weatherLoading = false,
  weatherError = null,
}: FarmMapProps) {
  return (
    <div className="relative h-full min-h-[600px] w-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#07100b]">

      <MapContainer
        center={FARM_CENTER}
        zoom={15}
        minZoom={12}
        maxZoom={19}
        scrollWheelZoom={true}
        zoomControl={true}
        className="h-full min-h-[600px] w-full"
      >

        <FarmMapController />

        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        {/* Farm boundary */}

        <Polygon
          positions={FARM_BOUNDARY}
          pathOptions={{
            color: "#7dff9a",
            weight: 2,
            opacity: 0.9,
            fillColor: "#7dff9a",
            fillOpacity: 0.08,
          }}
        >
          <Popup>
            <div className="min-w-[180px]">

              <p className="font-semibold">
                AgroPulse Farm
              </p>

              <p className="mt-1 text-xs">
                North Valluru agricultural zone
              </p>

              <p className="mt-2 text-xs">
                AI monitored farm boundary
              </p>

            </div>
          </Popup>
        </Polygon>

        {/* Farm zones */}

        {farmZones.map((zone) => {
          const zoneColor =
            getZoneColor(zone.health);

          const riskColor =
            getRiskColor(zone.risk);

          const analyticsUrl =
            `/analytics?zone=${encodeURIComponent(
              zone.name,
            )}&id=${encodeURIComponent(zone.id)}`;

          const decisionUrl =
            `/decision-center?zone=${encodeURIComponent(
              zone.name,
            )}&id=${encodeURIComponent(zone.id)}`;

          return (
            <div key={zone.id}>

              {/* Zone polygon */}

              <Polygon
                positions={zone.polygon}
                pathOptions={{
                  color: zoneColor,
                  weight: 2,
                  opacity: 0.9,
                  fillColor: zoneColor,
                  fillOpacity: 0.18,
                }}
              >
                <Popup>
                  <div className="min-w-[220px]">

                    <div className="flex items-center justify-between gap-4">

                      <div>

                        <p className="text-sm font-semibold">
                          {zone.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {zone.crop}
                        </p>

                      </div>

                      <span
                        style={{
                          color: riskColor,
                        }}
                        className="text-xs font-medium"
                      >
                        {zone.risk} Risk
                      </span>

                    </div>

                    <div className="mt-4 space-y-2">

                      <div className="flex justify-between">

                        <span className="text-xs text-gray-500">
                          Crop health
                        </span>

                        <strong className="text-xs">
                          {zone.health}/100
                        </strong>

                      </div>

                      <div className="flex justify-between">

                        <span className="text-xs text-gray-500">
                          Soil moisture
                        </span>

                        <strong className="text-xs">
                          {zone.moisture}%
                        </strong>

                      </div>

                      <div className="flex justify-between">

                        <span className="text-xs text-gray-500">
                          Temperature
                        </span>

                        <strong className="text-xs">
                          {zone.temperature}°C
                        </strong>

                      </div>

                    </div>

                    <a
                      href={analyticsUrl}
                      className="mt-4 block rounded-lg bg-black px-3 py-2 text-center text-xs text-white"
                    >
                      View Analytics
                    </a>

                    <a
                      href={decisionUrl}
                      className="mt-2 block rounded-lg bg-[#7dff9a] px-3 py-2 text-center text-xs font-medium text-black"
                    >
                      Open Decision Center
                    </a>

                  </div>
                </Popup>
              </Polygon>

              {/* Zone center */}

              <CircleMarker
                center={zone.coordinates}
                radius={8}
                pathOptions={{
                  color: "#050706",
                  weight: 2,
                  fillColor: zoneColor,
                  fillOpacity: 1,
                }}
              >
                <Popup>
                  <div className="min-w-[190px]">

                    <p className="font-semibold">
                      {zone.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {zone.crop}
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2">

                      <div>

                        <p className="text-[10px] text-gray-500">
                          Health
                        </p>

                        <p className="text-sm font-semibold">
                          {zone.health}
                        </p>

                      </div>

                      <div>

                        <p className="text-[10px] text-gray-500">
                          Moisture
                        </p>

                        <p className="text-sm font-semibold">
                          {zone.moisture}%
                        </p>

                      </div>

                    </div>

                    <a
                      href={analyticsUrl}
                      className="mt-3 block rounded-lg bg-black px-3 py-2 text-center text-xs text-white"
                    >
                      Open Analytics
                    </a>

                    <a
                      href={decisionUrl}
                      className="mt-2 block rounded-lg bg-[#7dff9a] px-3 py-2 text-center text-xs font-medium text-black"
                    >
                      Decision Center
                    </a>

                  </div>
                </Popup>
              </CircleMarker>

            </div>
          );
        })}

        {/* Weather */}

        <FarmWeatherOverlay
          weather={weather}
          loading={weatherLoading}
          error={weatherError}
        />

      </MapContainer>

      {/* Map title */}

      <div className="pointer-events-none absolute left-4 top-4 z-[1000]">

        <div className="rounded-xl border border-white/[0.08] bg-[#07100b]/90 px-4 py-3 shadow-xl backdrop-blur-xl">

          <div className="flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-[#7dff9a] shadow-[0_0_10px_#7dff9a]" />

            <p className="text-xs font-medium text-white">
              AgroPulse Farm
            </p>

          </div>

          <p className="mt-1 text-[9px] text-[#78837c]">
            North Valluru · Agricultural Area
          </p>

        </div>

      </div>

      {/* Legend */}

      <div className="absolute bottom-4 left-4 z-[1000] rounded-xl border border-white/[0.08] bg-[#07100b]/95 p-3 shadow-xl backdrop-blur-xl">

        <p className="mb-2 text-[9px] uppercase tracking-[0.15em] text-[#667269]">
          Crop health
        </p>

        <div className="space-y-1.5">

          <LegendItem
            color="#7dff9a"
            label="Excellent"
          />

          <LegendItem
            color="#b8e986"
            label="Good"
          />

          <LegendItem
            color="#f6c453"
            label="Watch"
          />

          <LegendItem
            color="#ff6b6b"
            label="Critical"
          />

        </div>

      </div>

      {/* Farm overview */}

      <div className="absolute bottom-4 right-4 z-[1000] hidden w-[220px] rounded-xl border border-white/[0.08] bg-[#07100b]/95 p-4 shadow-xl backdrop-blur-xl md:block">

        <p className="text-[9px] uppercase tracking-[0.15em] text-[#667269]">
          Farm overview
        </p>

        <div className="mt-3 grid grid-cols-2 gap-3">

          <div>

            <p className="text-[9px] text-[#667269]">
              Zones
            </p>

            <p className="mt-1 text-lg font-semibold">
              {farmZones.length}
            </p>

          </div>

          <div>

            <p className="text-[9px] text-[#667269]">
              Avg health
            </p>

            <p className="mt-1 text-lg font-semibold text-[#7dff9a]">
              {Math.round(
                farmZones.reduce(
                  (sum, zone) =>
                    sum + zone.health,
                  0,
                ) / farmZones.length,
              )}
            </p>

          </div>

        </div>

        <div className="mt-3 border-t border-white/[0.05] pt-3">

          <p className="text-[9px] text-[#667269]">
            Active crops
          </p>

          <p className="mt-1 text-xs text-[#d7ded9]">
            {farmZones
              .map((zone) => zone.crop)
              .join(" · ")}
          </p>

        </div>

      </div>

    </div>
  );
}

function LegendItem({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">

      <span
        className="h-2 w-2 rounded-full"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 7px ${color}`,
        }}
      />

      <span className="text-[9px] text-[#8d9891]">
        {label}
      </span>

    </div>
  );
}