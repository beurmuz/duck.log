import { notion, DATA_SOURCE_ID } from "@/lib/notion";
import type {
  BlockObjectResponse,
  PartialBlockObjectResponse,
  GetPageResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type {
  CreatedTimeProperty,
  DateProperty,
  LastEditedTimeProperty,
  PropertyMap,
} from "./notionTypes";
import { extractTitle, extractCategories } from "./notionPosts";

// slug로 페이지 검색 시 응답 type
type DataSourceQueryResponse = {
  // 결과는 배열 형태로 반환
  results: Array<{
    id: string; // 페이지 id
    properties?: PropertyMap; // 페이지 속성들
  }>;
};

// slug로 페이지 ID 찾기
async function getPageIdBySlug(slug: string): Promise<string | null> {
  if (!slug) return null;

  // notion API로 호출
  const response = (await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,
    filter: {
      property: "slug",
      rich_text: {
        equals: slug, // slug 속성이 입력값과 정확히 일치하는 페이지만 조회
      },
    },
    page_size: 1,
  })) as DataSourceQueryResponse;

  const first = response.results[0]; // 결과는 무조건 1개이기 때문에 첫번째 결과만 조회
  return first?.id ?? null; // 첫번째 결과의 id 반환
}

// 블록의 children을 재귀적으로 가져오는 함수
async function fetchBlockChildren(
  blockId: string
): Promise<BlockObjectResponse[]> {
  const children: BlockObjectResponse[] = []; // 수집할 블록 배열
  let cursor: string | undefined;

  // 결과가 더 있으면 계속 요청하기 위함
  do {
    const response = (await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 50,
    })) as {
      results: Array<BlockObjectResponse | PartialBlockObjectResponse>;
      has_more: boolean;
      next_cursor: string | null;
    };

    for (const block of response.results) {
      if ("type" in block) {
        // block 타입이 있는 경우에만
        const fullBlock = block as BlockObjectResponse;
        children.push(fullBlock);

        // 재귀 호출: 해당 block도 children이 있는 경우 재귀적으로 가져오기
        if (fullBlock.has_children) {
          const nestedChildren = await fetchBlockChildren(fullBlock.id);
          children.push(...nestedChildren);
        }
      }
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return children;
}

// 페이지의 모든 Block(내용) 가져오기
async function fetchBlocks(pageId: string) {
  const blocks: BlockObjectResponse[] = []; // 수집할 Block 배열
  let cursor: string | undefined; // 다음 페이지 커서

  do {
    // notion.blocks.children.list()로 Block 목록 조회
    const response = (await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
      page_size: 50,
    })) as {
      results: Array<BlockObjectResponse | PartialBlockObjectResponse>;
      has_more: boolean;
      next_cursor: string | null;
    };

    for (const block of response.results) {
      if ("type" in block) {
        const fullBlock = block as BlockObjectResponse;
        blocks.push(fullBlock);

        // has_children이 true인 경우 children도 재귀적으로 가져오기
        if (fullBlock.has_children) {
          const children = await fetchBlockChildren(fullBlock.id);
          blocks.push(...children);
        }
      }
    }

    cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
  } while (cursor);

  return blocks;
}

// Notion 페이지 타입
type PageWithTitle = {
  id: string;
  created_time?: string;
  last_edited_time?: string;
  properties?: Record<string, unknown>;
} & GetPageResponse; // 페이지 확장

// 페이지의 title 추출
function extractTitleFromPage(page: PageWithTitle): string {
  const properties = (page.properties ?? {}) as PropertyMap;
  const title = extractTitle(properties);
  return title || "Untitled";
}

// 페이지의 categories 추출
function extractCategoriesFromPage(page: PageWithTitle): string[] {
  const properties = (page.properties ?? {}) as PropertyMap;
  return extractCategories(properties);
}

// 페이지의 날짜 추출 (날짜 타입만 처리)
function extractDateFromPage(
  page: PageWithTitle,
  key: "updatedDate" | "createdDate"
): string | null {
  const property = page.properties?.[key] as DateProperty | undefined;
  if (!property || property.type !== "date") {
    return null;
  }
  return property.date?.start ?? null;
}

// Notion 최종 반환 타입
type NotionPostDetail = {
  pageId: string;
  title: string;
  categories: string[];
  createdDate: string | null;
  updatedDate: string | null;
  blocks: BlockObjectResponse[];
};

// Post 1개의 상세 정보를 가져오는 함수
export async function fetchNotionPostDetail(
  slug: string
): Promise<NotionPostDetail> {
  const pageId = await getPageIdBySlug(slug);

  if (!pageId) throw new Error("해당 slug의 페이지를 찾을 수 없습니다.");

  // notion.pages.retrieve()로 페이지 메타데이터 조회
  const page = (await notion.pages.retrieve({
    page_id: pageId,
  })) as PageWithTitle;
  const blocks = await fetchBlocks(pageId);

  const title = extractTitleFromPage(page);
  const categories = extractCategoriesFromPage(page);
  const createdDate = extractDateFromPage(page, "createdDate");
  const updatedDate = extractDateFromPage(page, "updatedDate");

  return { pageId, title, categories, createdDate, updatedDate, blocks };
}
