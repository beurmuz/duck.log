import { notFound } from "next/navigation";
// import BackToLink from "@/components/UI/BackToLink";
import { fetchNotionPostDetail } from "@/lib/notion/postDetail";
import { fetchNotionPostList } from "@/lib/notion/extracts";
import type { NotionPostList } from "@/models/post";
import NotionRenderer from "@/components/NotionRenderer";
import { formatDate } from "@/lib/dateUtils";
import classNames from "classnames/bind";
import styles from "./ArchiveDetail.module.css";

const cx = classNames.bind(styles);

// 빌드 시 모든 포스트 페이지를 생성 (SSG)하되, 7일마다 포스트 페이지를 자동으로 재검증(ISR)하는 형태

// ISR: 런타임) 페이지 재검증 시간 7일로 설정
export const revalidate = 604800; // (= 7일)

// SSG: 빌드 타임) [slug]의 모든 경로를 미리 생성해 각 페이지를 미리 생성
export async function generateStaticPaths() {
  const posts = await fetchNotionPostList();

  return posts
    .filter((post): post is NotionPostList & { slug: string } => !!post.slug) // 전체 post에서 slug가 있는 것만 필터링
    .map((post) => ({ slug: post.slug })); // slug만 추출하여 배열로 반환
}

export default async function ArchiveDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>; // slug는 비동기 파라미터로 전달됨
}) {
  const { slug } = await params;

  try {
    const postDetail = await fetchNotionPostDetail(slug);
    return (
      <section className={cx("wrap-page")}>
        <header className={cx("wrap-header")}>
          {postDetail.categories.length > 0 && (
            <ul className={cx("post-categories")}>
              {postDetail.categories.map((category) => (
                <li className={cx("post-category")} key={category}>
                  {category}
                </li>
              ))}
            </ul>
          )}
          <h1 className={cx("post-title")}>{postDetail.title}</h1>
          <div className={cx("post-date")}>
            {formatDate(postDetail.updatedDate)} updated
          </div>
        </header>

        <section className={cx("wrap-notioncontent")}>
          <NotionRenderer blocks={postDetail.blocks} />
        </section>
      </section>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}
