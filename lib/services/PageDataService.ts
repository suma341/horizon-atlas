import { MdBlock } from "notion-to-md/build/types";
import { PageDataGateway } from "../Gateways/PageDataGateway";
import { PageData } from "@/types/pageData";
import { searchPageById } from "../searchPageById";
import { findHeadingBlock } from "../findHeadingBlock";
import { CurriculumGateway } from "../Gateways/CurriculumGateway";
import { pageNav } from "@/types/pageNav";
import { CurriculumService } from "./CurriculumService";
import { IconInfo } from "@/types/iconInfo";
import { PageBlockData } from "@/types/pageBlockData";
import { ParagraphData } from "@/types/paragraph";
import { Parent } from "@/types/Parent";
import { CalloutData } from "@/types/callout";
import { HeadingData } from "@/types/headingData";
import { searchBlock } from "../searchBlock";
import { TableCell } from "@/types/table_cell";

function buildTree(pageData:PageData[], parentId:string):MdBlock[] {
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

async function processBlock(block:MdBlock,mdBlocks:MdBlock[]):Promise<MdBlock>{
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

export class PageDataService{
    static getPageDataByPageId=async(pageId:string)=>{
        const pageDatas = await PageDataGateway.getPageDataByPageId(pageId);
        const mdBlocks = buildTree(pageDatas, pageId);
        const processedData = await Promise.all(mdBlocks.map(async(block)=>{
            return processBlock(block,mdBlocks);
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
    
    static getTitleAndIcon=async(pageId:string)=>{
        const data:{data:string}[] = await PageDataGateway.getPageDataByConditions("data",{blockId:pageId})
        const pageBlockData:PageBlockData = JSON.parse(data[0].data)
        const title = pageBlockData.parent.replace("##","")
        const iconUrl = pageBlockData.iconUrl;
        const iconType = pageBlockData.iconType;
        const coverUrl = pageBlockData.coverUrl;
        return {title,iconUrl,iconType,coverUrl};
    }

    static getChildrenData=async(pageId:string)=>{
        const pageId_:{pageId:string,curriculumId:string}[] = await PageDataGateway.getPageDataByConditions("pageId,curriculumId",{"blockId":pageId,"type":"child_page"});
        const children :{data:string,blockId:string,order:number}[]= await PageDataGateway.getPageDataByConditions("data,blockId,order",{"type":"child_page","pageId":pageId_[0].pageId});
        const parentTitle:string = pageId_[0].pageId === pageId_[0].curriculumId ?
        (await CurriculumGateway.get("title",{"curriculumId":pageId_[0].curriculumId}))[0].title :
         JSON.parse((await PageDataGateway.getPageDataByConditions("data",{"blockId":pageId_[0].pageId}))[0].data).parent.replace("##","")
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
        const curriculumId:string = (await PageDataGateway.getPageDataByConditions("curriculumId",{"blockId":pageId}))[0].curriculumId
        if(curriculumId===pageId){
            return []
        }
        let currentPage = pageId;
        const pages:pageNav[] = [];
        while(currentPage!==curriculumId){
            const parentPage:{blockId:string,data:string,pageId:string}[] = await PageDataGateway.getPageDataByConditions("pageId,blockId,data",{"blockId":currentPage})
            pages.push({link:`/posts/curriculums/${curriculumId}/${parentPage[0].blockId}`,title:JSON.parse(parentPage[0].data).parent.replace("##","")})
            currentPage = parentPage[0].pageId;
        }
        return pages
    }

    static getPageTitle=async(pageId:string)=>{
        const title:{data:string}[] = await PageDataGateway.getPageDataByConditions("data",{"blockId":pageId})
        return title[0].data.slice(3);
    }

    static getAllBlockId=async(curriculumId:string)=>{
        const id:{blockId:string}[] = await PageDataGateway.getPageDataByConditions("blockId",{"curriculumId":curriculumId})
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
        const blocks:{data:string,pageId:string}[] = await PageDataGateway.getPageDataByConditions("data,pageId",{type:"child_page"})
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