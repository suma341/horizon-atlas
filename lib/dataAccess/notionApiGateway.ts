import { Client, isFullPage } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionToMarkdown } from "notion-to-md";
import { MdBlock } from "notion-to-md/build/types";
import NodeCache from "node-cache";

const NOTION_TOKEN = process.env.NOTION_TOKEN2!;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID2!;

const notion = new Client({
    auth: NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({notionClient: notion});

// テスト用
// export const getAllMetaData = async()=>{
//     const posts = await notion.databases.query({
//         database_id: NOTION_DATABASE_ID,
//         page_size: 100,
//     });

//     const allPosts = posts.results.filter(isFullPage);

//     return allPosts;
// }

const cache = new NodeCache({ stdTTL: 3600 });

export const getAllData = async () => {
    const cachedData = cache.get<PageObjectResponse[]>("allData");
    if (cachedData) {
        return cachedData;
    }

    const posts = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
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

    const allPosts = posts.results.filter(isFullPage);

    cache.set("allData", allPosts);
    console.log("allPosts");
    return allPosts;
};

type singlePageData = {
    data:{
        page: PageObjectResponse;
        mdBlocks: MdBlock[];
    }
    slug:string;
}

const cachedPageDatas:singlePageData[] = [];

export const getSinglePage = async (slug:string)=>{
    if(cachedPageDatas.length!==0){
        const matchData = cachedPageDatas.filter((data)=>data.slug===slug);
        if(matchData.length!==0){
            return {
                page:matchData[0].data.page, 
                mdBlocks:matchData[0].data.mdBlocks
            };
        }
    }

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

    cachedPageDatas.push({
        data:{page,mdBlocks},
        slug
    })

    console.log("loading single post...",slug)

    return {
        page,
        mdBlocks
    }
};
