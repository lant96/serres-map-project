import { useAppStore } from "../../state/useAppStore";

const filters = [
  { label: "Buildings",    value: "building",    color: "#ff4d4d" },
  { label: "Images",       value: "image",       color: "#ff4d4d" },
  { label: "Publications", value: "publication", color: "#ff4d4d" },
];

export default function FilterBar() {
  const activeFilter    = useAppStore((s) => s.activeFilter);
  const setActiveFilter = useAppStore((s) => s.setActiveFilter);

  return (
    <div style={styles.bar}>
      {filters.map((f) => {
        const isActive = activeFilter === f.value;
        return (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            style={{
              ...styles.button,
              borderBottom: isActive
                ? `2px solid ${f.color}`
                : "2px solid transparent",
              color: isActive ? f.color : "#888",
              fontWeight: isActive ? 600 : 400,
            }}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}

const styles = {
  bar: {
    display: "flex",
    borderBottom: "1px solid rgba(0,0,0,0.07)",
    background: "#f0f0f0",
  },
  button: {
    flex: 1,
    padding: "12px 6px",
    border: "none",
    borderBottom: "2px solid transparent",
    background: "transparent",
    cursor: "pointer",
    fontSize: 12,
    textTransform: "capitalize",
    letterSpacing: "0.02em",
    transition: "color 0.15s ease, border-color 0.15s ease",
  },
};
