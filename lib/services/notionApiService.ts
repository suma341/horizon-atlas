import { NUMBER_OF_POSTS_PER_PAGE } from "@/constants/constants";
import { getAllPosts, getSinglePost } from "../dataAccess/notionApiGateway";
import { PostMetaData } from "@/types/postMetaData";
import { MdBlock } from "notion-to-md/build/types";
import { PageBlock } from "@/types/PageBlock";

export const getAllPageBlocks =async()=>{
    const allPosts = await getAllPosts();
    const postsMdBlocks = await Promise.all(
        allPosts.map(async(post)=>{
            return (await getSinglePost(post.slug)).mdBlocks;
        })
    ) 
    const childPages =await Promise.all( allPosts.map(async(post)=>{
        const singlePost = await getSinglePost(post.slug);
        const childPages = singlePost.mdBlocks.filter((block)=>block.type==='child_page')
        return childPages;
    }))
    const combined = postsMdBlocks.flat().concat(childPages.flat());
    const pageBlockData = combined.map((page)=>{
        const pageBlock = convertToPageBlock(page);
        return pageBlock;
    })
    return pageBlockData;
}

// export const getParentPageBlock=(pageBlock:PageBlock)=>{

// }

export const convertToPageBlock=(mdPageBlock:MdBlock)=>{
    const pageBlock:PageBlock = {
        id: mdPageBlock.blockId,
        // parentPageId: ,
        title: mdPageBlock.parent,
        mdBlocks:mdPageBlock.children,
    }
    return pageBlock;
}

export const getPageBlockById=async(targetId:string)=>{
    const allChildPages = await getAllPageBlocks();
    const targetPage = allChildPages.filter((page)=>page.id===targetId);
    return targetPage[0];
}

export const getChildPageBlocks=async(parentPageId:string)=>{
    const parentPageBlock = await getPageBlockById(parentPageId);
    
    const childPageBlocks = parentPageBlock.mdBlocks.filter((block)=>
        block.type === 'child_page'
    );
    const pageBlockData = childPageBlocks.map((block)=>
        convertToPageBlock(block))
    return pageBlockData;
}

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