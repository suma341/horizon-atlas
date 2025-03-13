import { deleteData } from "./supabaseDBGateway.js"

export async function deletePage(id){
    await deleteData("PageData","curriculumId",id)
}

export async function deleteCurriculum(id){
    await deleteData("Curriculum","curriculumId",id)
}