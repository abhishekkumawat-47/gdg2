import { createSlice } from '@reduxjs/toolkit';
import { Alert, HeatmapPoint, RoleAction, TimelineEvent } from '@/types';
import { initialHeatmapPoints, mockAlerts, mockRoleActions, mockTimeline } from '@/lib/mockData';

interface AlertsState {
  activeAlerts: Alert[];
  heatmapPoints: HeatmapPoint[];
  roleActions: RoleAction[];
  timeline: TimelineEvent[];
}

const initialState: AlertsState = {
  activeAlerts: [],
  heatmapPoints: initialHeatmapPoints.map(p => ({ ...p, intensity: 'low' as const })),
  roleActions: [],
  timeline: [],
};

export const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    triggerEmergency: (state) => {
      state.activeAlerts = mockAlerts;
      state.heatmapPoints = initialHeatmapPoints;
      state.roleActions = mockRoleActions;
      state.timeline = mockTimeline;
    },
    resolveEmergency: (state) => {
      state.activeAlerts = [];
      state.heatmapPoints = state.heatmapPoints.map(p => ({ ...p, intensity: 'low' as const }));
      state.roleActions = [];
      state.timeline = [];
    }
  },
});

export const { triggerEmergency, resolveEmergency } = alertsSlice.actions;
export default alertsSlice.reducer;
