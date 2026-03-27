"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBuilding, setFloor, toggleEmergencySimulation } from "@/store/slices/systemSlice";
import { triggerEmergency, resolveEmergency } from "@/store/slices/alertsSlice";
import { Select } from "@/components/ui/select";
import { Search} from "lucide-react";
import { cn } from "@/lib/utils";

export function TopNavbar() {
  const dispatch = useAppDispatch();
  const { isEmergencySimulated, currentBuilding, currentFloor } = useAppSelector(
    (state) => state.system
  );

  const buildingOptions = [
    { label: "Main Building", value: "Main Building" },
    { label: "Annex A", value: "Annex A" },
  ];

  const floorOptions = [
    { label: "Floor 1", value: "Floor 1" },
    { label: "Floor 2", value: "Floor 2" },
    { label: "Floor 3", value: "Floor 3" },
  ];

  const handleSimulationToggle = () => {
    dispatch(toggleEmergencySimulation());
    if (!isEmergencySimulated) {
      dispatch(triggerEmergency());
    } else {
      dispatch(resolveEmergency());
    }
  };

  return (
    <header className="fixed left-56 top-0 right-0 h-16 bg-white border-b border-gray-100 z-40 flex items-center px-8 gap-6">
      {/* Left: Filters */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Site</span>
          <Select
            options={buildingOptions}
            value={currentBuilding}
            onChange={(val) => dispatch(setBuilding(val))}
            className="w-40"
          />
        </div>
        <div className="h-5 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Level</span>
          <Select
            options={floorOptions}
            value={currentFloor}
            onChange={(val) => dispatch(setFloor(val))}
            className="w-32"
          />
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="Search incidents, people, protocols..."
            className="w-full h-9 pl-10 pr-4 bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 rounded-lg text-sm font-medium transition-all outline-none"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 ml-auto shrink-0">
        
        {/* Emergency toggle */}
        <button
          onClick={handleSimulationToggle}
          className={cn(
            "px-4 py-2 rounded-lg italic text-sm font-bold transition-all cursor-pointer",
            isEmergencySimulated
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              : "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100"
          )}
        >
          {isEmergencySimulated ? "Resolve System" : "Simulate Emergency"}
        </button>

        {/* User avatar */}
        <button
          className="flex items-center gap-2 h-10 px-2 hover:bg-gray-50 rounded-full transition-all cursor-pointer"
          title="Account"
        >
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            AK
          </div>
        </button>
      </div>
    </header>
  );
}
