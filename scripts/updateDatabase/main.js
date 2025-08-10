import { getAllCategory, getAllData,getSinglePage } from "./gateway/notionGateway.js";
import { insertCategory, insertCurriculum,insertblock } from "./lib/insert.js";
import { deleteCategory, deleteCurriculum,deletePageByCurriculumId } from "./lib/delete.js";
import { getCurrentData } from "./checkEdited/checkEdited.js";
import { initDir } from "./lib/handleFile.js";

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const insertDatas=async(data)=>{
    const {mdBlocks,pageId} =await getSinglePage(data.title)
    await insertCurriculum(data);
    initDir(data);
    await insertblock(pageId,pageId,mdBlocks,pageId)
}

const editDatas=async(data)=>{
    const {mdBlocks,pageId} = await getSinglePage(data.title)
    await insertCurriculum(data);
    initDir(data);
    await deletePageByCurriculumId(pageId);
    await insertblock(pageId,pageId,mdBlocks,pageId)
}

const deleteDatas=async(data)=>{
    await deleteCurriculum(data.id);
    await deletePageByCurriculumId(data.id);
    cleardir(`./public/notion_data/eachPage/${data.id}`)
}

getCurrentData().then(async(data)=>{
    if(!data){
        console.log("更新なし");
        process.exit(0);
    }
    try{
        console.log("カテゴリーデータ読み込み中...")
        const categories = await getAllCategory()
        for(const category of categories){
            console.log("delete:",category.title)
            await deleteCategory(category.id)
            console.log("insert:",category.title)
            await insertCategory(category)
        }
        console.log("ページデータ読み込み中...")
        const allData = await getAllData();
        const insertData =  allData.filter((item1)=>data.newData.some((item2)=>item1.id===item2.id))
        for(const item of insertData){
            console.log("reading:",item.title)
            wait(90)
            await insertDatas(item)
        }
        const editData = allData.filter((item1)=>data.editedData.some((item2)=>item1.id===item2.id))
        for(const item of editData){
            console.log("reading:",item.title)
            wait(90)
            await editDatas(item)
        }
        const deleteData = allData.filter((item1)=>data.deleteData.some((item2)=>item1.id===item2.id))
        for(const item of deleteData){
            wait(90)
            await deleteDatas(item)
        }
        return process.exit(0);
    }catch(e){
        console.log("error",e)
        process.exit(1);
    }
})
