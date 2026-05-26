import { useAppStore } from "../../state/useAppStore";
import "../../app/styles/hotspotList.css";

export default function HotspotList() {
  const hotspots     = useAppStore((s) => s.hotspots);
  const activeFilter = useAppStore((s) => s.activeFilter);

  const setSelection = useAppStore((s) => s.setSelection);

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
          onClick={() => setSelection("hotspot", h.id)}
        >
          <div className="hotspot-title">{h.title}</div>
          <div className="hotspot-type">{h.type}</div>
        </div>
      ))}
    </div>
  );
}
