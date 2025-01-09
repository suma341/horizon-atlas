import { getSinglePost } from "@/lib/services/notionApiService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest,res: NextApiResponse){
    const { slug } = req.query;
    if(slug){
        try{
            const post = await getSinglePost(slug as string);
            res.status(200).json({mdBlocks:post.mdBlocks})
        }catch(e){
            res.status(500).json({error:e})
        }
    }else{
        res.status(302).json({message:"invalid value of slug"})
    }
}