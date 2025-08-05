import { PageDataGateway } from "../Gateways/PageDataGateway";
import { CurriculumGateway } from "../Gateways/CurriculumGateway";
import { pageNav } from "@/types/pageNav";
import { CurriculumService } from "./CurriculumService";
import { IconInfo } from "@/types/iconInfo";
import { PageBlockData } from "@/types/pageBlockData";
import { buildTree, processBlock } from "../pageDataToBlock";
import { PageData } from "@/types/pageData";

export class PageDataService{
    static getPageDataByPageId=async(pageId:string)=>{
        const pageDatas:PageData[] = await PageDataGateway.get("*",{"pageId":pageId})
        const sortedData = pageDatas.sort((a,b)=>a.order-b.order);
        const mdBlocks = buildTree(sortedData, pageId);
        const processedData = await Promise.all(mdBlocks.map(async(block)=>{
            return processBlock(block,mdBlocks);
        }))
        return processedData;
    }

    static getChildPageIds = async(type:string="child_page")=>{
        const pageDatas:{curriculumId:string,blockId:string}[] = await PageDataGateway.get(["curriculumId","blockId"],{"type":type});
        const pageIds = pageDatas.map((data)=>{
            return {
                curriculumId:data.curriculumId,
                pageId:data.blockId
            }
        })
        return pageIds;
    }

    static getBlockIdAndDataByCurriculumId=async(curriculumId:string)=>{
        const data:{blockId:string,data:string}[] = await PageDataGateway.get(["blockId","data"],{"curriculumId":curriculumId})
        return data
    }
    
    static getTitleAndIcon=async(pageId:string)=>{
        const data:{data:string}[] = await PageDataGateway.get("data",{blockId:pageId})
        const pageBlockData:PageBlockData = JSON.parse(data[0].data)
        const title = pageBlockData.parent.replace("##","")
        const iconUrl = pageBlockData.iconUrl;
        const iconType = pageBlockData.iconType;
        const coverUrl = pageBlockData.coverUrl;
        return {title,iconUrl,iconType,coverUrl};
    }

    static getChildrenData=async(pageId:string)=>{
        const pageId_:{pageId:string,curriculumId:string}[] = await PageDataGateway.get(["pageId","curriculumId"],{"blockId":pageId,"type":"child_page"});
        const children :{data:string,blockId:string,order:number}[]= await PageDataGateway.get(["data","blockId","order"],{"type":"child_page","pageId":pageId_[0].pageId});
        const parentTitle:string = pageId_[0].pageId === pageId_[0].curriculumId ?
        (await CurriculumGateway.get("title",{"curriculumId":pageId_[0].curriculumId}))[0].title :
         JSON.parse((await PageDataGateway.get("data",{"blockId":pageId_[0].pageId}))[0].data).parent.replace("##","")
         const sortedChildren = children.sort((a,b)=>a.order - b.order)
        const childrenData = sortedChildren.map((child)=>{
            return {
                title:JSON.parse(child.data).parent.replace("##",""),
                id:child.blockId
            };
        })
        return {title:parentTitle,childPages:childrenData};
    }

    static getPageNavs=async(pageId:string)=>{
        const curriculumId:string = (await PageDataGateway.get("curriculumId",{"blockId":pageId}))[0].curriculumId
        if(curriculumId===pageId){
            return []
        }
        let currentPage = pageId;
        const pages:pageNav[] = [];
        while(currentPage!==curriculumId){
            const parentPage:{blockId:string,data:string,pageId:string}[] = await PageDataGateway.get(["pageId","blockId","data"],{"blockId":currentPage})
            pages.push({link:`/posts/curriculums/${curriculumId}/${parentPage[0].blockId}`,title:JSON.parse(parentPage[0].data).parent.replace("##","")})
            currentPage = parentPage[0].pageId;
        }
        return pages
    }

    static getPageTitle=async(pageId:string)=>{
        const title:{data:string}[] = await PageDataGateway.get("data",{"blockId":pageId})
        return title[0].data.slice(3);
    }

    static getAllBlockId=async(curriculumId:string)=>{
        const id:{blockId:string}[] = await PageDataGateway.get("blockId",{"curriculumId":curriculumId})
        return id.map((data)=>data.blockId)
    }

    static getPageIcon=async(pageId:string):Promise<IconInfo>=>{
        const allCurriculum = await CurriculumService.getAllCurriculum()
        for(const curriculum of allCurriculum){
            if(curriculum.curriculumId===pageId){
                return {
                    iconType:curriculum.iconType,
                    iconUrl:curriculum.iconUrl,
                    pageId
                }
            }
        }
        const blocks:{data:string,pageId:string}[] = await PageDataGateway.get(["data","pageId"],{type:"child_page"})
        for(const block of blocks){
            if(block.pageId===pageId){
                const data:PageBlockData = JSON.parse(block.data)
                return {
                    iconType:data.iconType,
                    iconUrl:data.iconUrl,
                    pageId
                }
            }
        }
        return {
            iconType:"",
            iconUrl:"",
            pageId
        }
    }
}