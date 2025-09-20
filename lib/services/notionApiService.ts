import { NUMBER_OF_POSTS_PER_PAGE } from "@/constants/numberOfPage";
import { PageInfo } from "@/types/page";
import { PostMetaData } from "@/types/postMetaData";

export const calculatePageNumber = (posts:PostMetaData[]) => {
    const pageNumber = 
        (posts.length % NUMBER_OF_POSTS_PER_PAGE) != 0 ?
        Math.trunc(posts.length / NUMBER_OF_POSTS_PER_PAGE) + 1 :
        Math.trunc(posts.length / NUMBER_OF_POSTS_PER_PAGE);

    return pageNumber;
}

export const getPostsByTag=async(tagName:string, allPosts:PostMetaData[])=>{
    const posts:PostMetaData[] = allPosts.filter((post)=> {
        return post.tags.find((tag:string)=>tag.toLowerCase()==tagName.toLowerCase())
    });
    return posts;
}

export const getPostsByRole=async(roleName:string,pageAndMetadata:(PostMetaData & PageInfo)[] | PostMetaData[])=>{
    if(roleName==="幹事長" || roleName==="技術部員"){
        return pageAndMetadata
    }
    const posts = pageAndMetadata.filter((post)=>{
        return post.visibility.find((vis:string)=>vis===roleName);
    })
    return posts;
}

export const getAllTags = async(allPosts:PostMetaData[])=>{
    
    const allTagsDuplicationList = allPosts.flatMap((post)=>{
        return post.tags;
    })
    const set = new Set(allTagsDuplicationList);
    const allTags = Array.from(set);

    return allTags;
}