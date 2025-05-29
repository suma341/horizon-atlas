import "dotenv/config"

const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL

export const getAll=async()=>{
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