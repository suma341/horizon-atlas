import { PostMetaData } from "@/types/postMetaData";
import { getCurriculum } from "../Gateways/CurriculumGateway";

export async function getAllCurriculum(){
    const allPosts:PostMetaData[] = [];
    const alldata = await getCurriculum();
    for(const data of alldata){
        const curriculumData = data.data;
        const posts:PostMetaData = await JSON.parse(curriculumData);
        allPosts.push(posts);
    }
    return allPosts;
}