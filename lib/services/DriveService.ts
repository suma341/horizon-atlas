import { getDriveFileByFileId, getUserData } from "../Gateways/DriveGateway";

interface CurriculumProgress{
    [key: string]: string;
}

type MetaData={
    title:string;
    fileId:string;
    curriculums:string;
    userName:string;
    notAchievedText:string;
    published: string;
    type:"single" | "summary";
    order:string;
}

type GroupedData = { title: string; items: MetaData[] };

async function getMetaData(){
    const metaDataFileId = "12ke9QhpI0icBvvCfk6Yyn7wKOeclF4_6OGdheopu-V8";
    const metaData:MetaData[] = (await getDriveFileByFileId(metaDataFileId)).filter((item: { published: string; })=>item.published==="TRUE");
   return metaData
}

async function getSummaryData(metaData:MetaData[],userName:string){
    const progressData = await Promise.all(metaData.map(async(data)=>{
        // const allProgress:CurriculumProgress[] = await getDriveFileByFileId(data.fileId);
        const userData:CurriculumProgress[] = await getUserData(data.fileId,userName,data.userName);
        const curriculums = data.curriculums.split("/");
        const progress = userData.map((p)=>{
            const result:{
                title:string;
                achieved:boolean;
                order:number;
            }[] = [];
            for(const key of curriculums){
                if(p[key] !== data.notAchievedText && p[data.userName] === userName){
                    result.push({title:key,achieved:true,order:0})
                }else if(p[key] === data.notAchievedText && p[data.userName] === userName){
                    result.push({title:key,achieved:false,order:0})
                }
            }
            return result;
        }).flat()
        if(progress.length===0){
            curriculums.map((item)=>{
                progress.push({title:item,achieved:false,order:0})
            })
        }
        return {
            title:data.title,
            progress:progress
        }
    }))
    return progressData;
}

async function getSingleData(metadata:Record<string, MetaData[]>,userName:string){
    const key = (Object.keys(metadata))[0];
    const progress: {
        title: string;
        achieved: boolean;
        order:number;
    }[] = [];
    await Promise.all(metadata[key].map(async(data)=>{
        const userData = await getUserData(data.fileId,userName,data.userName)
        progress.push({
            title:data.curriculums,
            achieved:userData.length!==0 ? true : false,
            order:parseInt(data.order)
        })
    }))
    return {
        title:key,
        progress
    }
}

export async function getCarriculumProgress(userName:string){
    const metaData = await getMetaData();
    const summaryData = metaData.filter((item)=>item.type==="summary");
    const allProgressData = await getSummaryData(summaryData,userName);
    const singleData = metaData.filter((item)=>item.type==="single");
    const grouped: GroupedData[] = [];
    const sortedSingleData = singleData.sort((a, b) => parseInt(a.order) - parseInt(b.order));
    console.log(typeof singleData[0].order,singleData[0].order)

    for (const item of sortedSingleData) {
    const lastGroup = grouped[grouped.length - 1];
    if (lastGroup && lastGroup.title === item.title) {
        lastGroup.items.push(item);
    } else {
        grouped.push({ title: item.title, items: [item] });
    }
    }

    // ここで順序通りに getSingleData を呼び出す
    for (const group of grouped) {
        const data = { [group.title]: group.items };
        const progress = await getSingleData(data, userName);
        allProgressData.push(progress);
    }
    return allProgressData;
  }