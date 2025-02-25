import { PostMetaData } from "@/types/postMetaData";
import { CurriculumGateway } from "../Gateways/CurriculumGateway";

const curriculumGateway = new CurriculumGateway();

export class CurriculumService{
    getAllCurriculum=async()=>{
        const allPosts:PostMetaData[] = [];
        const alldata = await curriculumGateway.getAllCurriculum();
        for(const data of alldata){
            const curriculumData = data.data;
            const posts:PostMetaData = await JSON.parse(curriculumData);
            allPosts.push(posts);
        }
        return allPosts;
    }
    
    getCurriculumBySlug=async(slug:string)=>{
        const data = await curriculumGateway.getCurriculumBySlug(slug);
        const post:PostMetaData = await JSON.parse(data[0].data);
        return post;
    }
}