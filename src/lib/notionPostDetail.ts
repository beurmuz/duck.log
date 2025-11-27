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
  results: Array<{
    // 검색 결과 배열
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
      property: "slug", // slug 속성이 입력값과 일치하는 페이지만 조회
      rich_text: {
        equals: slug,
      },
    },
    page_size: 1, // 첫번째 결과만 필요
  })) as DataSourceQueryResponse;

  const first = response.results[0];
  return first?.id ?? null; // 첫번째 결과의 id 반환
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
    response.results.forEach((block) => {
      if ("type" in block) {
        // type이 있는 블록만 수집
        blocks.push(block as BlockObjectResponse);
      }
    });
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

// 페이지의 날짜 추출
function extractDateFromPage(
  page: PageWithTitle,
  key: "updatedDate" | "createdDate"
): string | null {
  const property = page.properties?.[key] as
    | DateProperty
    | CreatedTimeProperty
    | LastEditedTimeProperty
    | undefined;
  if (!property) {
    return null;
  }
  // 타입별 처리
  if (property.type === "date") {
    return property.date?.start ?? null;
  }
  if (property.type === "created_time") {
    return property.created_time ?? null;
  }
  if (property.type === "last_edited_time") {
    return property.last_edited_time ?? null;
  }
  return null;
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
  const createdDate =
    extractDateFromPage(page, "createdDate") ?? page.created_time ?? null;
  const updatedDate =
    extractDateFromPage(page, "updatedDate") ?? page.last_edited_time ?? null;

  return { pageId, title, categories, createdDate, updatedDate, blocks };
}
