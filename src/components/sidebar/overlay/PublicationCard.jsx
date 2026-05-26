export default function PublicationCard({ publication }) {
  return (
    <div style={styles.card}>
      <h4 style={styles.title}>{publication.title}</h4>

      {publication.authors && (
        <p style={styles.meta}>{publication.authors}</p>
      )}

      {publication.year && (
        <p style={styles.meta}>{publication.year}</p>
      )}

      {publication.buildings?.length > 0 && (
        <div style={styles.relations}>
          <h5 style={styles.relationsLabel}>Related Buildings</h5>
          <ul style={styles.list}>
            {publication.buildings.map((b) => (
              <li key={b.Id ?? b.id}>{b.title}</li>
            ))}
          </ul>
        </div>
      )}

      {publication.images?.length > 0 && (
        <div style={styles.relations}>
          <h5 style={styles.relationsLabel}>Related Images</h5>
          <ul style={styles.list}>
            {publication.images.map((i) => (
              <li key={i.Id ?? i.id}>{i.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    marginBottom: 16,
    padding: 12,
    border: "1px solid #eee",
    borderRadius: 8,
  },
  title: {
    margin: "0 0 6px",
    fontSize: 14,
    fontWeight: 600,
  },
  meta: {
    margin: "2px 0",
    fontSize: 12,
    color: "#666",
  },
  relations: {
    marginTop: 10,
  },
  relationsLabel: {
    margin: "0 0 4px",
    fontSize: 12,
    fontWeight: 600,
    color: "#444",
  },
  list: {
    margin: 0,
    paddingLeft: 16,
    fontSize: 12,
    color: "#555",
  },
};
