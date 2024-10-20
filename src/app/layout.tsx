import type { Metadata } from "next";
import "./globals.css";
// import "./reset.css";

export const metadata: Metadata = {
  title: "duck.log",
  description: "duck의 블로그",
  icons: "./favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <link rel="icon" href="./favicon.ico" sizes="any" />
      {/* <body className={`${geistSans.variable}`}>{children}</body> */}
      <body>{children}</body>
    </html>
  );
}
