import { PageData } from "@/types/pageData"

type BlockData={
    curriculumId:string
    parentId: string
    data: string
    blockId: string
    type: string
    pageId: string
    i: number
}

export class PageDataGateway{
    static get = async (pageId:string,match?: Partial<Record<keyof BlockData, string | string[] | boolean | number>>,limit:number=3):Promise<PageData[]> => {
        if(!pageId){
            throw new Error("missing pageId or curriculumId")
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_STORAGE_URL}/pageData/${pageId}.json`);
        if (!res.ok) {
            const status = res.status
            if(status===404){
                return []
            }else if(status === 429 || status === 403 || status === 503){
                if(limit <= 0){
                    throw new Error(`HTTP error! status: ${status}`)
                }
                console.log("リクエスト制限がかかりました:２秒待機します...")
                await new Promise((resolve) => setTimeout(resolve, 2000));
                return await this.get(pageId, match, limit - 1);
            }
            console.error(`error in /pageData/${pageId}.json`)
            throw new Error(`HTTP error! status: ${status}`);
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
        const result = data.map(d=>{
            return {
                ...d,
                order:d.i
            } as PageData
        })
        return result
    };
}