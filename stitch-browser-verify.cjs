const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.resolve('C:/Users/D/.gemini/antigravity/brain/8e9c8e28-9314-4bb2-8a36-b583a1db7a3f/screenshots');

const pagesToTest = [
  { url: 'http://localhost:3000/ar', name: 'stitch_01_home_ar.png', label: 'Storefront Homepage (Arabic)' },
  { url: 'http://localhost:3000/ar/books', name: 'stitch_02_catalog_ar.png', label: 'Publishing Catalog (All Realms)' },
  { url: 'http://localhost:3000/ar/books/alhambra-code-andalusian-manuscript', name: 'stitch_03_book_detail.png', label: 'Deluxe Book Detail & Multi-Format' },
  { url: 'http://localhost:3000/ar/subscriptions', name: 'stitch_04_subscriptions.png', label: 'VIP Pass Plans & Credits' },
  { url: 'http://localhost:3000/ar/library', name: 'stitch_05_digital_library.png', label: 'Protected Cloud Library' },
  { url: 'http://localhost:3000/ar/checkout', name: 'stitch_06_checkout.png', label: 'Hardened Checkout & Summary' },
  { url: 'http://localhost:3000/ar/account', name: 'stitch_07_reader_portal.png', label: 'Reader Portal & Persona Switcher' },
  { url: 'http://localhost:3000/en', name: 'stitch_08_home_en.png', label: 'Storefront Homepage (English)' }
];

async function run() {
  console.log('🚀 Starting Google Stitch E2E Visual Verification...');
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  let errors = [];
  page.on('pageerror', err => {
    console.error('❌ Page Error:', err.message);
    errors.push(err.message);
  });

  for (const item of pagesToTest) {
    try {
      console.log(`📸 Capturing: ${item.label} (${item.url})`);
      const res = await page.goto(item.url, { waitUntil: 'networkidle', timeout: 30000 });
      console.log(`   Status: ${res.status()}`);
      
      // Wait for animations and layout stabilization
      await page.waitForTimeout(1500);

      const filePath = path.join(SCREENSHOT_DIR, item.name);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`   Saved: ${item.name}`);
    } catch (e) {
      console.error(`   Error visiting ${item.url}:`, e.message);
    }
  }

  await browser.close();
  console.log('✅ Google Stitch Visual Verification Completed! Errors:', errors.length);
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
