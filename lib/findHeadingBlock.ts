import { HeadingData } from "@/types/headingData";
import { MdBlock } from "notion-to-md/build/types";

type HeadingType ={
    type:number;
    parent:string;
    blockId:string;
}

export function findHeadingBlock(mdBlocks:MdBlock[]){
    const findList:HeadingType[] = [];
    for(const block of mdBlocks){
        if(block.type==="heading_1"){
            const data:HeadingData = JSON.parse(block.parent)
            const texts = data.parent.map((data)=>data.plain_text)
            findList.push({
                type:1,
                parent:texts.join(),
                blockId:block.blockId
            })
        }else if(block.type==="heading_2"){
            const data:HeadingData = JSON.parse(block.parent)
            const texts = data.parent.map((data)=>data.plain_text)
            findList.push({
                type:2,
                parent:texts.join(),
                blockId:block.blockId
            })
        }else if(block.type==="heading_3"){
            const data:HeadingData = JSON.parse(block.parent)
            const texts = data.parent.map((data)=>data.plain_text)
            findList.push({
                type:3,
                parent:texts.join(),
                blockId:block.blockId
            })
        }
    }
    return findList;
}