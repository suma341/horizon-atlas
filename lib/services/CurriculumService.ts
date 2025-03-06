import { PostMetaData } from "@/types/postMetaData";
import { CurriculumGateway } from "../Gateways/CurriculumGateway";

type data ={
    id:number;
    curriculumId:string;
    title:string;
    category:string;
    is_basic_curriculum:string;
    visibility:string;
    tag:string;
}

const converseData =(data:data)=>{
    const postMetaData:PostMetaData = {
        title:data.title,
        curriculumId:data.curriculumId,
        category:data.category,
        visibility:JSON.parse(data.visibility),
        tags:JSON.parse(data.tag),
        is_basic_curriculum:JSON.parse(data.is_basic_curriculum),
        id:`${data.id}`
    }
    return postMetaData;
}

export class CurriculumService{
    static getAllCurriculum=async()=>{
        const allPosts:PostMetaData[] = [];
        const alldata = await CurriculumGateway.getAllCurriculum();
        for(const data of alldata){
            const curriculumData:PostMetaData = converseData(data);
            allPosts.push(curriculumData);
        }
        return allPosts.sort((a,b)=>parseInt(a.id) -parseInt(b.id));
    }

    static getAllTags=async()=>{
        const tags = await CurriculumGateway.getAllTags();
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
        const categories = await CurriculumGateway.getAllCategories();
        const allCategoriesDuplicate:string[] = [];
        for(const category of categories){
            allCategoriesDuplicate.push(category.category)
        }
        const set = new Set(allCategoriesDuplicate);
        const allCategories = Array.from(set);
        return allCategories
    }

    static getCurriculumByCategory=async(category:string)=>{
        const datas = await CurriculumGateway.getCurriculumByCategory(category);
        const metaData:PostMetaData[] = [];
        for(const data of datas){
            const postMetaData = converseData(data);
            metaData.push(postMetaData)
        }
        return metaData.sort((a,b)=>parseInt(a.id) -parseInt(b.id));
    }

    static getBasicCurriculum=async()=>{
        const datas = await CurriculumGateway.getBasicCurriculum();
        const metaData:PostMetaData[] = [];
        for(const data of datas){
            const postMetaData = converseData(data);
            metaData.push(postMetaData)
        }
        return metaData.sort((a,b)=>parseInt(a.id) -parseInt(b.id));
    }    

    static getIdAndTitle=async()=>{
        const datas:{
            curriculumId:string;
            title:string;    
        }[] = await CurriculumGateway.getCurriculumByCondition("curriculumId,title");
        return datas;
    }    

    static getAllCurriculumId=async()=>{
        const datas:{curriculumId:string}[] = await CurriculumGateway.getCurriculumByCondition("curriculumId")
        const idList:string[] = []
        for(const data of datas){
            idList.push(data.curriculumId)
        }
        return idList;
    }    

    static getCurriculumById=async(id:string)=>{
        const datas:data[] = await CurriculumGateway.getCurriculumByCondition("*",{"curriculumId":id})
        const metadatas:PostMetaData[] = []
        for(const data of datas){
            metadatas.push(converseData(data))
        }
        return metadatas[0]
    }    
}