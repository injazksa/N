# PRD — saudia-visa.com Complete Overhaul (Tasks 1-11 + Integration Round)

## Original Problem Statement
موقع HTML/CSS/JS ثابت لمكتب تأشيرات السعودية في الأردن (Netlify-hosted).
3 جولات تحسينات: SEO/Branding + قاعدة بيانات المهن + التكامل البرمجي مع الأنظمة الحالية.

## Architecture
- **Frontend**: HTML5 / Tailwind CDN / Vanilla JS (static)
- **Hosting**: Netlify
- **Analytics**: Facebook Pixel (2499298600459646) + GA4 (G-4B2WJZ75XG)
- **Logo**: Transparent PNG/SVG (السيف والنخلة - نيلي/ذهبي)

## Completed (2026-01)

### ✅ Round 1: Tasks 1-9 (SEO + Branding)
- حذف 141 إشارة لرقم 22128 + إعادة تسمية admin folder
- 17 صفحة بـ H1 واحد + 3 صفحات قانونية noindex
- blog-post.html غني (307 كلمة) + internal links
- Single-step redirects (HTTPS + Non-WWW)
- Favicon + OG + Schema.org cleanup

### ✅ Round 2: Tasks 10-11 (Pixel + Logo + Database)
- Facebook Pixel + WhatsApp/Phone/Email tracking على 21 صفحة
- الأيقونة الجديدة بخلفية شفافة (PNG RGBA) — 5 أحجام + favicon.ico + favicon.svg
- حذف 529 كود وهمي → 263 مهنة بأكواد رسمية موثقة

### ✅ Round 3: Integration with Existing Systems (Latest)

#### 1. Dynamic Document Inheritance (وراثة الأوراق المطلوبة)
- بُني نظام **Category Templates** لكل قطاع له template أوراق كامل (10-12 وثيقة)
- المهن الجديدة (عامل تعبئة، مدير عام، مندوب مبيعات إلخ) ترث أوراق قطاعها تلقائياً
- 3 مهن top-tier (CEO/General Manager/مستثمر) لها مسار "السجل التجاري + هيئة الاستثمار" بدلاً من العسكرية
- Top tier = 3 مهنة، Standard tracks = 260 مهنة
- متوسط 10.2 وثيقة لكل مهنة

#### 2. Gender Switch (تبديل ذكر/أنثى)
- جميع المهن مخزنة بصيغة canonical "ذكر" (مع الوثائق العسكرية)
- 260/263 مهنة لديها "الوثائق العسكرية" — قابلة للتبديل التلقائي
- عند اختيار "أنثى" في الفلتر، الـ JS يبدّل ديناميكياً إلى "عدم ممانعة من ولي الأمر"
- **اختبار حي ناجح**: تأكدنا من التبديل يعمل على عامل إنتاج (932101)

#### 3. Global Search Integration
- البحث يعمل بالكود (مثل 932101) → 1 نتيجة فورية
- البحث بالاسم العربي (مثل "مدير عام") → 2 نتيجة
- البحث المختلط مدعوم (normalizeArabic للهمزات والياء)

#### 4. Counter Synchronization
- العدّاد محدّث من **761+ → 263+** في 6 صفحات (index, about, professions, corporate, faq, work-visa)
- العدد يعكس الواقع الفعلي للمهن المحققة بأكواد رسمية

#### 5. Sub-Categorization (ISCO Standard)
- 9 قطاعات فرعية ديناميكية بناءً على prefix الكود (11/12/13/14/...)
- توزيع متنوع: 146 مدراء إنتاج، 63 مدراء إداريون، 13 عمالة تشغيلية، 12 فنادق/مطاعم، 9 كبار مسؤولين، 8 فني/حرفي، 7 إداري/تجاري، 3 مبيعات

## Verification (Live Tests Passed)
- ✅ Screenshot: عامل إنتاج (932101) → 11 وثيقة كاملة + الأيقونة الجديدة + الفئة "قطاع العمالة التشغيلية"
- ✅ Gender switch: ذكر → أنثى → الوثائق العسكرية اختفت، عدم ممانعة ولي الأمر ظهرت
- ✅ Search by code: 932101 → 1 نتيجة
- ✅ Search by name: "مدير عام" → 2 نتيجة
- ✅ Facebook Pixel: WhatsApp click → fbq events fired (ClickWhatsApp + Lead)

## Key Numbers
| Metric | Value |
|---|---|
| إجمالي المهن | 263 (كانت 761، منها 529 كود وهمي) |
| المهن بأكواد PDF رسمية | 232 |
| المهن المضافة بطلب صريح | 31 |
| متوسط الوثائق لكل مهنة | 10.2 |
| المهن قابلة للتبديل (ذكر/أنثى) | 260/263 |
| مسار المستثمر (Top-Tier exempt) | 3 |
| القطاعات الفرعية | 9 |
| كلمات "عامل" مجردة | 0 |
| Facebook Pixel pages | 21 |

## Future Backlog
- **توسيع قاعدة البيانات**: إضافة باقي 770 مهنة من القاموس الرسمي (1006 إجمالي) — تحتاج معالجة 46 صفحة PDF
- **OG image 1200×630** للمشاركة الاحترافية
- **Apple touch icon 180×180** مخصص (حالياً يعيد استخدام logo-180)
- استبدال `REPLACE_WITH_GSC_CODE` بكود Search Console
- **Custom Audience** على Meta Ads من زوار wa.me click للـ Retargeting

## Files Modified This Round
- `/app/professions.json` — قاعدة بيانات نظيفة (263 مهنة)
- `/app/marketing-pixel.js` — Facebook Pixel + Click Tracking
- `/app/icons/logo-*.png`, `/app/favicon.*` — أصول الشعار الشفاف
- `/app/_headers` — CSP محدّث للسماح بـ Facebook resources
- 23 HTML files — Pixel injection + counter update + favicon links

