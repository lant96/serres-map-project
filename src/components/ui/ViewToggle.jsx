import { useAppStore } from "../../state/useAppStore";
import "../../app/styles/map-controls.css";

export default function ViewToggle() {
  const viewMode = useAppStore((s) => s.viewMode);
  const setViewMode = useAppStore((s) => s.setViewMode);

  return (
    <div className="view-toggle">
      <button
        className={`view-toggle-button ${
          viewMode === "map" ? "active" : ""
        }`}
        onClick={() => setViewMode("map")}
      >
        Map
      </button>

      <button
        className={`view-toggle-button ${
          viewMode === "3d" ? "active" : ""
        }`}
        onClick={() => setViewMode("3d")}
      >
        3D
      </button>
    </div>
  );
}