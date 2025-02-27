import { MdBlock } from "notion-to-md/build/types";
import { PageDataGateway } from "../Gateways/PageDataGateway";
import { PageData } from "@/types/pageData";
import { searchPageById } from "../searchPageById";
import { findHeadingBlock } from "../findHeadingBlock";

const pageDataGateway = new PageDataGateway();

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
          newUrl = page.isChildPage ? `/posts/post/${page.slug}/${page.pageId}` : `/posts/post/${page.slug}`;
        }
      }
  
      text = text.replace(fullMatch, `[${label}](${newUrl})`);
    }
  
    return text;
  }
  

export class PageDataService{
    getPageDataByPageId=async(pageId:string)=>{
        const pageDatas = await pageDataGateway.getPageDataByPageId(pageId);
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

    getPageDataByType = async(type:string)=>{
        const pageDatas = await pageDataGateway.getPageDataByType(type);
        return pageDatas;
    }

    getPageDataByTypeAndSlug = async(type:string,slug:string)=>{
        const pageDatas = await pageDataGateway.getPageDataByTypeAndSlug(type,slug);
        return pageDatas;
    }

    getPageDataBySlug = async(slug:string)=>{
        const pageDatas = await pageDataGateway.getPageDataBySlug(slug);
        return pageDatas;
    }
}