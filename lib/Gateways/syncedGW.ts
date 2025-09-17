import { PageData } from "@/types/pageData";
type BlockData={
    curriculumId:string
    parentId: string
    data: string
    blockId: string
    type: string
    pageId: string
    i: number
}

export default class SyncedGW{
    static get = async (match?: Partial<Record<keyof BlockData, string>>) => {
        const res = await fetch("https://raw.githubusercontent.com/Ryukoku-Horizon/atlas-storage2/main/public/synced/data.json");
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        let data: BlockData[] = await res.json();

        if (match) {
            const keys = Object.keys(match) as (keyof BlockData)[];
            for (const key of keys) {
                const value = match[key];
                if (value !== undefined) {
                    data = data.filter((d) => d[key] === value);
                }
            }
        }   
        return data.map(d=>{
            return {...d,order:d.i} as PageData
        })
    };
}

// https://ryukoku-horizon.github.io/atlas-storage/pages/1ada501e-f337-81d0-93c4-cc25006a2031.json