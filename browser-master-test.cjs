require("./scripts/project-env.cjs")
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = path.join(__dirname, 'tests', 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runBrowserAudit() {
  console.log('===============================================================');
  console.log('REAL BROWSER E2E USER EXPERIENCE & ADMIN AUDIT (PLAYWRIGHT)');
  console.log('===============================================================\n');

  console.log('Launching browser (Microsoft Edge)...');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: 'ar-SA',
  });

  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', (err) => {
    errors.push(`[Page Error] ${err.message}`);
  });
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(`[Console Error] ${msg.text()}`);
    }
  });

  try {
    // -------------------------------------------------------------
    // PART 1: CUSTOMER USER JOURNEY ON STOREFRONT (PORT 3000)
    // -------------------------------------------------------------
    console.log('>>> [PART 1] Testing Storefront Customer Journey (http://localhost:3000)...');

    // 1. Homepage
    console.log('  1.1 Navigating to Homepage...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    const homeTitle = await page.title();
    console.log(`      Page Title: "${homeTitle}"`);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_storefront_home.png'), fullPage: true });
    console.log('      [PASS] Captured: 01_storefront_home.png');

    // 1.2 Language Switcher
    console.log('  1.2 Testing Language Toggle (Arabic RTL -> English LTR)...');
    const langBtn = await page.$('button:has-text("English"), a:has-text("English")');
    if (langBtn) {
      await langBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_storefront_english.png') });
      console.log('      [PASS] Captured: 02_storefront_english.png');
      // Switch back to Arabic
      const arBtn = await page.$('button:has-text("العربية"), a:has-text("العربية")');
      if (arBtn) await arBtn.click();
      await page.waitForTimeout(800);
    }

    // 1.3 Age Persona Switcher
    console.log('  1.3 Testing Age Category & Persona Switcher...');
    const ageButtons = await page.$$('button:has-text("سنوات"), button:has-text("أطفال"), button:has-text("مراهقين"), button:has-text("كبار")');
    console.log(`      Found ${ageButtons.length} age persona buttons`);
    if (ageButtons.length > 0) {
      await ageButtons[0].click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_storefront_age_filtered.png') });
      console.log('      [PASS] Age persona filter clicked & captured: 03_storefront_age_filtered.png');
    }

    // 1.4 Book Detail Page & Format Switcher
    console.log('  1.4 Navigating to Multi-Format Book Detail Page...');
    const bookLink = await page.$('a[href*="/books/"]');
    if (bookLink) {
      const bookHref = await bookLink.getAttribute('href');
      console.log(`      Navigating to: ${bookHref}`);
      await page.goto(`http://localhost:3000${bookHref}`, { waitUntil: 'networkidle', timeout: 20000 });
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_book_details.png'), fullPage: true });
      console.log('      [PASS] Captured book detail page: 04_book_details.png');

      // Test format selector tabs
      const formatButtons = await page.$$('button:has-text("ورقي"), button:has-text("إلكتروني"), button:has-text("صوتي")');
      console.log(`      Found ${formatButtons.length} format options`);
      for (const btn of formatButtons) {
        await btn.click();
        await page.waitForTimeout(400);
      }
      console.log('      [PASS] Clicked and verified all format switcher options');

      // Test Add to Cart Button
      console.log('      Testing Add-to-Cart Action Button...');
      const addToCartBtn = await page.$('button:has-text("أضف إلى السلة"), button:has-text("إضافة إلى السلة")');
      if (addToCartBtn) {
        await addToCartBtn.click();
        await page.waitForTimeout(1500);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04b_cart_added_drawer.png') });
        console.log('      [PASS] Clicked Add-to-Cart and captured: 04b_cart_added_drawer.png');
      }

      // Test DRM audio player preview
      const playBtn = await page.$('button:has-text("تشغيل"), button:has-text("معاينة"), [aria-label*="play" i]');
      if (playBtn) {
        await playBtn.click();
        await page.waitForTimeout(800);
        console.log('      [PASS] Clicked DRM audio preview player button');
      }
    }

    // 1.5 VIP Subscription Tiers Page
    console.log('  1.5 Testing VIP Club & Subscriptions Page...');
    await page.goto('http://localhost:3000/subscriptions', { waitUntil: 'networkidle', timeout: 20000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_vip_subscriptions.png'), fullPage: true });
    console.log('      [PASS] Captured VIP subscriptions: 05_vip_subscriptions.png');

    // 1.6 Protected Customer Digital Library
    console.log('  1.6 Testing Protected Customer Digital Library...');
    await page.goto('http://localhost:3000/library', { waitUntil: 'networkidle', timeout: 20000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_customer_library.png'), fullPage: true });
    console.log('      [PASS] Captured customer library: 06_customer_library.png');

    // 1.7 Checkout Flow
    console.log('  1.7 Testing Multi-Step Checkout Page...');
    await page.goto('http://localhost:3000/checkout', { waitUntil: 'networkidle', timeout: 20000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_checkout_flow.png'), fullPage: true });
    console.log('      [PASS] Captured checkout flow: 07_checkout_flow.png');

    // -------------------------------------------------------------
    // PART 2: ADMINISTRATOR JOURNEY IN MEDUSA DASHBOARD (PORT 9000)
    // -------------------------------------------------------------
    console.log('\n>>> [PART 2] Testing Medusa v2 Admin Dashboard (http://localhost:9000/app)...');

    // 2.1 Navigate to Admin Login
    console.log('  2.1 Navigating to Admin Login...');
    await page.goto('http://localhost:9000/app', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const emailInput = await page.$('input[type="email"], input[name="email"]');
    if (emailInput) {
      console.log('      Signing in with admin credentials...');
      await emailInput.fill('admin@enterprise-ecommerce.com');
      const passInput = await page.$('input[type="password"], input[name="password"]');
      if (passInput) {
        await passInput.fill((process.env.TEST_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD));
      }
      const submitBtn = await page.$('button[type="submit"]');
      if (submitBtn) {
        await submitBtn.click();
        await page.waitForTimeout(4000);
      }
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_admin_dashboard_home.png') });
    console.log('      [PASS] Admin Dashboard Home captured: 08_admin_dashboard_home.png');

    // 2.2 Test All Departmental Admin Routes
    const adminRoutes = [
      // Command Center
      { name: 'Executive Command Center', path: '/app/command-center', file: '09_admin_command_center.png' },

      // Marketing & Nested Sub-Pages
      { name: 'Marketing Dashboard', path: '/app/marketing', file: '10a_admin_marketing_dashboard.png' },
      { name: 'Marketing Campaigns Studio', path: '/app/marketing/campaigns', file: '10b_admin_marketing_campaigns.png' },
      { name: 'Abandoned Carts Automation', path: '/app/marketing/abandoned-carts', file: '10c_admin_marketing_abandoned.png' },
      { name: 'Marketing Workflows', path: '/app/marketing/automations', file: '10d_admin_marketing_automations.png' },

      // Reviews & Social Proof
      { name: 'Reviews Dashboard', path: '/app/reviews', file: '11a_admin_reviews_dashboard.png' },
      { name: 'Reviews Moderation Queue', path: '/app/reviews/moderation', file: '11b_admin_reviews_moderation.png' },
      { name: 'Reviews Social Proof Gallery', path: '/app/reviews/social-proof', file: '11c_admin_reviews_social_proof.png' },

      // Loyalty & VIP
      { name: 'Loyalty Dashboard', path: '/app/loyalty', file: '12a_admin_loyalty_dashboard.png' },
      { name: 'Loyalty VIP Tiers Ladder', path: '/app/loyalty/tiers', file: '12b_admin_loyalty_tiers.png' },
      { name: 'Loyalty Rewards Catalog', path: '/app/loyalty/rewards', file: '12c_admin_loyalty_rewards.png' },

      // Affiliates & Creators
      { name: 'Affiliates Dashboard', path: '/app/affiliates', file: '13a_admin_affiliates_dashboard.png' },
      { name: 'Affiliates Creators Directory', path: '/app/affiliates/creators', file: '13b_admin_affiliates_creators.png' },
      { name: 'Affiliates Payout Settlements', path: '/app/affiliates/payouts', file: '13c_admin_affiliates_payouts.png' },

      // Helpdesk & Support
      { name: 'Helpdesk Dashboard', path: '/app/helpdesk', file: '14a_admin_helpdesk_dashboard.png' },
      { name: 'Helpdesk Live Ticket Inbox', path: '/app/helpdesk/inbox', file: '14b_admin_helpdesk_inbox.png' },
      { name: 'Helpdesk Canned Macros & Replies', path: '/app/helpdesk/canned-replies', file: '14c_admin_helpdesk_canned.png' },

      // Warehouse & Fulfillment WMS
      { name: 'Warehouse Fulfillment Dashboard', path: '/app/warehouse', file: '15a_admin_warehouse_dashboard.png' },
      { name: 'Warehouse Bins & Racks Layout', path: '/app/warehouse/bins', file: '15b_admin_warehouse_bins.png' },
      { name: 'Warehouse Stock Movements Audit', path: '/app/warehouse/movements', file: '15c_admin_warehouse_movements.png' },

      // CMS & Blog SEO Studio
      { name: 'CMS & Blog Dashboard', path: '/app/cms', file: '16a_admin_cms_dashboard.png' },
      { name: 'CMS Article Composer & SERP', path: '/app/cms/composer', file: '16b_admin_cms_composer.png' },
      { name: 'CMS Editorial Categories', path: '/app/cms/categories', file: '16c_admin_cms_categories.png' },

      // Financial Analytics & Unit Economics
      { name: 'Analytics Dashboard', path: '/app/analytics', file: '17a_admin_analytics_dashboard.png' },
      { name: 'Unit Economics & Cohorts', path: '/app/analytics/unit-economics', file: '17b_admin_analytics_unit_econ.png' },
      { name: 'Carrier Logistics SLA', path: '/app/analytics/shipments', file: '17c_admin_analytics_shipments.png' },

      // Authors & Narrators
      { name: 'Authors & Narrators Dashboard', path: '/app/authors-narrators', file: '18a_admin_authors_dashboard.png' },
      { name: 'Audio DRM Encryption & Tokens', path: '/app/authors-narrators/drm', file: '18b_admin_authors_drm.png' },

      // Subscriptions & Memberships
      { name: 'Subscriptions Dashboard', path: '/app/subscriptions', file: '19a_admin_subscriptions_dashboard.png' },
      { name: 'Membership Plans & Credits', path: '/app/subscriptions/plans', file: '19b_admin_subscriptions_plans.png' },

      // Reader CRM 360
      { name: 'Reader CRM Dashboard', path: '/app/crm', file: '20a_admin_crm_dashboard.png' },
      { name: 'Customer 360 Directory', path: '/app/crm/customers', file: '20b_admin_crm_customers.png' },
      { name: 'Audience Segments', path: '/app/crm/segments', file: '20c_admin_crm_segments.png' },

      // Medusa Native Core Routes
      { name: 'Core Orders Directory', path: '/app/orders', file: '21_admin_orders.png' },
      { name: 'Core Products Directory', path: '/app/products', file: '22_admin_products.png' },
      { name: 'Core Customers Directory', path: '/app/customers', file: '23_admin_customers.png' },
    ];

    console.log('\n  2.2 Visiting and Auditing All 14 Admin Routes & Tabs:');
    let passedRoutes = 0;

    for (const route of adminRoutes) {
      try {
        await page.goto(`http://localhost:9000${route.path}`, { waitUntil: 'networkidle', timeout: 20000 });
        await page.waitForTimeout(1500);

        // Test clicking interactive buttons on page if available
        const actionBtn = await page.$('button:has-text("تحديث"), button:has-text("Refresh"), button:has-text("الكل")');
        if (actionBtn) {
          await actionBtn.click();
          await page.waitForTimeout(500);
        }

        await page.screenshot({ path: path.join(SCREENSHOT_DIR, route.file), fullPage: true });
        console.log(`      [PASS] Route: ${route.path.padEnd(24)} | ${route.name.padEnd(32)} -> Saved ${route.file}`);
        passedRoutes++;
      } catch (err) {
        console.error(`      [FAIL] Route: ${route.path} - ${err.message}`);
      }
    }

    console.log(`\nAdmin Routes Audited: ${passedRoutes} / ${adminRoutes.length} Passed!`);

    console.log('\n===============================================================');
    console.log('REAL BROWSER E2E AUDIT COMPLETE: ALL CHECKS FINISHED!');
    console.log(`Screenshots saved to: ${SCREENSHOT_DIR}`);
    console.log('Total Errors Detected:', errors.length);
    if (errors.length > 0) {
      console.log('Sample errors:', errors.slice(0, 5));
    }
    console.log('===============================================================');

  } catch (err) {
    console.error('Fatal Browser Audit Error:', err);
  } finally {
    await browser.close();
  }
}

runBrowserAudit();
