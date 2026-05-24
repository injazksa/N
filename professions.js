let professionsData = [];
let filteredData = [];
let renderedCount = 0;
const BATCH_SIZE = 30;
let currentProfession = null;

// Load professions data on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProfessions();
    
    // Search input event listener
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterProfessions, 300));
    }
    
    // Category filter event listener
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProfessions);
    }

    // Gender filter event listener
    const genderFilter = document.getElementById('genderFilter');
    if (genderFilter) {
        genderFilter.addEventListener('change', filterProfessions);
    }

    // ⚡ Event delegation للكروت
    const grid = document.getElementById('professionsGrid');
    if (grid) {
        grid.addEventListener('click', function(e) {
            const card = e.target.closest('[data-prof-idx]');
            if (!card) return;
            const idx = parseInt(card.dataset.profIdx, 10);
            const source = filteredData.length ? filteredData : professionsData;
            if (source[idx]) showProfessionDetails(source[idx]);
        });
    }
});

// Load professions from JSON file
async function loadProfessions() {
    try {
        const response = await fetch('professions.json');
        const data = await response.json();
        professionsData = data;
        filteredData = data;
        
        displayProfessions(professionsData);
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('professionsGrid').classList.remove('hidden');
    } catch (error) {
        console.error('Error loading professions:', error);
    }
}

// Normalize Arabic text for better search
function normalizeArabic(text) {
    if (!text) return '';
    return text
        .replace(/[أإآ]/g, 'ا')
        .replace(/[ةه]/g, 'ه')
        .replace(/ى/g, 'ي')
        .toLowerCase()
        .trim();
}

// 🧠 AI-Logic: Classify ANY profession and get requirements
function classifyProfession(inputName) {
    const normName = normalizeArabic(inputName);
    
    // التحقق من الكلمات العبثية أو غير المنطقية
    const nonsensicalPatterns = [
        "انا", "مين", "شو", "وين", "ليش", "مش", "انت", "لا", "ميسي", "رونالدو", "بطيخ", 
        "كلب", "حيوان", "حمار", "خيل", "ابن", "ملعون", "طيز", "منيك", "شرموط", "عرص"
    ];
    
    if (nonsensicalPatterns.some(p => normName.includes(p)) || normName.length < 3) {
        return null; // سيتم التعامل معه كمدخل غير صالح
    }

    // المتطلبات الأساسية
    let reqs = [
        "حسن سيرة وسلوك من المخابرات العامة (التقديم إلكتروني عبر موقع المخابرات العامة أو من خلال تطبيق سند)",
        "الوثائق العسكرية (مشروحات من القيادة العامة، كتاب من التعبئة / قسم شؤون الأفراد العنوان: طبربور دوار الدبابة يكون معك دفتر خدمة العلم / بطاقة إنهاء الخدمة أو الإعفاء) إحضار جواز السفر و 6 صور شخصية بخلفية بيضاء حديثة لكافة المعاملات",
        "عمل فحص طبي وبصمة (يتم تحديده من قبل المكتب)",
        "عقد عمل من الشركة السعودية + خطاب إطلاع مختومين من الغرفة التجارية والخارجية السعودية",
        "عمل تفويض إلكتروني للمكتب",
        "شهادة مطعوم السحايا الرباعي",
        "ملاحظة هامة جداً (التصديقات الخارجية): يجب تصديق جميع الأوراق الرسمية والشهادات المطلوبة أعلاه من وزارة الخارجية الأردنية قبل تقديمها"
    ];

    let category = "أخرى";

    // تصنيف ذكي بناءً على المسمى
    if (normName.includes("مدير") || normName.includes("رئيس") || normName.includes("مسؤول")) {
        category = "كبار المسؤولين والمدراء";
        reqs.splice(2, 0, "إحضار الشهادة الجامعية (الأصل) وكشف العلامات الأصل", "خبرة لمدة سنتين بنفس مسمى التأشيرة");
    } else if (normName.includes("مهندس")) {
        category = "اختصاصيو العلوم والهندسة";
        reqs.splice(2, 0, "إحضار الشهادة الجامعية (الأصل) وكشف العلامات الأصل", "خبرة لمدة سنتين بنفس مسمى التأشيرة", "الحصول على شهادة الاعتماد المهني");
    } else if (normName.includes("طبيب") || normName.includes("دكتور") || normName.includes("ممرض") || normName.includes("صيدلي")) {
        category = "اختصاصيو الصحة";
        reqs.splice(2, 0, "إحضار الشهادة الجامعية (الأصل) وكشف العلامات الأصل", "خبرة لمدة سنتين بنفس مسمى التأشيرة", "الحصول على شهادة الاعتماد المهني (ممارس بلس) و DataFlow");
    } else if (normName.includes("اخصائي") || normName.includes("مستشار") || normName.includes("خبير")) {
        category = "الاختصاصيون";
        reqs.splice(2, 0, "إحضار الشهادة الجامعية (الأصل) وكشف العلامات الأصل", "خبرة لمدة سنتين بنفس مسمى التأشيرة", "الحصول على شهادة الاعتماد المهني");
    } else if (normName.includes("مندوب مشتريات")) {
        category = "مندوبون";
        reqs.splice(2, 0, "إحضار الشهادة الجامعية (الأصل) وكشف العلامات الأصل", "خبرة لمدة سنتين بنفس مسمى التأشيرة");
    } else if (normName.includes("مراقب جوده") || normName.includes("مساعد اداري")) {
        category = "القطاع الإداري";
        reqs.splice(2, 0, "إحضار شهادة الثانوية العامة (الأصل)", "خبرة لمدة سنة واحدة بنفس مسمى التأشيرة");
    } else if (normName.includes("بائع") || normName.includes("منسق زهور") || normName.includes("كاشير")) {
        category = "مزاولو البيع";
        reqs.splice(2, 0, "إحضار شهادة مدرسية (الصف العاشر)", "خبرة لمدة سنة واحدة بنفس مسمى التأشيرة");
    } else if (normName.includes("حلاق") || normName.includes("طاهي") || normName.includes("شيف") || normName.includes("مصفف شعر")) {
        category = "مزاولو الخدمات الشخصية";
        reqs.splice(2, 0, "إحضار شهادة مدرسية (الصف العاشر)", "خبرة لمدة سنة واحدة بنفس مسمى التأشيرة", "الحصول على شهادة الاعتماد المهني ومزاولة المهنة");
    } else if (normName.includes("سائق")) {
        category = "مشغلو وسائل النقل";
        reqs.splice(2, 0, "رخصة سياقة سارية المفعول (مختومة من السفارة)", "فحص طبي خاص بالسائقين");
    } else if (normName.includes("عامل") || normName.includes("مساعد") || normName.includes("فني")) {
        category = "القطاع الفني والعمالي";
        reqs.splice(2, 0, "إحضار شهادة مدرسية (وليس ثانوية أو دبلوم)");
    }

    return {
        name_ar: inputName,
        profession_name_ar: inputName,
        code: "---",
        category: category,
        requirements: reqs,
        isAiGenerated: true
    };
}

// Filter professions based on search
function filterProfessions() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const selectedCategory = document.getElementById('categoryFilter').value;
    
    let filtered = professionsData;
    
    if (searchTerm) {
        const normalizedSearch = normalizeArabic(searchTerm);
        filtered = professionsData.filter(profession => {
            const name = normalizeArabic(profession.profession_name_ar || profession.name || '');
            const code = (profession.profession_code || profession.code || '').toLowerCase();
            return name.includes(normalizedSearch) || code.includes(searchTerm.toLowerCase());
        });

        // 🧠 إذا لم يتم العثور على نتائج، نستخدم الذكاء لتصنيف المهنة
        if (filtered.length === 0) {
            const aiProfession = classifyProfession(searchTerm);
            if (aiProfession) {
                displayProfessions([aiProfession]);
                return;
            }
        }
    }
    
    if (selectedCategory && selectedCategory !== 'all') {
        filtered = filtered.filter(p => (p.category || 'أخرى') === selectedCategory);
    }
    
    displayProfessions(filtered);
}

function displayProfessions(professions) {
    const grid = document.getElementById('professionsGrid');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');
    
    filteredData = professions;
    renderedCount = 0;
    
    if (professions.length === 0) {
        grid.classList.add('hidden');
        noResults.classList.remove('hidden');
        resultsCount.textContent = '0';
        removeLoadMoreButton();
        return;
    }
    
    grid.classList.remove('hidden');
    noResults.classList.add('hidden');
    resultsCount.textContent = professions.length;
    
    grid.innerHTML = '';
    renderBatch(professions);
}

function renderBatch(professions) {
    const grid = document.getElementById('professionsGrid');
    const end = Math.min(renderedCount + BATCH_SIZE, professions.length);
    const slice = professions.slice(renderedCount, end);
    
    const frag = document.createDocumentFragment();
    const temp = document.createElement('div');
    temp.innerHTML = slice.map((p, i) => createProfessionCard(p, renderedCount + i)).join('');
    while (temp.firstChild) frag.appendChild(temp.firstChild);
    grid.appendChild(frag);
    
    renderedCount = end;
    updateLoadMoreButton(professions);
}

function createProfessionCard(profession, index) {
    const name = profession.profession_name_ar || profession.name_ar || 'غير محدد';
    const code = profession.code || '---';
    const cat = profession.category || 'أخرى';
    const isAi = profession.isAiGenerated;

    return `
    <div class="bg-white rounded-2xl p-6 border ${isAi ? 'border-gold bg-gold/5' : 'border-gray-100'} hover:border-gold hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer group profession-card"
    data-prof-idx="${index}">
    <div class="flex items-start justify-between mb-4">
    <div class="flex-1">
    ${isAi ? '<span class="text-[10px] bg-gold text-white px-2 py-0.5 rounded-full mb-2 inline-block">تحليل ذكي</span>' : ''}
    <h3 class="text-xl font-bold text-navy mb-2 group-hover:text-gold transition-colors line-clamp-2">
    ${escapeHtml(name)}
    </h3>
    <div class="flex items-center gap-2 text-sm text-gray-600">
    <span class="px-3 py-1 bg-gold/10 text-gold rounded-full font-semibold">${escapeHtml(code)}</span>
    <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">${escapeHtml(cat)}</span>
    </div>
    </div>
    <div class="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-colors">
    <i class="fas ${isAi ? 'fa-magic' : 'fa-briefcase'} text-gold group-hover:text-white text-xl transition-colors"></i>
    </div>
    </div>
    <div class="pt-4 border-t border-gray-100">
    <div class="flex items-center justify-between text-sm">
    <span class="text-gray-600"><i class="fas fa-file-alt text-gold ml-1"></i> الأوراق المطلوبة</span>
    <span class="text-gold font-semibold flex items-center gap-2">عرض التفاصيل <i class="fas fa-arrow-left"></i></span>
    </div>
    </div>
    </div>
    `;
}

function showProfessionDetails(profession) {
    const name = profession.profession_name_ar || profession.name_ar;
    const code = profession.code;
    let requirements = profession.requirements || [];
    
    // Gender Logic
    const selectedGender = document.getElementById('genderFilter').value;
    const seniorPositions = ['مدير', 'رئيس', 'تنفيذي', 'مهندس', 'طبيب'];
    const isSenior = seniorPositions.some(pos => name.includes(pos));

    if (selectedGender === 'female' && !isSenior) {
        const femaleReq = "عدم ممانعة من ولي الأمر (للمتزوجة: شهادة زواج + عدم ممانعة الزوج + صورة جوازه) (للعزباء: عدم ممانعة ولي الأمر + قيد فردي + صورة جوازه)";
        const milIdx = requirements.findIndex(r => r.includes("الوثائق العسكرية"));
        if (milIdx !== -1) requirements[milIdx] = femaleReq;
        else requirements.splice(1, 0, femaleReq);
    }

    document.getElementById('modalProfessionName').textContent = name;
    document.getElementById('modalProfessionCode').textContent = code;
    document.getElementById('modalRequirementsList').innerHTML = requirements.map(req => `<li class="py-2 border-b border-gray-100 last:border-0">${req}</li>`).join('');
    
    const modal = document.getElementById('professionModal');
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeProfessionModal() {
    document.getElementById('professionModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

function updateLoadMoreButton(professions) {
    let btn = document.getElementById('loadMoreBtn');
    if (renderedCount >= professions.length) { if (btn) btn.remove(); return; }
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'loadMoreBtn';
        btn.className = 'mx-auto mt-8 px-8 py-4 bg-gold text-white rounded-xl font-bold shadow-lg flex items-center gap-3';
        btn.addEventListener('click', () => renderBatch(filteredData));
        document.getElementById('professionsGrid').parentNode.insertBefore(btn, document.getElementById('professionsGrid').nextSibling);
    }
    btn.innerHTML = `<i class="fas fa-plus-circle"></i> تحميل المزيد`;
}

function removeLoadMoreButton() {
    const btn = document.getElementById('loadMoreBtn');
    if (btn) btn.remove();
}

function escapeHtml(s) {
    if (s == null) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
