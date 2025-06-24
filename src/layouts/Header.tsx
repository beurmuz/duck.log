"use client";

import classNames from "classnames/bind";
import styles from "./Header.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const cx = classNames.bind(styles);

const Header = () => {
  const path = usePathname();

  return (
    <nav className={cx("wrap-nav")}>
      <Image
        src="/profile.png"
        className={cx("icon-profile")}
        alt="프로필 사진"
        width={100}
        height={100}
      />
      <div className={cx("wrap-Info")}>
        <h1 className={cx(["info", "name"])}>Seoryeong</h1>
        <h2 className={cx(["info", "job"])}>Frontend Engineer</h2>
        <ol className={cx(["info", "wrap-list"])}>
          <li
            className={
              path === "/archive"
                ? cx(["site-name", "list-item", "active"])
                : cx(["site-name", "list-item"])
            }
          >
            <Link href="/">archive</Link>
          </li>
          <span className={cx("line")}>|</span>
          <li
            className={
              path === "/about"
                ? cx(["site-name", "list-item", "active"])
                : cx(["site-name", "list-item"])
            }
          >
            <Link href="/about">about</Link>
          </li>
          <span className={cx("line")}>|</span>
          <li
            className={
              path === "/resume"
                ? cx(["site-name", "list-item", "active"])
                : cx(["site-name", "list-item"])
            }
          >
            <Link href="/resume">resume</Link>
          </li>
        </ol>
      </div>
    </nav>
  );
};

export default Header;
