import { create } from "zustand";
import { getHotspots } from "../services/hotspotService";

export const useAppStore = create((set, get) => ({

  // STATE

  hotspots: [],
  buildings: [],

  isLoading: false,
  error: null,

  selectedHotspotId: null,
  selectedBuildingId: null,

  activeFilter: "all",

  // DATA LOADING

  fetchHotspots: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const data = await getHotspots();
      console.log("FETCHED HOTSPOTS:", data);

      set({
        hotspots: data,
        isLoading: false,
      });

    } catch (err) {
      set({
        error: err.message,
        isLoading: false,
      });
    }
  },

  setBuildings: (data) =>
    set({
      buildings: data,
    }),

  // SELECTION

  setSelectedHotspotId: (id) =>
    set({
      selectedHotspotId: id,
    }),

  setSelectedBuildingId: (id) =>
    set({
      selectedBuildingId: id,
    }),

  setSelection: (type, id) =>
    set(() => {

      if (type === "building") {
        return {
          selectedBuildingId: id,
          selectedHotspotId: null,
        };
      }

      if (type === "hotspot") {
        return {
          selectedHotspotId: id,
          selectedBuildingId: null,
        };
      }

      return {
        selectedBuildingId: null,
        selectedHotspotId: null,
      };
    }),

  // FILTERS

  setActiveFilter: (filter) =>
    set({
      activeFilter: filter,
    }),

  // DERIVED SELECTORS

  getFilteredHotspots: () => {
    const state = get();

    const normalizeFilter = (f) => {
      if (f === "buildings") return "building";
      if (f === "images") return "image";
      if (f === "publications") return "publication";

      return f;
    };

    return state.activeFilter === "all"
      ? state.hotspots
      : state.hotspots.filter(
          (h) => h.type === normalizeFilter(state.activeFilter)
        );
  },

  getSelectedHotspot: () => {
    const state = get();

    return state.hotspots.find(
      (h) =>
        String(h.id) === String(state.selectedHotspotId)
    );
  },
}));