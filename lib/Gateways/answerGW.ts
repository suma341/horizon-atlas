import { PageInfo } from "@/types/page";

export default class AnswerGW{
    static get = async (match?: Partial<Record<keyof PageInfo, string | number>>) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STORAGE_URL}/answers/data.json`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        let data: PageInfo[] = await res.json();

        if (match) {
            const keys = Object.keys(match) as (keyof PageInfo)[];
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
