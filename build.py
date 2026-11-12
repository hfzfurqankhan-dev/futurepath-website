# -*- coding: utf-8 -*-
"""FuturePath static site generator.
Builds index.html + all subpages from a shared shell. Preserves the original
logo SVG byte-for-byte. Editorial content is honest, general guidance — never
invented listings, fees or deadlines."""
import html, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

PAGES=[
    ("career-finder","Career Finder",2,"Answer a few questions and get career and degree suggestions with a clear scoring breakdown."),
    ("degree-explorer","Degree Explorer",2,"Search and filter degrees, each with its own detailed page."),
    ("skills","Skills Learning Center",3,"Roadmaps, free resources and practice projects for in-demand, future-proof skills."),
    ("online-earning","Online Earning Hub",3,"Honest guides to freelancing, online business and content creation, including scams to avoid."),
    ("careers","Career Opportunities",2,"Job roles, required skills and growth paths across modern fields."),
    ("universities","University Finder",4,"How to evaluate and choose a university, with official links."),
    ("scholarships","Scholarships",4,"Types of scholarships to look for and how to apply honestly."),
    ("internships","Internships",4,"How to find and land an internship, and what to watch out for."),
    ("resources","Resources",3,"Free, beginner-friendly learning platforms worth your time."),
    ("about","About Us",1,"Why FuturePath exists and how we build it."),
    ("contact","Contact Us",1,"Get in touch with the FuturePath team.")
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

# Real, reachable image URLs (ZAI image-search, OSS-hosted).
IMG={
    "students":"https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a3d8b6a4eebc.jpg",
    "career":"https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/4c0a5dc8e8df.jpg",
    "coding":"https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/49fdfceeddb2.jpg",
    "graduation":"https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/dba1de33b1c7.jpg",
    "freelance":"https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/03aef95ce23a.jpg",
    "ai":"https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c780a0999e3a.jpg",
    "campus":"https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/55fc5fc376a2.jpg",
    "growth":"https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e44af7bf67e9.jpg",
    "resources":"https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/20ad32759ef5.jpg",
    "scholar":"https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/399ad505c8ba.jpg",
    "intern":"https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/eb8622aea211.jpg",
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
<footer class="site-footer"><div class="wrap"><div class="footer-top"><div class="brand-col"><strong class="logo-text">{LOGO_SVG}FuturePath</strong><p>Your Future, Your Direction.</p><p class="small">Guidance, not guarantees. Always confirm details on official websites.</p></div><nav aria-label="Footer">{foot}</nav></div><p class="footer-bottom"><span>&copy; 2026 FuturePath &middot; Built for students figuring out what&rsquo;s next.</span><span>100% Free &middot; No Sponsored Rankings</span></p></div></footer>
<script src="assets/js/main.js"></script><script src="assets/js/data.js"></script><script src="assets/js/app.js"></script></body></html>'''

def img(key,alt,cls="feature-img"):
    return f'<div class="{cls}"><img src="{IMG[key]}" alt="{alt}" loading="lazy" decoding="async"></div>'

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
<div class="hero-stats"><div class="hero-stat"><div class="num">10</div><div class="lab">Career paths mapped</div></div><div class="hero-stat"><div class="num">10</div><div class="lab">Degrees explored</div></div><div class="hero-stat"><div class="num">7</div><div class="lab">Skill roadmaps</div></div></div>
</div>
<div class="hero-visual">
  <div class="hero-showcase">
    <div class="hero-photo-row">
      <div class="hero-photo">
        <img src="{IMG['students']}" alt="Students collaborating and planning their academic and career roadmap" decoding="async">
        <div class="hero-photo-caption"><strong>Student-first career mapping</strong>Clear scores, degree requirements, and practical roadmaps.</div>
      </div>
      <div class="hero-pathway-box">
        <div class="hero-pathway-label">Interactive Pathway Map</div>
        <svg class="fork" viewBox="0 0 360 300" role="img" aria-label="One starting point splitting into paths: Degree, Skills, Earning"><defs><linearGradient id="forkGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3B82F6"/><stop offset=".5" stop-color="#8EC5FF"/><stop offset="1" stop-color="#2DD4BF"/></linearGradient></defs><path class="p" d="M30 270 C30 190 120 190 150 130"/><path class="p" d="M150 130 C165 90 200 60 320 40"/><path class="p" d="M150 130 C190 130 240 130 320 130"/><path class="p" d="M150 130 C180 170 230 215 320 230"/><circle cx="30" cy="270" r="8" fill="#fff"/><g font-size="14" fill="#E2E8F0" font-family="inherit" font-weight="600"><text x="30" y="294" text-anchor="start">You are here</text><text x="242" y="32">Degree</text><text x="242" y="122">Skills</text><text x="242" y="256">Earning</text></g></svg>
      </div>
    </div>
    <div class="hero-sample-matches">
      <a class="hero-mini-card" href="career-finder.html"><span class="kicker">Step 01 &middot; Quiz</span><strong>Match your interests &rarr;</strong></a>
      <a class="hero-mini-card" href="degree-explorer.html"><span class="kicker">Step 02 &middot; Degrees</span><strong>Compare 10 degrees &rarr;</strong></a>
      <a class="hero-mini-card" href="skills.html"><span class="kicker">Step 03 &middot; Skills</span><strong>7 free roadmaps &rarr;</strong></a>
    </div>
  </div>
</div>
</div></section>'''

    how=f'''<section class="sec alt reveal"><div class="wrap">{sec_head("How it works","From confusion to a clear plan","Four simple steps take you from &lsquo;I don&rsquo;t know&rsquo; to a real direction you can act on.")}{steps([("Tell us about you","Share your level, subjects, interests, strengths and work style."),("See your matches","Get careers and degrees with the scores shown &mdash; no vague quizzes."),("Build the skills","Follow a roadmap with free resources and real practice projects."),("Take the next step","Find universities, scholarships and internships when you&rsquo;re ready.")])}</div></section>'''

    career_feat=feature("Career Finder","Match your interests to real careers",
        "Answer a few honest questions about your subjects, interests, strengths and preferred work style. We score your answers against real career profiles and show you exactly why each one fits.",
        ["A clear score for every match","Related degrees and skills for each path","A step-by-step roadmap to start today"],
        ("career-finder","Find My Career"),"career","A young student thinking about their future career path")

    degrees_feat=feature("Degree Explorer","Explore degrees before you commit",
        "Compare what you&rsquo;ll actually study, the subjects you need, and where each degree can lead. Filter by category, search by subject or job, and open a dedicated page for every degree.",
        ["Eligibility and duration upfront","Job roles and higher-study options","Instant search and filtering"],
        ("degree-explorer","Explore Degrees"),"graduation","University graduates celebrating with diplomas",flip=True,alt_bg=True)

    skills_feat=feature("Future-proof skills","Build the skills the job market actually wants",
        "Pick a skill, follow a step-by-step roadmap, and build a portfolio you can show. We focus on digital and future-proof skills that travel across industries and remote work.",
        ["Free courses and tools for every skill","Practice projects you can actually ship","Portfolio guidance that gets you noticed"],
        ("skills","See Skills"),"coding","Programmer coding on a laptop with multiple monitors")

    ai_feat=feature("AI for students","Use AI as your study and career sidekick",
        "AI tools can speed up how you learn, research and create &mdash; if you use them well. Learn where AI genuinely helps, where it doesn&rsquo;t, and how to stay honest while you use it.",
        ["Summarise long readings and revise faster","Get hard concepts explained with examples","Draft, brainstorm and polish &mdash; then edit yourself"],
        ("skills","Explore Skills"),"ai","Artificial intelligence and neural network concept",flip=True,alt_bg=True)

    ai_cards=f'''<section class="sec reveal"><div class="wrap">{sec_head("AI in your career","Three ways students can use AI right now","Used well, AI is a study partner, a creative collaborator and a career coach &mdash; not a replacement for thinking.")}{cards([(IC["book"],"Learn faster","Summarise lectures, quiz yourself, and get instant explanations of tough topics in plain language."),(IC["pen"],"Create and produce","Draft essays and code, brainstorm ideas, and polish your writing &mdash; then make it your own."),(IC["target"],"Prepare for careers","Practise interviews, refine your CV, and research roles and companies before you apply.")])}<div class="note"><strong>Use AI honestly.</strong> Don&rsquo;t submit AI work as your own in exams or assignments, and never trust AI output blindly &mdash; always verify facts. AI is a tool to think with, not a substitute for thinking.</div></div></section>'''

    earn_feat=feature("Earn online","Turn a skill into real income &mdash; honestly",
        "Freelancing, content creation and small online businesses are real, but they take time. We give you honest timelines, the skills you need, and a clear scam checklist &mdash; no &lsquo;get rich quick&rsquo; promises.",
        ["Realistic learning timelines","How to find and keep clients","Scam red flags to watch for"],
        ("online-earning","Explore Earning"),"freelance","Freelancer working remotely on a laptop in a modern cafe",alt_bg=True)

    unis_feat=feature("University Finder","Find the right university for you",
        "Filter by city, degree and public or private. We link straight to each university&rsquo;s official site and only show details we can verify &mdash; never invented fees or numbers.",
        ["Official links only","Verified admission information","Public and private options"],
        ("universities","Find Universities"),"campus","Modern university campus building",flip=True)

    opps=f'''<section class="sec alt reveal"><div class="wrap"><div class="section-head split"><div><span class="eyebrow">Career opportunities</span><h2>See where each path can take you</h2><p class="lead">Real job roles, the skills each one asks for, and where you could be in five years.</p></div><a class="btn" href="careers.html">View Careers &rarr;</a></div>{cards([(IC["briefcase"],"Job roles","What people in each field actually do day to day."),(IC["layers"],"Skills needed","What to learn before you apply &mdash; mapped clearly."),(IC["trend"],"Growth paths","Where a role can lead in five and ten years.")])}</div></section>'''

    funding=f'''<section class="sec reveal"><div class="wrap"><div class="section-head split"><div><span class="eyebrow">Funding &amp; experience</span><h2>Scholarships and internships</h2><p class="lead">Every listing shows a deadline and when we last verified it. Closed opportunities are clearly marked.</p></div><a class="btn" href="scholarships.html">View Scholarships &rarr;</a></div>{cards([(IC["cap"],"Scholarships","Pakistani and international, undergraduate and graduate."),(IC["users"],"Internships","Local, remote and online opportunities."),(IC["check"],"Verified dates","Every listing shows its deadline and last-checked date.")])}</div></section>'''

    res=f'''<section class="sec alt reveal"><div class="wrap"><div class="section-head split"><div><span class="eyebrow">Free resources</span><h2>Learning resources worth your time</h2><p class="lead">Free courses, practice projects and study guides &mdash; all beginner-friendly and checked by us.</p></div><a class="btn" href="resources.html">Browse Resources &rarr;</a></div>{cards([(IC["video"],"Free courses","Beginner-friendly courses we&rsquo;ve actually reviewed."),(IC["code"],"Practice projects","Build something real you can show off."),(IC["book"],"Study guides","Short, clear and organised by topic.")])}</div></section>'''

    stories=f'''<section class="sec reveal"><div class="wrap">{sec_head("Student stories","Stories from students like you","Sample stories shown as placeholders &mdash; real ones will replace them.")}{cards([(IC["user"],"Sample: Ayesha","Intermediate student who used the roadmap to pick a degree she was unsure about."),(IC["code"],"Sample: Hamza","Built a portfolio and landed his first freelance project."),(IC["compass"],"Sample: Sana","Compared career options before choosing her stream in Matric.")])}</div></section>'''

    news=f'''<section class="sec alt reveal"><div class="wrap narrow"><div class="card" style="padding:36px"><span class="eyebrow" style="width:fit-content">Stay in the loop</span><h2>Get scholarship &amp; internship updates</h2><p class="lead" style="margin-bottom:20px">We&rsquo;ll send verified opportunities once accounts launch. No spam, and no income promises &mdash; ever.</p>
<form id="news" novalidate><label for="em">Email address</label><div class="row"><input id="em" type="email" required placeholder="you@example.com"><button class="btn primary" type="submit">Notify me</button></div><p id="msg" role="status" class="small" style="margin-top:10px"></p></form></div></div></section>'''

    return hero+how+career_feat+degrees_feat+skills_feat+ai_feat+ai_cards+earn_feat+unis_feat+opps+funding+res+stories+news

LIVE={"career-finder","degree-explorer","skills","online-earning","careers"}

ABOUT=f'''<div class="editorial-intro">
<div>
  <h2>Clarity for every student, regardless of background</h2>
  <p>FuturePath helps students choose a degree, build skills and find opportunities. We aim to be honest: we label sample data, never promise income, and link to official sources wherever we can.</p>
  <p>This site began as a simple idea &mdash; that deciding your future shouldn&rsquo;t depend on who you know or how much you can pay for advice. So we keep everything free, plain-spoken and grounded in real information. Where we&rsquo;re still building (universities, scholarships and internships listings), we say so clearly rather than inventing details.</p>
</div>
<div class="feature-img"><img src="{IMG['students']}" alt="Students studying and planning together" loading="lazy" decoding="async"></div>
</div>
<h3>What we believe</h3>
<div class="grid">
<article class="card"><h3><span class="ic">{IC["check"]}</span>Honesty first</h3><p>We label sample data, never promise income, and admit what we don&rsquo;t know yet.</p></article>
<article class="card"><h3><span class="ic">{IC["link"]}</span>Official sources</h3><p>For fees, deadlines and admissions, we point you to the real websites &mdash; not our memory.</p></article>
<article class="card"><h3><span class="ic">{IC["compass"]}</span>Practical guidance</h3><p>Every recommendation comes with a next step you can actually take today.</p></article>
</div>
<h3 style="margin-top:40px">Platform roadmap &amp; transparency</h3>
<table class="info-table">
  <thead><tr><th>Phase</th><th>Focus Area</th><th>Current Status</th></tr></thead>
  <tbody>
    <tr><td><strong>Phase 1 &ndash; 2</strong></td><td>Career Finder &amp; Degree Explorer (10 degrees, 10 career profiles)</td><td><span class="tag teal">Live (Sample Guidance)</span></td></tr>
    <tr><td><strong>Phase 3</strong></td><td>Skills Learning Center, AI Guidance &amp; Online Earning Hub</td><td><span class="tag teal">Live (Roadmaps &amp; Checklists)</span></td></tr>
    <tr><td><strong>Phase 4</strong></td><td>Verified Universities, Scholarships &amp; Internships Directory</td><td><span class="tag brand">Evaluation Guides Live</span></td></tr>
    <tr><td><strong>Phase 5</strong></td><td>Email Alerts &amp; Direct Contact Submissions</td><td><span class="tag">Planned</span></td></tr>
  </tbody>
</table>'''

RESOURCES=f'''<div class="editorial-intro">
<div>
  <p class="lead">Hand-picked, genuinely free (or free-to-audit) platforms that we recommend to students starting out. Every link goes to the platform&rsquo;s official site.</p>
  <div class="note"><strong>Always free?</strong> Some platforms let you audit courses for free but charge for a certificate. That&rsquo;s fine &mdash; the learning is what matters. You do not need a certificate to build skills or a portfolio.</div>
</div>
<div class="feature-img"><img src="{IMG['resources']}" alt="Books and a laptop on a study desk" loading="lazy" decoding="async"></div>
</div>
<div class="category-block">
<div class="category-header"><h3>Coding &amp; computer science</h3><span class="tag brand">4 Platforms</span></div>
<div class="grid">
<article class="card"><h3><span class="ic">{IC["code"]}</span>freeCodeCamp</h3><p>A full, free coding curriculum with interactive projects and certifications.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://www.freecodecamp.org" target="_blank" rel="noopener">freecodecamp.org</a></p></article>
<article class="card"><h3><span class="ic">{IC["cap"]}</span>CS50 (Harvard)</h3><p>The famous introduction to computer science &mdash; free, self-paced, beginner-friendly.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://cs50.harvard.edu" target="_blank" rel="noopener">cs50.harvard.edu</a></p></article>
<article class="card"><h3><span class="ic">{IC["layers"]}</span>The Odin Project</h3><p>A free, project-based path into full-stack web development.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://www.theodinproject.com" target="_blank" rel="noopener">theodinproject.com</a></p></article>
<article class="card"><h3><span class="ic">{IC["book"]}</span>MDN Web Docs</h3><p>The definitive reference for HTML, CSS and JavaScript, by Mozilla.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://developer.mozilla.org" target="_blank" rel="noopener">developer.mozilla.org</a></p></article>
</div>
</div>
<div class="category-block">
<div class="category-header"><h3>Data, AI &amp; maths</h3><span class="tag brand">3 Platforms</span></div>
<div class="grid">
<article class="card"><h3><span class="ic">{IC["trend"]}</span>Kaggle Learn</h3><p>Short, free micro-courses on Python, data science and machine learning.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://www.kaggle.com/learn" target="_blank" rel="noopener">kaggle.com/learn</a></p></article>
<article class="card"><h3><span class="ic">{IC["compass"]}</span>Khan Academy</h3><p>Free lessons in maths, statistics and science from basics to advanced.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://www.khanacademy.org" target="_blank" rel="noopener">khanacademy.org</a></p></article>
<article class="card"><h3><span class="ic">{IC["cap"]}</span>MIT OpenCourseWare</h3><p>Free course materials from real MIT classes, including AI and maths.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://ocw.mit.edu" target="_blank" rel="noopener">ocw.mit.edu</a></p></article>
</div>
</div>
<div class="category-block">
<div class="category-header"><h3>Design, marketing &amp; general learning</h3><span class="tag brand">4 Platforms</span></div>
<div class="grid">
<article class="card"><h3><span class="ic">{IC["pen"]}</span>Figma Learn</h3><p>Official, free lessons on UI/UX design in the industry-standard tool.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://help.figma.com" target="_blank" rel="noopener">Figma help</a></p></article>
<article class="card"><h3><span class="ic">{IC["globe"]}</span>Google Digital Garage</h3><p>Free courses on digital marketing, data and career skills from Google.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://grow.google" target="_blank" rel="noopener">grow.google</a></p></article>
<article class="card"><h3><span class="ic">{IC["book"]}</span>Coursera &amp; edX</h3><p>Audit thousands of university courses for free from top schools worldwide.</p><p style="margin-top:auto;padding-top:12px"><a href="https://www.coursera.org" target="_blank" rel="noopener">coursera.org &rarr;</a> &middot; <a href="https://www.edx.org" target="_blank" rel="noopener">edx.org &rarr;</a></p></article>
<article class="card"><h3><span class="ic">{IC["layers"]}</span>Canva Design School</h3><p>Free, beginner-friendly lessons on graphic design and visual content.</p><p style="margin-top:auto;padding-top:12px"><a class="link-arrow" href="https://www.canva.com/design-school" target="_blank" rel="noopener">canva.com/design-school</a></p></article>
</div>
</div>
<p class="small" style="margin-top:28px">We do not control these external sites. If a link breaks or a platform changes its free policy, let us know through the contact page.</p>'''

def guidance_page(slug,title,desc,eyebrow,img_key,img_alt,lead,checks,h2,para):
    chk="<ul class=\"check\">"+"".join(f"<li>{c}</li>" for c in checks)+"</ul>"
    return (page_hero(eyebrow,title,desc)
            +f'<section class="sec reveal"><div class="wrap">'
            +f'<div class="editorial-intro"><div class="feature"><div><h2>{h2}</h2><p class="lead">{lead}</p>{chk}</div></div>{img(img_key,img_alt)}</div>'
            +f'<div>{para}</div></div></section>')

def universities_page():
    para=('<p>Choosing a university is one of the biggest financial and time decisions you&rsquo;ll make as a student. A verified listing tool is on our roadmap; until then, here&rsquo;s a practical checklist you can use to evaluate any university yourself.</p>'
          '<h3>What to check before you apply</h3>'
          '<div class="grid">'
          f'<article class="card"><h3><span class="ic">{IC["check"]}</span>Recognition</h3><p>For Pakistan, confirm the university and your specific programme are recognised by the Higher Education Commission (HEC).</p></article>'
          f'<article class="card"><h3><span class="ic">{IC["dollar"]}</span>Total cost</h3><p>Look beyond tuition: admission fees, transport, hostel and living costs add up fast.</p></article>'
          f'<article class="card"><h3><span class="ic">{IC["calendar"]}</span>Deadlines &amp; tests</h3><p>Note the admission test (e.g. university entry tests), form deadline and merit formula.</p></article>'
          f'<article class="card"><h3><span class="ic">{IC["users"]}</span>Faculty &amp; facilities</h3><p>Check faculty qualifications, labs, library and industry links on the official site.</p></article>'
          '</div>'
          '<h3>Public vs private</h3>'
          '<p>Public universities usually have lower fees and strong merit competition; private universities may offer smaller classes, modern facilities and flexible intake, often at higher cost. Neither is automatically &ldquo;better&rdquo; &mdash; what matters is fit with your goals, budget and the recognition of the specific programme.</p>'
          '<div class="note"><strong>Always verify on the official site.</strong> Fees, eligibility and deadlines change every year. Confirm everything on the university&rsquo;s own website and the <a href="https://www.hec.gov.pk" target="_blank" rel="noopener">HEC website</a> before you decide.</div>'
          '<p><a class="btn" href="index.html">&larr; Back to home</a></p>')
    return guidance_page("universities","University Finder","How to evaluate and choose a university, with official links.","University Finder","campus","Modern university campus building","A practical checklist for choosing the right university",["Is the programme HEC-recognised?","Total cost, not just tuition","Admission test, deadline and merit"],"Find the right university",para)

def scholarships_page():
    para=('<p>Scholarships can cover part or all of your study costs, but competition is real and the honest ones are always free to apply for. A verified, dated listings tool is on our roadmap; until then, here&rsquo;s how to find and apply for scholarships the right way.</p>'
          '<h3>Types of scholarships to look for</h3>'
          '<div class="grid">'
          f'<article class="card"><h3><span class="ic">{IC["award"]}</span>Merit-based</h3><p>Awarded for strong academic results. Many universities offer automatic merit aid for top marks.</p></article>'
          f'<article class="card"><h3><span class="ic">{IC["users"]}</span>Need-based</h3><p>For students who can&rsquo;t afford full fees. You&rsquo;ll usually show family income documents.</p></article>'
          f'<article class="card"><h3><span class="ic">{IC["cap"]}</span>Government</h3><p>In Pakistan, the HEC runs and lists several scholarship and fee-support schemes.</p></article>'
          f'<article class="card"><h3><span class="ic">{IC["globe"]}</span>International</h3><p>Well-known programmes include Fulbright (USA), DAAD (Germany), Chevening (UK) and Commonwealth scholarships.</p></article>'
          '</div>'
          '<h3>How to apply</h3>'
          '<p>Keep a folder ready with your transcripts, CNIC or B-form, recent photos, recommendation letters and a short statement of purpose. Apply before the deadline on the official site, keep copies of everything, and track what you&rsquo;ve submitted. Treat each application seriously &mdash; quality beats quantity.</p>'
          '<div class="note"><strong>Scholarship scams are common.</strong> No real scholarship asks you to pay a &ldquo;processing fee&rdquo; to receive money, share your bank PIN, or cash a cheque and send money back. If it sounds too easy, it is almost certainly a scam.</div>'
          '<p><a class="btn" href="index.html">&larr; Back to home</a></p>')
    return guidance_page("scholarships","Scholarships","Types of scholarships to look for and how to apply honestly.","Funding","scholar","Student holding a scholarship award certificate","Scholarship types and an honest application guide",["Merit, need, government, international","Documents to keep ready","Scam red flags to avoid"],"Find and win scholarships",para)

def internships_page():
    para=('<p>An internship is your first real bridge between study and work. A verified listings tool is on our roadmap; until then, here&rsquo;s how to find one and make it count.</p>'
          '<h3>How to land an internship</h3>'
          '<div class="grid">'
          f'<article class="card"><h3><span class="ic">{IC["pen"]}</span>Prepare a CV</h3><p>One clean page: education, skills, any projects or volunteer work. No experience yet? Lead with projects.</p></article>'
          f'<article class="card"><h3><span class="ic">{IC["layers"]}</span>Build proof</h3><p>A GitHub, portfolio or social page showing real work beats any claim on a CV.</p></article>'
          f'<article class="card"><h3><span class="ic">{IC["search"]}</span>Where to look</h3><p>Company career pages, LinkedIn, university placement offices and trusted job boards.</p></article>'
          f'<article class="card"><h3><span class="ic">{IC["target"]}</span>Prepare for interviews</h3><p>Research the company, rehearse common questions, and have 2&ndash;3 questions ready to ask.</p></article>'
          '</div>'
          '<h3>What to expect</h3>'
          '<p>Most internships last 6&ndash;12 weeks and pay a small stipend (some are unpaid). You&rsquo;ll likely start with smaller tasks and earn more responsibility as you prove yourself. The real prize is experience, references and a clearer sense of what you want.</p>'
          '<div class="note"><strong>Watch out.</strong> Never pay for an internship, and be cautious of long unpaid &ldquo;internships&rdquo; that use you as free labour without teaching you anything. A good internship teaches you and respects your time.</div>'
          '<p><a class="btn" href="index.html">&larr; Back to home</a></p>')
    return guidance_page("internships","Internships","How to find and land an internship, and what to watch out for.","Experience","intern","Young intern working in a modern office","A practical guide to finding and landing an internship",["A clean one-page CV","Proof of real work","Where to look and how to prepare"],"Find and land an internship",para)

def contact_page():
    return (page_hero("Get in touch","Contact Us","Questions, feedback or a broken link to report? Send us a note.","Response Policy","We read every student note as we prepare our Phase 5 communication tools.")
            +'<section class="sec reveal"><div class="wrap contact-layout">'
            +'<div>'
            +'<h2>How can we help?</h2>'
            +'<p>Whether you spotted an outdated link, want to suggest a degree or skill roadmap, or have feedback on our tools, we appreciate hearing from students and educators.</p>'
            +'<div class="card" style="margin:20px 0"><h3><span class="ic">'+IC["link"]+'</span>Report a broken link</h3><p>Let us know which page and external resource changed so we can verify and update it.</p></div>'
            +'<div class="card" style="margin:20px 0"><h3><span class="ic">'+IC["compass"]+'</span>Suggest a degree or career</h3><p>Tell us which field you&rsquo;d like us to map next in our Degree Explorer or Skills Hub.</p></div>'
            +'<div class="note"><strong>This form isn&rsquo;t connected yet.</strong> It arrives with a later phase, so your message isn&rsquo;t sent or saved anywhere right now. We built it this way on purpose rather than pretending it works.</div>'
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
    return (page_hero(title,title,desc)
            +f'<section class="sec reveal"><div class="wrap"><div id="app" data-page="{slug}"></div></div></section>')

def stub(slug,title,ph,desc):
    if slug in LIVE: return live_page(slug,title,desc)
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
