// import notion from "./notion";

// const databaseId = process.env.NOTION_DATABASE_ID as string;

// export async function getPublishedPosts() {
//   const response = await notion.databases.query({
//     database_id: databaseId,
//     filter: {
//       property: "published",
//       checkbox: {
//         equals: true,
//       },
//     },
//     sorts: [
//       {
//         property: "created_at",
//         direction: "descending",
//       },
//     ],
//   });

//   return response.results.map((page) => {
//     console.log(page.id);
//     // title: page.properties.Title.title[0]?.plain_text || ''
//   });
// }
