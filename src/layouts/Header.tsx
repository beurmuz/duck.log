"use client";

import classNames from "classnames/bind";
import styles from "./Header.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const cx = classNames.bind(styles);

const navItems = [
  { href: "/archive", label: "archive", matchPaths: ["/", "/archive"] },
  { href: "/about", label: "about", matchPaths: ["/about"] },
  { href: "/resume", label: "resume", matchPaths: ["/resume"] },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <nav className={cx("wrap-nav")}>
      <Image
        src="/profile.png"
        className={cx("icon-profile")}
        alt="프로필 사진"
        width={80}
        height={80}
        priority
      />
      <div className={cx("wrap-Info")}>
        <h1 className={cx(["info", "name"])}>Seoryeong</h1>
        <h2 className={cx(["info", "job"])}>Frontend Engineer</h2>
        <ol className={cx(["info", "wrap-list"])}>
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
      </div>
    </nav>
  );
};

export default Header;
