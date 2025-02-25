import { Client, isFullPage } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import fs from "fs";
import path from "path";
import axios from "axios";
import ogs from "open-graph-scraper";
import "dotenv/config"

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

const IFRAMELY_API_KEY = process.env.IFRAMELY_API_KEY;

const notion = new Client({ auth: NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

export const getAllData = async () => {
    const posts = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        page_size: 100,
        filter: {
            property: "published",
            checkbox: {
                equals: true,
            },
        },
        sorts: [{ property: "date", direction: "ascending" }],
    });

    const allPosts = posts.results.filter(isFullPage);
    return allPosts.map(getPageMetaData);
};

const getPageMetaData = (post) => {
    const getTags = (tags) => tags.map(tag => tag.name || "");
    const getVisibilities = (visibilities) => visibilities.map(visibility=> visibility.name || "");
    const properties = post.properties;
    const date = properties.date?.date?.start || "";
    const icon = properties.icon?.files?.[0]?.file?.url || "";

    return {
        id: post.id,
        title: properties.title?.title?.[0]?.plain_text || "untitled",
        date,
        tags: properties.tag?.multi_select ? getTags(properties.tag.multi_select) : [],
        slug: properties.slug?.rich_text?.[0]?.plain_text || "untitled",
        category: properties.category?.select?.name || "",
        is_basic_curriculum: properties.is_basic_curriculum?.checkbox || false,
        icon,
        visibility: properties.visibility?.multi_select ? getVisibilities(properties.visibility.multi_select) : []
    };
};

export const getSinglePage = async (slug) => {
    const response = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        filter: {
            property: 'slug',
            formula: { string: { equals: slug } }
        }
    });

    const page = response.results.find(isFullPage);
    if (!page) throw new Error('Page not found');

    return await n2m.pageToMarkdown(page.id);
};

getAllData().then(data=>{
    console.log(data);
})