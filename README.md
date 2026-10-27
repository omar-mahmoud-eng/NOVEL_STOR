# StoryVerse

للتشغيل على جهاز أو سيرفر آخر: [دليل التثبيت والنقل والنشر](docs/DEPLOYMENT_AR.md). ولتنفيذ المهمة بواسطة إيجنت: [برومبت التشغيل الجاهز](docs/AGENT_DEPLOYMENT_PROMPT_AR.md).

آخر دليل للتشغيل الكامل على Docker، إدارة ميدوسا، النسخ الاحتياطي والاختبارات: [OPERATIONS.md](OPERATIONS.md). نتائج الفحص الحالية وحدود الإطلاق: [PRODUCTION_READINESS_REPORT.md](PRODUCTION_READINESS_REPORT.md).

متجر كتب عربي/إنجليزي باستخدام Medusa v2 وNext.js 15، مع PostgreSQL وRedis ووحدات للكتب الرقمية والاشتراكات ولوحة إدارة.

دليل مساحة النشر والأدوار ومزامنة القراءة والاختبارات الجديدة: [مساحة النشر المطورة](docs/PUBLISHING_WORKSPACE.ar.md).

نتائج التحديث والتحقق بتاريخ 27 أكتوبر 2026: [تقرير التحديث](UPGRADE_VERIFICATION_2026-10-27.md).

## التشغيل المحلي

يتطلب Node.js 22 أو 24 وnpm وDocker. الاعتماديات مثبتة من ملف القفل؛ إصدار TypeScript مثبت لتوافق بناء Medusa.

```powershell
npm ci
node scripts/setup-env.cjs
docker compose up -d postgres redis
npm run db:migrate --workspace=@enterprise/backend
npm run dev
```

واجهة المتجر: `http://localhost:3000/ar`، لوحة الإدارة: `http://localhost:9000/app`.
أنشئ مستخدم الإدارة بكلمة مرور تختارها باستخدام `npm run user:create --workspace=@enterprise/backend -- --email YOUR_EMAIL --password YOUR_PASSWORD`. لا يوجد حساب إدارة افتراضي موصى به.

أضف المفتاح القابل للنشر من Medusa إلى `apps/storefront/.env.local` باسم `MEDUSA_PUBLISHABLE_KEY`، واربطه بقناة البيع. هذا المفتاح مطلوب لمسارات المتجر. المتصفح يتصل بالخادم عبر `/api/medusa`؛ عنوان الخادم الداخلي يضبط في `MEDUSA_BACKEND_URL`.

الجداول الإدارية ومرجع القراءة تنشأ تلقائيًا عند تشغيل الخلفية. لا تشغّل سكربتات التجهيز القديمة على قاعدة تحتوي على بيانات فعلية.

## التحقق والبناء

```powershell
npm test
npm run typecheck
npm run build
npm audit
npm run test:smoke
```

اختبارات الانحدار تستدعي كود التطبيق نفسه وتعزل الخدمات الخارجية. فحص `test:smoke` يحتاج إلى خادمين يعملان؛ صفحات الإدارة الموثقة تحتاج إلى `TEST_ADMIN_EMAIL` و`TEST_ADMIN_PASSWORD`. سكربتات `test-*.cjs` القديمة تتضمن اختبارات محاكاة، وليست دليل جاهزية إنتاجية.

بعد البناء شغّل `npm run start --workspace=@enterprise/backend` و`npm run start --workspace=@enterprise/storefront` في نافذتين. سكربت الخادم يشغّل الملفات المجمعة داخل `.medusa/server` ويحمّل إعدادات الخلفية المحلية.

تستخدم صور Docker جذر المستودع كسياق بناء لدعم workspaces وملف القفل المشترك. اضبط الأسرار والعناوين العامة والمفتاح القابل للنشر قبل `docker compose up --build`. Compose تنفذ الترحيلات بواسطة خدمة `database-migrate` قبل تشغيل الخلفية.

## حدود الوظائف الحالية

فحص واجهات Stitch وفصل المنصات وإصلاح القراءة والتنقل موثق في [UI_OPERATIONAL_REPORT.md](UI_OPERATIONAL_REPORT.md). لاختبارات المتصفح الموسعة بعد تشغيل الخدمات: `npm run test:ui`.

- تسجيل الدخول والتسجيل يتحققان من Medusa، والجلسة تحفظ في cookie من نوع HttpOnly. الشخصيات التجريبية مغلقة افتراضيًا؛ `NEXT_PUBLIC_ENABLE_DEMO_MODE=true` مخصص لعرض محلي منفصل.
- إتمام الطلب يعتمد على استجابة الخادم الفعلية. الدفع الإلكتروني يحتاج إلى مزود وتكامل واجهته. الدفع عند الاستلام لا يظهر كدفع ناجح، ويتطلب تفعيل `NEXT_PUBLIC_MANUAL_PAYMENT_ENABLED=true` وتجهيز الشحن والمزود اليدوي في Medusa.
- إعداد Stripe الاختياري يستخدم `STRIPE_API_KEY` و`STRIPE_WEBHOOK_SECRET`. الإشعارات تمر إلى عامل الدفع في Medusa. لا يكفي إعداد webhook لإضافة واجهة دفع بالبطاقة.
- تجديد اشتراك مدفوع يحتاج إلى `metadata.paid_through` مسجل من تكامل فوترة موثوق؛ المؤقت لا يجري تحصيلًا ماليًا. صلاحية المكتبة الشاملة تتطلب `metadata.unlimited_library_access=true` في الباقة.
- تخزين الوسائط يحتاج إلى MinIO/S3 وملفات فعلية. اضبط `S3_PUBLIC_ENDPOINT` بعنوان يمكن للمتصفح الوصول إليه، و`NEXT_PUBLIC_MEDIA_ORIGINS` بالقيم نفسها. الروابط الموقعة قصيرة العمر ويمكن استخدامها أثناء صلاحيتها؛ ليست حماية مطلقة من النسخ.
- الرسائل الإدارية تحفظ مسودات؛ لا يوجد مزود مراسلات أو إرسال فواتير مهيأ. لوحة العمليات تعرض قياسات الخدمات والطلبات الفعلية؛ المقاييس التي تحتاج بيانات تكلفة لا تعرض ربحًا مفترضًا.
- الكتالوج التحريري يحتوي على عناوين نموذجية؛ الشراء متاح فقط للمنتجات والنسخ والأسعار الموجودة في Medusa. لا تعلن عروضًا آلية لم تضبط لها قواعد عروض في Medusa.

## إصلاح أسعار البيانات التجريبية القديمة

الإصدارات القديمة كانت تخزن الهللات في حقول Medusa التي تستخدم الريال، وتربط بعض أسعار النسخ بترتيب مصفوفة غير مضمون. كود التجهيز الجديد يصلح ذلك. لإصلاح المنتجات الخمسة المعروفة في قاعدة تطوير قديمة:

```powershell
node scripts/repair-seeded-prices.cjs
node scripts/repair-seeded-prices.cjs --apply
```

الأداة تتحقق من الأسعار الأصلية المعروفة، وتحتفظ بنسخة في `storyverse_price_repair_backup`، ولا تغير الطلبات التاريخية. راجع التقرير `AUDIT_REPORT.md` لنتائج الفحص وحدود التحقق.
