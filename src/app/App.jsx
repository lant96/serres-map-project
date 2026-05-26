import { useEffect } from "react";

import { useAppStore } from "../state/useAppStore";
import MapView from "../views/MapView/MapView";
import Sidebar from "../components/sidebar/Sidebar";
import HotspotOverlay from "../components/sidebar/overlay/HotspotOverlay";

import { getBuildings }    from "../services/buildingService";
import { getImages }       from "../services/imageService";
import { getPublications } from "../services/publicationService";

import { staggered } from "../services/api/nocodbClient"; // ← new

export default function App() {
  const fetchHotspots   = useAppStore((s) => s.fetchHotspots);
  const setBuildings    = useAppStore((s) => s.setBuildings);
  const setImages       = useAppStore((s) => s.setImages);
  const setPublications = useAppStore((s) => s.setPublications);
  const setSelection    = useAppStore((s) => s.setSelection);

  const selectedHotspotId = useAppStore((s) => s.selectedHotspotId);
  const hotspots          = useAppStore((s) => s.hotspots);

  useEffect(() => {
    async function loadData() {
      const [buildingData, imageData, publicationData] = await staggered([
        () => getBuildings(),
        () => getImages(),
        () => getPublications(),
      ]);

      setBuildings(buildingData);
      setImages(imageData);
      setPublications(publicationData);

      await fetchHotspots();
    }

    loadData();
  }, []);

  const selectedHotspot = hotspots.find(
    (h) => String(h.id) === String(selectedHotspotId)
  );

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1, position: "relative" }}>
        <MapView />
      </div>

      <HotspotOverlay
        hotspot={selectedHotspot}
        onClose={() => setSelection("clear")}
      />
    </div>
  );
}
