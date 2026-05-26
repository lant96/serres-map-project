export default function ImageCard({
  image,
  onBuildingHover,
  onBuildingHoverEnd,
}) {
  const imgUrl          = image.image_file?.[0]?.url ?? null;
  const relatedBuildings = image.buildings ?? [];

  return (
    <div>
      {/* Photo */}
      {imgUrl && (
        <img
          src={imgUrl}
          alt={image.title ?? ""}
          style={styles.photo}
        />
      )}

      {/* Year */}
      {image.year && <p style={styles.year}>{image.year}</p>}

      {/* Description */}
      {image.description && (
        <p style={styles.description}>{image.description}</p>
      )}

      {/* Related buildings — text list, hoverable */}
      {relatedBuildings.length > 0 && (
        <div>
          <h4 style={styles.sectionLabel}>Related buildings</h4>
          <ul style={styles.list}>
            {relatedBuildings.map((b) => (
              <li
                key={b.Id ?? b.id ?? b.title}
                style={styles.listItem}
                // #2 — hover highlights the corresponding building polygon
                onMouseEnter={() => onBuildingHover?.(b)}
                onMouseLeave={() => onBuildingHoverEnd?.()}
              >
                {b.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  photo: {
    width: "100%",
    borderRadius: 6,
    marginBottom: 12,
    display: "block",
  },
  year: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
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
    marginBottom: 6,
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
    cursor: "default",
    borderRadius: 4,
    transition: "background 0.15s ease",
  },
};
