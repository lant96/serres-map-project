import "../../app/styles/sceneLayerToggle.css";

const EyeOpen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3"
      stroke="currentColor" strokeWidth="1.8"
    />
  </svg>
);

const EyeClosed = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12A18.45 18.45 0 0 1 5.06 5.06M9.9 4.24A9.12 9.12 0 0 1 12 4C19 4 23 12 23 12A18.5 18.5 0 0 1 20.71 15.68M1 1L23 23"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const LAYERS = [
  { key: "topografiko",    label: "Τοπογραφικός χάρτης 1925" },
  { key: "buildings",  label: "Επιπλέον κτίρια"              },
  { key: "model",      label: "Κτίρια μελέτης"               },
  { key: "neo_sxedio", label: "Νέα χάραξη"                   },
];

export default function SceneLayerToggle({ visibility, onToggle }) {
  return (
    <div className="layer-toggle">
      {LAYERS.map(({ key, label }) => {
        const visible = visibility[key] ?? true;
        return (
          <button
            key={key}
            className={`layer-toggle-btn ${visible ? "active" : "hidden"}`}
            onClick={() => onToggle(key)}
            title={visible ? `Hide ${label}` : `Show ${label}`}
          >
            <span className="layer-toggle-icon">
              {visible ? <EyeOpen /> : <EyeClosed />}
            </span>
            <span className="layer-toggle-label">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
