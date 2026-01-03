import { PageData } from "@/types/pageData";
import { MdBlock } from "@/types/MdBlock";

export function buildTree(pageData:PageData[], parentId:string):MdBlock[] {
    try{
        const mdBlocks:MdBlock[] = pageData
            .filter(item => item.parentId === parentId)
            .map(item =>{
                return({
                    blockId: item.blockId,
                    type: item.type,
                    parent: item.data,
                    children: buildTree(pageData, item.blockId) 
            })});
        return mdBlocks;
    }catch(e){
        throw new Error(`error in buildTree: ${e}`)
    }
}