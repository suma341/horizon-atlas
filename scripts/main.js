import { getCurriculumEditTime,getPage,getAllData,getBlocks } from "./gateways/notionGateway.js";
import { getPageDataByConditions } from "./gateways/supabaseDBGateway.js";
import { insertCurriculum } from "./libs/insertCurriculum.js"
import {initDir} from "./libs/initData.js"
import fs from "fs";
import path from "path";
import axios from "axios";
import ogs from "open-graph-scraper";
import "dotenv/config"

const IFRAMELY_API_KEY = process.env.IFRAMELY_API_KEY;

const getAllBlockId=async(curriculumId)=>{
    const data = await getPageDataByConditions("*",{"curriculumId":curriculumId,"type":"child_page"})
    return data
}

const getAllEditedTime = async()=>{
    const data = await getCurriculumEditTime();
    const editedTimes = [...data];
    for(const d of data){
        const pages = await getAllBlockId(d.id)
        for(const page of pages){
            const pageData = await getPage(page.pageId)
            editedTimes.push({Last_edited_time:pageData.last_edited_time,id:pageData.id})
        }
    }
    return editedTimes;
}

const checkEdited =async()=>{
    const editedTime = await getAllEditedTime();
    const currentData = fs.readFileSync("./notion_last_edit/page.json");
    const parsedData = JSON.parse(currentData)
    const newData = editedTime.filter((item1)=>parsedData.every((item2)=>item1.id !== item2.id))
    const editedData = editedTime.filter((item1)=>parsedData.some((item2)=>item1.Last_edited_time !== item2.Last_edited_time && item1.id === item2.id))
    const deleteData = parsedData.filter((item1)=>editedTime.every((item2)=>item1.id!==item2.id))
    console.log("edited",editedData)
    console.log("new",newData)
    console.log("delete",deleteData)
    fs.writeFileSync(`./notion_last_edit/page.json`, JSON.stringify(editedTime, null, 2))
    // const categories = await getAllCategory()
    // for(const category of categories){
    //     console.log("delete:",category.title)
    //     await deleteCategory(category.id)
    //     console.log("insert:",category.title)
    //     await insertCategory(category)
    // }
    if(newData.length===0 && editedData.length===0 && deleteData.length===0){
        return null;
    }
    return {newData,editedData,deleteData}
}

const updateNotion=async()=>{
    const data = await checkEdited();
    if(data===null){
        console.log("更新なし");
        return;
    }
    try{
        const allData = await getAllData();
        const insertedCurriculums = allData.filter((item1)=>data.newData.some((item2)=>item1.id===item2.id))
        for(const item of insertedCurriculums){
            await insertCurriculum(item)
            initDir(item.id)
        }
        const editedCurriculums = allData.filter((item1)=>data.editedData.some((item2)=>item1.id===item2.id))
        for(const item of editedCurriculums){
            await insertCurriculum(item)
            initDir(item.id)
        }
        for(const item of [...data.newData,...data.editedData]){
            const children = await getBlocks(item.id);
            for(const block of children){
                
            }
        }
        const deleteData = allData.filter((item1)=>data.deleteData.some((item2)=>item1.id===item2.id))
    }catch(e){
        console.error("error",e)
        return;
    }
}

getCurrentData().then(async(data)=>{
    if(!data){
        console.log("更新なし");
        process.exit(0);
    }
    try{
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
