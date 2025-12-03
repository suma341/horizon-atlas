import { PageData } from "@/types/pageData";
type BlockData={
    curriculumId:string
    parentId: string
    data: Record<string,string | number | boolean> | string
    id: string
    type: string
    pageId: string
    order: number
}

export default class SyncedGW{
    static get = async (match?: Partial<Record<keyof BlockData, string>>):Promise<PageData[]> => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STORAGE_URL}/synced/data.json`);
        if (!res.ok) {
            throw new Error(`error in SyncedGW/get status: ${res.status}, text: ${await res.text()}`);
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
            return {...d,blockId:d.id}  as PageData
        })
    };
}

// https://ryukoku-horizon.github.io/atlas-storage/pages/1ada501e-f337-81d0-93c4-cc25006a2031.json