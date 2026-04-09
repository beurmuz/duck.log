import { fetchNotionPostList } from "./src/lib/notion/extracts.js";
import { notion, DATA_SOURCE_ID } from "./src/lib/notion/notion-client.js";

async function main() {
  try {
    const response = await notion.databases.query({
      database_id: DATA_SOURCE_ID,
      page_size: 1,
    });
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
