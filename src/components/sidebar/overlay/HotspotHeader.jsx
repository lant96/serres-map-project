const TYPE_COLORS = {
  building:    "#ff4d4d",
  image:       "#ff4d4d",
  publication: "#ff4d4d",
};

export default function HotspotHeader({ hotspot, onClose }) {
  const accentColor = TYPE_COLORS[hotspot.type] ?? "#cccccc";

  return (
    <div style={{ ...styles.header, borderLeftColor: accentColor }}>

      <button
        onClick={() => onClose?.()}
        style={styles.backButton}
        aria-label="Back to list"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div style={styles.text}>
        <h2 style={styles.title}>{hotspot.title}</h2>
        {hotspot.type && (
          <span style={{ ...styles.badge, color: accentColor }}>
            {hotspot.type}
          </span>
        )}
      </div>

    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "14px 14px 14px 15px",
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 10,
  },

  backButton: {
    flexShrink: 0,
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "none",
    background: "#ffffff",
    boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
    cursor: "pointer",
    color: "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.15s ease, background 0.15s ease",
  },

  text: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    flex: 1,
    paddingTop: 4,
  },

  title: {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    color: "rgba(0,0,0,1)",
    lineHeight: 1.4,
  },

  badge: {
    fontSize: 11,
    opacity: 0.7,
    textTransform: "capitalize",
    letterSpacing: "0.03em",
  },
};