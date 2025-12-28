import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    // 테스트 환경 설정
    globals: true,
    environment: "node", // 순수 함수 테스트용
    setupFiles: ["./tests/setup.ts"], // 모든 테스트 전에 먼저 실행됨
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
