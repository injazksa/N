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

// Custom Alert Functions
function showCustomAlert(message, duration = 5000) {
    const container = document.getElementById('customAlertContainer');
    const msgElement = document.getElementById('customAlertMessage');
    if (!container || !msgElement) return;
    
    msgElement.textContent = message;
    container.classList.remove('opacity-0', '-translate-y-4');
    container.classList.add('opacity-100', 'translate-y-0');
    
    if (window._alertTimeout) clearTimeout(window._alertTimeout);
    window._alertTimeout = setTimeout(hideCustomAlert, duration);
}

function hideCustomAlert() {
    const container = document.getElementById('customAlertContainer');
    if (!container) return;
    container.classList.add('opacity-0', '-translate-y-4');
    container.classList.remove('opacity-100', 'translate-y-0');
}

// Normalize Arabic text for better search
function normalizeArabic(text) {
    if (!text) return '';
    return text
        .replace(/[أإآ]/g, 'ا')
        .replace(/[ةه]/g, 'ه')
        .replace(/ى/g, 'ي')
        .replace(/[ـ]/g, '')        // strip tatweel
        .replace(/\s+/g, ' ')       // collapse whitespace
        .toLowerCase()
        .trim();
}

// 🚫 GIBBERISH FILTER (ANTI-ABUSE)
function isGibberish(input) {
    const norm = normalizeArabic(input);
    if (!norm || norm.length < 3) return true;
    
    // Reject pure numeric / punctuation
    if (!/[\u0600-\u06FFa-z]/.test(norm)) return true;

    const nonsensicalPatterns = [
        "انا", "مين", "شو", "وين", "ليش", "مش", "انت", "لا", "ميسي", "رونالدو", "بطيخ", 
        "كلب", "حيوان", "حمار", "خيل", "ابن", "ملعون", "طيز", "منيك", "شرموط", "عرص",
        "asd", "qwe", "zxc", "123", "مطرب", "مغني", "فنان", "سعفون", "جربان", "جرابين",
        "قحبة", "كس", "شلن", "مرا الملعون", "الشراميط", "المنيك", "طيزري"
    ];
    
    if (nonsensicalPatterns.some(p => norm.includes(p))) return true;
    
    // Check for fake job compounds
    const fakeCompounds = ["مهندس انا", "مهندس بيت", "عامل مصري", "عامل برميل", "عامل تنين", "عامل فقط", "عامل عام", "عامل عملة", "عامل زريعه", "عامل طوب", "مهندس مجاري", "مهندسين كنادر", "كندرجي"];
    if (fakeCompounds.some(p => norm.includes(p))) return true;
    
    return false;
}

// 🧠 AI-Logic: Classify ANY profession and get requirements
function classifyProfession(inputName) {
    const normName = normalizeArabic(inputName);
    
    // Specific check for generic terms that need clarification
    if (normName === "مهندس") {
        showCustomAlert("يرجى تحديد نوع المهندس (مثلاً: مهندس معماري، مهندس كهرباء، إلخ)");
        return null;
    }
    if (normName === "طبيب" || normName === "دكتور") {
        showCustomAlert("يرجى تحديد تخصص الطبيب (مثلاً: طبيب أسنان، طبيب عام، إلخ)");
        return null;
    }
    if (normName === "عامل") {
        showCustomAlert("يرجى تحديد نوع العمل (مثلاً: عامل مخزن، عامل تعبئة، إلخ)");
        return null;
    }

    if (isGibberish(inputName)) return null;

    // 📋 PREDEFINED DOCUMENT TEMPLATES (Fixed Sets)
    const DOCS = {
        BASE: [
            "حسن سيرة وسلوك من المخابرات العامة (التقديم إلكتروني عبر موقع المخابرات العامة أو من خلال تطبيق سند)",
            "الوثائق العسكرية (مشروحات من القيادة العامة، كتاب من التعبئة / قسم شؤون الأفراد العنوان: طبربور دوار الدبابة) + دفتر خدمة العلم / بطاقة إنهاء الخدمة أو الإعفاء",
            "عمل فحص طبي وبصمة معتمد لدى السفارة السعودية + صورة شخصية خلفية بيضاء + جواز السفر",
            "عقد عمل من الشركة السعودية + خطاب إطلاع مختومين من الغرفة التجارية والخارجية السعودية",
            "عمل تفويض إلكتروني للمكتب",
            "شهادة مطعوم السحايا الرباعي",
            "ملاحظة هامة جداً (التصديقات الخارجية): يجب تصديق جميع الأوراق الرسمية والشهادات المطلوبة أعلاه من وزارة الخارجية الأردنية قبل تقديمها"
        ],
        ACADEMIC_ADDON: [
            "إحضار الشهادة الجامعية (الأصل) وكشف العلامات الأصل",
            "خبرة لمدة سنتين بنفس مسمى التأشيرة"
        ],
        ENGINEERING_ADDON: [
            "إحضار الشهادة الجامعية (الأصل) وكشف العلامات الأصل",
            "خبرة لمدة سنتين بنفس مسمى التأشيرة",
            "الحصول على شهادة الاعتماد المهني"
        ],
        MEDICAL_ADDON: [
            "إحضار الشهادة الجامعية (الأصل) وكشف العلامات الأصل",
            "خبرة لمدة سنتين بنفس مسمى التأشيرة",
            "الحصول على شهادة الاعتماد المهني (ممارس بلس) و DataFlow"
        ],
        EXECUTIVE_ADDON: [
            "إحضار الشهادة الجامعية (الأصل) وكشف العلامات الأصل",
            "خبرة لمدة سنتين بنفس مسمى التأشيرة",
            "السجل التجاري السعودي (في حال كان المسمى مدير عام أو شريك)"
        ],
        TECHNICAL_ADDON: [
            "إحضار شهادة الثانوية العامة (الأصل)",
            "خبرة لمدة سنة واحدة بنفس مسمى التأشيرة",
            "الحصول على شهادة الاعتماد المهني"
        ],
        SKILLED_SERVICE_ADDON: [
            "إحضار شهادة مدرسية (الصف العاشر)",
            "خبرة لمدة سنة واحدة بنفس مسمى التأشيرة",
            "الحصول على شهادة الاعتماد المهني ومزاولة المهنة"
        ],
        LABOUR_ADDON: [
            "إحضار الشهادة المدرسية (الأصل)"
        ],
        DRIVER_ADDON: [
            "رخصة سياقة سارية المفعول (مختومة من السفارة)",
            "عمل فحص طبي وبصمة معتمد لدى السفارة السعودية + صورة شخصية خلفية بيضاء + جواز السفر"
        ]
    };

    let finalReqs = [...DOCS.BASE];
    let category = "أخرى";
    let role = "General Role";

    // 🧠 DOCUMENT RULE ENGINE (Category Classifier + Role Refiner)
    
    // 1. MEDICAL
    if (normName.includes("طبيب") || normName.includes("دكتور") || normName.includes("ممرض") || normName.includes("صيدلي")) {
        category = "الاختصاصيون";
        role = "Medical Professional";
        finalReqs.splice(2, 0, ...DOCS.MEDICAL_ADDON);
    }
    // 2. ENGINEERING
    else if (normName.includes("مهندس") || normName.includes("هندسه")) {
        category = "الاختصاصيون";
        role = normName.includes("كهرباء") ? "Electrical Engineer" : 
               normName.includes("مدني") ? "Civil Engineer" : 
               normName.includes("ميكانيك") ? "Mechanical Engineer" : "General Engineer";
        finalReqs.splice(2, 0, ...DOCS.ENGINEERING_ADDON);
    }
    // 3. EXECUTIVE / INVESTOR
    else if (normName.includes("مدير عام") || normName.includes("ceo") || normName.includes("مستثمر") || normName.includes("رئيس تنفيذي")) {
        category = "المدراء";
        role = "Executive / Investor";
        finalReqs.splice(2, 0, ...DOCS.EXECUTIVE_ADDON);
    }
    // 4. MANAGEMENT / SUPERVISOR
    else if (normName.includes("مدير") || normName.includes("رئيس") || normName.includes("مسؤول") || normName.includes("مشرف")) {
        category = "المدراء";
        role = "Management / Supervisor";
        finalReqs.splice(2, 0, ...DOCS.ACADEMIC_ADDON);
    }
    // 5. SPECIALISTS
    else if (normName.includes("اخصائي") || normName.includes("مستشار") || normName.includes("خبير") || normName.includes("محلل")) {
        category = "الاختصاصيون";
        role = "Specialist";
        finalReqs.splice(2, 0, ...DOCS.ACADEMIC_ADDON, "الحصول على شهادة الاعتماد المهني");
    }
    // 6. SALES / ADMIN (BUSINESS)
    else if (normName.includes("مندوب") || normName.includes("بائع") || normName.includes("مبيعات") || normName.includes("مشتريات") || normName.includes("اداري") || normName.includes("سكرتير")) {
        category = "الكتبة";
        if (normName.includes("مندوب") || normName.includes("مشتريات")) {
            role = "Sales / Purchasing Representative";
            finalReqs.splice(2, 0, ...DOCS.ACADEMIC_ADDON);
        } else if (normName.includes("بائع") || normName.includes("منسق زهور")) {
            role = "Direct Sales / Service";
            finalReqs.splice(2, 0, "إحضار شهادة الصف العاشر", "خبرة لمدة سنة واحدة بنفس مسمى التأشيرة"); 
        } else {
            role = "Administrative Staff";
            finalReqs.splice(2, 0, "إحضار شهادة الثانوية العامة", "خبرة لمدة سنة واحدة بنفس مسمى التأشيرة");
        }
    }
    // 7. TECHNICAL / QUALITY
    else if (normName.includes("فني") || normName.includes("مراقب") || normName.includes("تفتيش") || normName.includes("جودة") || normName.includes("ميكانيك") || normName.includes("كهرباء")) {
        category = "الفنيون";
        role = normName.includes("جودة") ? "Quality Controller" : "Technical Worker";
        if (normName.includes("جودة") || normName.includes("مساعد اداري")) {
             finalReqs.splice(2, 0, "إحضار شهادة الثانوية العامة", "خبرة لمدة سنة واحدة بنفس مسمى التأشيرة");
        } else {
             finalReqs.splice(2, 0, ...DOCS.TECHNICAL_ADDON);
        }
    }
    // 8. LABOUR / WAREHOUSE
    else if (normName.includes("عامل") || normName.includes("تحميل") || normName.includes("تنزيل") || normName.includes("تغليف") || normName.includes("مخزن") || normName.includes("تنظيف")) {
        category = "العمال";
        role = normName.includes("مخزن") ? "Warehouse Worker" : 
               normName.includes("تغليف") ? "Packing Worker" : 
               normName.includes("تنظيف") ? "Cleaning Worker" : "General Labour";
        
        // Remove Accreditation for specific low-skilled roles
        if (normName.includes("ملصقات") || normName.includes("تنظيف خزانات")) {
            // Already handled by LABOUR_ADDON not having QVP
        }
        finalReqs.splice(2, 0, ...DOCS.LABOUR_ADDON);
    }
    // 9. SKILLED SERVICE (Chef, Barber, etc.)
    else if (normName.includes("طاهي") || normName.includes("شيف") || normName.includes("حلاق") || normName.includes("مصفف") || normName.includes("منسق زهور")) {
        category = "الحرفيون";
        role = "Skilled Service Professional";
        if (normName.includes("مصفف شعر")) {
            finalReqs.splice(2, 0, "إحضار شهادة الثانوية العامة", "خبرة لمدة سنة واحدة بنفس مسمى التأشيرة", "شهادة مزاولة مهنة", "شهادة الاعتماد المهني");
        } else {
            finalReqs.splice(2, 0, ...DOCS.SKILLED_SERVICE_ADDON);
        }
    }
    // 10. DRIVERS
    else if (normName.includes("سائق")) {
        category = "الحرفيون";
        role = "Driver";
        finalReqs.splice(2, 0, ...DOCS.DRIVER_ADDON);
    }

    return {
        name_ar: inputName,
        profession_name_ar: inputName,
        code: "---",
        category: category,
        role: role,
        requirements: finalReqs,
        isAiGenerated: true
    };
}

// Filter professions based on search
function filterProfessions() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const selectedCategory = document.getElementById('categoryFilter').value;
    const noResults = document.getElementById('noResults');
    
    let filtered = professionsData;
    
    if (searchTerm) {
        const normalizedSearch = normalizeArabic(searchTerm);
        filtered = professionsData.filter(profession => {
            const name = normalizeArabic(profession.profession_name_ar || profession.name_ar || profession.name || '');
            const code = (profession.profession_code || profession.code || '').toLowerCase();
            return name.includes(normalizedSearch) || code.includes(searchTerm.toLowerCase());
        });

        // 🧠 AI-Logic Fallback
        if (filtered.length === 0) {
            if (isGibberish(searchTerm)) {
                displayProfessions([]);
                const noResultsText = noResults.querySelector('p');
                if (noResultsText) noResultsText.textContent = "يرجى إدخال اسم مهنة واضح أو وصف وظيفي صحيح";
                return;
            }
            
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
    <div class="bg-white rounded-2xl p-6 border ${isAi ? 'border-gold bg-gold/5 shadow-md' : 'border-gray-100'} hover:border-gold hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer group profession-card"
    data-prof-idx="${index}">
    <div class="flex items-start justify-between mb-4">
    <div class="flex-1">
    ${isAi ? '<span class="text-[10px] bg-gold text-white px-2 py-0.5 rounded-full mb-2 inline-block font-bold"><i class="fas fa-robot ml-1"></i>تحليل ذكي</span>' : ''}
    <h3 class="text-xl font-bold text-navy mb-2 group-hover:text-gold transition-colors line-clamp-2">
    ${escapeHtml(name)}
    </h3>
    <div class="flex items-center gap-2 text-sm text-gray-600">
    <span class="px-3 py-1 bg-gold/10 text-gold rounded-full font-semibold">${escapeHtml(code)}</span>
    <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">${escapeHtml(cat)}</span>
    </div>
    </div>
    <div class="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-colors">
    <i class="fas ${isAi ? 'fa-magic-wand-sparkles' : 'fa-briefcase'} text-gold group-hover:text-white text-xl transition-colors"></i>
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
    let requirements = [...(profession.requirements || [])];
    
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
    
    currentProfession = { ...profession, requirements };
    
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
        btn.className = 'mx-auto mt-8 px-8 py-4 bg-gold text-white rounded-xl font-bold shadow-lg flex items-center gap-3 hover:scale-105 transition-transform';
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

function printProfessionDetails() {
    if (!currentProfession) return;
    const name = currentProfession.profession_name_ar || currentProfession.name_ar;
    const code = currentProfession.code;
    const requirements = Array.from(document.querySelectorAll('#modalRequirementsList li')).map(li => li.textContent);
    
    if (typeof window.printProfessionDocument === 'function') {
        window.printProfessionDocument(code, name, requirements);
    } else {
        window.print();
    }
}

function downloadProfessionPDF() {
    if (!currentProfession) return;
    const name = currentProfession.profession_name_ar || currentProfession.name_ar;
    showCustomAlert(`جاري تجهيز ملف PDF لمهنة: ${name}\nيرجى الانتظار قليلاً...`);
    printProfessionDetails();
}
