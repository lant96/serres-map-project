import { create } from 'zustand';
import { getHotspots } from '../services/hotspotService';

export const useAppStore = create((set) => ({
  hotspots: [],
  isLoading: false,
  error: null,
  
  selectedHotspotId: null,
  activeFilter: 'all',

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

  setSelectedHotspotId: (id) => set({ selectedHotspotId: id }),
  setActiveFilter: (filter) => set({ activeFilter: filter }),
}));