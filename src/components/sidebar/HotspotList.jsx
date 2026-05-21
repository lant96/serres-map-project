import { useAppStore } from "../../state/useAppStore";
import "../../app/styles/hotspotList.css";

export default function HotspotList() {
  const hotspots = useAppStore((s) => s.hotspots);
  const activeFilter = useAppStore((s) => s.activeFilter);
  const setSelectedHotspotId = useAppStore((s) => s.setSelectedHotspotId);

  const filtered =
    activeFilter === "all"
      ? hotspots
      : hotspots.filter((h) => h.type === activeFilter);

  return (
    <div className="hotspot-list">
      {filtered.map((h) => (
        <div
          key={h.id}
          className="hotspot-item"
          onClick={() => setSelectedHotspotId(h.id)}
        >
          <div className="hotspot-title">{h.title}</div>

          <div className="hotspot-type">{h.type}</div>
        </div>
      ))}
    </div>
  );
}