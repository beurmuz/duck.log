import classNames from "classnames/bind";
import styles from "./PostItem.module.css";
import { ReactNode } from "react";

const cx = classNames.bind(styles);

export default function PostItem({
  postUrl,
  postTitle,
  postDate,
}: {
  postUrl: string;
  postTitle: string;
  postDate: string;
}): ReactNode {
  return (
    <article className={cx("wrap-postitem")}>
      <div className={cx("wrap-image")}>{postUrl}</div>
      <h2 className={cx("post-title")}>{postTitle}</h2>
      <p className={cx("post-date")}>{postDate}</p>
    </article>
  );
}
