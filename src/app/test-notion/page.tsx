import { notion } from "@/lib/notion";

export default async function TestNotionPage() {
  const results: Record<string, unknown> = {};
  const errors: string[] = [];

  try {
    // 1. 사용자 정보 확인
    const user = await notion.users.me({});
    results.user = {
      id: user.id,
      name: user.name,
      type: user.type,
    };
  } catch (err: unknown) {
    const error = err as Error;
    errors.push(`사용자 정보 가져오기 실패: ${error.message}`);
  }

  try {
    // 2. 데이터베이스 검색 (Search API)
    const searchResponse = await notion.search({
      filter: {
        property: "object",
        value: "data_source", // "database" → "data_source"로 변경
      },
    });

    results.databases = searchResponse.results.map(
      (db: {
        id: string;
        title?: Array<{ plain_text: string }>;
        object: string;
        data_sources?: unknown[];
      }) => ({
        id: db.id,
        title: db.title?.[0]?.plain_text || "Untitled",
        object: db.object,
        // 2025-09-03 버전에서는 data_sources 필드가 있습니다
        dataSources: db.data_sources || [],
      })
    );

    // 3. 첫 번째 데이터베이스의 상세 정보 가져오기
    const databases = results.databases as Array<{
      id: string;
      title: string;
      object: string;
      dataSources: unknown[];
    }>;
    if (databases.length > 0) {
      const firstDb = databases[0];

      try {
        // 3-1. 데이터 소스 정보 조회
        // data_source는 dataSources.retrieve를 사용해야 합니다
        const dbInfo = (await notion.dataSources.retrieve({
          data_source_id: firstDb.id,
        })) as {
          id: string;
          title: Array<{ plain_text: string }>;
          [key: string]: unknown;
        };

        results.databaseProperties = {
          id: dbInfo.id,
          title: dbInfo.title,
          // data_source는 properties가 없을 수 있습니다
          note: "data_source는 properties 대신 query로 페이지를 조회합니다",
        };
      } catch (err: unknown) {
        const error = err as Error;
        errors.push(`데이터 소스 정보 조회 실패: ${error.message}`);
      }

      try {
        // 3-2. 데이터 소스의 페이지(레코드) 조회
        // data_source는 dataSources.query를 사용해야 합니다
        const pagesResponse = (await notion.dataSources.query({
          data_source_id: firstDb.id,
          page_size: 5, // 처음 5개만 가져오기
        })) as {
          results: Array<{
            id: string;
            created_time: string;
            last_edited_time: string;
            properties: Record<
              string,
              {
                type: string;
                title?: Array<{ plain_text: string }>;
                rich_text?: Array<{ plain_text: string }>;
                date?: unknown;
                select?: { name: string };
                multi_select?: Array<{ name: string }>;
                number?: number;
                checkbox?: boolean;
                url?: string;
                [key: string]: unknown;
              }
            >;
          }>;
          has_more: boolean;
        };

        results.databasePages = {
          total: pagesResponse.results.length,
          hasMore: pagesResponse.has_more,
          pages: pagesResponse.results.map((page) => ({
            id: page.id,
            created_time: page.created_time,
            last_edited_time: page.last_edited_time,
            properties: Object.keys(page.properties || {}).reduce(
              (
                acc: Record<string, { type: string; value: unknown }>,
                key: string
              ) => {
                const prop = page.properties[key];
                // 속성 타입에 따라 값 추출
                let value: unknown = null;
                switch (prop.type) {
                  case "title":
                    value = prop.title?.[0]?.plain_text || "";
                    break;
                  case "rich_text":
                    value = prop.rich_text?.[0]?.plain_text || "";
                    break;
                  case "date":
                    value = prop.date;
                    break;
                  case "select":
                    value = prop.select?.name || null;
                    break;
                  case "multi_select":
                    value = prop.multi_select?.map((item) => item.name) || [];
                    break;
                  case "number":
                    value = prop.number;
                    break;
                  case "checkbox":
                    value = prop.checkbox;
                    break;
                  case "url":
                    value = prop.url;
                    break;
                  default:
                    value = prop;
                }
                acc[key] = {
                  type: prop.type,
                  value: value,
                };
                return acc;
              },
              {}
            ),
          })),
        };
      } catch (err: unknown) {
        const error = err as Error;
        errors.push(`데이터베이스 페이지 조회 실패: ${error.message}`);
      }
    }
  } catch (err: unknown) {
    const error = err as Error;
    errors.push(`데이터베이스 검색 실패: ${error.message}`);
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Notion API 테스트 결과</h1>

      <section style={{ marginTop: "2rem" }}>
        <h2>✅ 성공한 요청</h2>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "1rem",
            borderRadius: "4px",
            overflow: "auto",
          }}
        >
          {JSON.stringify(results, null, 2)}
        </pre>
      </section>

      {errors.length > 0 && (
        <section style={{ marginTop: "2rem" }}>
          <h2 style={{ color: "red" }}>❌ 에러</h2>
          <ul>
            {errors.map((error, index) => (
              <li key={index} style={{ color: "red" }}>
                {error}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section
        style={{
          marginTop: "2rem",
          padding: "1rem",
          background: "#e3f2fd",
          borderRadius: "4px",
        }}
      >
        <h3>체크리스트</h3>
        <ul>
          <li>사용자 정보가 보이면 → API 키가 정상 작동합니다 ✅</li>
          <li>
            데이터베이스 목록이 보이면 → 통합이 데이터베이스에 접근 권한이
            있습니다 ✅
          </li>
          <li>
            dataSources가 []인 이유 → 모든 데이터베이스가 data_sources 필드를
            가지는 것은 아닙니다. 정상입니다.
          </li>
          <li>데이터베이스 속성이 보이면 → 스키마를 확인할 수 있습니다 ✅</li>
          <li>
            데이터베이스 페이지가 보이면 → 실제 콘텐츠를 가져올 수 있습니다 ✅
          </li>
          <li>에러가 발생하면 → API 키나 권한을 확인하세요</li>
        </ul>
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#fff3cd",
            borderRadius: "4px",
          }}
        >
          <h4 style={{ marginTop: 0 }}>⚠️ 권한 문제 해결 방법</h4>
          <ol>
            <li>
              Notion에서 해당 데이터베이스(또는 데이터 소스) 페이지를 엽니다
            </li>
            <li>우측 상단의 &quot;...&quot; 메뉴를 클릭합니다</li>
            <li>
              &quot;연결 추가&quot; 또는 &quot;Add connections&quot;를
              선택합니다
            </li>
            <li>통합(integration) 이름을 검색하여 추가합니다</li>
            <li>페이지를 새로고침하여 다시 시도합니다</li>
          </ol>
          <p style={{ marginBottom: 0, fontSize: "0.9em", color: "#666" }}>
            💡 <strong>프라이빗 통합</strong>은 문제가 되지 않습니다. 중요한
            것은 데이터베이스가 통합과 <strong>공유</strong>되어 있는지입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
