import { notion, DATA_SOURCE_ID } from "./notion-client";
import type {
  BlockObjectResponse,
  PartialBlockObjectResponse,
  GetPageResponse,
} from "@notionhq/client/build/src/api-endpoints";
import type { PropertyMap } from "./types";
import {
  extractTitle,
  extractCategories,
  extractDateValue,
  extractTextValue,
  NotionQueryResponse,
} from "./extracts";
import { transformBlocks } from "./transforms";
import type { NotionPost } from "@/models/post";

// block의 children을 가져올 때, Notion API가 반환하는 응답 타입
type BlocksListResponse = {
  results: Array<BlockObjectResponse | PartialBlockObjectResponse>;
  has_more: boolean;
  next_cursor: string | null;
};

// Notion Page 정보를 담는 타입
type NotionPage = GetPageResponse & {
  properties?: PropertyMap;
};

// slug로 page id 찾는 함수
async function getPageIdBySlug(slug: string): Promise<string | null> {
  if (!slug) return null;

  const response = (await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,
    filter: {
      property: "slug",
      rich_text: { equals: slug }, // slug 속성이 입력값과 정확히 일치하는 페이지만 조회
    },
    page_size: 1,
  })) as NotionQueryResponse;

  return response.results[0]?.id ?? null;
}

// 특정 block의 children block들을 가져오는 함수 (페이지네이션 처리)
async function fetchBlockChildrens(
  blockId: string
): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined;

  while (true) {
    try {
      const response = (await notion.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
        page_size: 100, // 50에서 100으로 상향하여 요청 횟수 최적화
      })) as BlocksListResponse;

      // 타입이 있는 블록만 추가 (완전한 블록만)
      for (const block of response.results) {
        if ("type" in block) {
          blocks.push(block as BlockObjectResponse);
        }
      }
      if (!response.has_more) break;

      // 다음 페이지를 가져오기 위한 cursor 업데이트
      cursor = response.next_cursor ?? undefined;
    } catch (error) {
      console.error(`Failed to fetch children for block ${blockId}:`, error);
      break;
    }
  }
  return blocks;
}

// Page의 모든 Block을 가져오는 함수 (병렬 재귀 방식으로 최적화)
async function fetchAllBlocks(pageId: string): Promise<BlockObjectResponse[]> {
  const children = await fetchBlockChildrens(pageId);

  // 각 블록들 중 하위 자식이 있는 것들을 병렬로 재귀 호출하여 가져옵니다.
  const childResults = await Promise.all(
    children.map(async (block) => {
      if (block.has_children) {
        const subChildren = await fetchAllBlocks(block.id);
        return [block, ...subChildren];
      }
      return [block];
    })
  );

  // 중첩된 배열을 하나로 합쳐서 반환합니다.
  return childResults.flat();
}

import { unstable_cache } from "next/cache";

// 기존 함수를 내부 구현용으로 이름을 변경합니다.
async function getNotionPostDetailRaw(slug: string): Promise<NotionPost> {
  const pageId = await getPageIdBySlug(slug);
  if (!pageId)
    throw new Error(`해당 slug의 페이지를 찾을 수 없습니다: ${slug}`);

  const [page, blocks] = await Promise.all([
    notion.pages.retrieve({ page_id: pageId }) as Promise<NotionPage>,
    fetchAllBlocks(pageId),
  ]);

  const properties = page.properties ?? {};
  const title = extractTitle(properties) || "Untitled";
  const categories = extractCategories(properties);
  const createdDate = extractDateValue(properties, "createdDate");
  const icons = extractTextValue(properties, "icons");
  const transformedBlocks = transformBlocks(blocks);

  return {
    pageId,
    title,
    categories,
    createdDate,
    icons,
    blocks: transformedBlocks,
  };
}

// Next.js의 unstable_cache를 사용하여 Notion API 결과를 캐싱합니다.
export const fetchNotionPostDetail = unstable_cache(
  async (slug: string) => getNotionPostDetailRaw(slug),
  ["notion-post-detail"], // 캐시 키
  { revalidate: 604800, tags: ["posts"] } // 7일 캐싱 및 태그 설정
);
