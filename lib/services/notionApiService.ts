import { NUMBER_OF_POSTS_PER_PAGE } from "@/constants/constants";
import { getAllPosts } from "../dataAccess/notionApiGateway";
import { PostMetaData } from "@/types/postMetaData";

// ページ番号に応じた記事取得
export const getPostsByPage=async(page:number)=>{
    const allPosts:PostMetaData[] = await getAllPosts();

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
    const allPosts:PostMetaData[] = await getAllPosts();
    const posts:PostMetaData[] = allPosts.filter((post)=> {
        return post.tags.find((tag:string)=>tag.toLowerCase()==tagName.toLowerCase())
    });
    return posts;
}

export const getNumberOfPages=async(tagName?:string, course?:string)=>{
    if(tagName!==undefined){
        const posts = await getPostsByTag(tagName);
        return calculatePageNumber(posts);
    }else if(course!==undefined){
        const posts = await getPostsByCourse(course);
        return calculatePageNumber(posts);
    }else{
        const allPosts = await getAllPosts();
        return calculatePageNumber(allPosts);
    }
};

export const getPostsByTagAndPage=async(tagName:string, page:number)=>{
    const posts:PostMetaData[] = await getPostsByTag(tagName);

    const startIndex = (page - 1) * NUMBER_OF_POSTS_PER_PAGE;
    const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE;
    
    return posts.slice(startIndex, endIndex);
}

export const getAllTags = async()=>{
    const allPosts:PostMetaData[] = await getAllPosts();
    
    const allTagsDuplicationList = allPosts.flatMap((post)=>{
        return post.tags;
    })
    const set = new Set(allTagsDuplicationList);
    const allTags = Array.from(set);

    return allTags;
}

export const getClassifyPost=async()=>{
    const allPosts:PostMetaData[] = await getAllPosts();

    const basic = allPosts.filter((post)=>post.is_basic_curriculum);
    const notBasic = allPosts.filter((post)=>!post.is_basic_curriculum);

    return {
        basic,
        notBasic
    } 
}

export const getPostsByCourse=async(course:string)=>{
    const AllPosts:PostMetaData[] = await getAllPosts();
    const postByCourse = AllPosts.filter((post)=>post.course===course);
    return postByCourse;
}

export const getAllCourses = async()=>{
    const allPosts:PostMetaData[] = await getAllPosts();
    const allCoursesDuplication = allPosts.map((post)=>{
        return post.course;
    })
    const set = new Set(allCoursesDuplication);
    const allCourses = Array.from(set);
    return allCourses;
}

export const getEitherCourses = async(isBasic:boolean)=>{
    const classifiedPost = await getClassifyPost();
    const post = isBasic ? classifiedPost.basic : classifiedPost.notBasic;
    const allCoursesDuplication = post.map((post)=>{
        return post.course;
    })
    const set = new Set(allCoursesDuplication);
    const allCourses = Array.from(set);
    return allCourses;
}

export const getPostsByCourseAndPage=async(course:string, page:number)=>{
    const posts:PostMetaData[] = await getPostsByCourse(course);

    const startIndex = (page - 1) * NUMBER_OF_POSTS_PER_PAGE;
    const endIndex = startIndex + NUMBER_OF_POSTS_PER_PAGE;
    
    return posts.slice(startIndex, endIndex);
}

export const courseIsBasic=async(course:string)=>{
    const posts:PostMetaData[] = await getPostsByCourse(course);
    const filteredPost = posts.filter((post)=>post.is_basic_curriculum)
    if(filteredPost.length===0){
        return false;
    }
    return true;
}