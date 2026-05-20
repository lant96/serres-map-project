import { create } from 'zustand';
import { getHotspots } from '../services/hotspotService';

export const useAppStore = create((set) => ({
  hotspots: [],
  buildings: [],
  isLoading: false,
  error: null,
  
  selectedHotspotId: null,
  activeFilter: 'all',

  setBuildings: (data) => set({ buildings: data }),
  
  fetchHotspots: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getHotspots();
      set({ hotspots: data, isLoading: false });
    } catch (err) {
      console.error(err);
      set({ error: err.message, isLoading: false });
    }
  },

  setBuildings: (data) => set({ buildings: data }),

  setSelectedHotspotId: (id) => set({ selectedHotspotId: id }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
}));