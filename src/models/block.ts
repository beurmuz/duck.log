// RichText Model - text 내용, formatting 정보를 담는 model
export interface RichText {
  plainText: string; // text 내용
  href: string | null; // 링크 url
  annotations: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    code: boolean;
  };
}

// BaseBlock - 모든 block의 공통 속성 정의
export interface BaseBlock {
  id: string;
  hasChildren: boolean;
  parentType: "page" | "block" | null;
  parentId: string | null;
}

// 각 type별 block model 정의
// 1. Heading Block
export interface HeadingBlock extends BaseBlock {
  type: "heading_1" | "heading_2" | "heading_3";
  level: 1 | 2 | 3;
  richText: RichText[];
}

// 2. Paragraph Block
export interface ParagraphBlock extends BaseBlock {
  type: "paragraph";
  richText: RichText[];
}

// 3. Bulleted List Item Block
export interface BulletedListItemBlock extends BaseBlock {
  type: "bulleted_list_item";
  richText: RichText[];
}

// 4. Numbered List Item Block
export interface NumberedListItemBlock extends BaseBlock {
  type: "numbered_list_item";
  richText: RichText[];
}

// 5. Quote Block
export interface QuoteBlock extends BaseBlock {
  type: "quote";
  richText: RichText[];
}

// 6. Code Block
export interface CodeBlock extends BaseBlock {
  type: "code";
  richText: RichText[];
  language: string;
  caption: RichText[];
}

// 7. Image Block
export interface ImageBlock extends BaseBlock {
  type: "image";
  url: string;
  caption: RichText[];
}

// 8. Divider Block
export interface DividerBlock extends BaseBlock {
  type: "divider";
}

// 9. Callout Block
export interface CalloutBlock extends BaseBlock {
  type: "callout";
  richText: RichText[];
  icon: string | null;
}

// 10. ToDo Block
export interface ToDoBlock extends BaseBlock {
  type: "to_do";
  richText: RichText[];
  checked: boolean;
}

// 11. Toggle Block
export interface ToggleBlock extends BaseBlock {
  type: "toggle";
  richText: RichText[];
}

// 12-1. Table Block
export interface TableBlock extends BaseBlock {
  type: "table";
}

// 12-2. Table Row Block
export interface TableRowBlock extends BaseBlock {
  type: "table_row";
  cells: RichText[][];
}

// 13. Equation Block
export interface EquationBlock extends BaseBlock {
  type: "equation";
  expression: string;
}

// 14. Bookmark Block (링크 미리보기)
export interface BookmarkBlock extends BaseBlock {
  type: "bookmark";
  url: string;
  caption: RichText[];
}

// 15. Video Block (YouTube, Vimeo 등)
export interface VideoBlock extends BaseBlock {
  type: "video";
  url: string;
  caption: RichText[];
}

// 모든 Block Type 정의
export type NotionBlock =
  | HeadingBlock
  | ParagraphBlock
  | BulletedListItemBlock
  | NumberedListItemBlock
  | QuoteBlock
  | CodeBlock
  | ImageBlock
  | DividerBlock
  | CalloutBlock
  | ToDoBlock
  | ToggleBlock
  | TableBlock
  | TableRowBlock
  | EquationBlock
  | BookmarkBlock
  | VideoBlock;