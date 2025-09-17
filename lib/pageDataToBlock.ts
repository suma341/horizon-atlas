import { PageData } from "@/types/pageData";
import { MdBlock } from "notion-to-md/build/types";
import { findHeadingBlock } from "./findHeadingBlock";
import SyncedGW from "./Gateways/syncedGW";
import { PageDataService } from "./services/PageDataService";
import { ImageBlock, ImageBlock_Size } from "@/types/mdBlocks";
import { getImageSize } from "./getImageSize";

export function buildTree(pageData:PageData[], parentId:string):MdBlock[] {
    const mdBlocks:MdBlock[] = pageData
        .filter(item => item.parentId === parentId)
        .map(item =>{
            return({
                blockId: item.blockId,
                type: item.type,
                parent: item.data,
                children: buildTree(pageData, item.blockId) 
        })});
    return mdBlocks;
}

export async function processBlock(block:MdBlock,mdBlocks:MdBlock[],curriculumId:string):Promise<MdBlock>{
    if(block.type==="table_of_contents"){
        const headingList = findHeadingBlock(mdBlocks);
        const stringfyData = JSON.stringify({headingList});
        return {
            ...block,
            parent:stringfyData,
            children: block.children.length===0 ? [] :
                await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks,curriculumId)))
        }
    }else if(block.type==="synced_block"){
        const data = block.parent;
        if(data==="original"){
            return {
                ...block,
                children: block.children.length===0 ? [] :
                        await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks,curriculumId)))
            };
        }else{
            const pageData = await SyncedGW.get({"blockId":data})
            const original = pageData[0]
            if(original){
                const mdBlocks = await PageDataService.getPageDataByPageId(original.pageId,original.curriculumId)
                const target = mdBlocks.find(m=>m.blockId===original.blockId)
                if(target){
                    return {
                        ...target,
                        children:target.children.length===0 ? [] :
                        await Promise.all(target.children.map(async(child)=>await processBlock(child,mdBlocks,original.curriculumId)))
                    }
                }
            }
        }
    }else if(block.type==="image"){
        const data:ImageBlock = JSON.parse(block.parent)
        const size = await getImageSize(data.url)
        const addSizeData:ImageBlock_Size = {...data,...size}
        return {
            ...block,
            parent:JSON.stringify(addSizeData),
            children: block.children.length===0 ? [] :
                await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks,curriculumId)))
        }
    }
    return {
        ...block,
        children: block.children.length===0 ? [] :
                await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks,curriculumId)))
    };
}