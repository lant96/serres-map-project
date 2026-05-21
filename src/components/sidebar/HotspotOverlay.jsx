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
      {/* Header row with X button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2 style={{ margin: 0 }}>{hotspot.title}</h2>

        <button
          onClick={onClose}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid #e5e7eb",
            background: "#fff",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.15s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#f3f4f6")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
          aria-label="Close overlay"
        >
          ×
        </button>
      </div>

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