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
              color: isActive ? f.color : "#101010",
              fontWeight: 500,
              borderBottomColor: isActive ? f.color : "transparent",
              fontSize: "15px",
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
    gap: 18,
  },
  button: {
    background: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    padding: "0 0 6px",
    cursor: "pointer",
    fontSize: 13,
    transition: "color 0.15s ease, border-color 0.15s ease",
  },
};