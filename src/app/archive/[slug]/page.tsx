import { notFound } from "next/navigation";
import { fetchNotionPostDetail } from "@/lib/notionPostDetail";
import NotionRenderer from "@/components/NotionRenderer";

type ArchiveDetailProps = {
  params: Promise<{ slug: string }>;
};

const formatDate = (value: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export default async function ArchiveDetailPage({
  params,
}: ArchiveDetailProps) {
  const { slug } = await params;

  try {
    const detail = await fetchNotionPostDetail(slug);

    return (
      <article style={{ padding: "2rem" }}>
        <header style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>{detail.title}</h1>
          <div style={{ marginTop: "0.5rem", color: "#555" }}>
            <div>created At: {formatDate(detail.createdDate)}</div>
            <div>updated At: {formatDate(detail.updatedDate)}</div>
          </div>
          {detail.categories.length > 0 && (
            <ul
              style={{
                display: "flex",
                gap: "0.5rem",
                marginTop: "1rem",
                listStyle: "none",
                padding: 0,
              }}
            >
              {detail.categories.map((category) => (
                <li
                  key={category}
                  style={{
                    padding: "0.2rem 0.8rem",
                    borderRadius: "999px",
                    backgroundColor: "#e3f2fd",
                    fontSize: "0.85rem",
                  }}
                >
                  {category}
                </li>
              ))}
            </ul>
          )}
        </header>

        <section style={{ lineHeight: 1.7 }}>
          <NotionRenderer blocks={detail.blocks} />
        </section>
      </article>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}
