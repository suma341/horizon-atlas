import { PostMetaData } from "@/types/postMetaData";
import { MdBlock } from "notion-to-md/build/types";

type Page ={
    pageId:string;
    isChildPage:boolean;
    title:string;
    slug:string;
}

export async function searchPageById(id:string):Promise<Page>{
    const res_posts = await fetch("/horizon-atlas/notion_data/notionDatabase.json");
    const posts:PostMetaData[] = await res_posts.json();
    console.log(posts)
    for(const post of posts){
        if(id === post.id || id===post.id.replaceAll("-", "")){
            return {
                pageId:post.slug,
                isChildPage:false,
                title:post.title,
                slug:post.slug
            }
        }
        const res_page = await fetch(`/horizon-atlas/notion_data/eachPage/${post.slug}/page.json`);
        const page:MdBlock[] = await res_page.json();
        for(const block of page){
            if(block.blockId===id || id===block.blockId.replaceAll("-","")){
                return {
                    pageId:block.blockId,
                    isChildPage:true,
                    title:block.parent.slice(2),
                    slug:post.slug
                }
            }
        }
    }
    return {
        pageId:"",
        isChildPage:false,
        title:"",
        slug:""
    }
    
}