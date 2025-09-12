import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const REPO_URL = `https://${process.env.GITHUB_TOKEN}@github.com/Ryukoku-Horizon/atlas-strage`;

// リポジトリを clone
execSync(`git clone ${REPO_URL}`, { stdio: "inherit" });

// ファイルを追加（例: target-repo/data/newfile.json）
const filePath = path.join("atlas-strage", "newfile.json");
fs.mkdirSync(path.dirname(filePath), { recursive: true });
fs.writeFileSync(filePath, JSON.stringify({ hello: "world" }, null, 2));

// commit & push
execSync(`
  cd target-repo &&
  git config user.name "github-actions[bot]" &&
  git config user.email "github-actions[bot]@users.noreply.github.com" &&
  git add . &&
  git commit -m "Add new file" ||
  echo "No changes to commit" &&
  git push origin main
`, { stdio: "inherit" });
