import { create } from "zustand";
import { getHotspots } from "../services/hotspotService";
import { hydrateHotspots } from "../services/hotspotHydrationService";

export const useAppStore = create((set, get) => ({

  // ── STATE ────────────────────────────────────────────────────────────────

  hotspots:     [],
  buildings:    [],
  images:       [],
  publications: [],   // FIX: was missing — hydration always received []

  isLoading: false,
  error:     null,

  selectedHotspotId:  null,
  selectedBuildingId: null,

  activeFilter: "all",

  // ── DATA LOADING ─────────────────────────────────────────────────────────

  fetchHotspots: async () => {
    set({ isLoading: true, error: null });

    try {
      const raw = await getHotspots();

      const { buildings, images, publications } = get();

      const hydrated = hydrateHotspots({
        hotspots: raw,
        buildings,
        images,
        publications,
      });

      console.log("HYDRATED HOTSPOTS:", hydrated);
      console.log(
        "FIRST HYDRATED HOTSPOT:",
        hydrated[0]
      );

      set({ hotspots: hydrated, isLoading: false });

    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  setBuildings:    (data) => set({ buildings:    data }),
  setImages:       (data) => set({ images:       data }),
  setPublications: (data) => set({ publications: data }),   // FIX: was missing

  // ── SELECTION ─────────────────────────────────────────────────────────────

  setSelectedHotspotId:  (id) => set({ selectedHotspotId: id }),
  setSelectedBuildingId: (id) => set({ selectedBuildingId: id }),

  setSelection: (type, id) =>
    set(() => {
      if (type === "building") {
        return { selectedBuildingId: id, selectedHotspotId: null };
      }
      if (type === "hotspot") {
        return { selectedHotspotId: id, selectedBuildingId: null };
      }
      // "clear"
      return { selectedBuildingId: null, selectedHotspotId: null };
    }),

  // ── FILTERS ───────────────────────────────────────────────────────────────

  setActiveFilter: (filter) => set({ activeFilter: filter }),

  // ── DERIVED SELECTORS ─────────────────────────────────────────────────────

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

// ── INTERNAL HELPERS ────────────────────────────────────────────────────────

function _normalizeFilter(f) {
  if (f === "buildings")    return "building";
  if (f === "images")       return "image";
  if (f === "publications") return "publication";
  return f;
}
