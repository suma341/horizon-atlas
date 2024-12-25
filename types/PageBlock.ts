import { MdBlock } from "notion-to-md/build/types";

export type PageBlock={
    id:string;
    // parentPageId:string;
    title:string;
    mdBlocks:MdBlock[];
}