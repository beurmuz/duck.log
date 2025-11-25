export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  return (
    <section>
      <div>category: {category}</div>
    </section>
  );
}
