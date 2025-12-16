import PostItem from "../PostItem/PostItem";
import classNames from "classnames/bind";
import styles from "./PostList.module.css";
import { fetchNotionPostList } from "@/lib/notion/extracts";
import { formatDate } from "@/lib/dateUtils";

const cx = classNames.bind(styles);

const PostList = async () => {
  const posts = await fetchNotionPostList();

  if (posts.length === 0) {
    return (
      <div className={cx("wrap-container")}>
        <section className={cx("postlist")}>
          <p className={cx("empty-state")}>
            아직 발행한 게시글이 없습니다. Notion에서 공개 체크박스를 확인해
            주세요.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className={cx("wrap-container")}>
      <section className={cx("postlist")}>
        {posts.map((post) => (
          <PostItem
            key={post.id}
            postUrl={`/archive/${post.slug ?? post.id}`}
            postTitle={post.title || "Untitled"}
            postDate={formatDate(post.createdDate)}
            postCategories={post.categories}
          />
        ))}
      </section>
    </div>
  );
};
export default PostList;
