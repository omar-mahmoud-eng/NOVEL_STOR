const { chromium } = require('playwright');
const path = require('path');

const prototypePath = 'file:///' + path.resolve('C:/Users/D/.gemini/antigravity/brain/8e9c8e28-9314-4bb2-8a36-b583a1db7a3f/stitch-prototype.html').replace(/\\/g, '/');
const SCREENSHOT_DIR = path.resolve('C:/Users/D/.gemini/antigravity/brain/8e9c8e28-9314-4bb2-8a36-b583a1db7a3f/screenshots');

async function capture() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Navigating to prototype:', prototypePath);
  await page.goto(prototypePath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Home
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'prototype_01_home.png'), fullPage: true });
  console.log('Saved prototype_01_home.png');

  // 2. Book Detail
  await page.click('#tab-book');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'prototype_02_book.png'), fullPage: true });
  console.log('Saved prototype_02_book.png');

  // 3. Library & Reader
  await page.click('#tab-library');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'prototype_03_library.png'), fullPage: true });
  console.log('Saved prototype_03_library.png');

  // 4. VIP Plans
  await page.click('#tab-vip');
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'prototype_04_vip.png'), fullPage: true });
  console.log('Saved prototype_04_vip.png');

  await browser.close();
  console.log('Done capturing prototype screenshots!');
}

capture().catch(console.error);
