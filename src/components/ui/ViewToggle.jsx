import { useAppStore } from "../../state/useAppStore";

export default function ViewToggle() {
  const viewMode = useAppStore((s) => s.viewMode);
  const setViewMode = useAppStore((s) => s.setViewMode);

  return (
    <div style={styles.container}>
      <button
        onClick={() => setViewMode("map")}
        style={{
          ...styles.button,
          ...(viewMode === "map" ? styles.active : {}),
        }}
      >
        Map
      </button>

      <button
        onClick={() => setViewMode("3d")}
        style={{
          ...styles.button,
          ...(viewMode === "3d" ? styles.active : {}),
        }}
      >
        3D
      </button>
    </div>
  );
}

const styles = {
  container: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10000,

    display: "flex",
    gap: 8,

    background: "#ffffff",
    padding: 8,
    borderRadius: 10,

    boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
  },

  button: {
    border: "none",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",

    background: "#f3f4f6",
    fontWeight: 500,
  },

  active: {
    background: "#111827",
    color: "#ffffff",
  },
};