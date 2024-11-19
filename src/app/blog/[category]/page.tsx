export default function CategoryPage({ ...props }) {
  return (
    <section>
      <div>category: {props.params.category}</div>
    </section>
  );
}
