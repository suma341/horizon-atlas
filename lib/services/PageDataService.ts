import { MdBlock } from "notion-to-md/build/types";
import { PageDataGateway } from "../Gateways/PageDataGateway";
import { PageData } from "@/types/pageData";
import { searchPageById } from "../searchPageById";
import { findHeadingBlock } from "../findHeadingBlock";
import { CurriculumGateway } from "../Gateways/CurriculumGateway";
import { pageNav } from "@/types/pageNav";

function buildTree(pageData:PageData[], parentId:string):MdBlock[] {
    const mdBlocks:MdBlock[] = pageData
        .filter(item => item.parentId === parentId)
        .map(item => ({
            blockId: item.blockId,
            type: item.type,
            parent: item.data,
            children: buildTree(pageData, item.blockId) 
        }));
    return mdBlocks;
}

async function rewriteLinks(text: string) {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const matches = [...text.matchAll(regex)];
  
    for (const match of matches) {
      const [fullMatch, label, url] = match;
      let newUrl = url;
  
      if (url.startsWith("https://") || url.startsWith("http://")) {
        newUrl = url;
      } else {
        const page = await searchPageById(url.slice(1));
        if (page.pageId === "") {
          newUrl = "";
        } else {
          newUrl = `/posts/curriculums/${page.curriculumId}/${page.pageId}`;
        }
      }
  
      text = text.replace(fullMatch, `[${label}](${newUrl})`);
    }
  
    return text;
  }
  

export class PageDataService{
    static getPageDataByPageId=async(pageId:string)=>{
        const pageDatas = await PageDataGateway.getPageDataByPageId(pageId);
        const mdBlocks = buildTree(pageDatas, pageId);
        const processedData = await Promise.all(mdBlocks.map(async(block)=>{
            if(block.type==="paragraph"){
                const linkRewrited = await rewriteLinks(block.parent);
                return {
                    type:block.type,
                    blockId:block.blockId,
                    parent:linkRewrited,
                    children:block.children
                }
            }
            if(block.type==="table_of_contents"){
                const headingList = findHeadingBlock(mdBlocks);
                const stringfyData = JSON.stringify({headingList});
                return {
                    type:block.type,
                    blockId:block.blockId,
                    parent:stringfyData,
                    children:block.children
                }
            }
            return block;
        }))
        return processedData;
    }

    static getPageDataByType = async(type:string)=>{
        const pageDatas = await PageDataGateway.getPageDataByType(type);
        return pageDatas;
    }

    static getChildPageIds = async(type:string="child_page")=>{
        const pageDatas:{curriculumId:string,blockId:string}[] = await PageDataGateway.getPageDataByConditions("curriculumId,blockId",{"type":type});
        const pageIds = pageDatas.map((data)=>{
            return {
                curriculumId:data.curriculumId,
                pageId:data.blockId
            }
        })
        return pageIds;
    }

    static getBlockIdAndDataByCurriculumId=async(curriculumId:string)=>{
        const data:{blockId:string,data:string}[] = await PageDataGateway.getPageDataByConditions("blockId,data",{"curriculumId":curriculumId})
        return data
    }

    static getPageDataByTypeAndCurriculumId=async(type:string,curriculumId:string)=>{
        const datas:{
            blockId:string,
            order:number,
            data:string
        }[] = await PageDataGateway.getPageDataByConditions("blockId,data,order",{"type":type,"curriculumId":curriculumId})
        return datas;
    }

    static getChildrenData=async(pageId:string)=>{
        const pageId_:{pageId:string,curriculumId:string}[] = await PageDataGateway.getPageDataByConditions("pageId,curriculumId",{"blockId":pageId,"type":"child_page"});
        const children :{data:string,blockId:string}[]= await PageDataGateway.getPageDataByConditions("data,blockId",{"type":"child_page","pageId":pageId_[0].pageId});
        const parentTitle:string = pageId_[0].pageId === pageId_[0].curriculumId ?
        (await CurriculumGateway.getCurriculumByCondition("title",{"curriculumId":pageId_[0].curriculumId}))[0].title :
         (await PageDataGateway.getPageDataByConditions("data",{"blockId":pageId_[0].pageId}))[0].data.slice(3)
        const childrenData = children.map((child)=>{
            return {
                title:child.data.slice(3),
                id:child.blockId
            }
        })
        return {title:parentTitle,childPages:childrenData};
    }

    static getPageNavs=async(pageId:string)=>{
        const curriculumId:string = (await PageDataGateway.getPageDataByConditions("curriculumId",{"blockId":pageId}))[0].curriculumId
        if(curriculumId===pageId){
            return []
        }
        let currentPage = pageId;
        const pages:pageNav[] = [];
        while(currentPage!==curriculumId){
            const parentPage:{blockId:string,data:string,pageId:string}[] = await PageDataGateway.getPageDataByConditions("pageId,blockId,data",{"blockId":currentPage})
            pages.push({id:`/posts/curriculums/${curriculumId}/${parentPage[0].blockId}`,title:parentPage[0].data.slice(3)})
            currentPage = parentPage[0].pageId;
        }
        return pages
    }
}