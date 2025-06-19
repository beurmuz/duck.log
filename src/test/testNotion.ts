import notion from "@/lib/notion";

(async () => {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID as string; // .env 파일에서 데이터베이스 ID 가져오기

    const response = await notion.databases.query({
      database_id: databaseId,
    });

    console.log("Notion 데이터 조회 성공! 응답 데이터:", response.results);
  } catch (error) {
    console.error("Notion 데이터 조회 실패! 에러 메시지:", error);
  }
})();
