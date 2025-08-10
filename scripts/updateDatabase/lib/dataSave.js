import "dotenv/config"
import path from "path";
import axios from "axios";
import fs from "fs";
import https from "https"

const IFRAMELY_API_KEY = process.env.IFRAMELY_API_KEY;

const downloadImage = async (imageUrl, savePath) => {
    try {
        const response = await axios({ url: imageUrl, method: "GET", responseType: "stream" });
        const dir = path.dirname(savePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        
        const writer = fs.createWriteStream(savePath);
        response.data.pipe(writer);
        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
        console.log(`✅ 画像をダウンロードしました: ${savePath}`);
    } catch (error) {
        console.error("❌ 画像のダウンロードに失敗しました:", error);
    }
};

const downloadVideo = (url, savePath) => {
    return new Promise((resolve, reject) => {
        const dirPath = path.dirname(savePath); 
        fs.mkdirSync(dirPath, { recursive: true }); 

        https.get(url, (res) => {
        if (res.statusCode !== 200) {
            reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
            return;
        }

        const fileStream = fs.createWriteStream(savePath);
        res.pipe(fileStream);

        fileStream.on("finish", () => {
            fileStream.close();
            resolve();
        });

        fileStream.on("error", (err) => {
            fs.unlink(savePath, () => reject(err)); 
        });
        }).on("error", (err) => reject(err));
    });
};


async function useIframely(url) {
    try{
        const res = await fetch(`https://iframe.ly/api/oembed?url=${url}&api_key=${IFRAMELY_API_KEY}`);
        const data = await res.json();
        return data;
    }catch(e){
        console.warn(e);
        return;
    }
}

async function useIflamelyForBookmark(url){
    try{
        const res = await fetch(`https://iframe.ly/api/iframely?url=${url}&api_key=${IFRAMELY_API_KEY}`);
        const data = await res.json();
        return data;
    }catch(e){
        console.warn(e);
        return;
    }
}

export const getPageImage=async(curriculumId,pageId,cover,icon)=>{
    let iconType = "";
    let iconUrl = "";
    if(icon){
        iconType = icon.type;
        if(iconType==="file"){
            let exte = icon.file.url.split(".")[1];
            if(exte===undefined || (exte!=="png" && exte!="jpg"  && exte!="svg")){
                exte = "png";
            }
            await downloadImage(icon.file.url, `./public/notion_data/eachPage/${curriculumId}/pageImageData/icon/${pageId}.${exte}`)
            iconUrl = `/horizon-atlas/notion_data/eachPage/${curriculumId}/pageImageData/icon/${pageId}.${exte}`
        }else if(iconType==="external"){
            iconUrl = icon.external.url
        }else if(iconType==="emoji"){
            iconUrl = icon.emoji
        }else if(iconType==="custom_emoji"){
            let exte = icon.custom_emoji.url.split(".")[1];
            if(exte===undefined || (exte!=="png" && exte!="jpg"  && exte!="svg")){
                exte = "png";
            }
            await downloadImage(icon.custom_emoji.url, `./public/notion_data/eachPage/${curriculumId}/pageImageData/icon/${pageId}.${exte}`)
            iconUrl = `/horizon-atlas/notion_data/eachPage/${curriculumId}/pageImageData/icon/${pageId}.${exte}`
        }
    }
    let coverUrl = "";
    if(cover){
        if(cover.type==="file"){
            let exte = cover.file.url.split(".")[1];
            if(exte===undefined || (exte!=="png" && exte!="jpg")){
                exte = "png";
            }
            await downloadImage(cover.file.url, `./public/notion_data/eachPage/${curriculumId}/pageImageData/cover/${pageId}.${exte}`)
            coverUrl = `/horizon-atlas/notion_data/eachPage/${curriculumId}/pageImageData/cover/${pageId}.${exte}`
        }else if(cover.type==="external"){
            coverUrl = cover.external.url
        }else if(cover.type==="emoji"){
            coverUrl = cover.emoji
        }
    }
    return {iconType,iconUrl,coverUrl}
}

export const saveImageAndgetUrl=async(curriculumId,blockId,url)=>{
    let exte = url.split(".")[1];
    if(exte===undefined || (exte!=="png" && exte!="jpg" && exte!="gif")){
        exte = "png";
    }
    const downloadUrl = `./public/notion_data/eachPage/${curriculumId}/image/${blockId}.${exte}`
    await downloadImage(url, downloadUrl);
    return downloadUrl.replace("./public","/horizon-atlas")
}

export const saveVideoAndgetUrl=async(curriculumId,blockId,url)=>{
    let exte = path.extname(new URL(url).pathname).replace(".", "");
    if (!exte) {
    exte = "mp4";
    }
    const downloadUrl = `./public/notion_data/eachPage/${curriculumId}/video/${blockId}.${exte}`
    await downloadVideo(url, downloadUrl);
    return downloadUrl.replace("./public","/horizon-atlas")
}

export const saveBookmarkData=async(curriculumId,blockId,url)=>{
    const origin = new URL(url).origin
    if(origin==="https://forms.gle" || origin==="https://docs.google.com"){
        return "";
    }else{
        const bookmarkData = await useIflamelyForBookmark(url);
        if(bookmarkData){
            if(!fs.existsSync(`./public/notion_data/eachPage/${curriculumId}/ogsData`)){
                fs.mkdirSync(`./public/notion_data/eachPage/${curriculumId}/ogsData`, { recursive: true });
            }
            const downloadUrl = `./public/notion_data/eachPage/${curriculumId}/ogsData/${blockId}.json`;
            fs.writeFileSync(downloadUrl,JSON.stringify(bookmarkData,null,2));
            return downloadUrl.replace("./public","/horizon-atlas")
        }else{
            return "";
        }
    }
}

export const saveEmbedDataAndgetUrl=async(curriculumId,blockId,url)=>{
    const embedData = await useIframely(url);
    if(embedData){
        if (!fs.existsSync(`./public/notion_data/eachPage/${curriculumId}/iframeData`)) {
            fs.mkdirSync(`./public/notion_data/eachPage/${curriculumId}/iframeData`, { recursive: true });
        }
        const downloadUrl = `./public/notion_data/eachPage/${curriculumId}/iframeData/${blockId}.json`
        const saveData = {title:embedData.title, html:embedData.html}
        fs.writeFileSync(downloadUrl, JSON.stringify(saveData, null, 2));
        return downloadUrl.replace("./public","/horizon-atlas")
    }
    return "";
}

export const getCategoryImage=async(categoryId,cover,icon)=>{
    let iconType = "";
    let iconUrl = "";
    if(icon){
        iconType = icon.type;
        if(iconType==="file"){
            let exte = icon.file.url.split(".")[1];
            if(exte===undefined || (exte!=="png" && exte!="jpg"  && exte!="svg")){
                exte = "png";
            }
            await downloadImage(icon.file.url, `./public/notion_data/category/${categoryId}/icon.${exte}`)
            iconUrl = `/horizon-atlas/notion_data/category/${categoryId}/icon.${exte}`
        }else if(iconType==="external"){
            iconUrl = icon.external.url
        }else if(iconType==="emoji"){
            console.log("icon.emoji",icon.emoji)
            iconUrl = icon.emoji
        }
    }
    let coverUrl = "";
    if(cover){
        if(cover.type==="file"){
            let exte = cover.file.url.split(".")[1];
            if(exte===undefined || (exte!=="png" && exte!="jpg")){
                exte = "png";
            }
            await downloadImage(cover.file.url, `./public/notion_data/category/${categoryId}/cover.${exte}`)
            coverUrl = `/horizon-atlas/notion_data/category/${categoryId}/cover.${exte}`
        }else if(cover.type==="external"){
            coverUrl = cover.external.url
        }else if(cover.type==="emoji"){
            coverUrl = cover.emoji
        }
    }
    return {iconType,iconUrl,coverUrl}
}