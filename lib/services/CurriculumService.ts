import { PostEntity, PostMetaData } from "@/types/postMetaData";
import { CurriculumGateway } from "../Gateways/CurriculumGateway";
import { converseData } from "../entityToMetadata";

export class CurriculumService{
    static getAllCurriculum=async()=>{
        const allPosts:PostMetaData[] = [];
        const alldata = await CurriculumGateway.get("*")
        for(const data of alldata){
            const curriculumData:PostMetaData = converseData(data);
            allPosts.push(curriculumData);
        }
        return allPosts.sort((a,b)=>a.order - b.order);
    }

    static getAllTags=async()=>{
        const tags = await CurriculumGateway.get("tag")
        const allTagDuplicate:string[] = [];
        for(const tag of tags){
            const tagList = await JSON.parse(tag.tag)
            for(const t of tagList){
                allTagDuplicate.push(t)
            }
        }
        const set = new Set(allTagDuplicate);
        const allTags = Array.from(set);
        return allTags
    }

    static getAllCategories=async()=>{
        // const categories = await CurriculumGateway.getAllCategories();
        const categories = await CurriculumGateway.get("category")
        const allCategoriesDuplicate:string[] = [];
        for(const category of categories){
            allCategoriesDuplicate.push(category.category)
        }
        const set = new Set(allCategoriesDuplicate);
        const allCategories = Array.from(set);
        return allCategories
    }

    static getCurriculumByCategory=async(category:string)=>{
        // const datas = await CurriculumGateway.getCurriculumByCategory(category);
        const datas = await CurriculumGateway.get("*",{"category":category})
        const metaData:PostMetaData[] = [];
        for(const data of datas){
            const postMetaData = converseData(data);
            metaData.push(postMetaData)
        }
        return metaData.sort((a,b)=>a.order -b.order);
    }

    static getBasicCurriculum=async()=>{
        const data = await CurriculumGateway.get("*",{"is_basic_curriculum":"true"})
        const metaData:PostMetaData[] = [];
        for(const d of data){
            const postMetaData = converseData(d);
            metaData.push(postMetaData)
        }
        return metaData.sort((a,b)=>a.order -b.order);
    }    

    static getIdAndTitle=async()=>{
        const datas:{
            curriculumId:string;
            title:string;    
        }[] = await CurriculumGateway.get(["curriculumId","title"]);
        return datas;
    }    

    static getAllCurriculumId=async()=>{
        const datas:{curriculumId:string}[] = await CurriculumGateway.get("curriculumId")
        const idList:string[] = []
        for(const data of datas){
            idList.push(data.curriculumId)
        }
        return idList;
    }    

    static getCurriculumById=async(id:string)=>{
        const datas:PostEntity[] = await CurriculumGateway.get("*",{"curriculumId":id})
        const metadatas:PostMetaData[] = []
        for(const data of datas){
            metadatas.push(converseData(data))
        }
        return metadatas[0]
    }    
}