import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/constants/supabaseEnvironmental";

export class CategoryGateway{
    static getCategory=async(select:string,match?:{[key:string]:string})=>{
        const res = await fetch(`${SUPABASE_URL}/functions/v1/getCategory`,{
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
        const data = await res.json()
        return data;
    }
}