import { notion, DATA_SOURCE_ID } from "./notion";
import type {
  PropertyMap,
  TitleProperty,
  MultiSelectProperty,
  CreatedTimeProperty,
  UpdatedTimeProperty,
  DateProperty,
  CheckboxProperty,
  TextProperty,
} from "./notionTypes";

// Post의 세부 type
export interface NotionPostSummary {
  id: string;
  title: string;
  categories: string[];
  createdDate: string | null;
  updatedDate: string | null;
  published: boolean;
  slug: string | null;
}

// title를 추출하는 함수
export function extractTitle(properties: PropertyMap): string {
  const title = properties?.title as TitleProperty | undefined;
  return (
    title?.title // title 객체 안의 title 배열에 접근하여 plain_text 추출
      ?.map((t) => t.plain_text) // plain_text를 추출해 배열로 반환
      .join(" ") // 공백으로 연결
      .trim() ?? "" // 앞뒤 공백 제거
  );
}

// category를 추출하는 함수
export function extractCategories(properties: PropertyMap): string[] {
  const categories = properties?.category as MultiSelectProperty | undefined;
  return categories?.multi_select?.map((item) => item.name) ?? [];
}

// createdDate를 추출하는 함수 (날짜 타입만 처리)
function extractCreatedTime(properties: PropertyMap): string | null {
  const created = properties?.createdDate as DateProperty | undefined;
  if (!created || created.type !== "date") return null;
  return created.date?.start ?? null;
}

// updatedDate를 추출하는 함수 (날짜 타입만 처리)
function extractUpdatedTime(properties: PropertyMap): string | null {
  const updated = properties?.updatedDate as DateProperty | undefined;
  if (!updated || updated.type !== "date") return null;
  return updated.date?.start ?? null;
}

// published를 추출하는 함수
function extractCheckbox(properties: PropertyMap): boolean {
  const checkbox = properties?.published as CheckboxProperty | undefined;
  return checkbox?.checkbox ?? false;
}

// slug를 추출하는 함수
function extractTextValue(properties: PropertyMap, key: string): string | null {
  const prop = properties?.[key] as TextProperty | undefined;
  if (!prop?.rich_text || prop.rich_text.length === 0) return null;
  return prop.rich_text[0]?.plain_text?.trim() ?? null;
}

// Notion의 Post 목록을 가져오는 함수
export async function fetchNotionPosts(options?: {
  pageSize?: number;
  includeDraft?: boolean;
}): Promise<NotionPostSummary[]> {
  const { pageSize = 50, includeDraft = false } = options ?? {};

  const response = (await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID as string,
    page_size: pageSize,
  })) as {
    results: Array<{
      id: string;
      properties: PropertyMap;
    }>;
    has_more: boolean;
    next_cursor: string | null;
  };

  const rowPostArray = response.results.map((post) => {
    const properties = post.properties ?? {};

    // 각 post 속성 추출하기
    return {
      id: post.id,
      title: extractTitle(properties),
      categories: extractCategories(properties),
      createdDate: extractCreatedTime(properties),
      updatedDate: extractUpdatedTime(properties),
      published: extractCheckbox(properties),
      slug: extractTextValue(properties, "slug"),
    };
  });

  // published 속성이 true인 것만 필터링
  const filtered = includeDraft
    ? rowPostArray
    : rowPostArray.filter((post) => post.published);

  // updatedDate 기준으로 정렬 (최신순)
  return filtered.sort((a, b) => {
    const dateA = a.updatedDate ?? a.createdDate ?? "";
    const dateB = b.updatedDate ?? b.createdDate ?? "";
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
}
