import sizeOf from "image-size";
import { readFile } from "fs/promises";

export const getImageSize = async(url: string)=> {
    try{
        if(url.startsWith("https://")){
            // remote
            const res = await fetch(url);
            if (!res.ok) {
                console.log(`Failed to fetch image: ${res.statusText}`);
                return undefined
            }
            const arrayBuffer = await res.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            return sizeOf(buffer);
        }else{
            // local
            const replaced = url.replace("/horizon-atlas","./public")
            const buffer = await readFile(replaced);
            return sizeOf(buffer)
        }
    }catch(e){
        throw new Error(`error in getImageSize url:${url}\nerror: ${e}`)
    }
};