import ImageCard from "./ImageCard";

export default function ImagesSection({ images }) {
  if (!Array.isArray(images) || images.length === 0) return null;

  return (
    <section>
      <h3>Images</h3>
      {images.map((img) => (
        <ImageCard key={img.id ?? img.title} image={img} />
      ))}
    </section>
  );
}