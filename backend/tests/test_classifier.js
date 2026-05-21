/**
 * Regression test suite for Universal Semantic Classifier v3.0
 * Run: node /app/backend/tests/test_classifier.js
 */
const fs = require('fs');
const path = require('path');

// Mock DOM globals so the IIFE runs without errors in Node.
const noop = () => {};
const makeNode = () => new Proxy({
  addEventListener: noop, removeEventListener: noop, appendChild: noop,
  insertBefore: noop, insertAdjacentHTML: noop, querySelectorAll: () => [],
  querySelector: () => null, classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
  style: {}, dataset: {}, parentNode: null, focus: noop, scrollIntoView: noop,
  value: '', innerHTML: '', textContent: '', children: [],
  setAttribute: noop, getAttribute: () => null, remove: noop,
  click: noop, dispatchEvent: noop
}, { get: (t, p) => p in t ? t[p] : (typeof t[p] === 'function' ? noop : undefined) });

global.document = {
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  createElement: () => makeNode(),
  addEventListener: noop,
  removeEventListener: noop,
  body: makeNode(),
  readyState: 'complete',
  documentElement: makeNode()
};
global.window = {
  smartFallback: null,
  fbq: null,
  printProfessionDocument: null
};

// Load the script — it self-registers window.smartFallback
const src = fs.readFileSync(path.join(__dirname, '../../smart-fallback.js'), 'utf8');
eval(src);

const { matchTemplate } = global.window.smartFallback;

const cases = [
  // === COMPLIANCE TIER ===
  { input: 'طبيب أسنان عام',         template: 'medical',          tier: 'compliance' },
  { input: 'صيدلانية',                template: 'medical',          tier: 'compliance' },
  { input: 'ممرض',                    template: 'medical',          tier: 'compliance' },
  { input: 'سائق خاص',                template: 'driver',           tier: 'compliance' },
  { input: 'مربية أطفال',             template: 'domestic_female',  tier: 'compliance' },
  { input: 'عاملة منزلية',            template: 'domestic_female',  tier: 'compliance' },
  { input: 'عامل منزلي',              template: 'domestic_male',    tier: 'compliance' },

  // === TIER 1: ACADEMIC & MANAGEMENT (Specialist) ===
  { input: 'أخصائي تسويق',            template: 'specialist',       tier: 'management' },
  { input: 'مهندس مدني',               template: 'specialist',       tier: 'management' },
  { input: 'مستشار قانوني',            template: 'specialist',       tier: 'management' },
  { input: 'خبير اقتصادي',             template: 'specialist',       tier: 'management' },
  { input: 'محلل بيانات',              template: 'specialist',       tier: 'management' },
  { input: 'دكتور جامعي',              template: 'specialist',       tier: 'management' },
  { input: 'نائب مدير',                template: 'specialist',       tier: 'management' },
  { input: 'مدير مشروع',               template: 'specialist',       tier: 'management' },
  { input: 'رئيس فريق المبيعات',       template: 'specialist',       tier: 'management' },

  // === EXECUTIVE ===
  { input: 'رئيس تنفيذي',              template: 'executive',        tier: 'management' },
  { input: 'CEO',                       template: 'executive',        tier: 'management' },
  { input: 'مدير عام',                  template: 'executive',        tier: 'management' },
  { input: 'رئيس مجلس إدارة',          template: 'executive',        tier: 'management' },
  { input: 'نائب رئيس تنفيذي',         template: 'executive',        tier: 'management' },

  // === TIER 2: SUPERVISORY / TECHNICAL ===
  { input: 'رئيس قسم المحاسبة',        template: 'supervisor',       tier: 'supervisory' },
  { input: 'مشرف إنتاج',                template: 'supervisor',       tier: 'supervisory' },
  { input: 'مراقب جودة',                template: 'supervisor',       tier: 'supervisory' },
  { input: 'فني صيانة سيارات',         template: 'technical',        tier: 'supervisory' },
  { input: 'ميكانيكي',                  template: 'technical',        tier: 'supervisory' },
  { input: 'كهربائي مباني',             template: 'technical',        tier: 'supervisory' },
  { input: 'لحام',                       template: 'technical',        tier: 'supervisory' },

  // === TIER 3: VOCATIONAL / LABOR ===
  { input: 'عامل بناء',                 template: 'labor',            tier: 'vocational' },
  { input: 'مساعد طاهي',                template: 'labor',            tier: 'vocational' },
  { input: 'سائس خيول',                 template: 'labor',            tier: 'vocational' },
  { input: 'طاهي',                       template: 'labor',            tier: 'vocational' },
  { input: 'حلاق رجالي',                template: 'labor',            tier: 'vocational' },
  { input: 'بائع متجول',                template: 'labor',            tier: 'vocational' },
  { input: 'خياط',                       template: 'labor',            tier: 'vocational' },

  // === ADMIN ===
  { input: 'محاسب قانوني',              template: 'admin',            tier: 'management' },
  { input: 'سكرتيرة تنفيذية',           template: 'admin',            tier: 'management' },
  { input: 'موظف استقبال',              template: 'admin',            tier: 'management' },

  // === UNIVERSAL SAFE FALLBACK ===
  { input: 'مايسترو',                   template: 'general',          tier: 'fallback' },
  { input: 'دي جي حفلات',               template: 'general',          tier: 'fallback' },
  { input: 'رائد فضاء',                 template: 'general',          tier: 'fallback' },
  { input: 'مدرّب يوغا',                 template: 'general',          tier: 'fallback' },
  { input: '',                          template: 'general',          tier: 'fallback' },
];

let pass = 0, fail = 0;
const failures = [];
for (const c of cases) {
  const m = matchTemplate(c.input);
  const okT = m.template === c.template;
  const okR = m.tier === c.tier;
  if (okT && okR) {
    pass++;
  } else {
    fail++;
    failures.push({ input: c.input, expected: `${c.template}/${c.tier}`, got: `${m.template}/${m.tier} (kw="${m.matched_keyword || '-'}")` });
  }
}

console.log(`\n📊 Universal Classifier Test Results`);
console.log(`   ✅ Pass: ${pass}/${cases.length}`);
console.log(`   ❌ Fail: ${fail}/${cases.length}`);
if (failures.length) {
  console.log(`\nFAILURES:`);
  for (const f of failures) {
    console.log(`  • input="${f.input}"  expected=${f.expected}  got=${f.got}`);
  }
  process.exit(1);
} else {
  console.log(`\n🎉 All ${cases.length} semantic mappings correct!`);
}
