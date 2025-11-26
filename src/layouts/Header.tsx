"use client";

import classNames from "classnames/bind";
import styles from "./Header.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

const cx = classNames.bind(styles);

const navItems = [
  { href: "/archive", label: "archive", matchPaths: ["/archive"] },
  { href: "/about", label: "about", matchPaths: ["/about"] },
  // { href: "/resume", label: "resume", matchPaths: ["/resume"] },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <nav className={cx("wrap-nav")}>
      <Link href={"/"}>
        <h1 className={cx("site-title")}>duck.log</h1>
      </Link>
      <ol className={cx("wrap-list")}>
        {navItems.map((item, index) => {
          const isActive = item.matchPaths.includes(pathname);
          return (
            <li key={item.href}>
              {index > 0 && <span className={cx("line")}>|</span>}
              <Link
                href={item.href}
                className={cx("site-name", { active: isActive })}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Header;
