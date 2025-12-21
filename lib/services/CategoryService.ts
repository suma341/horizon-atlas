import { CategoryGateway } from "../Gateways/CategoryGateway"

export class CategoryService{
    static getAllCategory=async()=>{
        const data = await CategoryGateway.get()
        return data;
    }

    static getCategoryById=async(id:string)=>{
        const category = await CategoryGateway.get({"id":id})
        if(category[0]) return category[0]
        return null
    }

    static getCategoryByName=async(title:string)=>{
        const category = await CategoryGateway.get({title})
        if(category[0]) return category[0]
        return null
    }

    static getBasicCategory=async()=>{
        const categories = await CategoryGateway.get({is_basic_curriculum:true})
        return categories
    }

    static getNotBasicCategory=async()=>{
        const categories = await CategoryGateway.get({is_basic_curriculum:false})
        return categories
    }
}