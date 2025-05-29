import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/constants/supabaseEnvironmental";

export class CurriculumGateway{    
    static getAll=async()=>{
        const res = await fetch(`${SUPABASE_URL}/functions/v1/get_curriculum`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            },
        });
        const result = await res.json();
        return result;
    }
}