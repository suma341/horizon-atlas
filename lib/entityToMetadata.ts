import { PostEntity, PostMetaData } from "@/types/postMetaData";

export const converseData =(data:PostEntity)=>{
    const postMetaData:PostMetaData = {
        title:data.title,
        curriculumId:data.curriculumId,
        category:data.category || "",
        visibility:JSON.parse(data.visibility),
        tags:JSON.parse(data.tag),
        is_basic_curriculum:JSON.parse(data.is_basic_curriculum),
        id:`${data.id}`,
        iconType:data.iconType,
        iconUrl:data.iconUrl,
        coverUrl:data.coverUrl,
        order: data.order
    }
    return postMetaData;
}