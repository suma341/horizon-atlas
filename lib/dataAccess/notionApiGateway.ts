import { Client, isFullPage } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notionENV = [
    { token: process.env.NOTION_TOKEN!, database: process.env.NOTION_DATABASE_ID! },
    { token: process.env.NOTION_TOKEN2!, database: process.env.NOTION_DATABASE_ID2! },
];

let currentEnvIndex = 0; // 現在使用しているトークンとデータベースIDのインデックス

const getClient = () => {
    const { token } = notionENV[currentEnvIndex];
    return new Client({ auth: token });
};

const getDatabaseId = () => {
    return notionENV[currentEnvIndex].database;
};

// リトライ処理付きAPIコール
const callWithRetryAndFailover = async <T>(
    fn: (notion: Client, databaseId: string) => Promise<T>,
    delay = 1000
): Promise<T> => {
    while (true) {
        try {
            const notion = getClient();
            const databaseId = getDatabaseId();
            return await fn(notion, databaseId);
        } catch (error: any) {
            if (error.status === 429) {
                const retryAfter = parseInt(error.headers?.["retry-after"] || "1", 10) * 1000;
                await new Promise((resolve) => setTimeout(resolve, retryAfter || delay));
                // トークンとデータベースIDを次に切り替える
                currentEnvIndex = (currentEnvIndex + 1) % notionENV.length;
                console.warn(`Switched to the next Notion token and database.`);
            } else {
                throw error; // リトライ不能なエラーは再スロー
            }
        }
    }
};

// テスト用
export const getAllMetaData = async () => {
    return await callWithRetryAndFailover(async (notion, databaseId) => {
        const posts = await notion.databases.query({
            database_id: databaseId,
            page_size: 100,
        });

        // 型ガードを使用して、PageObjectResponse型のみに絞り込む
        const allPosts = posts.results.filter(isFullPage);

        return allPosts;
    });
};

export const getAllData = async () => {
    return await callWithRetryAndFailover(async (notion, databaseId) => {
        const posts = await notion.databases.query({
            database_id: databaseId,
            page_size: 100,
            filter: {
                property: "published",
                checkbox: {
                    equals: true,
                },
            },
            sorts: [
                {
                    property: "date",
                    direction: "descending",
                },
            ],
        });

        // 型ガードを使用して、PageObjectResponse型のみに絞り込む
        const allPosts = posts.results.filter(isFullPage);

        return allPosts;
    });
};

export const getSinglePage = async (slug: string) => {
    return await callWithRetryAndFailover(async (notion, databaseId) => {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                property: "slug",
                formula: {
                    string: {
                        equals: slug,
                    },
                },
            },
        });

        const page = response.results.find(isFullPage);
        if (!page) {
            throw new Error("Page not found");
        }

        const mdBlocks = await new NotionToMarkdown({ notionClient: notion }).pageToMarkdown(page.id);

        return {
            page,
            mdBlocks,
        };
    });
};