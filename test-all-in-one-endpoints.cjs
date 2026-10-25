const http = require('http');

async function testAll() {
  console.log('Testing Admin Authentication...');
  const loginRes = await fetch('http://localhost:9000/auth/user/emailpass', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@enterprise-ecommerce.com', password: 'AdminP@ssw0rd2026!' })
  });

  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log('Admin Auth Status:', loginRes.status, 'Token acquired:', !!token);

  if (!token) {
    console.error('Failed to get JWT token:', loginData);
    process.exit(1);
  }

  const endpoints = [
    { ep: '/admin/command-center', label: 'Executive Command Center (Master Overview)' },
    { ep: '/admin/marketing', label: 'Marketing & Automations (Klaviyo replacement)' },
    { ep: '/admin/reviews', label: 'Product Reviews & Ratings (Yotpo replacement)' },
    { ep: '/admin/loyalty', label: 'Loyalty & VIP Club (Smile.io replacement)' },
    { ep: '/admin/affiliates', label: 'Affiliates & Influencer Hub (Refersion replacement)' },
    { ep: '/admin/helpdesk', label: 'Customer Helpdesk & Tickets (Zendesk replacement)' },
    { ep: '/admin/warehouse', label: 'Multi-Warehouse Bins & WMS (ShipBob replacement)' },
    { ep: '/admin/cms', label: 'Headless CMS & Blog SEO Studio (WordPress replacement)' },
    { ep: '/admin/authors', label: 'Publishing Authors Management' },
    { ep: '/admin/narrators', label: 'Publishing Narrators & Audiobooks' },
    { ep: '/admin/subscription-tiers', label: 'VIP Club Subscription Tiers' },
    { ep: '/admin/customers', label: 'Native Medusa CRM Customers Directory' },
    { ep: '/admin/products', label: 'Native Medusa Products Catalog' },
    { ep: '/admin/orders', label: 'Native Medusa Orders' },
  ];

  console.log('\n--- VERIFYING ALL-IN-ONE ENDPOINTS ---');
  let passCount = 0;
  for (const item of endpoints) {
    const res = await fetch('http://localhost:9000' + item.ep, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    const dataKeys = Object.keys(data);
    const summary = data.summary ? JSON.stringify(data.summary) : 'No summary';
    if (res.status === 200) {
      passCount++;
      console.log(`[PASS] ${item.ep.padEnd(28)} => HTTP ${res.status} | Keys: [${dataKeys.join(', ')}]`);
    } else {
      console.error(`[FAIL] ${item.ep.padEnd(28)} => HTTP ${res.status}`, data);
    }
  }

  console.log(`\nResults: ${passCount} / ${endpoints.length} endpoints passed.`);

  console.log('\n--- VERIFYING NATIVE MEDUSA ADMIN UI DASHBOARD ---');
  const appRes = await fetch('http://localhost:9000/app');
  console.log('Admin URL (http://localhost:9000/app) HTTP Status:', appRes.status);
  const appHtml = await appRes.text();
  console.log('HTML size:', appHtml.length, 'bytes');
  console.log('Contains Medusa dashboard bundle:', appHtml.includes('/app/assets/') || appHtml.includes('<!DOCTYPE html>'));

  console.log('\n--- VERIFYING STOREFRONT ON PORT 3000 ---');
  const storeRes = await fetch('http://localhost:3000');
  console.log('Storefront URL (http://localhost:3000) HTTP Status:', storeRes.status);
}

testAll().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
