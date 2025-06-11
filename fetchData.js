import { Client, isFullPage } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import fs from "fs";
import path from "path";
import axios from "axios";
import ogs from "open-graph-scraper";
import "dotenv/config"
import puppeteer from "puppeteer"
import { fileURLToPath } from "url";

const NOTION_TOKEN = process.env.NOTION_TOKEN_HORIZON;
const NOTION_DATABASE_ID = process.env.NOTION_DB_ID_HORIZON;

const IFRAMELY_API_KEY = process.env.IFRAMELY_API_KEY;

const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;

const notion = new Client({ auth: NOTION_TOKEN });
const n2m = new NotionToMarkdown({ notionClient: notion });

const getEditTimeData = async () => {
    const posts = await notion.databases.query({
        database_id:NOTION_DATABASE_ID,
        filter: {
            property: "published",
            checkbox: {
                equals: true,
            },
        }
    });

    const allPosts = posts.results.filter(isFullPage);
    return allPosts
};

export const getSinglePage = async (title) => {
    const response = await notion.databases.query({
        database_id: NOTION_DATABASE_ID,
        filter: {
            property: 'title',
            formula: { string: { equals: title } }
        }
    });

    const pageIds = response.results.map(page => page.id);
    const page = response.results.find(isFullPage);
    if (!page) throw new Error('Page not found');

    const mdBlocks =  await n2m.pageToMarkdown(page.id);
    return {
        mdBlocks,
        pageId:pageIds[0]
    }
};

const get = async (id) => {
    const posts = await notion.blocks.children.list({
        "block_id":id
    })
    const a = posts.results
    return a
};

const getEditTime = (post) => {
    const date = new Date(post.last_edited_time)

    return {
        id: post.id,
        Last_edited_time:post.last_edited_time
    };
};

const getPageDataByConditions=async(select,match)=>{
    const res = await fetch(`${SUPABASE_URL}/functions/v1/getPageDataWithSelect`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        },
        body:JSON.stringify({
            match,
            select
        })
    })
    const data = await res.json()
    return data;
}

const getAllBlockId=async(curriculumId)=>{
    const data = await getPageDataByConditions("*",{"curriculumId":curriculumId,"type":"child_page"})
    return data
}

const getPage = async (id) => {
    const posts = await notion.pages.retrieve({
        page_id:id,
    })

    return posts
};


// getSinglePage("Qiita Teamへの参加方法（全体向け）").then(async(id)=>{
//     const posts = await getPage(id.pageId)
//     // const posts = await get(id.pageId)
//     // if(posts[0].has_children){
//     //     const a = await get(posts[0].id)
//     //     posts.push(...a)
//     // }
//     fs.writeFileSync(`./public/notion_data/class.json`, JSON.stringify(posts, null, 2))
// })

const createHTML=()=>{
    const html = `
      <html>
        <style>
            .diagonal-bg::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #e3dfea;
                clip-path: polygon(0 0, 100% 40%, 100% 100%, 0 100%);
                z-index: -1;
            }
            .bg-hero {
                background: linear-gradient(135deg, #6B46C1 0%, #B794F4 100%);
                clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%);
            }
            .highlight{
                background-color: rgb(238, 251, 255);
                transition-duration: 75ms;
            }
        </style>
        <body style="width: 1204px; height: 640px; position: relative; left: -8px;">
            <section
                class="bg-hero"
                style="
                color: white;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                height: 34rem;
                "
            >
                <h2
                style="
                    color: #1f2937;
                    font-size: 3.75rem;
                    font-weight: 800;
                    text-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                "
                >
                <span style="color: white;">HorizonAtlas</span>
                </h2>

                <p
                style="
                    font-size: 1.125rem;
                    margin-top: 1rem;
                    max-width: 42rem;
                "
                >
                プログラミング部Horizonで使用する学習資料を簡単に閲覧、検索できます。
                </p>

                <div
                style="
                    margin-top: 2rem;
                    display: flex;
                    justify-content: center;
                "
                >
            </section>
      
        </body>
      </html>
    `;
    return html
}

const generateOgpForCurriculum=async(browser,__dirname)=>{
    const outputDir = path.resolve(__dirname, `./public`);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const page = await browser.newPage();
    const html = createHTML()
    await page.setContent(html);
    await page.setViewport({ width: 1204, height: 640 });
    const filePath = path.join(outputDir, `home.png`);
    await page.screenshot({ path: filePath });
    console.log(`Generated ${filePath}`);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function cleardir(directory) {
  try {
      const files = fs.readdirSync(directory);
      for (const file of files) {
          const filePath = path.join(directory, file);
          const stat = fs.statSync(filePath);
          if (stat.isFile()) {
              fs.unlinkSync(filePath);
          } else if (stat.isDirectory()) {
              fs.rmSync(filePath, { recursive: true, force: true });
          }
      }
      console.log(`Directory "${directory}" has been cleared.`);
  } catch (err) {
      console.error(`Error clearing directory: ${err.message}`);
  }
}

// main処理
(async () => {

  const browser = await puppeteer.launch();

//   const dir = path.resolve(__dirname, "../../public/ogp");
//   if(fs.existsSync(dir)) cleardir(dir)
//   if(!fs.existsSync(dir)) fs.mkdirSync(dir);
  await generateOgpForCurriculum(browser,__dirname);

  await browser.close();
})();
