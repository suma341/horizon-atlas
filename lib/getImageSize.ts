import sizeOf from "image-size";
import { readFile } from "fs/promises";

export const getImageSize = async(url: string)=> {
    if(url.startsWith("https://")){
        // remote
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to fetch image: ${res.statusText}`);
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
};