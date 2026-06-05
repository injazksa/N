import json
import re
from pathlib import Path

# تصحيح المسار ليعمل في البيئة الحالية
ROOT = Path('/home/ubuntu/N')
OUTPUT_DIR = ROOT / 'p'
OUTPUT_DIR.mkdir(exist_ok=True)

# Load professions
profs = json.load(open(ROOT / 'professions.json', encoding='utf-8'))

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

def gen_page(p, related):
    name = p['name_ar']
    code = p['code']
    cat = p.get('category', 'أخرى')
    slug = p.get('slug', f"{name.replace(' ', '-')}-{code}")
    reqs = p.get('requirements', [])
    intro = CATEGORY_INTRO.get(cat, f'تأشيرة عمل سعودية لمهنة {name} متاحة عبر مكتبنا المعتمد في الأردن.')
    keywords = gen_long_tail(name, code)
    meta_desc = f'الدليل الشامل لتأشيرة عمل {name} السعودية من الأردن 2026. الأوراق المطلوبة، الرسوم، خطوات التقديم، رمز المهنة الرسمي {code}.'
    
    faqs = [
        (f'كم تستغرق تأشيرة {name} من الأردن للسعودية؟',
         f'تستغرق تأشيرة {name} عادةً من 15 إلى 30 يوم عمل من تاريخ استكمال جميع الأوراق المطلوبة وإتمام الفحص الطبي والاعتماد المهني (QVP) إن وجد.'),
        (f'ما هي الأوراق المطلوبة لتأشيرة {name}؟',
         f'الأوراق الأساسية تشمل: جواز السفر، حسن السيرة والسلوك، الفحص الطبي المعتمد، عقد عمل مصدق، شهادة المطعوم، والوثائق العسكرية للذكور.'),
        (f'هل يحتاج {name} خبرة عملية؟',
         f'نعم، تتطلب مهنة {name} خبرة عملية موثقة بنفس المسمى الوظيفي لضمان قبول المعاملة.'),
        (f'هل يحتاج {name} اختبار الكفاءة المهنية QVP؟',
         f'يعتمد ذلك على تصنيف المهنة لدى وزارة الموارد البشرية السعودية. مكتبنا يحدد لك الحاجة للاختبار بدقة.'),
        (f'هل تختلف متطلبات {name} للنساء والرجال؟',
         f'نعم. الرجال يحتاجون الوثائق العسكرية، بينما تحتاج النساء عدم ممانعة من ولي الأمر أو الزوج.')
    ]
    
    related_html = ''
    if related:
        related_html = '<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">' + ''.join(
            f'<a href="/p/{r.get("slug", r["code"])}.html" class="bg-white border border-gray-200 rounded-xl p-3 hover:border-gold transition text-center text-sm"><div class="text-xs text-gold mb-1">{r["code"]}</div><div class="font-bold text-navy">{r["name_ar"]}</div></a>'
            for r in related[:8]
        ) + '</div>'
    
    reqs_html = ''.join(
        f'<li class="bg-white border border-gray-100 p-4 rounded-xl flex gap-3 hover:border-gold transition"><span class="flex-shrink-0 w-8 h-8 bg-gold/15 text-gold rounded-full font-bold flex items-center justify-center">{i+1}</span><span class="flex-1 text-gray-800">{r}</span></li>'
        for i, r in enumerate(reqs)
    )
    
    faq_html = ''.join(
        f'<details class="bg-white border border-gray-200 rounded-xl p-4 group"><summary class="cursor-pointer font-bold text-navy flex items-center justify-between"><span>{q}</span><i class="fas fa-chevron-down text-gold group-open:rotate-180 transition"></i></summary><p class="mt-3 text-gray-700 leading-relaxed">{a}</p></details>'
        for q, a in faqs
    )
    
    # Template updated to use local CSS and assets
    return f'''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تأشيرة عمل {name} السعودية | الأوراق المطلوبة 2026</title>
    <meta name="description" content="{meta_desc}">
    <meta name="keywords" content="{', '.join(keywords)}">
    <link rel="stylesheet" href="/css/tailwind.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>body {{ font-family: 'Alexandria', sans-serif; }}</style>
</head>
<body class="bg-gray-50">
    <header class="bg-white border-b sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <a href="/" class="flex items-center gap-2">
                <img src="/icons/logo-192.png" alt="Logo" class="h-10">
                <span class="font-bold text-navy hidden sm:block">مكتب تأشيرات السعودية</span>
            </a>
            <nav class="flex gap-4">
                <a href="/" class="font-bold text-navy hover:text-gold">الرئيسية</a>
                <a href="/professions.html" class="font-bold text-navy hover:text-gold">المهن</a>
            </nav>
        </div>
    </header>

    <section class="bg-navy text-white py-12">
        <div class="max-w-4xl mx-auto px-4">
            <div class="bg-gold/20 text-gold px-3 py-1 rounded-full text-xs font-bold inline-block mb-4">رمز المهنة: {code}</div>
            <h1 class="text-3xl md:text-5xl font-bold mb-4">تأشيرة عمل {name} السعودية</h1>
            <p class="text-gray-300 text-lg">{intro}</p>
        </div>
    </section>

    <main class="max-w-4xl mx-auto px-4 py-12">
        <h2 class="text-2xl font-bold text-navy mb-6">الأوراق المطلوبة لعام 2026</h2>
        <ul class="space-y-4 mb-12">{reqs_html}</ul>

        <h2 class="text-2xl font-bold text-navy mb-6">الأسئلة الشائعة</h2>
        <div class="space-y-4 mb-12">{faq_html}</div>

        <h2 class="text-2xl font-bold text-navy mb-6">مهن ذات صلة</h2>
        {related_html}
    </main>

    <footer class="bg-white border-t py-8 text-center text-gray-500 text-sm">
        <p>© 2026 مكتب تأشيرات السعودية في الأردن. جميع الحقوق محفوظة.</p>
    </footer>
    <script src="/core.js"></script>
</body>
</html>'''

def main():
    print(f"Generating {len(profs)} pages...")
    for i, p in enumerate(profs):
        cat = p.get('category', 'أخرى')
        related = [r for r in profs if r.get('category') == cat and r['code'] != p['code']]
        html = gen_page(p, related)
        
        filename = p.get('slug', f"{p['name_ar'].replace(' ', '-')}-{p['code']}") + ".html"
        # Clean filename from invalid chars
        filename = re.sub(r'[\\/*?:"<>|]', "", filename)
        
        with open(OUTPUT_DIR / filename, 'w', encoding='utf-8') as f:
            f.write(html)
        
        if (i+1) % 100 == 0:
            print(f"Generated {i+1} pages...")

if __name__ == "__main__":
    main()
