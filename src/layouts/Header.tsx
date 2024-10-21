import classNames from "classnames/bind";
import styles from "./Header.module.css";
import githubIcon from "@/../public/github-icon.png";
import Link from "next/link";

const cx = classNames.bind(styles);

const Header = () => {
  return (
    <nav className={cx("wrap-nav")}>
      <ol className={cx("wrap-list")}>
        <li className={cx("list-item")}>
          <Link href="/">blog</Link>
        </li>
        <li className={cx("list-item")}>
          <Link href="/about">about</Link>
        </li>
      </ol>
      <ol className={cx("wrap-list")}>
        <li className={cx("list-icon")}>
          <a href="https://github.com/beurmuz" target="_blank">
            <img src="/github-icon.png" className={cx("icon-github")} />
          </a>
        </li>
        {/* <li className={cx("list-icon")}>
          <img src="/rss-icon.png" className={cx("icon-rss")} />
        </li> */}
      </ol>
    </nav>
  );
};

export default Header;
