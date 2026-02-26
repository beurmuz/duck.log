import classNames from "classnames/bind";
import styles from "./Mainpage.module.css";
import ArticleWrap from "@/layouts/ArticleWrap";
import { fetchNotionPostList } from "@/lib/notion/extracts";
import Link from "next/link";

import { formatDate } from "@/lib/dateUtils";

const cx = classNames.bind(styles);

const mainPage = async () => {
  const posts = await fetchNotionPostList();
  const latestPost = posts[0];

  return (
    <section className={cx("wrap-page")}>
      <ArticleWrap>
        <h2 className={cx("info")}>
          <span className={cx("info-part", "info-part-1")}>
            Frontend Engineer,
          </span>
          <span className={cx("info-part", "info-part-2")}>
            Jang Seo-Ryeong.
          </span>
        </h2>
      </ArticleWrap>
      {latestPost && (
        <section className={cx("latest-post-section")}>
          <span className={cx("section-label")}>LATEST POST</span>
          <Link
            href={`/archive/${latestPost.slug ?? latestPost.id}`}
            className={cx("post-card")}
          >
            <div className={cx("post-meta")}>
              {latestPost.categories?.[0] && (
                <span className={cx("category-tag")}>{latestPost.categories[0]}</span>
              )}
              <span className={cx("post-date")}>{formatDate(latestPost.createdDate)}</span>
            </div>
            <h3 className={cx("post-card-title")}>{latestPost.title}</h3>
            <span className={cx("read-more")}>Read Post →</span>
          </Link>
        </section>
      )}
    </section>
  );
};
export default mainPage;
