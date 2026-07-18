import { chromium } from "playwright";

const base = "http://localhost:3000";
const errors = [];

const browser = await chromium.launch();
const page = await browser.newPage();
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(msg.text());
});
page.on("pageerror", (err) => errors.push(String(err)));

async function log(step) {
  console.log(`-> ${step} :: ${page.url()}`);
}

// Login
await page.goto(`${base}/login`);
await page.waitForSelector('input[type="email"]');
await page.fill('input[type="email"]', "phase6.admin.test@automatewithjohn.com");
await page.fill('input[type="password"]', "Phase6TestAdmin!23");
await page.click('button[type="submit"]');
await page.waitForTimeout(2500);
await log("After login");

// Go to admin portfolio
await page.goto(`${base}/admin/portfolio`);
await page.waitForSelector("h1");
await log("Admin portfolio list");

// Create project
await page.click('a[href="/admin/portfolio/new"]');
await page.waitForSelector("#title");
await log("New project form");

await page.fill("#title", "Phase6 Test Project");
await page.fill("#summary", "A test project created by the phase 6 verification script.");
await page.fill("#description", "Full description of the phase 6 test project.\nSecond line.");
await page.fill("#category", "Web App");
await page.fill("#techStack", "Next.js, TypeScript");
await page.fill("#images", "https://example.com/img1.png, https://example.com/img2.png");
await page.fill("#githubUrl", "https://github.com/example/phase6-test");
await page.fill("#liveUrl", "https://example.com");
await page.check("#featured");
await page.click('button[type="submit"]');
await page.waitForTimeout(2500);
await log("After create project");

if (!page.url().endsWith("/admin/portfolio")) {
  const bodyText = await page.textContent("body");
  console.log("PAGE BODY:", bodyText.slice(0, 1500));
  throw new Error(`Expected redirect to /admin/portfolio, got ${page.url()}`);
}

const rowVisible = await page.getByText("Phase6 Test Project").isVisible();
console.log("Project row visible in admin list:", rowVisible);
if (!rowVisible) throw new Error("Created project not visible in admin list");

// Open the project to edit + add case study
await page.click('text=Phase6 Test Project');
await page.waitForSelector("#challenge");
await log("Edit project page (with case study form)");

await page.fill("#challenge", "The client's old process was slow.");
await page.fill("#solution", "We rebuilt it with a faster pipeline.");
await page.fill("#results", "Turnaround time dropped by 80%.");
await page.fill("#metrics", '{"turnaroundImprovement": "80%"}');
await page.click('button:has-text("Add case study")');
await page.waitForTimeout(2000);
await log("After adding case study");

const caseStudySaved = await page.getByText("Save case study").isVisible();
console.log("Case study form now shows 'Save case study' (i.e. it persisted):", caseStudySaved);
if (!caseStudySaved) throw new Error("Case study did not appear to save");

// Publish
await page.goto(`${base}/admin/portfolio`);
await page.waitForSelector("h1");
const publishButton = page
  .locator("div")
  .filter({ hasText: "Phase6 Test Project" })
  .getByRole("button", { name: "Publish" })
  .first();
await publishButton.click();
await page.waitForTimeout(2000);
await log("After publish");

const nowPublished = await page.getByText("PUBLISHED").first().isVisible();
console.log("Status now shows PUBLISHED:", nowPublished);

// Get the project slug for public view
const editLink = await page.getByText("Phase6 Test Project").getAttribute("href");
const projectId = editLink.split("/").pop();
await log(`Project id: ${projectId}`);

// View public portfolio listing
await page.goto(`${base}/portfolio`);
await page.waitForSelector("body");
const publicListVisible = await page.getByText("Phase6 Test Project").isVisible();
console.log("Project visible on public /portfolio:", publicListVisible);
if (!publicListVisible) throw new Error("Published project not visible on public portfolio page");

// View public detail page (need slug — derived from title via slugify: phase6-test-project)
await page.goto(`${base}/portfolio/phase6-test-project`);
await page.waitForSelector("body");
const detailVisible = await page.getByText("The client's old process was slow.").isVisible();
console.log("Case study content visible on public detail page:", detailVisible);
if (!detailVisible) throw new Error("Case study not visible on public project detail page");

// Cleanup: delete the project via admin
await page.goto(`${base}/admin/portfolio`);
await page.waitForSelector("h1");
page.once("dialog", (dialog) => dialog.accept());
const deleteButton = page
  .locator("div")
  .filter({ hasText: "Phase6 Test Project" })
  .getByRole("button", { name: "Delete" })
  .first();
await deleteButton.click();
await page.waitForTimeout(2000);
await log("After delete");

const stillVisible = await page.getByText("Phase6 Test Project").isVisible().catch(() => false);
console.log("Project still visible after delete (should be false):", stillVisible);
if (stillVisible) throw new Error("Project was not deleted");

console.log("\nConsole errors captured during run:", errors.length);
if (errors.length) console.log(errors);

await browser.close();
console.log("\nPhase 6 verification: PASS");
