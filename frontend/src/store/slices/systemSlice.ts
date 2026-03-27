import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SystemState {
  isActive: boolean;
  isEmergencySimulated: boolean;
  currentBuilding: string;
  currentFloor: string;
  isSidebarCollapsed: boolean;
  currentUserRole: 'admin' | 'security' | 'staff' | 'maintenance';
}

const initialState: SystemState = {
  isActive: true,
  isEmergencySimulated: false,
  currentBuilding: "Main Building",
  currentFloor: "Floor 3",
  isSidebarCollapsed: false,
  currentUserRole: 'admin',
};

export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    toggleEmergencySimulation: (state) => {
      state.isEmergencySimulated = !state.isEmergencySimulated;
    },
    setBuilding: (state, action: PayloadAction<string>) => {
      state.currentBuilding = action.payload;
    },
    setFloor: (state, action: PayloadAction<string>) => {
      state.currentFloor = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
    setUserRole: (state, action: PayloadAction<SystemState['currentUserRole']>) => {
      state.currentUserRole = action.payload;
    },
  },
});

export const { toggleEmergencySimulation, setBuilding, setFloor, toggleSidebar, setUserRole } = systemSlice.actions;
export default systemSlice.reducer;
