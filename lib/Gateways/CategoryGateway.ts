// use server
import { Category } from "@/types/category";

export class CategoryGateway{
    static get = async (match?: Partial<Record<keyof Category, string | string[] | boolean | number>>) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_STORAGE_URL}/categories/data.json`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
    
            let data: Category[] = await res.json();
    
            if (match) {
                const keys = Object.keys(match) as (keyof Category)[];
                for (const key of keys) {
                    const value = match[key];
                    if (value !== undefined) {
                        data = data.filter((d) => d[key] === value);
                    }
                }
            }   
            return data
        };
}