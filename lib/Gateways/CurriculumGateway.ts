const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;

type data ={
    id:number;
    slug:string;
    title:string;
    date:string;
    category:string;
    is_basic_curriculum:string;
    visibility:string;
    tag:string;
}[]

export class CurriculumGateway{
    static getCurriculumBySlug=async(slug:string)=>{
        const res = await fetch(`${SUPABASE_URL}/functions/v1/get_curriculum_bySlug`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            },
            body:JSON.stringify({
                slug
            }),
        });
        const result:data = await res.json();
        return result;
    };
    
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

    static getAllSlug=async()=>{
        const res = await fetch(`${SUPABASE_URL}/functions/v1/getAllSlug`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            },
        });
        const pageDatas:{slug:string}[] = await res.json();
        return pageDatas;
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
}