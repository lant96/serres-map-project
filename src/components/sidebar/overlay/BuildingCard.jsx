export default function BuildingCard({ building }) {
  // 2d_plan is normalised to [{url, ...}] by buildingService
  const planUrl = building["2d_plan"]?.[0]?.url ?? null;

  // building.images is resolved by deep hydration in hotspotHydrationService —
  // each item is a full image entity with image_file: [{url}]
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

      {/* Related images — photo gallery */}
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
                  style={styles.galleryThumb}
                  title={img.title ?? ""}
                />
              );
            })}
          </div>
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
  },
};
