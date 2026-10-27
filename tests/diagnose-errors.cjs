const { chromium } = require('playwright');
require('../scripts/project-env.cjs');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  
  page.on('response', res => {
    if (res.status() >= 400) {
      console.log(`[HTTP ${res.status()}] ${res.url()}`);
    }
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[Browser Console Error] ${msg.text()}`);
    }
  });

  console.log('Visiting Admin Login...');
  await page.goto('http://localhost:9000/app', { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'admin@enterprise-ecommerce.com');
  await page.fill('input[type="password"]', process.env.TEST_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  console.log('Navigating to Command Center...');
  await page.goto('http://localhost:9000/app/command-center', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  console.log('Navigating to Marketing Dashboard...');
  await page.goto('http://localhost:9000/app/marketing', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  console.log('Navigating to Loyalty Tiers...');
  await page.goto('http://localhost:9000/app/loyalty/tiers', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  console.log('Navigating to Helpdesk Inbox...');
  await page.goto('http://localhost:9000/app/helpdesk/inbox', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  console.log('Navigating to Warehouse Bins...');
  await page.goto('http://localhost:9000/app/warehouse/bins', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  console.log('Navigating to CMS Composer...');
  await page.goto('http://localhost:9000/app/cms/composer', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  console.log('Navigating to Analytics Unit Economics...');
  await page.goto('http://localhost:9000/app/analytics/unit-economics', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  console.log('Diagnostics finished.');
  await browser.close();
})();
