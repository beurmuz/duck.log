import type { Metadata } from "next";
import "./globals.css";
import { GA_TRACKING_ID } from "@/lib/gtag";
import Analytics from "@/components/Analytics";
import Script from "next/script";

import Header from "@/layouts/Header";
import Footer from "@/layouts/Footer";

export const metadata: Metadata = {
  title: "duck.log",
  description: "duck의 블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
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
      </head>
      <link rel="icon" href="/icon.ico" sizes="any" />
      <body className="wrap-pages vsc-initialized">
        <Analytics />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
