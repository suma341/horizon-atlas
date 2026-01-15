// use server
import { readFile } from "fs/promises";
import { checkFileExist } from "../fileController"

export class VersionGW{
    static get=async()=>{
        const filepath = "tmp/v.dat"
        const exists = await checkFileExist(filepath)
        if(!exists){
            const res = await fetch(`${process.env.NEXT_PUBLIC_STORAGE_URL}/version.dat`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const v = await res.text();
            return v
        }else{
            const v = await readFile(filepath,{encoding:"utf-8"})
            return v
        }
    }
}