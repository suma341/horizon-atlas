import { deleteData } from "./supabaseDBGateway.js"

export async function deletePage(id){
    const result = await deleteData("PageData","pageId",id)
    console.log("delete:PageData",result)
}

export async function deletePageByCurriculumId(id){
    const result = await deleteData("PageData","curriculumId",id)
    console.log("delete:PageData",result)
}

export async function deleteCurriculum(id){
    const result = await deleteData("Curriculum","curriculumId",id)
    console.log("delete:Curriculum",result)
}

export async function deleteCategory(id){
    const result = await deleteData("Category","categoryId",id)
    console.log("delete:Curriculum",result)
}
