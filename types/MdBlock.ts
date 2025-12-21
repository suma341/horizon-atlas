export type MdBlock={
    children:MdBlock[];
    parent:Record<string,any> | string;
    type:string;
    blockId:string;
}