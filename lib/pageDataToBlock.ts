import { PageData } from "@/types/pageData";
import { findHeadingBlock } from "./findHeadingBlock";
import SyncedGW from "./Gateways/syncedGW";
import { PageDataService } from "./services/PageDataService";
import { ImageBlock, ImageBlock_Size, LinkToPageBlock } from "@/types/mdBlocks";
import { getImageSize } from "./getImageSize";
import { MdBlock } from "@/types/MdBlock";

export function buildTree(pageData:PageData[], parentId:string):MdBlock[] {
    try{
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
    }catch(e){
        throw new Error(`error in buildTree: ${e}`)
    }
}

export async function processBlock(block:MdBlock,mdBlocks:MdBlock[],curriculumId:string):Promise<MdBlock>{
    if(block.type==="table_of_contents"){
        try{
            const headingList = findHeadingBlock(mdBlocks);
            return {
                ...block,
                parent:headingList,
                children: block.children.length===0 ? [] :
                    await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks,curriculumId)))
            }
        }catch(e){
            throw new Error(`error in processBlock table_of_contents: ${e}`)
        }
    }else if(block.type==="synced_block"){
        if(typeof block.parent==="string"){
            try{
                const data = block.parent.replaceAll("-","");
                if(data!=="original" ){
                    const pageData = await SyncedGW.get({"id":data})
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
            }catch(e){
                throw new Error(`error in processBlock synced_block: ${e}`)
            }
        }
    }else if(block.type==="image" && typeof block.parent=="object" && block.parent.url!==""){
        try{
            const data = block.parent as ImageBlock
            const size = await getImageSize(data.url)
            if(!size){
                return {
                ...block,
                    parent:data,
                    children: block.children.length===0 ? [] :
                        await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks,curriculumId)))
                }
            }
            const addSizeData:ImageBlock_Size = {...data,...size}
            return {
                ...block,
                parent:addSizeData,
                children: block.children.length===0 ? [] :
                    await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks,curriculumId)))
            }
        }catch(e){
            throw new Error(`error in processBlock image: ${e}`)
        }
    }else if(block.type==="link_to_page" && typeof block.parent==="object"){
        const data = block.parent as LinkToPageBlock
        const newData:LinkToPageBlock = {
            ...data,
            link:data.link.replaceAll("-","")
        }
        return {
            ...block,
            parent:newData,
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