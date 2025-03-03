const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;

type data ={
    id:number;
    slug:string;
    data:string;
}[]

export class CurriculumGateway{
    getCurriculumBySlug=async(slug:string)=>{
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
    
    getAllCurriculum=async()=>{
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

    getAllSlug=async()=>{
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
}