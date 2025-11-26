import classNames from "classnames/bind";
import styles from "../app/Mainpage.module.css";
import { ReactNode } from "react";

const cx = classNames.bind(styles);

interface ArticleWrapProps {
  children: ReactNode;
  className?: string;
}

const ArticleWrap = ({ children, className }: ArticleWrapProps) => {
  return (
    <article className={cx("wrap-article", className)}>{children}</article>
  );
};
export default ArticleWrap;
