import { getPageImage } from "./saveData.js";
import { upsertCurriculum } from "../gateways/supabaseDBGateway.js"

export const insertCurriculum=async(item)=>{
    const imageData = await getPageImage(item.id,item.id,item.cover,item.icon);
    await upsertCurriculum(
        item.title,
        item.is_basic_curriculum,
        item.visibility,
        item.category,
        item.tags,
        item.id,
        imageData.iconType,
        imageData.iconUrl,
        imageData.coverUrl
        )
}