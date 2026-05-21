import { create } from "zustand";
import { getHotspots } from "../services/hotspotService";

export const useAppStore = create((set) => ({
  hotspots: [],
  buildings: [],
  isLoading: false,
  error: null,

  selectedHotspotId: null,
  selectedBuildingId: null,
  activeFilter: "all",

  fetchHotspots: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getHotspots();
      set({ hotspots: data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  setBuildings: (data) => set({ buildings: data }),

  setSelectedHotspotId: (id) => set({ selectedHotspotId: id }),
  setSelectedBuildingId: (id) => set({ selectedBuildingId: id }),

  // Unified selection manager to prevent competing states
  setSelection: (type, id) => set(() => {
    if (type === "building") {
      return { selectedBuildingId: id, selectedHotspotId: null };
    } else if (type === "hotspot") {
      return { selectedHotspotId: id, selectedBuildingId: null };
    } else {
      // Handles global reset / clearing everything cleanly
      return { selectedBuildingId: null, selectedHotspotId: null };
    }
  }),

  setActiveFilter: (filter) => set({ activeFilter: filter }),
}));