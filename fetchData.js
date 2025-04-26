import { Client, isFullPage } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import fs from "fs";
import path from "path";
import axios from "axios";
import ogs from "open-graph-scraper";
import "dotenv/config"

const NOTION_TOKEN = process.env.NOTION_TOKEN_HORIZON;
const NOTION_DATABASE_ID = process.env.NOTION_DB_ID_HORIZON;

const IFRAMELY_API_KEY = process.env.IFRAMELY_API_KEY;

const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;

const notion = new Client({ auth: NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

const getEditTimeData = async () => {
    const posts = await notion.databases.query({
        database_id:NOTION_DATABASE_ID,
        filter: {
            property: "published",
            checkbox: {
                equals: true,
            },
        }
    });

    const allPosts = posts.results.filter(isFullPage);
    return allPosts
};

export const getSinglePage = async (title) => {
    const response = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        filter: {
            property: 'title',
            formula: { string: { equals: title } }
        }
    });

    const pageIds = response.results.map(page => page.id);
    const page = response.results.find(isFullPage);
    if (!page) throw new Error('Page not found');

    const mdBlocks =  await n2m.pageToMarkdown(page.id);
    return {
        mdBlocks,
        pageId:pageIds[0]
    }
};

const get = async (id) => {
    const posts = await notion.blocks.children.list({
        "block_id":id
    })
    const a = posts.results
    return a
};

const getEditTime = (post) => {
    const date = new Date(post.last_edited_time)

    return {
        id: post.id,
        Last_edited_time:post.last_edited_time
    };
};

const getPageDataByConditions=async(select,match)=>{
    const res = await fetch(`${SUPABASE_URL}/functions/v1/getPageDataWithSelect`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        },
        body:JSON.stringify({
            match,
            select
        })
    })
    const data = await res.json()
    return data;
}

const getAllBlockId=async(curriculumId)=>{
    const data = await getPageDataByConditions("*",{"curriculumId":curriculumId,"type":"child_page"})
    return data
}

const getPage = async (id) => {
    const posts = await notion.pages.retrieve({
        page_id:id,
    })

    return posts
};

`https://www.notion.so/test-1ada501ef337818bb108d75c192b26c9?pvs=4#1e1a501ef33780b0bdb5c655f79df2ae`

getSinglePage("test").then(async(id)=>{
    const posts = await get(id.pageId)
    if(posts[0].has_children){
        const a = await get(posts[0].id)
        posts.push(...a)
    }
    fs.writeFileSync(`./public/notion_data/class.json`, JSON.stringify(posts, null, 2))
})