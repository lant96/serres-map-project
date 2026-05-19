import { useAppStore } from '../store/useAppStore' // Adjust path if needed

export default function HotspotList() {
  const hotspots = useAppStore((s) => s.hotspots);
  const activeFilter = useAppStore((s) => s.activeFilter);
  const setSelectedHotspotId = useAppStore((s) => s.setSelectedHotspotId);

  // Filter the list based on the global state
  const filtered =
    activeFilter === "all"
      ? hotspots
      : hotspots.filter((h) => h.type === activeFilter);

  return (
    <div style={{ overflowY: "auto", flex: 1 }}>
      {filtered.map((h) => (
        <div
          key={h.id}
          onClick={() => setSelectedHotspotId(h.id)}
          style={{
            padding: 14,
            borderBottom: "1px solid #eee",
            cursor: "pointer",
          }}
        >
          <div style={{ fontWeight: "bold" }}>
            {h.title}
          </div>

          <div style={{ fontSize: 12, opacity: 0.6, textTransform: 'capitalize' }}>
            {h.type}
          </div>
        </div>
      ))}
    </div>
  );
}