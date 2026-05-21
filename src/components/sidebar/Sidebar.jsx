import { useAppStore } from "../../state/useAppStore";

import FilterBar from "./FilterBar";
import HotspotList from "./HotspotList";
import HotspotOverlay from "./HotspotOverlay";

export default function Sidebar() {
  const hotspots = useAppStore((s) => s.hotspots);
  const selectedHotspotId = useAppStore((s) => s.selectedHotspotId);
  const setSelectedHotspotId = useAppStore((s) => s.setSelectedHotspotId);

  const selectedHotspotObj = useAppStore((s) =>
    s.hotspots.find(
      (h) => String(h.id) === String(s.selectedHotspotId)
    )
  );

  return (
    <div
      style={{
        width: "25%",
        minWidth: "300px",
        height: "100%",
        background: "#ffffff",
        borderRight: "1px solid #ddd",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        zIndex: 5,
      }}
    >
      <FilterBar />
      <HotspotList />

      {selectedHotspotObj && (
        <HotspotOverlay
          hotspot={selectedHotspotObj}
          onClose={() => setSelectedHotspotId(null)}
        />
      )}
    </div>
  );
}