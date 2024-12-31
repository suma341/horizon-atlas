import { NUMBER_OF_POSTS_PER_PAGE } from "@/constants/constants";
import { getAllData, getSinglePage } from "../dataAccess/notionApiGateway";
import { PostMetaData } from "@/types/postMetaData";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { MdBlock } from "notion-to-md/build/types";

export const getAllPosts =async()=>{
    const allData = await getAllData();
    return allData.map((data)=>{
        return getPageMetaData(data);
    })
}

export const getSinglePost=async(slug:string)=>{
    const {page,mdBlocks} = await getSinglePage(slug);
    const metadata:PostMetaData = getPageMetaData(page);

    return {
        metadata,
        mdBlocks
    }
}

const getPageMetaData = (post: PageObjectResponse):PostMetaData => {

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
        date: date,
        tags: 'multi_select' in properties.tag ? getTags(properties.tag.multi_select) : [],
        slug:'rich_text' in properties.slug ? properties.slug.rich_text[0].plain_text : 'untitled',
        course:'select' in properties.course && properties.course.select ? properties.course.select.name : '',
        is_basic_curriculum:'checkbox' in properties.is_basic_curriculum ? properties.is_basic_curriculum.checkbox : false,
    };
};

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

export const getChildPage=(mdBlocks:MdBlock[])=>{
    const childPages = mdBlocks.filter((block)=>block.type==='child_page');
    return childPages;
}