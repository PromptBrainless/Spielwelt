import { chromium } from 'playwright';

const url = 'https://grok.com/share/bGVnYWN5_bb825d4d-5d9d-417f-b452-1dbeb8d664cd';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const apiHits = [];
page.on('response', async (res) => {
  const u = res.url();
  if (/share|conversation|chat|rest|graphql/i.test(u) && !/\.(js|css|woff2|png|jpg|svg)/.test(u)) {
    try {
      const ct = res.headers()['content-type'] || '';
      let body = '';
      if (ct.includes('json') || ct.includes('text') || ct.includes('ndjson')) {
        body = (await res.text()).slice(0, 2000);
      }
      apiHits.push({ status: res.status(), u, ct, body });
    } catch (e) {
      apiHits.push({ status: res.status(), u, err: String(e) });
    }
  }
});

await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(4000);

const text = await page.evaluate(() => document.body.innerText);
const htmlLen = (await page.content()).length;
console.log('=== PAGE TEXT START ===');
console.log(text.slice(0, 30000));
console.log('=== PAGE TEXT END len', text.length, 'html', htmlLen);
console.log('=== API HITS', JSON.stringify(apiHits, null, 2).slice(0, 20000));

await browser.close();
