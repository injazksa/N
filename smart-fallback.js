/**
 * 🧠 Smart Fallback Search System (Task 12 + Universal Semantic Classifier)
 * Saudia Visa Jordan — 2026
 *
 * v3.0 — Universal Rule-Based Taxonomy Classifier:
 *  - 3-Tier Semantic Mapping (Academic/Mgmt → Supervisory/Technical → Vocational/Labor)
 *  - Longest-prefix matching (multi-word phrases beat single words)
 *  - Universal Safe Fallback (general visa template, NEVER broken state)
 *  - Specialized compliance routes preserved (Medical/Driver/Domestic)
 *  - Pre-search gender selector + Live gender switch
 *  - Custom user title echoed at sheet header
 */
(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // 📋 BASE DOCUMENT TEMPLATES
  // ═══════════════════════════════════════════════════════════════
  const SECURITY = 'حسن سيرة وسلوك من المخابرات العامة (التقديم إلكتروني عبر موقع المخابرات العامة أو من خلال تطبيق سند)';
  const MILITARY = 'الوثائق العسكرية (مشروحات من القيادة العامة، كتاب من التعبئة / قسم شؤون الأفراد العنوان: طبربور دوار الدبابة) + دفتر خدمة العلم / بطاقة إنهاء الخدمة أو الإعفاء';
  const MILITARY_FULL = 'الوثائق العسكرية (مشروحات من القيادة العامة، كتاب من التعبئة / قسم شؤون الأفراد العنوان: طبربور دوار الدبابة يكون معك دفتر خدمة العلم / بطاقة إنهاء الخدمة أو الإعفاء)';
  const FEMALE_PERMISSION = 'عدم ممانعة من ولي الأمر (في حالة كانت متزوجة إحضار شهادة الزواج وعدم الممانعة من الزوج + صورة عن جواز سفر الزوج) (في حال كانت عزباء، إحضار عدم ممانعة من ولي الأمر + قيد فردي + صورة عن جواز سفر ولي الأمر)';
  const PASSPORT = 'إحضار جواز السفر و 6 صور شخصية بخلفية بيضاء حديثة لكافة المعاملات';
  const PASSPORT_NEW = 'جواز السفر الجديد + صور شخصية عدد 2 بخلفية بيضاء';
  const MEDICAL_BIO = 'عمل فحص طبي وبصمة معتمد لدى السفارة السعودية + صورة شخصية خلفية بيضاء + جواز السفر';
  const VACCINE  = 'شهادة مطعوم السحايا الرباعي';
  const AUTH     = 'عمل تفويض إلكتروني للمكتب';
  const CONTRACT = 'عقد عمل من الشركة السعودية + خطاب إطلاع مختومين من الغرفة التجارية والخارجية السعودية';
  const CONTRACT_DOMESTIC = 'عقد عمل مصدق من الغرفة التجارية والخارجية السعودية';
  const QVP      = 'الحصول على شهادة الاعتماد المهني';
  const ATTEST   = 'ملاحظة هامة جداً (التصديقات الخارجية): يجب تصديق جميع الأوراق الرسمية والشهادات المطلوبة أعلاه (مثل: حسن السيرة والسلوك) من وزارة الخارجية الأردنية قبل تقديمها';
  const DEGREE   = 'إحضار الشهادة الجامعية (الأصل) وكشف العلامات الأصل + تصديق من وزارة الخارجية';
  const SCHOOL   = 'إحضار الشهادة المدرسية (الأصل)';
  const DRIVER_LICENSE = 'صورة عن رخصة السياقة مختومة من إدارة الترخيص';

  // === ENGINEERING-SPECIFIC SHARED CONSTANTS (Strict Production Payload) ===
  // Cloned/referenced — NEVER hardcoded inside business logic.
  const ENG_DEGREE       = 'إحضار الشهادة الجامعية (الأصل) وكشف العلامات الأصل';
  const ENG_EXP_2Y       = 'خبرة لمدة سنتين بنفس مسمى التأشيرة';
  const ENG_EXP_1Y       = 'خبرة سنة واحدة بنفس مسمى التأشيرة';
  const ENG_EXP_NONE     = 'بدون اشتراط خبرة سابقة';
  const ENG_ACCRED       = 'الحصول على شهادة الاعتماد المهني';
  const ENG_MUSADAQA     = 'الحصول على شهادة من موقع مصادقة السعودي';
  const ENG_JEA          = 'عضوية + مزاولة مهنة من نقابة المهندسين الأردنية';
  const ENG_SCE          = 'التسجيل في هيئة المهندسين السعودية';
  const AUTH_OFFICE      = 'عمل تفويض للمكتب';
  const SECONDARY_SCHOOL = 'إحضار شهادة الثانوية العامة (التوجيهي) — الأصل';

  const TEMPLATES = {
    executive: {
      label: 'مسار المستثمر / المدير العام',
      icon: 'fa-crown',
      genderLocked: true,
      reqs: [
        SECURITY,
        'السجل التجاري السعودي ورخصة الاستثمار (يكون الاسم ظاهر بالسجل التجاري)',
        'التفويض من هيئة الاستثمار',
        MEDICAL_BIO, VACCINE, AUTH,
        'ملاحظة هامة جداً: يستخدم هذا المسار للمستثمرين والمدراء التنفيذيين الذين يملكون أو يديرون كياناً رسمياً في السعودية. لا يلزم خدمة العلم أو الاعتماد المهني لهذا المستوى.'
      ]
    },
    medical: {
      label: 'مسار الأطباء والكوادر الصحية',
      icon: 'fa-stethoscope',
      reqs: [
        SECURITY, MILITARY_FULL, DEGREE, MEDICAL_BIO,
        'خبرة بنفس مسمى التأشيرة',
        CONTRACT,
        'شهادة التصنيف والتسجيل المهني من الهيئة السعودية للتخصصات الصحية (ممارس بلس)',
        'تقرير التحقق من الشهادات والخبرات المهنية (DataFlow Report)',
        VACCINE, AUTH, ATTEST
      ]
    },
    specialist: {
      label: 'مسار الاختصاصي',
      icon: 'fa-user-graduate',
      reqs: [
        SECURITY, MILITARY, DEGREE,
        ENG_EXP_2Y,
        MEDICAL_BIO, CONTRACT,
        'شهادة تصنيف مهني من الهيئة المختصة',
        QVP, VACCINE, AUTH, ATTEST
      ]
    },
    // 🏗️ ENGINEERING SECTOR — STRICT PRODUCTION PAYLOAD (verified docs + meningitis vaccine)
    // Required because regular Specialist track is incomplete for engineers (missing
    // JEA membership, SCE registration, مصادقة السعودي).
    // NOTE: VACCINE (شهادة مطعوم السحايا) added per policy — required for ALL professions.
    engineer: {
      label: 'مسار المهندسين',
      icon: 'fa-helmet-safety',
      reqs: [
        SECURITY,
        MILITARY_FULL,
        ENG_DEGREE,
        MEDICAL_BIO,
        ENG_EXP_2Y,
        CONTRACT,
        ENG_ACCRED,
        ENG_MUSADAQA,
        ENG_JEA,
        ENG_SCE,
        VACCINE,
        AUTH_OFFICE
      ]
    },
    // High-tier specialist with reduced experience requirement (مندوب مبيعات)
    sales_rep: {
      label: 'مسار مندوبي المبيعات',
      icon: 'fa-handshake',
      reqs: [
        SECURITY, MILITARY, DEGREE,
        ENG_EXP_1Y,
        MEDICAL_BIO, CONTRACT,
        VACCINE, AUTH, ATTEST
      ]
    },
    // Intermediate academic track — High School + 1 year + NO QVP
    intermediate_admin: {
      label: 'مسار الكوادر المساعدة (الإداريين / المراقبة)',
      icon: 'fa-clipboard-check',
      reqs: [
        SECURITY, MILITARY,
        SECONDARY_SCHOOL,
        ENG_EXP_1Y,
        MEDICAL_BIO, CONTRACT,
        VACCINE, AUTH, ATTEST
      ]
    },
    // No-experience entry track — بائع مباشر
    direct_sales: {
      label: 'مسار البيع المباشر',
      icon: 'fa-store',
      reqs: [
        SECURITY, MILITARY,
        SECONDARY_SCHOOL,
        ENG_EXP_NONE,
        MEDICAL_BIO, CONTRACT,
        VACCINE, AUTH, ATTEST
      ]
    },
    supervisor: {
      label: 'مسار الإشراف / رئيس قسم',
      icon: 'fa-user-tie',
      reqs: [
        SECURITY, MILITARY, DEGREE,
        'خبرة لا تقل عن سنتين في موقع إشرافي',
        MEDICAL_BIO, CONTRACT, QVP, VACCINE, AUTH, ATTEST
      ]
    },
    technical: {
      label: 'مسار الفنيين / الحرفيين',
      icon: 'fa-tools',
      reqs: [
        SECURITY, MILITARY,
        'شهادة مهنية أو دبلوم متوسط في الحرفة المطلوبة',
        'خبرة لمدة سنتين بنفس مسمى التأشيرة',
        MEDICAL_BIO, CONTRACT,
        QVP,
        VACCINE, AUTH, ATTEST
      ]
    },
    labor: {
      label: 'مسار العمالة التشغيلية',
      icon: 'fa-people-carry-box',
      reqs: [
        SECURITY, MILITARY,
        'إحضار الشهادة المدرسية (الأصل)',
        MEDICAL_BIO, CONTRACT,
        VACCINE, AUTH, PASSPORT, ATTEST
      ]
    },
    // === HOTFIX: Specialized templates that BLOCK Specialist/Manager fallback ===
    driver: {
      label: 'مسار السائقين الخاصين',
      icon: 'fa-car',
      genderLocked: false,
      reqs: [
        SECURITY,
        MILITARY_FULL,
        SCHOOL,
        MEDICAL_BIO,
        CONTRACT_DOMESTIC,
        DRIVER_LICENSE,
        'إحضار رخصة السياقة الأصلية والنافذة',
        AUTH,
        VACCINE
      ]
    },
    domestic_female: {
      label: 'مسار العاملة المنزلية / المربية',
      icon: 'fa-house-user',
      forcedGender: 'female',
      reqs: [
        SECURITY,
        FEMALE_PERMISSION,
        SCHOOL,
        MEDICAL_BIO,
        CONTRACT_DOMESTIC,
        VACCINE,
        AUTH
      ]
    },
    domestic_male: {
      label: 'مسار العامل المنزلي',
      icon: 'fa-house-user',
      forcedGender: 'male',
      reqs: [
        SECURITY,
        MILITARY_FULL,
        SCHOOL,
        MEDICAL_BIO,
        CONTRACT_DOMESTIC,
        VACCINE,
        AUTH
      ]
    },
    admin: {
      label: 'المسار الإداري',
      icon: 'fa-briefcase',
      reqs: [
        SECURITY, MILITARY, DEGREE,
        'خبرة لمدة سنة على الأقل',
        MEDICAL_BIO, CONTRACT, VACCINE, AUTH, ATTEST
      ]
    },
    // === UNIVERSAL SAFE FALLBACK ===
    // Used when input doesn't match any semantic keyword group.
    // Prints standard general-visa requirements + echoes user's custom title.
    general: {
      label: 'المسار العام للتأشيرة',
      icon: 'fa-passport',
      reqs: [
        SECURITY,
        MILITARY,
        MEDICAL_BIO,
        VACCINE,
        CONTRACT,
        AUTH,
        ATTEST,
        'ملاحظة هامة جداً: هذه قائمة المتطلبات الأساسية لتأشيرة العمل السعودية. للحصول على القائمة الدقيقة لمهنتك المحددة، يرجى التواصل معنا عبر واتساب وسنرسل لك التفاصيل الإضافية (شهادات/تصديقات/اختبارات) خلال 15 دقيقة.'
      ]
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 🧠 UNIVERSAL SEMANTIC CLASSIFIER (v3.0)
  // ───────────────────────────────────────────────────────────────
  // Tier metadata:
  //   • compliance: routes with regulator-specific docs (Medical, Driver, Domestic)
  //   • management : Tier 1 — Academic & Upper Management (مسار الأخصائيين والمدراء)
  //   • supervisory: Tier 2 — Supervisory & Technical Operations (مسار المشرفين والفنيين)
  //   • vocational : Tier 3 — Vocational / Trade / Labor (مسار العمالة الحرفية)
  //
  // Order is critical: longer/more-specific keywords are listed first within each
  // rule, and rules are evaluated top-to-bottom. The matcher uses longest-token
  // matching to ensure "رئيس قسم" hits Supervisor (Tier 2) BEFORE "رئيس" hits
  // Management (Tier 1).
  // ═══════════════════════════════════════════════════════════════
  const RULES = [
    // ─── COMPLIANCE TIER (highest specificity — block generic fallback) ───
    {
      id: 'domestic_female', template: 'domestic_female', tier: 'compliance',
      keywords: ['مربية أطفال', 'مربيه اطفال', 'عاملة منزلية', 'عامله منزليه', 'خادمة منزل', 'مدبرة منزل', 'مربية', 'مربيه', 'خادمة', 'خادمه']
    },
    {
      id: 'domestic_male', template: 'domestic_male', tier: 'compliance',
      keywords: ['عامل خدمة منزلية', 'عامل منزلي', 'خادم منزلي']
    },
    {
      id: 'driver', template: 'driver', tier: 'compliance',
      keywords: ['سائق خاص', 'سائق عائلة', 'سائق سيارة', 'سائق شاحنة', 'سائق', 'ساءق']
    },
    {
      id: 'medical', template: 'medical', tier: 'compliance',
      keywords: [
        'استشاري طبي', 'طبيب أسنان', 'طبيب اسنان', 'علاج طبيعي', 'فيزيائي علاجي',
        'طبيب', 'طبيبه', 'طبيبة', 'دكتور صيدلي', 'دكتور صيدلانية',
        'صيدلي', 'صيدلاني', 'صيدلانيه', 'صيدلانية',
        'جراح', 'ممرض', 'ممرضه', 'ممرضة', 'مسعف', 'مختبري',
        'فني مختبر طبي', 'فني أشعة', 'فني اشعة'
      ]
    },
    // 🏗️ ENGINEERING SECTOR — PROMOTED to compliance tier so it beats Technical's "صيانة"
    // and Specialist's "مدير". Any input containing "مهندس" routes here with strict 11-doc payload.
    {
      id: 'engineer', template: 'engineer', tier: 'compliance',
      keywords: [
        'مهندس', 'مهندسه', 'مهندسة', 'مهندسين', 'مهندسات',
        'م.', 'engineer'
      ]
    },

    // ─── TIER 2: SUPERVISORY & TECHNICAL OPERATIONS ───
    // (Must come BEFORE Tier 1 so "رئيس قسم" beats "رئيس")
    {
      id: 'supervisor', template: 'supervisor', tier: 'supervisory',
      keywords: ['رئيس قسم', 'رئيس شيفت', 'مسؤول قسم', 'مشرف عام', 'مشرف إنتاج', 'مشرف انتاج', 'مشرف موقع', 'مشرف', 'مراقب', 'منسق', 'كبير']
    },
    {
      id: 'technical', template: 'technical', tier: 'supervisory',
      keywords: [
        'فني صيانة', 'فني تكييف', 'فني تبريد', 'فني', 'ميكانيكي', 'ميكانيكية',
        'كهربائي', 'كهربائية',
        'حداد', 'نجار', 'سباك', 'صحي', 'لحام', 'مبرد', 'مكيف', 'صياغ',
        'تركيب', 'صيانة', 'دهان', 'بلاط', 'مبلط', 'مصلح'
      ]
    },

    // ─── TIER 1: ACADEMIC & UPPER MANAGEMENT ───
    // (Executive subgroup uses commercial track / no military)
    {
      id: 'executive', template: 'executive', tier: 'management',
      keywords: [
        'رئيس تنفيذي', 'رئيس مجلس إدارة', 'رئيس مجلس ادارة', 'رئيس مجلس',
        'مدير عام', 'مدير عمليات', 'مدير شريك', 'شريك مؤسس', 'مؤسس',
        'نائب رئيس تنفيذي', 'نائب مدير عام',
        'ceo', 'cfo', 'cto', 'coo', 'مستثمر', 'رئيس شركة'
      ]
    },
    // 🏗️ ENGINEERING SECTOR — STRICT RULE (BEFORE specialist so "مهندس" routes here)
    // Already defined at compliance tier above — this duplicate is intentionally removed.
    // 💼 Sales Rep — clones specialist baseline but with 1-year experience override
    {
      id: 'sales_rep', template: 'sales_rep', tier: 'management',
      keywords: ['مندوب مبيعات', 'مندوبه مبيعات', 'مندوبة مبيعات', 'مندوب بيع', 'sales rep']
    },
    // 🎓 Intermediate Admin / Quality Monitor — Secondary school + 1 year + NO QVP
    {
      id: 'intermediate_admin', template: 'intermediate_admin', tier: 'management',
      keywords: ['مساعد إداري', 'مساعد اداري', 'مساعدة إدارية', 'مساعده اداريه',
                 'مراقب الجودة', 'مراقب جودة', 'مراقبة الجودة', 'مراقبه جوده']
    },
    // 🛒 Direct Sales — Secondary school + NO experience + NO QVP
    {
      id: 'direct_sales', template: 'direct_sales', tier: 'vocational',
      keywords: ['بائع مباشر', 'بائعة مباشرة', 'بائعه مباشره', 'بائع', 'منسق زهور']
    },
    {
      id: 'specialist', template: 'specialist', tier: 'management',
      keywords: [
        'أخصائي', 'اخصائي', 'أخصائيه', 'أخصائية', 'اخصائية',
        'دكتور', 'دكتوره', 'دكتورة',
        'مستشار', 'مستشاره', 'مستشارة',
        'خبير', 'خبيره', 'خبيرة',
        'محلل', 'محلله', 'محللة',
        'باحث', 'باحثه', 'باحثة',
        'محامي', 'محامية',
        'مدقق حسابات', 'مدقق',
        'مصمم', 'مصممة', 'مبرمج', 'مبرمجة', 'مطور', 'مطورة', 'معماري',
        'نائب', 'مدير', 'مديره', 'مديرة',
        'رئيس'  // ← Tier 1 default for "رئيس" alone (after "رئيس قسم" matched in Tier 2)
      ]
    },

    // ─── TIER 3: VOCATIONAL / TRADE / LABOR ───
    {
      id: 'labor', template: 'labor', tier: 'vocational',
      keywords: [
        'عامل', 'عامله', 'عاملة', 'معاون', 'مساعد', 'مساعده', 'مساعدة',
        'حمّال', 'حمال', 'منظف', 'منظفه', 'منظفة', 'حارس', 'حارسة',
        'بستاني', 'بستانية', 'مزارع', 'مزارعة',
        'سائس', 'راعي',
        'طاهي', 'طاهية', 'طبّاخ', 'طباخ', 'طباخه', 'طباخة', 'كوك',
        'حلاق', 'حلاقة',
        'بائع', 'بائعه', 'بائعة', 'بائع متجول',
        'خياط', 'خياطة',
        'خبّاز', 'خباز', 'جزار', 'كناس', 'ساعي', 'مراسل'
      ]
    },

    // ─── OFFICE / ADMIN (Tier 1.5 — degreed but not specialist) ───
    {
      id: 'admin', template: 'admin', tier: 'management',
      keywords: ['موظف استقبال', 'موظف خدمة عملاء', 'موظف', 'إداري', 'اداري',
                 'سكرتير', 'سكرتيره', 'سكرتيرة', 'سكرتاريا',
                 'محاسب', 'محاسبه', 'محاسبة', 'مدخل بيانات', 'كاتب', 'كاتبه']
    }
  ];

  // Tier display labels (for badge in modal)
  const TIER_LABELS = {
    compliance:  { label: 'مسار متخصص', color: 'gold' },
    management:  { label: 'مسار الأخصائيين والمدراء', color: 'blue' },
    supervisory: { label: 'مسار المشرفين والفنيين', color: 'green' },
    vocational:  { label: 'مسار العمالة الحرفية', color: 'amber' },
    fallback:    { label: 'المسار العام', color: 'gray' }
  };

  function normalize(t) {
    if (!t) return '';
    return String(t)
      .trim()
      .replace(/[أإآ]/g, 'ا')
      .replace(/[ةه]/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/[ـ]/g, '')        // strip tatweel
      .replace(/\s+/g, ' ')       // collapse whitespace
      .toLowerCase();
  }

  /**
   * Universal Semantic Classifier — Longest-Prefix Match.
   *
   * Strategy: collect ALL keyword hits across all rules, then pick the rule
   * whose matched keyword is LONGEST. This guarantees that:
   *   - "رئيس قسم"     → Supervisor (Tier 2), NOT Specialist (Tier 1)
   *   - "مدير عام"     → Executive (compliance), NOT Specialist
   *   - "نائب رئيس"    → Specialist, NOT Executive (unless 'نائب رئيس تنفيذي')
   *   - "عامل منزلي"   → Domestic Male, NOT Labor
   *   - "طبيب أسنان"   → Medical, NOT Specialist
   * If no keyword matches, returns the safe `general` template.
   */
  function matchTemplate(userTitle) {
    const norm = normalize(userTitle);
    if (!norm) return { id: 'general', template: 'general', tier: 'fallback', matched_keyword: null };

    let best = null;
    for (const rule of RULES) {
      for (const kw of rule.keywords) {
        const nkw = normalize(kw);
        if (!nkw) continue;
        // Word-boundary-aware contains: ensure keyword is a whole token or substring at token start.
        // For Arabic, we accept any substring match but rank by length.
        if (norm.includes(nkw)) {
          if (!best || nkw.length > best._kwLen) {
            best = { ...rule, matched_keyword: kw, _kwLen: nkw.length };
          }
        }
      }
    }
    if (best) {
      delete best._kwLen;
      return best;
    }
    // ✅ Universal Safe Fallback — NEVER a broken state
    return { id: 'general', template: 'general', tier: 'fallback', matched_keyword: null };
  }

  // ═══════════════════════════════════════════════════════════════
  // 🛡️ SMART INPUT VALIDATION — Profession Vocabulary Filter
  // ───────────────────────────────────────────────────────────────
  // Prevents garbage inputs ("أنا", "بيت", "حمار", "عمر", "ببسي") from
  // generating fake document sheets. An input is accepted as a valid
  // profession only if it meets one of these heuristics:
  //
  //   1. STRONG: input matches a keyword in RULES (e.g. "مهندس", "سائق")
  //   2. MEDIUM: any token (word) in input is a known profession word
  //              from the live `professions.json` vocabulary
  //   3. WEAK : input contains a generic profession-class prefix word
  //              (e.g. "مدرب", "موظف", "مشغل", "مسؤول") followed by
  //              a qualifier — multi-token compound profession.
  //
  // The vocab is built lazily on first call by fetching /professions.json
  // and adding every word from every name. Falls back gracefully if fetch
  // fails (network/CORS), in which case validation defers to keyword-only.
  // ═══════════════════════════════════════════════════════════════

  // Profession-class prefix words: when input STARTS with these and has
  // 2+ tokens total, we treat it as a legitimate compound profession even
  // if no rule keyword matches (e.g. "مدرب يوغا", "موظف تجارة دولية").
  const PROFESSION_PREFIXES = new Set([
    'مدرب', 'مدرّب', 'مدربة', 'مدرّبة', 'مدربه',
    'موظف', 'موظفة', 'موظفه',
    'مشغل', 'مشغّل', 'مشغلة', 'مشغّلة',
    'مسؤول', 'مسؤولة', 'مسئول', 'مسئولة',
    'منسق', 'منسقة',
    'مفتش', 'مفتشة',
    'فاحص', 'فاحصة',
    'متخصص', 'متخصصة',
    'مختص', 'مختصة',
    'محترف', 'محترفة'
  ]);

  let _vocabCache = null;     // built lazily
  let _vocabPromise = null;   // in-flight fetch

  function buildVocabFromRules() {
    // Always-available baseline: every keyword from every rule
    const v = new Set();
    for (const rule of RULES) {
      for (const kw of rule.keywords) {
        const n = normalize(kw);
        if (!n) continue;
        for (const tok of n.split(/\s+/)) if (tok.length >= 2) v.add(tok);
      }
    }
    for (const p of PROFESSION_PREFIXES) v.add(normalize(p));
    return v;
  }

  async function loadProfessionVocab() {
    if (_vocabCache) return _vocabCache;
    if (_vocabPromise) return _vocabPromise;
    const baseline = buildVocabFromRules();
    _vocabPromise = fetch('/professions.json', { cache: 'force-cache' })
      .then(r => r.ok ? r.json() : [])
      .then(list => {
        for (const p of list || []) {
          const name = normalize(p.name_ar || p.profession_name_ar || '');
          for (const tok of name.split(/\s+/)) if (tok.length >= 2) baseline.add(tok);
        }
        _vocabCache = baseline;
        return baseline;
      })
      .catch(() => {
        _vocabCache = baseline;
        return baseline;
      });
    return _vocabPromise;
  }

  // Kick off vocab load early
  if (typeof fetch === 'function') loadProfessionVocab();

  /**
   * Returns { valid: boolean, reason: string }.
   * `valid=false` means the input does not look like a real profession.
   */
  function validateProfessionInput(userTitle) {
    const norm = normalize(userTitle);
    if (!norm) return { valid: false, reason: 'empty' };
    if (norm.length < 3) return { valid: false, reason: 'too_short' };
    // Reject pure numeric / punctuation
    if (!/[\u0600-\u06FFa-z]/.test(norm)) return { valid: false, reason: 'no_letters' };

    // (1) STRONG: matches any RULES keyword
    for (const rule of RULES) {
      for (const kw of rule.keywords) {
        if (norm.includes(normalize(kw))) return { valid: true, reason: 'rule_match' };
      }
    }

    // (2) MEDIUM: any token is in the live profession vocab
    const tokens = norm.split(/\s+/).filter(t => t.length >= 2);
    const vocab = _vocabCache || buildVocabFromRules();
    for (const tok of tokens) {
      if (vocab.has(tok)) return { valid: true, reason: 'vocab_match' };
    }

    // (3) WEAK: starts with a profession-prefix and has 2+ tokens
    if (tokens.length >= 2 && PROFESSION_PREFIXES.has(tokens[0])) {
      return { valid: true, reason: 'prefix_compound' };
    }

    return { valid: false, reason: 'no_match' };
  }

  // ═══════════════════════════════════════════════════════════════
  // 🎨 UI: Quick-bar (already injected in HTML) + Modal Panel
  // ═══════════════════════════════════════════════════════════════
  let preSelectedGender = 'male'; // default

  function injectFallbackPanel() {
    if (document.getElementById('smart-fallback-panel')) return;
    const trigger = document.getElementById('smart-fallback-trigger');
    if (!trigger) return;

    const panel = document.createElement('div');
    panel.id = 'smart-fallback-panel';
    panel.className = 'hidden mt-3 bg-white border-2 border-gold/40 rounded-2xl p-4 sm:p-6 shadow-xl text-right';
    panel.setAttribute('data-testid', 'smart-fallback-panel');
    panel.innerHTML = `
      <label for="smart-fallback-input" class="block text-navy font-bold mb-2 text-sm sm:text-base">
        <i class="fas fa-keyboard text-gold ml-1"></i>
        اكتب مسمى المهنة كما هو في تأشيرتك:
      </label>
      <input id="smart-fallback-input" type="text"
        placeholder="مثال: سائق خاص / مربية منزلية / فني صيانة..."
        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm sm:text-base focus:outline-none focus:border-gold transition-colors text-right"
        data-testid="smart-fallback-input"
        dir="rtl" />

      <!-- Pre-search Gender Selector -->
      <div class="mt-3 flex items-center gap-3 flex-wrap" data-testid="pre-gender-selector">
        <span class="text-xs sm:text-sm text-gray-600 font-semibold">
          <i class="fas fa-venus-mars text-gold ml-1"></i>
          الجنس:
        </span>
        <div class="inline-flex rounded-lg overflow-hidden border-2 border-gold/30">
          <button type="button" data-pre-gender="male"
            class="pre-gender-btn px-3 py-1.5 text-xs sm:text-sm font-bold transition-all bg-gold text-white"
            data-testid="pre-gender-male">
            <i class="fas fa-mars ml-1"></i>ذكر
          </button>
          <button type="button" data-pre-gender="female"
            class="pre-gender-btn px-3 py-1.5 text-xs sm:text-sm font-bold transition-all bg-white text-gray-700 hover:bg-gold/10"
            data-testid="pre-gender-female">
            <i class="fas fa-venus ml-1"></i>أنثى
          </button>
        </div>
      </div>

      <button id="smart-fallback-generate" type="button"
        class="mt-4 w-full sm:w-auto px-6 py-3 bg-gold hover:bg-gold/90 text-white text-sm sm:text-base font-bold rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2"
        data-testid="smart-fallback-generate">
        <i class="fas fa-bolt"></i>
        <span>توليد أوراق المهنة</span>
      </button>

      <!-- 🛡️ Validation error (hidden by default) -->
      <div id="smart-fallback-error" class="hidden mt-3 bg-amber-50 border-2 border-amber-300 text-amber-900 rounded-xl p-3 sm:p-4 text-sm sm:text-base"
           data-testid="smart-fallback-error" role="alert">
        <div class="flex items-start gap-2 sm:gap-3">
          <i class="fas fa-exclamation-triangle text-amber-600 text-lg mt-0.5 flex-shrink-0"></i>
          <div class="flex-1">
            <p class="font-bold mb-1">هذا لا يبدو كاسم مهنة معتمدة</p>
            <p class="text-xs sm:text-sm leading-relaxed">يرجى كتابة اسم مهنة حقيقي كما يظهر في تأشيرة العمل (مثال: <strong>سائق خاص</strong>، <strong>مهندس مدني</strong>، <strong>طاهي</strong>). إذا كنت متأكد من المسمى، تواصل معنا مباشرة عبر واتساب للتحقق.</p>
            <a href="https://wa.me/962789881009?text=أريد%20التحقق%20من%20مسمى%20مهنة" target="_blank" rel="noopener"
               class="mt-2 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-green-700 hover:text-green-800 transition">
              <i class="fab fa-whatsapp"></i> تواصل عبر واتساب
            </a>
          </div>
        </div>
      </div>
    `;

    // Insert AFTER the quick-bar (which is right under search)
    const quickbar = document.getElementById('smart-fallback-quickbar');
    quickbar.parentNode.insertBefore(panel, quickbar.nextSibling);

    // Wire events
    trigger.addEventListener('click', togglePanel);
    document.getElementById('smart-fallback-generate').addEventListener('click', generateFromInput);
    document.getElementById('smart-fallback-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') generateFromInput();
    });
    document.querySelectorAll('.pre-gender-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        preSelectedGender = this.dataset.preGender;
        document.querySelectorAll('.pre-gender-btn').forEach(b => {
          if (b.dataset.preGender === preSelectedGender) {
            b.classList.remove('bg-white', 'text-gray-700');
            b.classList.add('bg-gold', 'text-white');
          } else {
            b.classList.remove('bg-gold', 'text-white');
            b.classList.add('bg-white', 'text-gray-700');
          }
        });
      });
    });
  }

  function togglePanel() {
    const panel = document.getElementById('smart-fallback-panel');
    if (!panel) return;
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) {
      const search = document.getElementById('searchInput');
      const input = document.getElementById('smart-fallback-input');
      // Sync gender from main filter
      const mainGender = document.getElementById('genderFilter');
      if (mainGender && (mainGender.value === 'male' || mainGender.value === 'female')) {
        preSelectedGender = mainGender.value;
        updateGenderButtons();
      }
      if (search && search.value && input && !input.value) {
        input.value = search.value;
      }
      input.focus();
      // Smooth scroll to panel
      setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
    }
  }

  function updateGenderButtons() {
    document.querySelectorAll('.pre-gender-btn').forEach(b => {
      if (b.dataset.preGender === preSelectedGender) {
        b.classList.remove('bg-white', 'text-gray-700');
        b.classList.add('bg-gold', 'text-white');
      } else {
        b.classList.remove('bg-gold', 'text-white');
        b.classList.add('bg-white', 'text-gray-700');
      }
    });
  }

  function generateFromInput() {
    const input = document.getElementById('smart-fallback-input');
    const errorBox = document.getElementById('smart-fallback-error');
    const userTitle = (input.value || '').trim();
    // Hide any previous error
    if (errorBox) errorBox.classList.add('hidden');

    if (!userTitle) {
      input.focus();
      input.classList.add('border-red-500');
      setTimeout(() => input.classList.remove('border-red-500'), 1500);
      return;
    }

    // 🛡️ Smart Profession Validation
    const check = validateProfessionInput(userTitle);
    if (!check.valid) {
      input.classList.add('border-red-500');
      if (errorBox) {
        errorBox.classList.remove('hidden');
        setTimeout(() => errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
      }
      setTimeout(() => input.classList.remove('border-red-500'), 2500);
      // Analytics: track rejected input (helps grow vocab over time)
      if (typeof window.fbq === 'function') {
        try { window.fbq('trackCustom', 'SmartFallbackRejected', { query: userTitle, reason: check.reason }); } catch (e) {}
      }
      return;
    }

    const match = matchTemplate(userTitle);
    const template = TEMPLATES[match.template];

    // HOTFIX: Force gender if template specifies
    let gender = preSelectedGender;
    if (template.forcedGender) gender = template.forcedGender;

    showGeneratedSheet(userTitle, template, match, gender);
  }

  // ═══════════════════════════════════════════════════════════════
  // 📄 GENERATED SHEET MODAL (Mobile-Optimized)
  // ═══════════════════════════════════════════════════════════════
  let currentGenerated = null;

  function showGeneratedSheet(userTitle, template, match, gender) {
    let existing = document.getElementById('generated-sheet-modal');
    if (existing) existing.remove();

    currentGenerated = { userTitle, template, match, gender };

    const html = `
      <div id="generated-sheet-modal" class="fixed inset-0 z-50 overflow-y-auto" data-testid="generated-sheet-modal" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" id="generated-sheet-overlay"></div>

        <!-- 🔴 CLOSE BUTTON: top-level fixed, highest z-index, always clickable -->
        <button id="generated-sheet-close" type="button"
          class="fixed top-3 left-3 sm:top-4 sm:left-4 w-12 h-12 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white shadow-xl hover:bg-gray-100 active:bg-gray-200 text-navy text-2xl transition-all touch-manipulation"
          style="pointer-events:auto; z-index: 9999;"
          data-testid="generated-sheet-close"
          aria-label="إغلاق">
          <i class="fas fa-times pointer-events-none"></i>
        </button>

        <div class="flex items-end sm:items-center justify-center min-h-screen px-2 sm:px-4 pt-2 pb-2 sm:p-0 relative">
          <div class="relative inline-block w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden text-right my-2 sm:my-8" dir="rtl">
            <!-- Header -->
            <div class="bg-gradient-to-l from-navy to-navy/90 text-white p-4 sm:p-6 relative">
              <div class="pl-14 sm:pl-14">
                <div class="inline-flex items-center gap-2 bg-gold/20 text-gold px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold mb-2">
                  <i class="fas ${template.icon}"></i>
                  <span>${escapeHtml(template.label)}</span>
                </div>
                <h2 class="text-xl sm:text-2xl md:text-3xl font-bold mb-1" data-testid="generated-sheet-title">
                  ${escapeHtml(userTitle)}
                </h2>
              </div>

              <!-- Gender Switcher (hidden if locked or forced) -->
              ${template.genderLocked || template.forcedGender ? '' : `
              <div class="mt-3 bg-white/10 rounded-xl p-2 sm:p-3 flex items-center justify-between gap-3" data-testid="generated-gender-switcher">
                <span class="text-xs sm:text-sm font-semibold text-white/90">
                  <i class="fas fa-venus-mars text-gold ml-1"></i>
                  جنس المتقدم:
                </span>
                <div class="flex gap-1.5">
                  <button data-gender="male" class="gender-btn px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm transition-all ${gender === 'male' ? 'bg-gold text-white' : 'bg-white/20 text-white hover:bg-white/30'}" data-testid="gender-male">
                    <i class="fas fa-mars ml-0.5"></i>ذكر
                  </button>
                  <button data-gender="female" class="gender-btn px-3 py-1.5 rounded-lg font-bold text-xs sm:text-sm transition-all ${gender === 'female' ? 'bg-gold text-white' : 'bg-white/20 text-white hover:bg-white/30'}" data-testid="gender-female">
                    <i class="fas fa-venus ml-0.5"></i>أنثى
                  </button>
                </div>
              </div>
              `}
            </div>

            <!-- Body -->
            <div class="p-4 sm:p-6 max-h-[55vh] sm:max-h-[60vh] overflow-y-auto">
              <h3 class="text-base sm:text-lg font-bold text-navy mb-3 sm:mb-4 flex items-center gap-2">
                <i class="fas fa-clipboard-list text-gold"></i>
                الأوراق والمستندات المطلوبة:
              </h3>
              <ol id="generated-sheet-list" class="space-y-2 sm:space-y-3 text-gray-800 leading-relaxed text-sm sm:text-base" data-testid="generated-sheet-list">
              </ol>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 p-3 sm:p-5 flex flex-col sm:flex-row gap-2 sm:gap-3 border-t">
              <a href="https://wa.me/962789881009?text=${encodeURIComponent('مرحباً، أحتاج للاستفسار عن مهنة: ' + userTitle)}"
                 target="_blank" rel="noopener"
                 class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-sm sm:text-base font-bold rounded-xl transition"
                 data-testid="generated-whatsapp-btn">
                <i class="fab fa-whatsapp text-lg sm:text-xl"></i>
                <span>تأكيد عبر واتساب</span>
              </a>
              <button id="generated-print-btn" type="button"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-navy hover:bg-navy/90 active:bg-navy/80 text-white text-sm sm:text-base font-bold rounded-xl transition"
                data-testid="generated-print-btn">
                <i class="fas fa-print"></i>
                <span>طباعة الأوراق</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    document.body.style.overflow = 'hidden'; // lock scroll
    renderRequirements();

    // ─── Close button: BULLETPROOF event delegation on document.
    //     Works regardless of DOM mutations or stacking context issues. ───
    const closeHandler = function (e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      closeGeneratedSheet();
    };
    // Direct listener (primary path)
    const closeBtn = document.getElementById('generated-sheet-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeHandler);
      closeBtn.addEventListener('touchstart', function(e){ e.preventDefault(); closeHandler(e); }, { passive: false });
    }
    // Overlay click (tap outside) to close
    const overlay = document.getElementById('generated-sheet-overlay');
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeHandler(e);
      });
    }
    // BACKUP path: event delegation on body — catches any future click on the close button
    // even if the direct listener is somehow lost. Self-removing after modal closes.
    function bodyDelegate(e) {
      const t = e.target;
      if (!t) return;
      const isCloseBtn = (t.id === 'generated-sheet-close') ||
                        (t.closest && t.closest('#generated-sheet-close')) ||
                        (t.getAttribute && t.getAttribute('data-testid') === 'generated-sheet-close');
      if (isCloseBtn) {
        e.preventDefault(); e.stopPropagation();
        closeGeneratedSheet();
        document.body.removeEventListener('click', bodyDelegate, true);
      }
    }
    document.body.addEventListener('click', bodyDelegate, true);
    // Also ESC key
    document.addEventListener('keydown', escClose);

    document.getElementById('generated-print-btn').onclick = printGeneratedSheet;
    document.querySelectorAll('#generated-sheet-modal .gender-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        if (!currentGenerated) return;
        currentGenerated.gender = this.dataset.gender;
        document.querySelectorAll('#generated-sheet-modal .gender-btn').forEach(b => {
          if (b.dataset.gender === currentGenerated.gender) {
            b.classList.remove('bg-white/20'); b.classList.add('bg-gold');
          } else {
            b.classList.remove('bg-gold'); b.classList.add('bg-white/20');
          }
        });
        renderRequirements();
      });
    });

    // 📍 No scroll jumping: only scroll the modal content to top, not the main page.
    setTimeout(() => {
      const modal = document.getElementById('generated-sheet-modal');
      const body  = modal && modal.querySelector('.overflow-y-auto');
      if (body) body.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);

    // FB Pixel
    try {
      if (window.fbq) {
        window.fbq('trackCustom', 'SmartFallbackGenerate', {
          user_title: userTitle,
          matched_template: match.template,
          matched_keyword: match.matched_keyword || 'none',
          gender: gender
        });
        window.fbq('track', 'Lead', { content_name: 'Smart Fallback: ' + userTitle });
      }
    } catch (e) {}
  }

  function escClose(e) {
    if (e.key === 'Escape') closeGeneratedSheet();
  }

  /**
   * Strict array-deduplication helper.
   * Normalises whitespace before comparison so e.g. trailing periods or
   * extra spaces still hit the same bucket. Preserves first-seen order.
   */
  function distinct(arr) {
    const seen = new Set();
    const out = [];
    for (const item of arr) {
      const key = String(item || '').trim().replace(/\s+/g, ' ').replace(/\.$/, '');
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(item);
    }
    return out;
  }

  function renderRequirements() {
    if (!currentGenerated) return;
    const list = document.getElementById('generated-sheet-list');
    if (!list) return;
    const { template, gender } = currentGenerated;

    // Top-tier executive / engineer / forced templates don't swap (commercial / no-military tracks)
    const noSwap = template.genderLocked || template.forcedGender;
    let finalReqs = template.reqs.map((req) => {
      if (!noSwap && gender === 'female' && (req.includes('الوثائق العسكرية') || req.includes('مشروحات من القيادة'))) {
        return FEMALE_PERMISSION;
      }
      return req;
    });

    // ✅ Strict no-duplication: prevent any bullet from repeating after gender swap
    finalReqs = distinct(finalReqs);

    list.innerHTML = finalReqs.map((r, i) => {
      const isNote = r.includes('ملاحظة هامة');
      const cls = isNote
        ? 'bg-blue-50 border border-blue-200 text-blue-900 p-3 sm:p-4 rounded-lg flex gap-2 sm:gap-3'
        : 'bg-gray-50 border border-gray-100 p-2.5 sm:p-3 rounded-lg flex gap-2 sm:gap-3 hover:bg-gold/5 transition';
      const icon = isNote
        ? '<i class="fas fa-info-circle text-blue-500 text-base sm:text-lg mt-0.5 flex-shrink-0"></i>'
        : `<span class="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-gold/15 text-gold rounded-full font-bold text-xs sm:text-sm flex items-center justify-center">${i + 1}</span>`;
      return `<li class="${cls}">${icon}<div class="flex-1 text-xs sm:text-sm leading-relaxed">${escapeHtml(r)}</div></li>`;
    }).join('');
  }

  function closeGeneratedSheet() {
    const modal = document.getElementById('generated-sheet-modal');
    if (modal) modal.remove();
    document.body.style.overflow = '';
    document.removeEventListener('keydown', escClose);
    currentGenerated = null;
  }

  function printGeneratedSheet() {
    if (!currentGenerated) return;
    const { userTitle, template, gender } = currentGenerated;
    const noSwap = template.genderLocked || template.forcedGender;
    const finalReqs = distinct(template.reqs.map((r) =>
      !noSwap && gender === 'female' && (r.includes('الوثائق العسكرية') || r.includes('مشروحات من القيادة'))
        ? FEMALE_PERMISSION : r
    ));
    if (typeof window.printProfessionDocument === 'function') {
      window.printProfessionDocument('AUTO', userTitle, finalReqs);
    }
  }

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // ═══════════════════════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════════════════════
  function init() {
    injectFallbackPanel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging
  window.smartFallback = { matchTemplate, TEMPLATES, RULES };
})();
