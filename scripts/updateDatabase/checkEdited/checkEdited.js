import { getEditTimeData, getPage } from "../gateway/notionGateway.js";
import { getPageDataByConditions,getLastEdited,updateLastEdited } from "../gateway/supabaseDBGateway.js"

// const isDatabaseEdited=async(current)=>{
//     const latest = await getLastEdited("*",{"curriculum":"0"});
//     console.log(latest)
//     console.log(current)
//     await updateLastEdited(current,"0");
//     return current !== latest[0].last_edited
// }

const getAllChildId=async(curriculumId)=>{
    const data = await getPageDataByConditions("*",{"curriculumId":curriculumId,"type":"child_page"})
    return data
}

const latestTime=(times)=>{
    const latest = times.reduce((latestSoFar, current) => {
        return new Date(current) > new Date(latestSoFar) ? current : latestSoFar;
    });
    return latest;
}

const getCurriculumEditedTime = async(Last_edited_time,curriculumId)=>{
    const editedTimes = [Last_edited_time];
    const pages = await getAllChildId(curriculumId)
    for(const page of pages){
        const pageData = await getPage(page.pageId)
        editedTimes.push(pageData.last_edited_time)
    }
    const latestTime_ = latestTime(editedTimes)
    return latestTime_;
}

export const getCurrentData=async()=>{
    // console.log("データベースの更新確認中...")
    // const databaseData = await getDatabaseData()
    // const isEdited = await isDatabaseEdited(databaseData.last_edited_time)
    // if(!isEdited){
    //     return null;
    // }
    console.log("ページの更新確認中...")
    const timeData = await getEditTimeData();
    let editTimeData = [];
    editTimeData = timeData
    // for(const d of timeData){
    //     const latest = await getCurriculumEditedTime(d.Last_edited_time,d.id);
    //     editTimeData.push({id:d.id,Last_edited_time:latest})
    // }
    const data = await getLastEdited("*")
    const filtered = data.filter((item)=>item.curriculum!=="0")
    editTimeData.map((item)=>{
        item.id
    })
    console.log(filtered)
    // return null;
    const newData = editTimeData.filter((item1)=>filtered.every((item2)=>item1.id !== item2.curriculum))
    console.log(`新たなページ":${newData.length}個`)
    const editedData = editTimeData.filter((item1)=>filtered.some((item2)=>
        item1.Last_edited_time !== item2.last_edited && item1.id === item2.curriculum
    ))
    console.log(`編集されたページ:${editedData.length}個`)
    const deleteData = filtered.filter((item1)=>editTimeData.every((item2)=>item1.curriculum!==item2.id))
    console.log(`削除されたページ:${deleteData.length}個`)
    console.log("ページ更新日書き換え中...")
    for(const data of editTimeData){
        await updateLastEdited(data.Last_edited_time,data.id)
    }
    console.log("ページ更新日書き換え完了")
    if(newData.length===0 && editedData.length===0 && deleteData.length===0){
        return null;
    }
    return {newData,editedData,deleteData}
    // return null
}