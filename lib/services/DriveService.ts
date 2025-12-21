import { getUserProgressGW } from "../Gateways/DriveGateway";
const fileId = "1TBsqURXWNBDKShdhjxITi2d87udMhuXeAQ0j82G-eww";
const sheetName = "進捗一覧";

export type ProgressModel={
    category: string;
    data: {
        title: string;
        value: boolean;
    }[];
}

export type ProgressEntity={
    title: string;
    value: boolean;
}


export type StorageEntity={
  progress:ProgressEntity[]
  expired:number
}

export const getProgressKey=(studentNum:string)=>{
    return `atlas_progress_data-${studentNum}`
}

const resToEntities=(data:Record<string,string> | null)=>{
    if(data===null || Object.keys(data).length === 0){
        return []
    }
    const parsed:ProgressEntity[] = Object.entries(data).map(([title, value]) => ({
        title,
        value:value==="TRUE"
      }));
    const filtered = parsed.filter((item)=>item.title!=="学籍番号" && item.title!=="氏名" && item.title!== "学舎")
    return filtered
}

export const progressEntitiesToModels=(entity:ProgressEntity[])=>{
    const separated:{
        category:string;
        data:{
            title:string;
            value:boolean;
        }[];
    }[] = [];
    entity.forEach((item)=>{
        const category = item.title.split(" - ")[0];
        const title = item.title.split(" - ")[1]
        const existingCategory = separated.find((item2)=>item2.category===category)
        if(existingCategory){
            existingCategory.data.push({title,value:item.value})
        }else{
            separated.push({category,data:[{title, value:item.value}]})
        }
    })
    return separated
}

export const getUserProgressEntity=async(studentNumber:string):Promise<ProgressEntity[]>=>{
    const data:Record<string,string> | null = await getUserProgressGW(fileId,sheetName,studentNumber)
    const entity = resToEntities(data)
    return entity
}

// ↓new
export const getUserProgressModel=async(studentNumber:string):Promise<ProgressModel[]>=>{
    const data:Record<string,string> | null = await getUserProgressGW(fileId,sheetName,studentNumber)
    const entity = resToEntities(data)
    const models = progressEntitiesToModels(entity)
    return models
}