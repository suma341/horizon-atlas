import { MdBlock } from "notion-to-md/build/types";
import { PageDataGateway } from "../Gateways/PageDataGateway";
import { PageData } from "@/types/pageData";
import { searchPageById } from "../searchPageById";
import { findHeadingBlock } from "../findHeadingBlock";

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
          newUrl = page.isChildPage ? `/posts/post/${page.curriculumId}/${page.pageId}` : `/posts/post/${page.curriculumId}`;
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
}