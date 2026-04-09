import classNames from "classnames/bind";
import styles from "./Mainpage.module.css";
import { fetchNotionPostList } from "@/lib/notion/extracts";
import Link from "next/link";
import { formatDate } from "@/lib/dateUtils";
import SectionTitle from "@/components/UI/SectionTitle";

const cx = classNames.bind(styles);

const mainPage = async () => {
  const posts = await fetchNotionPostList();
  const latestPost = posts[0];

  return (
    <section className={cx("wrap-page")}>
      <section className={cx("introduce-section")}>

      </section>
      {latestPost && (
        <section className={cx("latest-post-section")}>
          <SectionTitle title="LATEST POST" />
          <Link
            href={`/archive/${latestPost.slug ?? latestPost.id}`}
            className={cx("post-card")}
          >
            <h3 className={cx("post-card-title")}>{latestPost.title}</h3>
            <div className={cx("post-footer")}>
              <span className={cx("post-date")}>
                {formatDate(latestPost.createdDate)}
              </span>
              <span className={cx("read-more")}>Read Post →</span>
            </div>
          </Link>
        </section>
      )}
    </section>
  );
};
export default mainPage;
