import { PostMetaData } from "@/types/postMetaData";
import { CurriculumGateway } from "../Gateways/CurriculumGateway";

type data ={
    id:number;
    slug:string;
    title:string;
    date:string;
    category:string;
    is_basic_curriculum:string;
    visibility:string;
    tag:string;
}

const converseData =(data:data)=>{
    const postMetaData:PostMetaData = {
        title:data.title,
        slug:data.slug,
        date:data.date,
        category:data.category,
        visibility:JSON.parse(data.visibility),
        tags:JSON.parse(data.tag),
        is_basic_curriculum:JSON.parse(data.is_basic_curriculum),
        id:`${data.id}`
    }
    return postMetaData;
}

export class CurriculumService{
    getAllCurriculum=async()=>{
        const allPosts:PostMetaData[] = [];
        const alldata = await CurriculumGateway.getAllCurriculum();
        for(const data of alldata){
            const curriculumData:PostMetaData = converseData(data);
            allPosts.push(curriculumData);
        }
        return allPosts.sort((a,b)=>parseInt(a.id) -parseInt(b.id));
    }
    
    getCurriculumBySlug=async(slug:string)=>{
        const data = await CurriculumGateway.getCurriculumBySlug(slug);
        const post:PostMetaData = converseData(data[0])
        return post;
    }

    getAllSlug=async()=>{
        const data = await CurriculumGateway.getAllSlug()
        return data;
    }

    getAllTags=async()=>{
        const tags = await CurriculumGateway.getAllTags();
        const allTagDuplicate:string[] = [];
        for(const tag of tags){
            JSON.parse(tag.tag).map((item:string)=>{allTagDuplicate.push(item)})
        }
        const set = new Set(allTagDuplicate);
        const allTags = Array.from(set);
        return allTags
    }

    getAllCategories=async()=>{
        const categories = await CurriculumGateway.getAllCategories();
        const allCategoriesDuplicate:string[] = [];
        for(const category of categories){
            allCategoriesDuplicate.push(category.category)
        }
        const set = new Set(allCategoriesDuplicate);
        const allCategories = Array.from(set);
        return allCategories
    }

    getCurriculumByCategory=async(category:string)=>{
        const datas = await CurriculumGateway.getCurriculumByCategory(category);
        const metaData:PostMetaData[] = [];
        for(const data of datas){
            const postMetaData = converseData(data);
            metaData.push(postMetaData)
        }
        return metaData.sort((a,b)=>parseInt(a.id) -parseInt(b.id));
    }

    getBasicCurriculum=async()=>{
        const datas = await CurriculumGateway.getBasicCurriculum();
        const metaData:PostMetaData[] = [];
        for(const data of datas){
            const postMetaData = converseData(data);
            metaData.push(postMetaData)
        }
        return metaData.sort((a,b)=>parseInt(a.id) -parseInt(b.id));
    }    
}