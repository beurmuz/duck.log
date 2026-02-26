import { describe, it, expect } from "vitest";
import { transformBlocks } from "@/lib/notion/transforms";
import type { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type {
  HeadingBlock,
  ParagraphBlock,
  CodeBlock,
  ImageBlock,
  CalloutBlock,
  ToDoBlock,
  BookmarkBlock,
} from "@/models/block";

// Mock 데이터 생성 헬퍼 함수들
function createMockRichTextItem(
  plainText: string,
  annotations = {},
  href: string | null = null,
) {
  return {
    type: "text" as const,
    text: { content: plainText },
    plain_text: plainText,
    href,
    annotations: {
      bold: false,
      italic: false,
      underline: false,
      strikethrough: false,
      code: false,
      color: "default",
      ...annotations,
    },
  };
}

function createBaseBlock(id: string, type: string, hasChildren = false) {
  return {
    object: "block" as const,
    id,
    type: type as BlockObjectResponse["type"],
    created_time: "2026-01-01T00:00:00.000Z",
    last_edited_time: "2026-01-01T00:00:00.000Z",
    created_by: { object: "user" as const, id: "user-id" },
    last_edited_by: { object: "user" as const, id: "user-id" },
    has_children: hasChildren,
    parent: {
      type: "page_id" as const,
      page_id: "parent-page-id",
    },
    archived: false,
    in_trash: false,
  };
}

// 블록 생성 헬퍼 함수
function createHeadingBlock(
  id: string,
  level: 1 | 2 | 3,
  text: string,
): BlockObjectResponse {
  const headingKey = `heading_${level}` as const;
  return {
    ...createBaseBlock(id, headingKey),
    [headingKey]: {
      rich_text: [createMockRichTextItem(text)],
    },
  } as unknown as BlockObjectResponse;
}

function createParagraphBlock(id: string, text: string): BlockObjectResponse {
  return {
    ...createBaseBlock(id, "paragraph"),
    paragraph: {
      rich_text: [createMockRichTextItem(text)],
    },
  } as unknown as BlockObjectResponse;
}

function createCodeBlock(
  id: string,
  code: string,
  language: string | null = "javascript",
  caption: string = "",
): BlockObjectResponse {
  return {
    ...createBaseBlock(id, "code"),
    code: {
      rich_text: [createMockRichTextItem(code)],
      language,
      caption: caption ? [createMockRichTextItem(caption)] : [],
    },
  } as unknown as BlockObjectResponse;
}

function createImageBlock(
  id: string,
  url: string,
  type: "file" | "external" = "external",
  caption: string = "",
): BlockObjectResponse {
  return {
    ...createBaseBlock(id, "image"),
    image: {
      type,
      ...(type === "file"
        ? {
            file: {
              url,
              expiry_time: "2026-01-01T00:00:00.000Z",
            },
          }
        : { external: { url } }),
      caption: caption ? [createMockRichTextItem(caption)] : [],
    },
  } as unknown as BlockObjectResponse;
}

function createVideoBlock(
  id: string,
  url: string,
  type: "file" | "external" = "external",
): BlockObjectResponse {
  return {
    ...createBaseBlock(id, "video"),
    video: {
      type,
      ...(type === "file"
        ? {
            file: {
              url,
              expiry_time: "2026-01-01T00:00:00.000Z",
            },
          }
        : { external: { url } }),
      caption: [],
    },
  } as unknown as BlockObjectResponse;
}

function createCalloutBlock(
  id: string,
  text: string,
  icon: string | null = "💡",
): BlockObjectResponse {
  return {
    ...createBaseBlock(id, "callout"),
    callout: {
      rich_text: [createMockRichTextItem(text)],
      icon: icon
        ? {
            type: "emoji" as const,
            emoji: icon,
          }
        : null,
    },
  } as unknown as BlockObjectResponse;
}

function createToDoBlock(
  id: string,
  text: string,
  checked: boolean | null = false,
): BlockObjectResponse {
  return {
    ...createBaseBlock(id, "to_do"),
    to_do: {
      rich_text: [createMockRichTextItem(text)],
      checked,
    },
  } as unknown as BlockObjectResponse;
}

function createBookmarkBlock(
  id: string,
  url: string,
  caption: string = "",
): BlockObjectResponse {
  return {
    ...createBaseBlock(id, "bookmark"),
    bookmark: {
      url,
      caption: caption ? [createMockRichTextItem(caption)] : [],
    },
  } as unknown as BlockObjectResponse;
}

describe("transformBlocks", () => {
  it("빈 배열을 처리해야 함", () => {
    expect(transformBlocks([])).toEqual([]);
  });

  describe("RichText annotations 변환", () => {
    it("bold annotation을 올바르게 변환해야 함", () => {
      const block: BlockObjectResponse = {
        ...createBaseBlock("block-18", "paragraph"),
        paragraph: {
          rich_text: [createMockRichTextItem("굵은 텍스트", { bold: true })],
        },
      } as unknown as BlockObjectResponse;

      const result = transformBlocks([block]);
      const paragraphBlock = result[0] as ParagraphBlock;
      expect(paragraphBlock.richText[0].annotations.bold).toBe(true);
    });

    it("여러 annotations를 올바르게 변환해야 함", () => {
      const block: BlockObjectResponse = {
        ...createBaseBlock("block-19", "paragraph"),
        paragraph: {
          rich_text: [
            createMockRichTextItem("텍스트", {
              bold: true,
              italic: true,
              underline: true,
              strikethrough: true,
              code: true,
            }),
          ],
        },
      } as unknown as BlockObjectResponse;

      const result = transformBlocks([block]);
      const paragraphBlock = result[0] as ParagraphBlock;
      const resultAnnotations = paragraphBlock.richText[0].annotations;

      expect(resultAnnotations.bold).toBe(true);
      expect(resultAnnotations.italic).toBe(true);
      expect(resultAnnotations.underline).toBe(true);
      expect(resultAnnotations.strikethrough).toBe(true);
      expect(resultAnnotations.code).toBe(true);
    });

    it("href가 있는 RichText를 올바르게 변환해야 함", () => {
      const block: BlockObjectResponse = {
        ...createBaseBlock("block-20", "paragraph"),
        paragraph: {
          rich_text: [
            createMockRichTextItem("링크 텍스트", {}, "https://example.com"),
          ],
        },
      } as unknown as BlockObjectResponse;

      const result = transformBlocks([block]);
      const paragraphBlock = result[0] as ParagraphBlock;

      expect(paragraphBlock.richText[0].href).toBe("https://example.com");
    });
  });

  describe("parent 정보 추출", () => {
    it.each([
      ["page_id", "page", "page-123"],
      ["block_id", "block", "block-123"],
    ])(
      "%s parent를 올바르게 추출해야 함",
      (parentType, expectedType, expectedId) => {
        const block: BlockObjectResponse = {
          ...createBaseBlock("block-21", "paragraph"),
          paragraph: {
            rich_text: [createMockRichTextItem("텍스트")],
          },
          parent: {
            type: parentType as "page_id" | "block_id",
            [parentType]: expectedId,
          } as unknown as BlockObjectResponse["parent"],
        } as unknown as BlockObjectResponse;

        const result = transformBlocks([block]);
        expect(result[0].parentType).toBe(expectedType);
        expect(result[0].parentId).toBe(expectedId);
      },
    );

    it("parent가 없으면 null을 반환해야 함", () => {
      const block: BlockObjectResponse = {
        ...createBaseBlock("block-23", "paragraph"),
        paragraph: {
          rich_text: [createMockRichTextItem("텍스트")],
        },
        parent: null as unknown as BlockObjectResponse["parent"],
      } as unknown as BlockObjectResponse;

      const result = transformBlocks([block]);
      expect(result[0].parentType).toBeNull();
      expect(result[0].parentId).toBeNull();
    });
  });

  describe("hasChildren 처리", () => {
    it.each([
      [true, "true인"],
      [false, "false인"],
    ])("has_children가 %s 블록을 올바르게 처리해야 함", (hasChildren) => {
      const block: BlockObjectResponse = {
        ...createBaseBlock("block-24", "paragraph", hasChildren),
        paragraph: {
          rich_text: [createMockRichTextItem("텍스트")],
        },
      } as unknown as BlockObjectResponse;

      const result = transformBlocks([block]);
      expect(result[0].hasChildren).toBe(hasChildren);
    });
  });

  describe("heading 블록 변환", () => {
    it.each([
      ["heading_1", 1, "제목 1"],
      ["heading_2", 2, "제목 2"],
      ["heading_3", 3, "제목 3"],
    ])("%s 블록을 올바르게 변환해야 함", (type, level, text) => {
      const block = createHeadingBlock(
        `block-${level}`,
        level as 1 | 2 | 3,
        text,
      );
      const result = transformBlocks([block]);
      const headingBlock = result[0] as HeadingBlock;

      expect(headingBlock).toMatchObject({
        type,
        level,
        parentType: "page",
        parentId: "parent-page-id",
        hasChildren: false,
      });
      expect(headingBlock.richText[0].plainText).toBe(text);
    });
  });

  describe("paragraph 블록 변환", () => {
    it("paragraph 블록을 올바르게 변환해야 함", () => {
      const block = createParagraphBlock("block-4", "문단 텍스트");
      const result = transformBlocks([block]);
      const paragraphBlock = result[0] as ParagraphBlock;

      expect(paragraphBlock).toMatchObject({
        type: "paragraph",
        richText: [{ plainText: "문단 텍스트" }],
      });
    });
  });

  describe("code 블록 변환", () => {
    it("code 블록을 올바르게 변환해야 함", () => {
      const block = createCodeBlock(
        "block-5",
        "console.log('hello')",
        "javascript",
        "코드 설명",
      );
      const result = transformBlocks([block]);
      const codeBlock = result[0] as CodeBlock;

      expect(codeBlock).toMatchObject({
        type: "code",
        language: "javascript",
      });
      expect(codeBlock.richText[0].plainText).toBe("console.log('hello')");
      expect(codeBlock.caption[0].plainText).toBe("코드 설명");
    });

    it("language가 없으면 'plain text'를 기본값으로 사용해야 함", () => {
      const block = createCodeBlock("block-6", "code", null);
      const result = transformBlocks([block]);
      const codeBlock = result[0] as CodeBlock;

      expect(codeBlock.language).toBe("plain text");
    });
  });

  describe("image 블록 변환", () => {
    it.each([
      ["file", "https://example.com/image.jpg", "이미지 설명"],
      ["external", "https://external.com/image.jpg", ""],
    ])("%s 타입 image 블록을 올바르게 변환해야 함", (type, url, caption) => {
      const block = createImageBlock(
        `block-${type}`,
        url,
        type as "file" | "external",
        caption,
      );
      const result = transformBlocks([block]);
      const imageBlock = result[0] as ImageBlock;

      expect(imageBlock).toMatchObject({
        type: "image",
        url,
      });
      if (caption) {
        expect(imageBlock.caption[0].plainText).toBe(caption);
      }
    });
  });

  describe("divider 블록 변환", () => {
    it("divider 블록을 올바르게 변환해야 함", () => {
      const block: BlockObjectResponse = {
        ...createBaseBlock("block-9", "divider"),
        divider: {},
      } as unknown as BlockObjectResponse;

      const result = transformBlocks([block]);
      expect(result[0]).toMatchObject({
        type: "divider",
      });
    });
  });

  describe("callout 블록 변환", () => {
    it("emoji 아이콘이 있는 callout 블록을 올바르게 변환해야 함", () => {
      const block = createCalloutBlock("block-10", "중요한 정보", "💡");
      const result = transformBlocks([block]);
      const calloutBlock = result[0] as CalloutBlock;

      expect(calloutBlock).toMatchObject({
        type: "callout",
        icon: "💡",
      });
      expect(calloutBlock.richText[0].plainText).toBe("중요한 정보");
    });

    it("아이콘이 없으면 null을 반환해야 함", () => {
      const block = createCalloutBlock("block-11", "텍스트", null);
      const result = transformBlocks([block]);
      const calloutBlock = result[0] as CalloutBlock;

      expect(calloutBlock.icon).toBeNull();
    });
  });

  describe("to_do 블록 변환", () => {
    it.each([
      [true, "완료된 작업"],
      [false, "미완료 작업"],
      [null, "작업"],
    ])("checked가 %s인 to_do 블록을 올바르게 변환해야 함", (checked, text) => {
      const block = createToDoBlock(`block-${checked}`, text, checked);
      const result = transformBlocks([block]);
      const toDoBlock = result[0] as ToDoBlock;

      expect(toDoBlock).toMatchObject({
        type: "to_do",
        checked: checked ?? false,
      });
    });
  });

  describe("bookmark 블록 변환", () => {
    it("bookmark 블록을 올바르게 변환해야 함", () => {
      const block = createBookmarkBlock(
        "block-15",
        "https://example.com",
        "북마크 설명",
      );
      const result = transformBlocks([block]);
      const bookmarkBlock = result[0] as BookmarkBlock;

      expect(bookmarkBlock).toMatchObject({
        type: "bookmark",
        url: "https://example.com",
      });
      expect(bookmarkBlock.caption[0].plainText).toBe("북마크 설명");
    });
  });

  describe("video 블록 변환", () => {
    it.each([
      ["file", "https://example.com/video.mp4"],
      ["external", "https://youtube.com/watch?v=abc123"],
    ])("%s 타입 video 블록을 올바르게 변환해야 함", (type, url) => {
      const block = createVideoBlock(
        `block-${type}`,
        url,
        type as "file" | "external",
      );
      const result = transformBlocks([block]);

      expect(result[0]).toMatchObject({
        type: "video",
        url,
      });
    });
  });

  describe("여러 블록 변환", () => {
    it("여러 블록을 한 번에 변환해야 함", () => {
      const blocks = [
        createHeadingBlock("block-1", 1, "제목"),
        createParagraphBlock("block-2", "문단"),
        {
          ...createBaseBlock("block-3", "divider"),
          divider: {},
        } as unknown as BlockObjectResponse,
      ];

      const result = transformBlocks(blocks);
      expect(result).toHaveLength(3);
      expect(result[0].type).toBe("heading_1");
      expect(result[1].type).toBe("paragraph");
      expect(result[2].type).toBe("divider");
    });
  });
});
