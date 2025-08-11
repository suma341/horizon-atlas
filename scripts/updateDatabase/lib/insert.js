import "dotenv/config"
import { upsertCategory, upsertCurriculum,upsertPage,} from "../gateway/supabaseDBGateway.js"
import {getSingleblock,getSinglePageBlock} from "../gateway/notionGateway.js"
import {getPageImage,getCategoryImage,saveImageAndgetUrl,saveEmbedDataAndgetUrl, saveBookmarkData,saveVideoAndgetUrl} from "./dataSave.js"

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function insertVideo(curriculumId,pageId,parentId,block,i){
    console.log("insert video")
    const res = await getSingleblock(block.blockId);
    const url = res[res.type][res[res.type].type].url
    const downloadUrl = await saveVideoAndgetUrl(curriculumId,block.blockId,url)
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
    await upsertPage(curriculumId,parentId,JSON.stringify(data),block.blockId,block.type,pageId,i);
}

async function insertTable_row(curriculumId,pageId,parentId,block,i){
    console.log("insert table_row")
    const res = await getSingleblock(block.blockId);
    const data = res.table_row.cells
    await upsertPage(curriculumId,parentId,JSON.stringify(data),block.blockId,block.type,pageId,i)
}

async function insertTable(curriculumId,pageId,parentId,block,i){
    console.log("insert table")
    const res = await getSingleblock(block.blockId);
    const data = res.table
    await upsertPage(curriculumId,parentId,JSON.stringify(data),block.blockId,block.type,pageId,i)
}

async function insertBookmark(curriculumId,pageId,parentId,block,i){
    console.log("insert bookmark")
    const res = await getSingleblock(block.blockId);
    const url = res.bookmark.url;
    const downloadUrl = await saveBookmarkData(curriculumId,block.blockId,url)
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
        downloadUrl
    }
    await upsertPage(curriculumId,parentId,JSON.stringify(data),block.blockId,block.type,pageId,i);
}

async function insertEmbed(curriculumId,pageId,parentId,block,i){
    console.log("insert embed")
    const res = await getSingleblock(block.blockId);
    const url = res.embed.url
    const downloadUrl = await saveEmbedDataAndgetUrl(curriculumId,block.blockId,url)
    const parent = res.embed.caption.map((text)=>{
        return {
            annotations:text.annotations,
            plain_text:text.plain_text,
            href:text.href
        }
    })
    const data = {
        parent,
        url,
        downloadUrl
    }
    await upsertPage(curriculumId,parentId,JSON.stringify(data),block.blockId,block.type,pageId,i);
}

async function insertImage(curriculumId,pageId,parentId,block,i){
    console.log("insert image")
    const res = await getSingleblock(block.blockId);
    const url = res[res.type][res[res.type].type].url
    const downloadUrl = await saveImageAndgetUrl(curriculumId,block.blockId,url)
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
    await upsertPage(curriculumId,parentId,JSON.stringify(data),block.blockId,block.type,pageId,i);
}

async function insertHeading(curriculumId,pageId,parentId,block,i){
    console.log(`insert ${block.type}...`,block.parent)
    const res = await getSingleblock(block.blockId)
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
    await upsertPage(curriculumId,parentId,JSON.stringify(data),block.blockId,block.type,pageId,i);
}

async function insertParagragh(curriculumId,pageId,parentId,block,i){
    console.log(`insert ${block.type}...`,block.parent)
    const res = await getSingleblock(block.blockId)
    const data = {
        color:res[res.type].color,
        parent:res[res.type].rich_text.map((text)=>{
            return {
                annotations:text.annotations,
                plain_text:text.plain_text,
                href:text.href
            }
        })
    }
    await upsertPage(curriculumId,parentId,JSON.stringify(data),block.blockId,block.type,pageId,i);
}

async function insertPageInfo(curriculumId,pageId,parentId,block,i){
    console.log("insert child_page...",block.parent)
    const res = await getSinglePageBlock(block.blockId);

    // アイコンとカバー画像を取得
    const pageImage = await getPageImage(curriculumId, block.blockId, res.cover, res.icon);

    // データを保存
    const data = {
        parent: block.parent,
        iconType: pageImage.iconType,
        iconUrl: pageImage.iconUrl,
        coverUrl: pageImage.coverUrl
    };

    await upsertPage(curriculumId, parentId, JSON.stringify(data), block.blockId, block.type, pageId, i);
}

async function insertCallout(block,parentId,curriculumId,pageId,i){
    console.log("insert callout",block.parent.split("\n")[0])
    const res = await getSingleblock(block.blockId)
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
        await upsertPage(curriculumId,parentId,JSON.stringify(data),block.blockId,block.type,pageId,i);
    }else{
        const data = {
            icon:res.callout.icon,
            color:res.callout.color,
            parent
        }
        await upsertPage(curriculumId,parentId,JSON.stringify(data),block.blockId,block.type,pageId,i);
    }
}

export async function insertblock(curriculumId,parentId,blocks,pageId){
    for(let i=1;i<(blocks.length + 1);i++){
        await wait(80);
        const k = i -1;
        if(blocks[k].type==="child_page"){
            await insertPageInfo(curriculumId,pageId,parentId,blocks[k],i);
            if(blocks[k].children.length!==0){
                await insertblock(
                    curriculumId,
                    blocks[k].blockId,
                    blocks[k].children,
                    blocks[k].blockId);
            }
        }else{
            await insertblock(
                curriculumId,
                blocks[k].blockId,
                blocks[k].children,
                pageId);
            if(blocks[k].type==="callout"){
                await insertCallout(blocks[k],parentId,curriculumId,pageId,i)
            }else if(blocks[k].type==="paragraph" || blocks[k].type==="quote" || blocks[k].type==="toggle" || blocks[k].type==="bulleted_list_item" || blocks[k].type==="numbered_list_item"){
                await insertParagragh(curriculumId,pageId,parentId,blocks[k],i)
            }else if(blocks[k].type ==='heading_1' || blocks[k].type ==='heading_2' || blocks[k].type ==='heading_3'){
                await insertHeading(curriculumId,pageId,parentId,blocks[k],i)
            }else if(blocks[k].type==="image"){
                await insertImage(curriculumId,pageId,parentId,blocks[k],i)
            }else if(blocks[k].type==="embed"){
                await insertEmbed(curriculumId,pageId,parentId,blocks[k],i)
            }else if(blocks[k].type==="bookmark"){
                await insertBookmark(curriculumId,pageId,parentId,blocks[k],i);
            }else if(blocks[k].type ==="table"){
                await insertTable(curriculumId,pageId,parentId,blocks[k],i)
            }else if(blocks[k].type ==="table_row"){
                await insertTable_row(curriculumId,pageId,parentId,blocks[k],i)
            }else if(blocks[k].type==="video"){
                await insertVideo(curriculumId,pageId,parentId,blocks[k],i)
            }else{
                await upsertPage(curriculumId,parentId,blocks[k].parent,blocks[k].blockId,blocks[k].type,pageId,i);
            }
        }
        console.log(k + 1, "/", blocks.length)
    }
}

export async function insertCurriculum(data){
    await upsertCurriculum(
        data.title,
        data.is_basic_curriculum,
        data.visibility,
        data.category,
        data.tag,
        data.curriculumId,
        data.iconType,
        data.iconUrl,
        data.coverUrl,
        data.order);
}

export async function insertCategory(data){
    const pageImage = await getCategoryImage(data.id,data.cover,data.icon)
    // console.log("icon",pageImage.icon)
    await upsertCategory(
        data.id,
        data.title,
        data.description,
        pageImage.iconUrl,
        pageImage.iconType,
        pageImage.coverUrl,
    )
}