export default function PublicationCard({ publication }) {
  const hasRelations =
    publication.buildings?.length > 0 || publication.images?.length > 0;

  return (
    <div style={styles.card}>

      {/* Header — title + year */}
      <div style={styles.header}>
        <p style={styles.title}>{publication.title}</p>
        {publication.year && (
          <span style={styles.year}>{publication.year}</span>
        )}
      </div>

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

      {/* Relations */}
      {hasRelations && (
        <div style={styles.relations}>
          {publication.buildings?.length > 0 && (
            <div style={styles.relationGroup}>
              <span style={styles.relationLabel}>Buildings</span>
              <span style={styles.relationItems}>
                {publication.buildings.map((b) => b.title).join(", ")}
              </span>
            </div>
          )}

          {publication.images?.length > 0 && (
            <div style={styles.relationGroup}>
              <span style={styles.relationLabel}>Images</span>
              <span style={styles.relationItems}>
                {publication.images.map((i) => i.title).join(", ")}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
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

  link: {
    display: "inline-block",
    fontSize: 12,
    color: "#888",
    textDecoration: "none",
    borderBottom: "1px solid #ccc",
    paddingBottom: 1,
    transition: "color 0.15s ease, border-color 0.15s ease",
    alignSelf: "flex-start",
  },

  relations: {
    marginTop: 4,
    paddingTop: 10,
    borderTop: "1px solid #f0f0f0",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  relationGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },

  relationLabel: {
    fontSize: 10,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#aaa",
  },

  relationItems: {
    fontSize: 12,
    color: "#555",
    lineHeight: 1.5,
  },
};
