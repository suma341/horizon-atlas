import { NUMBER_OF_POSTS_PER_PAGE } from '@/constants/constants';
import { PostMetaData } from '@/types/postMetaData';
import { Client, isFullPage } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { NotionToMarkdown } from 'notion-to-md';

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
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
        database_id: process.env.NOTION_DATABASE_ID!,
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

const getPageMetaData = (post: PageObjectResponse) => {

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
        description:'rich_text' in properties.description ? properties.description.rich_text[0].plain_text : '',
        date: date,
        tags: 'multi_select' in properties.tag ? getTags(properties.tag.multi_select) : [],
        slug:'rich_text' in properties.slug ? properties.slug.rich_text[0].plain_text : 'untitled',
    };
};

export const getSinglePost = async (slug:string)=>{
    const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID!,
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
    const metadata = getPageMetaData(page);

    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdBlocks);
    console.log(mdString);

    return {
        metadata,
        markdown: mdString,
    }
};

// トップページ用のデータ取得
export const getPostsForTopPage=async(pageSize=4)=>{
    const allPosts = await getAllPosts();
    const fourPosts = allPosts.slice(0, pageSize);
    return fourPosts;
};

// ページ番号に応じた記事取得
export const getPostsByPage=async(page:number)=>{
    const allPosts = await getAllPosts();

    const startIndex = (page - 1) * NUMBER_OF_POSTS_PER_PAGE;

    const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE;
    
    return allPosts.slice(startIndex, endIndex);
};

const calculatePageNumber = (posts:PostMetaData[]) => {
    const pageNumber = 
        (posts.length % NUMBER_OF_POSTS_PER_PAGE) != 0 ?
        Math.trunc(posts.length / NUMBER_OF_POSTS_PER_PAGE) + 1 :
        Math.trunc(posts.length / NUMBER_OF_POSTS_PER_PAGE);

    return pageNumber;
}

const getPostsByTag=async(tagName:string)=>{
    const allPosts = await getAllPosts();
    const posts:PostMetaData[] = allPosts.filter((post)=> {
        return post.tags.find((tag:string)=>tag.toLowerCase()==tagName.toLowerCase())
    });
    return posts;
}

export const getNumberOfPages=async(tagName:string|null=null)=>{
    if(tagName==null){
        const allPosts = await getAllPosts();
        return calculatePageNumber(allPosts);
    }else{
        const posts = await getPostsByTag(tagName);
        return calculatePageNumber(posts);
    }
};

export const getPostsByTagAndPage=async(tagName:string, page:number)=>{
    const posts = await getPostsByTag(tagName);

    const startIndex = (page - 1) * NUMBER_OF_POSTS_PER_PAGE;
    const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE;
    
    return posts.slice(startIndex, endIndex);
}

export const getAllTags = async()=>{
    const allPosts = await getAllPosts();
    
    const allTagsDuplicationList = allPosts.flatMap((post)=>{
        return post.tags;
    })
    const set = new Set(allTagsDuplicationList);
    const allTags = Array.from(set);

    return allTags;
}