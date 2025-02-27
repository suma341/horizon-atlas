import { PostMetaData } from "@/types/postMetaData";
import { CurriculumService } from "./services/CurriculumService";
import { PageDataService } from "./services/PageDataService";
import { PageData } from "@/types/pageData";
// import { getPage } from "./services/PageService";

type Page ={
    pageId:string;
    isChildPage:boolean;
    title:string;
    slug:string;
}

export async function searchPageById(id:string):Promise<Page>{
    const curriculumService = new CurriculumService();
    const pageDataService = new PageDataService();
    const posts:PostMetaData[] = await curriculumService.getAllCurriculum();
    for(const post of posts){
        if(id === post.id || id===post.id.replaceAll("-", "")){
            return {
                pageId:post.slug,
                isChildPage:false,
                title:post.title,
                slug:post.slug
            }
        }
        const page:PageData[] = await pageDataService.getPageDataBySlug(post.slug);
        for(const block of page){
            if(block.blockId===id || id===block.blockId.replaceAll("-","")){
                return {
                    pageId:block.blockId,
                    isChildPage:true,
                    title:block.data.slice(2),
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