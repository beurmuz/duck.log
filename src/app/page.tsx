import Navigation from "@/components/Navigation";
import PostItem from "@/components/PostItem";
import classNames from "classnames/bind";
// import styles from "./page.module.css";

// const cx = classNames.bind(styles);

export default function HomePage() {
  return (
    <div>
      <PostItem
        postUrl="url..."
        postTitle="임시 포스트"
        postDate="2024.11.20"
      />
    </div>
  );
}
