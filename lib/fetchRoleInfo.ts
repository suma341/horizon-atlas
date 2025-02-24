import { RoleData } from "@/types/role";

export async function fetchRoleInfo(){
    const API_KEY = process.env.SUPABASE_ANON_KEY!;
    const SUPABASE_URL = process.env.SUPABASE_URL!;
    const res = await fetch(`${SUPABASE_URL}/functions/v1/get_role`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
    });
    const result:RoleData = await res.json();
    return result;
}