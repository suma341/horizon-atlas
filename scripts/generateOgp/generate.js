import fs from "fs"
import path from "path"
import { getAll } from "./gateways/currilumGateway.js"
import { getChildPageIds, getTitleAndIcon } from "./gateways/pageDataGateway.js";
import { createHTML } from "./createHTML.js";
import { getAllCategory } from "./gateways/categoryGateway.js";

export const generateOgpForCurriculum=async(browser,__dirname)=>{
    const allCurriculums = await getAll();
    const rootPages = allCurriculums.map((data)=>{
        return {
          curriculumId:data.curriculumId,
          pageId:data.curriculumId
        }
    })
    const allChildId = await getChildPageIds();
    const allPageId = [...rootPages,...allChildId];
    for (const i of allPageId) {
        const outputDir = path.resolve(__dirname, `../../public/ogp/${i.curriculumId}`);
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
        const html = createHTML(coverUrl,iconType,iconUrl,title)
        await page.setContent(html);
        await page.setViewport({ width: 1203, height: 630 });
        const filePath = path.join(outputDir, `${i.pageId}.png`);
        await page.screenshot({ path: filePath });
        console.log(`Generated ${filePath}`);
      }
}

export const generateOgpForCategory=async(browser,__dirname)=>{
  const categories = await getAllCategory();
  const outputDir = path.resolve(__dirname, "../../public/ogp/category");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
  for(const i of categories){
    let iconUrl = i.iconUrl;
    const iconType = i.iconType;
    const coverUrl = i.cover;
    // console.log(coverUrl)
    const title = i.title;
    if(iconType==="file" || iconType==="custom_emoji"){
      iconUrl = iconUrl.replace("/horizon-atlas","https://ryukoku-horizon.github.io/horizon-atlas")
    }
    const page = await browser.newPage();
    const html = createHTML(coverUrl,iconType,iconUrl,title)
    await page.setContent(html);
    await page.setViewport({ width: 1203, height: 630 });
    const filePath = path.join(outputDir, `${i.categoryId}.png`);
    await page.screenshot({ path: filePath });
    console.log(`Generated ${filePath}`);
  }
}
// type Category = {
//   title: string;
//   categoryId: string;
//   description: string;
//   cover: string;
//   iconUrl: string;
//   iconType: string;
// }