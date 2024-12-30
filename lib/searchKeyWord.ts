import { PostMetaData } from "@/types/postMetaData";
import { getAllPosts } from "./dataAccess/notionApiGateway";
import { getAllTags, getPostsByTag } from "./services/notionApiService";

export const createSearchQuery=(text:string)=>{
    const keywords = text.split(/[ 　,、]/).filter(item => item.trim() !== "");
    const query = keywords.join('&');
    return query
}

export const searchByKeyWord=async(keyWords:string)=>{
    const keywordsArr:string[] = keyWords.split("&");
    const allPosts:PostMetaData[] = await getAllPosts();
    const matchPosts:PostMetaData[] = [];
    for(const word of keywordsArr){
        for(const post of allPosts){
            if(post.title.toLowerCase().includes(word.toLowerCase()) || 
                post.slug.toLowerCase().includes(word.toLocaleLowerCase())){
                matchPosts.push(post);
            }
        }
    }
    return matchPosts;
}