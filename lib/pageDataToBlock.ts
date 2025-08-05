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

export async function processBlock(block:MdBlock,mdBlocks:MdBlock[]):Promise<MdBlock>{
    if(block.type==="link_to_page"){
        const parent = await rewriteLinkTopage(block.parent);
        return {
            ...block,
            parent,
            children: block.children.length===0 ? [] :
                await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks)))
        }
    }else if(block.type==="paragraph" || block.type==="quote" || block.type==="toggle" || block.type==="bulleted_list_item" || block.type==="numbered_list_item"){
        const data:ParagraphData = JSON.parse(block.parent);
        const linkRewrited = await rewriteLinks(data.parent);
        const parent = {
            ...data,
            parent:linkRewrited
        }
        return {
            ...block,
            parent:JSON.stringify(parent),
            children: block.children.length===0 ? [] :
                await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks)))
        }
    }else if(block.type==="table_of_contents"){
        const headingList = findHeadingBlock(mdBlocks);
        const stringfyData = JSON.stringify({headingList});
        return {
            ...block,
            parent:stringfyData,
            children: block.children.length===0 ? [] :
                await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks)))
        }
    }else if(block.type==="child_page"){
        return {
            ...block,
            children:[]
        }
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
                await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks)))
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
                await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks)))
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
                await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks)))
        }
    }
    return {
        ...block,
        children: block.children.length===0 ? [] :
                await Promise.all(block.children.map(async(child)=>await processBlock(child,mdBlocks)))
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

async function rewriteLinkTopage(text:string){
    const regex = /\(([^)]+)\)/g;
    const match = text.match(regex);
    if(match){
        const [fullMatch] = match;
        const page = await searchPageById(fullMatch.slice(1,-1))
        text = `[${page.title}](/posts/curriculums/${page.curriculumId}/${page.pageId})`
    }
    return text;
}

