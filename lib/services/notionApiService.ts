import { NUMBER_OF_POSTS_PER_PAGE } from "@/constants/numberOfPage";
import { PostMetaData } from "@/types/postMetaData";
import { MdBlock } from "notion-to-md/build/types";

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

export const getPostsByRole=async(roleName:string,allPosts:PostMetaData[])=>{
    const posts:PostMetaData[] = allPosts.filter((post)=>{
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

export const getIconsByPosts=(posts:PostMetaData[])=>{
    const iconsDuplicationList = posts.map((post)=>{
        return post.icon;
    })
    const set = new Set(iconsDuplicationList);
    const icons = Array.from(set);

    return icons;
}

const getClassifyPost=async(allPosts:PostMetaData[])=>{

    const basic = allPosts.filter((post)=>post.is_basic_curriculum);
    const notBasic = allPosts.filter((post)=>!post.is_basic_curriculum);

    return {
        basic,
        notBasic
    } 
}

export const getPostsByCourse=async(course:string,allPosts:PostMetaData[])=>{
    const postByCourse = allPosts.filter((post)=>post.category===course);
    return postByCourse;
}

export const getAllCourses = async(allPosts:PostMetaData[])=>{
    const allCoursesDuplication = allPosts.map((post)=>{
        return post.category;
    })
    const set = new Set(allCoursesDuplication);
    const allCourses = Array.from(set);
    return allCourses;
}

export const getEitherCourses = async(isBasic:boolean,allPosts:PostMetaData[])=>{
    const classifiedPost = await getClassifyPost(allPosts);
    const post = isBasic ? classifiedPost.basic : classifiedPost.notBasic;
    const allCoursesDuplication = post.map((post)=>{
        return post.category;
    })
    const set = new Set(allCoursesDuplication);
    const allCourses = Array.from(set);
    return allCourses;
}

export const courseIsBasic=async(course:string,allPosts:PostMetaData[])=>{
    const posts:PostMetaData[] = await getPostsByCourse(course,allPosts);
    const filteredPost = posts.filter((post)=>post.is_basic_curriculum)
    if(filteredPost.length===0){
        return false;
    }
    return true;
}

export const getChildPage=(mdBlocks:MdBlock[])=>{
    const childPages = mdBlocks.filter((block)=>block.type==='child_page');
    return childPages;
}