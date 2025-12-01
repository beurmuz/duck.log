/* eslint-disable @next/next/no-img-element */
import type {
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./NotionRenderer.module.css";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

// Block을 rendering하는 함수 (재귀적으로 children 처리)
const renderBlock = (
  block: BlockObjectResponse,
  allBlocks: BlockObjectResponse[]
): React.ReactNode => {
  // parent가 현재 block인 것들을 찾기
  const children = allBlocks.filter(
    (b) => b.parent && "block_id" in b.parent && b.parent.block_id === block.id
  );

  // block의 type에 따라 렌더링
  switch (block.type) {
    // Heading 블록
    case "heading_1": {
      return (
        <h1 key={block.id} className={cx(["heading", "heading1"])}>
          {renderRichText(block.heading_1.rich_text)}
        </h1>
      );
    }
    case "heading_2": {
      return (
        <h2 key={block.id} className={cx(["heading", "heading2"])}>
          {renderRichText(block.heading_2.rich_text)}
        </h2>
      );
    }
    case "heading_3": {
      return (
        <h3 key={block.id} className={cx(["heading", "heading3"])}>
          {renderRichText(block.heading_3.rich_text)}
        </h3>
      );
    }
    // Paragraph 블록
    case "paragraph": {
      return (
        <p key={block.id} className={cx("paragraph")}>
          {renderRichText(block.paragraph.rich_text)}
        </p>
      );
    }
    // List block
    case "bulleted_list_item": {
      const bulletedChildren = children.filter(
        (b) => b.type === "bulleted_list_item"
      );
      const numberedChildren = children.filter(
        (b) => b.type === "numbered_list_item"
      );
      return (
        <li key={block.id} className={cx("bulleted-list-item")}>
          {renderRichText(block.bulleted_list_item.rich_text)}
          {bulletedChildren.length > 0 && (
            <ul className={cx("bulleted-list")}>
              {bulletedChildren.map((child) => renderBlock(child, allBlocks))}
            </ul>
          )}
          {numberedChildren.length > 0 && (
            <ol className={cx("numbered-list")}>
              {numberedChildren.map((child) => renderBlock(child, allBlocks))}
            </ol>
          )}
        </li>
      );
    }
    case "numbered_list_item": {
      const numberedChildren = children.filter(
        (b) => b.type === "numbered_list_item"
      );
      const bulletedChildren = children.filter(
        (b) => b.type === "bulleted_list_item"
      );
      return (
        <li key={block.id} className={cx("numbered-list-item")}>
          {renderRichText(block.numbered_list_item.rich_text)}
          {numberedChildren.length > 0 && (
            <ol className={cx("numbered-list")}>
              {numberedChildren.map((child) => renderBlock(child, allBlocks))}
            </ol>
          )}
          {bulletedChildren.length > 0 && (
            <ul className={cx("bulleted-list")}>
              {bulletedChildren.map((child) => renderBlock(child, allBlocks))}
            </ul>
          )}
        </li>
      );
    }
    // Quote block (인용)
    case "quote": {
      // 인용 블록 안의 children을 리스트 그룹화하여 렌더링
      const renderQuoteChildren = (
        childrenBlocks: BlockObjectResponse[]
      ): React.ReactNode[] => {
        const result: React.ReactNode[] = [];
        let currentList: BlockObjectResponse[] = [];
        let currentListType:
          | "bulleted_list_item"
          | "numbered_list_item"
          | null = null;

        const renderListGroup = (
          list: BlockObjectResponse[],
          type: "bulleted_list_item" | "numbered_list_item"
        ) => {
          if (list.length === 0) return null;
          return type === "bulleted_list_item" ? (
            <ul key={`list-${list[0].id}`} className={cx("bulleted-list")}>
              {list.map((b) => renderBlock(b, allBlocks))}
            </ul>
          ) : (
            <ol key={`list-${list[0].id}`} className={cx("numbered-list")}>
              {list.map((b) => renderBlock(b, allBlocks))}
            </ol>
          );
        };

        for (const child of childrenBlocks) {
          if (child.type === "bulleted_list_item") {
            if (currentListType !== "bulleted_list_item") {
              if (currentList.length > 0 && currentListType) {
                result.push(renderListGroup(currentList, currentListType));
              }
              currentList = [];
              currentListType = "bulleted_list_item";
            }
            currentList.push(child);
          } else if (child.type === "numbered_list_item") {
            if (currentListType !== "numbered_list_item") {
              if (currentList.length > 0 && currentListType) {
                result.push(renderListGroup(currentList, currentListType));
              }
              currentList = [];
              currentListType = "numbered_list_item";
            }
            currentList.push(child);
          } else {
            // 리스트가 아닌 블록
            if (currentList.length > 0 && currentListType) {
              result.push(renderListGroup(currentList, currentListType));
              currentList = [];
              currentListType = null;
            }
            const rendered = renderBlock(child, allBlocks);
            if (rendered) {
              result.push(rendered);
            }
          }
        }

        // 마지막 리스트 처리
        if (currentList.length > 0 && currentListType) {
          result.push(renderListGroup(currentList, currentListType));
        }

        return result;
      };

      return (
        <blockquote key={block.id} className={cx("quote")}>
          {renderRichText(block.quote.rich_text)}
          {children.length > 0 && (
            <div className={cx("quote-children")}>
              {renderQuoteChildren(children)}
            </div>
          )}
        </blockquote>
      );
    }
    // Code block (라이브러리로 언어별 색상 다르게 주기)
    case "code": {
      const language = block.code.language || "plain text";
      const codeText = renderRichTextPlain(block.code.rich_text);

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
            showLineNumbers={false}
          >
            {codeText}
          </SyntaxHighlighter>
          {language !== "plain text" && (
            <span className={cx("code-language")}>{language}</span>
          )}
        </div>
      );
    }
    // image block
    case "image": {
      const image =
        block.image.type === "file"
          ? block.image.file.url
          : block.image.external.url;
      const caption = renderRichTextPlain(block.image.caption ?? []);
      return (
        <figure key={block.id} className={cx("image-figure")}>
          <img
            src={image}
            alt={caption || "Notion image"}
            className={cx("image")}
          />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    }
    // divider block
    case "divider":
      return <hr key={block.id} className={cx("divider")} />;
    // callout block
    case "callout": {
      const icon = block.callout.icon;
      const iconEmoji = icon && icon.type === "emoji" ? icon.emoji : "💡";
      return (
        <div key={block.id} className={cx("callout")}>
          <span className={cx("callout-icon")}>{iconEmoji}</span>
          <div className={cx("callout-content")}>
            {renderRichText(block.callout.rich_text)}
            {children.length > 0 && (
              <div className={cx("callout-children")}>
                {children.map((child) => renderBlock(child, allBlocks))}
              </div>
            )}
          </div>
        </div>
      );
    }
    // 할일 block
    case "to_do": {
      const checked = block.to_do.checked;
      return (
        <div key={block.id} className={cx("todo")}>
          <input
            type="checkbox"
            checked={checked}
            readOnly
            className={cx("todo-checkbox")}
          />
          <div className={cx("todo-content")}>
            <span
              className={checked ? cx("todo-text-checked") : cx("todo-text")}
            >
              {renderRichText(block.to_do.rich_text)}
            </span>
            {children.length > 0 && (
              <div className={cx("todo-children")}>
                {children.map((child) => renderBlock(child, allBlocks))}
              </div>
            )}
          </div>
        </div>
      );
    }
    case "toggle": {
      return (
        <details key={block.id} className={cx("toggle")}>
          <summary className={cx("toggle-summary")}>
            {renderRichText(block.toggle.rich_text)}
          </summary>
          {children.length > 0 && (
            <div className={cx("toggle-children")}>
              {children.map((child) => renderBlock(child, allBlocks))}
            </div>
          )}
        </details>
      );
    }
    case "table": {
      // table의 children은 table_row 블록들
      const tableRows = children.filter((b) => b.type === "table_row");
      return (
        <table key={block.id} className={cx("table")}>
          <tbody>
            {tableRows.map((row) => {
              if (row.type !== "table_row") return null;
              return (
                <tr key={row.id}>
                  {row.table_row.cells.map((cell, cellIndex) => (
                    <td key={cellIndex} className={cx("table-cell")}>
                      {renderRichText(cell)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }
    case "table_row":
      // table_row는 table의 children으로만 렌더링되므로 여기서는 처리하지 않음
      return null;
    case "equation": {
      const expression = block.equation.expression;
      return (
        <div key={block.id} className={cx("equation")}>
          {expression}
        </div>
      );
    }
    default:
      return null;
  }
};

// Rich text를 plain text 문자열로 변환하는 함수 (caption 등에 사용)
const renderRichTextPlain = (texts: RichTextItemResponse[]) =>
  texts.map((text) => text.plain_text).join("");

// Rich text를 React 요소로 렌더링하는 함수 (굵게, 기울임 등 처리)
const renderRichText = (texts: RichTextItemResponse[]) => {
  return texts.map((text, index) => {
    const { annotations, plain_text, href } = text;
    const style: React.CSSProperties = {};

    // bold가 true일 때만 font-weight를 설정 (false일 때는 부모의 font-weight를 상속받도록)
    if (annotations.bold) {
      style.fontWeight = "bold";
    }

    // italic이 true일 때만 font-style을 설정
    if (annotations.italic) {
      style.fontStyle = "italic";
    }

    // underline 또는 strikethrough가 있을 때만 text-decoration 설정
    if (annotations.underline) {
      style.textDecoration = "underline";
    } else if (annotations.strikethrough) {
      style.textDecoration = "line-through";
    }

    let content: React.ReactNode = plain_text;

    if (annotations.code) {
      content = <code className={cx("inline-code")}>{plain_text}</code>;
    }

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

    return (
      <span key={index} style={style}>
        {content}
      </span>
    );
  });
};

// 모든 Block 배열을 HTML로 변환하는 함수
export default function NotionRenderer({
  blocks,
}: {
  blocks: BlockObjectResponse[];
}) {
  // 페이지 레벨 블록만 필터링 (parent가 page_id인 것들)
  const topLevelBlocks = blocks.filter((block) => {
    if (!block.parent) return false;
    // page_id가 있으면 top level
    return "page_id" in block.parent;
  });

  // children 블록 ID 집합 생성 (중복 렌더링 방지)
  const childBlockIds = new Set<string>();
  blocks.forEach((block) => {
    if (block.parent && "block_id" in block.parent) {
      childBlockIds.add(block.id);
    }
  });

  // 리스트 그룹화를 위한 처리
  const groupedBlocks: React.ReactNode[] = [];
  let currentList: BlockObjectResponse[] = [];
  let currentListType: "bulleted_list_item" | "numbered_list_item" | null =
    null;

  const renderList = (
    list: BlockObjectResponse[],
    type: "bulleted_list_item" | "numbered_list_item"
  ) => {
    if (list.length === 0) return null;
    return type === "bulleted_list_item" ? (
      <ul key={`list-${list[0].id}`} className={cx("bulleted-list")}>
        {list.map((b) => renderBlock(b, blocks))}
      </ul>
    ) : (
      <ol key={`list-${list[0].id}`} className={cx("numbered-list")}>
        {list.map((b) => renderBlock(b, blocks))}
      </ol>
    );
  };

  for (const block of topLevelBlocks) {
    // 이미 children으로 렌더링된 블록은 건너뛰기
    if (childBlockIds.has(block.id)) {
      continue;
    }

    if (block.type === "bulleted_list_item") {
      if (currentListType !== "bulleted_list_item") {
        // 이전 리스트가 있으면 렌더링
        if (currentList.length > 0 && currentListType) {
          groupedBlocks.push(renderList(currentList, currentListType));
        }
        currentList = [];
        currentListType = "bulleted_list_item";
      }
      currentList.push(block);
    } else if (block.type === "numbered_list_item") {
      if (currentListType !== "numbered_list_item") {
        // 이전 리스트가 있으면 렌더링
        if (currentList.length > 0 && currentListType) {
          groupedBlocks.push(renderList(currentList, currentListType));
        }
        currentList = [];
        currentListType = "numbered_list_item";
      }
      currentList.push(block);
    } else {
      // 리스트가 아닌 블록
      if (currentList.length > 0 && currentListType) {
        groupedBlocks.push(renderList(currentList, currentListType));
        currentList = [];
        currentListType = null;
      }
      const rendered = renderBlock(block, blocks);
      if (rendered) {
        groupedBlocks.push(rendered);
      }
    }
  }

  // 마지막 리스트 처리
  if (currentList.length > 0 && currentListType) {
    groupedBlocks.push(renderList(currentList, currentListType));
  }

  return <>{groupedBlocks}</>;
}
