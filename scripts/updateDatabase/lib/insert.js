import "dotenv/config"
import { upsertCategory, upsertCurriculum} from "../gateway/supabaseDBGateway.js"
import {getCategoryImage} from "./dataSave.js"

export async function insertCurriculum(data){
    await upsertCurriculum(
        data.title,
        data.is_basic_curriculum,
        data.visibility,
        data.category,
        data.tag,
        data.curriculumId,
        data.iconType,
        data.iconUrl,
        data.coverUrl,
        data.order);
}

export async function insertCategory(data){
    const pageImage = await getCategoryImage(data.id,data.cover,data.icon)
    // console.log("icon",pageImage.icon)
    await upsertCategory(
        data.id,
        data.title,
        data.description,
        pageImage.iconUrl,
        pageImage.iconType,
        pageImage.coverUrl,
    )
}