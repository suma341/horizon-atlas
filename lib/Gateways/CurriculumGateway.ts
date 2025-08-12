import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/constants/supabaseEnvironmental";

type Column="title" | "category" | "is_basic_curriculum" | "visibility" | "tag" | "curriculumId" | "iconType" | "iconUrl" | "coverUrl" | "order" | "*"

export class CurriculumGateway{    
    static get=async(select:Column | Column[],match?:{[key:string]:string})=>{
        const res = await fetch(`${SUPABASE_URL}/functions/v1/getCurriculumWithSelect`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            },
            body:JSON.stringify({
                match,
                select:Array.isArray(select) ? select.join(",") : select
            })
        })
        if(!res.ok){
            const text = await res.text()
            console.error("error:",text)
            throw new Error("error at curriculumGateway")
        }
        const data = await res.json()
        return data;
    }
}