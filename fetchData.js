import { Client, isFullPage } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import fs from "fs";
import path from "path";
import axios from "axios";
import 'dotenv/config';
import ogs from "open-graph-scraper";

const NOTION_TOKEN = process.env.NOTION_TOKEN2;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID2;

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
        sorts: [{ property: "date", direction: "descending" }],
    });

    const allPosts = posts.results.filter(isFullPage);
    return allPosts.map(getPageMetaData);
};

const getPageMetaData = (post) => {
    const getTags = (tags) => tags.map(tag => tag.name || "");
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

    return await n2m.pageToMarkdown(page.id);
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

const fetchAllMdBlock = async (mdBlocks) => {
    for (const block of mdBlocks) {
        if (block.type === 'image') {
            const match = block.parent.match(/!\[([^\]]+)\]\(([^\)]+)\)/);
            if (match) {
                const url = match[2].endsWith(')') ? match[2].slice(0, -1) : match[2];
                console.log("Downloading image:", block.blockId);
                await downloadImage(url, `./public/notion_data/page_image/${block.blockId}.png`);
            }
        }
        if(block.type==='bookmark'){
            const match = block.parent.match(/\((.*?)\)/g);
            if (match) {
                const url = match[0].slice(1, -1);
                const { result } = await ogs({url});
                const { ogTitle,ogDescription,ogSiteName,ogUrl,ogImage,favicon } = result;
                if(ogImage){
                    const { url } = ogImage[0];
                    const saveData = { ogTitle,ogDescription,ogSiteName,ogUrl,ImageUrl:url, favicon };
                    fs.writeFileSync(`./public/notion_data/ogsData/${block.blockId}.json`, JSON.stringify(saveData, null, 2));
                }else{
                    const saveData = { ogTitle,ogDescription,ogSiteName,ogUrl, favicon };
                    fs.writeFileSync(`./public/notion_data/ogsData/${block.blockId}.json`, JSON.stringify(saveData, null, 2));
                }
            }
        }
        if (block.type === 'child_page' && block.children.length > 0) {
            await fetchAllMdBlock(block.children);
        }
    }
};

function clearDirectorySync(dirPath) {
    try {
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                fs.rmSync(filePath, { recursive: true, force: true }); // サブディレクトリ削除
            } else {
                fs.unlinkSync(filePath); // ファイル削除
            }
        }
        console.log('ディレクトリの中身を削除しました:', dirPath);
    } catch (err) {
        console.error('エラー:', err);
    }
}

const rm_data_list = [
    "./public/notion_data/icon",
    "./public/notion_data/eachPage",
    "./public/notion_data/ogsData",
    "./public/notion_data/page_image"
];

function clearAllDirectories() {
    for (const rm_data of rm_data_list) {
        clearDirectorySync(rm_data); // ← ここで await をつける
    }
}

clearAllDirectories()

getAllData().then(data => {
    fs.writeFileSync("./public/notion_data/notionDatabase.json", JSON.stringify(data, null, 2));
    for (const d of data) {
        downloadImage(d.icon, `./public/notion_data/icon/${d.slug}.png`).then(() =>
            getSinglePage(d.slug).then(mdBlocks => {
                fs.writeFileSync(`./public/notion_data/eachPage/${d.slug}.json`, JSON.stringify(mdBlocks, null, 2));
                fetchAllMdBlock(mdBlocks);
            })
        );
    }
});
