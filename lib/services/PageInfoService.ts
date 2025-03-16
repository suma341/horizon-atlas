import { PageInfo } from "@/types/PageInfo";
import { PageInfoGateway } from "../Gateways/PageInfoGateway";

export class PageInfoService{
    static getPageInfoByPageId=async(pageId:string)=>{
        const pageInfo:PageInfo[] = await PageInfoGateway.getPageInfo("*",{pageId});
        return pageInfo[0];
    }

    static getAllIcon=async()=>{
        const allIcon:{iconType:string,iconUrl:string,pageId:string}[] = await PageInfoGateway.getPageInfo("iconType,iconUrl,pageId")
        return allIcon;
    }

    static getIconByPageId=async(pageId:string)=>{
        const icon:{iconType:string,iconUrl:string,pageId:string}[] = await PageInfoGateway.getPageInfo("iconType,iconUrl,pageId",{pageId})
        return icon[0];
    }
}