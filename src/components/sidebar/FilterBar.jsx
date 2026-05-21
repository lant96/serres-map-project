import { useAppStore } from "../../state/useAppStore";

const filters = [
  { label: "all", value: "all" },
  { label: "images", value: "image" },
  { label: "publications", value: "publication" },
  { label: "buildings", value: "building" },
];

export default function FilterBar() {
  const activeFilter = useAppStore((s) => s.activeFilter);
  const setActiveFilter = useAppStore((s) => s.setActiveFilter);

  return (
    <div
      style={{
        display: "flex",
        borderBottom: "1px solid #ddd",
        background: "#fafafa",
      }}
    >
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => setActiveFilter(f.value)}
          style={{
            flex: 1,
            padding: "14px 10px",
            border: "none",
            background: activeFilter === f.value ? "#222" : "transparent",
            color: activeFilter === f.value ? "#fff" : "#333",
            cursor: "pointer",
            textTransform: "capitalize",
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}