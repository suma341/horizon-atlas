import { PageDataGateway } from "../Gateways/PageDataGateway";
import { pageNav } from "@/types/pageNav";
import { buildTree } from "../pageDataToBlock";
import PageInfoSvc from "./PageInfoSvc";
import { PageInfo } from "@/types/page";
import { MdBlock } from "@/types/MdBlock";

export class PageDataService{
    static getPageDataByPageId=async(pageId:string): Promise<MdBlock[]>=>{
        const pageDatas = await PageDataGateway.get(pageId)
        if (pageDatas.length === 0) return [];
        const sortedData = pageDatas.sort((a,b)=>a.order-b.order);
        try{
            const mdBlocks = buildTree(sortedData, pageId);
            return mdBlocks;
        }catch(e){
            throw new Error(`🟥 error in getPageDataByPageId/${pageId}:${e}`)
        }
    }

    static getIsSamePageIdAndCurriculumId=async(pageId:string)=>{
        const page = await PageInfoSvc.getByPageId(pageId)
        if(page){
            if(page.id===page.curriculumId){
                return true
            }
        }
        return false
    }

    static getPageNavs=async(pageInfo:PageInfo)=>{
        if(pageInfo.parentId==="") return []
        let currentPage = pageInfo;
        const pages:pageNav[] = [{link:`/posts/curriculums/${pageInfo.id}`,title:pageInfo.title}];
        while(currentPage.parentId!==pageInfo.curriculumId){
            const parent = await PageInfoSvc.getByPageId(currentPage.parentId)
            if(parent){
                pages.push({link:`/posts/curriculums/${parent.id}`,title:parent.title})
                if(parent.parentId==="")break;
                currentPage = parent
            }else{
                break
            }
        }
        return pages
    }
}