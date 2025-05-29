import fs from "fs"
import path from "path"
import puppeteer from "puppeteer"
import { getAll } from "./gateways/currilumGateway.js"
import { getChildPageIds, getTitleAndIcon } from "./gateways/pageDataGateway.js";
import { fileURLToPath, pathToFileURL } from "url";

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
    const targetCurriculum = allCurriculums.find((item)=>item.curriculumId===i.curriculumId)
    let title = targetCurriculum?.title || "";
    let iconType = targetCurriculum?.iconType;
    let iconUrl = targetCurriculum?.iconUrl;
    let coverUrl = targetCurriculum?.coverUrl

    if(i.curriculumId!==i.pageId){
      const titleAndIcon = await getTitleAndIcon(i.pageId)
      title = titleAndIcon.title;
      iconType = titleAndIcon.iconType;
      iconUrl = titleAndIcon.iconUrl;
      coverUrl = titleAndIcon.coverUrl
      if(iconType==="file" || iconType==="custom_emoji"){
        iconUrl = iconUrl.replace("/horizon-atlas","https://ryukoku-horizon.github.io/horizon-atlas")
      }
    }else{
      if(iconType==="file" || iconType==="custom_emoji"){
        iconUrl = iconUrl.replace("/horizon-atlas","https://ryukoku-horizon.github.io/horizon-atlas")
      }
    }
    const page = await browser.newPage();
    const file_icon = "https://ryukoku-horizon.github.io/horizon-atlas/pngwing.png"
    // ここで画像にしたいHTMLをセット
    const html = `
      <html>
        <body style="width: 1203px; height: 630px;background: white;">
          ${coverUrl!=="" ? `<img src=${coverUrl} style="position: absolute;top: 0px;left:0px; width: 101%;height: 330px;">` : ""}
          ${coverUrl!=="" ? `<div>
            ${iconType==="" ? `<img src="${file_icon} style="width: 9rem; height: 9rem;position: absolute; top: 265px; left: 90px" >` : ""}
            ${(iconType !== "emoji" && iconType!=="") ? `<img src=${iconUrl} style="width: 9rem; height: 9rem;position: absolute; top: 265px; left: 90px" >` : ""}
            ${iconType === "emoji" ? `<p style="font-size: 7rem; position: absolute; top: 160px; left: 90px">${iconUrl}</p>` : ""}
            <h2 style="font-size: 64px; font-style: bold;position: absolute; top: 370px; left:40px;">${title}</h2>
          </div>` :
          `<div>
            ${iconType==="" ? `<img src="${file_icon} style="width: 9rem; height: 9rem;position: absolute; top: 135px; left: 90px" >` : ""}
            ${(iconType !== "emoji" && iconType!=="") ? `<img src=${iconUrl} style="width: 9rem; height: 9rem;position: absolute; top: 135px; left: 90px" >` : ""}
            ${iconType === "emoji" ? `<p style="font-size: 7rem; position: absolute; top: 30px; left: 90px">${iconUrl}</p>` : ""}
            <h2 style="font-size: 64px; font-style: bold;position: absolute; top: 220px; left:40px;">${title}</h2>
          </div>`}
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
