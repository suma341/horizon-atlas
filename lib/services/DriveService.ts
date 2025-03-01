import { getDriveFileByFileId } from "../Gateways/DriveGateway";

interface BaseInfo{
    '学籍番号': string;
    '名前': string;
    '学舎': string;
}

interface FletCurriculumProgress extends BaseInfo{
    [key: string]: string;
    "1.Fletのインストール": string,
    '2.カウンターを作ってみよう': string,
    'Fletの練習問題1': string,
    'Fletの練習問題2': string,
    'Fletの練習問題3': string,
    '電卓の作成': string,
}

type data = {
    name:string;
    title:string;
    isAchieved:boolean;
}

export async function getFletCarriculumProgress(userName:string){
    const fletCarriculumProgress:FletCurriculumProgress[] = await getDriveFileByFileId("1-HHH1HNuNVkyYN8T81xvXfVKez3rEje6yXiHREE7i_0");
    const keys = Object.keys(fletCarriculumProgress[0])
    const curriculums =  keys.slice(4).filter((item)=>item !== "");
    const data = fletCarriculumProgress.map((item)=>{
      const achievedList:data[] = [];
      for(const key of curriculums){
        if(item[key] !== ""){
          achievedList.push({
            title:key,
            isAchieved:true,
            name:item["名前"]
          })
        }
      }
      return achievedList
    })
    const userProgress = data.filter((item)=>item.find((d)=>d.name===userName)).flat();
    if(userProgress.length===0){
        return curriculums.map((item)=>{
            return {
                title:item,
                isAchieved:false
            }
        })
    }
    return curriculums.map((item)=>{
        const a = userProgress.find((i)=>i.title===item);
        return {
            title:item,
            isAchieved: a?.isAchieved ?? false,
        }
    })
  }