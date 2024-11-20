import PostItem from "../PostItem/PostItem";
import classNames from "classnames/bind";
import styles from "./PostList.module.css";

const cx = classNames.bind(styles);

const PostList = () => {
  return (
    <div className={cx("wrap-container")}>
      <nav className={cx("wrap-list-header")}>
        <h2 className={cx("list-name")}>ALL POSTS</h2>
        <button className={cx("category-button")}>
          <img src="/category-icon.png" className={cx("category-icon")} />
        </button>
      </nav>
      <section className={cx("postlist")}>
        <PostItem postUrl="url" postTitle="포스트 이름" postDate="2024.11.20" />
        <PostItem postUrl="url" postTitle="포스트 이름" postDate="2024.11.20" />
      </section>
    </div>
  );
};
export default PostList;
