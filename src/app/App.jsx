import { useEffect } from "react";

import { useAppStore } from "../state/useAppStore";
import MapView from "../views/MapView/MapView";
import Sidebar from "../components/sidebar/Sidebar";

import { getBuildings } from "../services/buildingService";

export default function App() {
  const fetchHotspots = useAppStore((s) => s.fetchHotspots);
  const setBuildings = useAppStore((s) => s.setBuildings);

  useEffect(() => {
    fetchHotspots();

    async function loadBuildings() {
      const data = await getBuildings();
      setBuildings(data);
    }

    loadBuildings();
  }, []);

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
    </div>
  );
}