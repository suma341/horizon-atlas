import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

type Guild = {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log("Starting /api/discord/guilds");

    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      console.log("Session not found");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const accessToken = session.token?.accessToken;
    if (!accessToken) {
      console.log("Access token missing");
      return res.status(403).json({ error: "Access token not found" });
    }

    let response;
    let retryAfter = 0;

    do {
      if (retryAfter > 0) {
        console.log(`Retrying after ${retryAfter} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      }

      response = await fetch("https://discord.com/api/users/@me/guilds", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.status === 429) {
        const data = await response.json();
        retryAfter = data.retry_after || 1; // fallback to 1 second if not specified
        console.error("Rate limited:", data);
      } else {
        retryAfter = 0; // Exit loop on successful response
      }
    } while (retryAfter > 0);

    if (!response.ok) {
      console.error("Discord API Error:", response.status, await response.text());
      throw new Error("Failed to fetch guilds");
    }

    const guilds: Guild[] = await response.json();
    console.log("Fetched guilds:", guilds);

    const targetGuildId = process.env.DISCORD_HORIZON_ID;
    const userInGuild = guilds.some((guild) => guild.id === targetGuildId);

    if (userInGuild) {
      return res.status(200).json({ message: "User is in Horizon" });
    } else {
      return res.status(302).json({ message: "User is not in Horizon" });
    }
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
