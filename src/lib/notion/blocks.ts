import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { RichText, NotionBlock } from "@/models/block";

// ============================================
// Notion API → 도메인 모델 변환 함수
// ============================================

// RichText 변환
function transformRichText(richTextItems: RichTextItemResponse[]): RichText[] {
  return richTextItems.map((item) => ({
    plainText: item.plain_text,
    href: item.href ?? null,
    annotations: {
      bold: item.annotations.bold ?? false,
      italic: item.annotations.italic ?? false,
      underline: item.annotations.underline ?? false,
      strikethrough: item.annotations.strikethrough ?? false,
      code: item.annotations.code ?? false,
    },
  }));
}

// Block의 parent 정보 추출
function extractParentInfo(block: BlockObjectResponse): {
  parentType: "page" | "block" | null;
  parentId: string | null;
} {
  if (!block.parent) {
    return { parentType: null, parentId: null };
  }

  if ("page_id" in block.parent) {
    return { parentType: "page", parentId: block.parent.page_id };
  }

  if ("block_id" in block.parent) {
    return { parentType: "block", parentId: block.parent.block_id };
  }

  return { parentType: null, parentId: null };
}

// BlockObjectResponse를 도메인 모델로 변환
export function transformBlock(block: BlockObjectResponse): NotionBlock | null {
  const baseInfo = {
    id: block.id,
    hasChildren: block.has_children ?? false,
    ...extractParentInfo(block),
  };

  switch (block.type) {
    case "heading_1": {
      return {
        ...baseInfo,
        type: "heading_1",
        level: 1,
        richText: transformRichText(block.heading_1.rich_text),
      };
    }
    case "heading_2": {
      return {
        ...baseInfo,
        type: "heading_2",
        level: 2,
        richText: transformRichText(block.heading_2.rich_text),
      };
    }
    case "heading_3": {
      return {
        ...baseInfo,
        type: "heading_3",
        level: 3,
        richText: transformRichText(block.heading_3.rich_text),
      };
    }
    case "paragraph": {
      return {
        ...baseInfo,
        type: "paragraph",
        richText: transformRichText(block.paragraph.rich_text),
      };
    }
    case "bulleted_list_item": {
      return {
        ...baseInfo,
        type: "bulleted_list_item",
        richText: transformRichText(block.bulleted_list_item.rich_text),
      };
    }
    case "numbered_list_item": {
      return {
        ...baseInfo,
        type: "numbered_list_item",
        richText: transformRichText(block.numbered_list_item.rich_text),
      };
    }
    case "quote": {
      return {
        ...baseInfo,
        type: "quote",
        richText: transformRichText(block.quote.rich_text),
      };
    }
    case "code": {
      return {
        ...baseInfo,
        type: "code",
        richText: transformRichText(block.code.rich_text),
        language: block.code.language || "plain text",
        caption: transformRichText(block.code.caption ?? []),
      };
    }
    case "image": {
      const imageUrl =
        block.image.type === "file"
          ? block.image.file.url
          : block.image.external.url;
      return {
        ...baseInfo,
        type: "image",
        url: imageUrl,
        caption: transformRichText(block.image.caption ?? []),
      };
    }
    case "divider": {
      return {
        ...baseInfo,
        type: "divider",
      };
    }
    case "callout": {
      const icon =
        block.callout.icon && block.callout.icon.type === "emoji"
          ? block.callout.icon.emoji
          : null;
      return {
        ...baseInfo,
        type: "callout",
        richText: transformRichText(block.callout.rich_text),
        icon,
      };
    }
    case "to_do": {
      return {
        ...baseInfo,
        type: "to_do",
        richText: transformRichText(block.to_do.rich_text),
        checked: block.to_do.checked ?? false,
      };
    }
    case "toggle": {
      return {
        ...baseInfo,
        type: "toggle",
        richText: transformRichText(block.toggle.rich_text),
      };
    }
    case "table": {
      return {
        ...baseInfo,
        type: "table",
      };
    }
    case "table_row": {
      return {
        ...baseInfo,
        type: "table_row",
        cells: block.table_row.cells.map((cell) => transformRichText(cell)),
      };
    }
    case "equation": {
      return {
        ...baseInfo,
        type: "equation",
        expression: block.equation.expression,
      };
    }
    default:
      return null;
  }
}

// Block 배열 변환
export function transformBlocks(blocks: BlockObjectResponse[]): NotionBlock[] {
  return blocks
    .map((block) => transformBlock(block))
    .filter((block): block is NotionBlock => block !== null);
}

