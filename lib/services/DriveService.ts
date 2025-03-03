import { getDriveFileByFileId } from "../Gateways/DriveGateway";

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
        const allProgress:CurriculumProgress[] = await getDriveFileByFileId(data.fileId);
        const progressByUser = allProgress.filter((item)=>item[data.userName]===userName)
        const curriculums = data.curriculums.split("/");
        const progress = progressByUser.map((p)=>{
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

async function getSingleData(groupedData:{[x: string]: MetaData[]}[],userName:string){
    const allData = await Promise.all((groupedData.map(async(metadata)=>{
        const key = (Object.keys(metadata))[0];
        const progress: {
            title: string;
            achieved: boolean;
            order:number;
        }[] = [];
        await Promise.all(metadata[key].map(async(data)=>{
            const allProgress:CurriculumProgress[] = await getDriveFileByFileId(data.fileId);
            const isAchieved = allProgress.find((item)=>item[data.userName]===userName)
            progress.push({
                title:data.curriculums,
                achieved:isAchieved!=undefined ? true : false,
                order:parseInt(data.order)
            })
        }))
        return {
            title:key,
            progress
        }
    })))
    const progress: {
        title: string;
        progress: {
            title: string;
            achieved: boolean;
        }[];
    }[] = [];
    for(const data of allData){
        const sorted = data.progress.sort((a,b)=>a.order - b.order)
        const prosessed = sorted.map((item)=>{
            return {
                title:item.title,
                achieved:item.achieved
            }
        })
        const r = {
            title:data.title,
            progress:prosessed
        }
        progress.push(r)
    }
    return progress
}

export async function getCarriculumProgress(userName:string){
    const metaData = await getMetaData();
    const summaryData = metaData.filter((item)=>item.type==="summary");
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
    const progressData = await getSingleData(grouped,userName)
    const sumarryData = await getSummaryData(summaryData,userName);
    const result = progressData.concat(sumarryData);
    return result;
  }