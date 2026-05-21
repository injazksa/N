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
  const MILITARY_FULL = 'الوثائق العسكرية (مشروحات من القيادة العامة، كتاب من التعبئة / قسم شؤون الأفراد العنوان: طبربور دوار الدبابة يكون معك دفتر خدمة العلم / بطاقة إنهاء الخدمة أو الإعفاء) إحضار جواز السفر و 6 صور شخصية بخلفية بيضاء حديثة لكافة المعاملات';
  const FEMALE_PERMISSION = 'عدم ممانعة من ولي الأمر (في حالة كانت متزوجة إحضار شهادة الزواج وعدم الممانعة من الزوج + صورة عن جواز سفر الزوج) (في حال كانت عزباء، إحضار عدم ممانعة من ولي الأمر + قيد فردي + صورة عن جواز سفر ولي الأمر)';
  const PASSPORT = 'إحضار جواز السفر و 6 صور شخصية بخلفية بيضاء حديثة لكافة المعاملات';
  const PASSPORT_NEW = 'جواز السفر الجديد + صور شخصية عدد 2 بخلفية بيضاء';
  const MEDICAL  = 'عمل فحص طبي من المختبر المعتمد لدى السفارة السعودية (صورة بخلفية بيضاء + جواز السفر)';
  const VACCINE  = 'شهادة مطعوم السحايا الرباعي';
  const BIO      = 'عمل فحص طبي وبصمة (يتم تحديده من قبل المكتب)';
  const AUTH     = 'عمل تفويض إلكتروني للمكتب';
  const CONTRACT = 'عقد عمل من الشركة السعودية + خطاب إطلاع مختومين من الغرفة التجارية والخارجية السعودية';
  const CONTRACT_DOMESTIC = 'عقد عمل مصدق من الغرفة التجارية والخارجية السعودية';
  const QVP      = 'الحصول على شهادة الاعتماد المهني (QVP) عبر منصة مساند';
  const ATTEST   = 'ملاحظة هامة جداً (التصديقات الخارجية): يجب تصديق جميع الأوراق الرسمية والشهادات المطلوبة أعلاه (مثل: حسن السيرة والسلوك) من وزارة الخارجية الأردنية قبل تقديمها';
  const DEGREE   = 'إحضار الشهادة الجامعية (الأصل) وكشف العلامات الأصل + تصديق من وزارة الخارجية';
  const SCHOOL   = 'إحضار الشهادة المدرسية (الأصل)';
  const DRIVER_LICENSE = 'صورة عن رخصة السياقة مختومة من إدارة الترخيص';

  const TEMPLATES = {
    executive: {
      label: 'مسار المستثمر / المدير العام',
      icon: 'fa-crown',
      genderLocked: true,
      reqs: [
        SECURITY,
        'السجل التجاري السعودي ورخصة الاستثمار (يكون الاسم ظاهر بالسجل التجاري)',
        'التفويض من هيئة الاستثمار',
        BIO, VACCINE, AUTH, PASSPORT,
        'ملاحظة هامة جداً: يستخدم هذا المسار للمستثمرين والمدراء التنفيذيين الذين يملكون أو يديرون كياناً رسمياً في السعودية. لا يلزم خدمة العلم أو الاعتماد المهني لهذا المستوى.'
      ]
    },
    medical: {
      label: 'مسار الأطباء والكوادر الصحية',
      icon: 'fa-stethoscope',
      reqs: [
        SECURITY, MILITARY_FULL, DEGREE, MEDICAL,
        'خبرة بنفس مسمى التأشيرة',
        CONTRACT,
        'شهادة التصنيف والتسجيل المهني من الهيئة السعودية للتخصصات الصحية (ممارس بلس)',
        'تقرير التحقق من الشهادات والخبرات المهنية (DataFlow Report)',
        VACCINE, AUTH, ATTEST
      ]
    },
    specialist: {
      label: 'مسار الاختصاصي / المهندس',
      icon: 'fa-user-graduate',
      reqs: [
        SECURITY, MILITARY, DEGREE,
        'خبرة لا تقل عن 3 سنوات في نفس الاختصاص',
        MEDICAL, CONTRACT,
        'شهادة تصنيف مهني من الهيئة المختصة',
        QVP, VACCINE, BIO, AUTH, PASSPORT, ATTEST
      ]
    },
    supervisor: {
      label: 'مسار الإشراف / رئيس قسم',
      icon: 'fa-user-tie',
      reqs: [
        SECURITY, MILITARY, DEGREE,
        'خبرة لا تقل عن سنتين في موقع إشرافي',
        MEDICAL, CONTRACT, QVP, VACCINE, BIO, AUTH, PASSPORT, ATTEST
      ]
    },
    technical: {
      label: 'مسار الفنيين / الحرفيين',
      icon: 'fa-tools',
      reqs: [
        SECURITY, MILITARY,
        'شهادة مهنية أو دبلوم متوسط في الحرفة المطلوبة',
        'خبرة لمدة سنتين بنفس مسمى التأشيرة',
        MEDICAL, CONTRACT,
        'اختبار الكفاءة المهنية (QVP) لمزاولي الحرف الفنية',
        'شهادة مزاولة مهنة رسمية',
        VACCINE, BIO, AUTH, PASSPORT, ATTEST
      ]
    },
    labor: {
      label: 'مسار العمالة التشغيلية',
      icon: 'fa-people-carry-box',
      reqs: [
        SECURITY, MILITARY,
        'شهادة دراسة (يقبل ثانوي أو دبلوم)',
        MEDICAL, CONTRACT,
        'اختبار الفحص المهني (QVP) للحرف اليدوية والتشغيلية',
        VACCINE, BIO, AUTH, PASSPORT, ATTEST
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
        MEDICAL,
        PASSPORT_NEW,
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
        MEDICAL,
        PASSPORT_NEW,
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
        MEDICAL,
        PASSPORT_NEW,
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
        MEDICAL, CONTRACT, VACCINE, BIO, AUTH, PASSPORT, ATTEST
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
        MEDICAL,
        VACCINE,
        CONTRACT,
        AUTH,
        PASSPORT,
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

    // ─── TIER 2: SUPERVISORY & TECHNICAL OPERATIONS ───
    // (Must come BEFORE Tier 1 so "رئيس قسم" beats "رئيس")
    {
      id: 'supervisor', template: 'supervisor', tier: 'supervisory',
      keywords: ['رئيس قسم', 'رئيس شيفت', 'مسؤول قسم', 'مشرف عام', 'مشرف إنتاج', 'مشرف انتاج', 'مشرف موقع', 'مشرف', 'مراقب جودة', 'مراقب', 'منسق', 'كبير']
    },
    {
      id: 'technical', template: 'technical', tier: 'supervisory',
      keywords: [
        'فني صيانة', 'فني تكييف', 'فني تبريد', 'فني', 'ميكانيكي', 'ميكانيكية',
        'كهربائي', 'كهربائية', 'مهندس صيانة',
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
    {
      id: 'specialist', template: 'specialist', tier: 'management',
      keywords: [
        'أخصائي', 'اخصائي', 'أخصائيه', 'أخصائية', 'اخصائية',
        'مهندس', 'مهندسه', 'مهندسة',
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
    const userTitle = (input.value || '').trim();
    if (!userTitle) {
      input.focus();
      input.classList.add('border-red-500');
      setTimeout(() => input.classList.remove('border-red-500'), 1500);
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
        <div class="flex items-end sm:items-center justify-center min-h-screen px-2 sm:px-4 pt-2 pb-2 sm:p-0">
          <div class="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" id="generated-sheet-overlay"></div>

          <div class="relative inline-block w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden text-right my-2 sm:my-8" dir="rtl">
            <!-- Header -->
            <div class="bg-gradient-to-l from-navy to-navy/90 text-white p-4 sm:p-6 relative">
              <!-- Close button - large touch target -->
              <button id="generated-sheet-close" type="button"
                class="absolute top-3 left-3 w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/30 active:bg-white/40 text-white text-2xl transition-all touch-manipulation"
                data-testid="generated-sheet-close"
                aria-label="إغلاق">
                <i class="fas fa-times pointer-events-none"></i>
              </button>

              <div class="pl-12">
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

    // Wire close events — use BOTH click and touch for max reliability
    const closeBtn = document.getElementById('generated-sheet-close');
    const overlay  = document.getElementById('generated-sheet-overlay');
    ['click', 'touchend'].forEach(ev => {
      closeBtn.addEventListener(ev, function (e) { e.preventDefault(); e.stopPropagation(); closeGeneratedSheet(); }, { passive: false });
      overlay.addEventListener(ev, function (e) { if (e.target === overlay) { e.preventDefault(); closeGeneratedSheet(); } }, { passive: false });
    });
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

    // 📍 Anchor scroll to modal smoothly
    setTimeout(() => {
      const modal = document.getElementById('generated-sheet-modal');
      if (modal) modal.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  function renderRequirements() {
    if (!currentGenerated) return;
    const list = document.getElementById('generated-sheet-list');
    if (!list) return;
    const { template, gender } = currentGenerated;

    // Top-tier executive doesn't swap (commercial track)
    const noSwap = template.genderLocked || template.forcedGender;
    const finalReqs = template.reqs.map((req) => {
      if (!noSwap && gender === 'female' && (req.includes('الوثائق العسكرية') || req.includes('مشروحات من القيادة'))) {
        return FEMALE_PERMISSION;
      }
      return req;
    });

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
    const finalReqs = template.reqs.map((r) =>
      !noSwap && gender === 'female' && (r.includes('الوثائق العسكرية') || r.includes('مشروحات من القيادة'))
        ? FEMALE_PERMISSION : r
    );
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
