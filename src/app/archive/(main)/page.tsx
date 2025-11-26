import PostList from "@/components/PostList/PostList";
import classNames from "classnames/bind";
import styles from "./ArchivePage.module.css";

const cx = classNames.bind(styles);

const ArchivePage = () => {
  return (
    <section className={cx("wrap-page")}>
      <PostList />
    </section>
  );
};

export default ArchivePage;
