import { PageDataGateway } from "../Gateways/PageDataGateway";
import { CurriculumGateway } from "../Gateways/CurriculumGateway";
import { pageNav } from "@/types/pageNav";
import { IconInfo } from "@/types/iconInfo";
import { PageBlockData } from "@/types/pageBlockData";
import { buildTree, processBlock } from "../pageDataToBlock";
import { PageData } from "@/types/pageData";
import { MdBlock } from "notion-to-md/build/types";
import { LinkToPageBlock } from "@/types/mdBlocks";

export class PageDataService{
    static getPageDataByPageId=async(pageId:string,curriculumId:string): Promise<MdBlock[]>=>{
        const pageDatas:PageData[] = await PageDataGateway.get("*",{"pageId":pageId})
        if (pageDatas.length === 0) return [];

        const sortedData = pageDatas.sort((a,b)=>a.order-b.order);
        const mdBlocks = buildTree(sortedData, pageId);
        const processedData = await Promise.all(
            mdBlocks.map(async (block) => {
            return processBlock(block, mdBlocks,curriculumId);
            })
        );
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
        const curr:{iconType:string,title:string,iconUrl:string,coverUrl:string}[] = await CurriculumGateway.get(["iconType","title","iconUrl","coverUrl"],{"curriculumId":pageId})
        if(curr.length!==0){
            const {title,iconUrl,iconType,coverUrl} = curr[0]
            return {title,iconUrl,iconType,coverUrl}
        }
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
        const curriculums:{iconType:string,iconUrl:string}[] = await CurriculumGateway.get(["iconType","iconUrl"],{"curriculumId":pageId})
        if(curriculums.length!==0){
            return {
                ...curriculums[0],
                pageId
            }
        }
        const blocks:{data:string}[] = await PageDataGateway.get(["data"],{type:"child_page","blockId":pageId})
        if(blocks.length!==0){
            const data:PageBlockData = JSON.parse(blocks[0].data)
            return {
                ...data,
                pageId
            }
        }
        return {
            iconType:"",
            iconUrl:"",
            pageId
        }
    }

    static getLinkToPageData=async(pageId:string):Promise<LinkToPageBlock>=>{
        const curriculum:{curriculumId:string,title:string,iconType:string,iconUrl:string}[] = await CurriculumGateway.get(["curriculumId","title","iconType","iconUrl"],{"curriculumId":pageId})
        if(curriculum.length!==0){
            const link =`/posts/curriculums/${curriculum[0].curriculumId}/${pageId}`
            return {link,title:curriculum[0].title,iconUrl:curriculum[0].iconUrl,iconType:curriculum[0].iconType}
        }
        const pageData:{curriculumId:string,data:string}[] = await PageDataGateway.get(["data","curriculumId"],{"blockId":pageId})
        if(pageData.length!==0){
            const link =`/posts/curriculums/${pageData[0].curriculumId}/${pageId}`
            const data:PageBlockData = JSON.parse(pageData[0].data)
            return {link,title:data.parent,iconUrl:data.iconUrl,iconType:data.iconType}
        }
        return {link:"",title:"",iconUrl:"",iconType:""}
    }

    static getChildBlock=async(blockId:string)=>{
        const data:PageData[] = await PageDataGateway.get("*",{"parentId":blockId})
        if (data.length === 0) return [];
        return data;
    }
}