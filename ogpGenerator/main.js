import fs from "fs"
import path from "path"
import puppeteer from "puppeteer"
import { getAll } from "./gateways/currilumGateway.js"
import { getChildPageIds, getTitleAndIcon } from "./gateways/pageDataGateway.js";
import { fileURLToPath } from "url";

const allCurriculums = await getAll();
const rootPages = allCurriculums.map((data)=>{
  return {
    curriculumId:data.curriculumId,
    pageId:data.curriculumId
  }
})
const allChildId = await getChildPageIds();
const allPageId = [...rootPages,...allChildId];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const browser = await puppeteer.launch();

  const dir = path.resolve(__dirname, "../public/ogp");
  if(!fs.existsSync(dir)) fs.mkdirSync(dir);
  for (const i of allPageId) {
    const outputDir = path.resolve(__dirname, `../public/ogp/${i.curriculumId}`);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    let title = allCurriculums.find((item)=>item.curriculumId===i.curriculumId)?.title || "";

    if(i.curriculumId!==i.pageId){
      title = (await getTitleAndIcon(i.pageId)).title
    }
    const page = await browser.newPage();
    // ここで画像にしたいHTMLをセット
    const html = `
      <html>
        <body style="width: 1200px; height: 630px; display: flex; justify-content: center; align-items: center; background: white; font-size: 64px;">
          ${title}
        </body>
      </html>
    `;
    await page.setContent(html);
    await page.setViewport({ width: 1203, height: 630 });
    const filePath = path.join(outputDir, `${i.pageId}.png`);
    await page.screenshot({ path: filePath });
    console.log(`Generated ${filePath}`);
  }

  await browser.close();
})();
