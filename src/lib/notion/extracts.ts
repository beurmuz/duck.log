import type {
  PropertyMap,
  TitleProperty,
  MultiSelectProperty,
  DateProperty,
  CheckboxProperty,
  TextProperty,
} from "./types";
import { notion, DATA_SOURCE_ID } from "./notion-client";
import type { NotionPostList } from "@/models/post";

// title 추출
export function extractTitle(properties: PropertyMap): string {
  const title = properties?.title as TitleProperty | undefined;
  return (
    title?.title
      ?.map((t) => t.plain_text)
      .join(" ")
      .trim() ?? "" // 앞 뒤 공백 제거
  );
}

// categories 추출
export function extractCategories(properties: PropertyMap): string[] {
  const categories = properties?.category as MultiSelectProperty | undefined;
  return categories?.multi_select?.map((category) => category.name) ?? [];
}

// createdDate, updatedDate 추출
export function extractDateValue(
  properties: PropertyMap,
  fieldName: "createdDate" | "updatedDate"
): string | null {
  const date = properties?.[fieldName] as DateProperty | undefined;
  if (!date || date.type !== "date") return null;
  return date.date?.start ?? null;
}

// published 추출
export function extractCheckboxValue(properties: PropertyMap): boolean {
  const checkbox = properties?.published as CheckboxProperty | undefined;
  return checkbox?.checkbox ?? false;
}

// slug 추출
export function extractTextValue(
  properties: PropertyMap,
  fieldName: string
): string | null {
  const prop = properties?.[fieldName] as TextProperty | undefined;
  if (!prop?.rich_text || prop.rich_text.length === 0) return null;
  return prop.rich_text[0]?.plain_text?.trim() ?? null;
}

// -----------------------------------------------------------

// Notion API 응답 type (공통 사용)
export type NotionQueryResponse = {
  results: Array<{ id: string; properties: PropertyMap }>;
  has_more: boolean;
  next_cursor: string | null;
};

// Notion Post List를 불러오는 함수
export async function fetchNotionPostList(options?: {
  pageSize?: number;
}): Promise<NotionPostList[]> {
  const { pageSize = 50 } = options ?? {};

  const response = (await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID as string,
    page_size: pageSize,
  })) as NotionQueryResponse;

  // Notion API 응답 데이터를 PostList 도메인 모델로 변환
  const rowDataArray = response.results.map((post) => {
    const properties = post.properties ?? {};

    return {
      id: post.id,
      title: extractTitle(properties),
      categories: extractCategories(properties),
      createdDate: extractDateValue(properties, "createdDate"),
      updatedDate: extractDateValue(properties, "updatedDate"),
      published: extractCheckboxValue(properties),
      slug: extractTextValue(properties, "slug"),
    };
  });

  // published가 true인 것만 필터링한 후, createdDate 기준으로 정렬
  const filtered = rowDataArray.filter((post) => post.published);
  return filtered.sort((a, b) => {
    const dateA = a.createdDate ?? "";
    const dateB = b.createdDate ?? "";
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
}
