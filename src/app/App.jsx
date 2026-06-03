import { useEffect } from "react";

import { useAppStore } from "../state/useAppStore";

import MapView from "../views/MapView/MapView";
import SceneView from "../views/SceneView/SceneView";

import Sidebar from "../components/sidebar/Sidebar";
import HotspotOverlay from "../components/sidebar/overlay/HotspotOverlay";

import ViewToggle from "../components/ui/ViewToggle";

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

  const viewMode = useAppStore((s) => s.viewMode);

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
    <div style={styles.app}>
      <Sidebar />

      <div style={styles.mainView}>
        <ViewToggle />

        {viewMode === "map" ? (
          <MapView />
        ) : (
          <SceneView />
        )}
      </div>

      <HotspotOverlay
        hotspot={selectedHotspot}
        onClose={() => setSelection("clear")}
      />
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
  },

  mainView: {
    flex: 1,
    position: "relative",
  },

};