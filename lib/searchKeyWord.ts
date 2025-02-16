import { PostMetaData } from "@/types/postMetaData";
import stringSimilarity from 'string-similarity';
import { getAllChildPage } from "./getAllChildPage";

export const createSearchQuery=(text:string)=>{
    const keywords = text.split(/[ 　,、]/).filter(item => item.trim() !== "");
    return keywords;
}

export const searchByKeyWord = async(keyWords: string[],allPosts: PostMetaData[]) => {
    const normalize = (str: string) => str.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "");
    const allchildPages = await getAllChildPage();

    const scoredPosts = allPosts.map(post => {
        let score = 0;
        const childPages = allchildPages.filter(item=>item.slug===post.slug);
        for (const word of keyWords) {
            const lowerWord = word.toLowerCase();
            const normalizedWord = normalize(lowerWord);
            score = score + stringSimilarity.compareTwoStrings(normalize(post.title), normalizedWord) * 1.2;
            score = score +  stringSimilarity.compareTwoStrings(normalize(post.slug), normalizedWord) * 1.2;
            for(const tag of post.tags){
                score = score + (stringSimilarity.compareTwoStrings(normalize(tag),normalizedWord));
            }
            for(const child of childPages){
                score = score + (stringSimilarity.compareTwoStrings(normalize(child.parent.slice(2)),normalizedWord));
            }
        }
        console.log(post.title);
        console.log(score);
        return { post, score };
    });
    scoredPosts.push()

    // スコア順にソートし、スコアが0以上のものを返す
    return scoredPosts
        .filter(({ score }) => score > 0.33)
        .sort((a, b) => b.score - a.score)
        .map(({ post }) => post);
};

