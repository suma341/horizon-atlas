// use server
import { Category } from "@/types/category";
import { checkFileExist, mkdirTmpIfNotExists } from "../fileController";
import { readFile, writeFile } from "fs/promises";
import { loadAndDecodeJson } from "../decodeJson";

export class CategoryGateway{
    static get = async (match?: Partial<Record<keyof Category, string | string[] | boolean | number>>) => {
        const filepath = "tmp/category.json"
        const exists = await checkFileExist(filepath)
        if(!exists){
            const res = await fetch(`${process.env.NEXT_PUBLIC_STORAGE_URL}/categories/category.dat`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const txtData = await res.text();
            const pagedata = await loadAndDecodeJson<Category[]>(txtData)
            let data = pagedata

            if (match) {
                const keys = Object.keys(match) as (keyof Category)[];
                for (const key of keys) {
                    const value = match[key];
                    if (value !== undefined) {
                        data = data.filter((d) => d[key] === value);
                    }
                }
            }   
            await mkdirTmpIfNotExists()
            await writeFile(filepath,JSON.stringify(pagedata))
            return data
        }else{
            const pagedata = await readFile(filepath,{encoding:"utf-8"})
            let data: Category[] = JSON.parse(pagedata)

            if (match) {
                const keys = Object.keys(match) as (keyof Category)[];
                for (const key of keys) {
                    const value = match[key];
                    if (value !== undefined) {
                        data = data.filter((d) => d[key] === value);
                    }
                }
            }   
            return data
        }
    };
}