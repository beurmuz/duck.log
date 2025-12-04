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

// Post Detail Model
export interface NotionPost {
  pageId: string;
  title: string;
  categories: string[];
  createdDate: string | null;
  updatedDate: string | null;
}
