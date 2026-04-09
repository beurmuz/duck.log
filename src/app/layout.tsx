import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GA_TRACKING_ID } from "@/lib/gtag";
import Analytics from "@/components/Analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import Script from "next/script";

import Header from "@/layouts/Header";
import Footer from "@/layouts/Footer";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2", // 방금 넣어두신 파일 경로
  display: "swap", // 폰트가 로딩되는 동안 기본 폰트를 보여주다 자연스럽게 갈아끼움(깜빡임 방지)
  weight: "200 900", // 가변 폰트이므로 이 사이의 모든 굵기를 자동으로 지원함
});

export const metadata: Metadata = {
  title: "duck.log",
  description: "duck의 블로그",
  // SEO 비활성화
  robots: {
    index: false, // 검색 엔진 인덱싱 차단
    follow: false, // 링크 따라가기 차단
    noarchive: true, // 캐시 저장 차단
    nosnippet: true, // 스니펫 표시 차단
    noimageindex: true, // 이미지 인덱싱 차단
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className={pretendard.className}>
      <body className="wrap-pages vsc-initialized">
        {GA_TRACKING_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <Analytics />
        {process.env.NODE_ENV === "production" && <VercelAnalytics />}
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
