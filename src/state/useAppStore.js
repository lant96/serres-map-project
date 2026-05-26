import { create } from "zustand";
import { getHotspots } from "../services/hotspotService";
import { hydrateHotspots } from "../services/hotspotHydrationService";

export const useAppStore = create((set, get) => ({

  // STATE 

  hotspots:     [],
  buildings:    [],
  images:       [],
  publications: [],

  isLoading: false,
  error:     null,

  selectedHotspotId:  null,
  selectedBuildingId: null,

  // ID of a related hotspot being hovered in the overlay cards.
  // Drives the temporary highlight on map markers / building polygons.
  hoveredRelatedHotspotId: null,

  activeFilter: "all",

  // DATA LOADING 

  viewMode: "map",

  fetchHotspots: async () => {
    set({ isLoading: true, error: null });

    try {
      const raw = await getHotspots();
      const { buildings, images, publications } = get();

      const hydrated = hydrateHotspots({ hotspots: raw, buildings, images, publications });

      console.log("HYDRATED HOTSPOTS:", hydrated);
      set({ hotspots: hydrated, isLoading: false });

    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  setBuildings:    (data) => set({ buildings:    data }),
  setImages:       (data) => set({ images:       data }),
  setPublications: (data) => set({ publications: data }),

  // SELECTION 

  setSelectedHotspotId:  (id) => set({ selectedHotspotId: id }),
  setSelectedBuildingId: (id) => set({ selectedBuildingId: id }),

  setSelection: (type, id) =>
    set(() => {
      if (type === "building") return { selectedBuildingId: id, selectedHotspotId: null };
      if (type === "hotspot")  return { selectedHotspotId: id, selectedBuildingId: null };
      return { selectedBuildingId: null, selectedHotspotId: null };
    }),

  // Hover — set to a hotspot ID while the cursor is over a related card item,
  // clear to null on mouse-leave.
  setHoveredRelatedHotspotId: (id) => set({ hoveredRelatedHotspotId: id }),

  // FILTERS 

  setActiveFilter: (filter) => set({ activeFilter: filter }),

  // VIEW MODE

  setViewMode: (mode) =>
    set({ viewMode: mode }),

  // DERIVED SELECTORS

  getFilteredHotspots: () => {
    const { hotspots, activeFilter } = get();
    return activeFilter === "all"
      ? hotspots
      : hotspots.filter((h) => h.type === _normalizeFilter(activeFilter));
  },

  getSelectedHotspot: () => {
    const { hotspots, selectedHotspotId } = get();
    return hotspots.find((h) => String(h.id) === String(selectedHotspotId));
  },
}));

function _normalizeFilter(f) {
  if (f === "buildings")    return "building";
  if (f === "images")       return "image";
  if (f === "publications") return "publication";
  return f;
}
