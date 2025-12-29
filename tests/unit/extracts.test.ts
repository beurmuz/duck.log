import { describe, it, expect } from "vitest";
import {
  extractTitle,
  extractCategories,
  extractDateValue,
  extractCheckboxValue,
  extractTextValue,
} from "@/lib/notion/extracts";
import type { PropertyMap } from "@/lib/notion/types";

// 제목 추출 테스트 (map -> join -> trim)
describe("extractTitle", () => {
  it("title을 올바르게 추출해야 함", () => {
    const properties: PropertyMap = {
      title: {
        type: "title",
        title: [{ plain_text: "테스트 제목" }],
      },
    };
    expect(extractTitle(properties)).toBe("테스트 제목");
  });

  it("여러 개의 title을 공백으로 연결해야 함", () => {
    const properties: PropertyMap = {
      title: {
        type: "title",
        title: [{ plain_text: "첫 번째 제목" }, { plain_text: "두 번째 제목" }],
      },
    };
    expect(extractTitle(properties)).toBe("첫 번째 제목 두 번째 제목");
  });

  it("앞 뒤 공백을 제거해야 함", () => {
    const properties: PropertyMap = {
      title: {
        type: "title",
        title: [{ plain_text: "  공백이 있는 제목  " }],
      },
    };
    expect(extractTitle(properties)).toBe("공백이 있는 제목");
  });

  it("title이 없으면 빈 문자열을 반환해야 함", () => {
    const properties: PropertyMap = {};
    expect(extractTitle(properties)).toBe("");
  });
});

// 카테고리 추출 테스트
describe("extractCategories", () => {
  it("categories를 올바르게 추출해야 함", () => {
    const properties: PropertyMap = {
      category: {
        type: "multi_select",
        multi_select: [{ name: "Web" }, { name: "CS" }],
      },
    };
    expect(extractCategories(properties)).toEqual(["Web", "CS"]);
  });

  it("categories가 없으면 빈 배열을 반환해야 함", () => {
    const properties: PropertyMap = {};
    expect(extractCategories(properties)).toEqual([]);
  });

  it("categories가 빈 배열이면 빈 배열을 반환해야 함", () => {
    const properties: PropertyMap = {
      category: {
        type: "multi_select",
        multi_select: [],
      },
    };
    expect(extractCategories(properties)).toEqual([]);
  });
});

// 날짜 추출 테스트
describe("extractDateValue", () => {
  it("createdDate를 올바르게 추출해야 함", () => {
    const properties: PropertyMap = {
      createdDate: {
        type: "date",
        date: { start: "2025-12-30" },
      },
    };
    expect(extractDateValue(properties, "createdDate")).toBe("2025-12-30");
  });

  it("updatedDate를 올바르게 추출해야 함", () => {
    const properties: PropertyMap = {
      updatedDate: {
        type: "date",
        date: { start: "2025-12-31" },
      },
    };
    expect(extractDateValue(properties, "updatedDate")).toBe("2025-12-31");
  });

  it("date 필드가 없으면 null을 반환해야 함", () => {
    const properties: PropertyMap = {};
    expect(extractDateValue(properties, "createdDate")).toBeNull();
  });

  it("type이 date가 아니면 null을 반환해야 함", () => {
    const properties: PropertyMap = {
      createdDate: { type: "text" },
    };
    expect(extractDateValue(properties, "createdDate")).toBeNull();
  });

  it("date가 null이면 null을 반환해야 함", () => {
    const properties: PropertyMap = {
      createdDate: {
        type: "date",
        date: null,
      },
    };
    expect(extractDateValue(properties, "createdDate")).toBeNull();
  });

  it("date.start가 null이면 null을 반환해야 함", () => {
    const properties: PropertyMap = {
      createdDate: {
        type: "date",
        date: { start: null },
      },
    };
    expect(extractDateValue(properties, "createdDate")).toBeNull();
  });
});

// 체크박스 추출 테스트
describe("extractCheckboxValue", () => {
  it("published가 true이면 true를 반환해야 함", () => {
    const properties: PropertyMap = {
      published: {
        type: "checkbox",
        checkbox: true,
      },
    };
    expect(extractCheckboxValue(properties)).toBe(true);
  });

  it("published가 false이면 false를 반환해야 함", () => {
    const properties: PropertyMap = {
      published: {
        type: "checkbox",
        checkbox: false,
      },
    };
    expect(extractCheckboxValue(properties)).toBe(false);
  });

  it("published 필드가 없으면 false를 반환해야 함", () => {
    const properties: PropertyMap = {};
    expect(extractCheckboxValue(properties)).toBe(false);
  });

  it("checkbox가 undefined이면 false를 반환해야 함", () => {
    const properties: PropertyMap = {
      published: { type: "checkbox" },
    };
    expect(extractCheckboxValue(properties)).toBe(false);
  });
});

// 텍스트 추출 테스트
describe("extractTextValue", () => {
  it("slug를 올바르게 추출해야 함", () => {
    const properties: PropertyMap = {
      slug: {
        type: "rich_text",
        rich_text: [{ plain_text: "test-slug" }],
      },
    };
    expect(extractTextValue(properties, "slug")).toBe("test-slug");
  });

  it("rich_text가 여러 개일 때 첫 번째만 추출해야 함", () => {
    const properties: PropertyMap = {
      slug: {
        type: "rich_text",
        rich_text: [{ plain_text: "첫 번째" }, { plain_text: "두 번째" }],
      },
    };
    expect(extractTextValue(properties, "slug")).toBe("첫 번째");
  });

  it("필드가 없으면 null을 반환해야 함", () => {
    const properties: PropertyMap = {};
    expect(extractTextValue(properties, "slug")).toBeNull();
  });

  it("rich_text가 없으면 null을 반환해야 함", () => {
    const properties: PropertyMap = {
      slug: { type: "rich_text" },
    };
    expect(extractTextValue(properties, "slug")).toBeNull();
  });

  it("rich_text가 빈 배열이면 null을 반환해야 함", () => {
    const properties: PropertyMap = {
      slug: {
        type: "rich_text",
        rich_text: [],
      },
    };
    expect(extractTextValue(properties, "slug")).toBeNull();
  });

  it("앞뒤 공백을 제거해야 함", () => {
    const properties: PropertyMap = {
      slug: {
        type: "rich_text",
        rich_text: [{ plain_text: "  test-slug  " }],
      },
    };
    expect(extractTextValue(properties, "slug")).toBe("test-slug");
  });

  it("plain_text가 undefined이면 null을 반환해야 함", () => {
    const properties: PropertyMap = {
      slug: {
        type: "rich_text",
        rich_text: [{}],
      },
    };
    expect(extractTextValue(properties, "slug")).toBeNull();
  });
});
