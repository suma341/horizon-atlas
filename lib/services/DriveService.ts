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

async function getMetaData(){
    const metaDataFileId = "12ke9QhpI0icBvvCfk6Yyn7wKOeclF4_6OGdheopu-V8";
    const metaData:MetaData[] = (await getDriveFileByFileId(metaDataFileId)).filter((item: { published: string; })=>item.published==="TRUE");
    return metaData;
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
            }[] = [];
            for(const key of curriculums){
                if(p[key] !== data.notAchievedText && p[data.userName] === userName){
                    result.push({title:key,achieved:true})
                }else if(p[key] === data.notAchievedText && p[data.userName] === userName){
                    result.push({title:key,achieved:false})
                }
            }
            return result;
        }).flat()
        if(progress.length===0){
            curriculums.map((item)=>{
                progress.push({title:item,achieved:false})
            })
        }
        return {
            title:data.title,
            progress:progress}
    }))
    return progressData;
}

async function getSingleData(metadata:Record<string, MetaData[]>,userName:string){
    const key = (Object.keys(metadata))[0];
    const progress: {
        title: string;
        achieved: boolean;
    }[] = [];
    await Promise.all(metadata[key].map(async(data)=>{
        const userData = await getUserData(data.fileId,userName,data.userName)
        progress.push({
            title:data.curriculums,
            achieved:userData.length!==0 ? true : false
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
    const grouped = Object.entries(singleData.reduce((acc, curr) => {
        if (!acc[curr.title]) {
          acc[curr.title] = [];
        }
        acc[curr.title].push(curr);
        return acc;
      }, {} as Record<string, MetaData[]>)).map(([title, items]) => ({
        [title]: items
      }));
    for(const data of grouped){
        const progress = await getSingleData(data,userName);
        allProgressData.push(progress)
    }
    return allProgressData;
  }