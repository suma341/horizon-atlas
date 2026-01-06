async function notifyDiscord(message) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK_URL not set");
    return;
  }

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "HorizonAtlas",
      content: message,
    }),
  });
}

(async()=>{
  const token = process.env.ATLAS_STORAGE_GH_PAT;

const res = await fetch(
  "https://api.github.com/repos/Ryukoku-Horizon/atlas-storage/actions/workflows/update-data.yml/dispatches",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ref: "main" }),
  }
);

if (!res.ok) {
  const text = await res.text();
  await notifyDiscord(`
      ## 【緊急】
      horizon-atlasからupdate-data workflow実行に失敗しました
      ATLAS_STORAGE_GH_PATが期限切れの可能性があります。確認して、必要なら期限を更新してください
    `)
  console.error(text)
}
const date = new Date()
if(date.getMonth() % 4===0 && date.getDate()===1){
  await notifyDiscord(`
    ## 【定期】
    ATLAS_STORAGE_GH_PATの期限を更新してください。
    方法についてはこちら→[pat更新の方法](https://www.notion.so/pat-2e0a501ef33780e7be6cef8a86802f2f)
  `)
}

console.log("workflow dispatched");
})()
