import { CategoryGateway } from "../Gateways/CategoryGateway"

export class CategoryService{
    static getAllCategory=async()=>{
        const data = await CategoryGateway.getCategory()
        return data;
    }
}