export default function ImageCard({
  image,
  onBuildingHover,
  onBuildingHoverEnd,
}) {
  const imgUrl           = image.image_file?.[0]?.url ?? null;
  const relatedBuildings = image.buildings    ?? [];
  const relatedPubs      = image.publications ?? [];

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

      {/* Related buildings — hoverable, highlights polygon on map */}
      {relatedBuildings.length > 0 && (
        <div>
          <h4 style={styles.sectionLabel}>Related buildings</h4>
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

      {/* Related publications — text only, no map highlight */}
      {relatedPubs.length > 0 && (
        <div style={styles.pubsSection}>
          <h4 style={styles.sectionLabel}>Publications</h4>
          <ul style={styles.list}>
            {relatedPubs.map((p) => (
              <li key={p.Id ?? p.id ?? p.title} style={styles.pubItem}>
                <span style={styles.pubTitle}>{p.title}</span>
                {p.year && (
                  <span style={styles.pubYear}> · {p.year}</span>
                )}
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.pubLink}
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
    margin: "0 0 4px",
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
  pubsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTop: "1px solid #f0f0f0",
  },
  pubItem: {
    fontSize: 12,
    color: "#555",
    padding: "6px 0",
    borderBottom: "1px solid #f5f5f5",
    lineHeight: 1.5,
  },
  pubTitle: {
    color: "#333",
  },
  pubYear: {
    color: "#888",
  },
  pubLink: {
    color: "#888",
    textDecoration: "none",
    fontSize: 11,
  },
};