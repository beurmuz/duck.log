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

// Notion API 응답 타입
type BlocksListResponse = {
  results: Array<BlockObjectResponse | PartialBlockObjectResponse>;
  has_more: boolean;
  next_cursor: string | null;
};

// 단일 블록의 children을 가져오는 함수 (페이지네이션 처리)
async function fetchBlockChildrenPage(
  blockId: string
): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    try {
      const response = (await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
        page_size: 50,
      })) as BlocksListResponse;

      for (const block of response.results) {
        if ("type" in block) {
          blocks.push(block as BlockObjectResponse);
        }
      }

      cursor = response.has_more
        ? response.next_cursor ?? undefined
        : undefined;
    } catch (error) {
      console.error(`Failed to fetch children for block ${blockId}:`, error);
      // 에러 발생 시 현재까지 수집한 블록 반환
      break;
    }
  } while (cursor);

  return blocks;
}

// 페이지의 모든 Block(내용) 가져오기 (반복문 기반, 재귀 없음)
async function fetchBlocks(pageId: string): Promise<BlockObjectResponse[]> {
  const allBlocks: BlockObjectResponse[] = [];
  const queue: string[] = [pageId]; // 처리할 블록 ID 큐

  // 반복문으로 처리하여 스택 오버플로우 방지
  while (queue.length > 0) {
    const currentBlockId = queue.shift()!;

    // 현재 블록의 children 가져오기
    const children = await fetchBlockChildrenPage(currentBlockId);

    // 가져온 블록들을 결과에 추가
    allBlocks.push(...children);

    // children이 있는 블록들을 큐에 추가 (다음 반복에서 처리)
    for (const block of children) {
      if (block.has_children) {
        queue.push(block.id);
      }
    }
  }

  return allBlocks;
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
