"use client";

import { useMemo, useState } from "react";
import { CheckSquare, Search, Square, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface PersonRow {
  id: string;
  name: string;
  role: "Guest" | "Staff" | "Security" | "Maintenance";
  status: "active" | "idle" | "offline";
  zone: string;
  lastActivity: string;
}

const people: PersonRow[] = [
  { id: "P-1001", name: "Priya Menon", role: "Guest", status: "active", zone: "Floor 3", lastActivity: "2m ago" },
  { id: "P-1002", name: "John Mercer", role: "Security", status: "active", zone: "Gate A", lastActivity: "Just now" },
  { id: "P-1003", name: "Mina Joshi", role: "Maintenance", status: "idle", zone: "Floor 1", lastActivity: "7m ago" },
  { id: "P-1004", name: "Neha Singh", role: "Staff", status: "active", zone: "Lobby", lastActivity: "1m ago" },
  { id: "P-1005", name: "Aman Singh", role: "Maintenance", status: "offline", zone: "N/A", lastActivity: "3h ago" },
  { id: "P-1006", name: "Sonal Verma", role: "Guest", status: "idle", zone: "Floor 2", lastActivity: "14m ago" },
];

const statusClass = {
  active: "bg-blue-50 text-blue-700",
  idle: "bg-gray-100 text-gray-700",
  offline: "bg-gray-50 text-gray-500",
} as const;

export default function PeoplePage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<PersonRow["role"] | "all">("all");
  const [selected, setSelected] = useState<string[]>([]);

  const data = useMemo(() => {
    return people.filter((person) => {
      const roleOk = role === "all" || person.role === role;
      const text = `${person.name} ${person.id} ${person.zone}`.toLowerCase();
      return roleOk && text.includes(search.toLowerCase());
    });
  }, [role, search]);

  const toggleSelected = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const initials = (name: string) => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto max-w-[1320px] space-y-5 pb-20">
      <section className="surface-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-gray-500">People</p>
            <h1 className="mt-1 text-2xl font-semibold text-gray-900">Personnel Directory</h1>
            <p className="mt-2 text-sm text-gray-600">Monitor occupants by role, status, and recent activity.</p>
          </div>
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-3 lg:w-auto">
            <label className="relative sm:col-span-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search people" className="h-9 w-full rounded-lg border border-gray-300 pl-9 pr-2 text-sm focus:border-blue-500 focus:outline-none" />
            </label>
            <select value={role} onChange={(e) => setRole(e.target.value as PersonRow["role"] | "all")} className="h-9 rounded-lg border border-gray-300 px-2 text-sm focus:border-blue-500 focus:outline-none">
              <option value="all">All roles</option><option value="Guest">Guest</option><option value="Staff">Staff</option><option value="Security">Security</option><option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </section>

      <section className="surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <p className="text-sm font-medium text-gray-800">{selected.length} selected</p>
          <div className="flex items-center gap-2">
            <button disabled={selected.length === 0} className="h-8 rounded-lg border border-gray-300 px-3 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50">Notify</button>
            <button disabled={selected.length === 0} className="h-8 rounded-lg border border-gray-300 px-3 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50">Assign</button>
          </div>
        </div>

        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Select</th>
                <th className="px-4 py-3 text-left">Person</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Zone</th>
                <th className="px-4 py-3 text-left">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {data.map((person) => {
                const checked = selected.includes(person.id);
                return (
                  <tr key={person.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <button onClick={() => toggleSelected(person.id)} className="text-gray-500 hover:text-gray-800" aria-label={`Select ${person.name}`}>
                        {checked ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">{initials(person.name)}</span>
                        <div>
                          <p className="font-medium text-gray-900">{person.name}</p>
                          <p className="text-xs text-gray-500">{person.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{person.role}</td>
                    <td className="px-4 py-3"><span className={cn("rounded-md px-2 py-1 text-xs font-semibold capitalize", statusClass[person.status])}>{person.status}</span></td>
                    <td className="px-4 py-3 text-gray-700">{person.zone}</td>
                    <td className="px-4 py-3 text-gray-600">{person.lastActivity}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 p-3 md:hidden">
          {data.map((person) => {
            const checked = selected.includes(person.id);
            return (
              <article key={person.id} className="rounded-lg border border-gray-200 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700">{initials(person.name)}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{person.name}</p>
                      <p className="text-xs text-gray-500">{person.role}</p>
                    </div>
                  </div>
                  <button onClick={() => toggleSelected(person.id)} className="text-gray-500 hover:text-gray-800" aria-label={`Select ${person.name}`}>
                    {checked ? <CheckSquare size={16} /> : <Square size={16} />}
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <p>Zone: {person.zone}</p>
                  <p>Last: {person.lastActivity}</p>
                </div>
                <span className={cn("mt-2 inline-flex rounded-md px-2 py-1 text-xs font-semibold capitalize", statusClass[person.status])}>{person.status}</span>
              </article>
            );
          })}
        </div>
      </section>

      <section className="flex items-center gap-2 text-xs text-gray-500">
        <Users size={13} />
        Showing {data.length} people records.
      </section>
    </div>
  );
}
