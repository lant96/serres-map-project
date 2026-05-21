const API_URL = import.meta.env.VITE_NOCODB_URL;
const API_TOKEN = import.meta.env.VITE_NOCODB_TOKEN;

export const nocodbClient = {
  getHotspots: async () => {
    const res = await fetch(API_URL, {
      headers: {
        "xc-token": API_TOKEN,
      },
    });

    if (!res.ok) {
      throw new Error(`NocoDB error: ${res.status}`);
    }

    return await res.json();
  },
};