import { getDriveFileByFileId } from "../Gateways/DriveGateway";

interface CurriculumProgress{
    [key: string]: string;
}

// type data = {
//     name:string;
//     title:string;
//     isAchieved:boolean;
// }

type MetaData={
    title:string;
    fileId:string;
    curriculums:string;
    userName:string;
    notAchievedText:string;
    published: string;
}

async function getMetaData(){
    const metaDataFileId = "12ke9QhpI0icBvvCfk6Yyn7wKOeclF4_6OGdheopu-V8";
    const metaData:MetaData[] = (await getDriveFileByFileId(metaDataFileId)).filter((item: { published: string; })=>item.published==="TRUE");
    return metaData;
}

export async function getCarriculumProgress(userName:string){
    const metaData = await getMetaData();
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

// export async function getFletCarriculumProgress(userName:string){
//     const fletCarriculumProgress:FletCurriculumProgress[] = await getDriveFileByFileId("1-HHH1HNuNVkyYN8T81xvXfVKez3rEje6yXiHREE7i_0");
//     const keys = Object.keys(fletCarriculumProgress[0])
//     const curriculums =  keys.slice(4).filter((item)=>item !== "");
//     const data = fletCarriculumProgress.map((item)=>{
//       const achievedList:data[] = [];
//       for(const key of curriculums){
//         if(item[key] !== ""){
//           achievedList.push({
//             title:key,
//             isAchieved:true,
//             name:item["名前"]
//           })
//         }
//       }
//       return achievedList
//     })
//     const userProgress = data.filter((item)=>item.find((d)=>d.name===userName)).flat();
//     if(userProgress.length===0){
//         return curriculums.map((item)=>{
//             return {
//                 title:item,
//                 isAchieved:false
//             }
//         })
//     }
//     return curriculums.map((item)=>{
//         const a = userProgress.find((i)=>i.title===item);
//         return {
//             title:item,
//             isAchieved: a?.isAchieved ?? false,
//         }
//     })
//   }