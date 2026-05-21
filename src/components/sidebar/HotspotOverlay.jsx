export default function HotspotOverlay({ hotspot, onClose }) {
  if (!hotspot) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "white",
        zIndex: 10,
        padding: 20,
        overflowY: "auto",
      }}
    >
      <button
        onClick={onClose}
        style={{
          marginBottom: 20,
          cursor: "pointer",
        }}
      >
        Close
      </button>

      <h2>{hotspot.title}</h2>

      <div style={{ marginBottom: 10 }}>
        Type: {hotspot.type}
      </div>

      <div style={{ marginBottom: 10 }}>
        Status: {hotspot.status}
      </div>

      {hotspot.gis_id && (
        <div style={{ marginBottom: 10 }}>
          GIS ID: {hotspot.gis_id}
        </div>
      )}

      {hotspot.object_name && (
        <div>
          Object: {hotspot.object_name}
        </div>
      )}
    </div>
  );
}