import classNames from "classnames/bind";
import styles from "./Header.module.css";
import githubIcon from "@/../public/github-icon.png";

const cx = classNames.bind(styles);

const Header = () => {
  return (
    <nav className={cx("wrap-nav")}>
      <ol className={cx("wrap-list")}>
        <li className={cx("list-item")}>blog</li>
        <li className={cx("list-item")}>about</li>
      </ol>
      <ol className={cx("wrap-list")}>
        <li className={cx("list-item")}>github</li>
        <li className={cx("list-item")}>rss</li>
      </ol>
    </nav>
  );
};

export default Header;
