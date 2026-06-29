import Tabs from "./Tabs";
import BackArrow from "./Backarrow";
import "../../../app/styles/hotspotoverlay.css";

export default function BuildingCard({
  building,
  onImageHover,
  onImageHoverEnd,
  onImageClick,
  onClose,
}) {
  const planUrl = building["2d_plan"]?.[0]?.url ?? null;
  const relatedImages = building.images ?? [];
  const relatedPubs = building.publications ?? [];

  const infoContent = (
    <div>
      {building.description ? (
        <p style={styles.description}>{building.description}</p>
      ) : (
        <p style={styles.emptyState}>No additional information yet.</p>
      )}
    </div>
  );

  const galleryContent = (
    <div>
      {relatedImages.length > 0 ? (
        <div style={styles.gallery}>
          {relatedImages.map((img) => {
            const imgUrl = img.image_file?.[0]?.url ?? null;
            if (!imgUrl) return null;

            return (
              <img
                key={img.Id ?? img.id ?? img.title}
                src={imgUrl}
                alt={img.title ?? ""}
                title={img.title ?? ""}
                style={styles.galleryThumb}
                onClick={() => onImageClick?.(img)}
                onMouseEnter={() => onImageHover?.(img)}
                onMouseLeave={() => onImageHoverEnd?.()}
              />
            );
          })}
        </div>
      ) : (
        <p style={styles.emptyState}>No related images yet.</p>
      )}
    </div>
  );

  const relatedContent = (
    <div>
      {relatedPubs.length > 0 ? (
        <ul style={styles.list}>
          {relatedPubs.map((p) => (
            <li
              key={p.Id ?? p.id ?? p.title}
              style={styles.listItem}
            >
              <span>{p.title}</span>

              {p.year && (
                <span style={styles.listItemMeta}>
                  {" "}
                  · {p.year}
                </span>
              )}

              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.listItemLink}
                >
                  {" "}
                  ↗
                </a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p style={styles.emptyState}>
          No related publications yet.
        </p>
      )}
    </div>
  );

  const tabs = [
    {
      key: "info",
      label: "Info",
      content: infoContent,
    },
    {
      key: "gallery",
      label: "Gallery",
      content: galleryContent,
    },
    // {
    //   key: "related",
    //   label: "Related",
    //   content: relatedContent,
    // },
  ];

  return (
    <div>
      <div className="hotspot-hero-wrapper">
        <BackArrow onClose={onClose} />

        {planUrl ? (
          <img
            src={planUrl}
            alt={`2d plan — ${building.title}`}
            className="hotspot-hero-image-building"
          />
        ) : (
          <div className="hotspot-hero-placeholder">
            No plan available
          </div>
        )}
      </div>

      <div className="hotspot-body">
        <h2 className="hotspot-body-title">
          {building.title}
        </h2>

        <div className="hotspot-body-meta">
          <span className="hotspot-body-tag">
            Building
          </span>
        </div>

        <Tabs tabs={tabs} accentColor="#ff4d4d" />
      </div>
    </div>
  );
}

const styles = {
  description: {
    fontSize: 13,
    color: "#444",
    lineHeight: 1.6,
    margin: 0,
  },

  emptyState: {
    fontSize: 13,
    color: "#aaa",
    margin: 0,
  },

  gallery: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 6,
  },

  galleryThumb: {
    width: "100%",
    aspectRatio: "4 / 3",
    objectFit: "cover",
    borderRadius: 4,
    display: "block",
    cursor: "pointer",
    transition: "opacity 0.15s ease",
  },

  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },

  listItem: {
    fontSize: 13,
    padding: "8px 0",
    borderBottom: "1px solid #f0f0f0",
  },

  listItemMeta: {
    color: "#888",
  },

  listItemLink: {
    color: "#888",
    textDecoration: "none",
    fontSize: 12,
  },
};