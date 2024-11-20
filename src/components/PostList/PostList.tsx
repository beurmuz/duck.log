import PostItem from "../PostItem/PostItem";
import classNames from "classnames/bind";
import styles from "./PostList.module.css";
import SectionHeader from "../UI/SectionHeader";

const cx = classNames.bind(styles);

const PostList = () => {
  return (
    <div className={cx("wrap-container")}>
      <SectionHeader sectionName="All Posts" />
      <section className={cx("postlist")}>
        <PostItem
          postUrl="url"
          postTitle="CSR, SSR 그리고 PR 비교하기"
          postDate="2024.11.20"
          postCategories={["Web", "JavaScript"]}
        />
        <PostItem
          postUrl="url"
          postTitle="렌더링을 하는 다양한 방법: CSR과 SSR의 장점만 뽑아 쓰는 점진적 렌더링(Progressive Rendering)에 대해 알아보기"
          postDate="2024.11.21"
          postCategories={["Web", "Rendering"]}
        />
        <PostItem
          postUrl="url"
          postTitle="점진적 렌더링(Progressive Rendering)이란 무엇일까?"
          postDate="2024.11.21"
          postCategories={["Web", "Rendering"]}
        />
        <PostItem
          postUrl="url"
          postTitle="점진적 렌더링(Progressive Rendering)이란 무엇일까?"
          postDate="2024.11.21"
          postCategories={["Web", "Rendering"]}
        />
      </section>
    </div>
  );
};
export default PostList;