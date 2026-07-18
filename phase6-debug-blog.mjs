import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage();
page.on("console", (msg) => console.log("CONSOLE:", msg.type(), msg.text()));

await page.goto("http://localhost:3000/login");
await page.waitForSelector('input[type="email"]');
await page.fill('input[type="email"]', "phase6.admin.test@automatewithjohn.com");
await page.fill('input[type="password"]', "Phase6TestAdmin!23");
await page.click('button[type="submit"]');
await page.waitForTimeout(2000);

await page.goto("http://localhost:3000/admin/blog/new");
await page.waitForSelector("#title");
await page.fill("#title", `Debug Blog Post ${Date.now()}`);
await page.fill("#excerpt", "excerpt text");
await page.fill("#content", "content text");
await page.click('button[type="submit"]');
for (let i = 0; i < 8; i++) {
  await page.waitForTimeout(300);
  console.log(`t+${(i + 1) * 300}ms URL:`, page.url());
}
await browser.close();
