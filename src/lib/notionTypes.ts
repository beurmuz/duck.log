// Notion 속성들의 기본 형태
export type PropertyValue = {
  type?: string;
  [key: string]: unknown; // 모든 속성을 포함하는 객체. { key: value } 형태도 포함
};

// 속성들의 Dictionary (key: string, value: PropertyValue)
export type PropertyMap = Record<string, PropertyValue>;

// title field
export type TitleProperty = PropertyMap & {
  type: "title";
  title: Array<{ plain_text: string }>;
};

// category field
export type MultiSelectProperty = PropertyMap & {
  type: "multi_select";
  multi_select: Array<{ name: string }>;
};

// createdDate field
export type CreatedTimeProperty = PropertyValue & {
  type: "created_time";
  created_time: string;
};

// updatedDate field
export type UpdatedTimeProperty = PropertyValue & {
  type: "updated_time";
  updated_time: string;
};

// date field
export type DateProperty = {
  type: "date";
  date: { start: string | null } | null;
};

// last_edited_time field
export type LastEditedTimeProperty = {
  type: "last_edited_time";
  last_edited_time: string;
};

// published field
export type CheckboxProperty = PropertyValue & {
  type: "checkbox";
  checkbox: boolean;
};

// slug field
export type TextProperty = PropertyValue & {
  type: "rich_text" | "text";
  rich_text?: Array<{ plain_text: string }>;
  text?: Array<{ plain_text: string }>;
};
