export {};

declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js",
      targetId: string,
      config?: {
        page_path?: string;
        [key: string]: unknown;
      }
    ) => void;
  }
}
