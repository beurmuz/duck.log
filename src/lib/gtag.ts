export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "G-5V4M6R90Y5";

export const pageview = (url: string) => {
  if (!GA_TRACKING_ID) return;
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};
