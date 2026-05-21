# PRD — saudia-visa.com Complete Overhaul (Tasks 1-12)

## Architecture
- **Frontend**: HTML5 + **Tailwind compiled locally (91KB)** + Vanilla JS (static, Netlify-hosted)
- **Analytics**: Facebook Pixel (2499298600459646) + GA4
- **Logo**: Transparent PNG/SVG (سيف + نخلة, نيلي/ذهبي)
- **Professions DB**: 273 مهنة بأكواد رسمية + Smart Fallback unlimited
- **Programmatic SEO**: 273 landing pages في `/p/` (واحدة لكل مهنة)

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

---

## ✅ Round 5: Phase 6 Performance + Bug Fixes (2026-02-21)

### 🐛 Critical Bug Fix — Smart Fallback Broken
**السبب الجذري**: أخطاء نحوية واسعة في JavaScript منعت تشغيل المودال:
- `schema-markup.js`: 3 دوال بدون أقواس (`function init {`, `function generateBreadcrumbs {`)
- `index.html`: 6 أخطاء (IIFE، `function gtag{`, `e.preventDefault;`, `| []` بدل `||`، `function {}`)
- `calculator.html`: 10 أخطاء (دوال بدون أقواس، arrow بدون args)
- `admin-secure/index.html`: 3 أخطاء (arrow handlers، load listener)

**الحل**: سكربت `fix_js_syntax.py` يصلّح 19 خطأ + إصلاح يدوي إضافي. **الآن: 0 أخطاء JS**

### ⚡ Phase 6: Speed Optimization (Done)
1. **Tailwind CDN → Compiled CSS**:
   - بناء `/app/css/tailwind.min.css` (91KB minified, JIT scanner للـ 296 صفحة)
   - حذف `<script src="cdn.tailwindcss.com">` من 296 صفحة HTML
   - تكوين مخصص `tailwind.config.js` مع safelist للكلاسات الديناميكية
   - **مكسب**: ~5MB JIT engine → 91KB cached CSS، صفر runtime overhead
2. **CSS Cascade Fix**: تحريك `tailwind.min.css` لآخر `<head>` (يطابق سلوك CDN) لمنع تجاوز `styles.css` لكلاسات Tailwind
3. **JS Defer**: إضافة `defer` لـ `script.js` و `professions.js` في `professions.html`
4. **DNS Cleanup**: حذف `dns-prefetch` للـ CDN المُلغى من 15 ملف

### Files Modified/Created
- ✏️ 296 ملف HTML (إزالة CDN، إضافة local CSS، إعادة ترتيب)
- ✏️ `/app/schema-markup.js` (إصلاح syntax)
- ✏️ `/app/professions.html` (defer scripts)
- ✏️ `/app/index.html`, `/app/calculator.html`, `/app/admin-secure/index.html` (syntax fixes)
- 🆕 `/app/css/tailwind.min.css` (91KB compiled)
- 🆕 `/app/css/tailwind-input.css`
- 🆕 `/app/tailwind.config.js`
- 🆕 `/app/scripts/replace_tailwind_cdn.py`
- 🆕 `/app/scripts/reorder_tailwind.py`
- 🆕 `/app/scripts/fix_js_syntax.py`

### Verification (2026-02-21)
- ✅ Homepage: navy gradient + visa BG + centered hero + stats grid
- ✅ `/professions.html`: Smart Fallback modal opens, all categories detected
- ✅ Driver test (`سائق خاص`) → renders driver track + license docs
- ✅ Medical test (`طبيب أسنان عام`) → renders medical track + DataFlow + ممارس بلس
- ✅ Gender switch toggles correctly
- ✅ Programmatic SEO page (`/p/رئيس-تنفيذي-112001.html`) renders perfectly
- ✅ Mobile (390×844): no overflow, proper stacking
- ✅ JS console: 0 errors across all pages

---

## ✅ Round 6: Universal Semantic Classifier v3.0 (2026-02-21)

### 🎯 Smart Fallback Upgrade — Rule-Based Taxonomy
ترقية كاملة من keyword matching بسيط إلى **مصنف دلالي شامل بـ 3 طبقات** مع longest-prefix matching و Universal Safe Fallback.

### Architecture
**5-Tier Mapping**:
| Tier | Templates | Purpose |
|---|---|---|
| `compliance` | medical, driver, domestic_female/male | Routes with regulator-specific docs (DataFlow, License, Domestic permit) |
| `management` | executive, specialist, admin | **Tier 1**: Academic & Upper Mgmt (أخصائي/مهندس/دكتور/مستشار/خبير/مدير/رئيس/محلل/نائب/CEO) |
| `supervisory` | supervisor, technical | **Tier 2**: Supervisory & Technical (مشرف/رئيس قسم/فني/ميكانيكي/كهربائي/مراقب) |
| `vocational` | labor | **Tier 3**: Vocational/Trade/Labor (عامل/مساعد/معاون/سائس/طاهي/حلاق/بائع/خياط/لحام) |
| `fallback` | **general** (NEW) | Universal Safe Fallback for unmatched inputs |

### Key Algorithm: Longest-Prefix Match
Instead of first-match wins, the classifier collects **ALL** keyword hits and selects the rule whose matched keyword is **longest**. This guarantees:
- `رئيس قسم المحاسبة` → Supervisor (Tier 2), NOT Specialist (Tier 1)
- `مدير عام` → Executive (compliance-like commercial track), NOT Specialist
- `نائب رئيس تنفيذي` → Executive (3-word), NOT Specialist (2-word `نائب رئيس`)
- `طبيب أسنان` → Medical, NOT Specialist
- `عامل منزلي` → Domestic Male, NOT Labor

### Universal Safe Fallback
أي مهنة غريبة (e.g., "رائد فضاء", "مدرّب يوغا", "دي جي") تذهب لـ **template `general`**:
- 9 وثائق أساسية: SECURITY, MILITARY, MEDICAL, VACCINE, CONTRACT, AUTH, PASSPORT, ATTEST + ملاحظة CTA واتساب
- يطبع العنوان بالضبط كما أدخله المستخدم في الـ header
- يدعم Gender Switch تلقائياً
- Badge: "المسار العام للتأشيرة"

### Regression Test Suite
- 📁 `/app/backend/tests/test_classifier.js`
- ✅ **43/43 mappings correct** (compliance/management/supervisory/vocational/fallback)
- Includes tricky cases: longest-prefix (رئيس قسم), Arabic normalization (أ/إ/آ → ا، ة → ه)

### Files Modified
- ✏️ `/app/smart-fallback.js` — Complete classifier refactor (RULES + matchTemplate + general template + TIER_LABELS)
- 🆕 `/app/backend/tests/test_classifier.js` — Headless regression suite

---

## ✅ Round 7: Engineering Sector Hotfix + Experience Overrides + UI Fixes (2026-02-21)

### 🏗️ Engineering Sector — Strict 11-Doc Production Payload
المهندسون كانوا يقعون على specialist track (ناقص JEA/SCE/مصادقة). الحين عندنا **template `engineer` مستقل** مع 11 وثيقة بالضبط:

1. حسن سيرة وسلوك (المخابرات)
2. الوثائق العسكرية + جواز + 6 صور
3. الشهادة الجامعية (الأصل) + كشف العلامات الأصل
4. فحص طبي معتمد
5. **خبرة لمدة سنتين بنفس مسمى التأشيرة**
6. عقد عمل + خطاب إطلاع مختومين
7. الاعتماد المهني
8. **شهادة من موقع مصادقة السعودي** ← جديد
9. **عضوية + مزاولة مهنة من نقابة المهندسين الأردنية** ← جديد
10. **التسجيل في هيئة المهندسين السعودية** ← جديد
11. عمل تفويض للمكتب

**Routing**: ترقّى لـ tier `compliance` ليتجاوز أي قاعدة technical (كان "صيانة" يطغى على "مهندس" في "مهندس صيانة"). الآن أي input فيه "مهندس" يذهب لـ engineer مع 100% دقة.

### 💼 Experience Override Templates (3 جديدة)
| Template | Trigger | Education | Experience | QVP |
|---|---|---|---|---|
| `sales_rep` | مندوب مبيعات | جامعية | **سنة واحدة** | ❌ stripped |
| `intermediate_admin` | مساعد إداري / مراقب الجودة | **ثانوية عامة** | سنة واحدة | ❌ stripped |
| `direct_sales` | بائع مباشر | ثانوية عامة | **بدون خبرة** | ❌ stripped |

### 🛡️ Zero-Duplication Rule
أضفنا دالة `distinct()` تشغل قبل render و print، تطبّع المسافات وعلامات الترقيم وتمنع تكرار أي bullet (مثلاً لو حدث gender swap أعاد جلب نفس الفقرة).

### 🐛 UI Fixes
1. **X Close Button on Mobile (was freezing)**:
   - **قبل**: `['click', 'touchend'].forEach(...)` كان يولّد double-fire/ghost-click hangs على iOS
   - **بعد**: `click` فقط (مع `touch-action: manipulation` من Tailwind) → موثوق على كل المتصفحات
2. **Auto-Focus Anchor**: smooth scroll للموديل + scroll الـ inner body للأعلى عشان المستخدم يرى الأوراق فوراً
3. **Engineering Promotion to Compliance Tier**: لمنع أي حالة طغيان (e.g., "مهندس صيانة" → engineer ليس technical)

### Test Coverage
- 📊 **53/53 mapping tests passed** (including 8 engineering variants + 4 override types + Universal fallback)
- 🏗️ **Structural validation**: Engineer has exactly 11 docs, Sales/Intermediate/Direct have correct experience strings + NO QVP

### Files Modified
- ✏️ `/app/smart-fallback.js`:
  - 4 جداول جديدة (engineer, sales_rep, intermediate_admin, direct_sales)
  - 4 ثوابت جديدة (ENG_DEGREE, ENG_EXP_*, ENG_ACCRED, ENG_MUSADAQA, ENG_JEA, ENG_SCE, AUTH_OFFICE, SECONDARY_SCHOOL)
  - `distinct()` filter للـ rendering والـ printing
  - Close button event handler refactor (single 'click')
  - Inner-body smooth scroll
- ✏️ `/app/backend/tests/test_classifier.js`: +20 حالة اختبار جديدة + structural validation

---

## ✅ Round 8: Canonical Docs + Smart Validation + Bulletproof X Button (2026-02-21)

### 📄 Canonical Document Strings (no more "اجتهاد")
استبدلنا النصوص المخصصة بالنصوص الـ canonical المستخدمة في professions.json:
- **مطعوم السحايا**: `'شهادة مطعوم السحايا'` (230 occurrences in DB) — كان "الرباعي"
- **الاعتماد المهني**: `'الحصول على شهادة الاعتماد المهني'` (229 occurrences) — كان فيه إضافات "(QVP) عبر منصة مساند" و"للحرف اليدوية والتشغيلية"
- **حذف "اختبار الكفاءة المهنية (QVP) لمزاولي الحرف الفنية"** من technical template
- **حذف "اختبار الفحص المهني (QVP) للحرف اليدوية والتشغيلية"** من labor template

### 💉 مطعوم السحايا for ALL professions (no exceptions)
أضفنا `VACCINE` لـ engineer template (كان مستثنى). أصبح في كل الـ **15 قالب** بدون استثناء:
executive, medical, specialist, engineer, sales_rep, intermediate_admin, direct_sales, supervisor, technical, labor, driver, domestic_female, domestic_male, admin, general ✅

### 🛡️ Smart Profession Validation (Vocabulary Filter)
يمنع المدخلات العشوائية ("أنا", "بيت", "حمار", "عمر", "ببسي", "123") من توليد أوراق مزيفة.
**3 طبقات تحقق**:
1. **STRONG**: input matches a RULES keyword → accepted
2. **MEDIUM**: any token in input exists in vocab built from `professions.json` (273 مهنة) — مبني بكسل بالـ lazy fetch
3. **WEAK**: input starts with profession-prefix (مدرب/موظف/مشغل/مسؤول/منسق/...) AND has 2+ tokens

**Error UI**: عرض رسالة لطيفة (amber alert) مع زر واتساب للحالات النادرة.
**Analytics**: تتبع `SmartFallbackRejected` event في Facebook Pixel — يبني قائمة بالمهن الجديدة اللي يطلبها العملاء لإضافتها لاحقاً.

### 🐛 X Close Button — BULLETPROOF FIX
**السبب الجذري المكتشف**: `z-[60]` كان arbitrary Tailwind value **لم يُولَّد في الـ static build**، فالزر كان عند `z-index: auto` والـ flex container كان يعترض النقرة (`elementFromPoint` رجع DIV ليس الزر).

**الحل النهائي**:
1. نقل الزر خارج الـ inline-block (top-level fixed)
2. `style="pointer-events:auto; z-index: 9999;"` inline لتجاوز Tailwind purge
3. خلفية بيضاء (بدلاً من شفافة) + shadow-xl لوضوح بصري
4. Triple-path event handlers: direct click + touchstart + body delegation
5. ESC key + overlay click كذلك

**التحقق**: `elementFromPoint(center)` رجع الزر نفسه = الزر فعلاً فوق كل العناصر. نقرة حقيقية (بدون force) تغلق المودال + ترجع body overflow.

### Test Coverage (Round 8 additions)
- 🧪 53/53 classifier mappings (unchanged from Round 7)
- 🧪 Structural: engineer=12 docs (added VACCINE)، VACCINE in all 15 templates
- 🧪 Browser smoke: 11/11 inputs validated correctly (6 garbage rejected + 5 legitimate accepted)
- 🧪 X button: real click closes modal + body overflow restored

### Files Modified
- ✏️ `/app/smart-fallback.js`:
  - VACCINE constant updated to canonical "شهادة مطعوم السحايا"
  - QVP constant updated to canonical "الحصول على شهادة الاعتماد المهني"
  - VACCINE added to engineer template (12 docs total)
  - technical/labor QVP texts replaced with canonical
  - Added `PROFESSION_PREFIXES`, `_vocabCache`, `loadProfessionVocab()`, `validateProfessionInput()`
  - `generateFromInput()` now validates before rendering — shows amber error for garbage
  - Close button refactored to fixed top-level with z-index: 9999 + triple-path handlers
  - Added `#smart-fallback-error` element to panel HTML
- ✏️ `/app/backend/tests/test_classifier.js`: updated engineer expected count (11→12)


