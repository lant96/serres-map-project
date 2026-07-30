import { useEffect } from "react";

import { useAppStore } from "../state/useAppStore";

import MapView   from "../views/MapView/MapView";
import SceneView from "../views/SceneView/SceneView";

import Sidebar        from "../components/sidebar/Sidebar";
import HotspotOverlay from "../components/sidebar/overlay/HotspotOverlay";
import InfoModal      from "../components/ui/InfoModal";
import ControlBar     from "../components/ui/ControlBar";

import { getBuildings }    from "../services/buildingService";
import { getImages }       from "../services/imageService";
import { getPublications } from "../services/publicationService";

import { staggered } from "../services/api/nocodbClient";

import "../app/styles/panel.css";

export default function App() {
  const fetchHotspots   = useAppStore((s) => s.fetchHotspots);
  const setBuildings    = useAppStore((s) => s.setBuildings);
  const setImages       = useAppStore((s) => s.setImages);
  const setPublications = useAppStore((s) => s.setPublications);
  const setSelection    = useAppStore((s) => s.setSelection);

  const selectedHotspotId = useAppStore((s) => s.selectedHotspotId);
  const hotspots          = useAppStore((s) => s.hotspots);
  const viewMode          = useAppStore((s) => s.viewMode);

  useEffect(() => {
    async function loadData() {
      const [buildingData, imageData, publicationData] = await staggered([
        () => getBuildings(),
        () => getImages(),
        () => getPublications(),
      ]);

      console.log("📦 BUILDINGS LOADED:", buildingData?.length ?? 0);
      console.log("🖼️ IMAGES LOADED:", imageData?.length ?? 0);
      console.log("📚 PUBLICATIONS LOADED:", publicationData?.length ?? 0);
      
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

      {/* Map/Scene fills the entire viewport */}
      <div style={styles.mainView}>
        {viewMode === "map" ? <MapView /> : <SceneView />}
      </div>

      {/* Unified control bar — view toggle + layers, bottom-right */}
      <div style={styles.bottomRightStack}>
        <ControlBar />
      </div>

      {/* Floating panel — header always on top, list or detail below */}
      <div className="floating-panel">
        <div className="floating-panel-header">
          <h1 className="floating-panel-title">Serres Historical Map</h1>
          <p className="sidebar-subtitle">
            Explore reconstructed buildings, archival images, and publications.
          </p>
        </div>

        <div className="floating-panel-content">
          {selectedHotspot ? (
            <HotspotOverlay
              hotspot={selectedHotspot}
              onClose={() => setSelection("clear")}
            />
          ) : (
            <Sidebar />
          )}
        </div>
      </div>

    </div>
  );
}

const styles = {
  app: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    backgroundColor: "#faf9f6",
  },

  mainView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  bottomRightStack: {
    position: "absolute",
    bottom: 0,
    right: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 12,
    padding: 30,
    zIndex: 9999,
  },
};
