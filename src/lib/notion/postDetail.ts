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
        page_size: 50,
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

// Page의 모든 Block을 가져오는 함수
async function fetchAllBlocks(pageId: string): Promise<BlockObjectResponse[]> {
  const allBlocks: BlockObjectResponse[] = [];
  const queue: string[] = [pageId];
  let front = 0; // 큐의 앞 인덱스 (shift() 대신 인덱스로 O(1) 접근)

  while (front < queue.length) {
    const currentBlockId = queue[front++]; // 인덱스로 접근하여 O(1)
    const children = await fetchBlockChildrens(currentBlockId); // 가져오기
    allBlocks.push(...children); // 저장하기

    for (const block of children) {
      // 탐색하기
      if (block.has_children) queue.push(block.id);
    }
  }
  return allBlocks;
}

// Main function: slug로 NotionPost 상세 정보 가져오기
export async function fetchNotionPostDetail(slug: string): Promise<NotionPost> {
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
  const updatedDate = extractDateValue(properties, "updatedDate");
  const transformedBlocks = transformBlocks(blocks);

  return {
    pageId,
    title,
    categories,
    createdDate,
    updatedDate,
    blocks: transformedBlocks,
  };
}
