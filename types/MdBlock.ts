import { AtlBlockEntityData } from "./pageData";

export type MdBlock={
    children:MdBlock[];
    parent:AtlBlockEntityData;
    type:string;
    blockId:string;
}