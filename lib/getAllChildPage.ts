import { PostMetaData } from "@/types/postMetaData";
import { MdBlock } from "notion-to-md/build/types";

type ChildPageData={
    type:string,
    blockId:string,
    parent:string,
    curriculumId:string
}

export async function getAllChildPage(){
    const res_posts = await fetch("/horizon-atlas/notion_data/notionDatabase.json");
    const posts:PostMetaData[] = await res_posts.json();
    const childPageData:ChildPageData[] = [];
    for(const post of posts){
        const res_page = await fetch(`/horizon-atlas/notion_data/eachPage/${post.curriculumId}.json`)
        const page:MdBlock[] = await res_page.json();
        const child_pages = page.filter(item=>item.type==="child_page");
        const child_page_metadata = child_pages.map((page)=>{
            return {
                type:page.type!,
                blockId:page.blockId,
                parent:page.parent,
                curriculumId:post.curriculumId
            }
        })
        child_page_metadata.map((child)=>{
            childPageData.push(child);
        })
    }
    return childPageData;
}