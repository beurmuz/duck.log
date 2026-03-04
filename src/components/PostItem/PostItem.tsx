import classNames from "classnames/bind";
import styles from "./PostItem.module.css";
import { ReactNode } from "react";
import Link from "next/link";
import { CATEGORY_COLOR_MAP } from "@/constants/category";

const cx = classNames.bind(styles);

export default function PostItem({
  postUrl,
  postTitle,
  postDate,
  postCategories,
}: {
  postUrl: string; // `/archive/${slug || id}`
  postTitle: string;
  postDate: string;
  postCategories: Array<string>;
}): ReactNode {
  return (
    <article className={cx("wrap-postitem")}>
      <h2 className={cx("post-title")}>
        <Link href={postUrl}>{postTitle}</Link>
      </h2>

      <div className={cx("wrap-post-info")}>
        <ul className={cx("wrap-categories")}>
          {postCategories.map((category, id) => {
            const colors = CATEGORY_COLOR_MAP[category.toLowerCase()] || {
              bg: "#000",
              text: "#fff",
            };
            return (
              <li
                className={cx("post-category")}
                key={postUrl + postDate + id}
                style={
                  {
                    "--category-bg": colors.bg,
                    "--category-text": colors.text,
                  } as React.CSSProperties
                }
              >
                {category}
              </li>
            );
          })}
        </ul>
        <span className={cx("post-date")}>{postDate}</span>
      </div>
    </article>
  );
}
