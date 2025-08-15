import { PageData } from "@/types/pageData";
import { Parent } from "@/types/Parent";
import { MdBlock } from "notion-to-md/build/types";
import { searchPageById } from "./searchPageById";
import { searchBlock } from "./searchBlock";
import { CalloutData } from "@/types/callout";
import { HeadingData } from "@/types/headingData";
import { TableCell } from "@/types/table_cell";
import { ParagraphData } from "@/types/paragraph";
import { findHeadingBlock } from "./findHeadingBlock";
import { ImageBlock, ImageBlock_Size, LinkToPageBlock } from "@/types/mdBlocks";
import { getImageSize } from "./getImageSize";
import { PageDataService } from "./services/PageDataService";

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
    if(block.type==="link_to_page"){
        const data:LinkToPageBlock = await PageDataService.getLinkToPageData(block.parent);
        return {
            ...block,
            parent:JSON.stringify(data),
            children: block.children.length===0 ? [] :
                await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks,curriculumId)))
        }
    }else if(block.type==="paragraph" || block.type==="quote" || block.type==="toggle" || block.type==="bulleted_list_item" || block.type==="numbered_list_item"){
        const data:ParagraphData = JSON.parse(block.parent);
        const linkRewrited = await rewriteLinks(data.parent);
        const mentionRewrited = await rewritePageMention(linkRewrited)
        const parent = {
            ...data,
            parent:mentionRewrited
        }
        return {
            ...block,
            parent:JSON.stringify(parent),
            children: block.children.length===0 ? [] :
                await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks,curriculumId)))
        }
    }else if(block.type==="table_of_contents"){
        const headingList = findHeadingBlock(mdBlocks);
        const stringfyData = JSON.stringify({headingList});
        return {
            ...block,
            parent:stringfyData,
            children: block.children.length===0 ? [] :
                await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks,curriculumId)))
        }
    }else if(block.type==="child_page"){
        const data:{
            parent:string;
            iconType:string;
            iconUrl:string;
            coverUrl:string;
            } = JSON.parse(block.parent)
            const newData = {...data,curriculumId}
            return {
                ...block,
                parent:JSON.stringify(newData),
                children:[]
            }
        // }
    }else if(block.type === "callout"){
        const data:CalloutData = JSON.parse(block.parent);
        const linkRewrited = await rewriteLinks(data.parent);
        const parent = {
            ...data,
            parent:linkRewrited
        }
        return {
            ...block,
            parent:JSON.stringify(parent),
            children: block.children.length===0 ? [] :
                await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks,curriculumId)))
        }
    }else if(block.type==='heading_1' || block.type==='heading_2' || block.type==='heading_3'){
        const data:HeadingData = JSON.parse(block.parent);
        const linkRewrited = await rewriteLinks(data.parent);
        const parent = {
            ...data,
            parent:linkRewrited
        }
        return {
            ...block,
            parent:JSON.stringify(parent),
            children: block.children.length===0 ? [] :
                await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks,curriculumId)))
        }
    }else if(block.type==="table_row"){
        const data:TableCell[][] = JSON.parse(block.parent)
        const processed:Parent[][] = []
        for(const items of data){
            const parents:Parent[] = items.map((i)=>{
                return {
                    annotations:i.annotations,
                    plain_text:i.plain_text,
                    href:i.href,
                    scroll:undefined
                }
            })
            const linkRewrited = await rewriteLinks(parents)
            processed.push(linkRewrited)
        }
        return {
            ...block,
            parent:JSON.stringify(processed),
            children:block.children.length===0 ? [] :
                await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks,curriculumId)))
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
    }else if(block.type==="synced_block"){
        const data = block.parent;
        if(data==="original"){
            return {
                ...block,
                children: block.children.length===0 ? [] :
                        await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks,curriculumId)))
            };
        }else{
            const children = await getChildren(data)
            const mdBlocks = buildTree(children,data)
            const processedData = await Promise.all(
                mdBlocks.map(async(block) => {
                    return processBlock(block, mdBlocks,curriculumId);
                })
            );
            const rewrited = processedData.length===0 ? [] : await rewriteBlockId(processedData,block.blockId)
            return {
                ...block,
                children:rewrited
            }
        }
    }
    return {
        ...block,
        children: block.children.length===0 ? [] :
                await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks,curriculumId)))
    };
}

async function rewriteLinks(parent: Parent[]) {
    const rewritedData = await Promise.all(parent.map(async(data)=>{
        if(data.href){
            if (data.href.startsWith("https://") || data.href.startsWith("http://")){
                if(new URL(data.href).origin==="https://www.notion.so"){
                    const pageHref = "/" + data.href.split("/")[3]
                    const page = await searchPageById(pageHref.split("#")[0].slice(1));
                    if(page.pageId===""){
                        return data
                    }else{
                        const targetId = await searchBlock(pageHref.split("#")[1]);
                        if(targetId){
                            const url = `/posts/curriculums/${page.curriculumId}/${page.pageId}`
                            return {
                                ...data,
                                href:url,
                                scroll:targetId
                            }
                        }else{
                            const url = `/posts/curriculums/${page.curriculumId}/${page.pageId}`;
                            return {
                                ...data,
                                href:url,
                            }
                        }
                    }
                }else{
                    return data
                }
            }else{
                if(data.href.split("#")[1]){
                    const page = await searchPageById(data.href.split("#")[0].slice(1))
                    if(page.pageId===""){
                        return {
                            ...data,
                            href:""
                        }
                    }else{
                        const targetId = await searchBlock(data.href.split("#")[1]);
                        if(targetId){
                            const url = `/posts/curriculums/${page.curriculumId}/${page.pageId}`
                            return {
                                ...data,
                                href:url,
                                scroll:targetId
                            }
                        }else{
                            const url = `/posts/curriculums/${page.curriculumId}/${page.pageId}`;
                            return {
                                ...data,
                                href:url,
                            }
                        }
                    }
                }
                const page = await searchPageById(data.href.slice(1))
                if(page.pageId===""){
                    return {
                        ...data,
                        href:""
                    }
                }else{
                    const url =  `/posts/curriculums/${page.curriculumId}/${page.pageId}`;
                    return {
                        ...data,
                        href:url
                    }
                }
            }
        }else{
            return data
        }
    }))
    return rewritedData
  }

const rewritePageMention=async(parents:Parent[])=>{
    const newParents:Parent[] = []
    for(const p of parents){
        if(p.mention && p.mention.type==="page" && p.mention.content){
            const id = p.mention.content.id;
            const data = await PageDataService.getTitleAndIcon(id)
            const {title,iconType,iconUrl}= data ?? ""
            newParents.push({
                ...p,
                mention:{
                    type:"prossedPage",
                    content:{
                        title,iconType,iconUrl
                    }
                }
            })
        }else {
            newParents.push(p)
        }
    }
    return newParents
}

const getChildren=async(blockId:string):Promise<PageData[]>=>{
    const children = await PageDataService.getChildBlock(blockId)
    if(children.length===0) return [];
    const sortedData = children.sort((a,b)=>a.order-b.order);
    const result:PageData[] = [...sortedData];
    for(const child of children){
        const r = await getChildren(child.blockId)
        result.push(...r)
    }
    return result
}

const rewriteBlockId=async(blocks:MdBlock[],blockId:string)=>{
    return await Promise.all(blocks.map(async(b):Promise<MdBlock>=>{
        const newId = `${b.blockId}-synced-${blockId}`
        return {
            ...b,
            blockId:newId,
            children:b.children.length===0 ? [] : await rewriteBlockId(b.children,blockId)
        }
    }))
}