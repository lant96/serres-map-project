import { useEffect } from "react";
import { useAppStore } from "./store/useAppStore";
import MapView from "./views/MapView";
import Sidebar from "./components/Sidebar";

export default function App() {
  const fetchHotspots = useAppStore((s) => s.fetchHotspots);

  useEffect(() => {
    fetchHotspots();
  }, [fetchHotspots]);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, position: "relative" }}>
        <MapView />
      </div>
    </div>
  );
}