# PRD — saudia-visa.com SEO & Branding Overhaul

## Original Problem Statement
موقع HTML/CSS/JS ثابت لمكتب تأشيرات السعودية في الأردن (Netlify-hosted).
المطلوب: تنفيذ تقرير تقني شامل (9 مهام) لتحسين SEO، حذف رقم الترخيص 22128 كاملاً (نزاع ملكية فكرية)، تنظيف الهوية البصرية والقانونية، وضبط بنية الصفحات للزحف الصحيح.

## Architecture / Tech Stack
- **Frontend**: HTML5 / Tailwind CDN / Vanilla JS (موقع ثابت بدون build)
- **Hosting**: Netlify (تكوين عبر `netlify.toml` + `_redirects`)
- **CMS**: Netlify CMS لمدونة الـ blog (في `/admin-secure/`)
- **Schema**: JSON-LD via `schema-markup.js` + inline scripts
- **Language**: عربي RTL أولي + إنجليزي ثانوي

## Completed (2026-01)
### ✅ Task 1: حذف 22128 + تعديل الهوية
- **141 إشارة لرقم 22128 حُذفت** من 31 ملف (HTML/JS/JSON/TXT/XML/YML)
- إعادة تسمية `admin-sv22128/` → `admin-secure/`
- تحديث `robots.txt` و `_redirects` و `netlify.toml` لتعكس المسار الجديد
- تنظيف جميع العبارات المركبة (— ترخيص 22128, ترخيص رقم 22128 إلخ) لإبقاء اللغة سليمة

### ✅ Task 2: noindex للصفحات القانونية
- `privacy.html`, `terms.html`, `disclaimer.html` ← أصبحت `<meta name="robots" content="noindex, nofollow">`
- حُذفت من `sitemap.xml`

### ✅ Task 3: Favicon & OG
- إضافة `<link rel="icon" type="image/x-icon" href="/favicon.ico">` لكل الصفحات (22/23)
- إضافة `og:image:type/width/height` على 20 صفحة
- الشعار الموجود في `/icons/logo-512.png` + `/favicon.ico` + `/favicon.svg` مفعّل

### ✅ Task 4: index.html Canonical
- متحقق: `<link rel="canonical" href="https://saudia-visa.com/">` (موجود + صحيح)
- لا يوجد noindex على الصفحة الرئيسية

### ✅ Task 5: Single-Step Redirect (HTTPS + Non-WWW)
- `_redirects`: 3 قواعد 301! force تحوّل `http://www`, `http://`, `https://www` مباشرة إلى `https://saudia-visa.com`
- `netlify.toml`: نفس القواعد كنسخة احتياطية

### ✅ Task 6: blog-post.html
- إعادة بنائها كصفحة ثابتة قابلة للأرشفة (~307 كلمة)
- H1 = "مكتب تأشيرات السعودية في الأردن"
- محتوى ثري: 4 خدمات أساسية + مواعيد + روابط داخلية لـ 5 صفحات
- يحتفظ بقدرته على عرض المقالات الديناميكية عند تمرير `?slug=` في URL
- internal link مضاف من footer الصفحة الرئيسية
- موجود في `sitemap.xml`

### ✅ Task 7: H1 واحد لكل صفحة
- **17 صفحة** تم إصلاحها (تحويل `<h1>` الصغير في logo header إلى `<span>`)
- كل صفحة الآن تحتوي على H1 وحيد للمحتوى الأساسي

### ✅ Task 8: Meta Descriptions
- `umrah-visa-guide-2026.html` ✅
- `family-sponsorship-guide.html` ✅
- `other-services.html` ✅
- `blog-post.html` ✅

### ✅ Task 9: Schema.org Validation
- جميع JSON-LD blocks valid (محقق برمجياً)
- حُذف `hasCredential` (لأنه كان يشير إلى ترخيص 22128)
- حُذفت `identifier` و `taxID` من Organization

## Verified
- Screenshot: index.html ← يعرض "مكتب تأشيرات السعودية في الأردن" بدون أي ذكر لـ 22128
- Screenshot: blog-post.html ← H1 صحيح + محتوى 307 كلمة
- Programmatic: 0 references لـ "22128" في أي ملف (HTML/JS/JSON/TXT/XML)
- Programmatic: H1 count = 1 لكل صفحة من 14 صفحة رئيسية

## Files Modified Summary
- HTML pages: 23 ملف
- JS: schema-markup.js, articles.js, core.js, إلخ
- Config: robots.txt, sitemap.xml, _redirects, netlify.toml, manifest.json
- Content JSON: content/seo.json, content/settings.json, content/services/*
- Admin CMS: admin-secure/config.yml, admin-secure/index.html

## Deployment Notes
- الموقع جاهز للنشر مباشرة على Netlify (لا حاجة لـ build)
- بعد النشر: التحقق من Google Search Console لإعادة فهرسة الصفحات الجديدة
- التحقق من إزالة الصفحات القانونية من Google Index (سيستجيب لـ noindex خلال 2-4 أسابيع)
- اختبار rich results: https://search.google.com/test/rich-results

## Backlog / P1 (Future)
- استبدال `REPLACE_WITH_GSC_CODE` بكود Google Search Console الحقيقي عند الإطلاق
- إضافة شعار رسمي جديد (إذا وفر العميل ملفاً مغايراً للحالي)
- إنشاء `apple-touch-icon.png` بحجم 180×180 منفصل (حالياً يستخدم logo-192.png)
- توليد `og-image.png` بحجم 1200×630 للمشاركة على Facebook/Twitter (حالياً يستخدم logo-512.png)
- محتوى أوسع للصفحات القصيرة مستقبلاً
