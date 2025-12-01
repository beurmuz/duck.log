import { notFound } from "next/navigation";
// import BackToLink from "@/components/UI/BackToLink";
import { fetchNotionPostDetail } from "@/lib/notionPostDetail";
import { fetchNotionPosts } from "@/lib/notionPosts";
import NotionRenderer from "@/components/NotionRenderer";
import { formatDate } from "@/lib/dateUtils";
import classNames from "classnames/bind";
import styles from "./ArchiveDetail.module.css";

const cx = classNames.bind(styles);

// 페이지 재검증 시간 7일로 설정
export const revalidate = 604800;

// 빌드 타임에 모든 slug를 미리 생성
export async function generateStaticParams() {
  const posts = await fetchNotionPosts();

  return posts
    .filter((post) => post.slug) // slug가 있는 포스트만
    .map((post) => ({
      slug: post.slug!,
    }));
}

type ArchiveDetailProps = {
  params: Promise<{ slug: string }>;
};

export default async function ArchiveDetailPage({
  params,
}: ArchiveDetailProps) {
  const { slug } = await params;

  try {
    const detail = await fetchNotionPostDetail(slug);

    return (
      <section className={cx("wrap-page")}>
        <header className={cx("wrap-header")}>
          {/* <BackToLink /> */}
          {detail.categories.length > 0 && (
            <ul className={cx("post-categories")}>
              {detail.categories.map((category) => (
                <li className={cx("post-category")} key={category}>
                  {category}
                </li>
              ))}
            </ul>
          )}
          <h1 className={cx("post-title")}>{detail.title}</h1>
          <div className={cx("post-date")}>
            {formatDate(detail.updatedDate)} updated
          </div>
        </header>

        <section className={cx("wrap-notioncontent")}>
          <NotionRenderer blocks={detail.blocks} />
        </section>
      </section>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}
