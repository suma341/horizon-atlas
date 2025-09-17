import { PageDataGateway } from "../Gateways/PageDataGateway";
import { pageNav } from "@/types/pageNav";
import { buildTree, processBlock } from "../pageDataToBlock";
import { MdBlock } from "notion-to-md/build/types";
import PageInfoSvc from "./PageInfoSvc";
import { PageInfo } from "@/types/page";

export class PageDataService{
    static getPageDataByPageId=async(pageId:string,curriculumId:string): Promise<MdBlock[]>=>{
        
        const pageDatas = await PageDataGateway.get(pageId)
        if (pageDatas.length === 0) return [];
        const sortedData = pageDatas.sort((a,b)=>a.order-b.order);
        const mdBlocks = buildTree(sortedData, pageId);
        const processedData = await Promise.all(
            mdBlocks.map(async (block) => {
                try{
                    return processBlock(block, mdBlocks,curriculumId);
                }catch(e){
                    throw new Error(`error in ${pageId} at ${block}:${e}`)
                }
            })
        );
        return processedData;
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