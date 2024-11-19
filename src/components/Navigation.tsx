"use client";

import classNames from "classnames/bind";
import styles from "./Navigation.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const cx = classNames.bind(styles);

export default function Navigation() {
  const path = usePathname();

  return (
    <nav>
      <ul>
        <li
          className={
            path === "/" ? cx(["list-item", "active"]) : cx("list-item")
          }
        >
          <Link href="/">blog</Link>
        </li>
        <li
          className={
            path === "/about" ? cx(["list-item", "active"]) : cx("list-item")
          }
        >
          <Link href="/about">about</Link>
        </li>
      </ul>
    </nav>
  );
}
