const { Client } = require("pg")

const connectionString = process.env.DATABASE_URL || "postgres://medusa_admin:SuperSecureDbPassword2026!@localhost:5432/medusa_db"

async function seedDatabase() {
  const client = new Client({ connectionString })
  await client.connect()
  console.log("==========================================================================")
  console.log("CONNECTING TO REAL POSTGRESQL (DOCKER) TO INITIALIZE DATABASE SCHEMA & SEED")
  console.log("==========================================================================")

  try {
    // 1. Create Tables
    console.log(">>> 1. Creating Database Tables...")

    await client.query(`
      CREATE TABLE IF NOT EXISTS authors (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        bio TEXT,
        avatar VARCHAR(512),
        royalty_percentage NUMERIC(5, 2) DEFAULT 15.00,
        titles_count INT DEFAULT 0,
        total_sales_sar NUMERIC(12, 2) DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS narrators (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        bio TEXT,
        avatar VARCHAR(512),
        audio_hours NUMERIC(6, 1) DEFAULT 0,
        titles_count INT DEFAULT 0,
        fee_per_book NUMERIC(10, 2) DEFAULT 0,
        sample_voice_url VARCHAR(512),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(64) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        handle VARCHAR(255) UNIQUE NOT NULL,
        collection_title VARCHAR(255),
        category_name VARCHAR(255),
        age_group VARCHAR(32) NOT NULL,
        age_label_ar VARCHAR(64) NOT NULL,
        thumbnail VARCHAR(512),
        description TEXT,
        status VARCHAR(32) DEFAULT 'published',
        inventory_quantity INT DEFAULT 100,
        paperback_price NUMERIC(10, 2) NOT NULL,
        ebook_price NUMERIC(10, 2) NOT NULL,
        audiobook_price NUMERIC(10, 2) NOT NULL,
        author_id VARCHAR(64) REFERENCES authors(id) ON DELETE SET NULL,
        narrator_id VARCHAR(64) REFERENCES narrators(id) ON DELETE SET NULL,
        drm_ebook_key VARCHAR(512),
        sample_audio_url VARCHAR(512),
        sample_audio_duration VARCHAR(32),
        page_count INT DEFAULT 0,
        audio_duration VARCHAR(64),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS audio_chapters (
        id VARCHAR(64) PRIMARY KEY,
        product_id VARCHAR(64) REFERENCES products(id) ON DELETE CASCADE,
        chapter_number INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        duration VARCHAR(32) NOT NULL,
        audio_url VARCHAR(512) NOT NULL,
        is_sample BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(64),
        city VARCHAR(128),
        avatar VARCHAR(512),
        age_group VARCHAR(32) NOT NULL,
        tier VARCHAR(64) DEFAULT 'regular_buyer',
        tier_label_ar VARCHAR(128) DEFAULT 'مشتري نسخ ورقية',
        preferred_format VARCHAR(32) DEFAULT 'hybrid',
        format_label_ar VARCHAR(128) DEFAULT 'هجين',
        engagement_score INT DEFAULT 50,
        total_orders INT DEFAULT 0,
        lifetime_value NUMERIC(10, 2) DEFAULT 0,
        book_credits INT DEFAULT 0,
        churn_risk VARCHAR(32) DEFAULT 'low',
        last_activity TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS customer_reading_stats (
        customer_id VARCHAR(64) PRIMARY KEY REFERENCES customers(id) ON DELETE CASCADE,
        audio_hours NUMERIC(6, 1) DEFAULT 0,
        pages_read INT DEFAULT 0,
        preferred_speed VARCHAR(16) DEFAULT '1.0x',
        currently_reading VARCHAR(255),
        completed_books TEXT[] DEFAULT '{}'
      );

      CREATE TABLE IF NOT EXISTS customer_notes (
        id VARCHAR(64) PRIMARY KEY,
        customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE CASCADE,
        author VARCHAR(128) NOT NULL,
        content TEXT NOT NULL,
        created_at VARCHAR(64) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(64) PRIMARY KEY,
        display_id VARCHAR(32) NOT NULL,
        customer_id VARCHAR(64) REFERENCES customers(id) ON DELETE SET NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        city VARCHAR(128),
        fulfillment_status VARCHAR(64) DEFAULT 'fulfilled',
        fulfillment_label_ar VARCHAR(128) DEFAULT 'تم التوصيل بنجاح',
        payment_status VARCHAR(64) DEFAULT 'captured',
        carrier VARCHAR(128) DEFAULT 'Aramex',
        tracking_number VARCHAR(128),
        total_sar NUMERIC(10, 2) NOT NULL,
        order_date VARCHAR(64) NOT NULL,
        items JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS subscription_tiers (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        interval VARCHAR(32) NOT NULL,
        active_subscribers INT DEFAULT 0,
        monthly_revenue NUMERIC(12, 2) DEFAULT 0,
        churn_rate VARCHAR(16) DEFAULT '2.0%',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    console.log(">>> 2. Clearing old tables to ensure fresh authoritative data...")
    await client.query(`
      TRUNCATE TABLE customer_notes, customer_reading_stats, orders, audio_chapters, products, authors, narrators, customers, subscription_tiers CASCADE;
    `)

    // 2. Insert Authors
    console.log(">>> 3. Inserting Authors into PostgreSQL...")
    await client.query(`
      INSERT INTO authors (id, name, bio, avatar, royalty_percentage, titles_count, total_sales_sar) VALUES
      ('auth_01', 'د. غسان الكيلاني', 'مؤرخ وروائي في التراث الحضاري والغموض، حاصل على جوائز عربية في الرواية الفلسفية والتاريخية.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', 18.00, 2, 142000.00),
      ('auth_02', 'منى السعيد', 'كاتبة متخصصة في أدب الطفل والقصص المصورة التربوية وتعزيز الخيال الإيجابي.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80', 15.00, 2, 78500.00),
      ('auth_03', 'عمر اليافعي', 'روائي متخصص في الخيال العلمي والمغامرات الشيقة للناشئة وبناء عوالم الفضاء.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', 16.00, 2, 94200.00);
    `)

    // 3. Insert Narrators
    console.log(">>> 4. Inserting Voice Narrators into PostgreSQL...")
    await client.query(`
      INSERT INTO narrators (id, name, bio, avatar, audio_hours, titles_count, fee_per_book, sample_voice_url) VALUES
      ('narr_01', 'سامي المهدي', 'معلق صوتي إذاعي محترف ذو نبرة درامية عميقة قدم عشرات الروايات الصوتية والوثائقيات العالمية.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', 25.4, 4, 3500.00, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'),
      ('narr_02', 'ريم الجودر', 'فنانة صوتية ومسرحية رائدة متخصصة في حكايات الأطفال والتسجيلات الهادئة لما قبل النوم.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80', 12.2, 2, 2200.00, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
    `)

    // 4. Insert Products
    console.log(">>> 5. Inserting Multi-Format Novels into PostgreSQL...")
    await client.query(`
      INSERT INTO products (
        id, title, handle, collection_title, category_name, age_group, age_label_ar,
        thumbnail, description, status, inventory_quantity, paperback_price, ebook_price, audiobook_price,
        author_id, narrator_id, drm_ebook_key, sample_audio_url, sample_audio_duration, page_count, audio_duration
      ) VALUES
      ('prod_alhambra_05', 'شفرة قصر الحمراء: لغز المخطوطة الأندلسية', 'alhambra-code-andalusian-manuscript', 'روايات وألغاز اليافعين', 'اليافعون والشباب (13 - 17 سنة)', 'teens_13_17', 'اليافعون (13 - 17 سنة)', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80', 'رواية غموض وتاريخ تحبس الأنفاس بين غرناطة وقرطبة تكشف عن أكبر مكتبة علمية أندلسية فُقدت في القرن الخامس عشر.', 'published', 340, 75.00, 35.00, 45.00, 'auth_01', 'narr_01', 'drm/ebooks/alhambra-code-v2-signed.epub', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', '03:10', 312, '7 ساعات و 20 دقيقة'),
      ('prod_baghdad_06', 'أطياف بغداد القديمة: ملحمة أسرار الرافدين', 'spectres-of-ancient-baghdad', 'ملاحم الأدب الكلاسيكي والتاريخي', 'الأدب الكلاسيكي والتاريخي (18+ سنة)', 'adults_18_plus', 'البالغون (18+ سنة)', 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&q=80', 'ملحمة روائية عميقة تسبر أغوار العصر الذهبي لبيت الحكمة في بغداد وصراع الوراقين لحفظ المعرفة الإنسانية.', 'published', 185, 85.00, 40.00, 50.00, 'auth_01', 'narr_01', 'drm/ebooks/baghdad-ancient-master.epub', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', '03:45', 448, '11 ساعة و 40 دقيقة'),
      ('prod_samsem_01', 'مغامرة الأرنب الصغير سمسم في الغابة السحرية', 'samsem-the-bunny-adventure', 'حكايات النوم وبراعم الأطفال', 'براعم الأطفال (3 - 6 سنوات)', 'kids_3_6', 'براعم الأطفال (3 - 6 سنوات)', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80', 'قصة دافئة ورائعة تأخذ الأطفال الصغار في رحلة مليئة بالألوان مع الأرنب سمسم وتعلمهم قيم الصدق والمشاركة.', 'published', 520, 45.00, 20.00, 25.00, 'auth_02', 'narr_02', 'drm/ebooks/samsem-bunny-illustrated.pdf', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', '02:15', 32, '24 دقيقة'),
      ('prod_star_02', 'أين اختفت نجمتي الساطعة؟', 'where-did-my-shiny-star-go', 'حكايات النوم وبراعم الأطفال', 'براعم الأطفال (3 - 6 سنوات)', 'kids_3_6', 'براعم الأطفال (3 - 6 سنوات)', 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=400&q=80', 'قصة ما قبل النوم الساحرة والمهدئة لمساعدة الأطفال على الاسترخاء والنوم بعيداً عن الشاشات.', 'published', 410, 38.00, 15.00, 20.00, 'auth_02', 'narr_02', 'drm/ebooks/shiny-star-bedtime.pdf', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', '01:45', 28, '18 دقيقة'),
      ('prod_spaceship_03', 'سفينة الفضاء السرية وسر كوكب الزمرد', 'secret-spaceship-emerald-planet', 'مغامرات الفضاء والاستكشاف للناشئة', 'الناشئة والمستكشفون (7 - 12 سنة)', 'kids_7_12', 'الناشئة (7 - 12 سنة)', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80', 'مغامرة خيال علمي شيقة للناشئة تبدأ باكتشاف مركبة استكشاف مجهولة في قبو مرصد فلكي قديم.', 'published', 280, 55.00, 25.00, 30.00, 'auth_03', 'narr_01', 'drm/ebooks/spaceship-emerald-sci.epub', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', '02:40', 144, '3 ساعات و 15 دقيقة'),
      ('prod_seas_04', 'كنز البحار السبعة والبوصلة المفقودة', 'treasure-of-the-seven-seas', 'مغامرات الفضاء والاستكشاف للناشئة', 'الناشئة والمستكشفون (7 - 12 سنة)', 'kids_7_12', 'الناشئة (7 - 12 سنة)', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80', 'رحلة بحرية تاريخية آسرة تسير وراء أسطورة البوصلة العثمانية المطعمة بالياقوت والممر المائي السري.', 'published', 310, 60.00, 28.00, 35.00, 'auth_03', 'narr_01', 'drm/ebooks/seas-compass-treasure.epub', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', '02:10', 160, '3 ساعات و 45 دقيقة');
    `)

    // 5. Insert Customers
    console.log(">>> 6. Inserting Reader Personas into PostgreSQL...")
    await client.query(`
      INSERT INTO customers (
        id, name, email, phone, city, avatar, age_group, tier, tier_label_ar,
        preferred_format, format_label_ar, engagement_score, total_orders, lifetime_value,
        book_credits, churn_risk, last_activity
      ) VALUES
      ('cust_tariq_01', 'طارق المنصور', 'tariq.almansoor@example.com', '+966 50 123 4567', 'الرياض (Riyadh)', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80', 'adults_18_plus', 'vip_monthly', 'مشترك VIP شهري', 'hybrid', 'هجين (صوتي + إلكتروني)', 94, 14, 1850.00, 2, 'low', 'اليوم، 08:30 ص (استماع لرواية شفرة قصر الحمراء)'),
      ('cust_sarah_02', 'سارة العتيبي (أم راكان)', 'sarah.otaibi@example.com', '+966 54 987 6543', 'جدة (Jeddah)', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', 'kids_3_6', 'kids_pass', 'باقة براعم الأطفال', 'audiobook', 'قصص صوتية مهدئة للأطفال', 89, 8, 740.00, 0, 'low', 'أمس، 08:15 م (تشغيل قصة الأرنب سمسم)'),
      ('cust_fahad_03', 'فهد الدوسري', 'fahad.dossary@example.com', '+966 55 456 7890', 'الدمام (Dammam)', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', 'kids_7_12', 'regular_buyer', 'مشتري نسخ ورقية فاخرة', 'paperback', 'ورقي مطبوع فاخر', 68, 6, 920.00, 0, 'medium', 'قبل 6 أيام (استلام شحنة أرامكس)'),
      ('cust_yasmeen_04', 'ياسمين النجار', 'yasmeen.najjar@example.com', '+966 56 321 9988', 'الخبر (Khobar)', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80', 'teens_13_17', 'vip_annual', 'مشترك VIP سنوي', 'hybrid', 'هجين (ألغاز تاريخية)', 97, 19, 2450.00, 4, 'low', 'اليوم، 10:15 ص (إنهاء الفصل الثالث من رواية شفرة قصر الحمراء)');
    `)

    // 6. Insert Customer Notes & Stats
    console.log(">>> 7. Inserting CRM Notes & Reading Stats into PostgreSQL...")
    await client.query(`
      INSERT INTO customer_reading_stats (customer_id, audio_hours, pages_read, preferred_speed, currently_reading, completed_books) VALUES
      ('cust_tariq_01', 52.4, 1420, '1.5x', 'أطياف بغداد القديمة: ملحمة أسرار الرافدين', ARRAY['شفرة قصر الحمراء: لغز المخطوطة الأندلسية', 'كنز البحار السبعة والبوصلة المفقودة']),
      ('cust_sarah_02', 34.2, 410, '1.0x', 'أين اختفت نجمتي الساطعة؟', ARRAY['مغامرة الأرنب الصغير سمسم في الغابة السحرية']),
      ('cust_fahad_03', 4.0, 620, '1.0x', 'كنز البحار السبعة والبوصلة المفقودة', ARRAY['سفينة الفضاء السرية وسر كوكب الزمرد']),
      ('cust_yasmeen_04', 64.0, 1980, '1.25x', 'أطياف بغداد القديمة', ARRAY['شفرة قصر الحمراء: لغز المخطوطة الأندلسية']);

      INSERT INTO customer_notes (id, customer_id, author, content, created_at) VALUES
      ('note_1', 'cust_tariq_01', 'سارة (دعم العملاء)', 'يفضل دائماً الاستماع بسرعة 1.5x أثناء القيادة صباحاً، وطلب إشعاره فور توفر روايات د. غسان الكيلاني الجديدة.', '2026-10-22'),
      ('note_2', 'cust_tariq_01', 'فهد (إدارة VIP)', 'تم إهداؤه رصيد كتاب مجاني تقديراً لإكماله 50 ساعة استماع متواصلة عبر المنصة.', '2026-10-15'),
      ('note_3', 'cust_sarah_02', 'نورة (دعم VIP)', 'اتصال متابعة: أبدت إعجابها بنبرة صوت الراوية ريم الجودر لمساعدة أطفالها على النوم بهدوء بدون شاشات.', '2026-10-20'),
      ('note_4', 'cust_fahad_03', 'خالد (اللوجستيات)', 'استفسر عن إمكانية الحصول على نسخة ورقية موقعة بخط اليد من الكاتب عمر اليافعي.', '2026-10-18');
    `)

    // 7. Insert Orders
    console.log(">>> 8. Inserting Real Orders into PostgreSQL...")
    await client.query(`
      INSERT INTO orders (
        id, display_id, customer_id, customer_name, customer_email, city,
        fulfillment_status, fulfillment_label_ar, payment_status, carrier,
        tracking_number, total_sar, order_date, items
      ) VALUES
      ('order_01HQ8976AB', '#10024', 'cust_tariq_01', 'طارق المنصور', 'tariq.almansoor@example.com', 'الرياض', 'fulfilled', 'تم التوصيل بنجاح', 'captured', 'أرامكس إكسبريس (Aramex)', 'ARX-9823412SA', 115.00, '2026-10-24 14:32', '[{"title": "شفرة قصر الحمراء: لغز المخطوطة الأندلسية (غلاف ورقي)", "quantity": 1, "price": 75}, {"title": "النسخة الصوتية الكاملة (خصم باقة VIP)", "quantity": 1, "price": 25}]'::jsonb),
      ('order_01HQ3421XY', '#10023', 'cust_sarah_02', 'سارة العتيبي', 'sarah.otaibi@example.com', 'جدة', 'fulfilled', 'تم التوصيل بنجاح', 'captured', 'سمسا إكسبريس (SMSA)', 'SMSA-551092SA', 45.00, '2026-10-23 09:15', '[{"title": "مغامرة الأرنب الصغير سمسم في الغابة السحرية", "quantity": 1, "price": 45}]'::jsonb),
      ('order_01HQ9988CD', '#10022', 'cust_yasmeen_04', 'ياسمين النجار', 'yasmeen.najjar@example.com', 'الخبر', 'shipped', 'قيد التوصيل مع المندوب', 'captured', 'أرامكس إكسبريس (Aramex)', 'ARX-5544112SA', 135.00, '2026-10-22 18:40', '[{"title": "أطياف بغداد القديمة (نسخة ورقية)", "quantity": 1, "price": 85}, {"title": "خدمة توقيع الرواية بخط المؤلف", "quantity": 1, "price": 50}]'::jsonb),
      ('order_01HQ7711EF', '#10021', 'cust_fahad_03', 'فهد الدوسري', 'fahad.dossary@example.com', 'الدمام', 'fulfilled', 'تم التوصيل بنجاح', 'captured', 'سمسا إكسبريس (SMSA)', 'SMSA-773322SA', 115.00, '2026-10-21 11:05', '[{"title": "سفينة الفضاء السرية (ورقي)", "quantity": 1, "price": 55}, {"title": "كنز البحار السبعة (ورقي)", "quantity": 1, "price": 60}]'::jsonb);
    `)

    // 8. Insert Subscription Tiers
    console.log(">>> 9. Inserting Subscription Tiers into PostgreSQL...")
    await client.query(`
      INSERT INTO subscription_tiers (id, name, price, interval, active_subscribers, monthly_revenue, churn_rate) VALUES
      ('sub_kids', 'باقة براعم الأطفال (Kids Story Pass)', 29.00, 'شهري', 420, 12180.00, '2.1%'),
      ('sub_monthly_vip', 'باقة VIP القارئ والمستمع (شهري)', 49.00, 'شهري', 815, 39935.00, '3.4%'),
      ('sub_annual_vip', 'الاشتراك السنوي الشامل (VIP Annual Pass)', 490.00, 'سنوي', 110, 53900.00, '1.2%');
    `)

    // Verify Counts
    const pCount = await client.query("SELECT COUNT(*) FROM products;")
    const cCount = await client.query("SELECT COUNT(*) FROM customers;")
    const oCount = await client.query("SELECT COUNT(*) FROM orders;")
    const aCount = await client.query("SELECT COUNT(*) FROM authors;")

    console.log("==========================================================================")
    console.log("DATABASE SEEDING COMPLETED SUCCESSFULLY!")
    console.log(`- Products in Database: ${pCount.rows[0].count}`)
    console.log(`- Customers in Database: ${cCount.rows[0].count}`)
    console.log(`- Orders in Database: ${oCount.rows[0].count}`)
    console.log(`- Authors in Database: ${aCount.rows[0].count}`)
    console.log("==========================================================================")

    await client.end()
  } catch (err) {
    console.error(">>> SEEDING ERROR:", err)
    await client.end()
    process.exit(1)
  }
}

seedDatabase()
