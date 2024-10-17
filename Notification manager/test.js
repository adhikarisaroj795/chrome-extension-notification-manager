// test.js
const puppeteer = require("puppeteer");

async function testExtension() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("http://localhost:8080"); // Replace with your test URL

  // Test creating a notification
  await page.evaluate(() => {
    createNotification("Test Title", "Test Message", "https://example.com");
  });

  // Test clearing notifications
  await page.evaluate(() => {
    document.getElementById("clear-notifications").click();
  });

  await browser.close();
}

testExtension();
