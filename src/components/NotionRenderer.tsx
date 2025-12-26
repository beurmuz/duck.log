/* eslint-disable @next/next/no-img-element */
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./NotionRenderer.module.css";
import classNames from "classnames/bind";
import type {
  NotionBlock,
  RichText,
  HeadingBlock,
  ParagraphBlock,
  BulletedListItemBlock,
  NumberedListItemBlock,
  QuoteBlock,
  CodeBlock,
  ImageBlock,
  CalloutBlock,
  ToDoBlock,
  ToggleBlock,
  TableRowBlock,
  EquationBlock,
  BookmarkBlock,
  VideoBlock,
} from "@/models/block";
import React from "react";

const cx = classNames.bind(styles);

// rich text를 plain text로 변환하는 함수
const renderRichTextToPlainText = (texts: RichText[]) =>
  texts.map((text) => text.plainText).join("");

// rich text를 React 요소로 렌더링하는 함수 (폰트 속성 적용)
const renderRichTextToReactElement = (texts: RichText[]) => {
  return texts.map((text, idx) => {
    const { annotations, plainText, href } = text;
    const style: React.CSSProperties = {};
    let content: React.ReactNode = plainText;

    if (annotations.bold) style.fontWeight = "bold";
    if (annotations.italic) style.fontStyle = "italic";
    if (annotations.underline) style.textDecoration = "underline";
    if (annotations.strikethrough) style.textDecoration = "line-through";
    if (annotations.code)
      content = <code className={cx("inline-code")}>{plainText}</code>;

    if (href) {
      content = (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={cx("link")}
        >
          {content}
        </a>
      );
    }

    // 기본 span 요소로 렌더링
    return (
      <span key={idx} style={style}>
        {content}
      </span>
    );
  });
};

// Block의 type에 따라 렌더링하는 함수
const renderBlockByType = (
  block: NotionBlock,
  allBlocks: NotionBlock[]
): React.ReactNode => {
  const childrenList = allBlocks.filter(
    (b) => b.parentType === "block" && b.parentId === block.id
  );

  // block의 type에 따라 렌더링
  switch (block.type) {
    // 1. Heading Block
    case "heading_1": {
      const headingBlock = block as HeadingBlock;
      return (
        <h1 key={block.id} className={cx(["heading", "heading1"])}>
          {renderRichTextToReactElement(headingBlock.richText)}
        </h1>
      );
    }
    case "heading_2": {
      const headingBlock = block as HeadingBlock;
      return (
        <h2 key={block.id} className={cx(["heading", "heading2"])}>
          {renderRichTextToReactElement(headingBlock.richText)}
        </h2>
      );
    }
    case "heading_3": {
      const headingBlock = block as HeadingBlock;
      return (
        <h3 key={block.id} className={cx(["heading", "heading3"])}>
          {renderRichTextToReactElement(headingBlock.richText)}
        </h3>
      );
    }
    // 2. Paragraph Block
    case "paragraph": {
      const paragraphBlock = block as ParagraphBlock;
      return (
        <div key={block.id} className={cx("paragraph")}>
          {renderRichTextToReactElement(paragraphBlock.richText)}
        </div>
      );
    }
    // 3. Bulleted List Item Block
    case "bulleted_list_item": {
      const listBlock = block as BulletedListItemBlock;
      const bulletedChildren = childrenList.filter(
        (b) => b.type === "bulleted_list_item"
      ) as BulletedListItemBlock[];
      const numberedChildren = childrenList.filter(
        (b) => b.type === "numbered_list_item"
      ) as NumberedListItemBlock[];

      return (
        <li key={block.id} className={cx("bulleted-list-item")}>
          {renderRichTextToReactElement(listBlock.richText)}
          {bulletedChildren.length > 0 && (
            <ul className={cx("bulleted-list")}>
              {bulletedChildren.map((child) =>
                renderBlockByType(child, allBlocks)
              )}
            </ul>
          )}
          {numberedChildren.length > 0 && (
            <ol className={cx("numbered-list")}>
              {numberedChildren.map((child) =>
                renderBlockByType(child, allBlocks)
              )}
            </ol>
          )}
        </li>
      );
    }
    // 4. Numbered List Item Block
    case "numbered_list_item": {
      const listBlock = block as NumberedListItemBlock;
      const numberedChildren = childrenList.filter(
        (b) => b.type === "numbered_list_item"
      ) as NumberedListItemBlock[];
      const bulletedChildren = childrenList.filter(
        (b) => b.type === "bulleted_list_item"
      ) as BulletedListItemBlock[];

      return (
        <li key={block.id} className={cx("numbered-list-item")}>
          {renderRichTextToReactElement(listBlock.richText)}
          {numberedChildren.length > 0 && (
            <ol className={cx("numbered-list")}>
              {numberedChildren.map((child) =>
                renderBlockByType(child, allBlocks)
              )}
            </ol>
          )}
          {bulletedChildren.length > 0 && (
            <ul className={cx("bulleted-list")}>
              {bulletedChildren.map((child) =>
                renderBlockByType(child, allBlocks)
              )}
            </ul>
          )}
        </li>
      );
    }
    // 5. Quote Block
    case "quote": {
      const quoteBlock = block as QuoteBlock;
      return (
        <blockquote key={block.id} className={cx("quote")}>
          {renderRichTextToReactElement(quoteBlock.richText)}
          {childrenList.length > 0 && (
            <div className={cx("quote-children")}>
              {childrenList.map((child) => renderBlockByType(child, allBlocks))}
            </div>
          )}
        </blockquote>
      );
    }
    // 6. Code Block
    case "code": {
      const codeBlock = block as CodeBlock;
      const language = codeBlock.language || "plain text";
      const codeText = renderRichTextToPlainText(codeBlock.richText);

      // Notion 언어 코드를 react-syntax-highlighter가 인식할 수 있는 형식으로 변환
      const mapLanguage = (lang: string): string => {
        const langMap: Record<string, string> = {
          "plain text": "text",
          javascript: "javascript",
          typescript: "typescript",
          jsx: "jsx",
          tsx: "tsx",
          python: "python",
          java: "java",
          c: "c",
          css: "css",
          html: "html",
          json: "json",
          markdown: "markdown",
          sql: "sql",
          bash: "bash",
          shell: "bash",
          yaml: "yaml",
          yml: "yaml",
          powershell: "powershell",
        };
        return langMap[lang.toLowerCase()] || lang.toLowerCase();
      };

      const mappedLanguage =
        language === "plain text" ? "text" : mapLanguage(language);
      return (
        <div key={block.id} className={cx("code-block-wrapper")}>
          <SyntaxHighlighter
            language={mappedLanguage}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: "2rem 1rem",
              borderRadius: "0.3rem",
              fontSize: "1rem",
              lineHeight: "1.5",
            }}
          >
            {codeText}
          </SyntaxHighlighter>
          {language !== "plain text" && (
            <span className={cx("code-language")}>{language}</span>
          )}
        </div>
      );
    }
    // 7. Image Block
    case "image": {
      const imageBlock = block as ImageBlock;
      const caption = renderRichTextToPlainText(imageBlock.caption);
      return (
        <figure key={block.id} className={cx("image-figure")}>
          <img
            src={imageBlock.url}
            alt={caption || "Notion image"}
            className={cx("image")}
          />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    }
    // 8. Divider Block
    case "divider": {
      return <hr key={block.id} className={cx("divider")} />;
    }
    // 9. Callout Block
    case "callout": {
      const calloutBlock = block as CalloutBlock;
      const emojiIcon = calloutBlock.icon || "💡";
      return (
        <div key={block.id} className={cx("callout")}>
          <span className={cx("callout-icon")}>{emojiIcon}</span>
          <div className={cx("callout-content")}>
            {renderRichTextToReactElement(calloutBlock.richText)}
            {childrenList.length > 0 && (
              <div className={cx("callout-children")}>
                {childrenList.map((child) =>
                  renderBlockByType(child, allBlocks)
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
    // 10. To-do Block
    case "to_do": {
      const toDoBlock = block as ToDoBlock;
      return (
        <div key={block.id} className={cx("todo")}>
          <input
            type="checkbox"
            checked={toDoBlock.checked}
            readOnly
            className={cx("todo-checkbox")}
          />
          <div className={cx("todo-content")}>
            <span
              className={
                toDoBlock.checked ? cx("todo-text-checked") : cx("todo-text")
              }
            >
              {renderRichTextToReactElement(toDoBlock.richText)}
            </span>
            {childrenList.length > 0 && (
              <div className={cx("todo-children")}>
                {childrenList.map((child) =>
                  renderBlockByType(child, allBlocks)
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
    // 11. Toggle Block - HTML5 details/summary 사용
    case "toggle": {
      const toggleBlock = block as ToggleBlock;
      return (
        <details key={block.id} className={cx("toggle")}>
          <summary className={cx("toggle-summary")}>
            {renderRichTextToReactElement(toggleBlock.richText)}
          </summary>
          {childrenList.length > 0 && (
            <div className={cx("toggle-children")}>
              {childrenList.map((child) => renderBlockByType(child, allBlocks))}
            </div>
          )}
        </details>
      );
    }
    // 12-1. Table Block
    case "table": {
      // table의 children은 table_row 블록들
      const tableRows = childrenList.filter(
        (b) => b.type === "table_row"
      ) as TableRowBlock[];
      return (
        <table key={block.id} className={cx("table")}>
          <tbody>
            {tableRows.map((row) => (
              <tr key={row.id}>
                {row.cells.map((cell, cellIndex) => (
                  <td key={cellIndex} className={cx("table-cell")}>
                    {renderRichTextToReactElement(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    // 12-2. Table Row Block
    case "table_row":
      return null;
    // 13. Equation Block
    case "equation": {
      const equationBlock = block as EquationBlock;
      return (
        <div key={block.id} className={cx("equation")}>
          {equationBlock.expression}
        </div>
      );
    }
    // 14. Bookmark Block
    case "bookmark": {
      const bookmarkBlock = block as BookmarkBlock;
      const caption = renderRichTextToPlainText(bookmarkBlock.caption);
      return (
        <div key={block.id} className={cx("bookmark")}>
          <a
            href={bookmarkBlock.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cx("bookmark-link")}
          >
            {bookmarkBlock.url}
          </a>
          {caption && <div className={cx("bookmark-caption")}>{caption}</div>}
        </div>
      );
    }
    // 15. Video Block
    case "video": {
      const videoBlock = block as VideoBlock;
      const caption = renderRichTextToPlainText(videoBlock.caption);
      return (
        <figure key={block.id} className={cx("video-figure")}>
          <video src={videoBlock.url} controls className={cx("video")}>
            Your browser does not support the video tag.
          </video>
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    }
    default:
      return null;
  }
};

// 모든 Block 배열 -> HTML로 변환
export default function NotionRenderer({ blocks }: { blocks: NotionBlock[] }) {
  // page의 최상위 블록만 처리 (parentType: "page")
  const topLevelBlocks = blocks.filter((block) => block.parentType === "page");

  // 중복 렌더링 방지를 위한 children 블록 ID 집합 생성
  const childBlockIds = new Set<string>();
  blocks.forEach((block) => {
    if (block.parentType === "block") childBlockIds.add(block.id);
  });

  // List 그룹화를 위한 처리
  const groupedBlocks: React.ReactNode[] = [];
  let currentList: NotionBlock[] = [];
  let currentListType: "bulleted_list_item" | "numbered_list_item" | null =
    null;

  // List 렌더링 함수
  const renderList = (
    list: NotionBlock[],
    type: "bulleted_list_item" | "numbered_list_item"
  ) => {
    if (list.length === 0) return null;
    return type === "bulleted_list_item" ? (
      <ul key={`list-${list[0].id}`} className={cx("bulleted-list")}>
        {list.map((b) => renderBlockByType(b, blocks))}
      </ul>
    ) : (
      <ol key={`list-${list[0].id}`} className={cx("numbered-list")}>
        {list.map((b) => renderBlockByType(b, blocks))}
      </ol>
    );
  };

  // 현재 리스트를 종료하고 렌더링하는 함수
  const flushCurrentList = () => {
    if (currentList.length > 0 && currentListType) {
      groupedBlocks.push(renderList(currentList, currentListType));
      currentList = [];
      currentListType = null;
    }
  };

  // 최상위 블록을 순회하며 렌더링
  for (const block of topLevelBlocks) {
    // 이미 children으로 렌더링된 블록은 skip
    if (childBlockIds.has(block.id)) continue;

    const isListItem =
      block.type === "bulleted_list_item" ||
      block.type === "numbered_list_item";

    if (isListItem) {
      // 리스트 타입이 바뀌었으면 이전 리스트 종료
      if (currentListType !== block.type) {
        flushCurrentList();
        currentListType = block.type;
      }
      currentList.push(block);
    } else {
      // 리스트가 아닌 블록이면 현재 리스트 종료 후 렌더링
      flushCurrentList();
      const rendered = renderBlockByType(block, blocks);
      if (rendered) groupedBlocks.push(rendered);
    }
  }

  // 마지막 리스트 처리
  flushCurrentList();
  return <>{groupedBlocks}</>;
}
