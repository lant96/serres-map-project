import { useAppStore } from "../../state/useAppStore";
import "../../app/styles/hotspotList.css";

function ItemThumbnail({ url }) {
  if (url) {
    return <img src={url} alt="" className="hotspot-thumb" />;
  }
  return <div className="hotspot-thumb hotspot-thumb--placeholder" />;
}

function ItemMeta({ hotspot }) {
  const type = hotspot.type;

  let title             = null;
  let year              = null;
  let short_description = null;

  if (type === "building") {
    const b           = hotspot.buildings?.[0];
    //title             = b?.title             ?? hotspot.title;
    short_description = b?.short_description ?? null;
  } else if (type === "image") {
    const img         = hotspot.images?.[0];
    //title             = img?.title             ?? hotspot.title;
    short_description = img?.short_description ?? null;
    year              = img?.year              ?? null;
  } else if (type === "publication") {
    const p           = hotspot.publications?.[0];
    title             = p?.title             ?? hotspot.title;
    year              = p?.year              ?? null;
    short_description = p?.short_description ?? null;
  }

  return (
    <div className="hotspot-meta">
      <div className="hotspot-title">{title}</div>
      {year && <div className="hotspot-year">{year}</div>}
      {short_description && (
        <div className="hotspot-desc">{short_description}</div>
      )}
    </div>
  );
}

function HoverArrow({ color }) {
  return (
    <div className="hotspot-arrow" style={{ background: color }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 12H19M19 12L12 5M19 12L12 19"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

const TYPE_COLORS = {
  building:    "#ff4d4d",
  image:       "#ff4d4d",
  publication: "#ff4d4d",
};

export default function HotspotList() {
  const hotspots                   = useAppStore((s) => s.hotspots);
  const activeFilter               = useAppStore((s) => s.activeFilter);
  const selectedHotspotId          = useAppStore((s) => s.selectedHotspotId);
  const setSelection               = useAppStore((s) => s.setSelection);
  const setHoveredRelatedHotspotId = useAppStore((s) => s.setHoveredRelatedHotspotId);

  const filtered = hotspots.filter((h) => h.type === activeFilter);

  if (!filtered.length) {
    return <p style={styles.empty}>No {activeFilter}s found.</p>;
  }

  return (
    <div className="hotspot-list">
      {filtered.map((h) => {
        const isSelected    = String(h.id) === String(selectedHotspotId);
        const isPublication = h.type === "publication";

        const className = [
          "hotspot-item",
          `hotspot-item--${h.type}`,
          isSelected ? "selected" : "",
        ]
          .filter(Boolean)
          .join(" ");

        let thumbUrl = null;
        if (h.type === "building") {
          thumbUrl = h.buildings?.[0]?.["2d_plan"]?.[0]?.url ?? null;
        } else if (h.type === "image") {
          thumbUrl = h.images?.[0]?.image_file?.[0]?.url ?? null;
        }

        const hasThumbnail = h.type === "building" || h.type === "image";

        return (
          <div
            key={h.id}
            className={className}
            onClick={() => setSelection("hotspot", h.id)}
            onMouseEnter={() => {
              if (!isPublication) {
                setHoveredRelatedHotspotId(String(h.id));
              }
            }}
            onMouseLeave={() => setHoveredRelatedHotspotId(null)}
          >
            {hasThumbnail && <ItemThumbnail url={thumbUrl} />}
            <ItemMeta hotspot={h} />
            <HoverArrow color={TYPE_COLORS[h.type] ?? "#999"} />
          </div>
        );
      })}
    </div>
  );
}

const styles = {
  empty: {
    padding: "16px 12px",
    fontSize: 13,
    color: "#aaa",
  },
};