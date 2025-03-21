import "dotenv/config";

const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;

export async function upsertCurriculum(
    title,is_basic_curriculum,visibility,category,tag,curriculumId,iconType,iconUrl,coverUrl,order){
    const url = `${SUPABASE_URL}/functions/v1/upsert_curriculum`;
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        },
        body:JSON.stringify({
            title,is_basic_curriculum,visibility,category,tag,curriculumId,iconType,iconUrl,coverUrl,order
        }),
    });
    const result = await res.json();
    console.log("upsertCurriculum",result);
}

export async function upsertCategory(categoryId, title, description, iconUrl,iconType, cover){
    const url = `${SUPABASE_URL}/functions/v1/upsertCategory`;
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        },
        body:JSON.stringify({
            categoryId, title, description, iconUrl,iconType, cover
        }),
    });
    const result = await res.json();
    console.log("upsertCategory",result);
}

export async function upsertPage(curriculumId,parentId,blockData,blockId,type,pageId,order){
    const res = await fetch(`${SUPABASE_URL}/functions/v1/upsertPageData`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        },
        body:JSON.stringify({
            curriculumId,parentId,blockData,blockId,type,pageId,order
        })
    });
    const result = await res.json();
    console.log("upsertPage",result);
    const { error } = result;
    return error;
}

export async function deleteData(table,where,value){
    const url = `${SUPABASE_URL}/functions/v1/deleteData`;
    const res = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
        },
        body:JSON.stringify({
            table,where,value
        }),
    });
    const result = await res.json();
    return result.message;
}