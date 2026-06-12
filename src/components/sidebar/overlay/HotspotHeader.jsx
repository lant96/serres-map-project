import "../../../app/styles/sidebar.css";

const TYPE_COLORS = {
  building:    "#ff4d4d",
  image:       "#ff4d4d",
  publication: "#ff4d4d",
};

export default function HotspotHeader({ hotspot, onClose }) {
  const accentColor = TYPE_COLORS[hotspot.type] ?? "#cccccc";

  let title = hotspot.title;

  if (hotspot.type === "building") {
    title = hotspot.buildings?.[0]?.title ?? hotspot.title;
  } else if (hotspot.type === "image") {
    title = hotspot.images?.[0]?.title ?? hotspot.title;
  } else if (hotspot.type === "publication") {
    title = hotspot.publications?.[0]?.title ?? hotspot.title;
  }

  return (
    <div style={{ ...styles.header, borderLeftColor: accentColor }}>
      <div style={styles.text}>
        <h2 style={styles.title}>{title}</h2>

        {hotspot.type && (
          <span style={{ ...styles.badge, color: accentColor }}>
            {hotspot.type}
          </span>
        )}
      </div>

      <button style={styles.button} onClick={() => onClose?.()}>
        ×
      </button>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "14px 14px 14px 15px",
    borderBottom: "1px solid rgba(0,0,0,0.05)",
    borderLeft: "3px solid transparent",
    position: "sticky",
    top: 0,
    background: "#f0f0f0",
    zIndex: 10,
  },

  text: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    flex: 1,
    paddingRight: 10,
  },

  title: {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    color: "rgba(0,0,0,0.85)",
    lineHeight: 1.4,
  },

  badge: {
    fontSize: 11,
    opacity: 0.7,
    textTransform: "capitalize",
    letterSpacing: "0.03em",
  },

  button: {
    flexShrink: 0,
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "1px solid rgba(0,0,0,0.12)",
    background: "transparent",
    cursor: "pointer",
    fontSize: 16,
    lineHeight: 1,
    color: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s ease, color 0.15s ease",
  },
};
