import { getChildBlocks, getSinglePageBlock } from "../gateway/notionGateway.js"
import { upsertPage } from "../gateway/supabaseDBGateway.js"
import { getPageCover, getPageIcon, saveBookmarkData, saveEmbedDataAndgetUrl, saveImageAndgetUrl, saveVideoAndgetUrl } from "./dataSave.js"
import { canEmbedIframe } from "./embed.js"
import { getOGPWithPuppeteer } from "./ogp.js"

export async function insertChildren(children,curriculumId){
    for(let i=0;i<children.length;i++){
        await insertChild(children[i],curriculumId,curriculumId,curriculumId,i,`${i + 1}/${children.length}`)
    }
}

async function insertChild(block,curriculumId,pageId,parentId,i,p){
    const type = block.type
    console.log(`insert ${type}...`)
    await insertblock(curriculumId,parentId,block,pageId,type,i + 1)
    if(block.has_children){
        const children = await getChildBlocks(block.id)
        await Promise.all(
            children.map((child, k) =>
                insertChild(
                    child,
                    curriculumId,
                    type==="child_page" ? block.id : pageId,
                    block.id,
                    k,
                    `${p}[${k + 1}/${children.length}]`
                )
            )
        );
    }
    console.log(p)
}

async function insertblock(curriculumId,parentId,data,pageId,type,i){
    if(type==="callout"){
        await insertCallout(curriculumId,pageId,parentId,data,i)
    }else if(type==="paragraph" || type==="quote" || type==="toggle" || type==="bulleted_list_item" || type==="numbered_list_item" || type==="to_do"){
        await insertParagragh(curriculumId,pageId,parentId,data,i)
    }else if(type ==='heading_1' || type ==='heading_2' || type ==='heading_3'){
        await insertHeading(curriculumId,pageId,parentId,data,i)
    }else if(type==="image"){
        await insertImage(curriculumId,pageId,parentId,data,i)
    }else if(type==="embed"){
        await insertEmbed(curriculumId,pageId,parentId,data,i)
    }else if(type==="bookmark"){
        await insertBookmark(curriculumId,pageId,parentId,data,i);
    }else if(type ==="table"){
        await insertTable(curriculumId,pageId,parentId,data,i)
    }else if(type ==="table_row"){
        await insertTable_row(curriculumId,pageId,parentId,data,i)
    }else if(type==="video"){
        await insertVideo(curriculumId,pageId,parentId,data,i)
    }else if(type==="child_page"){
        await insertPageInfo(curriculumId,pageId,parentId,data,i)
    }else if(type==="link_to_page"){
        await insertLinkToPage(curriculumId,pageId,parentId,data,i)
    }else if(type==="code"){
        await insertCode(curriculumId,pageId,parentId,data,i)
    }else{
        await upsertPage(curriculumId,parentId,"_",data.id,data.type,pageId,i)
    }
    // else{
    //     await upsertPage(curriculumId,parentId,data.parent,data.id,data.type,pageId,i);
    // }
}

async function insertVideo(res,curriculumId,pageId,i){
    const parentType = res["type"]
    const parentId = res["parent"][parentType]
    const url = res[res.type][res[res.type].type].url
    const downloadUrl = await saveVideoAndgetUrl(curriculumId,res.id,url)
    const parent = res[res.type].caption.map((text)=>{
        return {
            annotations:text.annotations,
            plain_text:text.plain_text,
            href:text.href
        }
    })
    const data = {
        parent,
        url:downloadUrl
    }
    await upsertPage(curriculumId,parentId,JSON.stringify(data),res.id,res.type,pageId,i);
}

async function insertTable_row(curriculumId,pageId,parentId,res,i){
    const data = res.table_row.cells
    await upsertPage(curriculumId,parentId,JSON.stringify(data),res.id,res.type,pageId,i)
}

async function insertTable(curriculumId,pageId,parentId,res,i){
    const data = res.table
    await upsertPage(curriculumId,parentId,JSON.stringify(data),res.id,res.type,pageId,i)
}

async function insertBookmark(curriculumId,pageId,parentId,res,i){
    const url = res.bookmark.url;
    // const downloadUrl = await saveBookmarkData(curriculumId,res.id,url)
    const ogp = await getOGPWithPuppeteer(url)
    const parent = res.bookmark.caption.map((text)=>{
        return {
            annotations:text.annotations,
            plain_text:text.plain_text,
            href:text.href
        }
    })
    const data = {
        parent,
        url,
        ogp
    }
    await upsertPage(curriculumId,parentId,JSON.stringify(data),res.id,res.type,pageId,i);
}

async function insertEmbed(curriculumId,pageId,parentId,res,i){
    const url = res.embed.url
    const canEmbed = await canEmbedIframe(url)
    const parent = res.embed.caption.map((text)=>{
        return {
            annotations:text.annotations,
            plain_text:text.plain_text,
            href:text.href
        }
    })
    if(canEmbed){
        const data = {
            parent,
            url,
            canEmbed
        }
        await upsertPage(curriculumId,parentId,JSON.stringify(data),res.id,res.type,pageId,i);
        return;
    }
    if(!canEmbed){
        const embedData = await saveEmbedDataAndgetUrl(curriculumId,res.id,url)
        const data = {
            parent,
            url,
            canEmbed,
            embedData
        }
        await upsertPage(curriculumId,parentId,JSON.stringify(data),res.id,res.type,pageId,i);
    }
}

async function insertImage(curriculumId,pageId,parentId,res,i){
    const url = res[res.type][res[res.type].type].url
    const downloadUrl = await saveImageAndgetUrl(curriculumId,res.id,url)
    const parent = res[res.type].caption.map((text)=>{
        return {
            annotations:text.annotations,
            plain_text:text.plain_text,
            href:text.href
        }
    })
    const data = {
        parent,
        url:downloadUrl
    }
    await upsertPage(curriculumId,parentId,JSON.stringify(data),res.id,res.type,pageId,i);
}

async function insertHeading(curriculumId,pageId,parentId,res,i){
    const data = {
        parent:res[res.type].rich_text.map((text)=>{
            return {
                annotations:text.annotations,
                plain_text:text.plain_text,
                href:text.href
            }
        }),
        color:res[res.type].color,
        is_toggleable:res[res.type].is_toggleable
    }
    await upsertPage(curriculumId,parentId,JSON.stringify(data),res.id,res.type,pageId,i);
}

async function insertParagragh(curriculumId,pageId,parentId,res,i){
    const data = {
        color:res[res.type].color,
        parent:res[res.type].rich_text.map((text)=>{
            const type = text.type
            if(type==="mention"){
                const mentionType = text.mention.type
                const content = text.mention[mentionType]
                return {
                    annotations:text.annotations,
                    plain_text:text.plain_text,
                    href:text.href,
                    mention:{
                        type:mentionType,
                        content
                    }
                }
            }
            return {
                annotations:text.annotations,
                plain_text:text.plain_text,
                href:text.href
            }
        })
    }
    await upsertPage(curriculumId,parentId,JSON.stringify(data),res.id,res.type,pageId,i);
}

async function insertPageInfo(curriculumId,pageId,parentId,block,i){
    const res = await getSinglePageBlock(block.id);

    // アイコンとカバー画像を取得
    const pageIcon = await getPageIcon(curriculumId, block.id, res.icon)
    const pageCover = await getPageCover(curriculumId, block.id, res.cover)

    // データを保存
    const data = {
        parent: block.child_page.title,
        iconType: pageIcon.iconType,
        iconUrl: pageIcon.iconUrl,
        coverUrl: pageCover
    };

    await upsertPage(curriculumId, parentId, JSON.stringify(data), block.id, block.type, pageId, i);
}

async function insertCallout(curriculumId,pageId,parentId,res,i){
    const parent = res.callout.rich_text.map((text)=>{
        return {
            annotations:text.annotations,
            plain_text:text.plain_text,
            href:text.href
        }
    })
    if(res.icon && res.icon.emoji){
        const data = {
            icon:res.callout.icon,
            color:res.callout.color,
            parent
        }
        await upsertPage(curriculumId,parentId,JSON.stringify(data),res.id,res.type,pageId,i);
    }else{
        const data = {
            icon:res.callout.icon,
            color:res.callout.color,
            parent
        }
        await upsertPage(curriculumId,parentId,JSON.stringify(data),res.id,res.type,pageId,i);
    }
}

async function insertLinkToPage(curriculumId,pageId,parentId,res,i){
    const pageLink = res.link_to_page.page_id
    await upsertPage(curriculumId,parentId,pageLink,res.id,res.type,pageId,i)
}

async function insertCode(curriculumId,pageId,parentId,res,i){
    const language = res.code.language
    const rich_text = res.code.rich_text.length===0 ? [] : res.code.rich_text.map((i)=>i.plain_text)
    const caption = res.code.caption.map((text)=>{
        return {
            annotations:text.annotations,
            plain_text:text.plain_text,
            href:text.href
        }
    })
    const data ={
        language,
        parent:rich_text,
        caption
    }
    await upsertPage(curriculumId,parentId,JSON.stringify(data),res.id,res.type,pageId,i)
}