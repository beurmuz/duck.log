import Link from "next/link";

export default function PortfolioPage() {
  return (
    <div>
      <div>포트폴리오 페이지입니다.</div>
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
