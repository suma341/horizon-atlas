import { CurriculumService } from "./services/CurriculumService";
import { PageDataService } from "./services/PageDataService";

type Page ={
    pageId:string;
    title:string;
    curriculumId:string;
}

interface data{
    parent:string;
}

export async function searchPageById(id:string):Promise<Page>{
    const posts = await CurriculumService.getIdAndTitle();
    for(const post of posts){
        if(id === post.curriculumId || id===post.curriculumId.replaceAll("-", "")){
            return {
                pageId:post.curriculumId,
                title:post.title,
                curriculumId:post.curriculumId
            }
        }
        const blockIdAndData = await PageDataService.getBlockIdAndDataByCurriculumId(post.curriculumId);
        for(const block of blockIdAndData){
            if(block.blockId===id || id===block.blockId.replaceAll("-","")){
                const title:data = JSON.parse(block.data)
                return {
                    pageId:block.blockId,
                    title:title.parent.replace("##",""),
                    curriculumId:post.curriculumId
                }
            }
        }
    }
    return {
        pageId:"",
        title:"",
        curriculumId:""
    }
    
}