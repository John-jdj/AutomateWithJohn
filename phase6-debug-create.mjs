import { chromium } from "playwright";
const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage();
page.on("console", (msg) => console.log("CONSOLE:", msg.type(), msg.text()));
page.on("pageerror", (err) => console.log("PAGEERROR:", String(err)));
page.on("requestfailed", (req) => console.log("REQFAILED:", req.url(), req.failure()?.errorText));
page.on("response", (res) => {
  if (res.request().method() === "POST") console.log("POST RESPONSE", res.status(), res.url());
});
page.on("request", (req) => {
  if (req.method() === "POST") console.log("POST REQUEST", req.url());
});

await page.goto("http://localhost:3000/login");
await page.waitForSelector('input[type="email"]');
await page.fill('input[type="email"]', "phase6.admin.test@automatewithjohn.com");
await page.fill('input[type="password"]', "Phase6TestAdmin!23");
await page.click('button[type="submit"]');
await page.waitForTimeout(2000);

await page.goto("http://localhost:3000/admin/portfolio/new");
await page.waitForSelector("#title");

await page.fill("#title", `Phase6 Debug Project ${Date.now()}`);
await page.fill("#summary", "summary text");
await page.fill("#description", "description text");
await page.fill("#category", "Web App");
await page.fill("#techStack", "Next.js, TypeScript");
await page.fill("#images", "https://example.com/img1.png, https://example.com/img2.png");
await page.fill("#githubUrl", "https://github.com/example/phase6-debug");
await page.fill("#liveUrl", "https://example.com");

console.log("Slug field value:", await page.inputValue("#slug"));
console.log("Submitting...");
await page.click('button[type="submit"]');
for (let i = 0; i < 10; i++) {
  await page.waitForTimeout(300);
  console.log(`t+${(i + 1) * 300}ms URL:`, page.url());
}
console.log("Body:", (await page.textContent("body")).slice(600, 1600));

await browser.close();
