import { NUMBER_OF_POSTS_PER_PAGE } from "@/constants/constants";
import { getAllPosts } from "../dataAccess/notionApiGateway";
import { PostMetaData } from "@/types/postMetaData";

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

export const getPostsByTag=async(tagName:string)=>{
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