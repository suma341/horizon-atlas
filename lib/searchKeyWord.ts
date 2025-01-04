import { PostMetaData } from "@/types/postMetaData";
import { getAllPosts } from "./services/notionApiService";

export const createSearchQuery=(text:string)=>{
    const keywords = text.split(/[ 　,、]/).filter(item => item.trim() !== "");
    return keywords;
}

export const searchByKeyWord = async (keyWords: string[]) => {
    const allPosts: PostMetaData[] = await getAllPosts();

    const scoredPosts = allPosts.map(post => {
        let score = 0;
        for (const word of keyWords) {
            const lowerWord = word.toLowerCase();
            if (post.title.toLowerCase().includes(lowerWord)) {
                score += 2; // タイトル内の部分一致
            }
            if (post.slug.toLowerCase().includes(lowerWord)) {
                score += 1; // スラッグ内の部分一致
            }
            for(const tag of post.tags){
                if(tag.toLowerCase().includes(lowerWord)){
                    score += 1;
                }
            }
        }
        return { post, score };
    });

    // スコア順にソートし、スコアが0以上のものを返す
    return scoredPosts
        .filter(({ score }) => score > 12)
        .sort((a, b) => b.score - a.score)
        .map(({ post }) => post);
};

