import { HeadingData } from "@/types/headingData";
import { MdBlock } from "@/types/MdBlock";

type HeadingType ={
    type:number;
    parent:string;
    blockId:string;
}

export function findHeadingBlock(mdBlocks:MdBlock[]):HeadingType[]{
    try{
        const findList:HeadingType[] = [];
        for(const block of mdBlocks){
            const data = block.parent as HeadingData
            if(Array.isArray(block.parent)){
                const texts = data.parent.map((data)=>data.plain_text)
                if(block.type==="heading_1"){
                    findList.push({
                        type:1,
                        parent:texts.join(),
                        blockId:block.blockId
                    })
                }else if(block.type==="heading_2"){
                    findList.push({
                        type:2,
                        parent:texts.join(),
                        blockId:block.blockId
                    })
                }else if(block.type==="heading_3"){
                    findList.push({
                        type:3,
                        parent:texts.join(),
                        blockId:block.blockId
                    })
                }
            }
        }
        return findList;
    }catch(e){
        throw new Error(`error in findHeadingBlock: ${e}`)
    }
}