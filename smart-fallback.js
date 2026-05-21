/**
 * 🧠 Smart Fallback Search System (Task 12 + Hotfix)
 * Saudia Visa Jordan — 2026
 *
 * Features:
 *  - Entity-based keyword matching (7 templates)
 *  - Forced templates for Domestic/Driving (no Specialist fallback)
 *  - Pre-search gender selector
 *  - Mobile-optimized UI (touch-safe X, smooth-scroll anchor)
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
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 🔍 ENHANCED RULE ENGINE — ORDERED BY SPECIFICITY
  // (HOTFIX: Domestic/Driving rules come FIRST, block higher tiers)
  // ═══════════════════════════════════════════════════════════════
  const RULES = [
    // === HIGHEST PRIORITY: Domestic & Driving (block specialist/manager) ===
    {
      id: 'domestic_female', template: 'domestic_female',
      keywords: ['مربية', 'عاملة منزلية', 'خادمة', 'مدبرة منزل', 'مربيه', 'عامله منزليه']
    },
    {
      id: 'domestic_male', template: 'domestic_male',
      keywords: ['عامل منزلي', 'خادم منزلي', 'عامل خدمة منزلية']
    },
    {
      id: 'driver', template: 'driver',
      keywords: ['سائق', 'ساءق', 'سائق خاص', 'سائق عائلة', 'سائق سيارة']
    },
    // Executive (top-tier)
    {
      id: 'executive', template: 'executive',
      keywords: ['رئيس تنفيذي', 'ceo', 'مستثمر', 'مدير عام', 'رئيس مجلس', 'رئيس شركة', 'مدير شريك']
    },
    // Medical
    {
      id: 'medical', template: 'medical',
      keywords: ['طبيب', 'دكتور', 'صيدلي', 'صيدلاني', 'استشاري طبي', 'جراح', 'طبيبه']
    },
    // Specialist (degree-required)
    {
      id: 'specialist', template: 'specialist',
      keywords: ['أخصائي', 'اخصائي', 'مستشار', 'مهندس', 'خبير', 'محلل', 'استشاري', 'باحث']
    },
    // Supervisor
    {
      id: 'supervisor', template: 'supervisor',
      keywords: ['مشرف', 'رئيس قسم', 'مسؤول قسم', 'منسق', 'كبير']
    },
    // Technical / Artisan
    {
      id: 'technical', template: 'technical',
      keywords: ['فني', 'ميكانيكي', 'كهربائي', 'حداد', 'نجار', 'سباك', 'صحي', 'لحام', 'مبرد', 'مكيف', 'صياغ', 'تركيب', 'صيانة']
    },
    // Labor / Operational (default for any vocational)
    {
      id: 'labor', template: 'labor',
      keywords: ['عامل', 'معاون', 'مساعد', 'حمّال', 'حمال', 'منظف', 'منظفه', 'منظفة', 'حارس', 'بستاني', 'مزارع', 'سائس', 'راعي', 'عاملة']
    },
    // Admin (true office worker — last fallback)
    {
      id: 'admin', template: 'admin',
      keywords: ['موظف', 'إداري', 'سكرتير', 'محاسب', 'مدير', 'مدخل بيانات', 'كاتب']
    }
  ];

  function normalize(t) {
    if (!t) return '';
    return String(t).trim().replace(/[أإآ]/g, 'ا').replace(/[ةه]/g, 'ه').replace(/ى/g, 'ي').toLowerCase();
  }

  function matchTemplate(userTitle) {
    const norm = normalize(userTitle);
    if (!norm) return null;
    for (const rule of RULES) {
      for (const kw of rule.keywords) {
        if (norm.includes(normalize(kw))) {
          return { ...rule, matched_keyword: kw };
        }
      }
    }
    // ⚠️ HOTFIX: any unmatched vocational query falls to LABOR (not specialist)
    return { id: 'labor', template: 'labor', matched_keyword: 'default-vocational' };
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
