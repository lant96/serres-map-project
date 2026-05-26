import PublicationCard from "./PublicationCard";

export default function PublicationsSection({ publications }) {
  if (!publications?.length) return null;

  return (
    <section>
      <h3>Publications</h3>

      {publications.map((p) => (
        <PublicationCard key={p.Id ?? p.id} publication={p} />
      ))}
    </section>
  );
}
