import { useState } from "react";
import Tabs from "./Tabs";
import BackArrow from "./Backarrow";
import "../../../app/styles/hotspotoverlay.css";

export default function ImageCard({
  image,
  onBuildingHover,
  onBuildingHoverEnd,
  onClose,
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const imgUrl           = image.image_file?.[0]?.url ?? null;
  const relatedBuildings = image.buildings    ?? [];
  const relatedPubs      = image.publications ?? [];

  // Info tab 
  const infoContent = (
    <div>
      {image.description ? (
        <p style={styles.description}>{image.description}</p>
      ) : (
        <p style={styles.emptyState}>No additional information yet.</p>
      )}

      {relatedPubs.length > 0 && (
        <div style={relatedBuildings.length > 0 ? styles.secondGroup : undefined}>
          <h4 style={styles.sectionLabel}>Source</h4>
          <ul style={styles.list}>
            {relatedPubs.map((p) => (
              <li key={p.Id ?? p.id ?? p.title} style={styles.listItem}>
                <span>{p.title}</span>
                {p.year && <span style={styles.listItemMeta}> · {p.year}</span>}
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.listItemLink}
                  >
                    {" "}↗
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );

  // Related tab
  const relatedContent = (
    <div>
      {relatedBuildings.length > 0 && (
        <div>
          <h4 style={styles.sectionLabel}>Buildings</h4>
          <ul style={styles.list}>
            {relatedBuildings.map((b) => (
              <li
                key={b.Id ?? b.id ?? b.title}
                style={styles.listItem}
                onMouseEnter={() => onBuildingHover?.(b)}
                onMouseLeave={() => onBuildingHoverEnd?.()}
              >
                {b.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {relatedBuildings.length === 0 && relatedPubs.length === 0 && (
        <p style={styles.emptyState}>No related items yet.</p>
      )}
    </div>
  );

  const tabs = [
    { key: "info",    label: "Info",    content: infoContent },
    { key: "related", label: "Related", content: relatedContent },
  ];

  return (
    <div>
      {/* Hero — archival photo, clickable for lightbox, back arrow floats on top */}
      <div className="hotspot-hero-wrapper">
        <BackArrow onClose={onClose} />
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={image.title ?? ""}
            className="hotspot-hero-image"
            onClick={() => setLightboxOpen(true)}
          />
        ) : (
          <div className="hotspot-hero-placeholder">No image available</div>
        )}
      </div>

      <div className="hotspot-body">
        <h2 className="hotspot-body-title">{image.title}</h2>
        <div className="hotspot-body-meta">
          <span className="hotspot-body-tag">Image</span>
          {image.year && <span>{image.year}</span>}
        </div>

        <Tabs tabs={tabs} accentColor="#ff4d4d" />
      </div>

      {lightboxOpen && imgUrl && (
        <div style={styles.lightboxBackdrop} onClick={() => setLightboxOpen(false)}>
          <button
            style={styles.lightboxClose}
            onClick={() => setLightboxOpen(false)}
            aria-label="Close"
          >
            ×
          </button>
          <img
            src={imgUrl}
            style={styles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#888",
    marginBottom: 6,
  },
  secondGroup: {
    marginTop: 14,
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    fontSize: 13,
    color: "#333",
    padding: "6px 8px",
    borderBottom: "1px solid #f0f0f0",
    borderRadius: 4,
    transition: "background 0.15s ease",
  },
  listItemMeta: {
    color: "#888",
  },
  listItemLink: {
    color: "#888",
    textDecoration: "none",
    fontSize: 12,
  },
  lightboxBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    zIndex: 99999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "zoom-out",
  },
  lightboxImage: {
    maxWidth: "90vw",
    maxHeight: "90vh",
    objectFit: "contain",
    borderRadius: 6,
    cursor: "default",
    boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
  },
  lightboxClose: {
    position: "absolute",
    top: 20,
    right: 24,
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: 36,
    cursor: "pointer",
    lineHeight: 1,
    padding: 0,
  },
};