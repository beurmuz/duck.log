// robots.ts - 검색 엔진 크롤링 제어
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: "/", // 모든 페이지 크롤링 차단
    },
  };
}
