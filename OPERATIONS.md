# تشغيل StoryVerse والتحقق منه

لجهاز أو سيرفر جديد أو لنقل البيانات، اتبع [دليل التثبيت والنقل والنشر](docs/DEPLOYMENT_AR.md). برومبت الإيجنت في [AGENT_DEPLOYMENT_PROMPT_AR.md](docs/AGENT_DEPLOYMENT_PROMPT_AR.md).

26 أكتوبر 2026. الدفع مؤجل. هذا الدليل يخص المشروع المحلي وDocker Compose؛ لا يتضمن نشرًا على خادم عام.

## الخدمات المحلية

| الخدمة | العنوان |
| --- | --- |
| المتجر | http://localhost:3000/ar |
| ميدوسا | http://localhost:9000/app |
| فحص الخلفية | http://localhost:9000/health |
| البريد التجريبي Mailpit | http://localhost:8025 |
| إدارة التخزين RustFS | http://localhost:9001 |

استخدم حساب الإدارة الموجود في إعداداتك المحلية. لا تُنشر كلمات المرور أو ملفات `.env`. لا توجد بيانات اعتماد عامة في هذا الدليل.

## التشغيل وإعادة البناء

ملف القفل مشترك بين workspaces، وسياق بناء الصور هو جذر المشروع. إعدادات المتجر التي تبدأ بـ `NEXT_PUBLIC_` تحتاج إعادة بناء عند تغييرها.

```powershell
node scripts/setup-env.cjs
docker compose build medusa-backend medusa-storefront
docker compose up -d
docker compose ps
```

أداة التجهيز تحافظ على ملفات الإعداد الموجودة. عند بدء مشروع من الصفر: أنشئ مستخدم الإدارة والمفتاح القابل للنشر من ميدوسا، واربط المفتاح بقناة البيع، ثم ضعه في إعدادات المشروع. لا تنسخ أسرار بيئة أخرى.

تشغل Compose ترحيلات Medusa بواسطة `database-migrate` قبل الخلفية، وتنشئ حاوية التخزين الخاصة بواسطة `minio-init-buckets`. يضيف loader الجداول الإدارية ومرجع القراءة بصورة قابلة للتكرار، دون مسح العملاء أو الطلبات. لا تحتاج تشغيل سكربتات التجهيز القديمة لتشغيل وحدات الإدارة.

الوكيل Nginx ينشر المنفذين 3000 و9000، والخلفية والمتجر داخل شبكة Docker. PostgreSQL وRedis وواجهات التخزين والبريد مربوطة بعنوان loopback على الجهاز. يعيد الوكيل كتابة عناوين العميل الممررة؛ لا تنشر منفذ خدمة التطبيق الداخلية مباشرة مع تفعيل `TRUST_GATEWAY_HEADERS`.

## التخزين والنسخ الاحتياطي

| البيانات | Docker volume |
| --- | --- |
| PostgreSQL | `medusa_postgres_data` |
| Redis وجلسات الإدارة | `medusa_redis_data` |
| الكتب والملفات الخاصة | `publishing_storage_data` |
| صور Medusa العامة | `medusa_uploads_data` داخل `/app/apps/backend/static` |
| رسائل Mailpit المحلية | `publishing_mailpit_data` |

```powershell
node tests/backup-restore.cjs
```

ينشئ الاختبار نسخة PostgreSQL بصيغة custom داخل `scratch/docker-backups`، ثم يستعيدها إلى قاعدة معزولة ويتحقق من تطابق البيانات الأساسية ويحذف قاعدة الاختبار فقط. نسخة قاعدة البيانات لا تشمل ملفات S3 أو صور المنتجات؛ انسخ مجلدي الوسائط أيضًا بخطة نسخ احتياطي على الخادم الفعلي. النسخ المحلية تحتوي على بيانات المشروع ويجب حمايتها. لا تستخدم `docker compose down -v` على بيانات تحتاج الاحتفاظ بها.

## الاختبارات القابلة للإعادة

ابنِ صورة الاختبارات أول مرة. تشمل Chromium وأدوات المتصفح داخل Linux، مع ربط شيفرة التطبيق والاختبارات الحالية للقراءة فقط. لا تعِد تشغيل الخدمات أو بناءها أثناء جولة المتصفح.

```powershell
docker compose --profile testing build tests
docker compose --profile testing run --rm --no-deps tests node tests/unit-suites.cjs
docker compose --profile testing run --rm --no-deps tests node tests/run-in-docker.cjs backend-integration
docker compose --profile testing run --rm --no-deps tests node tests/run-in-docker.cjs customer-integration
docker compose --profile testing run --rm --no-deps tests node tests/admin-operations.cjs
docker compose --profile testing run --rm --no-deps tests node tests/admin-workflows.cjs
docker compose --profile testing run --rm --no-deps tests node tests/medusa-orders.cjs
docker compose --profile testing run --rm --no-deps tests node tests/storefront-commerce.cjs
docker compose --profile testing run --rm --no-deps tests node tests/docker-operational.cjs
docker compose --profile testing run --rm --no-deps tests node tests/run-in-docker.cjs smoke
docker compose --profile testing run --rm --no-deps tests node tests/browser-matrix.cjs
```

تستخدم اختبارات الكتابة سجلات مميزة لكل تشغيل، وتنظف سجلاتها. تحتاج حساب الإدارة والمفتاح القابل للنشر في إعدادات Compose. يحفظ التقرير والصور داخل `scratch/docker-tests`. كلمة مرور استعادة الحساب تُرسل إلى Mailpit فقط في الإعداد المحلي.

الاختبارات التالية تُشغّل من الجهاز بواسطة Node واعتماديات المشروع. اختبار القاعدة الجديدة يستخدم قاعدة PostgreSQL وRedis معزولين. اختبار إعادة التشغيل يوقف خدمات المشروع مؤقتًا، لذلك شغله وحده بعد انتهاء الاختبارات الأخرى.

```powershell
npm run typecheck
npm audit --omit=dev
node tests/fresh-database.cjs
node tests/restart-persistence.cjs
node tests/backup-restore.cjs
```

لا تستخدم وضع المسح التجريبي في `provision-all-in-one-tables.cjs` على قاعدة فعلية. إعادة تحميل أمثلة الأسعار أو المحتوى ليست خطوة مطلوبة لإعادة التشغيل.

## إعداد بيئة عامة

- اضبط عناوين HTTPS الحقيقية في `NEXT_PUBLIC_BASE_URL` و`MEDUSA_ADMIN_PUBLIC_URL` وقوائم `STORE_CORS` و`ADMIN_CORS` و`AUTH_CORS`. يظل `MEDUSA_ADMIN_BACKEND_URL` فارغًا إذا كانت لوحة الإدارة وAPI على النطاق نفسه. أعد البناء عند تغيير العناوين المجمعة داخل المتصفح.
- اضبط `S3_PUBLIC_ENDPOINT` بعنوان تخزين يمكن للعميل الوصول إليه، وأضف نطاق التخزين ونطاق الصور العامة إلى `NEXT_PUBLIC_MEDIA_ORIGINS` مفصولين بفواصل، ثم أعد بناء المتجر. الحاوية الخاصة ترفض الوصول المجهول؛ لا تحولها إلى حاوية عامة لحل مشكلة الروابط.
- Compose الحالية نقطة تشغيل محلية عبر HTTP. يلزم إنهاء TLS وإعداد النطاقات وقواعد الشبكة على الاستضافة الفعلية والتحقق منها هناك. لا تمرر ترويسات proxy من مصدر غير موثوق.
- البريد المحلي مضبوط على Mailpit. للتسليم الحقيقي اضبط `SMTP_HOST` و`SMTP_PORT` و`SMTP_SECURE` وبيانات المصادقة وعنوان المرسل، واختر `MAIL_DELIVERY_MODE=external` صراحة. لم يُختبر إرسال إلى مزود خارجي في هذا الفحص.
- نشر صور Medusa العامة بواسطة volume مناسب لهذه النسخة ذات العقدة الواحدة. التشغيل بعدة نسخ خلفية يحتاج مزود ملفات عامًا مشتركًا وضبطه في Medusa.
- جهّز النسخ الاحتياطي خارج الجهاز والتنبيهات والاحتفاظ بالسجلات، واختبر الاستعادة على خادم الاستضافة نفسه. اختبارات التحمل المحلية لا تحدد سعة خادم لم يُختبر.
- أضف المخطوطات والكتب الصوتية الكاملة والحقوق والبيانات التحريرية الفعلية من لوحة الإدارة. مرجع Stitch يتضمن 39 معاينة قراءة، وليس مكتبة ملفات إنتاج كاملة.

شاشات الحملات والرسائل والأتمتة تحفظ مسودات وتعريفات. أرصدة الولاء والتصنيف اليدوي وسجل المخازن لا تُشغّل مزود تسويق أو تحول أموالًا أو تعدل مخزون Medusa الأصلي تلقائيًا. إدارة المخزون الأصلي متاحة عبر صفحات Inventory القياسية في ميدوسا. الدفع والشراء بالاشتراك واستبدال المكافآت النقدية مؤجلة.

## إصلاح تفاصيل طلب قديم بلا ملخص

قد تحتوي قواعد التجهيز القديمة على طلبات أُدخلت مباشرة دون سجل `order_summary`. تظهر القائمة لكن تفاصيل الطلب تقع بخطأ `pending_difference`. هذه مشكلة بيانات مختلفة عن خطأ `No QueryClient set` في المسودات، الذي عولج بتوحيد TanStack داخل إعداد Vite في `medusa-config.ts` وإعادة بناء الخلفية ولوحة الإدارة.

بعد نسخة PostgreSQL احتياطية، اعرض مرشحي الإصلاح دون كتابة:

```powershell
docker compose run --rm --no-deps medusa-backend node ../../node_modules/@medusajs/cli/cli.js exec ./src/scripts/repair-order-summaries.js
```

راجع `candidates` و`skipped`. للتطبيق على الطلبات المؤهلة فقط:

```powershell
docker compose run --rm --no-deps -e ORDER_SUMMARY_REPAIR_APPLY=true medusa-backend node ../../node_modules/@medusajs/cli/cli.js exec ./src/scripts/repair-order-summaries.js
```

يمكن حصر المعالجة بإضافة `-e "ORDER_SUMMARY_REPAIR_IDS=order_ID1,order_ID2"` قبل اسم الخدمة. الأداة تضيف الملخص المفقود فقط للإصدار الأول الذي لا يملك سجل تعديلات أو credit lines، وتستخدم حاسبة Medusa الأصلية ومعاملات الطلب الفعلية. لا تغير السعر أو العملة أو حالة الدفع أو بنود الطلب، ولا تستبدل ملخصًا موجودًا. تسجل الإضافات في `storyverse_order_summary_repairs`؛ إعادة التطبيق لا تكررها. الحالات ذات التاريخ المالي لا تُخمن، بل تظهر في `skipped` لاسترجاع ملخصها الصحيح من النسخ أو مراجعتها محاسبيًا.

ابنِ صورة الخلفية من إصدار يتضمن الأداة قبل استخدامها. في نشر HTTPS استعمل معاملي Compose الموثقين في دليل النشر. بعد تحديث لوحة الإدارة حدّث التبويب القديم تحديثًا كاملًا لتحميل أصول الواجهة الجديدة.

تقدم ملفات الأسرة وسجل القراءة والتفضيلات تخزينًا محليًا مفصولًا حسب الحساب والملف على الجهاز. تحقق الوالد المحلي ليس خدمة تحقق هوية، والصالونات تحفظ مسودات محلية. هذه الحدود تحتاج قرار منتج وخدمة فعلية إذا كان مطلوبًا مزامنة متعددة الأجهزة أو مجتمع عام.
