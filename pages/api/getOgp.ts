import ogs from "open-graph-scraper";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest,res: NextApiResponse){
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Invalid URL' });
    }
    try {
        const { result } = await ogs({ url });
        res.status(200).json({result})
      } catch {
        res.status(302).json({success:false});
      }
}