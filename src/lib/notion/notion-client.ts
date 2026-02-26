import { Client } from "@notionhq/client";

// Notion API 클라이언트 생성
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  notionVersion: "2025-09-03",
});

const dataSourceId = process.env.NOTION_DATA_SOURCE_ID;
if (!dataSourceId) {
  throw new Error("⚠️ NOTION_DATA_SOURCE_ID 환경 변수를 확인해주세요.");
}

export const DATA_SOURCE_ID = dataSourceId;
