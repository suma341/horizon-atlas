import { Client, isFullPage } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const NOTION_TOKEN = process.env.NOTION_TOKEN2!;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID2!;

const notion = new Client({
    auth: NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({notionClient: notion});

// テスト用
export const getAllMetaData = async()=>{
    const posts = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        page_size: 100,
    });

    // 型ガードを使用して、PageObjectResponse型のみに絞り込む
    const allPosts = posts.results.filter(isFullPage);

    return allPosts;
}

export const getAllData = async () => {
    const posts = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        page_size: 100,
        filter:{
            property: "published",
            checkbox: {
                equals: true
            }
        },
        sorts: [
            {
                property: "date",
                direction: "descending"
            }
        ]
    });

    // 型ガードを使用して、PageObjectResponse型のみに絞り込む
    const allPosts = posts.results.filter(isFullPage);

    return allPosts;
};

export const getSinglePage = async (slug:string)=>{
    const response = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        filter: {
            property: 'slug',
            formula: {
                string:{
                    equals: slug,
                }
            }
        }
    });

    const page = response.results.find(isFullPage);
    if (!page) {
        throw new Error('Page not found');
      }

    const mdBlocks = await n2m.pageToMarkdown(page.id);

    return {
        page,
        mdBlocks
    }
};
