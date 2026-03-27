"use client";

import { useAppSelector } from "@/store/hooks";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { RefreshCw, ZoomIn, Map, AlertTriangle, Navigation } from "lucide-react";

type ZoneStatus = "safe" | "caution" | "danger" | "fire" | "clear";

interface Zone {
  id: string;
  label: string;
  x: number; // percent
  y: number; // percent
  w: number; // percent
  h: number; // percent
  status: ZoneStatus;
  occupancy: number;
  capacity: number;
}

interface ExitMarker {
  x: number;
  y: number;
  direction: "up" | "down" | "left" | "right";
  label: string;
}

const baseZones: Zone[] = [
  { id: "lobby",    label: "Main Lobby",    x: 2,  y: 40, w: 20, h: 24, status: "safe",    occupancy: 28,  capacity: 60 },
  { id: "hall-a",   label: "Hall A",        x: 24, y: 2,  w: 24, h: 38, status: "safe",    occupancy: 15,  capacity: 40 },
  { id: "hall-b",   label: "Hall B",        x: 24, y: 42, w: 24, h: 36, status: "safe",    occupancy: 12,  capacity: 40 },
  { id: "conf-1",   label: "Conf. 301",     x: 50, y: 2,  w: 18, h: 20, status: "safe",    occupancy: 8,   capacity: 20 },
  { id: "conf-2",   label: "Conf. 302",     x: 50, y: 24, w: 18, h: 18, status: "caution", occupancy: 18,  capacity: 20 },
  { id: "office-a", label: "Office Block A", x: 50, y: 44, w: 18, h: 34, status: "safe",   occupancy: 22,  capacity: 50 },
  { id: "stair-n",  label: "Stairwell N",   x: 70, y: 2,  w: 10, h: 16, status: "clear",   occupancy: 2,   capacity: 30 },
  { id: "stair-s",  label: "Stairwell S",   x: 70, y: 64, w: 10, h: 16, status: "clear",   occupancy: 1,   capacity: 30 },
  { id: "server",   label: "Server Room",   x: 82, y: 2,  w: 16, h: 20, status: "safe",    occupancy: 2,   capacity: 5  },
  { id: "canteen",  label: "Canteen",       x: 82, y: 24, w: 16, h: 30, status: "safe",    occupancy: 35,  capacity: 80 },
  { id: "first-aid",label: "First Aid",     x: 82, y: 56, w: 16, h: 14, status: "safe",    occupancy: 1,   capacity: 5  },
  { id: "corridor", label: "Corridor",      x: 2,  y: 65, w: 66, h: 12, status: "safe",    occupancy: 8,   capacity: 100 },
];

const emergencyZones: Partial<Record<string, ZoneStatus>> = {
  "conf-2":  "fire",
  "hall-b":  "danger",
  "conf-1":  "caution",
  "stair-n": "caution",
};

const exits: ExitMarker[] = [
  { x: 2,  y: 78, direction: "down",  label: "EXIT A" },
  { x: 90, y: 78, direction: "down",  label: "EXIT B" },
  { x: 0,  y: 50, direction: "left",  label: "EXIT C" },
];

const zoneColors: Record<ZoneStatus, string> = {
  safe:    "bg-emerald-50 border-emerald-200 text-emerald-700",
  caution: "bg-amber-50 border-amber-300 text-amber-700",
  danger:  "bg-red-100 border-red-400 text-red-700",
  fire:    "bg-red-600 border-red-700 text-white animate-pulse",
  clear:   "bg-blue-50 border-blue-200 text-blue-600",
};

const zoneDotColors: Record<ZoneStatus, string> = {
  safe:    "bg-emerald-500",
  caution: "bg-amber-500",
  danger:  "bg-red-500",
  fire:    "bg-white animate-ping",
  clear:   "bg-blue-400",
};

export function EvacuationHeatmap() {
  const { isEmergencySimulated } = useAppSelector((s) => s.system);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  // Merge emergency overlays when simulated
  const zones = baseZones.map((z) => ({
    ...z,
    status: isEmergencySimulated ? (emergencyZones[z.id] ?? z.status) : z.status,
    occupancy: isEmergencySimulated && z.id === "conf-2" ? 20 : z.occupancy,
  }));

  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const dangerCount = zones.filter((z) => z.status === "danger" || z.status === "fire").length;
  const cautionCount = zones.filter((z) => z.status === "caution").length;

  return (
    <div className="card-premium overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Map size={18} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">2D Evacuation Map — Floor 3</h3>
            <p className="text-[10px] text-gray-400 font-medium">
              Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          {isEmergencySimulated && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded-lg animate-pulse">
              <AlertTriangle size={12} className="text-red-600" />
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Emergency Active</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLastUpdated(new Date())}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all cursor-pointer"
            title="Zoom"
          >
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      {/* Map Area */}
      <div className="p-4 flex-1">
        <div className="relative w-full bg-gray-50 border border-gray-200 rounded-xl overflow-hidden" style={{ paddingBottom: "48%" }}>
          {/* Grid background */}
          <div className="absolute inset-0" style={{
            backgroundImage: "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
            backgroundSize: "5% 5%",
          }} />

          {/* Zones */}
          {zones.map((zone) => (
            <button
              key={zone.id}
              onClick={() => setSelectedZone(selectedZone?.id === zone.id ? null : zone)}
              className={cn(
                "absolute border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-500 cursor-pointer hover:opacity-90 hover:scale-[1.01] group",
                zoneColors[zone.status]
              )}
              style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.w}%`, height: `${zone.h}%` }}
            >
              <div className={cn("w-2 h-2 rounded-full mb-0.5", zoneDotColors[zone.status])} />
              <span className="text-[9px] font-bold leading-tight text-center px-0.5 hidden sm:block">{zone.label}</span>
              <span className="text-[8px] font-semibold opacity-70">{zone.occupancy}/{zone.capacity}</span>

              {/* Fire icon */}
              {zone.status === "fire" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
              )}
            </button>
          ))}

          {/* EXIT Markers */}
          {exits.map((exit, i) => (
            <div
              key={i}
              className="absolute flex flex-col items-center gap-0.5"
              style={{
                left: `${exit.x}%`,
                top: `${exit.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="bg-green-600 text-white text-[8px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow-lg uppercase tracking-wider">
                <Navigation size={8} />
                {exit.label}
              </div>
              <div className={cn(
                "w-0 h-0",
                exit.direction === "down" && "border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-green-600",
                exit.direction === "left" && "border-t-4 border-b-4 border-r-8 border-t-transparent border-b-transparent border-r-green-600",
                exit.direction === "right" && "border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent border-l-green-600",
              )} />
            </div>
          ))}
        </div>

        {/* Legend + Status Bar */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            {[
              { label: "Safe", color: "bg-emerald-500" },
              { label: "Caution", color: "bg-amber-500" },
              { label: "Danger", color: "bg-red-500" },
              { label: "Fire", color: "bg-red-700" },
              { label: "Exit/Stair", color: "bg-blue-400" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={cn("w-2.5 h-2.5 rounded-sm", item.color)} />
                <span className="text-[10px] font-semibold text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {dangerCount > 0 && (
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100">
                {dangerCount} danger zone{dangerCount > 1 ? "s" : ""}
              </span>
            )}
            {cautionCount > 0 && (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                {cautionCount} caution
              </span>
            )}
            <span className="text-[10px] font-medium text-gray-400">
              Total: {zones.reduce((a, z) => a + z.occupancy, 0)} persons
            </span>
          </div>
        </div>

        {/* Zone Detail Tooltip */}
        {selectedZone && (
          <div className="mt-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray-900">{selectedZone.label}</span>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest",
                selectedZone.status === "fire" && "bg-red-700 text-white",
                selectedZone.status === "danger" && "bg-red-100 text-red-700",
                selectedZone.status === "caution" && "bg-amber-100 text-amber-700",
                selectedZone.status === "safe" && "bg-emerald-100 text-emerald-700",
                selectedZone.status === "clear" && "bg-blue-100 text-blue-700",
              )}>
                {selectedZone.status}
              </span>
            </div>
            <div className="flex gap-6 text-xs text-gray-600 font-medium">
              <span>Occupancy: <strong>{selectedZone.occupancy}</strong> / {selectedZone.capacity}</span>
              <span>Load: <strong>{Math.round((selectedZone.occupancy / selectedZone.capacity) * 100)}%</strong></span>
            </div>
            {/* Occupancy bar */}
            <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  selectedZone.occupancy / selectedZone.capacity > 0.9 ? "bg-red-500" :
                  selectedZone.occupancy / selectedZone.capacity > 0.7 ? "bg-amber-500" : "bg-emerald-500"
                )}
                style={{ width: `${Math.min(100, Math.round((selectedZone.occupancy / selectedZone.capacity) * 100))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
