import { PageDataService } from "./services/PageDataService";


export async function searchBlock(targetId:string){
    const blockIds = await PageDataService.getAllBlockId()
    const target = blockIds.find((id)=>{
        return targetId===id.replaceAll("-","")
    })
    return target
}