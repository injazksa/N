"""
🚀 Programmatic SEO Generator (Phase 1+2+3 of Strategy)
يولّد 273 صفحة landing مفهرسة من قاعدة المهن
تتضمن:
- H1 محدد + Meta description + Canonical
- Schema.org: Service + FAQPage + HowTo + Breadcrumb
- Long-tail keywords مدمجة
- Internal linking بين المهن المتعلقة
- WhatsApp CTA + Trust signals
"""
import json
import re
from pathlib import Path

ROOT = Path('/app')
OUTPUT_DIR = ROOT / 'p'
OUTPUT_DIR.mkdir(exist_ok=True)

# Load professions
profs = json.load(open(ROOT / 'professions.json', encoding='utf-8'))

# ════════════════════════════════════════════════════════════════
# CATEGORY → SEO content mapping
# ════════════════════════════════════════════════════════════════
CATEGORY_INTRO = {
    'القطاع الإداري والتجاري والمالي': 'تأشيرة عمل سعودية لمهنة إدارية تشمل المهام التنفيذية والقيادية في الشركات السعودية.',
    'كبار المسؤولين والمشرعين': 'مهنة قيادية عليا تتطلب وثائق التحقق الأكاديمي والخبرة القيادية المتقدمة.',
    'المديرون الإداريون والتجاريون': 'مهنة إدارية للمدراء المتخصصين في القطاعات التجارية والإدارية.',
    'مدراء الإنتاج والخدمات المتخصصة': 'مهنة إدارة الإنتاج والخدمات المتخصصة في القطاعات الصناعية.',
    'مدراء الفنادق والمطاعم والتجارة': 'مهنة إدارة منشآت الضيافة والمطاعم والمحلات التجارية.',
    'اختصاصيو العلوم والهندسة': 'مهنة اختصاصية تتطلب شهادة جامعية وخبرة تخصصية في العلوم والهندسة.',
    'اختصاصيو الصحة': 'مهنة صحية تتطلب شهادة التصنيف من الهيئة السعودية للتخصصات الصحية (ممارس بلس) و DataFlow.',
    'الفنيون في العلوم والهندسة': 'مهنة فنية تتطلب دبلوماً متوسطاً وخبرة في التطبيقات التقنية والهندسية.',
    'الفنيون في الأعمال والإدارة': 'مهنة فنية إدارية تتطلب دبلوماً في الأعمال أو شهادة تخصصية معتمدة.',
    'مزاولو البيع': 'مهنة بيع تتطلب خبرة في خدمة الزبائن والتعامل التجاري المباشر.',
    'مزاولو الخدمات الشخصية': 'مهنة خدمية مهنية تشمل القطاع الخدمي المباشر مثل الحلاقين والطهاة.',
    'مزاولو الرعاية الشخصية': 'مهنة رعاية شخصية مطلوبة للأسر السعودية بضوابط خاصة لمنح التأشيرة.',
    'حرفيو البناء': 'مهنة حرفية في قطاع البناء والتشييد تتطلب اعتماد QVP المهني.',
    'حرفيو المعادن والآلات': 'حرفة في قطاع المعادن والصناعات الميكانيكية تتطلب اختبار الكفاءة المهنية.',
    'حرفيو الكهرباء والإلكترونيات': 'حرفة كهربائية تتطلب شهادة مزاولة المهنة وQVP.',
    'مشغلو الآلات الثابتة': 'مهنة تشغيل آلات صناعية تتطلب اعتماد مهني وخبرة فنية.',
    'مشغلو وسائل النقل': 'مهنة قيادة المركبات تتطلب رخصة سياقة سارية مختومة.',
    'عاملو النظافة والمساعدون': 'مهنة عمالية تشغيلية في قطاع النظافة والخدمات المساعدة.',
    'عاملو التعدين والإنشاءات والتصنيع': 'مهنة عمالية في قطاع التعدين والإنشاءات والتصنيع.',
    'قطاع العمالة التشغيلية والتعبئة': 'مهنة عمالية تشغيلية تشمل التعبئة والتغليف والشحن.',
    'قطاع المبيعات والتسويق': 'مهنة تسويقية وبيعية تتطلب QVP ومهارات إقناعية.',
    'القطاع الفني والحرفي': 'مهنة فنية حرفية تتطلب شهادة مزاولة مهنية واختبار QVP.',
}

# Long-tail keyword patterns per profession name
def gen_long_tail(name_ar, code):
    return [
        f'تأشيرة عمل {name_ar} السعودية من الأردن',
        f'كيف أطلع تأشيرة {name_ar} للسعودية',
        f'متطلبات تأشيرة {name_ar} السعودية 2026',
        f'كم سعر تأشيرة {name_ar} السعودية',
        f'الأوراق المطلوبة لتأشيرة {name_ar}',
        f'مكتب تأشيرات {name_ar} في الأردن',
        f'رمز مهنة {name_ar} السعودية {code}',
    ]

# ════════════════════════════════════════════════════════════════
# Page template (single-profession landing page)
# ════════════════════════════════════════════════════════════════
def gen_page(p, related):
    name = p['name_ar']
    code = p['code']
    cat = p.get('category', '')
    slug = p['slug']
    reqs = p.get('requirements', [])
    intro = CATEGORY_INTRO.get(cat, f'تأشيرة عمل سعودية لمهنة {name} متاحة عبر مكتبنا المعتمد في الأردن.')
    keywords = gen_long_tail(name, code)
    meta_desc = f'الدليل الشامل لتأشيرة عمل {name} السعودية من الأردن 2026. الأوراق المطلوبة، الرسوم، خطوات التقديم، رمز المهنة الرسمي {code}.'
    
    # FAQ items (5 high-traffic Qs)
    faqs = [
        (f'كم تستغرق تأشيرة {name} من الأردن للسعودية؟',
         f'تستغرق تأشيرة {name} عادةً من 15 إلى 30 يوم عمل من تاريخ استكمال جميع الأوراق المطلوبة وإتمام الفحص الطبي والاعتماد المهني (QVP) إن وجد. مكتبنا يضمن متابعة المعاملة يومياً لتسريع الإجراءات.'),
        (f'ما هي الأوراق المطلوبة لتأشيرة {name}؟',
         f'الأوراق الأساسية تشمل: جواز السفر، 6 صور شخصية، حسن السيرة والسلوك من المخابرات، الفحص الطبي المعتمد، عقد عمل من الشركة السعودية، شهادة مطعوم السحايا الرباعي، والوثائق العسكرية للذكور. التفاصيل الكاملة موضحة أعلاه في صفحة المهنة.'),
        (f'كم رسوم تأشيرة عمل {name} السعودية 2026؟',
         f'تختلف الرسوم حسب فئة التأشيرة (عامة/مهنية) وعدد سنوات الإقامة (1-5 سنوات) ونوع الخدمة (عادية/مستعجلة). تواصل معنا عبر واتساب للحصول على فاتورة سعرية مفصلة ودقيقة بناءً على حالتك.'),
        (f'هل يحتاج {name} اختبار الكفاءة المهنية QVP؟',
         f'يعتمد ذلك على رمز المهنة الرسمي ({code}) وتصنيفها لدى وزارة الموارد البشرية السعودية. مكتبنا يحدد لك بدقة هل تحتاج لاجتياز اختبار QVP عبر منصة مساند قبل تقديم التأشيرة.'),
        (f'هل تختلف متطلبات {name} للنساء والرجال؟',
         f'نعم. الرجال يحتاجون الوثائق العسكرية (مشروحات القيادة العامة + دفتر خدمة العلم). النساء يحتاجن عدم ممانعة من ولي الأمر أو الزوج بدلاً من العسكرية، مع شهادة الزواج إن وجدت.')
    ]
    
    # Build FAQ Schema
    faq_schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]
    }
    
    # Build HowTo Schema
    howto_schema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": f"كيفية الحصول على تأشيرة عمل {name} السعودية من الأردن",
        "description": meta_desc,
        "totalTime": "PT720H",
        "supply": [{"@type": "HowToSupply", "name": r[:80]} for r in reqs[:6]],
        "step": [
            {"@type": "HowToStep", "position": 1, "name": "تجهيز الأوراق الأساسية", "text": "جمع جواز السفر، الصور، الشهادات، وحسن السيرة والسلوك من المخابرات العامة"},
            {"@type": "HowToStep", "position": 2, "name": "الفحص الطبي المعتمد", "text": "إجراء الفحص الطبي في المختبر المعتمد لدى السفارة السعودية في الأردن"},
            {"@type": "HowToStep", "position": 3, "name": "عقد العمل والاعتماد", "text": "استلام عقد العمل من الشركة السعودية واعتماده من الغرفة التجارية والخارجية السعودية"},
            {"@type": "HowToStep", "position": 4, "name": "اختبار QVP إن لزم", "text": f"اجتياز اختبار الكفاءة المهنية QVP على منصة مساند لمهنة {name} حسب اشتراطات وزارة الموارد البشرية"},
            {"@type": "HowToStep", "position": 5, "name": "تقديم التأشيرة وبصمة الفيزا", "text": "تقديم الملف الكامل، البصمات، الفحص الطبي والصور الحيوية في مركز التأشيرات"},
            {"@type": "HowToStep", "position": 6, "name": "استلام التأشيرة", "text": f"استلام تأشيرة عمل {name} السعودية والاستعداد للسفر"}
        ]
    }
    
    # Service Schema
    service_schema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": f"تأشيرة عمل {name} السعودية",
        "provider": {
            "@type": "LocalBusiness",
            "name": "مكتب تأشيرات السعودية في الأردن",
            "url": "https://saudia-visa.com/",
            "telephone": "+962789881009",
            "address": {"@type": "PostalAddress", "addressLocality": "عمّان", "addressCountry": "JO"}
        },
        "areaServed": {"@type": "Country", "name": "JO"},
        "description": meta_desc
    }
    
    # Breadcrumb
    breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://saudia-visa.com/"},
            {"@type": "ListItem", "position": 2, "name": "المهن المعتمدة", "item": "https://saudia-visa.com/professions.html"},
            {"@type": "ListItem", "position": 3, "name": name, "item": f"https://saudia-visa.com/p/{slug}.html"}
        ]
    }
    
    # Related professions (4 same category)
    related_html = ''
    if related:
        related_html = '<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">' + ''.join(
            f'<a href="/p/{r["slug"]}.html" class="bg-white border border-gray-200 rounded-xl p-3 hover:border-gold transition text-center text-sm"><div class="text-xs text-gold mb-1">{r["code"]}</div><div class="font-bold text-navy">{r["name_ar"]}</div></a>'
            for r in related[:8]
        ) + '</div>'
    
    # Requirements HTML
    reqs_html = ''.join(
        f'<li class="bg-white border border-gray-100 p-4 rounded-xl flex gap-3 hover:border-gold transition"><span class="flex-shrink-0 w-8 h-8 bg-gold/15 text-gold rounded-full font-bold flex items-center justify-center">{i+1}</span><span class="flex-1 text-gray-800">{r}</span></li>'
        for i, r in enumerate(reqs)
    )
    
    # FAQ HTML
    faq_html = ''.join(
        f'<details class="bg-white border border-gray-200 rounded-xl p-4 group"><summary class="cursor-pointer font-bold text-navy flex items-center justify-between"><span>{q}</span><i class="fas fa-chevron-down text-gold group-open:rotate-180 transition"></i></summary><p class="mt-3 text-gray-700 leading-relaxed">{a}</p></details>'
        for q, a in faqs
    )
    
    return f'''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تأشيرة عمل {name} السعودية | الأوراق المطلوبة 2026 | مكتب تأشيرات السعودية في الأردن</title>
    <meta name="description" content="{meta_desc}">
    <meta name="keywords" content="{', '.join(keywords)}">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large">
    <link rel="canonical" href="https://saudia-visa.com/p/{slug}.html">
    <meta name="google-site-verification" content="REPLACE_WITH_GSC_CODE">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="مكتب تأشيرات السعودية في الأردن">
    <meta property="og:locale" content="ar_JO">
    <meta property="og:url" content="https://saudia-visa.com/p/{slug}.html">
    <meta property="og:title" content="تأشيرة عمل {name} السعودية | الأوراق المطلوبة 2026">
    <meta property="og:description" content="{meta_desc}">
    <meta property="og:image" content="https://saudia-visa.com/icons/logo-512.png">
    <meta property="og:image:type" content="image/png">
    <meta property="og:image:width" content="512">
    <meta property="og:image:height" content="512">

    <!-- Favicons -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {{ theme: {{ extend: {{ colors: {{ navy: '#1B2A41', gold: '#C9A35E' }}, fontFamily: {{ arabic: ['Alexandria','Tajawal','sans-serif'] }} }} }} }}
    </script>

    <!-- 📊 Facebook Pixel -->
    <script src="/marketing-pixel.js" defer></script>
    <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=2499298600459646&ev=PageView&noscript=1"/></noscript>

    <!-- 🟢 Schema.org Structured Data -->
    <script type="application/ld+json">{json.dumps(service_schema, ensure_ascii=False)}</script>
    <script type="application/ld+json">{json.dumps(faq_schema, ensure_ascii=False)}</script>
    <script type="application/ld+json">{json.dumps(howto_schema, ensure_ascii=False)}</script>
    <script type="application/ld+json">{json.dumps(breadcrumb, ensure_ascii=False)}</script>

    <style>
      body {{ font-family: 'Alexandria', 'Tajawal', sans-serif; }}
      @media (max-width: 768px) {{ html {{ font-size: 14.5px; }} }}
    </style>
</head>
<body class="bg-gray-50">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <a href="/" class="flex items-center gap-2" data-testid="logo">
                    <img src="/icons/logo-192.png" alt="مكتب تأشيرات السعودية" class="h-10 w-auto">
                    <span class="hidden sm:block text-xs font-bold text-navy">مكتب تأشيرات السعودية</span>
                </a>
                <nav class="flex items-center gap-3 sm:gap-5 text-sm">
                    <a href="/" class="text-navy hover:text-gold font-bold">الرئيسية</a>
                    <a href="/professions.html" class="text-navy hover:text-gold font-bold">المهن</a>
                    <a href="/blog.html" class="hidden sm:inline text-navy hover:text-gold font-bold">المدونة</a>
                </nav>
            </div>
        </div>
    </header>

    <!-- Breadcrumb -->
    <nav class="bg-white border-b py-3" aria-label="breadcrumb">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 text-xs sm:text-sm text-gray-600 flex items-center gap-2 flex-wrap">
            <a href="/" class="hover:text-gold">الرئيسية</a>
            <i class="fas fa-chevron-left text-[10px]"></i>
            <a href="/professions.html" class="hover:text-gold">المهن المعتمدة</a>
            <i class="fas fa-chevron-left text-[10px]"></i>
            <span class="text-navy font-bold truncate">{name}</span>
        </div>
    </nav>

    <!-- Hero -->
    <section class="bg-gradient-to-br from-navy via-navy/95 to-navy/90 text-white py-10 sm:py-16">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="inline-flex items-center gap-2 bg-gold/15 text-gold px-3 py-1 rounded-full text-xs font-bold mb-3">
                <i class="fas fa-id-card"></i>
                <span>رمز المهنة الرسمي: {code}</span>
            </div>
            <h1 class="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3" data-testid="page-h1">تأشيرة عمل {name} السعودية من الأردن</h1>
            <p class="text-base sm:text-lg text-gray-300 leading-relaxed mb-4">{intro}</p>
            <p class="text-sm text-gray-400 mb-5"><i class="fas fa-calendar text-gold ml-1"></i> محدّث لـ 2026 — جميع المتطلبات الرسمية</p>
            <div class="flex flex-col sm:flex-row gap-3">
                <a href="https://wa.me/962789881009?text={f'مرحباً، أحتاج للاستفسار عن تأشيرة عمل {name}'}" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-3 rounded-xl shadow-lg" data-testid="hero-whatsapp">
                    <i class="fab fa-whatsapp text-xl"></i>
                    <span>استفسر عبر واتساب الآن</span>
                </a>
                <a href="#requirements" class="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold/90 text-white font-bold px-5 py-3 rounded-xl shadow-lg">
                    <i class="fas fa-file-alt"></i>
                    <span>الأوراق المطلوبة</span>
                </a>
            </div>
        </div>
    </section>

    <!-- Quick Info Bar -->
    <section class="bg-white border-y border-gray-100">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div><i class="fas fa-clock text-gold text-xl mb-1"></i><div class="text-xs text-gray-500">مدة الإنجاز</div><div class="font-bold text-navy text-sm">15-30 يوم</div></div>
            <div><i class="fas fa-globe text-gold text-xl mb-1"></i><div class="text-xs text-gray-500">الوجهة</div><div class="font-bold text-navy text-sm">السعودية 🇸🇦</div></div>
            <div><i class="fas fa-map-marker-alt text-gold text-xl mb-1"></i><div class="text-xs text-gray-500">المصدر</div><div class="font-bold text-navy text-sm">الأردن 🇯🇴</div></div>
            <div><i class="fas fa-list-ol text-gold text-xl mb-1"></i><div class="text-xs text-gray-500">عدد الوثائق</div><div class="font-bold text-navy text-sm">{len(reqs)} وثيقة</div></div>
        </div>
    </section>

    <!-- Requirements -->
    <section id="requirements" class="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-xl sm:text-2xl font-bold text-navy mb-2">📋 الأوراق والمستندات المطلوبة لتأشيرة {name}</h2>
        <p class="text-sm text-gray-600 mb-6">قائمة محدثة لعام 2026 — مصدّقة من السفارة السعودية والغرفة التجارية</p>
        <ol class="space-y-3">
            {reqs_html}
        </ol>

        <div class="mt-6 bg-blue-50 border-r-4 border-blue-500 p-4 rounded-lg">
            <p class="text-sm text-blue-900"><i class="fas fa-info-circle ml-2"></i><strong>ملاحظة هامة:</strong> الجنس يؤثر على بعض البنود. للنساء، الوثائق العسكرية تُستبدل بـ "عدم ممانعة من ولي الأمر". تواصل مع المكتب للتأكيد النهائي.</p>
        </div>
    </section>

    <!-- FAQ -->
    <section class="bg-gray-50 py-12">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-xl sm:text-2xl font-bold text-navy mb-2">❓ الأسئلة الشائعة عن تأشيرة {name}</h2>
            <p class="text-sm text-gray-600 mb-6">إجابات سريعة على أكثر الأسئلة طلباً</p>
            <div class="space-y-3">
                {faq_html}
            </div>
        </div>
    </section>

    <!-- HowTo (Visual Steps) -->
    <section class="bg-white py-12 border-y border-gray-100">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-xl sm:text-2xl font-bold text-navy mb-6">⚙️ خطوات الحصول على تأشيرة {name} (6 خطوات)</h2>
            <ol class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <li class="bg-gradient-to-br from-gold/5 to-white border border-gold/30 rounded-xl p-4"><div class="flex items-center gap-2 mb-2"><span class="w-8 h-8 bg-navy text-white rounded-full flex items-center justify-center text-sm font-bold">1</span><h3 class="font-bold text-navy text-sm">تجهيز الأوراق</h3></div><p class="text-xs text-gray-600">جواز السفر + الصور + الشهادات + حسن السيرة</p></li>
                <li class="bg-gradient-to-br from-gold/5 to-white border border-gold/30 rounded-xl p-4"><div class="flex items-center gap-2 mb-2"><span class="w-8 h-8 bg-navy text-white rounded-full flex items-center justify-center text-sm font-bold">2</span><h3 class="font-bold text-navy text-sm">الفحص الطبي</h3></div><p class="text-xs text-gray-600">من المختبر المعتمد لدى السفارة</p></li>
                <li class="bg-gradient-to-br from-gold/5 to-white border border-gold/30 rounded-xl p-4"><div class="flex items-center gap-2 mb-2"><span class="w-8 h-8 bg-navy text-white rounded-full flex items-center justify-center text-sm font-bold">3</span><h3 class="font-bold text-navy text-sm">عقد العمل</h3></div><p class="text-xs text-gray-600">مصدّق من الغرفة التجارية السعودية</p></li>
                <li class="bg-gradient-to-br from-gold/5 to-white border border-gold/30 rounded-xl p-4"><div class="flex items-center gap-2 mb-2"><span class="w-8 h-8 bg-navy text-white rounded-full flex items-center justify-center text-sm font-bold">4</span><h3 class="font-bold text-navy text-sm">اختبار QVP</h3></div><p class="text-xs text-gray-600">على منصة مساند إن كانت المهنة تتطلب ذلك</p></li>
                <li class="bg-gradient-to-br from-gold/5 to-white border border-gold/30 rounded-xl p-4"><div class="flex items-center gap-2 mb-2"><span class="w-8 h-8 bg-navy text-white rounded-full flex items-center justify-center text-sm font-bold">5</span><h3 class="font-bold text-navy text-sm">تقديم الملف</h3></div><p class="text-xs text-gray-600">البصمات + الفحص + التصديقات</p></li>
                <li class="bg-gradient-to-br from-gold/5 to-white border border-gold/30 rounded-xl p-4"><div class="flex items-center gap-2 mb-2"><span class="w-8 h-8 bg-navy text-white rounded-full flex items-center justify-center text-sm font-bold">6</span><h3 class="font-bold text-navy text-sm">استلام التأشيرة</h3></div><p class="text-xs text-gray-600">والاستعداد للسفر إلى السعودية</p></li>
            </ol>
        </div>
    </section>

    <!-- Related Professions -->
    {f'<section class="py-10 max-w-4xl mx-auto px-4 sm:px-6"><h2 class="text-xl sm:text-2xl font-bold text-navy mb-2">🔗 مهن مشابهة في نفس القطاع</h2><p class="text-sm text-gray-600 mb-4">{cat}</p>{related_html}</section>' if related else ''}

    <!-- Trust + CTA -->
    <section class="bg-gradient-to-br from-navy to-navy/90 text-white py-12">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 class="text-xl sm:text-2xl font-bold mb-3">🏆 لماذا مكتبنا هو الخيار الأمثل لتأشيرة {name}؟</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div class="bg-white/10 rounded-xl p-4"><i class="fas fa-check-circle text-gold text-2xl mb-2"></i><div class="text-sm font-bold">معتمد رسمياً</div><div class="text-xs text-gray-300">من السفارة السعودية</div></div>
                <div class="bg-white/10 rounded-xl p-4"><i class="fas fa-users text-gold text-2xl mb-2"></i><div class="text-sm font-bold">+5,000 عميل</div><div class="text-xs text-gray-300">منذ 2015</div></div>
                <div class="bg-white/10 rounded-xl p-4"><i class="fas fa-bolt text-gold text-2xl mb-2"></i><div class="text-sm font-bold">سرعة الإنجاز</div><div class="text-xs text-gray-300">متابعة يومية</div></div>
                <div class="bg-white/10 rounded-xl p-4"><i class="fas fa-shield-alt text-gold text-2xl mb-2"></i><div class="text-sm font-bold">ضمان الجودة</div><div class="text-xs text-gray-300">حتى التأشيرة</div></div>
            </div>
            <a href="https://wa.me/962789881009?text={f'مرحباً، أريد تقديم طلب تأشيرة عمل {name}'}" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-xl shadow-2xl mt-8 text-lg">
                <i class="fab fa-whatsapp text-2xl"></i>
                <span>ابدأ معاملتك الآن عبر واتساب</span>
            </a>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-400">
            <p>&copy; 2026 مكتب تأشيرات السعودية في الأردن - جميع الحقوق محفوظة</p>
            <div class="mt-3 flex justify-center gap-4 text-xs">
                <a href="/" class="hover:text-gold">الرئيسية</a>
                <a href="/about.html" class="hover:text-gold">من نحن</a>
                <a href="/professions.html" class="hover:text-gold">المهن</a>
                <a href="/blog.html" class="hover:text-gold">المدونة</a>
            </div>
        </div>
    </footer>

    <!-- Floating WhatsApp -->
    <a href="https://wa.me/962789881009" target="_blank" rel="noopener" class="fixed bottom-6 left-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-green-600 transition-all z-40" data-testid="float-whatsapp">
        <i class="fab fa-whatsapp text-3xl"></i>
    </a>
</body>
</html>'''


# ════════════════════════════════════════════════════════════════
# GENERATE all pages
# ════════════════════════════════════════════════════════════════
# Group by category for related lookup
from collections import defaultdict
by_cat = defaultdict(list)
for p in profs:
    by_cat[p.get('category', '')].append(p)

generated = 0
for p in profs:
    cat = p.get('category', '')
    related = [r for r in by_cat[cat] if r['code'] != p['code']][:8]
    html = gen_page(p, related)
    out_path = OUTPUT_DIR / f"{p['slug']}.html"
    out_path.write_text(html, encoding='utf-8')
    generated += 1

print(f"✅ Generated {generated} programmatic pages in {OUTPUT_DIR}")
print(f"Sample URLs:")
for p in profs[:5]:
    print(f"  https://saudia-visa.com/p/{p['slug']}.html")
PYEOF