import { describe, it, expect } from "vitest";
import { formatDate } from "@/lib/dateUtils";

describe("formatDate", () => {
  it("올바른 날짜 형식으로 변환해야 함", () => {
    expect(formatDate("2025-12-29")).toBe("2025.12.29");
    expect(formatDate("2026-01-01")).toBe("2026.01.01");
  });

  it("한 자리 월/일은 0으로 패딩해야 함", () => {
    expect(formatDate("2026-1-15")).toBe("2026.01.15");
    expect(formatDate("2026-10-1")).toBe("2026.10.01");
    expect(formatDate("2026-1-1")).toBe("2026.01.01");
  });

  it("ISO 형식 날짜를 올바르게 변환해야 함", () => {
    expect(formatDate("2026-01-01T00:00:00.000Z")).toBe("2026.01.01");
    expect(formatDate("2025-12-31T12:00:00.000Z")).toBe("2025.12.31");
  });

  // 2. 에지 케이스 - 코드의 2번 줄 (if (!value) return "-")
  it("null이면 '-'를 반환해야 함", () => {
    expect(formatDate(null)).toBe("-");
  });

  it("빈 문자열이면 '-'를 반환해야 함", () => {
    expect(formatDate("")).toBe("-");
  });

  it("유효하지 않은 날짜 형식이면 '-'를 반환해야 함", () => {
    expect(formatDate("invalid-date")).toBe("-");
    expect(formatDate("2026-13-45")).toBe("-");
    expect(formatDate("2026-00-50")).toBe("-");
    expect(formatDate("2026-1-32")).toBe("-");
  });
});
