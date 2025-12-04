// Notion field 속성들의 기본 형태 (실제 정의한 것들)
export type PropertyValue = {
  type?: string;
  [key: string]: unknown; // { key: value } 형태도 포함하는 모든 속성을 포함하는 객체
};

// 각 속성은 <key, value> 형태를 반복
export type PropertyMap = Record<string, PropertyValue>;

// title field
// 기본적으로 PropertyMap 구조를 그대로 갖고있고, 추가로 {}를 가져야 함
export type TitleProperty = PropertyMap & {
  type: "title";
  title: Array<{ plain_text: string }>;
};

// category field
export type MultiSelectProperty = PropertyMap & {
  type: "multi_select";
  multi_select: Array<{ name: string }>;
};

// date field - createdDate, updatedDate는 둘다 date로 설정
export type DateProperty = PropertyValue & {
  type: "date";
  date: { start: string | null } | null;
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
