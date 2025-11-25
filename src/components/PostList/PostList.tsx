import PostItem from "../PostItem/PostItem";
import classNames from "classnames/bind";
import styles from "./PostList.module.css";

const cx = classNames.bind(styles);

interface Post {
  postUrl: string;
  postTitle: string;
  postDate: string;
  postCategories: string[];
}

const mockPosts: Post[] = [
  {
    postUrl: "url",
    postTitle: "CSR, SSR 그리고 PR 비교하기",
    postDate: "2025.06.19",
    postCategories: ["Web", "JavaScript"],
  },
  {
    postUrl: "url",
    postTitle:
      "렌더링을 하는 다양한 방법: CSR과 SSR의 장점만 뽑아 쓰는 점진적 렌더링(Progressive Rendering)",
    postDate: "2025.06.19",
    postCategories: ["Web", "Rendering"],
  },
  {
    postUrl: "url",
    postTitle: "점진적 렌더링(Progressive Rendering)이란 무엇일까?",
    postDate: "2025.06.19",
    postCategories: ["Web", "Rendering"],
  },
  {
    postUrl: "url",
    postTitle: "점진적 렌더링(Progressive Rendering)이란 무엇일까?",
    postDate: "2025.06.19",
    postCategories: ["Web", "Rendering"],
  },
];

const PostList = () => {
  return (
    <div className={cx("wrap-container")}>
      <section className={cx("postlist")}>
        {mockPosts.map((post) => (
          <PostItem
            key={post.postUrl}
            postUrl={post.postUrl}
            postTitle={post.postTitle}
            postDate={post.postDate}
            postCategories={post.postCategories}
          />
        ))}
      </section>
    </div>
  );
};
export default PostList;
