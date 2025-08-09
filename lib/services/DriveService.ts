import { userProgressGateway } from "../Gateways/DriveGateway";

// ↓new
export const getUserProgress=async(studentNumber:string)=>{
    const fileId = "1TBsqURXWNBDKShdhjxITi2d87udMhuXeAQ0j82G-eww";
    const sheetName = "進捗一覧";
    const data:Record<string,string> | null = await userProgressGateway(fileId,sheetName,studentNumber)
    if(data===null || Object.keys(data).length === 0){
        return []
    }
    const parsed = Object.entries(data).map(([title, value]) => ({
        title,
        value:value
      }));
    const filtered = parsed.filter((item)=>item.title!=="学籍番号" && item.title!=="氏名" && item.title!== "学舎")
    const separated:{
        category:string;
        data:{
            title:string;
            value:string;
        }[];
    }[] = [];
    filtered.forEach((item)=>{
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