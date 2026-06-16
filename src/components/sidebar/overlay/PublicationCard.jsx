import { useState } from "react";
import Tabs from "./Tabs";
import BackArrow from "./BackArrow";
import "../../../app/styles/hotspotoverlay.css";

export default function PublicationCard({
  publication,
  onImageHover,
  onImageHoverEnd,
  onClose,
}) {
  const [lightboxUrl, setLightboxUrl] = useState(null);

  const relatedImages    = publication.images    ?? [];
  const relatedBuildings = publication.buildings ?? [];

  // ── Info tab ───────────────────────────────────────────────────────────
  const infoContent = (
    <div>
      {publication.description ? (
        <p style={styles.description}>{publication.description}</p>
      ) : (
        <p style={styles.emptyState}>No additional information yet.</p>
      )}

      {publication.url && (
        <a
          href={publication.url}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          View source ↗
        </a>
      )}
    </div>
  );

  // ── Related tab ────────────────────────────────────────────────────────
  const relatedContent = (
    <div>
      {relatedImages.length > 0 && (
        <div>
          <h4 style={styles.sectionLabel}>Images</h4>
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
                  onClick={() => setLightboxUrl(imgUrl)}
                  onMouseEnter={() => onImageHover?.(img)}
                  onMouseLeave={() => onImageHoverEnd?.()}
                />
              );
            })}
          </div>
        </div>
      )}

      {relatedBuildings.length > 0 && (
        <div style={relatedImages.length > 0 ? styles.secondGroup : undefined}>
          <h4 style={styles.sectionLabel}>Buildings</h4>
          <ul style={styles.list}>
            {relatedBuildings.map((b) => (
              <li key={b.Id ?? b.id ?? b.title} style={styles.listItem}>
                {b.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {relatedImages.length === 0 && relatedBuildings.length === 0 && (
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
      {/* No hero image — back arrow sits standalone at the top of the panel */}
      <BackArrow onClose={onClose} standalone />

      <div className="hotspot-body">
        <h2 className="hotspot-body-title">{publication.title}</h2>
        <div className="hotspot-body-meta">
          <span className="hotspot-body-tag">Publication</span>
          {publication.year && <span>{publication.year}</span>}
        </div>

        <Tabs tabs={tabs} accentColor="#ff4d4d" />
      </div>

      {lightboxUrl && (
        <div style={styles.lightboxBackdrop} onClick={() => setLightboxUrl(null)}>
          <button
            style={styles.lightboxClose}
            onClick={() => setLightboxUrl(null)}
            aria-label="Close"
          >
            ×
          </button>
          <img
            src={lightboxUrl}
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
    margin: "0 0 10px",
  },
  emptyState: {
    fontSize: 13,
    color: "#aaa",
    margin: 0,
  },
  link: {
    display: "inline-block",
    fontSize: 12,
    color: "#888",
    textDecoration: "none",
    borderBottom: "1px solid #ccc",
    paddingBottom: 1,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#888",
    marginBottom: 8,
  },
  secondGroup: {
    marginTop: 14,
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
    color: "#333",
    padding: "6px 8px",
    borderBottom: "1px solid #f0f0f0",
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