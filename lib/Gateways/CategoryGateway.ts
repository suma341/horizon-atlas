
type Category={
    id:string;
    title:string
    description: string
    iconUrl:string
    iconType: string
    cover: string
}

export class CategoryGateway{
    static getCategory=async()=>{
        const res = await fetch("https://raw.githubusercontent.com/Ryukoku-Horizon/atlas-storage2/main/public/categories/data.json");
        const data:Category[] = await res.json()
        return data
    }
}