import {saveBookmarkData, saveEmbedDataAndgetUrl, saveImageAndgetUrl, getPageImage} from "./saveData.js"
import { upsertPage } from "../gateways/supabaseDBGateway.js"

export async function insertBookmark(res,curriculumId,pageId,parentId,block,i){
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

async function insertEmbed(res,curriculumId,pageId,parentId,block,i){
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

async function insertImage(res,curriculumId,pageId,parentId,block,i){
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

async function insertHeading(res,curriculumId,pageId,parentId,block,i){
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

async function insertParagragh(res,curriculumId,pageId,parentId,block,i){
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

async function insertPageInfo(res,curriculumId,pageId,parentId,block,i){
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

async function insertCallout(res,block,parentId,curriculumId,pageId,i){
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