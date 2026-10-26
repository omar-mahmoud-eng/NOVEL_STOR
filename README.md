# 📚 منصة النشر الأدبي والتجارة الإلكترونية المتكاملة | Enterprise Multi-Format Publishing & Headless E-Commerce Platform

[![Medusa.js v2](https://img.shields.io/badge/Medusa.js-v2.5.1-blue.svg)](https://medusajs.com/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.0_App_Router-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16_ACID-336791.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7_BullMQ-DC382D.svg)](https://redis.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

> **المنصة الشاملة للنشر الرقمي والورقي والتجارة الإلكترونية الذكية**، مبنية بمعمارية **Headless** متقدمة وغير قابلة للتلاعب أو الاحتيال (Zero-Vulnerability Architecture). تجمع بين واجهة متجر عصرية موجهة لجميع الفئات العمرية بنظام Next.js 15 App Router، وخادم مركزي قائم على Medusa.js v2 مزود بلوحة تحكم تنفيذية فائقة القدرات، ونظام متطور لإدارة علاقات القراء (**Reader CRM 360°**)، والقياس عن بُعد لجلسات الاستماع، وبرامج الولاء، وأتمتة التسويق، واللوجستيات متعددة المستودعات.

---

## 📑 جدول المحتويات (Table of Contents)

1. [المعمارية التقنية الشاملة (System Architecture)](#1-المعمارية-التقنية-الشاملة-system-architecture)
2. [نظام إدارة علاقات القراء الاستثنائي (Reader CRM 360°)](#2-نظام-إدارة-علاقات-القراء-الاستثنائي-reader-crm-360)
3. [دليل الإضافات والوحدات المخصصة (Enterprise Custom Modules)](#3-دليل-الإضافات-والوحدات-المخصصة-enterprise-custom-modules)
4. [معمارية المنتجات وتعدد الصيغ والفئات العمرية (Multi-Format & Age-Group Architecture)](#4-معمارية-المنتجات-وتعدد-الصيغ-والفئات-العمرية)
5. [الأمان والحماية من الاحتيال (Zero-Vulnerability & Anti-Fraud Security)](#5-الأمان-والحماية-من-الاحتيال-zero-vulnerability--anti-fraud-security)
6. [هيكل قاعدة البيانات والجداول المخصصة (Database Schema)](#6-هيكل-قاعدة-البيانات-والجداول-المخصصة-database-schema)
7. [هيكل المجلدات والمشروع (Monorepo Directory Layout)](#7-هيكل-المجلدات-والمشروع-monorepo-directory-layout)
8. [دليل التثبيت والتشغيل المحلي والإنتاجي (Installation & Run Guide)](#8-دليل-التثبيت-والتشغيل-المحلي-والإنتاجي-installation--run-guide)
9. [بيانات الدخول والروابط الحية (Credentials & Endpoints)](#9-بيانات-الدخول-والروابط-الحية-credentials--endpoints)

---

## 1. المعمارية التقنية الشاملة (System Architecture)

تعتمد المنصة معمارية **Monorepo** مفصولة بالكامل تحقق أعلى معايير الاستقرار وعزل المهام:

```text
                                  +-------------------------------------------------------+
                                  |     Next.js 15 App Router Storefront (Port: 3000)     |
                                  | - Dual-Locale: Arabic RTL (Native) & English LTR      |
                                  | - Age-Group Adaptive UX (Kids / YA / Adult Literature)|
                                  | - Audio Player (Dolby Atmos Sample Previews)          |
                                  +-------------------------------------------------------+
                                                              |
                                             Zero-Price Tamper Payload (variant_id + qty)
                                                              |
                                                              v
                                  +-------------------------------------------------------+
                                  |         Medusa.js v2 Backend & API (Port: 9000)       |
                                  | - Multi-Format Cart & Checkout Workflows (Atomic DB)  |
                                  | - Anti-Piracy DRM Media Streaming Engine              |
                                  | - Native Admin Dashboard + 11 Enterprise Extensions   |
                                  | - Dynamic Origin & CORS Tunnel Resolution Engine      |
                                  +-------------------------------------------------------+
                                             /                                    \
                         ACID Transactions  /                                      \  Background Jobs & Cache
                                           v                                        v
                    +------------------------------------+             +-----------------------------+
                    |        PostgreSQL 16 Engine        |             |      Redis 7 + BullMQ       |
                    | - Core Commerce Tables             |             | - Event-Bus & Message Broker|
                    | - Reader Telemetry & CRM Profiles  |             | - Automated Churn Scanner   |
                    | - Logistics, Bins, Loyalty & Notes |             | - Cart Recovery Workflows   |
                    +------------------------------------+             +-----------------------------+
```

---

## 2. نظام إدارة علاقات القراء الاستثنائي (Reader CRM 360°)

تم بناء نظام CRM استثنائي مصمم خصيصاً لتلبية احتياجات دور النشر والمنصات الصوتية العالمية، متصل اتصالاً حياً بقاعدة بيانات PostgreSQL:

### أ. القياس عن بُعد وسلوك القراءة (Reading Telemetry)
* **تتبع الاستماع الحي**: قياس تراكمي دقيق لساعات الاستماع بالفاصلة العشرية لكل قارئ.
* **الصفحات المقروءة وسرعات السرد**: تسجيل سرعة القارئ المفضلة (`1.0x`, `1.25x`, `1.5x`, `1.75x`, `2.0x`).
* **الرواية قيد القراءة**: عرض العمل الحالي مع مؤشر بصري لنسبة الإنجاز (Progress Bar) وتاريخ آخر جلسة.
* **تفضيل الصيغ الأدبية**: تصنيف القراء آلياً إلى (هجين، كتب ورقية فاخرة، كتب صوتية غامرة، رقمي محمي DRM، أو مجموعات كاملة).

### ب. محرك الإنذار المبكر لمخاطر الانقطاع (AI Churn Early Warning Engine)
* احتساب خوارزمي لمعدل مخاطر الانقطاع (**Churn Score from 0 to 100**) بناءً على:
  1. عدد أيام الغياب التام عن المنصة (Inactivity Days).
  2. وجود أرصدة كتب معلقة لم يتم استبدالها (Unredeemed Book Credits).
  3. هبوط وتيرة الاستماع الأسبوعية.
* إظهار شارات تحذيرية ذكية مع اقتراح إجراءات تنشيط فورية (Win-back Campaigns).

### ج. نافذة ملف القارئ الموحد (Customer 360° Drawer Modal)
تحتوي على مركز عمليات فوري يتيح لمسؤولي الدار:
1. **مرسل واتساب والرسائل المباشر (Direct WhatsApp Dispatcher)**:
   - اختيار القناة: واتساب (WhatsApp)، رسائل نصية (SMS)، أو بريد إلكتروني.
   - قوالب معتمدة بالسياق السعودي والخليجي:
     - *ترشيح أدبي خاص حسب اهتمامات القارئ وسرعة سرده.*
     - *تنشيط واستئناف القراءة بعد انقطاع مع نقاط مجانية.*
     - *مكافأة إتمام الرواية وإيداع رصيد فوري.*
     - *دعوة حصرية لحضور جلسات الصالون الأدبي الافتراضي.*
     - *متابعة تسليم النسخ الورقية الموقعة والتغليف الفاخر.*
   - تسجيل الرسائل تلقائياً في جدول `crm_communications_log`.
2. **إدارة أرصدة الكتب (Instant Book Credits)**:
   - إهداء أرصدة بنقرة واحدة (`+1`, `+2`, `+5`) مع تحديث رصيد القارئ في قاعدة البيانات فوراً.
3. **تعديل نقاط الولاء التدقيقي (Audited Loyalty Adjustment)**:
   - زيادة أو خصم النقاط مع تدوين سبب التعديل وتوثيقه تلقائياً في السجل الرقابي.
4. **ترقية رتبة العضوية الأدبية (VIP Tier Progression)**:
   - ترقية فورية بين الفئات (الصالون البلاتيني الممتاز، نادي النخبة الذهبي، القارئ الفضي، القارئ المبتدئ).
5. **سجل ملاحظات فريق خدمة القراء (Categorized Staff Notes)**:
   - تدوين الملاحظات التحريرية والتفضيلات مصنفة (`مكالمة هاتفية`, `دعم فني`, `تفضيل قراءة`, `إهداء`, `ملاحظة تحريرية`) مع توثيق اسم المسؤول والتاريخ.

### د. شرائح الجمهور الديناميكية (Dynamic Audience Segments)
* استعلامات لحظية تصنف القراء تلقائياً (مثل كبار القراء VIP Whales، رواد الكتب الصوتية Power Listeners، المعرضون لخطر الانقطاع At-Risk Churn).
* واجهة لإنشاء شرائح جديدة وتحديد قواعد الاستهداف (Rule Criteria) مع إمكانية إطلاق حملات مخصصة بنقرة واحدة.

---

## 3. دليل الإضافات والوحدات المخصصة (Enterprise Custom Modules)

تتضمن لوحة التحكم 11 وحدة تشغيلية مدمجة كبدائل أصيلة لأشهر المنصات العالمية:

| الوحدة المخصصة | المسار في لوحة التحكم | الوظيفة التشغيلية والربط الفعلي | البديل العالمي المستبدل |
| :--- | :--- | :--- | :--- |
| **لوحة CRM 360** | `/app/crm` | إدارة القراء، قياس سلوك القراءة، إرسال واتساب، والتنبؤ بالانسحاب | HubSpot CRM / Salesforce |
| **سجلات العملاء 360** | `/app/crm/customers` | دليل القراء الشامل، فلترة الصيغ ورتب الـ VIP، وفتح الملفات الموحدة | Segment / Klaviyo Profiles |
| **شرائح الجمهور** | `/app/crm/segments` | تصنيف الجمهور السلوكي التلقائي، وتفعيل حملات الاستهداف الفوري | Klaviyo Dynamic Segments |
| **برنامج الولاء والـ VIP** | `/app/loyalty` | متابعة رصيد النقاط، فئات الترقية (Tier Ladder)، وقسائم المكافآت | Smile.io / LoyaltyLion |
| **التسويق وأتمتة السلات** | `/app/marketing` | حملات النشر المؤتمتة، قمع المبيعات، واسترداد السلات المتروكة | Klaviyo / Omnisend |
| **المستودعات واللوجستيات** | `/app/warehouse` | إدارة خانات الأرفف (Bins)، تتبع حركات المخزون، وأذونات التوريد | ShipStation / Katana Cloud |
| **المؤلفون والرواة** | `/app/authors-narrators` | نسب الملكية الفكرية، استوديوهات السرد، وعينات صوتية عالية الدقة | Audible ACX / Storytel Hub |
| **الاشتراكات المتكررة** | `/app/subscriptions` | باقات العضوية (شهري/سنوي)، جدولة التجديد التلقائي عبر BullMQ | Recharge Payments |
| **المراجعات والتقييمات** | `/app/reviews` | طابور تدقيق المراجعات (Moderation)، شارات المشترين الموثقين | Yotpo / Judge.me |
| **مركز الدعم الفني** | `/app/helpdesk` | صندوق المحادثات وتذاكر الدعم، الردود الجاهزة (Canned Replies) | Zendesk / Gorgias |
| **التسويق بالعمولة** | `/app/affiliates` | إدارة روابط المؤثرين، أكواد الخصم، وتوزيع العمولات المالية | Refersion / UpPromote |
| **مركز القيادة التنفيذي** | `/app/command-center` | لوحة الرقابة المركزية الشاملة لكافة مؤشرات المتجر والمبيعات والنشاط | Executive BI Dashboard |

---

## 4. معمارية المنتجات وتعدد الصيغ والفئات العمرية

تمت هندسة الكتالوج ليدعم طبيعة النشر متعدد الصيغ والفئات العمرية المتمايزة:

### الصيغ المتوفرة لكل عنوان (Multi-Format Matrix):
1. **غلاف ورقي فاخر (Collector Paperback / Hardcover)**: شحن فيزيائي سريع مع خيارات تغليف الهدايا والنسخ الموقعة بخط اليد من المؤلف.
2. **كتاب صوتي غامر (Immersive Audiobook)**: تسجيل صوتي عالي الدقة (Dolby Atmos 48kHz) مع عينات استماع مدمجة وتنزيل محمي.
3. **كتاب إلكتروني آمن (DRM Encrypted E-Book)**: متوافق مع صيغ EPUB3 / PDF، مع حماية ضد القرصنة والنسخ غير المصرح به.
4. **باقة النخبة الهجينة (All-Format Hybrid Bundle)**: تجمع الكتاب الورقي الفاخر مع الرصيد الصوتي والرقمي بسعر تفضيلي.

### الهوية البصرية المتكيفة حسب الفئة العمرية (Age-Adaptive Identity):
* **فئة براعم الأطفال (Kids Bedtime 3-9)**: واجهات دافئة ومرحة، ألوان زاهية، نبرة صوت هادئة مساعدة على النوم، خطوط واضحة، وتجربة تصفح آمنة ومبسطة للآباء.
* **فئة الناشئة واليافعين (Young Adult / Fantasy 10-18)**: تصاميم حيوية، بطاقات تفاعلية لمسارات المغامرة والفانتازيا والألغاز، وشارات إنجاز ومكافآت قراءة سريعة.
* **فئة كبار القراء والروايات الفكرية (Adult Literature 18+)**: طابع كلاسيكي راقٍ (Navy & Gold)، تركيز على عمق النصوص والتحليل الأدبي والندوات الفكرية للصالون الأدبي.

---

## 5. الأمان والحماية من الاحتيال (Zero-Vulnerability & Anti-Fraud Security)

خضعت المنصة لفحص أمني وتشغيلي عميق لضمان مناعة كاملة ضد أي محاولات تلاعب أو تجاوز:

1. **منع التلاعب بالأسعار كلياً (Zero Price Manipulation)**:
   - واجهة المتجر لا ترسل أي قيمة مالية مطلقاً، بل ترسل فقط `variant_id` و `quantity`.
   - الخادم يستخرج الأسعار والخصومات وضريبة القيمة المضافة (15% في السعودية) مباشرة من جداول الأسعار في PostgreSQL.
2. **الحجز الذري للمخزون (Atomic Inventory Reservation)**:
   - استخدام أقفال قاعدة البيانات الصفية لمنع البيع الزائد (Overselling) تحت ضغط الطلبات المتزامنة.
   - في حال تعثر الدفع، تنطلق عمليات تعويضية آلية (Compensation Steps) لإلغاء الحجز فوراً.
3. **حماية المحتوى الرقمي ضد القرصنة (Anti-Piracy DRM)**:
   - وسائط الكتب الصوتية والإلكترونية مخزنة في حاويات خاصة محمية.
   - روابط التحميل والاستماع مؤقتة وموقعة رقمياً (Pre-signed HMAC URLs) تنتهي صلاحيتها خلال 60 ثانية ولا يمكن مشاركتها.
4. **التوثيق التشفيري لإشعارات الدفع (Cryptographic Webhooks)**:
   - مطابقة تواقيع Stripe و Mada عبر `crypto.timingSafeEqual` للحماية من هجمات التوقيت (Timing Attacks).
   - نافذة سماح لا تتعدى 300 ثانية لمنع هجمات إعادة الإرسال (Replay Attacks).
5. **جدران الحماية للوحة التحكم (Admin Hardening)**:
   - كوكيز المصادقة محمية بخصائص `HttpOnly` و `SameSite=None` و `Secure`.
   - حل مشكلة مسودات الطلبات بنزع حزم React Query المكررة وتفعيل `resolve.dedupe`.
   - دعم التوجيه التلقائي للمصادقة عبر الأنفاق المشفرة (Cloudflare HTTPS Tunnels).

---

## 6. هيكل قاعدة البيانات والجداول المخصصة (Database Schema)

بالإضافة لجداول Medusa القياسية (`product`, `order`, `customer`, `cart`...)، تم تدشين الجداول المخصصة التالية:

```sql
-- 1. ملفات القراءة والقياس عن بُعد
customer_reading_profiles (
    id VARCHAR(100) PRIMARY KEY,
    customer_id VARCHAR(100) UNIQUE REFERENCES customer(id),
    preferred_format VARCHAR(50),
    audio_hours_listened NUMERIC(8,2) DEFAULT 0.00,
    pages_read INT DEFAULT 0,
    preferred_narration_speed VARCHAR(20) DEFAULT '1.0x',
    currently_reading_title VARCHAR(255),
    completed_books_count INT DEFAULT 0,
    churn_risk_level VARCHAR(20) DEFAULT 'low',
    churn_score INT DEFAULT 10,
    vip_tier VARCHAR(50) DEFAULT 'bronze_reader',
    book_credits_balance INT DEFAULT 0,
    engagement_score INT DEFAULT 80,
    last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ملاحظات فريق خدمة القراء والتحرير
customer_crm_notes (
    id VARCHAR(100) PRIMARY KEY,
    customer_id VARCHAR(100) REFERENCES customer(id),
    author_name VARCHAR(150) NOT NULL,
    note_type VARCHAR(50) DEFAULT 'call',
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. سجل التواصل والمراسلات الموحد
crm_communications_log (
    id VARCHAR(100) PRIMARY KEY,
    customer_id VARCHAR(100) REFERENCES customer(id),
    channel VARCHAR(30) NOT NULL, -- whatsapp, sms, email
    template_key VARCHAR(100),
    recipient VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message_body TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'delivered',
    sent_by VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. شرائح وتصنيف الجمهور الديناميكية
crm_audience_segments (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    slug VARCHAR(100) UNIQUE,
    description TEXT,
    description_ar TEXT,
    rule_criteria TEXT NOT NULL,
    customer_count INT DEFAULT 0,
    avg_engagement VARCHAR(20),
    sync_destination VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. حسابات الولاء ونقاط المكافآت
loyalty_accounts (
    id VARCHAR(100) PRIMARY KEY,
    customer_id VARCHAR(100),
    customer_email VARCHAR(255) UNIQUE,
    points_balance INT DEFAULT 150,
    lifetime_points INT DEFAULT 150,
    tier_level VARCHAR(50) DEFAULT 'bronze',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 7. هيكل المجلدات والمشروع (Monorepo Directory Layout)

```text
c:\Users\D\Desktop\New folder (2)\
├── apps/
│   ├── backend/                              # تطبيق الميدوسا والخادم الخلفي ولوحة التحكم
│   │   ├── public/admin/                     # أصول لوحة التحكم المجمعة والمجهزة للإنتاج
│   │   ├── src/
│   │   │   ├── admin/routes/                 # شاشات لوحة التحكم المخصصة
│   │   │   │   ├── crm/                      # شاشة CRM 360، ودليل العملاء، والشرائح
│   │   │   │   ├── loyalty/                  # لوحة برنامج الولاء وفئات الـ VIP وقسائم المكافآت
│   │   │   │   ├── marketing/                # حملات النشر واسترداد السلات المتروكة
│   │   │   │   ├── warehouse/                # مواقع الأرفف (Bins) وتدقيق حركات المخزون
│   │   │   │   ├── authors-narrators/        # شؤون المؤلفين ونسب الملكية والرواة
│   │   │   │   ├── subscriptions/            # باقات العضوية وتجديدات أرصدة الكتب
│   │   │   │   ├── reviews/                  # طابور تدقيق المراجعات والتقييمات الموثقة
│   │   │   │   ├── helpdesk/                 # صندوق تذاكر الدعم والردود السريعة
│   │   │   │   ├── affiliates/               # دليل المؤثرين وأذونات الصرف
│   │   │   │   ├── analytics/                # مؤشرات الأداء المالي واقتصاديات الوحدة
│   │   │   │   ├── cms/                      # مدونة النشر واستوديو مقالات SEO
│   │   │   │   └── command-center/           # شاشة الرقابة والتحكم التنفيذية الموحدة
│   │   │   ├── api/admin/                    # مسارات API الإدارية المربوطة بـ PostgreSQL
│   │   │   │   ├── crm/route.ts              # معالج استعلامات وإجراءات CRM 360
│   │   │   │   ├── loyalty/route.ts          # معالج تعديل النقاط والمكافآت
│   │   │   │   ├── authors/route.ts          # معالج بيانات المؤلفين وحقوق الملكية
│   │   │   │   ├── narrators/route.ts        # معالج بيانات المعلقين الصوتيين
│   │   │   │   └── subscription-tiers/       # معالج باقات وخطط الاشتراكات
│   │   │   ├── modules/                      # وحدات ميدوسا v2 المخصصة (Story, Subscription, Tracker)
│   │   │   └── workflows/                    # مسارات عمل الحجز الذري ومعالجة الطلبات
│   │   └── medusa-config.ts                  # تكوين الخادم وموديولات Redis وقواعد CORS
│   │
│   └── storefront/                           # واجهة المتجر بنظام Next.js 15 App Router
│       ├── src/
│       │   ├── app/[locale]/                 # توجيه اللغات الديناميكي (العربية ar والإنجليزية en)
│       │   ├── components/                   # مكونات Shadcn UI ومُشغل الصوت وسلة الشراء
│       │   └── messages/                     # قواميس الترجمة الكاملة (ar.json & en.json)
│       └── next.config.ts
│
├── packages/
│   └── schemas/                              # عقود التحقق المشتركة (Shared Zod Schemas)
├── docker-compose.yml                        # حاويات PostgreSQL 16 و Redis 7
├── .env.template                             # نموذج المتغيرات السرية الموثق
└── README.md                                 # هذا الملف
```

---

## 8. دليل التثبيت والتشغيل المحلي والإنتاجي (Installation & Run Guide)

### المتطلبات الأساسية:
* **Node.js**: الإصدار 20.x أو 22.x أو 24.x
* **PostgreSQL**: الإصدار 16 (محلي أو عبر Docker)
* **Redis**: الإصدار 7 (محلي أو عبر Docker)
* **مدير الحزم**: npm أو pnpm

### الخطوة 1: استنساخ المستودع وضبط المتغيرات البيئية
```bash
git clone https://github.com/omar-mahmoud-eng/NOVEL_STOR.git
cd NOVEL_STOR
cp .env.template .env
cp .env.template apps/backend/.env
```

### الخطوة 2: تشغيل قواعد البيانات عبر Docker
```bash
docker compose up -d postgres redis
```

### الخطوة 3: تثبيت الاعتماديات
```bash
npm install
```

### الخطوة 4: ترحيل جداول قاعدة البيانات وبناء النظام
```bash
# ترحيل جداول ميدوسا
npm --prefix apps/backend run build
```

### الخطوة 5: إنشاء حساب المدير التنفيذي (Super Admin)
```bash
cd apps/backend
npx medusa user --email admin@enterprise-ecommerce.com --password "AdminP@ssw0rd2026!EnterpriseSecure"
cd ../..
```

### الخطوة 6: تشغيل الخوادم للإنتاج
```bash
# تشغيل الخادم الخلفي لميدوسا ولوحة التحكم (المنفذ 9000)
npm --prefix apps/backend run start

# تشغيل واجهة المتجر في نافذة أخرى (المنفذ 3000)
npm --prefix apps/storefront run start
```

---

## 9. بيانات الدخول والروابط الحية (Credentials & Endpoints)

| الخدمة | الرابط المحلي | رابط النفق العام المشفر (Cloudflare HTTPS) |
| :--- | :--- | :--- |
| **واجهة المتجر (العربية)** | `http://localhost:3000/ar` | [https://kde-colin-advances-que.trycloudflare.com/ar](https://kde-colin-advances-que.trycloudflare.com/ar) |
| **لوحة التحكم الرئيسية** | `http://localhost:9000/app` | [https://inline-composition-grad-bands.trycloudflare.com/app](https://inline-composition-grad-bands.trycloudflare.com/app) |
| **نظام CRM 360° المباشر** | `http://localhost:9000/app/crm` | [https://inline-composition-grad-bands.trycloudflare.com/app/crm](https://inline-composition-grad-bands.trycloudflare.com/app/crm) |
| **مركز القيادة التنفيذي** | `http://localhost:9000/app/command-center` | [https://inline-composition-grad-bands.trycloudflare.com/app/command-center](https://inline-composition-grad-bands.trycloudflare.com/app/command-center) |
| **المؤلفون والرواة** | `http://localhost:9000/app/authors-narrators` | [https://inline-composition-grad-bands.trycloudflare.com/app/authors-narrators](https://inline-composition-grad-bands.trycloudflare.com/app/authors-narrators) |
| **الاشتراكات وباقات الـ VIP** | `http://localhost:9000/app/subscriptions` | [https://inline-composition-grad-bands.trycloudflare.com/app/subscriptions](https://inline-composition-grad-bands.trycloudflare.com/app/subscriptions) |
| **واجهة API لميدوسا** | `http://localhost:9000` | [https://inline-composition-grad-bands.trycloudflare.com](https://inline-composition-grad-bands.trycloudflare.com) |

### بيانات اعتماد المشرف العام (Default Super Admin Credentials):
* **البريد الإلكتروني:** `admin@enterprise-ecommerce.com`
* **كلمة المرور:** `AdminP@ssw0rd2026!EnterpriseSecure`

---

## 📄 الترخيص (License)
هذا المشروع ملكية خاصة وحصرية لمؤسسة النشر والتجارة الإلكترونية، ومصمم وفق أرقى المواصفات الهندسية لعام 2026.
