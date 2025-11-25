import { notion } from "./notion";

// notion data source id
const DATA_SOURCE_ID =
  process.env.NOTION_DATA_SOURCE_ID ?? "21e12de2-f4bc-8058-8003-000bffd42b33";
if (!DATA_SOURCE_ID)
  throw new Error("⚠️ NOTION_DATA_SOURCE_ID 환경 변수을 확인해주세요.");

type PropertyValue = {
  type?: string;
  [key: string]: unknown;
};

// 각 필드의 type 정의
type PropertyMap = Record<string, PropertyValue>;

type TitleProperty = PropertyMap & {
  type: "title";
  title: Array<{ plain_text: string }>;
};

type MultiSelectProperty = PropertyMap & {
  type: "multi_select";
  multi_select: Array<{ name: string }>;
};

type CheckboxProperty = PropertyValue & {
  type: "checkbox";
  checkbox: boolean;
};

type UpdatedTimeProperty = PropertyValue & {
  type: "update_time";
  updated_time: string;
};

type CreatedTimeProperty = PropertyValue & {
  type: "created_time";
  created_time: string;
};

export interface NotionPostSummary {
  id: string;
  title: string;
  categories: string[];
  published: boolean;
  updatedDate: string | null;
  createdDate: string | null;
}

function findProperty<T extends PropertyValue>(
  properties: PropertyMap,
  predicate: (prop: PropertyValue) => boolean
): T | undefined {
  return Object.values(properties).find(predicate) as T | undefined;
}

function extractTitle(properties: PropertyMap): string {
  const explicitTitle = properties?.title as TitleProperty | undefined;
  const fallbackTitle = findProperty<TitleProperty>(
    properties,
    (prop) => prop?.type === "title"
  );
  const titleSource = explicitTitle ?? fallbackTitle;
  return (
    titleSource?.title
      ?.map((t) => t.plain_text)
      .join(" ")
      .trim() ?? ""
  );
}

function extractCategories(properties: PropertyMap): string[] {
  const categories =
    (properties?.category as MultiSelectProperty | undefined) ??
    findProperty<MultiSelectProperty>(
      properties,
      (prop) => prop?.type === "multi_select"
    );
  return categories?.multi_select?.map((item) => item.name) ?? [];
}

function extractCheckbox(properties: PropertyMap): boolean {
  const checkbox =
    (properties?.published as CheckboxProperty | undefined) ??
    findProperty<CheckboxProperty>(
      properties,
      (prop) => prop?.type === "checkbox"
    );
  return checkbox?.checkbox ?? false;
}

function extractUpdatedTime(properties: PropertyMap): string | null {
  const updated =
    (properties?.createdDate as UpdatedTimeProperty | undefined) ??
    findProperty<UpdatedTimeProperty>(
      properties,
      (prop) => prop?.type === "updated_time"
    );
  return updated?.updated_time ?? null;
}

function extractCreatedTime(properties: PropertyMap): string | null {
  const created =
    (properties?.createdDate as CreatedTimeProperty | undefined) ??
    findProperty<CreatedTimeProperty>(
      properties,
      (prop) => prop?.type === "created_time"
    );
  return created?.created_time ?? null;
}

export async function fetchNotionPosts(options?: {
  pageSize?: number;
  includeDraft?: boolean;
}): Promise<NotionPostSummary[]> {
  const { pageSize = 50, includeDraft = false } = options ?? {};

  const response = (await notion.dataSources.query({
    data_source_id: DATA_SOURCE_ID,
    page_size: pageSize,
  })) as {
    results: Array<{
      id: string;
      properties: PropertyMap;
    }>;
    has_more: boolean;
    next_cursor: string | null;
  };

  const mapped = response.results.map((page) => {
    const properties = page.properties ?? {};

    return {
      id: page.id,
      title: extractTitle(properties),
      categories: extractCategories(properties),
      published: extractCheckbox(properties),
      updatedDate: extractUpdatedTime(properties),
      createdDate:
        extractCreatedTime(properties) ?? extractUpdatedTime(properties),
    };
  });

  if (includeDraft) {
    return mapped;
  }

  return mapped.filter((post) => post.published);
}
