import classNames from "classnames/bind";
import styles from "./Mainpage.module.css";
import ArticleWrap from "@/layouts/ArticleWrap";
import { fetchNotionPosts } from "@/lib/notionPosts";
import Link from "next/link";

const cx = classNames.bind(styles);

const mainPage = async () => {
  const posts = await fetchNotionPosts();
  const latestPost = posts[0];

  return (
    <section className={cx("wrap-page")}>
      <ArticleWrap>
        <h2 className={cx("info")}>
          <span className={cx("info-part", "info-part-1")}>I&apos;m a</span>
          <span className={cx("info-part", "info-part-2")}>
            Frontend Engineer,
          </span>
          <span className={cx("info-part", "info-part-3")}>
            Jang-SeoRyeong.
          </span>
        </h2>
      </ArticleWrap>
      {latestPost && (
        <ArticleWrap className={cx("latest-post-wrapper")}>
          <h2 className={cx("article-title")}>Latest Post</h2>
          <Link
            href={`/archive/${latestPost.slug ?? latestPost.id}`}
            className={cx("post-link")}
          >
            <h3 className={cx("post-title")}>{latestPost.title} →</h3>
          </Link>
        </ArticleWrap>
      )}
    </section>
  );
};
export default mainPage;
