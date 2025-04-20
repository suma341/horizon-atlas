import "dotenv/config";
import { Client, isFullPage } from "@notionhq/client";

const NOTION_TOKEN = process.env.NOTION_TOKEN_HORIZON;
const NOTION_DATABASE_ID = process.env.NOTION_DB_ID_HORIZON;

const notion = new Client({ auth: NOTION_TOKEN });

export const getCurriculumEditTime = async () => {
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
    return allPosts.map((post)=>{return {id:post.id,Last_edited_time:post.last_edited_time}});
};

export const getAllData = async () => {
    const posts = await notion.databases.query({
        database_id:db,
    });

    const allPosts = posts.results;
    return allPosts.map(getPageMetaData);
};

const getPageMetaData = (post) => {
    const getTags = (tags) => tags.map(tag => tag.name || "");
    const getVisibilities = (visibilities) => visibilities.map(visibility=> visibility.name || "");
    const properties = post.properties;

    return {
        id: post.id,
        cover:post.cover,
        icon:post.icon,
        title: properties.title?.title?.[0]?.plain_text || "untitled",
        tags: properties.tag?.multi_select ? getTags(properties.tag.multi_select) : [],
        category: properties.category?.select?.name || "",
        is_basic_curriculum: properties.is_basic_curriculum?.checkbox || false,
        visibility: properties.visibility?.multi_select ? getVisibilities(properties.visibility.multi_select) : [],
        order:properties.order.number
    };
};

export const getPage = async (id) => {
    const posts = await notion.pages.retrieve({
        page_id:id,
    })

    return posts
};

export const getBlocks = async (id) => {
    const posts = await notion.blocks.children.list({
        block_id:id
    })
    return posts
};