// import classNames from "classnames/bind";
// import styles from "./page.module.css";

import Link from "next/link";

// const cx = classNames.bind(styles);

export default function AboutPage() {
  return (
    <div>
      About 페이지는 업데이트 중입니다.
      <br />
      <br />
      <ol>
        <li>
          <Link href="/portfolio/blog">Blog</Link>
        </li>
        <li>
          <Link href="/portfolio/sikk">SIK-K</Link>
        </li>
        <li>
          <Link href="/portfolio/colrapy">Colrapy</Link>
        </li>
      </ol>
    </div>
  );
}
