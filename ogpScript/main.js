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

    if(i.curriculumId!==i.pageId){
      const titleAndIcon = await getTitleAndIcon(i.pageId)
      title = titleAndIcon.title;
      iconType = titleAndIcon.iconType;
      iconUrl = titleAndIcon.iconUrl;
      if(iconType==="file" || iconType==="custom_emoji"){
        iconUrl = iconUrl.replace("/horizon-atlas","https://ryukoku-horizon.github.io/horizon-atlas")
        // iconUrl = pathToFileURL(iconUrl).href.replace("file://","");
        // console.log(iconUrl,fs.existsSync(iconUrl))
      }
    }else{
      if(iconType==="file" || iconType==="custom_emoji"){
        iconUrl = iconUrl.replace("/horizon-atlas","https://ryukoku-horizon.github.io/horizon-atlas")
        // iconUrl = pathToFileURL(iconUrl).href.replace("file://","");
        // console.log(iconUrl,fs.existsSync(iconUrl))
      }
    }
    const page = await browser.newPage();
    const file_icon = "https://ryukoku-horizon.github.io/horizon-atlas/pngwing.png"
    // const file_icon = pathToFileURL("./public/file_icon.svg").href.replace("file://","");
    // console.log(file_icon, fs.existsSync(file_icon))
    // ここで画像にしたいHTMLをセット
    const html = `
      <html>
        <body style="width: 1203px; height: 630px;background: white;">
          ${iconType==="" ? `<img src="${file_icon} style="width: 10rem; height: 10rem;position: absolute; top: 100px; left: 90px" >` : ""}
          ${(iconType !== "emoji" && iconType!=="") ? `<img src=${iconUrl} style="width: 10rem; height: 10rem;position: absolute; top: 100px; left: 90px" >` : ""}
          ${iconType === "emoji" ? `<p style="font-size: 7rem; position: absolute; top: 0px; left: 90px">${iconUrl}</p>` : ""}
          <h2 style="font-size: 64px; font-style: bold;position: absolute; top: 190px; left:40px;">${title}</h2>
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
