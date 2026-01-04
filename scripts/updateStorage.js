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
      username: "GitHub Actions",
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
      horizon-atlasからnotion2atlasのworkflow実行に失敗しました
      期限切れの可能性があるので、確認しましょう
      error: ${text}
    `)
  console.error(text)
}

console.log("workflow dispatched");
})()
