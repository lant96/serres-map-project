export default function HotspotOverlay({ hotspot, onClose }) {
  return (
    <div style={{
      position: "absolute",
      inset: 0,
      background: "#fff",
      zIndex: 10
    }}>
      <button onClick={onClose} style={{ margin: 16 }}>
        Close
      </button>

      <div style={{ padding: 16 }}>
        <h2>{hotspot.name}</h2>

        <p><strong>Type:</strong> {hotspot.type}</p>
      </div>
    </div>
  );
}