import { Client, isFullPage } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import fs from "fs";
import path from "path";
import axios from "axios";
import ogs from "open-graph-scraper";
import "dotenv/config"

const NOTION_TOKEN = process.env.NOTION_TOKEN_HORIZON;
const NOTION_DATABASE_ID = process.env.NOTION_DB_ID_CATEGORY;

const IFRAMELY_API_KEY = process.env.IFRAMELY_API_KEY;

const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;

const notion = new Client({ auth: NOTION_TOKEN });

const getAllCategory = async () => {
    const posts = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
    });

    const allPosts = posts.results;
    // return allPosts
    return allPosts.map(getCategoryMetaData);
};

const getCategoryMetaData = (post) => {
    const properties = post.properties;

    return {
        id: post.id,
        cover:post.cover || "",
        icon:post.icon || "",
        title: properties.title?.title?.[0]?.plain_text || "untitled",
        description:properties.description.rich_text[0]?.plain_text || ""
    };
};

async function upsertCategory(categoryId, title, description, icon, cover){
    const url = `${SUPABASE_URL}/functions/v1/upsertCategory`;
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        },
        body:JSON.stringify({
            categoryId, title, description, icon, cover
        }),
    });
    const result = await res.json();
    console.log("upsertCategory",result);
}

getAllCategory("test").then(async(d)=>{
    await upsertCategory(d[0].id,d[0].title,d[0].description,d[0].icon,d[0].cover)

})