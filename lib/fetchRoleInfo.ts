import { RoleData } from "@/types/role";

export async function fetchRoleInfo(){
    const API_KEY = process.env.SUPABASE_ANON_KEY!;
    const res = await fetch("https://cyqgvoqlgqqkppsbahkn.supabase.co/functions/v1/get_role", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
    });
    const result:RoleData = await res.json();
    return result;
}