import { PageData } from "@/types/pageData";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/constants/supabaseEnvironmental";

export class PageDataGateway{
    static getPageDataByPageId=async(pageId:string)=>{
        const res = await fetch(`${SUPABASE_URL}/functions/v1/getPageDataByPageId`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            },
            body:JSON.stringify({
                pageId
            })
        });
        const pageDatas:PageData[] = await res.json();
        const sortedData = pageDatas.sort((a,b)=>a.order-b.order);
        return sortedData;
    }

    static getPageDataByType=async(type:string)=>{
        const res = await fetch(`${SUPABASE_URL}/functions/v1/getPageDataByType`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
            },
            body:JSON.stringify({
                type
            })
        });
        const pageDatas:PageData[] = await res.json();
        return pageDatas;
    }

    static getPageDataByConditions=async(select:string,match?:{[key:string]:string})=>{
        const res = await fetch(`${SUPABASE_URL}/functions/v1/getPageDataWithSelect`,{
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