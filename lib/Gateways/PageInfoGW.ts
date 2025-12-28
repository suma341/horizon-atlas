// use server
import { PageInfo } from "@/types/page";
import { writeFile,readFile} from "fs/promises"
import { checkFileExist, mkdirTmpIfNotExists } from "../fileController";
import { decodeJson } from "../decodeJson";

export default class PageInfoGW{
    static get = async (match?: Partial<Record<keyof PageInfo, string | number>>) => {
        try{
            const exists = await checkFileExist("tmp/page.json")
            if(!exists){
                const res = await fetch(`${process.env.NEXT_PUBLIC_STORAGE_URL}/pages/page.dat`);
                if (!res.ok) {
                    console.log(await res.text())
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const txtData = await res.text();

                await mkdirTmpIfNotExists()
                const pagedata = await decodeJson<PageInfo[]>(txtData)
                await writeFile("tmp/page.json",JSON.stringify(pagedata))
                let data = pagedata
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
            }else{
                const pagedata = await readFile("tmp/page.json",{encoding:"utf-8"})
                let data:PageInfo[] = JSON.parse(pagedata)
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
            }
        }catch(e){
            throw new Error(`Error: ${e}`)
        }
    };
}