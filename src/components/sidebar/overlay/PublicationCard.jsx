import { useState } from "react";

export default function PublicationCard({
  publication,
  onImageHover,
  onImageHoverEnd,
}) {
  const [lightboxUrl, setLightboxUrl] = useState(null);

  const relatedImages    = publication.images    ?? [];
  const relatedBuildings = publication.buildings ?? [];
  const hasRelations     = relatedImages.length > 0 || relatedBuildings.length > 0;

  return (
    <div style={styles.card}>

      {/* Year */}
      <div style={styles.header}>
        {publication.year && (
          <span style={styles.year}>{publication.year}</span>
        )}
      </div>

      {/* Authors */}
      {publication.authors && (
        <p style={styles.year}>{publication.authors}</p>
      )}

      {/* Description */}
      {publication.description && (
        <p style={styles.description}>{publication.description}</p>
      )}

      {/* Source link */}
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

      {/* Related images — gallery, same as BuildingCard */}
      {relatedImages.length > 0 && (
        <div>
          <h4 style={styles.sectionLabel}>Related images</h4>
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

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          style={styles.lightboxBackdrop}
          onClick={() => setLightboxUrl(null)}
        >
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
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  title: {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    color: "#111",
    lineHeight: 1.5,
  },
  year: {
    fontSize: 12,
    color: "#888",
    fontVariantNumeric: "tabular-nums",
  },
  description: {
    fontSize: 13,
    color: "#444",
    lineHeight: 1.6,
    margin: 0,
  },
  link: {
    display: "inline-block",
    fontSize: 12,
    color: "#888",
    textDecoration: "none",
    borderBottom: "1px solid #ccc",
    paddingBottom: 1,
    alignSelf: "flex-start",
    transition: "color 0.15s ease, border-color 0.15s ease",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#888",
    marginBottom: 8,
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
  relations: {
    paddingTop: 10,
    borderTop: "1px solid #f0f0f0",
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