import { Category } from "@/types/category";
import { CategoryGateway } from "../Gateways/CategoryGateway"

export class CategoryService{
    static getAllCategory=async()=>{
        const data:Category[] = await CategoryGateway.getCategory("*")
        return data;
    }
}