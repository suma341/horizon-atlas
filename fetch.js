import { Client, isFullPage } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import fs from "fs";
import path from "path";
import axios from "axios";
import ogs from "open-graph-scraper";
import "dotenv/config"

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

const IFRAMELY_API_KEY = process.env.IFRAMELY_API_KEY;

const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;

const notion = new Client({ auth: NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

export const getAllData = async () => {
    const posts = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        page_size: 100,
        filter: {
            property: "published",
            checkbox: {
                equals: true,
            },
        },
        sorts: [{ property: "date", direction: "ascending" }],
    });

    const allPosts = posts.results.filter(isFullPage);
    return allPosts.map(getPageMetaData);
};

export const getSingleData = async (slug) => {
    const posts = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        page_size: 100,
        filter: {
            property: 'slug',
            formula: { string: { equals: slug } }
        }
    });

    const allPosts = posts.results.filter(isFullPage);
    return allPosts.map(getPageMetaData);
};

const getPageMetaData = (post) => {
    const getTags = (tags) => tags.map(tag => tag.name || "");
    const getVisibilities = (visibilities) => visibilities.map(visibility=> visibility.name || "");
    const properties = post.properties;
    const date = properties.date?.date?.start || "";
    const icon = properties.icon?.files?.[0]?.file?.url || "";

    return {
        id: post.id,
        title: properties.title?.title?.[0]?.plain_text || "untitled",
        date,
        tags: properties.tag?.multi_select ? getTags(properties.tag.multi_select) : [],
        slug: properties.slug?.rich_text?.[0]?.plain_text || "untitled",
        category: properties.category?.select?.name || "",
        is_basic_curriculum: properties.is_basic_curriculum?.checkbox || false,
        icon,
        visibility: properties.visibility?.multi_select ? getVisibilities(properties.visibility.multi_select) : []
    };
};

export const getSinglePage = async (slug) => {
    const response = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        filter: {
            property: 'slug',
            formula: { string: { equals: slug } }
        }
    });

    const page = response.results.find(isFullPage);
    if (!page) throw new Error('Page not found');

    const mdBlocks =  await n2m.pageToMarkdown(page.id);
    return mdBlocks;
};

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

async function upsertCurriculum(slug,curriculum_data){
    const url = `${SUPABASE_URL}/functions/v1/upsert_curriculum`;
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        },
        body:JSON.stringify({
            curriculum_data,slug
        }),
    });
    const result = await res.json();
    console.log(result);
}

async function upsertPage(slug,parentId,blockData,blockId,type,pageId,order){
    const res = await fetch(`${SUPABASE_URL}/functions/v1/upsertPageData`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        },
        body:JSON.stringify({
            slug,parentId,blockData,blockId,type,pageId,order
        })
    });
    const result = await res.json();
    console.log(result);
    const { error } = result;
    return error;
}

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

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function insertblock(slug,parentId,blocks,pageId){
    for(let i=1;i<(blocks.length + 1);i++){
        await wait(90);
        const k = i -1;
        if(blocks[k].children.length!==0){
            await insertblock(
                slug,
                blocks[k].blockId,
                blocks[k].children,
                blocks[k].type==="child_page" ? blocks[k].blockId : pageId);
        }
        await upsertPage(slug,parentId,blocks[k].parent,blocks[k].blockId,blocks[k].type,pageId,i);
    }
}

const fetchAllMdBlock = async (mdBlocks,slug) => {
    for (const block of mdBlocks) {
        if (block.type === 'image') {
            const match = block.parent.match(/!\[([^\]]+)\]\(([^\)]+)\)/);
            if (match) {
                const url = match[2].endsWith(')') ? match[2].slice(0, -1) : match[2];
                let exte = match[1].split(".")[1];
                if(exte===undefined || (exte!=="png" && exte!="jpg" && exte!="gif")){
                    exte = "png";
                }
                console.log("Downloading image:", block.blockId);
                await downloadImage(url, `./public/notion_data/eachPage/${slug}/image/${block.blockId}.${exte}`);
            }
        }
        if(block.type==='bookmark'){
            const match = block.parent.match(/\((.*?)\)/g);
            if (match) {
                try{
                    const url = match[0].slice(1, -1);
                    const { result } = await ogs({url});
                    const { ogTitle,ogDescription,ogSiteName,ogUrl,ogImage } = result;
                    let favicon = result.favicon;
                    console.log("favicon",favicon);
                    if(favicon===undefined){
                        const domain = new URL(url).origin;
                        const {result:domain_result} = await ogs({url:domain});
                        if(domain_result.favicon != undefined){
                            if(domain_result.ogImage){
                                const { url:image_url } = domain_result.ogImage[0];
                                console.log("image_url",image_url);
                                const image_domain = new URL(image_url).origin;
                                console.log("image_domain",image_domain);
                                const favicon_domain = domain_result.favicon;
                                favicon = image_domain + "/" + (favicon_domain[0]==="/" ? favicon_domain.slice(1) : favicon_domain);
                                console.log("favicon2",favicon);
                            }
                        }
                    }
                    if(ogImage){
                        const { url } = ogImage[0];
                        const saveData = { ogTitle,ogDescription,ogSiteName,ogUrl,ImageUrl:url, favicon };
                        fs.writeFileSync(`./public/notion_data/eachPage/${slug}/ogsData/${block.blockId}.json`, JSON.stringify(saveData, null, 2));
                    }else{
                        const saveData = { ogTitle,ogDescription,ogSiteName,ogUrl, favicon };
                        const isAllUndefined = Object.values(saveData).every(value => value === undefined);
                        if(isAllUndefined){
                            fs.writeFileSync(`./public/notion_data/eachPage/${slug}/ogsData/${block.blockId}.json`, JSON.stringify(result, null, 2));
                        }else{
                            fs.writeFileSync(`./public/notion_data/eachPage/${slug}/ogsData/${block.blockId}.json`, JSON.stringify(saveData, null, 2));
                        }
                    }
                }catch(e){console.warn(`⚠️ Open Graphの取得に失敗: ${e}`);}
            }
        }
        if(block.type==="embed"){
            const match = block.parent.match(/\((.*?)\)/g);
            if(match){
                const url = match[0].slice(1, -1);
                const embedData = await useIframely(url);
                if(embedData){
                    const saveData = {title:embedData.title, html:embedData.html}
                    fs.writeFileSync(`./public/notion_data/eachPage/${slug}/iframeData/${block.blockId}.json`, JSON.stringify(saveData, null, 2));
                }
            }
        }
        if (block.children.length > 0) {
            await fetchAllMdBlock(block.children,slug);
        }
    }
};

function mkdir(dirPath){
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log('📁 ディレクトリを作成しました:', dirPath);
    } else {
        console.log('✅ すでに存在しています:', dirPath);
    }
}

function cleardir(directory) {
    try {
        const files = fs.readdir(directory);
        for (const file of files) {
            const filePath = path.join(directory, file);
            const stat = fs.stat(filePath);
            if (stat.isFile()) {
                fs.unlink(filePath);
            } else if (stat.isDirectory()) {
                fs.rm(filePath, { recursive: true, force: true });
            }
        }
        console.log(`Directory "${directory}" has been cleared.`);
    } catch (err) {
        console.error(`Error clearing directory: ${err.message}`);
    }
}

getAllData()
    .then(allData => {
        for(const data of allData){
            wait(1000).then(data_=>{
                downloadImage(data.icon, `./public/notion_data/eachPage/${data.slug}/icon.png`)
                upsertCurriculum(data.slug,data)
                getSinglePage(data.slug).then(mdBlocks=>{
                    insertblock(data.slug,data.slug,mdBlocks,data.slug)
                    const ogsDir = `./public/notion_data/eachPage/${data.slug}/ogsData/`;
                    const imageDir = `./public/notion_data/eachPage/${data.slug}/image/`;
                    const iframeDir = `./public/notion_data/eachPage/${data.slug}/iframeData/`;
                    mkdir(ogsDir);
                    mkdir(imageDir);
                    mkdir(iframeDir);
                    cleardir(ogsDir);
                    cleardir(imageDir);
                    cleardir(iframeDir);
                    return fetchAllMdBlock(mdBlocks, data.slug);
                })
            })
        }
    })
    .catch(error => console.error("❌ Notion API の取得でエラー:", error)); // 🔴 catch() 追加

console.log("download completed");

// const slug="flet-1";
// getSinglePage(slug).then(data=>{
//     insertblock(slug,slug,data,slug)
// })

