export default function HotspotHeader({ hotspot, onClose }) {
  return (
    <div style={styles.header}>
      <h2 style={{ margin: 0 }}>{hotspot.title}</h2>

      <button
        onClick={() => {onClose?.();}}
      >
        ×
      </button>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 10,
  },

  button: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};