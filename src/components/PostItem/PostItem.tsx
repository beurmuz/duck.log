import classNames from "classnames/bind";
import styles from "./PostItem.module.css";
import { ReactNode } from "react";

const cx = classNames.bind(styles);

export default function PostItem({
  postUrl,
  postTitle,
  postDate,
  postCategories,
}: {
  postUrl: string;
  postTitle: string;
  postDate: string;
  postCategories: Array<string>;
}): ReactNode {
  return (
    <article className={cx("wrap-postitem")}>
      <h2 className={cx("post-title")}>{postTitle}</h2>
      <div className={cx("wrap-post-info")}>
        <ul className={cx("wrap-categories")}>
          {postCategories.map((category, id) => (
            <li className={cx("post-category")} key={postUrl + postDate + id}>
              {category}
            </li>
          ))}
        </ul>
        <span className={cx("post-date")}>{postDate}</span>
      </div>
    </article>
  );
}
