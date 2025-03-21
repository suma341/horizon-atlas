const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;

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