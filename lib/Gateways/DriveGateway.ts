import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/constants/supabaseEnvironmental";

export const userProgressGateway=async(fileId:string,sheetName:string,studentNumber:string)=>{
    const res = await fetch(`${SUPABASE_URL}/functions/v1/userProgress`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            },
            body:JSON.stringify({fileId,sheetName,studentNumber})
        }
    )
    if(!res.ok){
        return null
    }
    const data = await res.json();
    return data;
}