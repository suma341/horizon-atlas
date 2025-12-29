// use server
import { AtlBlockEntityData, PageData } from "@/types/pageData"
import { loadAndDecodeJson } from "../decodeJson";

type BlockData={
    curriculumId:string
    parentId: string
    data: AtlBlockEntityData,
    id: string,
    type: string,
    pageId: string,
    order: number,
}

export class PageDataGateway{
    static get = async (pageId:string,match?: Partial<Record<keyof BlockData, string | string[] | boolean | number>>,limit:number=3):Promise<PageData[]> => {
        if(!pageId){
            throw new Error("missing pageId in PageDataGateway/get")
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_STORAGE_URL}/pageData/${pageId}.dat`);
        if (!res.ok) {
            const status = res.status
            if(status===404){
                return []
            }else if(status === 429 || status === 403 || status === 503){
                if(limit <= 0){
                    throw new Error(`error in PageDataGateway/get status: ${status} text: ${await res.text()}`)
                }
                console.log("リクエスト制限がかかりました:２秒待機します...")
                await new Promise((resolve) => setTimeout(resolve, 2000));
                return await this.get(pageId, match, limit - 1);
            }
            console.error(`error in /pageData/${pageId}.json`)
            throw new Error(`error in PageDataGateway/get status: ${status} text: ${await res.text()}`);
        }
        const txtData = await res.text()
        const blockDatas = await loadAndDecodeJson<BlockData[]>(txtData)
        let data:BlockData[] = blockDatas

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
                blockId:d.id
            } as PageData
        })
        return result
    };
}