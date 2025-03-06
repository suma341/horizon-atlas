import { CurriculumService } from "./services/CurriculumService";
import { PageDataService } from "./services/PageDataService";
// import { getPage } from "./services/PageService";

type Page ={
    pageId:string;
    isChildPage:boolean;
    title:string;
    curriculumId:string;
}

export async function searchPageById(id:string):Promise<Page>{
    const posts = await CurriculumService.getIdAndTitle();
    for(const post of posts){
        if(id === post.curriculumId || id===post.curriculumId.replaceAll("-", "")){
            return {
                pageId:post.curriculumId,
                isChildPage:false,
                title:post.title,
                curriculumId:post.curriculumId
            }
        }
        const blockIdAndData = await PageDataService.getBlockIdAndDataByCurriculumId(post.curriculumId);
        for(const block of blockIdAndData){
            if(block.blockId===id || id===block.blockId.replaceAll("-","")){
                return {
                    pageId:block.blockId,
                    isChildPage:true,
                    title:block.data.slice(2),
                    curriculumId:post.curriculumId
                }
            }
        }
    }
    return {
        pageId:"",
        isChildPage:false,
        title:"",
        curriculumId:""
    }
    
}