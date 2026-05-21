import { useAppStore } from "../../state/useAppStore";

import FilterBar from "./FilterBar";
import HotspotList from "./HotspotList";
import HotspotOverlay from "./HotspotOverlay";

import "../../app/styles/sidebar.css";

export default function Sidebar() {
  const selectedHotspotId = useAppStore((s) => s.selectedHotspotId);

  const selectedHotspotObj = useAppStore((s) =>
    s.hotspots.find(
      (h) => String(h.id) === String(s.selectedHotspotId)
    )
  );

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <FilterBar />
      </div>

      <div className="sidebar-scroll">
        <HotspotList />
      </div>

      {selectedHotspotObj && (
        <HotspotOverlay
          hotspot={selectedHotspotObj}
          onClose={() => useAppStore.getState().setSelection("clear")}
        />
      )}
    </div>
  );
}