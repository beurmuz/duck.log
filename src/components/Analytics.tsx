"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import * as gtag from "@/lib/gtag";

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!gtag.GA_TRACKING_ID) return;
    gtag.pageview(pathname);
  }, [pathname]);

  return null;
}
