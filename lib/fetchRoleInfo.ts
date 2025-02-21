interface Role {
    id:string;
    name:string;
}

export async function fetchRoleInfo(){
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const GUILD_ID = process.env.NEXT_PUBLIC_GUILD_ID;
    const guildInfoUrl = `https://discord.com/api/guilds/${GUILD_ID}/roles`;
    const guildRequestOptions = {
      headers: {
        'Authorization': `Bot ${BOT_TOKEN}`
      }
    };
    const res = await fetch(guildInfoUrl,guildRequestOptions);
    const guildInfo:Role[] = await res.json();
    const basic_group = guildInfo.filter(item=>item.name==="基礎班");
    const dev_group = guildInfo.filter(item=>item.name=="発展班");    
    return {
        basic:{
            id:basic_group[0].id,
            name:basic_group[0].name
        },
        develop:{
            id:dev_group[0].id,
            name:dev_group[0].name
        }
    }
}