import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const accessToken = session.token?.accessToken;

  if (!accessToken) {
    return res.status(403).json({ error: "Access token not found" });
  }

  try {
    // ユーザーのギルド情報を取得
    const response = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch guilds");
    }

    const guilds = await response.json();
    
    // 特定のギルドIDが存在するかを確認
    const targetGuildId = process.env.DISCORD_SERVER_HORIZON_ID;
    const userInGuild = guilds.some((guild: any) => guild.id === targetGuildId);

    if (userInGuild) {
      res.status(200).json({message: "User is in Horizon" });
    } else {
      res.status(302).json({message: "User is not in Horizon"})
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
