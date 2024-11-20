"use client";

import classNames from "classnames/bind";
import styles from "./Header.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const cx = classNames.bind(styles);

const Header = () => {
  const path = usePathname();

  return (
    <nav className={cx("wrap-nav")}>
      <ol className={cx("wrap-list")}>
        <li
          className={
            path === "/"
              ? cx(["site-name", "list-item", "active"])
              : cx(["site-name", "list-item"])
          }
        >
          <img src="/profile.png" className={cx("icon-profile")} />

          <Link href="/">duck.log</Link>
        </li>
        <li
          className={
            path === "/about" ? cx(["list-item", "active"]) : cx("list-item")
          }
        >
          <Link href="/about">
            <img src="/user-icon.png" className={cx("icon-user")} />
          </Link>
        </li>
      </ol>
    </nav>
  );
};

export default Header;
