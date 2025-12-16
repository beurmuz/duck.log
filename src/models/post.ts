import type { NotionBlock } from "./block";

// Blog Post Domain Model 정의

// Post List Model
export interface NotionPostList {
  id: string;
  title: string;
  categories: string[];
  createdDate: string | null;
  updatedDate: string | null;
  published: boolean;
  slug: string | null;
}

// Post Model (포스트 1개의 상세 정보)
export interface NotionPost {
  pageId: string;
  title: string;
  categories: string[];
  createdDate: string | null;
  updatedDate: string | null;
  blocks: NotionBlock[]; // 각 post의 Block들을 저장
}
