import { CurriculumGateway } from "../Gateways/CurriculumGateway";

export class CurriculumService{
    static getAllCurriculum=async()=>{
        const alldata = await CurriculumGateway.get()
        return alldata.sort((a,b)=>a.order - b.order);
    }

    static getCurriculumByCategory=async(category:string)=>{
        // const datas = await CurriculumGateway.getCurriculumByCategory(category);
        const datas = await CurriculumGateway.get({"category":category})
        return datas.sort((a,b)=>a.order -b.order);
    }

    static getCurriculumById=async(id:string)=>{
        const datas = await CurriculumGateway.get({"id":id})
        return datas[0]
    }    
}