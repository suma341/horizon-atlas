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

export const getBasicCourses = async(basicPosts:PostMetaData[])=>{
    const BasicCourses = getAllCourses(basicPosts);
    return BasicCourses;
}

export const courseIsBasic=async(course:string,posts:PostMetaData[])=>{
    const filteredPost = posts.filter((post)=>post.is_basic_curriculum)
    if(filteredPost.length===0){
        return false;
    }
    return true;
}
