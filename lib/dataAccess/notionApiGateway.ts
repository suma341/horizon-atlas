import { PostMetaData } from "@/types/postMetaData";
import { Client, isFullPage, } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({
    auth: process.env.NOTION_TOKEN2,
});

const n2m = new NotionToMarkdown({notionClient: notion});

// テスト用
export const getAllMetaData = async()=>{
    const posts = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID!,
        page_size: 100,
    });

    // 型ガードを使用して、PageObjectResponse型のみに絞り込む
    const allPosts = posts.results.filter(isFullPage);

    return allPosts;
}

export const getAllPosts = async () => {
    const posts = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID2!,
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

    // return allPosts;

    return allPosts.map((post) => {
        return getPageMetaData(post);
    });
};

const getPageMetaData = (post: PageObjectResponse):PostMetaData => {

    const getTags = (tags:Array<object>)=>{
        const allTags = tags.map((tag)=>{
            return 'name' in tag && typeof tag.name == 'string' ? tag.name : '';
        });
        return allTags;
    }
    const properties = post.properties;
    const date:string =  'date' in properties.date && 'start' in properties.date.date! && typeof properties.date.date.start == 'string' ?properties.date.date.start :'';

    return {
        id: post.id,
        title:'title' in properties.title ? properties.title.title[0].plain_text : 'untitled',
        date: date,
        tags: 'multi_select' in properties.tag ? getTags(properties.tag.multi_select) : [],
        slug:'rich_text' in properties.slug ? properties.slug.rich_text[0].plain_text : 'untitled',
        course:'select' in properties.course && properties.course.select ? properties.course.select.name : '',
        is_basic_curriculum:'checkbox' in properties.is_basic_curriculum ? properties.is_basic_curriculum.checkbox : false,
    };
};

export const getSinglePost = async (slug:string)=>{
    const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID2!,
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
    const metadata:PostMetaData = getPageMetaData(page);

    const mdBlocks = await n2m.pageToMarkdown(page.id);

    return {
        metadata,
        mdBlocks
    }
};
