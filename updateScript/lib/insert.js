import "dotenv/config"
import { upsertCurriculum,upsertPage } from "./supabaseDBGateway.js"

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function insertblock(curriculumId,parentId,blocks,pageId){
    for(let i=1;i<(blocks.length + 1);i++){
        await wait(90);
        const k = i -1;
        if(blocks[k].children.length!==0){
            await insertblock(
                curriculumId,
                blocks[k].blockId,
                blocks[k].children,
                blocks[k].type==="child_page" ? blocks[k].blockId : pageId);
        }
        await upsertPage(curriculumId,parentId,blocks[k].parent,blocks[k].blockId,blocks[k].type,pageId,i);
    }
}

export async function insertCurriculum(data){
    await upsertCurriculum(
        data.title,
        data.is_basic_curriculum,
        data.visibility,
        data.category,
        data.tags,
        data.id);
}