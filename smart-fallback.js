/**
 * 🧠 Smart Fallback Search System (Task 12)
 * نظام الترشيح الكياني الذكي — يُولّد أوراق المهن المفقودة
 * عبر مطابقة الكلمات المفتاحية مع قوالب القطاعات
 * 
 * Saudia Visa Jordan — 2026
 * يتكامل مع: professions.js (الـ Gender Switch + النظام الموجود)
 */
(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // 📋 DOCUMENT TEMPLATES — قوالب الأوراق لكل تصنيف
  // ═══════════════════════════════════════════════════════════════
  const SECURITY = 'حسن سيرة وسلوك من المخابرات العامة (التقديم إلكتروني عبر موقع المخابرات العامة أو من خلال تطبيق سند)';
  const MILITARY = 'الوثائق العسكرية (مشروحات من القيادة العامة، كتاب من التعبئة / قسم شؤون الأفراد العنوان: طبربور دوار الدبابة) + دفتر خدمة العلم / بطاقة إنهاء الخدمة أو الإعفاء';
  const PASSPORT = 'إحضار جواز السفر و 6 صور شخصية بخلفية بيضاء حديثة لكافة المعاملات';
  const MEDICAL  = 'عمل فحص طبي من المختبر المعتمد لدى السفارة السعودية (صورة بخلفية بيضاء + جواز السفر)';
  const VACCINE  = 'شهادة مطعوم السحايا الرباعي';
  const BIO      = 'عمل فحص طبي وبصمة (يتم تحديده من قبل المكتب)';
  const AUTH     = 'عمل تفويض إلكتروني للمكتب';
  const CONTRACT = 'عقد عمل من الشركة السعودية + خطاب إطلاع مختومين من الغرفة التجارية والخارجية السعودية';
  const QVP      = 'الحصول على شهادة الاعتماد المهني (QVP) عبر منصة مساند';
  const ATTEST   = 'ملاحظة هامة جداً (التصديقات الخارجية): يجب تصديق جميع الأوراق الرسمية والشهادات المطلوبة أعلاه (مثل: حسن السيرة والسلوك) من وزارة الخارجية الأردنية قبل تقديمها';
  const DEGREE   = 'إحضار الشهادة الجامعية (الأصل) وكشف العلامات الأصل + تصديق من وزارة الخارجية';
  const EXP_GEN  = 'خبرة لمدة سنتين بنفس مسمى التأشيرة';
  const TRADE_REG = 'السجل التجاري السعودي ورخصة الاستثمار (يكون الاسم ظاهر بالسجل التجاري)';
  const INVEST_AUTH = 'التفويض من هيئة الاستثمار';

  // قوالب الأوراق (متطابقة مع منطق professions.json الحالي)
  const TEMPLATES = {
    executive: {
      label: 'مسار المستثمر / المدير العام (Executive Track)',
      icon: 'fa-crown',
      color: 'navy',
      reqs: [
        SECURITY,
        TRADE_REG,
        INVEST_AUTH,
        BIO,
        VACCINE,
        AUTH,
        PASSPORT,
        'ملاحظة هامة جداً: يستخدم هذا المسار للمستثمرين والمدراء التنفيذيين الذين يملكون أو يديرون كياناً رسمياً في السعودية. لا يلزم خدمة العلم أو الاعتماد المهني لهذا المستوى.'
      ]
    },
    specialist: {
      label: 'مسار الاختصاصي / المهندس / الخبير (Specialist Track)',
      icon: 'fa-user-graduate',
      color: 'gold',
      reqs: [
        SECURITY, MILITARY, DEGREE,
        'خبرة لا تقل عن 3 سنوات في نفس الاختصاص بنفس مسمى التأشيرة',
        MEDICAL, CONTRACT,
        'شهادة تصنيف مهني من الهيئة المختصة (هيئة المهندسين / هيئة المحاسبين / المجلس الطبي حسب الاختصاص)',
        QVP, VACCINE, BIO, AUTH, PASSPORT, ATTEST
      ]
    },
    supervisor: {
      label: 'مسار الإشراف / رئيس قسم (Supervisory Track)',
      icon: 'fa-user-tie',
      color: 'gold',
      reqs: [
        SECURITY, MILITARY, DEGREE,
        'خبرة لا تقل عن سنتين في موقع إشرافي أو قيادي',
        MEDICAL, CONTRACT, QVP, VACCINE, BIO, AUTH, PASSPORT, ATTEST
      ]
    },
    technical: {
      label: 'مسار الفنيين / الحرفيين (Technical Track)',
      icon: 'fa-tools',
      color: 'gold',
      reqs: [
        SECURITY, MILITARY,
        'شهادة مهنية أو دبلوم متوسط في الحرفة المطلوبة + كشف علامات + تصديق من وزارة التربية والتعليم الأردنية',
        EXP_GEN, MEDICAL, CONTRACT,
        'اختبار الكفاءة المهنية (QVP) لمزاولي الحرف الفنية — منصة مساند',
        'شهادة مزاولة مهنة رسمية (للحرف المنظمة كالكهرباء، السباكة، إلخ)',
        VACCINE, BIO, AUTH, PASSPORT, ATTEST
      ]
    },
    labor: {
      label: 'مسار العمالة التشغيلية والتعبئة (Labor Track)',
      icon: 'fa-people-carry-box',
      color: 'gold',
      reqs: [
        SECURITY, MILITARY,
        'شهادة دراسة (لا يشترط جامعية - يقبل ثانوي أو دبلوم) + تصديق من وزارة التربية والتعليم الأردنية',
        MEDICAL, CONTRACT,
        'اختبار الفحص المهني (QVP) للحرف اليدوية والتشغيلية حسب اشتراطات وزارة الموارد البشرية السعودية',
        VACCINE, BIO, AUTH, PASSPORT, ATTEST
      ]
    },
    medical: {
      label: 'مسار الأطباء والكوادر الصحية (Medical Sector Track)',
      icon: 'fa-stethoscope',
      color: 'navy',
      reqs: [
        SECURITY,
        MILITARY + ' — ' + PASSPORT,
        DEGREE,
        MEDICAL,
        'خبرة بنفس مسمى التأشيرة',
        CONTRACT,
        'شهادة التصنيف والتسجيل المهني من الهيئة السعودية للتخصصات الصحية (ممارس بلس)',
        'تقرير التحقق من الشهادات والخبرات المهنية (DataFlow Report)',
        VACCINE,
        AUTH,
        ATTEST
      ]
    },
    admin: {
      label: 'المسار الإداري والتجاري (Administrative Track)',
      icon: 'fa-briefcase',
      color: 'gold',
      reqs: [
        SECURITY, MILITARY, DEGREE, EXP_GEN,
        MEDICAL, CONTRACT, QVP, VACCINE,
        BIO, AUTH, PASSPORT, ATTEST
      ]
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // 🔍 KEYWORD MATCHING ENGINE (Entity Extraction)
  // الترتيب يهم: Rule A (Executive) أولاً لأنها أكثر تخصصاً
  // ═══════════════════════════════════════════════════════════════
  const RULES = [
    {
      id: 'executive', template: 'executive',
      keywords: ['رئيس تنفيذي', 'ceo', 'مستثمر', 'مدير عام', 'رئيس مجلس', 'رئيس شركة', 'مدير شريك']
    },
    {
      id: 'medical', template: 'medical',
      keywords: ['طبيب', 'دكتور', 'صيدلي', 'صيدلاني', 'أخصائي طب', 'استشاري طبي', 'جراح']
    },
    {
      id: 'specialist', template: 'specialist',
      keywords: ['أخصائي', 'اخصائي', 'مستشار', 'مهندس', 'خبير', 'محلل', 'استشاري', 'باحث']
    },
    {
      id: 'supervisor', template: 'supervisor',
      keywords: ['مشرف', 'رئيس قسم', 'مسؤول قسم', 'منسق', 'كبير']
    },
    {
      id: 'technical', template: 'technical',
      keywords: ['فني', 'ميكانيكي', 'كهربائي', 'حداد', 'نجار', 'سباك', 'صحي', 'لحام', 'مبرد', 'مكيف', 'صياغ']
    },
    {
      id: 'labor', template: 'labor',
      keywords: ['عامل', 'معاون', 'مساعد', 'حمّال', 'حمال', 'منظف', 'منظفة', 'سائق', 'حارس', 'بستاني', 'مزارع']
    },
    // Fallback admin if nothing matches
    {
      id: 'admin', template: 'admin',
      keywords: ['موظف', 'إداري', 'سكرتير', 'محاسب', 'مدير', 'مدخل بيانات', 'كاتب']
    }
  ];

  function normalize(text) {
    if (!text) return '';
    return String(text).trim()
      .replace(/[أإآ]/g, 'ا')
      .replace(/[ةه]/g, 'ه')
      .replace(/ى/g, 'ي')
      .toLowerCase();
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
    return null;
  }

  // ═══════════════════════════════════════════════════════════════
  // 🎨 UI: Smart Fallback Section (يُضاف داخل noResults)
  // ═══════════════════════════════════════════════════════════════
  function injectFallbackUI() {
    const noResults = document.getElementById('noResults');
    if (!noResults || document.getElementById('smart-fallback')) return;

    const html = `
      <div id="smart-fallback" class="mt-6 max-w-2xl mx-auto" data-testid="smart-fallback">
        <button id="smart-fallback-trigger" type="button"
          class="w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-navy to-navy/90 hover:from-gold hover:to-gold/90 text-white font-bold rounded-2xl shadow-xl transition-all hover:scale-[1.02]"
          data-testid="smart-fallback-trigger">
          <i class="fas fa-magic-wand-sparkles text-2xl"></i>
          <span class="text-lg">لم تجد مهنتك الدقيقة؟ اضغط هنا للتوليد الفوري</span>
        </button>

        <div id="smart-fallback-panel" class="hidden mt-6 bg-white border-2 border-gold/40 rounded-2xl p-6 shadow-xl text-right" data-testid="smart-fallback-panel">
          <label for="smart-fallback-input" class="block text-navy font-bold mb-3 text-lg">
            <i class="fas fa-keyboard text-gold ml-2"></i>
            اكتب مسمى المهنة كما هو مذكور في تأشيرتك بالضبط:
          </label>
          <input id="smart-fallback-input" type="text"
            placeholder="مثال: أخصائي تسويق رقمي / مشرف إنتاج / فني صيانة..."
            class="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:border-gold transition-colors text-right"
            data-testid="smart-fallback-input"
            dir="rtl" />

          <div class="mt-3 text-sm text-gray-500">
            <i class="fas fa-info-circle text-gold ml-1"></i>
            النظام سيكتشف نوع المهنة تلقائياً ويعرض الأوراق المطلوبة الصحيحة
          </div>

          <button id="smart-fallback-generate" type="button"
            class="mt-5 w-full sm:w-auto px-8 py-4 bg-gold hover:bg-gold/90 text-white font-bold rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2"
            data-testid="smart-fallback-generate">
            <i class="fas fa-bolt"></i>
            <span>توليد أوراق المهنة الآن</span>
          </button>
        </div>
      </div>
    `;

    noResults.insertAdjacentHTML('beforeend', html);

    // Event handlers
    document.getElementById('smart-fallback-trigger').addEventListener('click', function () {
      const panel = document.getElementById('smart-fallback-panel');
      panel.classList.toggle('hidden');
      if (!panel.classList.contains('hidden')) {
        // Auto-fill with current search input if available
        const search = document.getElementById('searchInput');
        const input = document.getElementById('smart-fallback-input');
        if (search && search.value && !input.value) {
          input.value = search.value;
        }
        input.focus();
      }
    });

    document.getElementById('smart-fallback-generate').addEventListener('click', generateFromInput);
    document.getElementById('smart-fallback-input').addEventListener('keypress', function (e) {
      if (e.key === 'Enter') generateFromInput();
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

    const match = matchTemplate(userTitle) || RULES[RULES.length - 1]; // fallback to admin
    const template = TEMPLATES[match.template];

    showGeneratedSheet(userTitle, template, match);
  }

  // ═══════════════════════════════════════════════════════════════
  // 📄 GENERATED SHEET MODAL (يدعم Gender Switch)
  // ═══════════════════════════════════════════════════════════════
  let currentGenerated = null;

  function showGeneratedSheet(userTitle, template, match) {
    // Build the modal (reuse existing professionModal styling if possible)
    let modal = document.getElementById('generated-sheet-modal');
    if (modal) modal.remove();

    currentGenerated = { userTitle, template, match, gender: 'male' };

    const html = `
      <div id="generated-sheet-modal" class="fixed inset-0 z-50 overflow-y-auto" data-testid="generated-sheet-modal">
        <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 sm:p-0">
          <div class="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" id="generated-sheet-overlay"></div>

          <div class="relative inline-block w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden text-right align-middle my-8" dir="rtl">
            <!-- Header -->
            <div class="bg-gradient-to-l from-navy to-navy/90 text-white p-6">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1">
                  <div class="inline-flex items-center gap-2 bg-gold/20 text-gold px-3 py-1 rounded-full text-xs font-bold mb-2">
                    <i class="fas ${template.icon}"></i>
                    <span>${escapeHtml(template.label)}</span>
                  </div>
                  <h2 class="text-2xl sm:text-3xl font-bold mb-2" data-testid="generated-sheet-title">
                    ${escapeHtml(userTitle)}
                  </h2>
                  <p class="text-sm text-gray-300">
                    <i class="fas fa-magic text-gold ml-1"></i>
                    تم توليد هذه الأوراق ذكياً بناءً على نوع المهنة. للتأكيد النهائي تواصل مع المكتب.
                  </p>
                </div>
                <button id="generated-sheet-close" class="text-white/70 hover:text-white text-2xl" data-testid="generated-sheet-close" aria-label="إغلاق">
                  <i class="fas fa-times-circle"></i>
                </button>
              </div>

              <!-- Gender Switcher -->
              <div class="mt-4 bg-white/10 rounded-xl p-3 flex items-center justify-between gap-4" data-testid="generated-gender-switcher">
                <span class="text-sm font-semibold text-white/90">
                  <i class="fas fa-venus-mars text-gold ml-2"></i>
                  جنس المتقدم:
                </span>
                <div class="flex gap-2">
                  <button data-gender="male" class="gender-btn px-4 py-2 rounded-lg font-bold text-sm transition-all bg-gold text-white" data-testid="gender-male">
                    <i class="fas fa-mars ml-1"></i> ذكر
                  </button>
                  <button data-gender="female" class="gender-btn px-4 py-2 rounded-lg font-bold text-sm transition-all bg-white/20 text-white hover:bg-white/30" data-testid="gender-female">
                    <i class="fas fa-venus ml-1"></i> أنثى
                  </button>
                </div>
              </div>
            </div>

            <!-- Body -->
            <div class="p-6 max-h-[60vh] overflow-y-auto">
              <h3 class="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                <i class="fas fa-clipboard-list text-gold"></i>
                الأوراق والمستندات المطلوبة:
              </h3>
              <ol id="generated-sheet-list" class="space-y-3 text-gray-800 leading-relaxed" data-testid="generated-sheet-list">
              </ol>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 p-5 flex flex-col sm:flex-row gap-3 justify-between items-stretch border-t">
              <a href="https://wa.me/962789881009?text=${encodeURIComponent('مرحباً، أحتاج للاستفسار عن مهنة: ' + userTitle)}"
                 target="_blank" rel="noopener"
                 class="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition"
                 data-testid="generated-whatsapp-btn">
                <i class="fab fa-whatsapp text-xl"></i>
                <span>تأكيد عبر واتساب</span>
              </a>
              <button id="generated-print-btn" type="button"
                class="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-navy hover:bg-navy/90 text-white font-bold rounded-xl transition"
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
    renderRequirements();

    // Event handlers
    document.getElementById('generated-sheet-close').onclick = closeGeneratedSheet;
    document.getElementById('generated-sheet-overlay').onclick = closeGeneratedSheet;
    document.getElementById('generated-print-btn').onclick = printGeneratedSheet;
    document.querySelectorAll('#generated-sheet-modal .gender-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        currentGenerated.gender = this.dataset.gender;
        // Update button styling
        document.querySelectorAll('#generated-sheet-modal .gender-btn').forEach(b => {
          if (b.dataset.gender === currentGenerated.gender) {
            b.classList.remove('bg-white/20', 'text-white');
            b.classList.add('bg-gold', 'text-white');
          } else {
            b.classList.remove('bg-gold');
            b.classList.add('bg-white/20', 'text-white');
          }
        });
        renderRequirements();
      });
    });

    // Track in FB Pixel
    try {
      if (window.fbq) {
        window.fbq('trackCustom', 'SmartFallbackGenerate', {
          user_title: userTitle,
          matched_template: match.template,
          matched_keyword: match.matched_keyword || 'none'
        });
        window.fbq('track', 'Lead', { content_name: 'Smart Fallback Profession: ' + userTitle });
      }
    } catch (e) { /* silent */ }
  }

  function renderRequirements() {
    if (!currentGenerated) return;
    const list = document.getElementById('generated-sheet-list');
    if (!list) return;
    const { template, gender } = currentGenerated;
    const FEMALE_PERMISSION = 'عدم ممانعة من ولي الأمر (في حالة كانت متزوجة إحضار شهادة الزواج وعدم الممانعة من الزوج + صورة عن جواز سفر الزوج) (في حال كانت عزباء، إحضار عدم ممانعة من ولي الأمر + قيد فردي + صورة عن جواز سفر ولي الأمر)';

    // Top-tier (Executive) — no gender swap (uses commercial track)
    const isTopTier = template === TEMPLATES.executive;

    const finalReqs = template.reqs.map((req) => {
      if (!isTopTier && gender === 'female' && (req.includes('الوثائق العسكرية') || req.includes('مشروحات من القيادة'))) {
        return FEMALE_PERMISSION;
      }
      return req;
    });

    list.innerHTML = finalReqs.map((r, i) => {
      const isNote = r.includes('ملاحظة هامة');
      const cls = isNote
        ? 'bg-blue-50 border border-blue-200 text-blue-900 p-4 rounded-lg flex gap-3'
        : 'bg-gray-50 border border-gray-100 p-3 rounded-lg flex gap-3 hover:bg-gold/5 transition';
      const icon = isNote
        ? '<i class="fas fa-info-circle text-blue-500 text-lg mt-0.5"></i>'
        : `<span class="flex-shrink-0 w-7 h-7 bg-gold/15 text-gold rounded-full font-bold text-sm flex items-center justify-center">${i + 1}</span>`;
      return `<li class="${cls}">${icon}<div class="flex-1">${escapeHtml(r)}</div></li>`;
    }).join('');
  }

  function closeGeneratedSheet() {
    const modal = document.getElementById('generated-sheet-modal');
    if (modal) modal.remove();
    currentGenerated = null;
  }

  function printGeneratedSheet() {
    if (!currentGenerated) return;
    const { userTitle, template, gender } = currentGenerated;
    const FEMALE_PERMISSION = 'عدم ممانعة من ولي الأمر (في حالة كانت متزوجة إحضار شهادة الزواج وعدم الممانعة من الزوج + صورة عن جواز سفر الزوج) (في حال كانت عزباء، إحضار عدم ممانعة من ولي الأمر + قيد فردي + صورة عن جواز سفر ولي الأمر)';
    const isTopTier = template === TEMPLATES.executive;
    const finalReqs = template.reqs.map((r) =>
      !isTopTier && gender === 'female' && (r.includes('الوثائق العسكرية') || r.includes('مشروحات من القيادة'))
        ? FEMALE_PERMISSION : r
    );

    // Use existing printProfessionDocument if available
    if (typeof window.printProfessionDocument === 'function') {
      window.printProfessionDocument('AUTO', userTitle + ' (تم التوليد التلقائي)', finalReqs);
    } else {
      // Fallback simple print
      const win = window.open('', '_blank');
      win.document.write(`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>${userTitle}</title><style>body{font-family:Tajawal,Arial,sans-serif;padding:20px;direction:rtl}h1{color:#1B2A41}li{margin:10px 0;padding:10px;background:#f9f9f9;border-radius:8px}</style></head><body><h1>${userTitle}</h1><ol>${finalReqs.map(r => `<li>${r}</li>`).join('')}</ol></body></html>`);
      win.document.close();
      setTimeout(() => win.print(), 500);
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
    injectFallbackUI();
    // Observe in case noResults is dynamically toggled
    const observer = new MutationObserver(() => injectFallbackUI());
    const target = document.getElementById('noResults');
    if (target) observer.observe(target, { attributes: true, childList: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging
  window.smartFallback = { matchTemplate, TEMPLATES, RULES };
})();
