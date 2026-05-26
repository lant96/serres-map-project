import { useState } from "react";

export default function BuildingCard({
  building,
  onImageHover,
  onImageHoverEnd,
}) {
  const [lightboxUrl, setLightboxUrl] = useState(null);

  const planUrl       = building["2d_plan"]?.[0]?.url ?? null;
  const relatedImages = building.images ?? [];

  return (
    <div>
      {/* Floor plan */}
      {planUrl && (
        <img
          src={planUrl}
          alt={`2d plan — ${building.title}`}
          style={styles.planImage}
        />
      )}

      {/* Description */}
      {building.description && (
        <p style={styles.description}>{building.description}</p>
      )}

      {/* Related images — clickable gallery */}
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
  planImage: {
    width: "100%",
    borderRadius: 6,
    marginBottom: 12,
    display: "block",
  },
  description: {
    fontSize: 13,
    color: "#444",
    lineHeight: 1.6,
    marginBottom: 16,
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
