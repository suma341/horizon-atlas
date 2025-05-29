import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/constants/supabaseEnvironmental";

type data ={
    id:number;
    curriculumId:string;
    title:string;
    category:string;
    is_basic_curriculum:string;
    visibility:string;
    tag:string;
    iconType:string;
    iconUrl:string;
    coverUrl:string;
    order: number;
}[]

export class CurriculumGateway{    
    static getAllCurriculum=async()=>{
        const res = await fetch(`${SUPABASE_URL}/functions/v1/get_curriculum`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            },
        });
        const result:data = await res.json();
        return result;
    }

    static getAllTags=async()=>{
        const res = await fetch(`${SUPABASE_URL}/functions/v1/getAllTags`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            },
        });
        const pageDatas:{tag:string}[] = await res.json();
        return pageDatas;
    }

    static getAllCategories=async()=>{
        const res = await fetch(`${SUPABASE_URL}/functions/v1/getAllCategories`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            },
        });
        const pageDatas:{category:string}[] = await res.json();
        return pageDatas;
    }

    static getCurriculumByCategory=async(category:string)=>{
        const res = await fetch(`${SUPABASE_URL}/functions/v1/getCarriculumByCategory`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            },
            body:JSON.stringify({
                category
            }),
        });
        const result:data = await res.json();
        return result;
    }

    static getBasicCurriculum=async()=>{
        const res = await fetch(`${SUPABASE_URL}/functions/v1/getBasicCurriculum`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            },
        });
        const result:data = await res.json();
        return result;
    }

    static getCurriculumByCondition=async(select:string,match?:{[key:string]:string})=>{
        const res = await fetch(`${SUPABASE_URL}/functions/v1/getCurriculumWithSelect`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            },
            body:JSON.stringify({
                match,
                select
            })
        })
        const blockId = await res.json()
        return blockId;
    }
}