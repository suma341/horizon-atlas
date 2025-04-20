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
    return allPosts.map(getEditTime);
};

const get = async () => {
    const posts = await notion.pages.retrieve({
        block_id:"1d8a501e-f337-8069-a0ad-d310f53524d0"
    })
    fs.writeFileSync(`./notion_last_edit/curriculum.json`, JSON.stringify(posts.results, null, 2))
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

getEditTimeData().then((data)=>{
    const re = getAllBlockId(data[0].id)
    fs.writeFileSync(`./notion_last_edit/curriculum.json`, JSON.stringify(re, null, 2))
})