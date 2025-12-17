import type {
  RichTextItemResponse,
  BlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { RichText, BaseBlock, NotionBlock } from "@/models/block";

// Notion API의 Block Object Response -> Domain Model 변환 함수

// 1. RichTextItemResponse -> RichText Model로 변환
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

// 2. BlockObjectResponse -> NotionBlock으로 전환

// 2-1. block의 parent 정보 추출
function extractParentInfo(block: BlockObjectResponse): {
  parentType: "page" | "block" | null;
  parentId: string | null;
} {
  if (!block.parent) return { parentType: null, parentId: null };
  if ("page_id" in block.parent)
    return { parentType: "page", parentId: block.parent.page_id };
  if ("block_id" in block.parent)
    return { parentType: "block", parentId: block.parent.block_id };
  return { parentType: null, parentId: null };
}

// 2-2. block의 공통 정보 추출
function extractBaseInfo(block: BlockObjectResponse): BaseBlock {
  return {
    id: block.id,
    hasChildren: block.has_children ?? false,
    ...extractParentInfo(block),
  };
}

// 2-3. 개별 block 변환 함수
function transformBlock(block: BlockObjectResponse): NotionBlock | null {
  const baseInfo = extractBaseInfo(block);

  // block의 type에 따라 변환
  switch (block.type) {
    case "heading_1": {
      return {
        ...baseInfo,
        type: "heading_1" as const,
        level: 1,
        richText: transformRichText(block.heading_1.rich_text),
      };
    }
    case "heading_2": {
      return {
        ...baseInfo,
        type: "heading_2" as const,
        level: 2,
        richText: transformRichText(block.heading_2.rich_text),
      };
    }
    case "heading_3": {
      return {
        ...baseInfo,
        type: "heading_3" as const,
        level: 3,
        richText: transformRichText(block.heading_3.rich_text),
      };
    }
    case "paragraph": {
      return {
        ...baseInfo,
        type: "paragraph" as const,
        richText: transformRichText(block.paragraph.rich_text),
      };
    }
    case "bulleted_list_item": {
      return {
        ...baseInfo,
        type: "bulleted_list_item" as const,
        richText: transformRichText(block.bulleted_list_item.rich_text),
      };
    }
    case "numbered_list_item": {
      return {
        ...baseInfo,
        type: "numbered_list_item" as const,
        richText: transformRichText(block.numbered_list_item.rich_text),
      };
    }
    case "quote": {
      return {
        ...baseInfo,
        type: "quote" as const,
        richText: transformRichText(block.quote.rich_text),
      };
    }
    case "code": {
      return {
        ...baseInfo,
        type: "code" as const,
        richText: transformRichText(block.code.rich_text),
        language: block.code.language || "plain text",
        caption: transformRichText(block.code.caption ?? []),
      };
    }
    case "image": {
      return {
        ...baseInfo,
        type: "image" as const,
        url:
          block.image.type === "file"
            ? block.image.file.url
            : block.image.external.url,
        caption: transformRichText(block.image.caption ?? []),
      };
    }
    case "divider": {
      return {
        ...baseInfo,
        type: "divider" as const,
      };
    }
    case "callout": {
      return {
        ...baseInfo,
        type: "callout" as const,
        richText: transformRichText(block.callout.rich_text),
        icon:
          block.callout.icon && block.callout.icon.type === "emoji"
            ? block.callout.icon.emoji
            : null,
      };
    }
    case "to_do": {
      return {
        ...baseInfo,
        type: "to_do" as const,
        richText: transformRichText(block.to_do.rich_text),
        checked: block.to_do.checked ?? false,
      };
    }
    case "toggle": {
      return {
        ...baseInfo,
        type: "toggle" as const,
        richText: transformRichText(block.toggle.rich_text),
      };
    }
    case "table": {
      return {
        ...baseInfo,
        type: "table" as const,
      };
    }
    case "table_row": {
      return {
        ...baseInfo,
        type: "table_row" as const,
        cells: block.table_row.cells.map((cell) => transformRichText(cell)),
      };
    }
    case "equation": {
      return {
        ...baseInfo,
        type: "equation" as const,
        expression: block.equation.expression,
      };
    }
    case "bookmark": {
      return {
        ...baseInfo,
        type: "bookmark" as const,
        url: block.bookmark.url,
        caption: transformRichText(block.bookmark.caption ?? []),
      };
    }
    case "video": {
      return {
        ...baseInfo,
        type: "video" as const,
        url:
          block.video.type === "file"
            ? block.video.file.url
            : block.video.external.url,
        caption: transformRichText(block.video.caption ?? []),
      };
    }
    default: {
      return null;
    }
  }
}

// 3. Blcok 배열을 NotionBlock 배열로 변환
export function transformBlocks(blocks: BlockObjectResponse[]): NotionBlock[] {
  return blocks
    .map((block) => transformBlock(block))
    .filter((block): block is NotionBlock => block !== null);
}
