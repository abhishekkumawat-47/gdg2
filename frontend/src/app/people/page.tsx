"use client";

import { useState } from "react";
import {
  Users, UserCheck, LogIn, LogOut, Filter, Search, Download, UserPlus, MapPin, Phone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GuestRecord, RolePersonnel } from "@/types";

const guestRecords: GuestRecord[] = [
  { id: "g1",  name: "Priya Menon",      room: "301", floor: "Floor 3", checkIn: "09:00", checkOut: "17:00", status: "checked-in",  phone: "+91 98100 11001" },
  { id: "g2",  name: "Arun Kapoor",      room: "302", floor: "Floor 3", checkIn: "10:30", checkOut: "16:00", status: "checked-in",  phone: "+91 98100 11002" },
  { id: "g3",  name: "Sonal Verma",      room: "201", floor: "Floor 2", checkIn: "08:45", checkOut: "13:00", status: "checked-out", phone: "+91 98100 11003" },
  { id: "g4",  name: "Rahul Gupta",      room: "202", floor: "Floor 2", checkIn: "11:00", checkOut: "18:00", status: "checked-in",  phone: "+91 98100 11004" },
  { id: "g5",  name: "Divya Krishnan",   room: "101", floor: "Floor 1", checkIn: "09:30", checkOut: "15:30", status: "checked-out", phone: "+91 98100 11005" },
  { id: "g6",  name: "Nikhil Shah",      room: "303", floor: "Floor 3", checkIn: "12:00", checkOut: "19:00", status: "pending",     phone: "+91 98100 11006" },
  { id: "g7",  name: "Anjali Patil",     room: "103", floor: "Floor 1", checkIn: "08:00", checkOut: "14:00", status: "checked-in",  phone: "+91 98100 11007" },
  { id: "g8",  name: "Vivek Thomas",     room: "305", floor: "Floor 3", checkIn: "—",     checkOut: "—",     status: "pending",     phone: "+91 98100 11008" },
];

const staffRecords: RolePersonnel[] = [
  { id: "st1", name: "Maria Fernandez",  role: "staff", badge: "STF-01", zone: "Reception",    floor: "Ground",  status: "active",    lastSeen: "just now", currentTask: "Guest check-in coordination" },
  { id: "st2", name: "Ravi Patel",       role: "staff", badge: "STF-02", zone: "Hall A",       floor: "Floor 3", status: "active",    lastSeen: "3m ago",   currentTask: "Event seating arrangement" },
  { id: "st3", name: "Neha Singh",       role: "staff", badge: "STF-03", zone: "Canteen",      floor: "Floor 2", status: "idle",      lastSeen: "10m ago",  currentTask: undefined },
  { id: "st4", name: "Amit Jain",        role: "staff", badge: "STF-04", zone: "Floor 1",      floor: "Floor 1", status: "active",    lastSeen: "1m ago",   currentTask: "Guest assistance" },
  { id: "st5", name: "Pooja Mehta",      role: "staff", badge: "STF-05", zone: "—",            floor: "—",       status: "offline",   lastSeen: "4h ago",   currentTask: undefined },
];

const floorSummary = [
  { floor: "Ground", guests: 28, capacity: 60, staff: 3 },
  { floor: "Floor 1", guests: 45, capacity: 80, staff: 4 },
  { floor: "Floor 2", guests: 38, capacity: 70, staff: 5 },
  { floor: "Floor 3", guests: 31, capacity: 55, staff: 6 },
];

const STATUS_GUEST = {
  "checked-in":  { label: "Checked In",  cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <LogIn size={11} /> },
  "checked-out": { label: "Checked Out", cls: "bg-gray-100 text-gray-500 border-gray-200",         icon: <LogOut size={11} /> },
  "pending":     { label: "Pending",     cls: "bg-amber-50 text-amber-700 border-amber-200",        icon: <UserCheck size={11} /> },
};

export default function PeoplePage() {
  const [activeTab, setActiveTab] = useState<"guests" | "staff">("guests");
  const [search, setSearch] = useState("");
  const [floorFilter, setFloorFilter] = useState("all");

  const filteredGuests = guestRecords.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) || g.room.includes(search);
    const matchFloor = floorFilter === "all" || g.floor === floorFilter;
    return matchSearch && matchFloor;
  });

  const filteredStaff = staffRecords.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchFloor = floorFilter === "all" || s.floor === floorFilter;
    return matchSearch && matchFloor;
  });

  const totalGuests = guestRecords.filter((g) => g.status === "checked-in").length;
  const totalStaff = staffRecords.filter((s) => s.status !== "offline").length;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Users size={15} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Role Access / Guests & Staff</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Guest & Staff Management</h1>
          <p className="text-sm text-gray-400 mt-0.5">Real-time headcount, check-in status, and zone distribution.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all cursor-pointer shadow-sm shadow-blue-100">
            <UserPlus size={15} /> Add Record
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all cursor-pointer shadow-sm">
            <Download size={15} /> Export
          </button>
        </div>
      </div>

      {/* KPI + Floor Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="col-span-2 lg:col-span-1 card-premium p-5">
          <div className="text-2xl font-bold text-gray-900">{totalGuests}</div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-0.5">Guests Present</div>
        </div>
        <div className="col-span-2 lg:col-span-1 card-premium p-5">
          <div className="text-2xl font-bold text-gray-900">{totalStaff}</div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-0.5">Staff On Duty</div>
        </div>
        {floorSummary.map((f) => (
          <div key={f.floor} className="card-premium p-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{f.floor}</div>
            <div className="flex items-end justify-between mb-1.5">
              <span className="text-xl font-bold text-gray-900">{f.guests}</span>
              <span className="text-[10px] text-gray-400">/ {f.capacity}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full",
                  f.guests / f.capacity > 0.85 ? "bg-red-500" :
                  f.guests / f.capacity > 0.65 ? "bg-amber-500" : "bg-emerald-500"
                )}
                style={{ width: `${Math.round((f.guests / f.capacity) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-gray-400 mt-1">{f.staff} staff</div>
          </div>
        ))}
      </div>

      {/* Tab + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex bg-gray-100 p-0.5 rounded-lg">
          {(["guests", "staff"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={cn(
                "px-4 py-1.5 text-sm font-semibold rounded-md transition-all cursor-pointer capitalize",
                activeTab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="pl-9 pr-4 h-9 bg-white border border-gray-100 rounded-lg text-sm text-gray-700 w-52 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            placeholder={activeTab === "guests" ? "Name or room..." : "Name or zone..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={13} className="text-gray-400" />
          {["all", "Ground", "Floor 1", "Floor 2", "Floor 3"].map((f) => (
            <button
              key={f}
              onClick={() => setFloorFilter(f)}
              className={cn(
                "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border transition-all cursor-pointer",
                floorFilter === f ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-500 border-gray-100 hover:border-gray-200"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {activeTab === "guests" ? (
        <div className="card-premium overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-100">
                {["Guest Name", "Room", "Floor", "Check In", "Check Out", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredGuests.map((g) => (
                <tr key={g.id} className="hover:bg-gray-50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {g.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{g.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">{g.room}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{g.floor}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{g.checkIn}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">{g.checkOut}</td>
                  <td className="px-6 py-4">
                    <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider", STATUS_GUEST[g.status].cls)}>
                      {STATUS_GUEST[g.status].icon}
                      {STATUS_GUEST[g.status].label}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {g.phone && (
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer" title={g.phone}>
                          <Phone size={13} />
                        </button>
                      )}
                      <button className="px-2.5 py-1 text-[10px] font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-md cursor-pointer transition-all">
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card-premium overflow-hidden divide-y divide-gray-50">
          {filteredStaff.map((s) => (
            <div key={s.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                  {s.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className={cn("absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white",
                  s.status === "active" ? "bg-emerald-500" :
                  s.status === "idle" ? "bg-gray-400" : "bg-red-400"
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{s.name}</span>
                  <span className="text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{s.badge}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><MapPin size={10} />{s.zone}</span>
                  <span>{s.floor}</span>
                </div>
                {s.currentTask && <p className="text-[11px] text-blue-600 font-medium mt-0.5">{s.currentTask}</p>}
              </div>
              <div className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider",
                s.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                s.status === "idle" ? "bg-gray-100 text-gray-500 border-gray-200" :
                "bg-red-50 text-red-500 border-red-200"
              )}>
                {s.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
