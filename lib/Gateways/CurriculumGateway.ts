import { PostMetaData } from "@/types/postMetaData";

type Curriculum={
    id: string,
    title: string,
    is_basic_curriculum: boolean,
    visibility: string[],
    category: string,
    tag: string[],
    iconType: string,
    iconUrl:string,
    coverUrl: string,
    order: number
}

type TagData={
    id: string
    name: string;
    color: string;
}

export class CurriculumGateway{    
    static get = async (match?: Partial<Record<keyof Curriculum, string | string[] | boolean | number>>) => {
        const res = await fetch("https://raw.githubusercontent.com/Ryukoku-Horizon/atlas-storage2/main/public/curriculums/data.json");
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        let data: Curriculum[] = await res.json();

        if (match) {
            const keys = Object.keys(match) as (keyof Curriculum)[];
            for (const key of keys) {
                const value = match[key];
                if (value !== undefined) {
                    data = data.filter((d) => d[key] === value);
                }
            }
        }   
        const result = data.map(d=>{
            return {
                ...d,
                curriculumId:d.id,
                tags:d.tag
            } as PostMetaData
        })
        return result
    };

    static getAllTag=async()=>{
        const res = await fetch("https://ryukoku-horizon.github.io/atlas-storage/tags/data.json");
        const data:TagData[] = await res.json()
        return data.map(d=>d.name)
    }
}