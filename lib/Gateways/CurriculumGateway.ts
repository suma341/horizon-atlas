import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/constants/supabaseEnvironmental";

type Column="title" | "category" | "is_basic_curriculum" | "visibility" | "tag" | "curriculumId" | "iconType" | "iconUrl" | "coverUrl" | "order" | "*"

export class CurriculumGateway{    

    // static getAllCategories=async()=>{
    //     const res = await fetch(`${SUPABASE_URL}/functions/v1/getAllCategories`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
    //         },
    //     });
    //     const pageDatas:{category:string}[] = await res.json();
    //     return pageDatas;
    // }

    // static getCurriculumByCategory=async(category:string)=>{
    //     const res = await fetch(`${SUPABASE_URL}/functions/v1/getCarriculumByCategory`, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
    //         },
    //         body:JSON.stringify({
    //             category
    //         }),
    //     });
    //     const result:data = await res.json();
    //     return result;
    // }

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
        const data = await res.json()
        return data;
    }
}