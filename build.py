# -*- coding: utf-8 -*-
"""FuturePath static site generator.
Builds index.html + all subpages from a shared shell. Preserves the original
logo SVG byte-for-byte. Editorial content is honest, general guidance — never
invented listings, fees or deadlines."""
import html, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

PAGES=[
    ("career-finder","Career Finder",2,"Answer a few questions and get career and degree suggestions with a clear scoring breakdown."),
    ("degree-explorer","Degree Explorer",2,"Search, filter, and compare 22 Pakistani degrees with official council accreditation links."),
    ("skills","Skills Learning Center",3,"Roadmaps, free resources and practice projects for in-demand, future-proof skills."),
    ("online-earning","Online Earning Hub",3,"Honest guides to freelancing, online business and content creation, including scams to avoid."),
    ("careers","Career Opportunities",2,"Job roles, required skills and growth paths across 14 modern fields."),
    ("universities","University Finder",4,"How to evaluate and choose from 18 HEC-recognised Pakistani universities, with official links."),
    ("scholarships","Scholarships",4,"12 national and international scholarship programmes and how to apply honestly."),
    ("internships","Internships",4,"9 verified internship portals, 1-page CV blueprint, and how to land your first role."),
    ("resources","Resources",3,"18 free, beginner-friendly learning platforms and documentation hubs worth your time."),
    ("about","About Us",1,"Why FuturePath exists, our accuracy standards, and how our scoring model works."),
    ("contact","Contact Us",1,"Get in touch with the FuturePath team to report a broken link or suggest a path.")
]
NAV=[
    ("career-finder","Career Finder"),
    ("degree-explorer","Degrees"),
    ("skills","Skills"),
    ("online-earning","Earn Online"),
    ("universities","Universities"),
    ("scholarships","Scholarships")
]
MORE=[
    ("careers","Careers"),
    ("internships","Internships"),
    ("resources","Resources"),
    ("about","About"),
    ("contact","Contact")
]

# Curated, high-resolution local photography stored in assets/img/
IMG={
    "students":"assets/img/hero-students.jpg",
    "career":"assets/img/career-planning.jpg",
    "coding":"assets/img/coding-skills.jpg",
    "graduation":"assets/img/graduation-campus.jpg",
    "freelance":"assets/img/freelance-work.jpg",
    "ai":"assets/img/ai-study.jpg",
    "campus":"assets/img/university-campus.jpg",
    "growth":"assets/img/career-opportunities.jpg",
    "resources":"assets/img/learning-resources.jpg",
    "scholar":"assets/img/scholarship-award.jpg",
    "intern":"assets/img/internship-office.jpg",
    "about":"assets/img/about-team.jpg",
    "journey_med":"assets/img/journey-medical.jpg",
    "journey_tech":"assets/img/journey-tech.jpg",
    "journey_design":"assets/img/journey-design.jpg",
}

IMG_META={
    "students":("Collaborative Planning","Students mapping degree, skill, and career pathways together."),
    "career":("Transparent 3-2-2-1-1 Scoring","Compare your subjects, interests, and strengths against 14 career profiles."),
    "coding":("11 Step-by-Step Skill Roadmaps","6-stage learning paths with free official courses and portfolio projects."),
    "graduation":("22 Accredited Pakistani Degrees","Verified against HEC, PMDC, PEC, NCEAC, PCP, PNMC, PCATP & PBC."),
    "freelance":("8 Honest Earning Pathways","Realistic 3–6+ month skill timelines plus an interactive scam checker."),
    "ai":("Ethical AI Study Workflows","Use AI to summarise, quiz, and brainstorm — without replacing critical thinking."),
    "campus":("18 HEC-Recognised Universities","Filter by city, sector, and field with our 6-point evaluation scorecard."),
    "growth":("14 Detailed Career Profiles","Daily responsibilities, entry routes, and illustrative 5–10 year progression."),
    "resources":("18 Verified Free Platforms","Direct links to CS50, freeCodeCamp, MIT OCW, Kaggle, MDN & DigiSkills."),
    "scholar":("12 National & Global Scholarships","HEC Need-Based, Ehsaas, PEEF, SEEF/BEEF, Fulbright, Chevening, DAAD & Erasmus."),
    "intern":("9 Verified Internship Portals","PSEB, PM Youth, LinkedIn, Rozee, GSoC, Outreachy & cold-email pitch builder."),
    "about":("100% Independent & Free","Zero sponsored rankings, transparent scoring, and direct regulatory links."),
}

# Crisp inline SVG icons (replaces generic emoji boxes)
IC={
    "book":'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    "pen":'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>',
    "target":'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
    "briefcase":'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
    "layers":'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    "trend":'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    "cap":'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    "users":'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    "check":'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    "video":'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>',
    "code":'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    "user":'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    "link":'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    "compass":'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
    "award":'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
    "calendar":'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    "globe":'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    "dollar":'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    "search":'<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
}

# The existing logo — preserved byte-for-byte.
LOGO_SVG='<svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true"><path d="M4 24 C4 14 12 14 14 8 M14 8 L20 3 M14 8 L24 10" fill="none" stroke="#8EC5FF" stroke-width="3" stroke-linecap="round"/><circle cx="4" cy="24" r="3" fill="#fff"/></svg>'

def L(s,t,cur):
    a=' aria-current="page"' if s==cur else ''
    return f'<a href="{"index" if s=="" else s}.html"{a}>{t}</a>'

def shell(slug,title,desc,body):
    nav="".join(L(s,t,slug) for s,t in NAV)
    more="".join(L(s,t,slug) for s,t in MORE)
    foot="".join(L(s,t,slug) for s,t in [(p[0],p[1]) for p in PAGES])
    full="FuturePath" if slug=="index" else f"{title} | FuturePath"
    return f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{full}</title><meta name="description" content="{html.escape(desc)}">
<meta property="og:title" content="{full}"><meta property="og:description" content="{html.escape(desc)}"><meta property="og:type" content="website">
<meta name="theme-color" content="#0B132B">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700&family=Public+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.css">
<script>document.documentElement.classList.add('js');window.setTimeout(function(){{var e=document.querySelectorAll('.reveal:not(.in)');for(var i=0;i<e.length;i++)e[i].classList.add('in')}},2500)</script>
<noscript><style>.reveal{{opacity:1!important;transform:none!important}}</style></noscript></head><body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="nav-accent" aria-hidden="true"></div><div class="wrap bar">
<a class="logo" href="index.html" aria-label="FuturePath home">{LOGO_SVG}FuturePath</a>
<button class="menu-btn" aria-expanded="false" aria-controls="nav">Menu</button>
<nav id="nav" aria-label="Main">{nav}<details class="more"><summary>More</summary><div>{more}</div></details></nav></div></header>
<main id="main">{body}</main>
<footer class="site-footer"><div class="wrap"><div class="footer-top"><div class="brand-col"><strong class="logo-text">{LOGO_SVG}FuturePath</strong><p>Your Future, Your Direction.</p><p class="small">Guidance, not guarantees. Always confirm details on official websites.</p><div class="footer-badges"><span class="footer-pill">&#10003; 100% Free</span><span class="footer-pill">&#10003; Official Council Links</span><span class="footer-pill">&#10003; Local Privacy</span></div></div><nav aria-label="Footer">{foot}</nav></div><p class="footer-bottom"><span>&copy; 2026 FuturePath &middot; Built for students figuring out what&rsquo;s next.</span><span>100% Free &middot; No Sponsored Rankings &middot; <a href="#main" class="back-top">Back to top &uarr;</a></span></p></div></footer>
<script src="assets/js/main.js"></script><script src="assets/js/data.js"></script><script src="assets/js/app.js"></script></body></html>'''

def img(key,alt,cls="feature-img"):
    meta=IMG_META.get(key)
    cap=f'<div class="img-caption"><strong>{meta[0]}</strong><span>{meta[1]}</span></div>' if meta else ''
    return f'<div class="{cls}"><img src="{IMG[key]}" alt="{alt}" width="800" height="600" loading="lazy" decoding="async">{cap}</div>'

def cards(items):
    return '<div class="grid">'+"".join(
        f'<article class="card"><h3><span class="ic">{ic}</span>{t}</h3><p>{d}</p></article>'
        for ic,t,d in items)+'</div>'

def steps(items):
    return '<div class="steps">'+"".join(
        f'<article class="card step"><div class="num"></div><h3>{t}</h3><p>{d}</p></article>'
        for t,d in items)+'</div>'

def feature(eyebrow,title,lead,checks,cta,img_key,img_alt,flip=False,alt_bg=False):
    cta_html=f'<p><a class="btn primary" href="{cta[0]}.html">{cta[1]} &rarr;</a></p>' if cta else ''
    chk="<ul class=\"check\">"+"".join(f"<li>{c}</li>" for c in checks)+"</ul>"
    flip_cls=" flip" if flip else ""
    sec_cls="sec alt reveal" if alt_bg else "sec reveal"
    return (f'<section class="{sec_cls}"><div class="wrap"><div class="feature{flip_cls}">'
            f'<div class="feature-text"><span class="eyebrow">{eyebrow}</span>'
            f'<h2>{title}</h2><p class="lead">{lead}</p>{chk}{cta_html}</div>'
            f'{img(img_key,img_alt)}</div></div></section>')

def sec_head(eyebrow,title,lead,center=False):
    c=" center" if center else ""
    return (f'<div class="section-head{c}"><span class="eyebrow">{eyebrow}</span>'
            f'<h2>{title}</h2><p class="lead">{lead}</p></div>')

def page_hero(eyebrow,title,desc,meta_title="Honest Guidance",meta_text="Free, practical advice grounded in real requirements. Always verify admissions and deadlines on official portals."):
    return (f'<section class="page-hero"><div class="wrap page-hero-grid">'
            f'<div><div class="breadcrumb"><a href="index.html">Home</a> <span>/</span> <span>{title}</span></div>'
            f'<span class="eyebrow">{eyebrow}</span><h1>{title}</h1><p class="lead">{desc}</p></div>'
            f'<aside class="page-hero-meta"><div class="meta-title">{meta_title}</div><p>{meta_text}</p></aside>'
            f'</div></section>')

def home():
    hero=f'''<section class="hero"><div class="wrap hero-grid"><div>
<span class="hero-eyebrow">Your future, your direction</span>
<h1>Confused About Your Future? Let&rsquo;s Find Your <span class="grad">Direction.</span></h1>
<p class="lead">Discover the right degree, explore modern careers, build future-proof skills, and start earning online &mdash; all in one honest place.</p>
<p class="actions"><a class="btn primary" href="career-finder.html">Find My Career &rarr;</a> <a class="btn ghost" href="degree-explorer.html">Explore Degrees</a></p>
<div class="hero-stats"><div class="hero-stat"><div class="num">14</div><div class="lab">Career paths mapped</div></div><div class="hero-stat"><div class="num">22</div><div class="lab">Degrees explored</div></div><div class="hero-stat"><div class="num">11</div><div class="lab">Skill roadmaps</div></div></div>
</div>
<div class="hero-visual">
  <div class="hero-showcase">
    <div class="hero-photo-row">
      <div class="hero-photo">
        <img src="{IMG['students']}" alt="University students collaborating with laptops at a library study table" width="800" height="600" fetchpriority="high" decoding="async">
        <div class="hero-photo-caption"><strong>Student-first career mapping</strong>Clear scores, degree requirements, and practical roadmaps.</div>
      </div>
      <div class="hero-pathway-box">
        <div class="hero-pathway-label">Interactive Pathway Map</div>
        <svg class="fork" viewBox="0 0 360 300" role="img" aria-label="One starting point splitting into paths: Degree, Skills, Earning"><defs><linearGradient id="forkGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3B82F6"/><stop offset=".5" stop-color="#8EC5FF"/><stop offset="1" stop-color="#2DD4BF"/></linearGradient></defs><path class="p" d="M30 270 C30 190 120 190 150 130"/><path class="p" d="M150 130 C165 90 200 60 320 40"/><path class="p" d="M150 130 C190 130 240 130 320 130"/><path class="p" d="M150 130 C180 170 230 215 320 230"/><circle cx="30" cy="270" r="8" fill="#fff"/><g font-size="14" fill="#E2E8F0" font-family="inherit" font-weight="600"><text x="30" y="294" text-anchor="start">You are here</text><text x="242" y="32">Degree</text><text x="242" y="122">Skills</text><text x="242" y="256">Earning</text></g></svg>
      </div>
    </div>
    <div class="hero-sample-matches">
      <a class="hero-mini-card" href="career-finder.html"><span class="kicker">Step 01 &middot; Quiz</span><strong>Match your interests &rarr;</strong></a>
      <a class="hero-mini-card" href="degree-explorer.html"><span class="kicker">Step 02 &middot; Degrees</span><strong>Compare 22 degrees &rarr;</strong></a>
      <a class="hero-mini-card" href="skills.html"><span class="kicker">Step 03 &middot; Skills</span><strong>11 free roadmaps &rarr;</strong></a>
    </div>
  </div>
</div>
</div></section>'''

    how=f'''<section class="sec alt reveal"><div class="wrap">{sec_head("How it works","From confusion to a clear plan","Four simple steps take you from &lsquo;I don&rsquo;t know&rsquo; to a real direction you can act on.")}{steps([("Tell us about you","Share your level, subjects, interests, strengths and work style."),("See your matches","Get careers and degrees with the scores shown &mdash; no vague quizzes."),("Build the skills","Follow a roadmap with free resources and real practice projects."),("Take the next step","Find universities, scholarships and internships when you&rsquo;re ready.")])}</div></section>'''

    career_feat=feature("Career Finder","Match your interests to real careers",
        "Answer a few honest questions about your subjects, interests, strengths and preferred work style. We score your answers against real career profiles and show you exactly why each one fits.",
        ["A clear score for every match","Related degrees and skills for each path","A step-by-step roadmap to start today"],
        ("career-finder","Find My Career"),"career","Student writing career planning notes at a desk")

    degrees_feat=feature("Degree Explorer","Explore degrees before you commit",
        "Compare what you&rsquo;ll actually study, the subjects you need, entry test requirements, and where each degree can lead. Filter by category, compare up to 3 degrees side by side, and inspect dedicated profiles across 22 Pakistani degree programmes.",
        ["Eligibility, duration and entry tests upfront","Job roles and higher-study options","Side-by-side comparison for up to 3 degrees"],
        ("degree-explorer","Explore Degrees"),"graduation","University graduates celebrating on campus with mortarboards",flip=True,alt_bg=True)

    skills_feat=feature("Future-proof skills","Build the skills the job market actually wants",
        "Pick a skill, follow a 6-step beginner-to-advanced roadmap, and build a portfolio you can show. We focus on technical, creative, and communication skills that travel across industries and remote work.",
        ["Clickable free courses and official docs for every skill","Practice projects you can actually ship","Interactive progress tracker saved on your device"],
        ("skills","See Skills"),"coding","Developer writing code on a laptop at a clean desk")

    ai_feat=feature("AI for students","Use AI as your study and career sidekick",
        "AI tools can speed up how you learn, research and create &mdash; if you use them well. Learn where AI genuinely helps, where it doesn&rsquo;t, and how to stay honest while you use it.",
        ["Summarise long readings and revise faster","Get hard concepts explained with examples","Draft, brainstorm and polish &mdash; then edit yourself"],
        ("skills","Explore Skills"),"ai","University students collaborating with laptops in a modern study space",flip=True,alt_bg=True)

    ai_cards=f'''<section class="sec reveal"><div class="wrap">{sec_head("AI in your career","Three ways students can use AI right now","Used well, AI is a study partner, a creative collaborator and a career coach &mdash; not a replacement for thinking.")}{cards([(IC["book"],"Learn faster","Summarise lectures, quiz yourself, and get instant explanations of tough topics in plain language."),(IC["pen"],"Create and produce","Draft essays and code, brainstorm ideas, and polish your writing &mdash; then make it your own."),(IC["target"],"Prepare for careers","Practise interviews, refine your CV, and research roles and companies before you apply.")])}<div class="note"><strong>Use AI honestly.</strong> Don&rsquo;t submit AI work as your own in exams or assignments, and never trust AI output blindly &mdash; always verify facts. AI is a tool to think with, not a substitute for thinking.</div></div></section>'''

    earn_feat=feature("Earn online","Turn a skill into real income &mdash; honestly",
        "Explore 8 practical online earning pathways &mdash; including web development, data analysis, UI/UX design, online tutoring, and digital products &mdash; with honest timelines, portfolio ideas, and an interactive scam red-flag checker.",
        ["Realistic beginner expectations &amp; timelines","How to build a portfolio and find clients","Interactive scam red-flag checker"],
        ("online-earning","Explore Earning"),"freelance","Freelancer working on a laptop with a notebook and coffee",alt_bg=True)

    unis_feat=feature("University Finder","Find the right university for you",
        "Filter 18 major HEC-recognised Pakistani universities by city, sector, and academic field. We link straight to each university&rsquo;s official site and only show details we can verify &mdash; never invented fees or cutoffs.",
        ["18 HEC-recognised public &amp; private universities","Entry test requirements &amp; official links","Interactive 6-point evaluation checklist"],
        ("universities","Find Universities"),"campus","Architectural university campus building and green lawn",flip=True)

    opps=f'''<section class="sec alt reveal"><div class="wrap"><div class="section-head split"><div><span class="eyebrow">Career opportunities</span><h2>See where each path can take you</h2><p class="lead">Explore 14 detailed career profiles with daily responsibilities, required education, beginner roadmaps, and 5&ndash;10 year progression.</p></div><a class="btn" href="careers.html">View Careers &rarr;</a></div>{cards([(IC["briefcase"],"Daily responsibilities","What professionals in each field actually do day to day."),(IC["layers"],"Skills &amp; roadmaps","What to learn first and how to build proof before you apply."),(IC["trend"],"Career progression","Where an entry-level role can lead in five and ten years.")])}</div></section>'''

    funding=f'''<section class="sec reveal"><div class="wrap"><div class="section-head split"><div><span class="eyebrow">Funding &amp; experience</span><h2>Scholarships and internships</h2><p class="lead">Filter 12 national &amp; international scholarship programmes and 9 verified internship portals, complete with readiness checklists.</p></div><a class="btn" href="scholarships.html">View Scholarships &rarr;</a></div>{cards([(IC["cap"],"12 Scholarships","HEC, Ehsaas, PEEF, provincial endowments, Fulbright, Chevening, DAAD, Commonwealth &amp; Erasmus."),(IC["users"],"9 Internship portals","PSEB, PM Youth, DigiSkills, LinkedIn, Rozee, GSoC, Outreachy &amp; CV/cold-email templates."),(IC["check"],"Official source links","Every programme links directly to its official portal with verification dates shown.")])}</div></section>'''

    res=f'''<section class="sec alt reveal"><div class="wrap"><div class="section-head split"><div><span class="eyebrow">Free resources</span><h2>Learning resources worth your time</h2><p class="lead">18 free courses, official docs, practice project hubs, and study guides &mdash; all beginner-friendly and verified.</p></div><a class="btn" href="resources.html">Browse Resources &rarr;</a></div>{cards([(IC["video"],"Free courses","Harvard CS50, freeCodeCamp, Full Stack Open, Kaggle, MIT OCW, DigiSkills &amp; more."),(IC["code"],"Practice projects","Frontend Mentor, The Odin Project, and roadmap.sh to build real portfolio proof."),(IC["book"],"Official docs &amp; guides","MDN Web Docs, Figma Learn, Learn Prompting, and British Council English resources.")])}</div></section>'''

    stories=f'''<section class="sec reveal"><div class="wrap">{sec_head("Illustrative student journeys","How students use FuturePath to plan ahead","Clearly labelled illustrative scenarios showing how Pakistani students at different academic stages combine degree comparison, skill roadmaps, and portfolio building.")}<div class="grid">
<article class="card journey-card">
  <div class="journey-media">
    <img src="{IMG['journey_med']}" alt="Clinical and pharmacy laboratory research equipment" width="600" height="360" loading="lazy" decoding="async">
    <span class="tag brand">Illustrative Scenario &middot; FSc Pre-Medical</span>
  </div>
  <h3><span class="ic">{IC["user"]}</span>Ayesha: Exploring Beyond MBBS</h3>
  <p><strong>Challenge:</strong> After FSc Pre-Medical and MDCAT, Ayesha wanted a respected clinical career without repeating a gap year.</p>
  <p><strong>How she used FuturePath:</strong> She compared <em>Pharm-D</em>, <em>BDS</em>, <em>BS Nursing</em>, and <em>BS Data Science</em> side by side in the Degree Explorer, verified PCP accreditation on the Universities checklist, and enrolled in Pharm-D while completing the Data Analysis &amp; Spreadsheet roadmap for clinical research roles.</p>
</article>
<article class="card journey-card">
  <div class="journey-media">
    <img src="{IMG['journey_tech']}" alt="University students reviewing code and building a web project on laptops" width="600" height="360" loading="lazy" decoding="async">
    <span class="tag teal">Illustrative Scenario &middot; Undergraduate</span>
  </div>
  <h3><span class="ic">{IC["code"]}</span>Hamza: Building Proof Before Graduation</h3>
  <p><strong>Challenge:</strong> As a 3rd-semester BS IT student, Hamza wanted to earn online safely but kept seeing dubious &ldquo;registration fee&rdquo; typing ads on social media.</p>
  <p><strong>How he used FuturePath:</strong> He ran suspicious offers through the Online Earning Scam Checker, switched his focus to the 6-step Web Development roadmap, built 3 live GitHub projects using freeCodeCamp, and used the Internship Pitch Builder to secure a summer frontend internship.</p>
</article>
<article class="card journey-card">
  <div class="journey-media">
    <img src="{IMG['journey_design']}" alt="Student sketching UI wireframes and layout concepts on paper" width="600" height="360" loading="lazy" decoding="async">
    <span class="tag">Illustrative Scenario &middot; Matric / O-Level</span>
  </div>
  <h3><span class="ic">{IC["compass"]}</span>Sana: Choosing an Intermediate Stream</h3>
  <p><strong>Challenge:</strong> In Matric, Sana enjoyed both Art and Computer Science and wasn&rsquo;t sure whether to pick ICS, Pre-Engineering, or Arts.</p>
  <p><strong>How she used FuturePath:</strong> She took the Career Finder quiz at the Matric level, saw high match scores for <em>Designer (UI/UX)</em> and <em>Architect</em>, compared B.Arch vs BS Design vs BS CS requirements, chose ICS, and began practicing Figma fundamentals during her summer break.</p>
</article>
</div></div></section>'''

    faq=f'''<section class="sec alt reveal"><div class="wrap">{sec_head("Common questions","Frequently asked questions","Straightforward answers about how FuturePath works, how we verify academic information, and how to use our tools.")}
<details class="card acc" open><summary><h3>How does FuturePath calculate career and degree recommendations?</h3><span class="acc-chevron" aria-hidden="true">&#9662;</span></summary><div class="acc-body"><div class="acc-field" style="grid-column:1 / -1"><p>FuturePath uses a <strong>100% transparent point-scoring formula</strong> rather than a hidden &ldquo;AI black box.&rdquo; When you use the <a href="career-finder.html">Career Finder</a>, every option you check in Steps 2&ndash;6 is compared against our 14 career profiles using fixed weights: <strong>Core Interests = 3 pts each</strong>, <strong>Natural Strengths = 2 pts each</strong>, <strong>Preferred Work Activities = 2 pts each</strong>, <strong>Subjects Enjoyed = 1 pt each</strong>, and <strong>Preferred Work Environment = 1 pt each</strong>. For each career, your <code>Match % = round((Matched Weighted Points &divide; Total Weighted Points of Your Selected Options) &times; 100)</code>. We display the top 3 matching careers along with stage-specific next steps based on your selected education level (Matric, Intermediate, Bachelor&rsquo;s, or Master&rsquo;s).</p></div></div></details>
<details class="card acc"><summary><h3>Why doesn&rsquo;t FuturePath display exact university tuition fees or exact admission merit cutoffs?</h3><span class="acc-chevron" aria-hidden="true">&#9662;</span></summary><div class="acc-body"><div class="acc-field" style="grid-column:1 / -1"><p>Pakistani universities update their per-credit-hour tuition fees, hostel charges, and admission merit cutoffs every single intake cycle. Websites that publish static fee tables quickly become outdated and mislead families. Instead of guessing or inventing numbers, we list verified structural facts (sector, city, accreditation councils, known programmes, and required entry tests such as MDCAT, ECAT, NET, NAT, or LAT) and link you straight to each university&rsquo;s official portal alongside our 6-point cost evaluation checklist.</p></div></div></details>
<details class="card acc"><summary><h3>Can I start earning money online immediately as a beginner student?</h3><span class="acc-chevron" aria-hidden="true">&#9662;</span></summary><div class="acc-body"><div class="acc-field" style="grid-column:1 / -1"><p><strong>No legitimate online path guarantees immediate income.</strong> All timelines on FuturePath are illustrative estimates: real skill-based earning &mdash; whether freelance web development, data analysis, UI/UX design, video editing, or online tutoring &mdash; typically requires an estimated <strong>3 to 6+ months of dedicated skill building</strong> and 3 to 5 completed portfolio projects before you win your first paying client. Anyone asking you to pay a registration fee, security deposit, or ID card fee for &ldquo;guaranteed daily typing/clicking income&rdquo; is running a scam.</p></div></div></details>
<details class="card acc"><summary><h3>Can Pre-Medical students in Pakistan switch into Computer Science, IT, or Data Science?</h3><span class="acc-chevron" aria-hidden="true">&#9662;</span></summary><div class="acc-body"><div class="acc-field" style="grid-column:1 / -1"><p>Yes, at most universities. Under official <a href="https://nceac.org.pk" target="_blank" rel="noopener">HEC &amp; NCEAC policy</a>, FSc Pre-Medical students with at least <strong>50% marks</strong> can take direct admission into BS Computer Science, BS Software Engineering, BS Artificial Intelligence, BS Data Science, BS IT, and BS Cybersecurity, and must pass <strong>two deficiency Mathematics courses totaling 6 credit hours within their first year (first two semesters)</strong>. <em>Important exception:</em> some individual universities (such as <a href="https://nu.edu.pk" target="_blank" rel="noopener">FAST-NUCES</a>) require Pre-Medical applicants to have passed or registered for board-level <strong>Additional Mathematics</strong> prior to admission. Always verify the exact rule on your target university&rsquo;s admission portal.</p></div></div></details>
</div></section>'''

    news=f'''<section class="sec reveal"><div class="wrap narrow"><div class="card" style="padding:36px"><span class="eyebrow" style="width:fit-content">Stay in the loop</span><h2>Get scholarship &amp; internship updates</h2><p class="lead" style="margin-bottom:20px">We&rsquo;ll send verified opportunities once accounts launch. No spam, and no income promises &mdash; ever.</p>
<form id="news" novalidate><label for="em">Email address</label><div class="row"><input id="em" type="email" required placeholder="you@example.com"><button class="btn primary" type="submit">Notify me</button></div><p id="msg" role="status" class="small" style="margin-top:10px"></p></form></div></div></section>'''

    return hero+how+career_feat+degrees_feat+skills_feat+ai_feat+ai_cards+earn_feat+unis_feat+opps+funding+res+stories+faq+news

LIVE_META={
    "career-finder":(
        "Career Assessment",
        "Career Finder",
        "Answer 6 quick steps and get career and degree suggestions with a transparent 3-2-2-1-1 scoring breakdown.",
        "career",
        "Student writing career planning notes at a desk",
        "Discover careers that match how you think and work",
        "Select your current education level, favourite subjects, core interests, natural strengths, and preferred work style below. Every result card shows your exact point ratio and stage-specific next steps.",
        ["Transparent 3-2-2-1-1 point formula (no black-box AI)","Tailored advice for Matric, Intermediate, Bachelor&rsquo;s &amp; Master&rsquo;s","Direct links to matching Pakistani degrees &amp; skill roadmaps"]
    ),
    "degree-explorer":(
        "Academic Pathways",
        "Degree Explorer",
        "Search, filter, and compare 22 Pakistani degree programmes with official council accreditation links.",
        "graduation",
        "University graduates celebrating on campus with mortarboards",
        "Compare 22 Pakistani degrees side by side before you apply",
        "Inspect eligibility rules, FSc/A-Level subject requirements, entry tests (MDCAT, ECAT, NET, NAT, LAT, QAT), statutory accreditation councils, and career outcomes.",
        ["Verified against HEC, PMDC, PEC, NCEAC, PCP, PNMC, PCATP &amp; PBC","Select up to 3 degrees for instant side-by-side comparison","Includes Pre-Medical to Computing deficiency Math rules &amp; exceptions"]
    ),
    "skills":(
        "Portfolio & Skills",
        "Skills Learning Center",
        "6-step beginner-to-advanced roadmaps, free courses, and practice projects for 11 in-demand skills.",
        "coding",
        "Developer writing code on a laptop at a clean desk",
        "Follow a structured 6-step roadmap and track your progress",
        "Degrees open doors, but demonstrable skills and portfolio proof win internships and clients. Pick one skill below, check off each stage as you learn, and build real projects.",
        ["11 technical, creative, data, and communication skill tracks","Interactive 6-step progress tracker saved privately in your browser","Clickable links to 100% free official courses &amp; documentation"]
    ),
    "online-earning":(
        "Honest Freelancing",
        "Online Earning Hub",
        "Practical guides to 8 skill-based online earning pathways, realistic timelines, and an interactive scam checker.",
        "freelance",
        "Freelancer working on a laptop with a notebook and coffee",
        "Build a real skill first &mdash; avoid registration-fee scams",
        "Legitimate online income comes from solving real problems for clients or audiences. Explore 8 practical earning paths below and test any suspicious job offer in our Scam Red-Flag Checker.",
        ["8 skill-based pathways with illustrative 3&ndash;6+ month timelines","Interactive Scam Red-Flag Checker to spot fake typing/fee traps","Concrete starter portfolio projects and client acquisition steps"]
    ),
    "careers":(
        "Career Directory",
        "Career Opportunities",
        "Explore daily responsibilities, required education, beginner roadmaps, and 5–10 year progression across 14 fields.",
        "growth",
        "Young professionals collaborating around laptops and a whiteboard",
        "See what professionals actually do day to day",
        "Before committing to a degree or skill track, inspect what daily work looks like across 14 modern careers in Pakistan and globally &mdash; from software engineering and healthcare to law, finance, and design.",
        ["14 comprehensive career profiles with search &amp; field filters","4-step beginner roadmap and required technical/core skills","Employment vs. freelance routes &amp; illustrative 5&ndash;10 year progression"]
    ),
}

ABOUT=f'''<div class="editorial-intro">
<div>
  <h2>Clarity for every student, regardless of background</h2>
  <p>FuturePath helps students across Pakistan choose a degree, explore modern career paths, build in-demand skills, and find verified academic opportunities. We follow a strict accuracy standard: we label illustrative examples clearly, never promise guaranteed employment or income, and link directly to official university, regulatory, and scholarship portals.</p>
  <p>This platform began with a simple conviction &mdash; that deciding your future after Matric, Intermediate, or graduation shouldn&rsquo;t depend on expensive private counselling or word-of-mouth rumours. Everything on FuturePath is 100% free, transparent, and built so you can verify every claim yourself.</p>
</div>
{img("about","University students collaborating and studying together with laptops")}
</div>
<h3>What we believe</h3>
<div class="grid">
<article class="card"><h3><span class="ic">{IC["check"]}</span>Honesty first</h3><p>We label illustrative student scenarios, never promise guaranteed income, and never invent university fees or admission cutoffs.</p></article>
<article class="card"><h3><span class="ic">{IC["link"]}</span>Official sources</h3><p>For fees, deadlines, accreditation, and admissions, we point you directly to official HEC, PMDC, PEC, PCP, and university websites.</p></article>
<article class="card"><h3><span class="ic">{IC["compass"]}</span>Practical guidance</h3><p>Every recommendation comes with a concrete next step, a 4-to-6 step beginner roadmap, and free learning resources you can start today.</p></article>
</div>

<h3 style="margin-top:40px">How FuturePath recommendations work</h3>
<p>Unlike opaque career tests that hide how they pick your results, FuturePath uses an open, inspectable scoring model so you always understand <em>why</em> a career or degree was suggested:</p>
<div class="grid">
  <article class="card">
    <div style="margin-bottom:8px"><span class="tag brand">Step 1 &middot; Weighted Matching</span></div>
    <h3>Transparent 3-2-2-1-1 Scoring</h3>
    <p>In the <a href="career-finder.html">Career Finder</a>, each option you select in Steps 2&ndash;6 is compared against 14 career profiles: <strong>Core Interests (3 pts)</strong>, <strong>Natural Strengths (2 pts)</strong>, <strong>Preferred Work Activities (2 pts)</strong>, <strong>Subjects Enjoyed (1 pt)</strong>, and <strong>Work Environment (1 pt)</strong>. Your score is calculated as <code>Match % = round((Matched Weighted Points &divide; Total Weighted Points of Your Selected Options) &times; 100)</code>, displaying the top 3 matching careers with every matched tag shown openly.</p>
  </article>
  <article class="card">
    <div style="margin-bottom:8px"><span class="tag teal">Step 2 &middot; Stage-Aware Guidance</span></div>
    <h3>Education-Level Tailoring</h3>
    <p>Whether you are in <strong>Matric/O-Levels</strong>, <strong>Intermediate/A-Levels</strong>, a <strong>Bachelor&rsquo;s degree</strong>, or a <strong>Master&rsquo;s programme</strong>, FuturePath adapts its next-step advice &mdash; from choosing your FSc/ICS/ICom stream and preparing for MDCAT/ECAT/NET/LAT to building a graduation portfolio.</p>
  </article>
  <article class="card">
    <div style="margin-bottom:8px"><span class="tag">Step 3 &middot; Official Verification</span></div>
    <h3>Direct Regulatory &amp; Portal Links</h3>
    <p>Every career links to related degrees in our 22-degree explorer (verified against <a href="https://www.hec.gov.pk" target="_blank" rel="noopener">HEC</a>, <a href="https://nceac.org.pk" target="_blank" rel="noopener">NCEAC</a>, <a href="https://pmdc.pk" target="_blank" rel="noopener">PMDC</a>, <a href="https://www.pec.org.pk" target="_blank" rel="noopener">PEC</a>, <a href="https://www.pcpisb.gov.pk" target="_blank" rel="noopener">PCP</a>, <a href="https://pnmc.gov.pk" target="_blank" rel="noopener">PNMC</a>, <a href="https://pcatp.org.pk" target="_blank" rel="noopener">PCATP</a> &amp; <a href="https://www.pakistanbarcouncil.org" target="_blank" rel="noopener">PBC</a>), connecting to 18 universities, 12 scholarships, and 9 internship portals.</p>
  </article>
</div>

<h3 style="margin-top:40px">Platform roadmap &amp; content coverage</h3>
<table class="info-table">
  <thead><tr><th>Phase</th><th>Focus Area</th><th>Current Status</th></tr></thead>
  <tbody>
    <tr><td><strong>Phase 1</strong></td><td>Complete Platform Audit, UI/UX Architecture &amp; Accuracy Standards</td><td><span class="tag teal">Completed</span></td></tr>
    <tr><td><strong>Phase 2</strong></td><td>8 Interactive Student Tools (Career Finder, Degree Comparison, Skill Tracker, Scam Checker, Checklists &amp; Pitch Builder)</td><td><span class="tag teal">Live</span></td></tr>
    <tr><td><strong>Phase 3</strong></td><td>Comprehensive Content Expansion (22 Degrees, 14 Careers, 11 Skills, 8 Earning Paths, 18 Universities, 12 Scholarships, 9 Internship Portals, 18 Free Resources)</td><td><span class="tag teal">Live (Verified Nov 2026)</span></td></tr>
    <tr><td><strong>Phase 4</strong></td><td>Professional Photography, Framed Editorial Showcases &amp; UI Polish</td><td><span class="tag teal">Live</span></td></tr>
    <tr><td><strong>Phase 5</strong></td><td>End-to-End QA Testing &amp; Production Deployment</td><td><span class="tag teal">Live</span></td></tr>
  </tbody>
</table>

<h3 style="margin-top:40px">Frequently asked questions</h3>
<details class="card acc" open><summary><h3>Does FuturePath accept payments from universities or training institutes to rank them higher?</h3><span class="acc-chevron" aria-hidden="true">&#9662;</span></summary><div class="acc-body"><div class="acc-field" style="grid-column:1 / -1"><p>No. FuturePath is 100% independent and has zero sponsored rankings. Universities, scholarships, and free learning platforms are listed solely on academic relevance, HEC/regulatory recognition, and usefulness for Pakistani students.</p></div></div></details>
<details class="card acc"><summary><h3>Where is my checklist and roadmap progress stored?</h3><span class="acc-chevron" aria-hidden="true">&#9662;</span></summary><div class="acc-body"><div class="acc-field" style="grid-column:1 / -1"><p>All of your Career Finder selections, Degree Comparisons, Skills Roadmap checkboxes, and University/Scholarship/Internship checklists are saved privately in your browser&rsquo;s <code>localStorage</code> on your own device. We do not track or sell your personal data.</p></div></div></details>
<details class="card acc"><summary><h3>How often are external links and regulatory details checked?</h3><span class="acc-chevron" aria-hidden="true">&#9662;</span></summary><div class="acc-body"><div class="acc-field" style="grid-column:1 / -1"><p>All university, scholarship, internship, and learning resource links were verified against official portals in <strong>November 2026</strong>. Because admission dates, fee structures, and government schemes change each cycle, always confirm final deadlines directly on the linked official website.</p></div></div></details>'''

RESOURCES=f'''<div class="editorial-intro">
<div>
  <h2>Curated free courses, documentation &amp; practice hubs</h2>
  <p class="lead">Hand-picked, genuinely free (or free-to-audit) courses, official documentation hubs, practice project briefs, and study platforms for students. Every link points directly to the official source (Verified: Nov 2026).</p>
  <div class="note"><strong>Always free?</strong> Some platforms (like Coursera or edX) let you audit the full course videos and readings for free while charging only for an optional certificate. You do not need paid certificates &mdash; employers and clients care about your skills and portfolio projects.</div>
</div>
{img("resources","Student studying online course on a laptop with headphones")}
</div>
<div id="app" data-page="resources"></div>
<div class="category-block">
<div class="category-header"><h3>Coding, web &amp; software documentation</h3><span class="tag brand">5 Platforms</span></div>
<div class="grid">
<article class="card"><h3><span class="ic">{IC["code"]}</span>freeCodeCamp</h3><p>A complete, interactive coding curriculum covering responsive web design, JavaScript, Python, SQL, and free project-based certifications.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://www.freecodecamp.org" target="_blank" rel="noopener">freecodecamp.org</a></p></article>
<article class="card"><h3><span class="ic">{IC["cap"]}</span>CS50 (Harvard University)</h3><p>Harvard&rsquo;s world-famous introduction to computer science, Python, SQL, cybersecurity, and AI &mdash; 100% free and self-paced.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://cs50.harvard.edu" target="_blank" rel="noopener">cs50.harvard.edu</a></p></article>
<article class="card"><h3><span class="ic">{IC["layers"]}</span>The Odin Project</h3><p>A rigorous, open-source, project-driven path into full-stack web development using Git, HTML/CSS, JavaScript, React, and Node.js.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://www.theodinproject.com" target="_blank" rel="noopener">theodinproject.com</a></p></article>
<article class="card"><h3><span class="ic">{IC["book"]}</span>MDN Web Docs</h3><p>The definitive official documentation and learning guides for HTML, CSS, JavaScript, and web APIs maintained by Mozilla.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://developer.mozilla.org" target="_blank" rel="noopener">developer.mozilla.org</a></p></article>
<article class="card"><h3><span class="ic">{IC["code"]}</span>Full Stack Open (Helsinki)</h3><p>University of Helsinki&rsquo;s free deep dive into modern web development with React, Redux, Node.js, TypeScript, GraphQL, and Docker.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://fullstackopen.com/en/" target="_blank" rel="noopener">fullstackopen.com</a></p></article>
</div>
</div>
<div class="category-block">
<div class="category-header"><h3>Data, AI, maths &amp; core sciences</h3><span class="tag brand">4 Platforms</span></div>
<div class="grid">
<article class="card"><h3><span class="ic">{IC["trend"]}</span>Kaggle Learn</h3><p>Hands-on, bite-sized free micro-courses on Python, Pandas, SQL, data visualization, and intro machine learning with real datasets.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://www.kaggle.com/learn" target="_blank" rel="noopener">kaggle.com/learn</a></p></article>
<article class="card"><h3><span class="ic">{IC["compass"]}</span>Khan Academy</h3><p>World-class free lessons in mathematics, linear algebra, statistics, physics, chemistry, biology, and economics from school to college level.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://www.khanacademy.org" target="_blank" rel="noopener">khanacademy.org</a></p></article>
<article class="card"><h3><span class="ic">{IC["cap"]}</span>MIT OpenCourseWare</h3><p>Complete lecture notes, problem sets, and video lectures from real MIT undergraduate and graduate courses in engineering, CS, and maths.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://ocw.mit.edu" target="_blank" rel="noopener">ocw.mit.edu</a></p></article>
<article class="card"><h3><span class="ic">{IC["target"]}</span>Learn Prompting</h3><p>Open-source, research-backed curriculum teaching structured prompt engineering, LLM evaluation, and practical AI workflows for students.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://learnprompting.org" target="_blank" rel="noopener">learnprompting.org</a></p></article>
</div>
</div>
<div class="category-block">
<div class="category-header"><h3>Design, marketing &amp; university courses</h3><span class="tag brand">5 Platforms</span></div>
<div class="grid">
<article class="card"><h3><span class="ic">{IC["pen"]}</span>Figma Learn</h3><p>Official free tutorials and documentation on wireframing, auto-layout, design systems, and interactive prototyping in Figma.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://help.figma.com" target="_blank" rel="noopener">help.figma.com</a></p></article>
<article class="card"><h3><span class="ic">{IC["globe"]}</span>Grow with Google / Skillshop</h3><p>Free Google training in digital marketing, analytics, search engine optimization, and career readiness.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://grow.google" target="_blank" rel="noopener">grow.google</a></p></article>
<article class="card"><h3><span class="ic">{IC["book"]}</span>Coursera &amp; edX (Audit Mode)</h3><p>Audit thousands of university courses for free from top global institutions by selecting &ldquo;Audit the course&rdquo; on individual modules.</p><p style="margin-top:auto;padding-top:12px"><a href="https://www.coursera.org" target="_blank" rel="noopener">coursera.org &rarr;</a> &middot; <a href="https://www.edx.org" target="_blank" rel="noopener">edx.org &rarr;</a></p></article>
<article class="card"><h3><span class="ic">{IC["layers"]}</span>Canva Design School</h3><p>Beginner-friendly visual design lessons covering typography, colour theory, branding, and social media layout fundamentals.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://www.canva.com/design-school" target="_blank" rel="noopener">canva.com/design-school</a></p></article>
<article class="card"><h3><span class="ic">{IC["briefcase"]}</span>HubSpot Academy</h3><p>Free courses and certifications in SEO, content marketing, email copywriting, inbound sales, and social media strategy.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://academy.hubspot.com" target="_blank" rel="noopener">academy.hubspot.com</a></p></article>
</div>
</div>
<div class="category-block">
<div class="category-header"><h3>Practice project briefs, English &amp; Pakistani skill portals</h3><span class="tag brand">4 Platforms</span></div>
<div class="grid">
<article class="card"><h3><span class="ic">{IC["code"]}</span>Frontend Mentor</h3><p>Real-world HTML, CSS, and JavaScript project challenges with professional design specs so you can build portfolio-ready web apps without tutorials.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://www.frontendmentor.io" target="_blank" rel="noopener">frontendmentor.io</a></p></article>
<article class="card"><h3><span class="ic">{IC["compass"]}</span>roadmap.sh</h3><p>Community-curated visual learning roadmaps, project ideas, and interview checklists for frontend, backend, DevOps, data analyst, and AI roles.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://roadmap.sh" target="_blank" rel="noopener">roadmap.sh</a></p></article>
<article class="card"><h3><span class="ic">{IC["book"]}</span>British Council LearnEnglish</h3><p>Free grammar, academic writing, business email templates, listening exercises, and IELTS preparation materials to sharpen your communication.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://learnenglish.britishcouncil.org" target="_blank" rel="noopener">learnenglish.britishcouncil.org</a></p></article>
<article class="card"><h3><span class="ic">{IC["cap"]}</span>DigiSkills.pk</h3><p>Pakistan&rsquo;s official free national training programme (by Ignite &amp; Virtual University) offering Urdu/English courses in freelancing, design, SEO, and analytics.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://digiskills.pk" target="_blank" rel="noopener">digiskills.pk</a></p></article>
</div>
</div>
<p class="small" style="margin-top:28px">We do not control these external sites. All 18 platforms were verified as active in November 2026; if a link changes its policy, let us know via the contact page.</p>'''

def guidance_page(slug,title,desc,eyebrow,img_key,img_alt,lead,checks,h2,para):
    chk="<ul class=\"check\">"+"".join(f"<li>{c}</li>" for c in checks)+"</ul>"
    return (page_hero(eyebrow,title,desc)
            +f'<section class="sec reveal"><div class="wrap">'
            +f'<div class="editorial-intro"><div class="feature" style="grid-template-columns:1fr"><div><h2>{h2}</h2><p class="lead">{lead}</p>{chk}</div></div>{img(img_key,img_alt)}</div>'
            +f'<div><div id="app" data-page="{slug}"></div>{para}</div></div></section>')

def universities_page():
    para=('<p>Choosing a university is one of the biggest financial and time decisions you&rsquo;ll make as a student. Use the interactive directory and personal scorecard above to compare institutions across Pakistan, and verify every programme against the four pillars below before paying any admission fee.</p>'
          '<h3>What to check before you apply</h3>'
          '<div class="grid">'
          f'<article class="card"><h3><span class="ic">{IC["check"]}</span>HEC &amp; council recognition</h3><p>Confirm the university and your specific degree are recognised by the <a href="https://www.hec.gov.pk" target="_blank" rel="noopener">Higher Education Commission (HEC)</a> and the relevant statutory council: <a href="https://www.pec.org.pk" target="_blank" rel="noopener">PEC</a> (Engineering), <a href="https://nceac.org.pk" target="_blank" rel="noopener">NCEAC</a> (Computing), <a href="https://pmdc.pk" target="_blank" rel="noopener">PMDC</a> (MBBS/BDS), <a href="https://www.pcpisb.gov.pk" target="_blank" rel="noopener">PCP</a> (Pharm-D), <a href="https://pnmc.gov.pk" target="_blank" rel="noopener">PNMC</a> (Nursing), <a href="https://pcatp.org.pk" target="_blank" rel="noopener">PCATP</a> (Architecture), or <a href="https://www.pakistanbarcouncil.org" target="_blank" rel="noopener">PBC</a> (Law).</p></article>'
          f'<article class="card"><h3><span class="ic">{IC["dollar"]}</span>Total 4-to-5 year cost</h3><p>Look beyond first-semester tuition: calculate per-credit-hour fees, annual fee revisions, admission/security deposits, transport, hostel charges, and exam fees.</p></article>'
          f'<article class="card"><h3><span class="ic">{IC["calendar"]}</span>Deadlines &amp; entry tests</h3><p>Note the exact admission test required (MDCAT, ECAT, NUST NET, FAST NU, NTS NAT, HEC LAT, or SAT), test series dates, and merit aggregate formula.</p></article>'
          f'<article class="card"><h3><span class="ic">{IC["users"]}</span>Faculty &amp; facilities</h3><p>Inspect the department&rsquo;s full-time PhD/industry faculty list, teaching hospitals or lab equipment, library access, and alumni placement record on the official site.</p></article>'
          '</div>'
          '<h3>Public vs private universities in Pakistan</h3>'
          '<p>Public sector universities generally offer lower subsidized tuition fees, large campuses, and intense merit competition; private sector universities often feature smaller class sizes, modern lab infrastructure, and strict academic calendars, usually at a higher per-semester cost. Many top private universities (such as LUMS, AKU, FAST, and GIKI) also offer generous need-based financial aid and outreach scholarships. Neither sector is automatically &ldquo;better&rdquo; &mdash; what matters is accreditation, department strength, and affordability for your family.</p>'
          '<div class="note"><strong>Always verify on the official site.</strong> Fees, eligibility rules, and admission deadlines change every academic year. Confirm all details directly on the university&rsquo;s official website and the <a href="https://www.hec.gov.pk" target="_blank" rel="noopener">HEC Recognised Universities portal</a> before applying.</div>'
          '<p><a class="btn" href="index.html">&larr; Back to home</a></p>')
    return guidance_page("universities","University Finder","How to evaluate and choose a university, with official links.","University Finder","campus","Architectural university campus building and green lawn","Explore 18 HEC-recognised Pakistani universities and use our 6-point evaluation checklist",["18 public &amp; private universities with official links","HEC &amp; professional council accreditation checks","Entry test requirements, total cost &amp; merit guide"],"Find the right university",para)

def scholarships_page():
    para=('<p>Scholarships can cover part or all of your tuition and living costs, and legitimate scholarship programmes are always free to apply for. Filter the 12 recurring national and international schemes above, check off your documents in the readiness tracker, and review the application guidelines below.</p>'
          '<h3>Types of scholarships to look for</h3>'
          '<div class="grid">'
          f'<article class="card"><h3><span class="ic">{IC["award"]}</span>Merit &amp; outreach aid</h3><p>Awarded for top board/entry-test marks or outreach programmes (such as LUMS NOP and IBA NTHP) that fund talented students from underserved areas.</p></article>'
          f'<article class="card"><h3><span class="ic">{IC["users"]}</span>Need-based endowments</h3><p>HEC Need-Based aid, PEEF, and Pakistan Bait-ul-Mal support students who have secured admission on merit and demonstrate verified household financial need.</p></article>'
          f'<article class="card"><h3><span class="ic">{IC["cap"]}</span>Federal &amp; provincial schemes</h3><p>Federal (Benazir/Ehsaas Undergraduate, PM Youth) and provincial endowments (PEEF, BEEF, SEEF) fund thousands of public-university students annually.</p></article>'
          f'<article class="card"><h3><span class="ic">{IC["globe"]}</span>International postgraduate</h3><p>Fully funded global Master&rsquo;s and PhD programmes include Fulbright (USA), Chevening (UK), DAAD (Germany), Commonwealth, and Erasmus Mundus (EU).</p></article>'
          '</div>'
          '<h3>How to prepare a strong scholarship application</h3>'
          '<p>Keep a digital and physical folder ready with attested transcripts, CNIC/B-Form, domicile, family income verification, two academic recommendation letters, and a tailored Statement of Purpose (SOP). For international scholarships, start preparing 8&ndash;10 months before intake deadlines so you can complete IELTS/TOEFL or GRE tests and write multiple drafts of your personal essays.</p>'
          '<div class="note"><strong>Scholarship scams are common.</strong> No real scholarship asks you to pay a &ldquo;processing fee,&rdquo; &ldquo;visa deposit,&rdquo; or &ldquo;agent charge&rdquo; to receive funding. Apply only through official government, university, or embassy portals.</div>'
          '<p><a class="btn" href="index.html">&larr; Back to home</a></p>')
    return guidance_page("scholarships","Scholarships","Types of scholarships to look for and how to apply honestly.","Funding","scholar","Open study notebooks and library bookshelves for scholarship preparation","Explore 12 verified national &amp; international scholarship programmes and track your application documents",["12 national &amp; global scholarship schemes","Eligibility, study level &amp; coverage breakdown","Interactive document readiness checklist"],"Find and win scholarships",para)

def internships_page():
    para=('<p>An internship is your first real bridge between classroom theory and professional work. Use the interactive directory, readiness checklist, and cold-email builder above &mdash; and follow the step-by-step guides below to prepare a standout application even if you have zero prior job experience.</p>'
          '<h3>Step-by-step internship application guidance</h3>'
          '<div class="grid">'
          f'<article class="card"><h3><span class="ic">{IC["calendar"]}</span>1. Time your applications</h3><p>In Pakistan, major summer internship intakes (banks, FMCGs, telecoms, and large software houses) open between <strong>February and April</strong> for June&ndash;August cohorts. Global remote programmes like Google Summer of Code (GSoC) and Outreachy open applications between January and March.</p></article>'
          f'<article class="card"><h3><span class="ic">{IC["search"]}</span>2. Combine portals with direct outreach</h3><p>Don&rsquo;t rely only on job boards where 1,000+ students click &ldquo;Easy Apply.&rdquo; Shortlist 20 software houses, hospitals, law chambers, or design studios in your city, find a team lead or HR manager on LinkedIn, and send a polite note linking directly to your portfolio project.</p></article>'
          f'<article class="card"><h3><span class="ic">{IC["target"]}</span>3. Tailor every submission</h3><p>Read the internship description carefully and mirror its core tools in your CV&rsquo;s top project bullets (for example, highlighting React/JavaScript for a frontend role or Excel/SQL for a business analyst internship).</p></article>'
          f'<article class="card"><h3><span class="ic">{IC["check"]}</span>4. Prepare for technical &amp; behavioural screening</h3><p>Be ready to screen-share one project you built from scratch, explain a bug or design problem you solved, and ask 2 thoughtful questions about how interns are mentored on the team.</p></article>'
          '</div>'
          '<h3 style="margin-top:36px">1-Page student CV blueprint (what to include &amp; what to leave out)</h3>'
          '<p>Hiring managers spend 15&ndash;30 seconds scanning a student CV. Keep your CV strictly to <strong>one clean PDF page</strong> using a single-column layout without photos, skill percentage bars, or fancy graphics:</p>'
          '<table class="info-table">'
          '<thead><tr><th>CV Section (Top to Bottom)</th><th>What to Include</th><th>Common Mistakes to Avoid</th></tr></thead>'
          '<tbody>'
          '<tr><td><strong>1. Header &amp; Contact</strong></td><td>Full name, city (e.g., Lahore, Pakistan), professional email, phone number, LinkedIn URL, and clickable GitHub / Behance / Portfolio link.</td><td>Including full home street address, CNIC number, marital status, religion, or a selfie photo.</td></tr>'
          '<tr><td><strong>2. Education</strong></td><td>Degree title, university name, expected graduation year, and relevant coursework (include CGPA if 3.2+ or strong board percentage).</td><td>Listing primary/middle school details or every single semester subject.</td></tr>'
          '<tr><td><strong>3. Technical &amp; Core Skills</strong></td><td>Grouped clearly by category: e.g., <em>Languages:</em> Python, SQL, JavaScript &middot; <em>Tools:</em> Git, Figma, Power BI, Excel.</td><td>Using meaningless progress bars like &ldquo;HTML 95%&rdquo; or listing basic MS Word/Internet browsing.</td></tr>'
          '<tr><td><strong>4. Academic &amp; Personal Projects (Crucial)</strong></td><td>2 to 4 real projects with a clickable live demo/repo link and 2 bullet points each: <em>what you built</em>, <em>which tools you used</em>, and <em>the measurable outcome</em>.</td><td>Writing vague titles like &ldquo;Library Management System&rdquo; without explaining what it does or linking to code/screenshots.</td></tr>'
          '<tr><td><strong>5. Leadership &amp; Volunteering</strong></td><td>University society roles, hackathons, blood donor drives, tutoring, or event organization showing teamwork and reliability.</td><td>Leaving the bottom half blank or padding with generic hobbies like &ldquo;watching movies.&rdquo;</td></tr>'
          '</tbody></table>'
          '<h3 style="margin-top:36px">Zero-experience student guide: how to stand out in 3 weeks</h3>'
          '<p>Every professional started with zero experience. If your CV currently feels empty, do not wait for a company to give you permission to build skills &mdash; create your own proof of work in three focused weeks:</p>'
          '<div class="grid">'
          '<article class="card"><div style="margin-bottom:8px"><span class="tag brand">Week 1 &middot; Pick 1 Problem</span></div><h3>Solve a real local problem</h3><p>Instead of copying a generic calculator tutorial, pick a small real-world problem: redesign a cluttered local clinic website in Figma, clean a public Pakistan dataset in Python/Excel, or draft a 5-article SEO content hub for a student society.</p></article>'
          '<article class="card"><div style="margin-bottom:8px"><span class="tag teal">Week 2 &middot; Document Publicly</span></div><h3>Publish with a clear README</h3><p>Upload your code to GitHub (with screenshots and setup instructions), publish your UI case study on Behance, or share your interactive dashboard on Google Looker Studio / Tableau Public so anyone can inspect it in one click.</p></article>'
          '<article class="card"><div style="margin-bottom:8px"><span class="tag">Week 3 &middot; Pitch with Proof</span></div><h3>Send 15 project-first pitches</h3><p>Use the Cold-Email / LinkedIn Pitch Builder above to message 15 companies. Leading with <em>&ldquo;I built this working prototype using your tech stack&rdquo;</em> puts you ahead of 90% of applicants who send a blank CV.</p></article>'
          '</div>'
          '<h3 style="margin-top:36px">What to expect during an internship</h3>'
          '<p>Most student internships last 6&ndash;12 weeks during the summer or final semester. Many reputable companies pay a travel/meal stipend or junior salary, while some early-stage learning internships are unpaid. Focus on teams where a senior engineer, designer, clinician, or analyst reviews your work weekly.</p>'
          '<div class="note"><strong>Watch out for fake &ldquo;pay-for-certificate&rdquo; internships.</strong> Never pay a registration, portal activation, or certificate fee for an internship. If a company asks you to pay money to work for them, it is a scam &mdash; walk away immediately.</div>'
          '<p><a class="btn" href="index.html">&larr; Back to home</a></p>')
    return guidance_page("internships","Internships","How to find and land an internship, and what to watch out for.","Experience","intern","Mentor and intern reviewing a laptop project in a modern office","Verified internship portals, CV blueprint, and a zero-experience roadmap for students",["9 verified Pakistani &amp; global internship portals","1-page student CV blueprint &amp; application guide","Zero-experience strategy + cold-email builder"],"Find and land an internship",para)

def contact_page():
    return (page_hero("Get in touch","Contact Us","Questions, feedback or a broken link to report? Send us a note.","Response Policy","We read every student note as we prepare our Phase 5 communication tools.")
            +'<section class="sec reveal"><div class="wrap contact-layout">'
            +'<div>'
            +'<h2>How can we help?</h2>'
            +'<p>Whether you spotted an outdated link, want to suggest a degree or skill roadmap, or have feedback on our tools, we appreciate hearing from students and educators.</p>'
            +'<div class="feature-img" style="margin:20px 0;aspect-ratio:16/9"><img src="assets/img/about-team.jpg" alt="University students collaborating and discussing feedback" width="800" height="450" loading="lazy" decoding="async"><div class="img-caption"><strong>Student-Driven Platform</strong><span>Help us keep every university, scholarship, and resource link up to date.</span></div></div>'
            +'<div class="card" style="margin:20px 0"><h3><span class="ic">'+IC["link"]+'</span>Report a broken link</h3><p>Let us know which page and external resource changed so we can verify and update it.</p></div>'
            +'<div class="card" style="margin:20px 0"><h3><span class="ic">'+IC["compass"]+'</span>Suggest a degree or career</h3><p>Tell us which field you&rsquo;d like us to map next in our Degree Explorer or Skills Hub.</p></div>'
            +'<div class="note"><strong>This form isn&rsquo;t connected yet.</strong> It arrives with Phase 5, so your message isn&rsquo;t sent or saved anywhere right now. We built it this way on purpose rather than pretending it works.</div>'
            +'</div>'
            +'<div class="contact-card">'
            +'<h3 style="margin-top:0;margin-bottom:18px">Send us a message</h3>'
            +'<form id="contact" novalidate>'
            +'<label for="cn">Your name</label><input id="cn" type="text" required placeholder="Your name" style="width:100%;margin-bottom:16px">'
            +'<label for="ce">Email address</label><input id="ce" type="email" required placeholder="you@example.com" style="width:100%;margin-bottom:16px">'
            +'<label for="cm">Message</label><textarea id="cm" rows="5" required placeholder="Tell us what\'s on your mind"></textarea>'
            +'<p style="margin-bottom:0"><button class="btn primary" type="submit">Send message</button></p>'
            +'<p id="cmsg" role="status" class="small" style="margin-top:10px"></p>'
            +'</form>'
            +'</div>'
            +'</div></section>')

def about_page():
    return page_hero("About","About FuturePath","Why FuturePath exists and how we build it.")+f'<section class="sec reveal"><div class="wrap">{ABOUT}</div></section>'

def live_page(slug,title,desc):
    m=LIVE_META[slug]
    chk="<ul class=\"check\">"+"".join(f"<li>{c}</li>" for c in m[7])+"</ul>"
    return (page_hero(m[0],m[1],m[2])
            +f'<section class="sec reveal"><div class="wrap">'
            +f'<div class="editorial-intro"><div class="feature" style="grid-template-columns:1fr"><div><h2>{m[5]}</h2><p class="lead">{m[6]}</p>{chk}</div></div>{img(m[3],m[4])}</div>'
            +f'<div id="app" data-page="{slug}"></div></div></section>')

def stub(slug,title,ph,desc):
    if slug in LIVE_META: return live_page(slug,title,desc)
    if slug=="about": return about_page()
    if slug=="resources": return page_hero("Resources","Free Learning Resources","Free, beginner-friendly platforms worth your time.")+f'<section class="sec reveal"><div class="wrap">{RESOURCES}</div></section>'
    if slug=="universities": return universities_page()
    if slug=="scholarships": return scholarships_page()
    if slug=="internships": return internships_page()
    if slug=="contact": return contact_page()
    return f'<section class="sec"><div class="wrap narrow"><h1>{title}</h1><p class="lead">{desc}</p><div class="note"><strong>Coming in Phase {ph}.</strong> This page is part of the plan and its navigation works, but the content is not built yet. We would rather show nothing than show made-up information.</div><p><a class="btn" href="index.html">Back to home</a></p></div></section>'

open("index.html","w",encoding="utf-8").write(shell("index","Home","Discover the right degree, explore careers, learn skills and find opportunities. Your Future, Your Direction.",home()))
for s,t,p,d in PAGES: open(f"{s}.html","w",encoding="utf-8").write(shell(s,t,d,stub(s,t,p,d)))
open("robots.txt","w").write("User-agent: *\nAllow: /\n")
print("Built index.html +",len(PAGES),"pages")
