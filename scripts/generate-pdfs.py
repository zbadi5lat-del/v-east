#!/usr/bin/env python3
from pathlib import Path
from tempfile import TemporaryDirectory
from weasyprint import HTML

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'downloads'
ASSETS = ROOT / 'public' / 'assets'
OUT.mkdir(parents=True, exist_ok=True)

logo = (ASSETS / 'veast-logo.webp').as_uri()
hero = (ASSETS / 'office-wall-brand.webp').as_uri()
field = (ASSETS / 'field-team-02.webp').as_uri()
portfolio = (ASSETS / 'operations-portfolio.webp').as_uri()
elite = (ASSETS / 'elite-beach-logo.webp').as_uri()
half = (ASSETS / 'half-moon-profile.webp').as_uri()

CSS = r'''
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html,body { margin:0; padding:0; background:#eef3f0; color:#102a33; font-family:"DejaVu Sans",Arial,sans-serif; }
.page { width:210mm; min-height:297mm; position:relative; overflow:hidden; page-break-after:always; background:#f7f4ed; padding:18mm 17mm 16mm; }
.page:last-child { page-break-after:auto; }
.dark { background:#071b24; color:#f7f4ed; }
.navy { background:#0b2936; color:#f7f4ed; }
.brandbar { position:absolute; left:0; right:0; top:0; height:7mm; background:linear-gradient(90deg,#176782,#7ea7a4 55%,#d2bc8a); }
.logo { width:28mm; height:28mm; object-fit:contain; background:#fff; border-radius:6mm; padding:2mm; }
.heroimg { width:100%; height:92mm; object-fit:cover; border-radius:8mm; margin-top:12mm; border:1px solid rgba(126,167,164,.22); }
h1 { font-size:26pt; line-height:1.12; margin:9mm 0 3mm; letter-spacing:-.02em; }
h2 { font-size:17pt; line-height:1.25; margin:0 0 5mm; }
h3 { font-size:11.5pt; margin:0 0 2mm; }
p { font-size:9.6pt; line-height:1.75; margin:0 0 4mm; }
.ar { direction:rtl; text-align:right; }
.en { direction:ltr; text-align:left; }
.kicker { font-size:8.5pt; letter-spacing:.15em; text-transform:uppercase; color:#d2bc8a; font-weight:800; }
.page:not(.dark):not(.navy) .kicker { color:#765522; }
.grid2 { display:grid; grid-template-columns:1fr 1fr; gap:5mm; }
.grid3 { display:grid; grid-template-columns:repeat(3,1fr); gap:4mm; }
.card { border:1px solid rgba(23,103,130,.17); border-radius:6mm; padding:5mm; background:rgba(255,255,255,.58); }
.dark .card,.navy .card { background:rgba(255,255,255,.035); border-color:rgba(126,167,164,.2); }
.card p:last-child { margin-bottom:0; }
.rule { height:1px; background:rgba(23,103,130,.15); margin:5mm 0; }
.dark .rule,.navy .rule { background:rgba(126,167,164,.18); }
.pill { display:inline-block; padding:2.2mm 3.2mm; border-radius:99px; font-size:8pt; font-weight:700; margin:0 1.5mm 2mm 0; background:rgba(23,103,130,.10); color:#176782; }
.dark .pill,.navy .pill { background:rgba(126,167,164,.12); color:#e9ddbf; }
.footer { position:absolute; left:17mm; right:17mm; bottom:8mm; display:flex; justify-content:space-between; gap:6mm; font-size:7.5pt; color:#52676b; }
.dark .footer,.navy .footer { color:#a9bdc1; }
.cover { display:flex; flex-direction:column; justify-content:center; }
.cover .heroimg { height:118mm; margin-top:10mm; }
.stat { font-size:20pt; font-weight:900; color:#176782; }
.dark .stat,.navy .stat { color:#d2bc8a; }
.photo { width:100%; height:62mm; object-fit:cover; border-radius:6mm; }
.venue-logo { width:100%; height:56mm; object-fit:contain; border-radius:6mm; background:#fff; padding:4mm; }
.contact { font-size:8.5pt; line-height:1.65; }
.small { font-size:8pt; line-height:1.6; }
.highlight { color:#d2bc8a; }
ul { margin:2mm 0 0; padding-left:5mm; }
li { font-size:9pt; line-height:1.6; margin-bottom:1.5mm; }
.ar ul { padding-left:0; padding-right:5mm; }
'''

def doc(title: str, body: str) -> str:
    return f'<!doctype html><html><head><meta charset="utf-8"><title>{title}</title><style>{CSS}</style></head><body>{body}</body></html>'

def footer(page: str, label: str) -> str:
    return f'<div class="footer"><span>V.EAST - Sports & Tourism Operations</span><span>{label} | {page}</span></div>'

company = f'''
<section class="page dark cover"><div class="brandbar"></div><img class="logo" src="{logo}"><span class="kicker" style="margin-top:9mm">COMPANY PROFILE / الملف التعريفي</span><h1>V.EAST<br><span class="highlight">Sports & Tourism Operations</span></h1><p class="ar" style="font-size:14pt;color:#dce8e8;max-width:160mm">إدارة وتشغيل المنشآت الرياضية والسياحية بمنظومة تربط الإدارة، التشغيل، السلامة، الإنقاذ، والإشراف الميداني.</p><img class="heroimg" src="{hero}">{footer('01','Company Profile')}</section>
<section class="page"><div class="brandbar"></div><span class="kicker">WHO WE ARE / من نحن</span><h2>One operating system from planning to the field</h2><div class="grid2"><div class="card en"><h3>What V.East does</h3><p>V.East manages sports and tourism facilities through structured operations, team management, safety and rescue readiness, first aid, emergency planning, and continuous field supervision.</p></div><div class="card ar"><h3>ماذا تقدم V.East</h3><p>تتخصص V.East في إدارة وتشغيل المنشآت الرياضية والسياحية من خلال تشغيل منظم، وإدارة فرق العمل، والسلامة والإنقاذ، والإسعافات الأولية، وخطط الطوارئ، والمتابعة الميدانية المستمرة.</p></div></div><div class="rule"></div><div class="grid3"><div class="card"><div class="stat">01</div><h3>Management</h3><p class="ar">إدارة واضحة للأدوار والمسؤوليات وخطة التشغيل.</p></div><div class="card"><div class="stat">02</div><h3>Safety</h3><p class="ar">سلامة وجاهزية وإنقاذ وإسعافات أولية مدمجة في التشغيل.</p></div><div class="card"><div class="stat">03</div><h3>Field</h3><p class="ar">إشراف وتقييم ميداني مستمر لتحسين الأداء.</p></div></div><div style="margin-top:7mm"><span class="pill">Sports facilities</span><span class="pill">Resorts</span><span class="pill">Hotels</span><span class="pill">Swimming pools</span><span class="pill">Aqua parks</span><span class="pill">Beaches</span></div>{footer('02','Company Profile')}</section>
<section class="page navy"><div class="brandbar"></div><span class="kicker">OPERATING SCOPE / نطاق التشغيل</span><h2>Management • Operations • Safety • Rescue • Field supervision</h2><div class="grid2"><div><img class="photo" src="{field}"><p class="small" style="margin-top:4mm">Direct field presence is part of the operating model, not a separate final step.</p></div><div class="ar"><h3>نطاق العمل</h3><ul><li>إدارة وتشغيل المنشآت الرياضية والسياحية</li><li>تشغيل حمامات السباحة والمسطحات المائية</li><li>فرق الإنقاذ والسلامة</li><li>الإسعافات الأولية والاستعداد للحالات الطارئة</li><li>خطط التشغيل والطوارئ</li><li>الإشراف والتقييم الميداني</li></ul><div class="rule"></div><h3>Operating sectors</h3><p>Resorts, sports clubs, hotels, swimming pools, aqua parks, beaches, and sports & recreational facilities.</p></div></div><div class="rule"></div><div class="grid2"><div class="card"><h3>Leadership</h3><p>Co-founders: Captain Moaz Negm and Youssef Hegazy.</p></div><div class="card"><h3>Contact</h3><p class="contact">01280033504 • 01061950609<br>v.east000@gmail.com<br>Instagram: @v_east_</p></div></div>{footer('03','Company Profile')}</section>'''

services = [
('Facility operations','إدارة وتشغيل المنشآت','Structured day-to-day operating management with clear responsibilities and follow-up.'),
('Aquatic operations','حمامات السباحة والمسطحات المائية','Operation and supervision for pools and water facilities with safety embedded in the workflow.'),
('Rescue & safety teams','فرق الإنقاذ والسلامة','Readiness-focused rescue and safety operations aligned with the facility operating plan.'),
('First aid & safety','الإسعافات الأولية والسلامة','First-aid readiness and practical safety procedures integrated into daily operations.'),
('Emergency planning','خطط التشغيل والطوارئ','Clear response planning, responsibilities, escalation paths, and field readiness.'),
('Field supervision','الإشراف والتقييم الميداني','Continuous on-site supervision, review, and operational improvement.'),
]
svc_cards = ''.join(f'<div class="card"><h3>{en}</h3><p class="ar" style="font-weight:700">{ar}</p><p>{desc}</p></div>' for en, ar, desc in services)
services_doc = f'''
<section class="page dark cover"><div class="brandbar"></div><img class="logo" src="{logo}"><span class="kicker" style="margin-top:9mm">SERVICES & OPERATIONS / الخدمات والتشغيل</span><h1>Operations designed for <span class="highlight">real field conditions.</span></h1><p class="ar" style="font-size:14pt;color:#dce8e8">خدمات تشغيل متكاملة تبدأ من الخطة وتستمر حتى الميدان، مع دمج السلامة والجاهزية والمتابعة داخل التشغيل اليومي.</p><img class="heroimg" src="{portfolio}">{footer('01','Services & Operations')}</section>
<section class="page"><div class="brandbar"></div><span class="kicker">CORE SERVICES / الخدمات الأساسية</span><h2>Six connected operating capabilities</h2><div class="grid2">{svc_cards}</div>{footer('02','Services & Operations')}</section>
<section class="page navy"><div class="brandbar"></div><span class="kicker">OPERATING FLOW / مسار التشغيل</span><h2>Plan → Prepare → Operate → Supervise → Improve</h2><div class="grid2"><div class="card"><div class="stat">01</div><h3>Understand the facility</h3><p class="ar">فهم طبيعة المنشأة، طبيعة المستخدمين، نقاط الخطر، وأهداف التشغيل.</p></div><div class="card"><div class="stat">02</div><h3>Build the operating plan</h3><p class="ar">تحديد الأدوار والإجراءات وخطط الجاهزية والطوارئ قبل بدء التشغيل.</p></div><div class="card"><div class="stat">03</div><h3>Run the operation</h3><p class="ar">إدارة فرق العمل والتشغيل اليومي مع وضوح المسؤوليات.</p></div><div class="card"><div class="stat">04</div><h3>Field supervision</h3><p class="ar">متابعة ميدانية فعلية، تقييم الأداء، وتحديد نقاط التحسين باستمرار.</p></div></div><div class="rule"></div><div class="grid2"><div><img class="photo" src="{field}"></div><div><h3>Built around readiness</h3><p>Safety and rescue readiness are treated as part of the operating system itself - not as decorative compliance language.</p><p class="ar">السلامة والإنقاذ والجاهزية ليست عناصر منفصلة عن التشغيل؛ بل جزء أساسي من طريقة إدارة الموقع يومًا بيوم.</p></div></div>{footer('03','Services & Operations')}</section>'''

portfolio_doc = f'''
<section class="page dark cover"><div class="brandbar"></div><img class="logo" src="{logo}"><span class="kicker" style="margin-top:9mm">PORTFOLIO / أماكن نتعامل معها</span><h1>Selected places and venues <span class="highlight">in the field.</span></h1><p class="ar" style="font-size:14pt;color:#dce8e8">نماذج من الأماكن والجهات التي تتعامل معها V.East، مع عرض بيانات عامة ووسائل تواصل مباشرة بشكل منظم.</p><img class="heroimg" src="{portfolio}">{footer('01','Portfolio')}</section>
<section class="page"><div class="brandbar"></div><span class="kicker">FEATURED VENUE / جهة مميزة</span><h2>ELITE Beach</h2><div class="grid2"><div><img class="venue-logo" src="{elite}"></div><div><span class="pill">Resort</span><span class="pill">Hotel</span><span class="pill">Beach</span><p><b>Location:</b> Ain Sokhna, Suez Governorate, Egypt</p><p><b>Phone:</b> 010 03783804</p><p><b>Email:</b> elitebeach2024@gmail.com</p><p><b>Public links:</b> elitebeach.bio.link • Instagram • Facebook</p><p class="ar">الحضور الرقمي العام لإيليت بيتش يعرض وجهة ضيافة في العين السخنة مع وسائل تواصل وروابط عامة مباشرة.</p></div></div><div class="rule"></div><p class="small">Public facts are presented conservatively. This profile does not claim unsupported ratings, prices, capacity, ownership, exclusivity, or contract status.</p>{footer('02','Portfolio')}</section>
<section class="page navy"><div class="brandbar"></div><span class="kicker">FEATURED VENUE / جهة مميزة</span><h2>Half moon</h2><div class="grid2"><div><img class="venue-logo" style="object-fit:cover" src="{half}"></div><div><span class="pill">Resort</span><span class="pill">Zagazig</span><span class="pill">Direct contact</span><p><b>Location:</b> Zagazig, Al Sharqia Governorate, Egypt</p><p><b>Phone:</b> 012 80296844</p><p><b>Additional phone:</b> 010 17180394</p><p class="ar">يعرض ملف هاف مون بيانات عامة ووسائل اتصال مباشرة تساعد على الوصول السريع للمعلومات الأساسية.</p></div></div><div class="rule"></div><div class="grid2"><div class="card"><h3>V.East operating focus</h3><p>Management, operations, safety, rescue readiness, first aid, emergency planning, and field supervision.</p></div><div class="card ar"><h3>حدود البيانات</h3><p>لا يتضمن هذا الملف أي ادعاءات غير موثقة عن التقييمات أو الأسعار أو السعة أو الملكية أو الحصرية أو تفاصيل العقود.</p></div></div>{footer('03','Portfolio')}</section>'''

for filename, title, body in [
    ('V-EAST-Company-Profile.pdf', 'V.East Company Profile', company),
    ('V-EAST-Services-Operations.pdf', 'V.East Services & Operations', services_doc),
    ('V-EAST-Portfolio-Featured-Venues.pdf', 'V.East Portfolio & Featured Venues', portfolio_doc),
]:
    HTML(string=doc(title, body), base_url=str(ROOT)).write_pdf(OUT / filename)
    print(f'generated {OUT / filename}')
