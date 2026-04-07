"use client";

import { useMemo, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Search, UserRound, ChevronRight, LogOut, UserCog, Mail, ShieldUser } from "lucide-react";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBuilding, setFloor, toggleEmergencySimulation } from "@/store/slices/systemSlice";
import { resolveEmergency, triggerEmergency } from "@/store/slices/alertsSlice";
import { signOutUser } from "@/lib/auth";

const TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/alerts": "Alerts",
  "/people": "People",
  "/sms": "SMS",
  "/security": "Security",
  "/maintenance": "Maintenance",
  "/settings": "Settings",
};

export function TopNavbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAppSelector((state) => state.auth);
  const { currentBuilding, currentFloor, isEmergencySimulated, isSidebarCollapsed } = useAppSelector((s) => s.system);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const title = useMemo(() => {
    const hit = Object.keys(TITLES).find((route) => route !== "/" && pathname.startsWith(route));
    return hit ? TITLES[hit] : TITLES["/"];
  }, [pathname]);

  const now = useMemo(
    () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    []
  );

  const profileName = auth.profile?.fullName ?? auth.profile?.email?.split("@")[0] ?? "Operator";
  const profileEmail = auth.profile?.email ?? "Connect Google account";
  const profileRole = auth.profile?.role ?? "staff";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const buildingOptions = useMemo(
    () => [
      { label: "Main Building", value: "Main Building" },
      { label: "Annex A", value: "Annex A" },
    ],
    []
  );

  const floorOptions = useMemo(
    () => [
      { label: "Floor 1", value: "Floor 1" },
      { label: "Floor 2", value: "Floor 2" },
      { label: "Floor 3", value: "Floor 3" },
    ],
    []
  );

  const toggleSimulation = useCallback(() => {
    dispatch(toggleEmergencySimulation());
    if (isEmergencySimulated) {
      dispatch(resolveEmergency());
      return;
    }
    dispatch(triggerEmergency());
  }, [dispatch, isEmergencySimulated]);

  const handleSignOut = useCallback(async () => {
    setProfileOpen(false);
    await signOutUser();
    router.replace("/login");
  }, [router]);

  return (
    <header
      className={`fixed top-0 right-0 z-40 h-16 border-b border-gray-200 bg-white/95 px-3 backdrop-blur-sm md:px-5 max-md:left-[72px] ${
        isSidebarCollapsed ? "md:left-[72px]" : "md:left-[240px]"
      }`}
    >
      <div className="flex h-full items-center gap-2 md:gap-3">
        <div className="hidden min-w-[210px] md:block">
          <p className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500">
            CrisisControl <ChevronRight size={12} /> {title}
          </p>
          <p className="text-xs text-gray-400">Updated {now}</p>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Select options={buildingOptions} value={currentBuilding} onChange={(v) => dispatch(setBuilding(v))} className="w-36" />
          <Select options={floorOptions} value={currentFloor} onChange={(v) => dispatch(setFloor(v))} className="w-28" />
        </div>

        <div className="relative ml-auto w-full max-w-[420px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            aria-label="Search"
            placeholder="Search incidents, rooms, people"
            className="h-9 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-700 outline-none transition-colors focus:border-blue-500"
          />
        </div>

        <button
          onClick={toggleSimulation}
          className={cn(
            "hidden h-9 cursor-pointer rounded-lg px-3 text-xs font-semibold uppercase tracking-wider xl:inline-flex xl:items-center",
            isEmergencySimulated
              ? "border border-gray-300 bg-white text-gray-800 hover:bg-gray-100"
              : "bg-blue-700 text-white hover:bg-blue-800"
          )}
        >
          {isEmergencySimulated ? "Resolve" : "Simulate"}
        </button>

        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((open) => !open)}
            className={cn(
              "flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-2.5 text-gray-700 transition-colors hover:bg-gray-100",
              profileOpen && "border-blue-300 ring-4 ring-blue-500/10"
            )}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-700">
              <UserRound size={15} />
            </span>
            <span className="hidden text-xs font-semibold sm:inline">{profileName}</span>
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.12)] animate-in fade-in zoom-in-95 duration-150">
              <div className="border-b border-gray-100 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                    <UserRound size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">{profileName}</p>
                    <p className="truncate text-xs text-gray-500">{profileEmail}</p>
                    <p className="mt-0.5 inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                      <ShieldUser size={11} /> {profileRole}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-1.5">
                <button className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                  <UserCog size={15} className="text-gray-500" /> Profile settings
                </button>
                <button className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                  <Mail size={15} className="text-gray-500" /> Account email
                </button>
                <button type="button" onClick={handleSignOut} className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                  <LogOut size={15} className="text-gray-500" /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
