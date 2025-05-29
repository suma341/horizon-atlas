const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { CurriculumGateway } = require('./gateways/currilumGateway');

const curriculums = await CurriculumGateway.getAll()

(async () => {
  const browser = await puppeteer.launch();
  const outputDir = path.resolve(__dirname, '../public/ogp');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  for (const c of curriculums) {
    const page = await browser.newPage();
    // ここで画像にしたいHTMLをセット
    const html = `
      <html>
        <body style="width: 1200px; height: 630px; display: flex; justify-content: center; align-items: center; background: white; font-size: 64px;">
          ${c.title}
        </body>
      </html>
    `;
    await page.setContent(html);
    await page.setViewport({ width: 1200, height: 630 });
    const filePath = path.join(outputDir, `${c.curriculumId}-${c.pageId}.png`);
    await page.screenshot({ path: filePath });
    console.log(`Generated ${filePath}`);
  }

  await browser.close();
})();
