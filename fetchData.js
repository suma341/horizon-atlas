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

const getAllData = async () => {
    const posts = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        page_size: 100,
        filter: {
            property: "published",
            checkbox: {
                equals: true,
            },
        },
    });

    const allPosts = posts.results.filter(isFullPage);
    // return allPosts.map(getPageMetaData);
    return allPosts
};

const getSingleData = async (title) => {
    const posts = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        page_size: 100,
        filter: {
            property: 'title',
            formula: { string: { equals: title } }
        }
    });

    const allPosts = posts.results.filter(isFullPage);
    return allPosts.map(getPageMetaData);
    // return allPosts
};

const getPageMetaData = (post) => {
    const getTags = (tags) => tags.map(tag => tag.name || "");
    const getVisibilities = (visibilities) => visibilities.map(visibility=> visibility.name || "");
    const properties = post.properties;

    return {
        id: post.id,
        title: properties.title?.title?.[0]?.plain_text || "untitled",
        tags: properties.tag?.multi_select ? getTags(properties.tag.multi_select) : [],
        category: properties.category?.select?.name || "",
        is_basic_curriculum: properties.is_basic_curriculum?.checkbox || false,
        visibility: properties.visibility?.multi_select ? getVisibilities(properties.visibility.multi_select) : [],
        order:properties.order.number
    };
};

const getSinglePage = async (title) => {
    const response = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        filter: {
            property: 'title',
            formula: { string: { equals: title } }
        }
    });

    const page = response.results.find(isFullPage);
    if (!page) throw new Error('Page not found');
    const mdBlocks =  await n2m.pageToMarkdown(page.id);
    return {
        mdBlocks,
        pageId:page.id
    };
    // return page
};

const getPageData = async (title) => {
    const res = await notion.databases.retrieve({
        database_id: NOTION_DATABASE_ID,
    });

    return res.id
};

const getSinglePageData = async (pageId) => {
    const response = await notion.pages.retrieve({
        page_id: pageId,
      });
      const utcDate = new Date(response.last_edited_time);
    return utcDate.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
};

const getSingleblock = async (blockId) => {
    const response = await notion.blocks.retrieve({
        block_id:blockId
      });
      return {
        parent:response[response.type].rich_text.map((text)=>{
            return {
                annotations:text.annotations,
                plain_text:text.plain_text,
                href:text.href
            }
        }),
        color:response[response.type].color,
        is_toggleable:response[response.type].is_toggleable
    }
};

// getAllData().then(data=>{console.log(data)})


// getAllData().then(data=>{
//     console.log(data);
//     fs.writeFileSync(`./public/notion_data/eachPage/${slug}/iframeData/${block.blockId}.json`, JSON.stringify(saveData, null, 2));
// })

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const l = [];

function writeBlock(block){
    getSingleblock(block.blockId).then(data_=>{
        l.push(data_)
    })
    if(block.children.length!==0){
        block.children.map((child)=>{
            writeBlock(child)
        })
    }
}

// getSinglePage("test").then(async(data)=>{
//     const blocks = [];
//     for(const block of data.mdBlocks){
//         const blockdata = await getSingleblock(block.blockId)
//         blocks.push(blockdata)
//     }
//     fs.writeFileSync(`./public/notion_data/page.json`, JSON.stringify(blocks, null, 2));
// })

// getSinglePage("test").then(async({pageId})=>{
//     console.log(pageId)
//     const data = await getSinglePageData(pageId)
//     console.log(data)
//     fs.writeFileSync(`./public/notion_data/page.json`, JSON.stringify(data, null, 2))
// })

getSinglePage("test").then(async({mdBlocks})=>{
    const a = [];
    for(const block of mdBlocks){
        const item = await getSingleblock(block.blockId)
        a.push(item)
    }
    fs.writeFileSync(`./public/notion_data/class.json`, JSON.stringify(a, null, 2))
})

// getAllData().then(data=>fs.writeFileSync(`./public/notion_data/class.json`, JSON.stringify(data, null, 2)))
