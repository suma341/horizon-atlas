import { Parent } from "./Parent";

export type ImageBlock ={
    parent:Parent[];
    url:string;
}

export type ImageBlock_Size={
    parent:Parent[];
    url:string;
    width:number;
    height:number;
}

export type LinkToPageBlock={
    link: string;
    title: string;
    iconType: string;
    iconUrl: string;
}