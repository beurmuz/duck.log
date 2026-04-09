import classNames from "classnames/bind";
import styles from "./Mainpage.module.css";
import { fetchNotionPostList } from "@/lib/notion/extracts";
import Link from "next/link";
import ContactCard from "./ContactCard";
import Company from "@/components/UI/Company";

const cx = classNames.bind(styles);

const mainPage = async () => {
  const posts = await fetchNotionPostList();
  const latestPost = posts[0];

  return (
    <section className={cx("wrap-page")}>
      <div className={cx("card-grid")}>
        <div className={cx("top-row")}>
          {/* Latest Post */}
          {latestPost ? (
            <Link
              href={`/archive/${latestPost.slug ?? latestPost.id}`}
              className={cx("card", "latest-post", "clickable")}
            >
              <span className={cx("card-title", "underlined")}>
                Latest Post ↗
              </span>
            </Link>
          ) : (
            <div className={cx("card", "latest-post")}>
              <span className={cx("card-title")}>Latest Post</span>
            </div>
          )}

          <div className={cx("right-col")}>
            <ContactCard />
            <Link
              href="https://github.com/beurmuz"
              target="_blank"
              rel="noopener noreferrer"
              className={cx("card", "github", "clickable")}
            >
              <span className={cx("card-title", "underlined")}>GitHub ↗</span>
            </Link>
          </div>
        </div>

        <div className={cx("card", "about")}>
          <span className={cx("card-title")}>About me</span>
          <div className={cx("card-desc")}>
            <p>구조적으로 해결해 효율을 높이는 Frontend Engineer, 장서령 입니다.</p>
            <p>확장 가능한 설계를 통해 유지보수하기 쉬운 개발 환경을 만들고, 생산성을 높이는 것을 좋아합니다.</p>
          </div>
        </div>

        <div className={cx("card", "career")}>
          <span className={cx("card-title")}>Career</span>
          <div className={cx("career-content")}>
            <Company />
          </div>
        </div>
      </div>
    </section>
  );
};
export default mainPage;
