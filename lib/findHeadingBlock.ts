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
            findList.push({
                type:1,
                parent:block.parent.replaceAll("**",""),
                blockId:block.blockId
            })
        }else if(block.type==="heading_2"){
            findList.push({
                type:2,
                parent:block.parent.replaceAll("**",""),
                blockId:block.blockId
            })
        }else if(block.type==="heading_3"){
            findList.push({
                type:3,
                parent:block.parent.replaceAll("**",""),
                blockId:block.blockId
            })
        }
    }
    return findList;
}