// use server

import { mkdir,access} from "fs/promises"
import fs from "fs"

export const checkFileExist=async(path:string)=>{
    try {
        await access(path, fs.constants.F_OK);
        return true
    } catch {
        return false
    }
}

export const mkdirTmpIfNotExists=async()=>{
    const tmpIsExist = await checkFileExist("tmp")
    if(!tmpIsExist) await mkdir("tmp")
}
