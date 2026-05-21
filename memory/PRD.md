# PRD — saudia-visa.com SEO & Branding Overhaul

## Original Problem Statement
موقع HTML/CSS/JS ثابت لمكتب تأشيرات السعودية في الأردن (Netlify-hosted).
المطلوب: تنفيذ تقرير تقني شامل (11 مهمة) لتحسين SEO، حذف رقم الترخيص 22128 كاملاً، تنظيف قاعدة المهن من الأكواد الوهمية، تركيب الأيقونة الرسمية الجديدة بخلفية شفافة، وتفعيل Facebook Pixel + WhatsApp tracking.

## Architecture / Tech Stack
- **Frontend**: HTML5 / Tailwind CDN / Vanilla JS (موقع ثابت بدون build)
- **Hosting**: Netlify (`netlify.toml` + `_redirects` + `_headers`)
- **CMS**: Netlify CMS لمدونة الـ blog (في `/admin-secure/`)
- **Schema**: JSON-LD via `schema-markup.js`
- **Analytics**: Facebook Pixel (ID: 2499298600459646) + Google Analytics (G-4B2WJZ75XG)

## Completed (2026-01)

### ✅ Tasks 1-9 (Round 1: SEO + Branding cleanup)
- **حذف 141 إشارة لرقم 22128** من 31 ملف + إعادة تسمية `admin-sv22128/` → `admin-secure/`
- **17 صفحة** تم إصلاحها لتحتوي على H1 واحد فقط
- **3 صفحات قانونية** أصبحت `noindex, nofollow` + حُذفت من sitemap
- **blog-post.html** أُعيد بناؤها بمحتوى ثري (~307 كلمة) + internal link من footer
- **Single-step redirect chain** في `_redirects` و `netlify.toml` (HTTPS + Non-WWW)
- **Favicon + OG image dimensions** أُضيفت لـ 20+ صفحة
- **Schema.org** نُظِّف بالكامل (حذف hasCredential)
- **Meta descriptions** المطلوبة محدّثة

### ✅ Task 10: تنظيف قاعدة المهن (Round 2)
- **حذف 529 كود وهمي** من `professions.json` (كانت بصيغ ADD1094, 124600, 999001 إلخ — كلها غير موجودة في القاموس الرسمي)
- **263 مهنة نهائية** بأكواد رسمية صحيحة:
  - 232 مهنة من القاموس الرسمي (ISCO/SCO 6-digit codes) موجودة في PDF
  - 31 مهنة مضافة بالأكواد المحددة في رسالة المستخدم (300003, 932101-104, 933101-104, 332201/301, 242203/211 إلخ)
- **0 كلمات "عامل" مجردة** — كلها استُبدلت بمسميات تفصيلية (عامل إنتاج ومصنع، عامل تعبئة رفوف، عامل شحن وتفريغ إلخ)
- **5 قطاعات منظمة**: المديرون، القطاع الإداري والتجاري والمالي، قطاع المبيعات والتسويق، قطاع العمالة التشغيلية والتعبئة، القطاع الفني والحرفي

### ✅ Task 11.1: Facebook Pixel + WhatsApp Tracking
- **Pixel ID**: 2499298600459646 (مفعّل في 21 صفحة)
- **ملف**: `/marketing-pixel.js` يحتوي على:
  - Base Pixel code (PageView auto)
  - `ClickWhatsApp` custom event على جميع روابط `wa.me`
  - `ClickPhone` custom event على روابط `tel:`
  - `ClickEmail` custom event على روابط `mailto:`
  - `Lead` standard event عند نقر WhatsApp أو Phone
  - `Contact` standard event عند نقر Email
- **MutationObserver** يتابع DOM للارتباطات الديناميكية (مهم لصفحة المهن)
- **noscript fallback**: `<img>` pixel لمن لديهم JavaScript معطل
- **CSP محدّث** في `_headers` للسماح بـ `connect.facebook.net` و `facebook.com/tr`

### ✅ Task 11.2: Transparent Logo Assets
- **الأيقونة الجديدة** (السيف والنخلة - نيلي وذهبي) معالجة من JPG → PNG بخلفية شفافة
- **5 أحجام** مُولّدة من الـ source: 512×512، 192×192، 180×180 (apple-touch-icon)، 32×32، 16×16
- **favicon.ico** متعدد الأحجام (16، 32، 48، 64)
- **favicon.svg** أُعيد رسمها لتطابق التصميم الدائري الجديد
- جميع الأصول وضعت في `/icons/` و الجذر، مفعّلة عبر `<link>` tags في كل الصفحات

## Verification Results
- ✅ Screenshot: index.html — أيقونة جديدة + H1 واحد + 0 ذكر لـ 22128
- ✅ Screenshot: blog-post.html — H1 صحيح + محتوى 307 كلمة
- ✅ Screenshot: professions.html — 263 مهنة + كلها بأكواد صحيحة (112001، 112002 إلخ)
- ✅ Live test: WhatsApp click → fbq trigger verified:
  - `trackCustom('ClickWhatsApp', {...})` fired ✅
  - `track('Lead', { content_name: 'WhatsApp Contact' })` fired ✅
- ✅ 0 references لـ "22128" في أي ملف
- ✅ logo-512.png mode=RGBA (transparent confirmed)

## Files Modified Summary
- HTML pages: 23 ملف (Pixel + favicon + canonical + noindex)
- Logo assets: 6 ملفات (logo-192.png, logo-512.png, apple-touch-icon.png, favicon.ico, favicon-32x32.png, favicon.svg)
- New files: `marketing-pixel.js`, `professions.json` (rebuilt clean)
- Configs: `_headers` (CSP), `_redirects`, `netlify.toml`, `sitemap.xml`, `robots.txt`

## Deployment Notes
- الموقع جاهز للنشر مباشرة على Netlify
- بعد النشر: التحقق من فيسبوك Events Manager لظهور أحداث `PageView`, `ClickWhatsApp`, `Lead`
- إعادة تقديم Sitemap في GSC
- اختبار Rich Results

## Backlog / P1 (Future)
- إضافة باقي 770 مهنة من القاموس الرسمي (تحتاج ترجمة الأسماء العربية يدوياً من PDF)
- إنشاء `og-image.png` بحجم 1200×630 احترافي للمشاركة على Facebook/WhatsApp
- استبدال `REPLACE_WITH_GSC_CODE` بكود Google Search Console الحقيقي
- اختبار A/B لرسالة WhatsApp الافتراضية لزيادة معدل التحويل

## Marketing Numbers Reality Check
- العداد المعروض في الموقع: "761+ مهنة" (تسويقي)
- العدد الفعلي بعد التنظيف: 263 مهنة بأكواد موثقة 100%
- القاموس الرسمي الكامل: 1006 مهنة (يمكن الوصول إليها مستقبلاً)
- **توصية**: استبدال "761+ مهنة" بـ "+250 مهنة بأكواد موثقة" أو "+1000 مهنة في القاموس الرسمي" حسب التفضيل التسويقي
