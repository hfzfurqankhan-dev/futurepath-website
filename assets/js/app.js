const app=document.getElementById("app"),page=app&&app.dataset.page,L=a=>"<ul>"+a.map(x=>`<li>${x}</li>`).join("")+"</ul>";
const SUBJ=["Mathematics","Physics","Chemistry","Biology","Computer Science","Business/Commerce","Art and Design","English"],
INT=["Technology","Medical","Business","Engineering","Arts and Design","Psychology","Finance","Media"],
STR=["Creativity","Problem-solving","Communication","Analytical thinking","Leadership"],
WORK=["Working with computers","Helping people","Managing businesses","Creating designs","Research and experiments"],
ENV=["Remote","Office","Freelancing","Entrepreneurship"];
// Icon badges for dynamically-rendered cards (purely decorative).
const CAREER_IC={"Software Developer":"\u{1F4BB}","Data Analyst":"\u{1F4CA}","Doctor or Healthcare Professional":"\u{1FA7A}","Engineer":"\u{2699}\u{FE0F}","Business Manager or Entrepreneur":"\u{1F4C8}","Accountant or Financial Analyst":"\u{1F9EE}","Psychologist or Counsellor":"\u{1F9E0}","Designer (Graphic or UI/UX)":"\u{1F3A8}","Media Producer or Journalist":"\u{1F4F8}","Cybersecurity Analyst":"\u{1F6E1}\u{FE0F}"},
SKILL_IC={"Web Development":"\u{1F310}","Python Programming":"\u{1F40D}","Data Analysis":"\u{1F4CA}","Graphic Design":"\u{1F3A8}","UI/UX Design":"\u{1F58D}\u{FE0F}","Digital Marketing and SEO":"\u{1F4E3}","AI and Prompt Engineering":"\u{1F916}"},
EARN_IC={"Freelance Web Development":"\u{1F4BB}","Graphic Design Freelancing":"\u{1F3A8}","Content Writing":"\u{270D}\u{FE0F}","YouTube and Content Creation":"\u{1F4F9}"},
CAT_IC={"Computer Science":"\u{1F4BB}","Software Engineering":"\u{1F4BB}","Artificial Intelligence":"\u{1F916}","Cybersecurity":"\u{1F6E1}\u{FE0F}","Medical and Healthcare":"\u{1FA7A}","Engineering":"\u{2699}\u{FE0F}","Business Administration":"\u{1F4C8}","Accounting and Finance":"\u{1F9EE}","Psychology":"\u{1F9E0}","Media and Communication":"\u{1F4F8}"},
DETAIL_IC={"Required subjects":"\u{1F4DA}","What you will study":"\u{1F4D6}","Important skills":"\u{1F9E9}","Job roles":"\u{1F4CB}","Higher education":"\u{1F393}"},
pickIC=(map,n)=>{if(n)for(const k in map)if(n.indexOf(k)>=0)return map[k];return "\u2728"};
const dName=id=>(DEGREES.find(d=>d.id===id)||{}).name||id;
const fs=(k,t,a,type="checkbox")=>`<fieldset><legend>${t}</legend>${a.map(x=>`<label class="opt"><input type="${type}" name="${k}" value="${x}">${x}</label>`).join("")}</fieldset>`;
function finder(){
 app.innerHTML=`<div class="note">Recommendations are guidance, not a prediction of your perfect career. Scores only compare your answers with our sample career profiles.</div>
 <form id="q">${fs("lvl","1. Current education level",["Matric","Intermediate","Bachelor's","Master's"],"radio")}${fs("sub","2. Subjects you enjoy",SUBJ)}${fs("int","3. Your interests",INT)}${fs("str","4. Your strengths",STR)}${fs("work","5. Work you prefer",WORK)}${fs("env","6. Preferred work environment",ENV)}
 <label class="blk" for="goal"><strong>7. Your future goals</strong> (optional, shown with your results)</label><textarea id="goal" rows="3"></textarea>
 <p><button class="btn primary" type="submit">Show my results</button></p><p id="err" class="small" role="alert"></p></form><div id="res" tabindex="-1"></div>`;
 document.getElementById("q").onsubmit=e=>{e.preventDefault();
  const v=k=>[...document.querySelectorAll(`[name=${k}]:checked`)].map(x=>x.value),a={sub:v("sub"),int:v("int"),str:v("str"),work:v("work"),env:v("env")},
  W={int:3,str:2,work:2,sub:1,env:1},K={int:"i",str:"s",work:"w",sub:"sub",env:"e"},
  total=Object.keys(W).reduce((t,k)=>t+W[k]*a[k].length,0);
  if(!total){document.getElementById("err").textContent="Pick at least one option in questions 2 to 6.";return}
  document.getElementById("err").textContent="";
  const sc=CAREERS.map(c=>{let pts=0,why=[];for(const k in W){const m=a[k].filter(x=>c[K[k]].includes(x));pts+=W[k]*m.length;if(m.length)why.push(`${m.join(", ")} (${W[k]} pt${W[k]>1?"s":""} each)`)}return{c,pts,why}}).filter(x=>x.pts).sort((x,y)=>y.pts-x.pts).slice(0,3),
  g=document.getElementById("goal").value.trim(),r=document.getElementById("res");
  r.innerHTML=`<h2>Your top matches</h2>`+(g?`<p><strong>Your goal:</strong> ${g.replace(/[<>&]/g,"")}</p>`:"")+(sc.length?sc.map(({c,pts,why})=>`<article class="card res"><h3>${c.n}: ${Math.round(100*pts/total)}% match</h3><p class="small">${pts} of ${total} possible points. Interests count 3, strengths 2, work type 2, subjects 1, environment 1.</p><p><strong>Why it matches:</strong> ${why.join("; ")}</p><p><strong>Degrees:</strong> ${c.deg.map(d=>`<a href="degree-explorer.html#${d}">${dName(d)}</a>`).join(", ")}</p><p><strong>Skills:</strong> ${c.skills.join(", ")}</p><p><strong>Education:</strong> ${c.edu}</p><p><strong>Opportunities:</strong> ${c.opp}</p><p><strong>Earning routes:</strong> ${c.earn} (not guaranteed)</p><p><strong>Roadmap:</strong></p><ol>${c.road.map(x=>`<li>${x}</li>`).join("")}</ol></article>`).join(""):"<p>No matches yet. Try selecting more options.</p>");
  r.focus();r.scrollIntoView({behavior:"smooth"})}}
function degrees(){
 const cats=[...new Set(DEGREES.map(d=>d.cat))];
 app.innerHTML=`<div class="row"><input id="s" type="search" placeholder="Search degrees, subjects, jobs" aria-label="Search degrees"><select id="c" aria-label="Category"><option value="">All categories</option>${cats.map(c=>`<option>${c}</option>`).join("")}</select></div><p class="small">Sample guidance. Verify eligibility on each university's official site. More categories (law, social sciences, IT) are coming.</p><div id="out"></div>`;
 const out=document.getElementById("out"),s=document.getElementById("s"),c=document.getElementById("c");
 const detail=d=>`<p><a href="degree-explorer.html" id="back">Back to all degrees</a></p><h2>${d.name}</h2><p><strong>Duration:</strong> ${d.dur}</p><p><strong>Eligibility:</strong> ${d.elig}</p><div class="grid">${[["Required subjects",d.subj],["What you will study",d.study],["Important skills",d.skills],["Job roles",d.jobs],["Higher education",d.higher]].map(([t,a])=>`<article class="card"><h3><span class="ic">${DETAIL_IC[t]||"\u2728"}</span>${t}</h3>${L(a)}</article>`).join("")}</div><p><strong>Future:</strong> ${d.future}</p><p><strong>Universities:</strong> see the University Finder (verified data coming in Phase 4).</p><p><strong>Related:</strong> ${d.rel.map(r=>`<a href="#${r}">${dName(r)}</a>`).join(", ")}</p>`;
 const draw=()=>{const h=location.hash.slice(1),d=DEGREES.find(x=>x.id===h);
  if(d){out.innerHTML=detail(d);document.title=d.name+" | FuturePath";return}
  const q=s.value.toLowerCase(),f=DEGREES.filter(d=>(!c.value||d.cat===c.value)&&JSON.stringify(d).toLowerCase().includes(q));
  out.innerHTML=f.length?`<div class="grid">${f.map(d=>`<article class="card"><h3><span class="ic">${CAT_IC[d.cat]||"\u{1F393}"}</span><a href="#${d.id}">${d.name}</a></h3><p>${d.cat} &middot; ${d.dur}</p></article>`).join("")}</div>`:"<p>No degrees match. Clear the search or choose another category.</p>"};
 s.oninput=c.onchange=()=>{if(location.hash)history.replaceState(null,"",location.pathname);draw()};addEventListener("hashchange",draw);draw()}
function accordion(arr,rows,map){app.innerHTML=arr.map(x=>`<details class="card acc"><summary><h3><span class="ic">${map?pickIC(map,x.n):"\u2728"}</span>${x.n}</h3></summary>${rows.map(([k,t])=>`<p><strong>${t}:</strong> ${Array.isArray(x[k])?"":x[k]}</p>${Array.isArray(x[k])?`<ol>${x[k].map(i=>`<li>${i}</li>`).join("")}</ol>`:""}`).join("")}</details>`).join("")}
function careers(){app.innerHTML=`<div class="grid">${CAREERS.map(c=>`<article class="card"><h3><span class="ic">${CAREER_IC[c.n]||"\u2728"}</span>${c.n}</h3><p><strong>Skills:</strong> ${c.skills.join(", ")}</p><p><strong>Education:</strong> ${c.edu}</p><p><strong>Where:</strong> ${c.opp}</p></article>`).join("")}</div>`}
({"career-finder":finder,"degree-explorer":degrees,careers,
 skills:()=>accordion(SKILLS,[["what","What it is"],["why","Why learn it"],["start","To begin"],["road","Roadmap"],["tools","Tools"],["free","Free resources"],["proj","Practice projects"],["port","Portfolio"],["car","Careers"]],SKILL_IC),
 "online-earning":()=>{accordion(EARN,[["what","What it is"],["how","How it works"],["skills","Skills"],["time","Learning time"],["tools","Tools"],["port","Portfolio"],["clients","Finding clients"],["paid","Getting paid"],["hard","Challenges"]],EARN_IC);app.insertAdjacentHTML("afterbegin",`<div class="note"><strong>No guaranteed earnings.</strong> Beginners often earn nothing at first.<br><strong>Scam checklist:</strong> never pay to get a job; ignore "easy money" or "guaranteed income" offers; don't share your CNIC or bank PIN; don't cash cheques and send money back; keep communication and payment on trusted platforms.</div>`)}}[page]||(()=>{}))();
