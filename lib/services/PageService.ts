import { MdBlock } from "notion-to-md/build/types";
import { getPageBySlug } from "../Gateways/PageGateway";

export async function getPage(slug:string){
    const data = await getPageBySlug(slug);
    const pageData = data[0].data;
    const mdBlocks:MdBlock[] = await JSON.parse(pageData);
    return mdBlocks;
}