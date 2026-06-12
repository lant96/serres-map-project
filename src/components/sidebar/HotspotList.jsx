import { useAppStore } from "../../state/useAppStore";
import "../../app/styles/hotspotList.css";

export default function HotspotList() {
  const hotspots                   = useAppStore((s) => s.hotspots);
  const activeFilter               = useAppStore((s) => s.activeFilter);
  const selectedHotspotId          = useAppStore((s) => s.selectedHotspotId);
  const setSelection               = useAppStore((s) => s.setSelection);
  const setHoveredRelatedHotspotId = useAppStore((s) => s.setHoveredRelatedHotspotId);

  const filtered = hotspots.filter((h) => h.type === activeFilter);

  if (!filtered.length) {
    return <p style={styles.empty}>No {activeFilter}s found.</p>;
  }

  return (
    <div className="hotspot-list">
      {filtered.map((h) => {
        const isSelected = String(h.id) === String(selectedHotspotId);

        const className = [
          "hotspot-item",
          `hotspot-item--${h.type}`,
          isSelected ? "selected" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div
            key={h.id}
            className={className}
            onClick={() => setSelection("hotspot", h.id)}
            onMouseEnter={() => setHoveredRelatedHotspotId(String(h.id))}
            onMouseLeave={() => setHoveredRelatedHotspotId(null)}
          >
            <div className="hotspot-title">{h.title}</div>
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  empty: {
    padding: "16px 12px",
    fontSize: 13,
    color: "#aaa",
  },
};
