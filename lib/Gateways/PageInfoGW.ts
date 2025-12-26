// use server
import { PageInfo } from "@/types/page";


export default class PageInfoGW{
    static get = async (match?: Partial<Record<keyof PageInfo, string | number>>) => {
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_STORAGE_URL}/pages/data.json`);
            if (!res.ok) {
                console.log(await res.text())
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            let data: PageInfo[] = await res.json();

            if (match) {
                const keys = Object.keys(match) as (keyof PageInfo)[];
                for (const key of keys) {
                    const value = match[key];
                    if (value !== undefined) {
                        data = data.filter((d) => d[key] === value);
                    }
                }
            }   
            return data
        }catch(e){
            throw new Error(`Error: ${e}`)
        }
    };
}

// https://ryukoku-horizon.github.io/atlas-storage/pages/1ada501e-f337-81d0-93c4-cc25006a2031.json