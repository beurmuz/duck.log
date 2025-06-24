interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default function CategoryPage({ ...props }: CategoryPageProps) {
  return (
    <section>
      <div>category: {props.params.category}</div>
    </section>
  );
}
