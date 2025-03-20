import { CurriculumService } from "./services/CurriculumService";
import { PageDataService } from "./services/PageDataService";

export async function searchBlock(targetId:string){
    const curriculums = await CurriculumService.getAllCurriculumId()
    for(const id of curriculums){
        const blockIds = await PageDataService.getAllBlockId(id)
        const target = blockIds.find((id)=>{
            return targetId===id.replaceAll("-","")}
        )
        if(target){
            return target
        }
    }
}

// `1b8a501ef3378136947bdf6528c2da91`;
// `1b8a501e-f337-8156-a17a-ea0f3454ff49`;
// `1b8a501e-f337-8136-947b-df6528c2da91`