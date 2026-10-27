require("./scripts/project-env.cjs")
const { Client } = require("pg");

const DATABASE_URL = process.env.DATABASE_URL || process.env.DATABASE_URL;

async function run() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  console.log("Connected to PostgreSQL for ALL-IN-ONE Enterprise schema setup...");

  await client.query(`
    -- 1. Marketing & Campaign Automation
    CREATE TABLE IF NOT EXISTS marketing_campaigns (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'whatsapp', 'push')),
      status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'scheduled', 'completed', 'paused')),
      audience_group TEXT NOT NULL,
      sent_count INTEGER NOT NULL DEFAULT 0,
      open_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
      click_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
      conversions_count INTEGER NOT NULL DEFAULT 0,
      revenue_generated NUMERIC(12,2) NOT NULL DEFAULT 0.00,
      currency_code TEXT NOT NULL DEFAULT 'sar',
      scheduled_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS cart_abandonment_automations (
      id TEXT PRIMARY KEY,
      cart_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      cart_value NUMERIC(10,2) NOT NULL,
      currency_code TEXT NOT NULL DEFAULT 'sar',
      recovery_status TEXT NOT NULL CHECK (recovery_status IN ('pending', 'email_sent', 'whatsapp_sent', 'recovered', 'expired')),
      discount_code_offered TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 2. Reviews, Ratings & UGC Social Proof
    CREATE TABLE IF NOT EXISTS product_reviews (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      product_title TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      title TEXT NOT NULL,
      comment TEXT NOT NULL,
      verified_purchase BOOLEAN NOT NULL DEFAULT true,
      status TEXT NOT NULL CHECK (status IN ('approved', 'pending', 'rejected')),
      helpful_votes INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 3. Loyalty, Rewards & VIP Gamification
    CREATE TABLE IF NOT EXISTS loyalty_accounts (
      id TEXT PRIMARY KEY,
      customer_id TEXT NOT NULL UNIQUE,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      tier_level TEXT NOT NULL CHECK (tier_level IN ('bronze', 'silver', 'gold', 'platinum')),
      points_balance INTEGER NOT NULL DEFAULT 0,
      lifetime_points INTEGER NOT NULL DEFAULT 0,
      joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS loyalty_rewards (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      points_cost INTEGER NOT NULL,
      reward_type TEXT NOT NULL CHECK (reward_type IN ('fixed_discount', 'percentage_discount', 'free_shipping', 'free_ebook')),
      reward_value NUMERIC(10,2) NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 4. Affiliate & Influencer Management
    CREATE TABLE IF NOT EXISTS affiliates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      channel_name TEXT NOT NULL,
      coupon_code TEXT NOT NULL UNIQUE,
      commission_rate NUMERIC(5,2) NOT NULL DEFAULT 15.00,
      total_referrals INTEGER NOT NULL DEFAULT 0,
      total_revenue NUMERIC(12,2) NOT NULL DEFAULT 0.00,
      pending_payout NUMERIC(12,2) NOT NULL DEFAULT 0.00,
      paid_payout NUMERIC(12,2) NOT NULL DEFAULT 0.00,
      status TEXT NOT NULL CHECK (status IN ('active', 'pending', 'suspended')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS affiliate_referrals (
      id TEXT PRIMARY KEY,
      affiliate_id TEXT NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
      order_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      order_amount NUMERIC(10,2) NOT NULL,
      commission_amount NUMERIC(10,2) NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'paid')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 5. Customer Support Helpdesk & Live Tickets
    CREATE TABLE IF NOT EXISTS support_tickets (
      id TEXT PRIMARY KEY,
      ticket_number TEXT NOT NULL UNIQUE,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      subject TEXT NOT NULL,
      priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
      status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
      order_id TEXT,
      assigned_agent TEXT NOT NULL DEFAULT 'فريق الدعم الموحد',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS ticket_messages (
      id TEXT PRIMARY KEY,
      ticket_id TEXT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
      sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'agent')),
      sender_name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 6. Warehouse Bins & Multi-Location Inventory Ledger
    CREATE TABLE IF NOT EXISTS warehouse_bins (
      id TEXT PRIMARY KEY,
      location_name TEXT NOT NULL,
      bin_code TEXT NOT NULL UNIQUE,
      rack_number TEXT NOT NULL,
      zone TEXT NOT NULL,
      product_sku TEXT NOT NULL,
      product_title TEXT NOT NULL,
      capacity INTEGER NOT NULL DEFAULT 500,
      current_quantity INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS stock_movements (
      id TEXT PRIMARY KEY,
      movement_type TEXT NOT NULL CHECK (movement_type IN ('purchase_order', 'order_pick', 'inter_transfer', 'inventory_adjustment', 'damaged_write_off')),
      sku TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      from_location TEXT NOT NULL,
      to_location TEXT NOT NULL,
      reference_number TEXT NOT NULL,
      reason TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- 7. Editorial CMS & SEO Blog
    CREATE TABLE IF NOT EXISTS cms_articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      author_name TEXT NOT NULL,
      category TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('published', 'draft', 'scheduled')),
      meta_title TEXT NOT NULL,
      meta_description TEXT NOT NULL,
      view_count INTEGER NOT NULL DEFAULT 0,
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  console.log("All 12 enterprise tables created successfully.");

  // Clear existing to avoid duplicate conflicts upon re-runs
  if (process.env.ALLOW_DESTRUCTIVE_DEMO_RESET !== "true" || process.env.NODE_ENV === "production") {
    console.log("Schema prepared. Demo reset and fabricated business metrics skipped.");
    await client.end(); return;
  }
  await client.query(`
    TRUNCATE TABLE marketing_campaigns, cart_abandonment_automations, product_reviews,
      loyalty_accounts, loyalty_rewards, affiliates, affiliate_referrals,
      support_tickets, ticket_messages, warehouse_bins, stock_movements, cms_articles CASCADE;
  `);

  // Seed Marketing Campaigns
  await client.query(`
    INSERT INTO marketing_campaigns (id, name, type, status, audience_group, sent_count, open_rate, click_rate, conversions_count, revenue_generated, scheduled_at)
    VALUES
      ('camp_01', 'إطلاق رواية أطياف بغداد القديمة - خصم حصري 20% للمشتركين', 'email', 'active', 'VIP Subscribers & High-Spenders', 14200, 42.80, 18.40, 860, 73100.00, NOW() - INTERVAL '3 days'),
      ('camp_02', 'أتمتة السلة المتروكة الذكية (WhatsApp Abandoned Cart Sequence)', 'whatsapp', 'active', 'Visitors with Active Baskets > 1h', 3450, 78.50, 34.20, 412, 18540.00, NOW() - INTERVAL '1 day'),
      ('camp_03', 'النشرة الأسبوعية: الروايات الأكثر طلباً وقوائم أفضل كتب الخريف', 'email', 'scheduled', 'All Newsletter Subscribers (KSA & UAE)', 28900, 0.00, 0.00, 0, 0.00, NOW() + INTERVAL '2 days'),
      ('camp_04', 'عرض نهاية الأسبوع: اشترك بالباقة السنوية واحصل على كتاب مجاني فوري', 'sms', 'completed', 'Dormant Readers (Last active > 60 days)', 9800, 95.00, 21.30, 520, 25480.00, NOW() - INTERVAL '7 days');

    INSERT INTO cart_abandonment_automations (id, cart_id, customer_name, customer_email, customer_phone, cart_value, recovery_status, discount_code_offered)
    VALUES
      ('cart_rec_01', 'cart_01H123', 'عبدالرحمن العتيبي', 'abdulrahman@example.com', '+966501112233', 145.00, 'whatsapp_sent', 'RECOVER10'),
      ('cart_rec_02', 'cart_01H124', 'مريم الكعبي', 'maryam.k@example.com', '+971509988776', 220.00, 'recovered', 'VIPREADER'),
      ('cart_rec_03', 'cart_01H125', 'سلطان القحطاني', 'sultan@example.com', '+966554433221', 85.00, 'email_sent', 'STORYFREE'),
      ('cart_rec_04', 'cart_01H126', 'نور الشمري', 'nour.sh@example.com', '+966567788990', 310.00, 'pending', 'SAVE15');
  `);

  // Seed Product Reviews
  await client.query(`
    INSERT INTO product_reviews (id, product_id, product_title, customer_name, customer_email, rating, title, comment, verified_purchase, status, helpful_votes)
    VALUES
      ('rev_01', 'prod_samsem', 'مغامرة الأرنب الصغير سمسم في الغابة السحرية', 'هند السبيعي', 'hind.subaie@example.com', 5, 'أجمل قصة مصورة لأطفالي قبل النوم', 'ابنتي ذات الـ 4 سنوات تطلب الاستماع إليها كل ليلة بصوت ريم الجودر الساحر. الرسوم مبهجة وجودة الورق فاخرة جداً.', true, 'approved', 42),
      ('rev_02', 'prod_baghdad', 'أطياف بغداد القديمة: ملحمة أسرار الرافدين', 'فيصل المري', 'faisal.marri@example.com', 5, 'تحفة أدبية تاريخية حبست أنفاسي', 'د. غسان الكيلاني أبدع في نسج تفاصيل بيت الحكمة وصراعات العصر العباسي. التسجيل الصوتي مع سامي المهدي سينمائي بامتياز.', true, 'approved', 68),
      ('rev_03', 'prod_alhambra', 'شفرة قصر الحمراء: لغز المخطوطة الأندلسية', 'يوسف الحمدان', 'yousef.h@example.com', 5, 'حبكة غموض مشوقة تناسب اليافعين والكبار', 'قرأتها في جلستين من شدة التشويق! ألغاز الفسيفساء والمخطوطات مكتوبة بأسلوب عبقري.', true, 'approved', 35),
      ('rev_04', 'prod_spaceship', 'سفينة الفضاء السرية وسر كوكب الزمرد', 'نجود الدوسري', 'nojood@example.com', 4, 'خيال علمي عربي ممتع وملهم للأطفال', 'أعجب ابني البالغ من العمر 9 سنوات جداً، وطالب بشراء الجزء الثاني فوراً. التوصيل في الرياض كان سريعاً.', true, 'approved', 19),
      ('rev_05', 'prod_star', 'أين اختفت نجمتي الساطعة؟', 'سمية البلوشي', 'somaya.b@example.com', 5, 'تجربة قراءة دافئة وموسيقى تصويرية مريحة للأعصاب', 'النسخة الصوتية ساعدت طفلي على النوم بسرعة وهدوء. منصة متكاملة وخدمة عملاء راقية.', true, 'approved', 27);
  `);

  // Seed Loyalty Accounts & Rewards
  await client.query(`
    INSERT INTO loyalty_accounts (id, customer_id, customer_name, customer_email, tier_level, points_balance, lifetime_points)
    VALUES
      ('loy_01', 'cus_tariq', 'طارق المنصور', 'tariq@example.com', 'gold', 1450, 4800),
      ('loy_02', 'cus_fatima', 'فاطمة الزهراء', 'fatima@example.com', 'platinum', 3200, 9500),
      ('loy_03', 'cus_omar', 'عمر الهاشمي', 'omar@example.com', 'silver', 750, 2100),
      ('loy_04', 'cus_sarah', 'Sarah Jenkins', 'sarah.j@example.com', 'bronze', 280, 580);

    INSERT INTO loyalty_rewards (id, title, description, points_cost, reward_type, reward_value, is_active)
    VALUES
      ('rew_01', 'قسيمة خصم 25 ر.س نقدية', 'خصم فوري على أي سلة مشتريات ورقية أو رقمية', 250, 'fixed_discount', 25.00, true),
      ('rew_02', 'شحن مجاني سريع داخل المملكة', 'إلغاء رسوم الشحن السريع لطلبك القادم عبر أرامكس وسمسا', 400, 'free_shipping', 35.00, true),
      ('rew_03', 'كتاب إلكتروني مجاني كامل من اختيارك', 'اختر أي عنوان من مكتبتنا الرقمية واحتفظ به للأبد', 500, 'free_ebook', 40.00, true),
      ('rew_04', 'قسيمة النخبة VIP بقيمة 100 ر.س', 'مخصصة لقراء الفئات الذهبية والبلاتينية', 1000, 'fixed_discount', 100.00, true);
  `);

  // Seed Affiliates & Referrals
  await client.query(`
    INSERT INTO affiliates (id, name, email, channel_name, coupon_code, commission_rate, total_referrals, total_revenue, pending_payout, paid_payout, status)
    VALUES
      ('aff_01', 'عبدالله السعدون', 'saadoun@saudibookclub.com', 'نادي القراءة السعودي (@SaudiBookClub)', 'SAUDIBOOKS', 15.00, 342, 48200.00, 4230.00, 18500.00, 'active'),
      ('aff_02', 'د. ليلى الشريف', 'laila@podcast-athir.com', 'بودكاست أوراق وأثير الأدبي', 'ATHIR20', 20.00, 215, 34100.00, 3820.00, 12400.00, 'active'),
      ('aff_03', 'محمد الخالدي', 'khalidi.reads@youtube.com', 'قناة عالم الروايات والغموض', 'KHALIDI10', 12.50, 188, 22400.00, 1400.00, 8900.00, 'active'),
      ('aff_04', 'أروى العلي', 'arwa.kids@mombooks.com', 'مدونة عائلة تقرأ (كتب الأطفال)', 'ARWAKIDS', 15.00, 140, 16800.00, 2520.00, 4200.00, 'active');

    INSERT INTO affiliate_referrals (id, affiliate_id, order_id, customer_name, order_amount, commission_amount, status)
    VALUES
      ('ref_01', 'aff_01', 'ord_01HXYZ123456', 'سعد الدوسري', 345.00, 51.75, 'approved'),
      ('ref_02', 'aff_01', 'ord_01HXYZ789012', 'خالد بن سلطان', 220.00, 33.00, 'pending'),
      ('ref_03', 'aff_02', 'ord_01HXYZ345678', 'مشاعل النعيمي', 410.00, 82.00, 'approved'),
      ('ref_04', 'aff_03', 'ord_01HXYZ901234', 'تركي الفايز', 180.00, 22.50, 'paid');
  `);

  // Seed Support Helpdesk & Messages
  await client.query(`
    INSERT INTO support_tickets (id, ticket_number, customer_name, customer_email, subject, priority, status, order_id, assigned_agent)
    VALUES
      ('tkt_01', 'TKT-1049', 'طارق المنصور', 'tariq@example.com', 'استفسار بخصوص تفعيل رصيد باقة الـ VIP لشهر أكتوبر', 'medium', 'resolved', 'ord_01HXYZ123456', 'أحمد كمال (مدير علاقات القراء)'),
      ('tkt_02', 'TKT-1050', 'فاطمة الزهراء', 'fatima@example.com', 'طلب تعديل عنوان الشحن في دبي بعد إصدار الفاتورة', 'high', 'in_progress', 'ord_01HXYZ789012', 'سارة المحمود (فريق العمليات اللوجستية)'),
      ('tkt_03', 'TKT-1051', 'عمر الهاشمي', 'omar@example.com', 'طلب نسخة موقّعة بختم خاص من الروائي د. غسان الكيلاني', 'low', 'open', 'ord_01HXYZ345678', 'فريق الدعم الموحد'),
      ('tkt_04', 'TKT-1052', 'Sarah Jenkins', 'sarah.j@example.com', 'How to sync audio chapters to offline car player via HLS', 'low', 'resolved', NULL, 'Technical Support Team');

    INSERT INTO ticket_messages (id, ticket_id, sender_type, sender_name, message)
    VALUES
      ('msg_01', 'tkt_01', 'customer', 'طارق المنصور', 'السلام عليكم، قمت بتجديد باقتي السنوية وأود التأكد من نزول الـ 24 رصيد كتاب في حسابي.'),
      ('msg_02', 'tkt_01', 'agent', 'أحمد كمال', 'أهلاً بك أستاذ طارق! تم التحقق من حسابك والأرصدة الـ 24 فعّالة وجاهزة للاستخدام الفوري بمكتبتك الرقمية.'),
      ('msg_03', 'tkt_02', 'customer', 'فاطمة الزهراء', 'مرحباً، أرجو تحويل تسليم طلبيتي القادمة إلى مجمع دبي للعلوم بدلاً من وسط المدينة.'),
      ('msg_04', 'tkt_02', 'agent', 'سارة المحمود', 'تم استلام طلبك وجاري تحديث وثيقة الشحن مع دي إتش إل قبل خروج المندوب.');
  `);

  // Seed Warehouse Bins & Stock Movement Ledger
  await client.query(`
    INSERT INTO warehouse_bins (id, location_name, bin_code, rack_number, zone, product_sku, product_title, capacity, current_quantity)
    VALUES
      ('bin_01', 'مركز الرياض اللوجستي (Riyadh Logistics Center)', 'RUH-A1-04', 'Rack A1', 'منطقة الورقيات السريعة (Zone Fast)', 'SAMSEM-THE-BUNNY-ADVENTURE-PAPERBACK', 'مغامرة الأرنب سمسم (غلاف ورقي)', 300, 120),
      ('bin_02', 'مركز الرياض اللوجستي (Riyadh Logistics Center)', 'RUH-B2-11', 'Rack B2', 'منطقة الروايات الكبرى (Zone Fiction)', 'SPECTRES-OF-ANCIENT-BAGHDAD-PAPERBACK', 'أطياف بغداد القديمة (طبعة فاخرة)', 400, 120),
      ('bin_03', 'مركز الرياض اللوجستي (Riyadh Logistics Center)', 'RUH-A3-08', 'Rack A3', 'منطقة اليافعين والغموض (Zone Teens)', 'ALHAMBRA-CODE-ANDALUSIAN-MANUSCRIPT-PAPERBACK', 'شفرة قصر الحمراء (طبعة خاصة)', 250, 120),
      ('bin_04', 'المستودع الإقليمي في دبي (Dubai Regional Hub)', 'DXB-Z1-02', 'Rack Z1', 'منطقة الشحن الدولي (Zone Export)', 'SAMSEM-THE-BUNNY-ADVENTURE-PAPERBACK', 'مغامرة الأرنب سمسم (غلاف ورقي)', 200, 60),
      ('bin_05', 'المستودع الإقليمي في دبي (Dubai Regional Hub)', 'DXB-Z2-09', 'Rack Z2', 'منطقة الشحن الدولي (Zone Export)', 'SPECTRES-OF-ANCIENT-BAGHDAD-PAPERBACK', 'أطياف بغداد القديمة (طبعة فاخرة)', 250, 60);

    INSERT INTO stock_movements (id, movement_type, sku, quantity, from_location, to_location, reference_number, reason)
    VALUES
      ('mov_01', 'purchase_order', 'SPECTRES-OF-ANCIENT-BAGHDAD-PAPERBACK', 200, 'مطابع دار الحكمة المركزية', 'مركز الرياض اللوجستي', 'PO-2026-9901', 'توريد الطبعة الأولى الرسمية'),
      ('mov_02', 'inter_transfer', 'SPECTRES-OF-ANCIENT-BAGHDAD-PAPERBACK', 60, 'مركز الرياض اللوجستي', 'المستودع الإقليمي في دبي', 'XFER-2026-041', 'تغذية مستودع دبي لتلبية طلبات الإمارات والخليج'),
      ('mov_03', 'order_pick', 'SAMSEM-THE-BUNNY-ADVENTURE-PAPERBACK', -1, 'RUH-A1-04', 'شحن العميل (Order #ord_01HXYZ123456)', 'PICK-8891', 'تجهيز طلب الشحن السريع مع أرامكس'),
      ('mov_04', 'purchase_order', 'SAMSEM-THE-BUNNY-ADVENTURE-PAPERBACK', 150, 'مطابع دار الحكمة المركزية', 'مركز الرياض اللوجستي', 'PO-2026-9902', 'إعادة تزويد المخزون للكتب المصورة');
  `);

  // Seed Editorial CMS & SEO
  await client.query(`
    INSERT INTO cms_articles (id, title, slug, excerpt, content, author_name, category, cover_image, status, meta_title, meta_description, view_count, published_at)
    VALUES
      ('art_01', 'أسرار الكتابة التاريخية: كيف بنينا تفاصيل عالم رواية أطياف بغداد القديمة', 'secrets-of-ancient-baghdad-historical-novel', 'نظرة معمقة وراء كواليس استكشاف بيت الحكمة وأسرار الفلكيين والفلاسفة في العصر الذهبي.', 'في هذا المقال الخاص، يشاركنا الدكتور غسان الكيلاني المصادر والمخطوطات النادرة التي اعتمد عليها لصياغة التفاصيل الدقيقة للأزقة والمراصد والمكتبات العباسية.', 'د. غسان الكيلاني', 'مقالات أدبية وتاريخ', 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1200&q=80', 'published', 'أسرار كتابة رواية أطياف بغداد | المدونة الرسمية', 'استكشف كواليس بناء الرواية التاريخية الأكثر مبيعاً مع د. غسان الكيلاني ومصادر بيت الحكمة النادرة.', 4520, NOW() - INTERVAL '5 days'),
      ('art_02', 'دليل الأهل الشامل: كيف تختار القصة المناسبة لطفلك بين 3 و 12 سنة؟', 'parents-guide-choosing-kids-stories', 'خطوات عملية لتحبيب الأطفال بالقراءة وتنمية خيالهم اللغوي والإبداعي في عصر الشاشات.', 'تقدم الكاتبة منى السعيد نصائح تربوية وعملية لكيفية الجمع بين الكتاب الورقي التفاعلي والحكايات الصوتية قبل النوم لتطوير مهارات النطق والتركيز.', 'منى السعيد', 'دليل القراءة والتربية', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=80', 'published', 'دليل الأهل لاختيار كتب الأطفال | نصائح القراءة السليمة', 'كيف تشجع طفلك على حب القراءة والاستماع للقصص المفيدة؟ نصائح من الكاتبة منى السعيد.', 6840, NOW() - INTERVAL '12 days'),
      ('art_03', 'ثورة الكتب الصوتية في العالم العربي وتقنيات الصوت المكاني (Spatial Audio)', 'audiobooks-revolution-spatial-audio-arabic', 'كيف تغير تكنولوجيا الصوت ثلاثي الأبعاد طريقة معايشة المستمع للرواية الأدبية المعاصرة.', 'يستعرض الفنان الصوتي سامي المهدي كيف تم تسجيل روايات المنصة باستخدام استوديوهات متقدمة وتقنيات المؤثرات المحيطية لتمنح المستمع شعوراً بالحضور داخل أحداث القصة.', 'سامي المهدي', 'تقنيات النشر الرقمي', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80', 'published', 'الكتب الصوتية والصوت المكاني | مستقبل الاستماع الرقمي', 'تعرف على تقنيات تسجيل الكتب الصوتية المتطورة مع الفنان الصوتي سامي المهدي.', 3190, NOW() - INTERVAL '18 days');
  `);

  console.log("Successfully seeded rich production-grade data for all 7 enterprise services!");
  await client.end();
}

run().catch((err) => {
  console.error("Error setting up ALL-IN-ONE schema:", err);
  process.exit(1);
});
