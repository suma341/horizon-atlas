const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;

type data ={
    id:number;
    slug:string;
    data:string;
}[]

export async function getCurriculumBySlug(slug:string){
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
}

export async function getCurriculum(){
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