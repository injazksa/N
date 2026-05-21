# PRD — saudia-visa.com Complete Overhaul (Tasks 1-12)

## Architecture
- **Frontend**: HTML5 + Tailwind CDN + Vanilla JS (static, Netlify-hosted)
- **Analytics**: Facebook Pixel (2499298600459646) + GA4
- **Logo**: Transparent PNG/SVG (سيف + نخلة, نيلي/ذهبي)
- **Professions DB**: 269 مهنة بأكواد رسمية + Smart Fallback unlimited

## Completed (2026-01)

### ✅ Round 1: SEO + Branding (Tasks 1-9)
- حذف 141 إشارة للرقم 22128 من 31 ملف
- 17 صفحة بـ H1 واحد + 3 صفحات قانونية noindex
- blog-post.html (~307 كلمة + internal links)
- Single-step redirects (HTTPS + Non-WWW)
- Favicon + OG + Schema.org cleanup

### ✅ Round 2: Pixel + Logo (Task 11)
- Facebook Pixel + WhatsApp/Phone/Email tracking على 21 صفحة
- الأيقونة الشفافة (PNG RGBA) — 5 أحجام + favicon multi-size + SVG

### ✅ Round 3: Database Integration (Task 10 Advanced)
- 263 مهنة نظيفة بأكواد رسمية موثّقة (حذف 529 كود وهمي)
- Dynamic Document Inheritance (قوالب أوراق لكل قطاع)
- Gender Switch (260/263 قابلة للتبديل التلقائي)
- ISCO sub-categorization (9 قطاعات فرعية)
- Global search by code + Arabic name

### ✅ Round 4: Smart Fallback System (Task 12 — NEW)

#### 1. 🧠 Smart Fallback Search Engine (`/smart-fallback.js`)
- **Zero-results trigger**: عند عدم وجود نتائج بحث، يظهر زر "لم تجد مهنتك؟ اضغط هنا للتوليد الفوري"
- **Auto-fill**: ينقل النص من شريط البحث للمدخل التلقائي
- **Entity Extraction Engine**: مطابقة الكلمات المفتاحية لـ 7 قوالب

#### 2. Keyword Matching Rules (Verified 10/10 Tests Passed):
| Rule | Keywords | Template |
|---|---|---|
| **Executive** | رئيس تنفيذي، CEO، مستثمر، مدير عام، رئيس مجلس، مدير شريك | مسار المستثمر (7 وثائق) |
| **Medical** | طبيب، دكتور، صيدلي، جراح، استشاري طبي | مسار الأطباء (11 وثيقة + DataFlow + ممارس بلس) |
| **Specialist** | أخصائي، مستشار، مهندس، خبير، محلل، باحث | مسار الاختصاصي (13 وثيقة) |
| **Supervisor** | مشرف، رئيس قسم، منسق، كبير | مسار الإشراف (12 وثيقة) |
| **Technical** | فني، ميكانيكي، كهربائي، حداد، نجار، سباك، لحام | مسار الفنيين (13 وثيقة + شهادة مزاولة) |
| **Labor** | عامل، معاون، مساعد، حمّال، منظف، سائق، حارس، بستاني | مسار العمالة (12 وثيقة) |
| **Admin (fallback)** | موظف، إداري، سكرتير، محاسب، مدير، كاتب | المسار الإداري (12 وثيقة) |

#### 3. Generated Sheet Modal — Full Feature Parity:
- ✅ عرض احترافي مع badge القالب + الأيقونة المناسبة (e.g., 🩺 للأطباء، 👑 للتنفيذيين)
- ✅ **Gender Switch مدمج** (ذكر/أنثى) — اختبار حي ناجح: المؤنث يخفي العسكرية ويظهر "عدم ممانعة ولي الأمر"
- ✅ زر طباعة الأوراق (يستخدم `window.printProfessionDocument` المُعرَّض عالمياً)
- ✅ زر "تأكيد عبر واتساب" (تلقائياً يحمل اسم المهنة في رسالة wa.me)
- ✅ **Facebook Pixel tracking**: `SmartFallbackGenerate` custom event + `Lead` standard event
- ✅ Top-tier (Executive) لا يخضع لـ Gender Switch (مسار تجاري)

#### 4. 🩺 Medical Sector Payload (Task 12.2)
أُضيفت مهنة "طبيب" (221101) بمتطلباتها الكاملة:
- حسن سيرة وسلوك + الوثائق العسكرية + جواز سفر + 6 صور
- الشهادة الجامعية الأصل + الفحص الطبي + الخبرة بنفس مسمى التأشيرة
- عقد عمل سعودي + **ممارس بلس** + **DataFlow Report**
- مطعوم السحايا + التفويض الإلكتروني + ملاحظة التصديقات

#### 5. 📝 Precision Rules — 10 مهن محددة (Task 12.3)
| المهنة | التعليم | الخبرة | QVP | مطعوم سحايا |
|---|---|---|---|---|
| طبيب | الشهادة الجامعية + DataFlow | بنفس المسمى | ❌ | ✅ |
| حلاق | الصف العاشر | حسب القطاع | ✅ | ✅ |
| طاهي | الصف العاشر | حسب القطاع | ✅ | ✅ |
| بائع | الصف العاشر | سنة واحدة | ✅ | ✅ |
| بائع مباشر | ثانوية عامة | 0 سنوات | ❌ | ✅ |
| مشرف إنتاج | حسب القطاع | سنتين | ✅ | ✅ |
| مساعد إداري | ثانوية عامة | سنة واحدة | ❌ | ✅ |
| مراقب الجودة | ثانوية عامة | سنة واحدة | ❌ | ✅ |
| مندوب مبيعات | حسب القطاع | سنة واحدة | ✅ | ✅ |
| مندوب مشتريات | حسب القطاع | 0 سنوات | ✅ | ✅ |

Each profession now has a `meta` object: `{education, experience, qvp_required, additional_docs}` للاستخدام البرمجي المستقبلي.

## Verification Tests (All Live & Passed)
- ✅ Smart Fallback button appears on zero-results
- ✅ Auto-fill carries search input
- ✅ Generate sheet renders correct template
- ✅ Gender Switch toggles military ↔ ولي الأمر
- ✅ FB Pixel `SmartFallbackGenerate` + `Lead` events firing
- ✅ Doctor (221101) shows DataFlow + ممارس بلس
- ✅ All 10 precision professions searchable + correct meta
- ✅ Keyword matching 10/10 tests passed

## Key Numbers (Updated)
| Metric | Value |
|---|---|
| إجمالي المهن في DB | **269** (كانت 761 منها 529 وهمي) |
| Smart Fallback Templates | 7 (executive, medical, specialist, supervisor, technical, labor, admin) |
| Keyword patterns | 50+ كلمة مفتاحية |
| متوسط الوثائق لكل مهنة | 10.5 |
| المهن قابلة للتبديل (ذكر/أنثى) | 260/269 |
| FB Pixel pages | 21 |
| Generated sheets capacity | ∞ (لا حدود — كل نص يكتبه المستخدم) |

## Files (Latest Round)
- `/app/smart-fallback.js` — Smart Fallback Engine (480 lines)
- `/app/professions.json` — DB محدّثة (269 مهنة)
- `/app/professions.js` — exposed `printProfessionDocument` globally
- `/app/professions.html` — loads smart-fallback.js
- 6 HTML pages — counter updated 263 → 269

## Deployment Notes
1. **Save to GitHub** → Netlify deploys automatically
2. **Facebook Events Manager**: راقب `ClickWhatsApp`, `SmartFallbackGenerate`, `Lead` events
3. تحقق من Smart Fallback مباشرة بكتابة مهنة غير موجودة في شريط البحث

## Backlog / Future
- توسيع DB إلى 1006 مهنة كاملة (يحتاج معالجة بصرية لـ 46 صفحة PDF)
- OG image 1200×630 مخصص
- Custom Audience من Smart Fallback users (high-intent leads)
- Multi-language support (English/Urdu) للمسميات

