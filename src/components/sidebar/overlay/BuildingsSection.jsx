import BuildingCard from "./BuildingCard";

export default function BuildingsSection({ buildings }) {
  if (!buildings?.length) return null;

  return (
    <section>
      <h3>Buildings</h3>

      {buildings.map((b) => (
        <BuildingCard key={b.id} building={b} />
      ))}
    </section>
  );
}