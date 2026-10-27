# تشغيل المشروع على جهاز جديد أو سيرفر

تحديث: 27 أكتوبر 2026. المستودع: [NOVEL_STOR](https://github.com/omar-mahmoud-eng/NOVEL_STOR)، البرانش: `codex/production-readiness-2026-10-27`.

هذا دليل خاص بالكود الموجود في المستودع. يغطي تثبيتًا جديدًا، ونقل البيانات الحالية، ثم نشرًا عامًا باستخدام Docker على سيرفر واحد. الدفع يظل مؤجلًا.

## 1. اختر نوع التشغيل

| الحالة | المسار |
| --- | --- |
| جهاز Windows أو macOS أو Linux للتجربة | الأقسام 2–5 ثم اختبارات القسم 8 |
| سيرفر جديد ببيانات فارغة | الأقسام 2–6 ثم التحقق من عناوين HTTPS |
| نقل العملاء والمنتجات والكتب الحالية | القسم 7؛ استعد البيانات قبل تشغيل الخلفية أو الترحيلات على الوجهة |
| تشغيل بواسطة إيجنت | انسخ [البرومبت الجاهز](AGENT_DEPLOYMENT_PROMPT_AR.md) وأكمل بيانات الوجهة |

GitHub يحتوي على الكود والقوالب والاختبارات والتقارير. لا يحتوي على `.env` أو قاعدة البيانات أو الكتب الخاصة أو صور المنتجات المرفوعة أو جلسات Redis. ملفات الأسرة والتقدم والملاحظات المحلية مخزنة في متصفح المستخدم، ولن ينقلها استنساخ المستودع أو نسخ PostgreSQL. تغيير النطاق ينشئ مساحة تخزين متصفح مختلفة.

هذه الحزمة تحتاج Docker قادرًا على تشغيل **Linux containers**. الاستضافة المشتركة التي تدعم PHP فقط لا تكفي. المسار الذي اختُبر هو `linux/amd64`؛ على ARM/Apple Silicon تحقق من دعم الصور المثبتة وبناء الاعتماديات أولًا، ولا تفترض أن الاختبار السابق شمل هذه المعمارية.

## 2. المتطلبات

- Git وDocker Engine/Desktop وCompose. قالب HTTPS يستخدم `!override` ويتطلب Compose **2.24.4 أو أحدث**؛ تحقق بواسطة `docker compose version`. راجع [تثبيت Docker](https://docs.docker.com/engine/install/) و[Compose](https://docs.docker.com/compose/install/) و[دلالة override](https://docs.docker.com/reference/compose-file/merge/).
- Node.js 22 لتشغيل مولد الإعدادات فقط. لا تحتاج `npm ci` على المضيف إذا شغّلت التطبيق والاختبارات داخل Docker. البديل دون Node موضح أدناه.
- ابدأ عمليًا بـ4 أنوية و8GB RAM و30GB مساحة حرة، وأضف مساحة الوسائط والنسخ الاحتياطية. هذه نقطة بداية للبناء وليست ضمان سعة إنتاج. على الأجهزة الصغيرة ابنِ الخلفية والمتجر بالتتابع.
- في النشر العام: نطاقات للمتجر والإدارة والوسائط، وشهادات TLS صالحة، وإمكانية فتح 80 و443. المثال يفترض أن Nginx داخل Docker هو نقطة الاتصال العامة المباشرة.

قبل تشغيل base Compose على VPS، امنع وصول العامة إلى 3000 و9000 من جدار شبكة الاستضافة مع إبقاء وصول SSH المعتمد. استخدم SSH tunnel للتهيئة المؤقتة، ثم فعّل قالب HTTPS الذي يستبدل منافذ gateway. راجع قواعد Docker المنشورة فعليًا؛ لا تعتمد على افتراض أن جدار المضيف يحجبها تلقائيًا.

Compose الحالية تستخدم أسماء حاويات وvolumes وشبكة ثابتة. تغيير اسم مجلد المستودع أو `-p` وحده **لا يعزل نسخة ثانية**. استخدم Docker host/VM أخرى للتجربة، أو عدل كل الأسماء والمنافذ والـvolumes بصورة متسقة قبل تشغيل نسختين على المضيف نفسه.

## 3. تنزيل الكود وتجهيز الأسرار

الأوامر التالية تعمل من جذر المستودع، في Bash أو PowerShell 7:

```text
git clone --branch codex/production-readiness-2026-10-27 --single-branch https://github.com/omar-mahmoud-eng/NOVEL_STOR.git
cd NOVEL_STOR
git rev-parse HEAD
docker version
docker compose version
node scripts/setup-env.cjs
```

المولد ينشئ أسرار PostgreSQL وRedis والتخزين وJWT وcookie، ويحافظ على ملفات الإعداد الموجودة. **في النقل** استخدم إعدادات المصدر المحفوظة بأمان بدل توليد أسرار بديلة بلا خطة. تغيير كلمة مرور في `.env` لا يغير تلقائيًا كلمة مرور قاعدة موجودة داخل volume.

بديل مولد الإعدادات دون Node على المضيف، من جذر المستودع:

```text
docker run --rm --mount "type=bind,source=ABSOLUTE_REPOSITORY_PATH,target=/workspace" -w /workspace node:22-alpine node scripts/setup-env.cjs
```

استبدل `ABSOLUTE_REPOSITORY_PATH` بمسار مطلق. على Linux راجع ملكية الملفات الناتجة لأن الحاوية قد تنشئها باسم root. لا تنشر `.env` في Git. على Linux قيد قراءته، مثل `chmod 600 .env` بعد التأكد من ملكية المستخدم المشغل.

أضف في `.env` الجذري، من محرر خاص:

```dotenv
ADMIN_EMAIL=YOUR_ADMIN_EMAIL
ADMIN_PASSWORD=YOUR_UNIQUE_ADMIN_PASSWORD
```

اختر كلمة مرور جديدة طويلة؛ القيم أعلاه مواضع استبدال فقط. حساب الاختبارات يقرأ هذه القيم، لكنها لا تنشئ المستخدم تلقائيًا. في وضع Docker، `.env` الجذري هو مصدر إعدادات Compose؛ ملفات `apps/*/.env*` تخص التشغيل المباشر خارج Docker. لا تستخدم `scripts/docker-preflight.cjs` كمولد عام لسيرفر جديد؛ هو أداة مزامنة للبيئة الأصلية ويحتاج قاعدة قائمة.

اترك للتجربة المحلية العناوين الأصلية `http://localhost:3000` و`http://localhost:9000`. الوصول عبر عنوان LAN أو IP بعيد يحتاج ضبط العناوين وTLS؛ استثناء cookie غير الآمن مخصص لـloopback المحلي.

## 4. البناء الأول وإنشاء حساب Medusa

```text
docker compose config --quiet
docker compose build medusa-backend
docker compose build medusa-storefront
docker compose up -d medusa-backend
docker compose ps --all
```

يبني Docker الاعتماديات من ملف القفل. تبدأ PostgreSQL وRedis والتخزين، ثم تنتهي `database-migrate` و`minio-init-buckets` بنجاح، وبعدهما تصبح الخلفية healthy. لا تتوقع استمرار تشغيل حاويتي التهيئة؛ خروجُهما برمز 0 هو النتيجة الصحيحة.

على **قاعدة جديدة فقط** أنشئ المسؤول من ملف المثال؛ لا تُعِد إنشاء مستخدم موجود بعد نقل قاعدة البيانات:

```bash
cat docs/examples/create-admin.cjs | docker compose exec -T medusa-backend node
```

وفي PowerShell:

```powershell
Get-Content -Raw docs/examples/create-admin.cjs | docker compose exec -T medusa-backend node
```

تقرأ الأداة `ADMIN_EMAIL` و`ADMIN_PASSWORD` من البيئة داخل الخلفية، دون طباعتهما. إذا أضفتهما بعد تشغيل الخلفية، أعد إنشاء الحاوية لتحميل البيئة الجديدة:

```text
docker compose up -d --force-recreate medusa-backend
```

للوصول إلى لوحة الإدارة في bootstrap المحلي:

```text
docker compose up -d
```

افتح `http://localhost:9000/app` وادخل بالحساب المنشأ. لو كان الإعداد على VPS، استخدم SSH tunnel للوصول المؤقت من جهازك وأبقِ 3000 و9000 مغلقين للعامة حتى تجهز HTTPS. لا تجعل HTTP على IP عامًا هو عنوان لوحة الإنتاج.

## 5. تجهيز متجر جديد

من إعدادات Medusa:

1. جهز Sales Channel واربطه بالمتجر، واضبط العملة والمنطقة المطلوبة. الواجهة تختار منطقة SAR إن وجدت؛ للاستخدام السعودي أضف `sar` ومنطقة تضم `sa`، واضبط الضرائب الفعلية.
2. أنشئ **Publishable API Key** واربطه بقناة البيع. لا تستخدم Admin token بدلًا منه.
3. ضع المفتاح في `.env` الجذري تحت `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`، ثم نفذ `docker compose up -d --force-recreate medusa-storefront`.
4. أضف منتجات منشورة إلى قناة البيع نفسها، ونسخًا وأسعارًا ومخزونًا مناسبًا. النسخة الرقمية يمكن أن تكون unmanaged إن لم تكن محدودة المخزون.
5. أضف مؤلفين ورواة وملفات من محرر بيانات القصة في صفحة المنتج. الكتب الخاصة تُرفع من المحرر إلى الحاوية الخاصة؛ لا ترفعها كصورة منتج عامة.
6. أدر المحتوى من `/app/reading-stories` واربط القصة بمنتجها عند الحاجة. المحتوى الأولي 39 معاينة قراءة؛ قاعدة جديدة لن تحتوي تلقائيًا على كل منتجات وملفات الجهاز الأصلي.

المنتجات الورقية تحتاج إعداد المخازن والشحن من Medusa القياسي عند تفعيل البيع لاحقًا. لا تشغل `seed-real-database.cjs` أو وضع المسح في `provision-all-in-one-tables.cjs` لتجهيز قاعدة حقيقية. أبقِ `NEXT_PUBLIC_MANUAL_PAYMENT_ENABLED=false` ومفاتيح Stripe فارغة ما دام الدفع مؤجلًا.

## 6. النشر العام على سيرفر واحد

الأسماء التالية أمثلة: `shop.example.com` و`admin.example.com` و`media.example.com`. استبدلها بنطاقاتك؛ الأمثلة ليست إعدادات تلقائية لدومين حقيقي. حضّر DNS وشهادة صالحة تشمل الأسماء الثلاثة، وتجديدًا آليًا للشهادة من مزودك. يشير قالب Nginx إلى `/etc/letsencrypt/live/storyverse/`؛ عدله إلى دليل الشهادة الفعلي مع إبقاء ملفات `archive` وروابط `live` قابلة للقراءة داخل الحاوية.

### البيئة والعناوين

عدل `.env` على الوجهة قبل البناء النهائي:

```dotenv
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://shop.example.com
MEDUSA_ADMIN_PUBLIC_URL=https://admin.example.com
MEDUSA_ADMIN_BACKEND_URL=
STORE_CORS=https://shop.example.com
ADMIN_CORS=https://admin.example.com
AUTH_CORS=https://shop.example.com,https://admin.example.com
S3_PUBLIC_ENDPOINT=https://media.example.com
NEXT_PUBLIC_MEDIA_ORIGINS=https://media.example.com,https://admin.example.com
NEXT_PUBLIC_ENABLE_DEMO_MODE=false
NEXT_PUBLIC_MANUAL_PAYMENT_ENABLED=false
TLS_CERTS_DIR=/etc/letsencrypt
```

عناوين Docker الداخلية مثل `http://medusa-backend:9000` و`http://minio:9000` لا توضع في روابط المتصفح. Compose تضبطها للخدمات داخليًا. لا تغير `POSTGRES_PASSWORD` أو أسرار S3 في نقل قاعدة قائمة دون تنفيذ تدوير حقيقي والتحقق منه.

### صور المنتجات العامة

في هذه النسخة يُسجّل Medusa مزود Local File الافتراضي، وعنوانه الافتراضي `http://localhost:9000/static`. **تغيير متغيرات البيئة وحده لا يغير هذا المزود**. [Medusa توصي بمزود S3 للإنتاج](https://docs.medusajs.com/resources/infrastructure-modules/file/local).

للنشر العام، جهز حاوية صور مستقلة مثل `publishing-public-images`، ومفتاحًا محدود الصلاحيات عليها، ثم أضف **مزود File واحدًا** إلى `modules` في `apps/backend/medusa-config.ts` وفق [إعداد S3 الرسمي](https://docs.medusajs.com/resources/infrastructure-modules/file/s3):

```ts
{
  resolve: "@medusajs/medusa/file",
  options: {
    providers: [{
      resolve: "@medusajs/medusa/file-s3",
      id: "s3",
      options: {
        file_url: process.env.PUBLIC_S3_FILE_URL,
        access_key_id: process.env.PUBLIC_S3_ACCESS_KEY,
        secret_access_key: process.env.PUBLIC_S3_SECRET_KEY,
        region: process.env.PUBLIC_S3_REGION || "us-east-1",
        bucket: process.env.PUBLIC_S3_BUCKET,
        endpoint: process.env.PUBLIC_S3_ENDPOINT,
        additional_client_config: { forcePathStyle: true },
      },
    }],
  },
},
```

هذا تعديل مطلوب على الوجهة أو في برانش نشر؛ **المثال ليس مفعّلًا في الكود افتراضيًا**. مكتبة المزود موجودة في الاعتماديات الحالية. في `.env` عرّف `PUBLIC_S3_BUCKET=publishing-public-images` و`PUBLIC_S3_FILE_URL=https://media.example.com/publishing-public-images` و`PUBLIC_S3_ENDPOINT=http://minio:9000` وبقية قيم `PUBLIC_S3_*` بمفاتيح التخزين الفعلية. اضبط سياسات الحاوية والـACL حسب مزود S3 واختبر رفع غلاف فعلي. إن استخدمت مزودًا خارجيًا، استخدم endpoint وURL ذلك المزود وأضف نطاقه إلى `NEXT_PUBLIC_MEDIA_ORIGINS`.

لا تجعل `publishing-private-media` عامة. مزود الصور العام مختلف عن نظام الكتب الخاص. تهيئة المشروع تنشئ الحاوية الخاصة فقط؛ أنشئ حاوية الصور وسياساتها بصورة مستقلة. تبديل المزود لا ينقل صورًا قديمة تلقائيًا: انقل أصولها وحدّث روابط المنتجات المحصورة بعد نسخة احتياطية، أو أبقِ ملفات `/static` القديمة مع خدمة عناوينها الصحيحة. لا ترفع كتبًا خاصة إلى مزود الصور.

### HTTPS والـproxy

من جذر المشروع، انسخ قالب Nginx إلى `docker/gateway.https.conf`:

```bash
cp docs/examples/gateway.https.conf docker/gateway.https.conf
```

أو PowerShell: `Copy-Item docs/examples/gateway.https.conf docker/gateway.https.conf`.

استبدل النطاقات ومسار الشهادة في النسخة. القالب يجعل gateway نفسها تنهي TLS، ويحافظ على `Host` وتوقيع S3 ويعيد كتابة عنوان العميل وترويسة البروتوكول، ويضبط CORS للقراءة من الوسائط للنطاقين المحددين. هذا يتجنب فقد جلسة Medusa الآمنة بسبب تمرير `http` خلف proxy إضافي. إذا لديك reverse proxy/CDN آخر، عدل سلسلة الثقة عمدًا؛ لا تقبل `X-Forwarded-*` من أي عميل.

```text
docker compose -f docker-compose.yml -f docs/examples/compose.https.example.yaml config --quiet
docker compose -f docker-compose.yml -f docs/examples/compose.https.example.yaml build medusa-backend
docker compose -f docker-compose.yml -f docs/examples/compose.https.example.yaml build medusa-storefront
docker compose -f docker-compose.yml -f docs/examples/compose.https.example.yaml up -d
docker compose -f docker-compose.yml -f docs/examples/compose.https.example.yaml exec -T gateway nginx -t
docker compose -f docker-compose.yml -f docs/examples/compose.https.example.yaml ps --all
```

استخدم **الملفين معًا في كل أوامر up/restart/config على هذا النشر**. استخدام base وحده يعيد منافذ HTTP المحلية. القالب يستبدل منافذ gateway بـ80 و443؛ قواعد البيانات وRedis والتخزين الإداري وMailpit تبقى loopback. على الجدار الناري اسمح بـ80/443 وSSH حسب سياسة الخادم، وراجع المنافذ المنشورة من Docker نفسه. لا تعرض 5432 أو6379 أو9001 أو8025 للعامة.

القالب لا يصدر شهادة ولا يجددها بنفسه. جهز تجديد الشهادة خارج الحاوية، ثم شغّل `nginx -t` و`nginx -s reload` عبر أمر Compose ذي الملفين بعد التجديد. راجع [توثيق TLS في Nginx](https://nginx.org/en/docs/http/ngx_http_ssl_module.html).

للبريد الحقيقي عرّف `SMTP_HOST/PORT/SECURE/USER/PASSWORD/FROM` و`MAIL_DELIVERY_MODE=external` في بيئة الوجهة، واختبر رسالة إلى بريد تملكه. بيئة الاختبار تستخدم `MAIL_DELIVERY_MODE=local` وMailpit؛ لا توجه اختبارات الرسائل إلى عملاء حقيقيين.

## 7. نقل البيانات الحالية

يتطلب النقل نافذة توقف قصيرة للمصدر لمنع اختلاف قاعدة البيانات عن الوسائط والـqueues. الأمثلة هنا لـBash على المصدر والوجهة؛ على Windows استخدم WSL أو أدوات النسخ الثنائية المكافئة. خصوصًا لا تستخدم إعادة توجيه dump ثنائي عبر Windows PowerShell القديم؛ استخدم `docker compose cp` كما يلي.

### المصدر: إيقاف الكتابة والتصدير

```bash
mkdir -p scratch/transfer
docker compose stop gateway medusa-storefront medusa-backend
docker compose exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom -f /tmp/storyverse-transfer.dump'
docker compose cp postgres:/tmp/storyverse-transfer.dump ./scratch/transfer/database.dump
docker compose stop minio redis
```

تحقق من نجاح كل أمر قبل التالي، ولا تكمل لو فشل dump. إن كان المصدر يعمل بقالب HTTPS، استخدم معاملي `-f` معه أيضًا. احتفظ بإعدادات البيئة في قناة نقل خاصة مشفرة، ولا تضعها في Git أو تقرير عام.

انسخ الـvolumes المتوقفة. المثال يستخدم صورة الخلفية المبنية بالفعل كأداة tar؛ لا يغير ملفات المصدر:

```bash
docker run --rm --user 0:0 --entrypoint tar --mount type=volume,source=publishing_storage_data,target=/data,readonly --mount "type=bind,source=$PWD/scratch/transfer,target=/backup" storyverse-backend:local -czf /backup/storage.tar.gz -C /data .
docker run --rm --user 0:0 --entrypoint tar --mount type=volume,source=medusa_uploads_data,target=/data,readonly --mount "type=bind,source=$PWD/scratch/transfer,target=/backup" storyverse-backend:local -czf /backup/public-uploads.tar.gz -C /data .
docker run --rm --user 0:0 --entrypoint tar --mount type=volume,source=medusa_redis_data,target=/data,readonly --mount "type=bind,source=$PWD/scratch/transfer,target=/backup" storyverse-backend:local -czf /backup/redis.tar.gz -C /data .
sha256sum scratch/transfer/database.dump scratch/transfer/storage.tar.gz scratch/transfer/public-uploads.tar.gz scratch/transfer/redis.tar.gz > scratch/transfer/SHA256SUMS
```

أسماء الـvolumes أعلاه تخص إعداد المستودع الحالي؛ تحقق من `docker volume inspect` على المصدر. لو استُخدم S3 خارجي فانسخ من المزود نفسه؛ archive التخزين المحلي لن يحتوي على ملفات مزود خارجي. Mailpit اختياري للتجربة ولا يلزم لنقل متجر عام. في مصدر حي لا تطبع أو تعِد إرسال الرسائل/المهام المعلقة أثناء الفحص.

انقل `scratch/transfer` بأداة آمنة مثل SCP/SFTP، وافحص SHA256 على الوجهة مع مراعاة المسارات النسبية المكتوبة في الملف. لأرشيف من جهة أخرى افحص أسماء عناصره قبل الاستخراج ولا تستخرج مسارات مطلقة أو `../`.

إذا أعدت فتح المصدر بعد التصدير، ستتغير بياناته؛ أنشئ تصديرًا نهائيًا جديدًا عند القطع. لا تشغل backend المصدر والوجهة معًا على نفس قاعدة البيانات وRedis أثناء النقل.

### الوجهة: الاستعادة قبل أول تشغيل للتطبيق

استنسخ نفس إصدار الكود، وانقل `.env` بشكل خاص وعدل عناوين الوجهة. ابنِ الصورتين كما في القسم 4، لكن **لا تشغل backend أو minio أو redis قبل استعادة الـvolumes**. الخطوات التالية لوجهة فارغة فقط؛ لا تستخرج الأرشيف فوق volume مستخدمة ولا تستعد dump إلى قاعدة فيها بيانات.

```bash
docker volume create publishing_storage_data
docker volume create medusa_uploads_data
docker volume create medusa_redis_data
docker run --rm --user 0:0 --entrypoint tar --mount type=volume,source=publishing_storage_data,target=/data --mount "type=bind,source=$PWD/scratch/transfer,target=/backup,readonly" storyverse-backend:local -xzf /backup/storage.tar.gz -C /data
docker run --rm --user 0:0 --entrypoint tar --mount type=volume,source=medusa_uploads_data,target=/data --mount "type=bind,source=$PWD/scratch/transfer,target=/backup,readonly" storyverse-backend:local -xzf /backup/public-uploads.tar.gz -C /data
docker run --rm --user 0:0 --entrypoint tar --mount type=volume,source=medusa_redis_data,target=/data --mount "type=bind,source=$PWD/scratch/transfer,target=/backup,readonly" storyverse-backend:local -xzf /backup/redis.tar.gz -C /data
docker compose up -d postgres redis minio
docker compose cp ./scratch/transfer/database.dump postgres:/tmp/storyverse-transfer.dump
docker compose exec -T postgres sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner --no-privileges --exit-on-error /tmp/storyverse-transfer.dump'
```

انتظر PostgreSQL healthy قبل `pg_restore`. بعد نجاح الاستعادة، شغّل `up -d` بالإعداد الموافق لنوع الوجهة؛ تنفذ الترحيلات الآمنة بعد استعادة القاعدة. لا تعِد إنشاء المسؤول والمفتاح والمنتجات إذا كانت موجودة في dump. إذا قررت بدء Redis فارغة عمدًا، لا تستعد `redis.tar.gz`؛ وثّق فقد الجلسات ومراجعة الـqueues وإعادة تسجيل الدخول.

عند تغيير النطاق، روابط الصور المخزنة قد تشير إلى `localhost` أو النطاق السابق، ورفع مزود صور جديد لا يصلحها تلقائيًا. صدّر قائمة الروابط المعنية، ثم حدّث الحقول المطلوبة فقط عبر Medusa أو أداة ترحيل محددة مع نسخة احتياطية. لا تستخدم استبدالًا شاملًا عشوائيًا لكل نصوص القاعدة. مفاتيح S3 الخاصة تبقى كما هي وتولد لها روابط موقعة بالعنوان العام الجديد.

## 8. التحقق والتحديث والرجوع

على جهاز/VM staging مستقلة، وبإعداد localhost وMailpit ومستخدم اختبار، اتبع أوامر [OPERATIONS.md](../OPERATIONS.md). ابنِ صورة الخلفية أولًا ثم صورة `tests` لأنها تنسخ اعتماديات الخلفية. تحقق من المفتاح وقناة البيع والمنطقة قبل اختبار السلة. لا تشغل restart/fresh-database/اختبارات الكتابة فوق خدمة عملاء نشطة.

الاختبارات الحالية تستخدم جسور localhost وOrigin محليًا، وبعض مسارات المتصفح ثابتة؛ **ليست جاهزة كما هي لاختبار نشر HTTPS**. لا تعالج فشلها على إعداد HTTPS بإضعاف Secure cookies أو Origin. استخدم staging المحلية للجولة الكاملة، وافحص النشر الحقيقي بعناوينه وبمتصفح أو عدل حزمة اختبار منفصلة لتستخدم تلك العناوين.

على الوجهة الفعلية تحقق من:

- الخدمات السبع healthy وخدمتي التهيئة exited برمز 0، وعدم وجود أخطاء اتصال متكررة في logs.
- فتح المتجر بالعربية والإنجليزية، وعدم وجود تجاوز عرض أو روابط منصات خاطئة، وظهور الكتاب المنشور من الإدارة بنصه الصحيح.
- دخول Medusa ثم إعادة تحميل صفحة المنتجات والمخزون؛ بقاء الجلسة وSecure/HttpOnly على HTTPS، والخروج يعيد طلب الحساب إلى 401.
- رفع غلاف جديد وظهوره في المتجر من نطاق HTTPS الصحيح، وفتح الصور المنقولة القديمة.
- رفع PDF تجريبي خاص، والوصول المجهول المباشر 403، والرابط الموقع صالح لمدة قصيرة، وطلب Range يعمل؛ لا تسجل الرابط الموقع كاملًا في تقرير عام.
- السلة تعرض SAR والأسعار الفعلية، والنسخة النافدة لا تُشترى. إنشاء تذكرة دعم والرد عليها يظهران للحساب الصحيح.
- تجربة بريد استعادة لحساب اختبار، وبقاء الدفع مغلقًا.
- وجود نسخة خارج السيرفر تشمل PostgreSQL والوسائط وخطة استعادة. مصادقة S3/CORS وسياسات الشبكة تُثبت بالاختبار على المزود الفعلي، لا بمجرد صحة ملف YAML.

للترقية: سجل commit المنشور وimage IDs، وخذ نسخة من القاعدة والوسائط والإعدادات، ثم نفذ fetch/checkout للإصدار المطلوب وابنِ وشغّل بالملفات نفسها. لا تستخدم `git reset --hard` على تعديلات غير محفوظة. للرجوع، شغّل الصور السابقة فقط إذا كانت schema متوافقة؛ لو تغيرت ترحيلات البيانات فارجع لنسخة متسقة من القاعدة والوسائط أيضًا. تبديل commit وحده ليس rollback مضمونًا للبيانات.

لا تستخدم `docker compose down -v` أو `docker volume prune` أو أدوات demo-reset كإصلاح للتشغيل. لا ترفع dumps أو archives أو شهادات أو أسرارًا إلى المستودع. إذا نقص DNS أو الوصول أو الملفات، اذكر الجزء الناقص بدقة؛ لا تصف البيئة بأنها منشورة أو جاهزة ماليًا.

## حدود هذا الدليل

قوالب HTTPS أمثلة قابلة للتعديل، وليست شهادة نشر على سيرفر المستخدم. فُحص دمج Compose وصحة بناء إعداد Nginx محليًا؛ إصدار شهادات عامة وDNS وSMTP ونقل البيانات بين جهازين فعليين يتطلب تنفيذًا على الوجهة. نتائج فحص التطبيق السابق في [PRODUCTION_READINESS_REPORT.md](../PRODUCTION_READINESS_REPORT.md).
