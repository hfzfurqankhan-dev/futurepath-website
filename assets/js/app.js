const app = document.getElementById("app"),
  page = app && app.dataset.page,
  L = a => "<ul>" + a.map(x => `<li>${x}</li>`).join("") + "</ul>";

const SUBJ = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Business/Commerce", "Art and Design", "English"],
  INT = ["Technology", "Medical", "Business", "Engineering", "Arts and Design", "Psychology", "Finance", "Media"],
  STR = ["Creativity", "Problem-solving", "Communication", "Analytical thinking", "Leadership"],
  WORK = ["Working with computers", "Helping people", "Managing businesses", "Creating designs", "Research and experiments"],
  ENV = ["Remote", "Office", "Freelancing", "Entrepreneurship"];

// Safe localStorage helpers
const store = {
  get(k, fallback) {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set(k, val) {
    try {
      localStorage.setItem(k, JSON.stringify(val));
    } catch (e) {}
  },
  del(k) {
    try {
      localStorage.removeItem(k);
    } catch (e) {}
  }
};

// Crisp inline SVG icons for dynamic cards
const SVG = {
  code: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  medical: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  gear: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  briefcase: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  finance: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  mind: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/><line x1="9" y1="21" x2="15" y2="21"/></svg>`,
  design: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  media: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  book: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  cap: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  spark: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  pen: `<svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/></svg>`
};

const CAREER_IC = {
  "Software Developer": SVG.code,
  "Data Analyst": SVG.chart,
  "Doctor or Healthcare Professional": SVG.medical,
  "Pharmacist or Clinical Researcher": SVG.medical,
  "Engineer": SVG.gear,
  "Architect or Spatial Designer": SVG.design,
  "Business Manager or Entrepreneur": SVG.briefcase,
  "Accountant": SVG.finance,
  "Lawyer or Legal Counsel": SVG.book,
  "Economist or Policy & Research Analyst": SVG.chart,
  "Psychologist or Counsellor": SVG.mind,
  "Designer": SVG.design,
  "Media Producer": SVG.media,
  "Cybersecurity Analyst": SVG.shield
},
SKILL_IC = {
  "Web Development": SVG.code,
  "Python Programming": SVG.code,
  "Data Analysis": SVG.chart,
  "Mobile App Development": SVG.code,
  "Graphic Design": SVG.design,
  "UI/UX Design": SVG.pen,
  "Video Editing": SVG.media,
  "Communication and English Writing": SVG.book,
  "Digital Marketing and SEO": SVG.briefcase,
  "AI and Prompt Engineering": SVG.spark,
  "Spreadsheet Automation": SVG.chart
},
EARN_IC = {
  "Freelance Web Development": SVG.code,
  "Data Analysis": SVG.chart,
  "UI/UX": SVG.pen,
  "Graphic Design Freelancing": SVG.design,
  "Content Writing": SVG.book,
  "Online Tutoring": SVG.cap,
  "Digital Products": SVG.briefcase,
  "YouTube": SVG.media
},
CAT_IC = {
  "Computer Science & IT": SVG.code,
  "Computer Science": SVG.code,
  "Software Engineering": SVG.code,
  "Data Science & AI": SVG.chart,
  "Artificial Intelligence": SVG.spark,
  "Cybersecurity": SVG.shield,
  "Medical and Healthcare": SVG.medical,
  "Engineering": SVG.gear,
  "Architecture and Design": SVG.design,
  "Business & Management": SVG.briefcase,
  "Business Administration": SVG.briefcase,
  "Accounting and Finance": SVG.finance,
  "Law and Legal Studies": SVG.book,
  "Economics & Social Sciences": SVG.chart,
  "Psychology & Social Sciences": SVG.mind,
  "Psychology": SVG.mind,
  "Media and Communication": SVG.media
},
DETAIL_IC = {
  "Required subjects": SVG.book,
  "What you will study": SVG.book,
  "Important skills": SVG.spark,
  "Job roles": SVG.briefcase,
  "Higher education": SVG.cap
},
pickIC = (map, n) => {
  if (n) for (const k in map) if (n.indexOf(k) >= 0) return map[k];
  return SVG.spark;
};

const dName = id => (DEGREES.find(d => d.id === id) || {}).name || id;
const fs = (k, t, a, type = "checkbox") =>
  `<fieldset><legend>${t}</legend><div class="opt-group">${a
    .map(x => `<label class="opt"><input type="${type}" name="${k}" value="${x}">${x}</label>`)
    .join("")}</div></fieldset>`;

const LEVEL_ADVICE = {
  "Matric": "Choose your Intermediate/A-Level stream (Pre-Engineering, ICS, Pre-Medical, ICom, or Arts) so it aligns with the required subjects for this path, and explore one beginner skill during school breaks.",
  "Intermediate": "Shortlist HEC-recognized universities, check entry test requirements (MDCAT, ECAT, NAT, LAT, or university-specific tests), and build foundational projects before degree classes start.",
  "Bachelor's": "Focus on shipping 3–5 real portfolio projects, securing a summer internship, and connecting your coursework to practical tools used in the industry.",
  "Master's": "Target specialized roles, research fellowships, or leadership tracks, and leverage your advanced projects or thesis to stand out to employers."
};

/* ==========================================================================
   1. Upgraded Career Finder (Education-Level Aware + localStorage + Print)
   ========================================================================== */
function finder() {
  app.innerHTML = `<div class="note"><strong>Honest methodology:</strong> Recommendations are guidance, not a prediction of your perfect career. Scores transparently compare your answers with our 14 career profiles using fixed weights: <strong>Core Interests (3 pts)</strong>, <strong>Natural Strengths (2 pts)</strong>, <strong>Work Activities (2 pts)</strong>, <strong>Subjects Enjoyed (1 pt)</strong>, and <strong>Work Environment (1 pt)</strong>. Match % = (Your Matched Points &divide; Total Points of Selected Options) &times; 100. Your selections are saved automatically on this device.</div>
  <div class="finder-toolbar">
    <div class="finder-status" id="q-status" aria-live="polite">Select options in steps 2 to 6 below to calculate your career match score.</div>
    <button type="button" class="btn sm" id="q-reset">Clear selections</button>
  </div>
  <form id="q">${fs("lvl", "1. Current education level", ["Matric", "Intermediate", "Bachelor's", "Master's"], "radio")}${fs("sub", "2. Subjects you enjoy (1 pt each)", SUBJ)}${fs("int", "3. Your core interests (3 pts each)", INT)}${fs("str", "4. Your natural strengths (2 pts each)", STR)}${fs("work", "5. Work activities you prefer (2 pts each)", WORK)}${fs("env", "6. Preferred work environment (1 pt each)", ENV)}
  <fieldset><legend>7. Your future goals (optional)</legend>
  <label class="blk" for="goal" style="font-weight:400;color:var(--mute)">Write a brief note on what matters most to you (shown alongside your results)</label>
  <textarea id="goal" rows="3" placeholder="e.g., I want to build practical software skills and work remotely within two years..."></textarea></fieldset>
  <div class="row"><button class="btn primary" type="submit">Show my results</button></div>
  <p id="err" class="small" role="alert" style="margin-top:10px;color:#B45309;font-weight:600"></p></form><div id="res" tabindex="-1"></div>`;

  const form = document.getElementById("q"),
    statusEl = document.getElementById("q-status"),
    resetBtn = document.getElementById("q-reset"),
    resEl = document.getElementById("res"),
    errEl = document.getElementById("err");

  const v = k => [...form.querySelectorAll(`[name=${k}]:checked`)].map(x => x.value);

  const updateStatus = () => {
    const count = form.querySelectorAll('input[type="checkbox"]:checked').length;
    const lvl = (form.querySelector('[name="lvl"]:checked') || {}).value;
    statusEl.innerHTML = count
      ? `<strong>${count} criteria selected</strong>${lvl ? ` (${lvl} level)` : ""} across your subjects, interests, strengths, and work preferences.`
      : "Select options in steps 2 to 6 below to calculate your career match score.";
  };

  const saveState = submitted => {
    store.set("fp_finder_state", {
      lvl: (form.querySelector('[name="lvl"]:checked') || {}).value || "",
      sub: v("sub"),
      int: v("int"),
      str: v("str"),
      work: v("work"),
      env: v("env"),
      goal: document.getElementById("goal").value,
      submitted: !!submitted
    });
  };

  const computeAndRender = (scrollToRes = true) => {
    const lvl = (form.querySelector('[name="lvl"]:checked') || {}).value || "",
      a = { sub: v("sub"), int: v("int"), str: v("str"), work: v("work"), env: v("env") },
      W = { int: 3, str: 2, work: 2, sub: 1, env: 1 },
      K = { int: "i", str: "s", work: "w", sub: "sub", env: "e" },
      total = Object.keys(W).reduce((t, k) => t + W[k] * a[k].length, 0);

    if (!total) {
      errEl.textContent = "Pick at least one option in questions 2 to 6.";
      return false;
    }
    errEl.textContent = "";

    const sc = CAREERS.map(c => {
        let pts = 0,
          why = [];
        for (const k in W) {
          const m = a[k].filter(x => c[K[k]].includes(x));
          pts += W[k] * m.length;
          if (m.length) why.push(`${m.join(", ")} (${W[k]} pt${W[k] > 1 ? "s" : ""} each)`);
        }
        return { c, pts, why };
      })
        .filter(x => x.pts)
        .sort((x, y) => y.pts - x.pts)
        .slice(0, 3),
      g = document.getElementById("goal").value.trim(),
      lvlAdvice = LEVEL_ADVICE[lvl] || "Compare the related degrees below and start step 1 of the skill roadmap this week.";

    resEl.innerHTML =
      `<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:14px">
        <h2 style="margin:0">Your top career matches</h2>
        ${sc.length ? `<button type="button" class="btn sm" id="print-plan">Print / Save as PDF</button>` : ""}
      </div>` +
      (lvl ? `<p class="small"><strong>Education level selected:</strong> ${lvl} &mdash; tailored stage advice included below.</p>` : "") +
      (g ? `<p><strong>Your goal:</strong> ${g.replace(/[<>&]/g, "")}</p>` : "") +
      (sc.length
        ? sc
            .map(
              ({ c, pts, why }, idx) =>
                `<article class="card res">
                  <h3>
                    <span>#${idx + 1} ${c.n}</span>
                    <span class="match-badge">${Math.round((100 * pts) / total)}% match</span>
                  </h3>
                  <p class="small">${pts} of ${total} possible points. Interests count 3, strengths 2, work type 2, subjects 1, environment 1.</p>
                  <p><strong>Why it matches:</strong> ${why.join("; ")}</p>
                  ${c.daily ? `<p><strong>Daily responsibilities:</strong> ${c.daily}</p>` : ""}
                  <div class="res-meta-grid">
                    <div class="res-meta-item"><strong>Related Degrees</strong>${c.deg
                      .map(d => `<a href="degree-explorer.html#${d}">${dName(d)}</a>`)
                      .join(", ")}</div>
                    <div class="res-meta-item"><strong>Key Skills</strong>${c.skills.map(s => `<span class="tag">${s}</span>`).join(" ")}</div>
                    <div class="res-meta-item"><strong>Education Path</strong>${c.edu}</div>
                    <div class="res-meta-item"><strong>Opportunities</strong>${c.opp}</div>
                    <div class="res-meta-item"><strong>Earning Routes</strong>${c.earn}</div>
                    ${c.prog ? `<div class="res-meta-item"><strong>Estimated Progression</strong>${c.prog}</div>` : ""}
                  </div>
                  <div class="acc-field" style="margin:10px 0;border-left:3px solid var(--teal)">
                    <p><strong>Next step for ${lvl || "your current stage"}:</strong> ${lvlAdvice}</p>
                  </div>
                  <p style="margin-top:8px"><strong>Recommended starting roadmap:</strong></p>
                  <ol>${c.road.map(x => `<li>${x}</li>`).join("")}</ol>
                </article>`
            )
            .join("")
        : "<p>No matches yet. Try selecting more options.</p>");

    const printBtn = document.getElementById("print-plan");
    if (printBtn) printBtn.onclick = () => window.print();

    if (scrollToRes) {
      resEl.focus();
      resEl.scrollIntoView({ behavior: "smooth" });
    }
    return true;
  };

  // Restore saved state if present
  const saved = store.get("fp_finder_state", null);
  if (saved) {
    if (saved.lvl) {
      const r = form.querySelector(`[name="lvl"][value="${saved.lvl}"]`);
      if (r) r.checked = true;
    }
    ["sub", "int", "str", "work", "env"].forEach(k => {
      (saved[k] || []).forEach(val => {
        const cb = form.querySelector(`[name="${k}"][value="${val}"]`);
        if (cb) cb.checked = true;
      });
    });
    if (saved.goal) document.getElementById("goal").value = saved.goal;
    updateStatus();
    if (saved.submitted) computeAndRender(false);
  }

  form.addEventListener("change", () => {
    updateStatus();
    saveState(false);
  });

  document.getElementById("goal").addEventListener("input", () => saveState(false));

  resetBtn.addEventListener("click", () => {
    form.reset();
    store.del("fp_finder_state");
    statusEl.textContent = "Select options in steps 2 to 6 below to calculate your career match score.";
    errEl.textContent = "";
    resEl.innerHTML = "";
  });

  form.onsubmit = e => {
    e.preventDefault();
    if (computeAndRender(true)) saveState(true);
  };
}

/* ==========================================================================
   2. Degree Explorer with Side-by-Side Comparison (Up to 3 Degrees)
   ========================================================================== */
function degrees() {
  const cats = [...new Set(DEGREES.map(d => d.cat))];
  let cmpIds = store.get("fp_degree_cmp", []).filter(id => DEGREES.some(d => d.id === id));

  app.innerHTML = `<div class="finder-toolbar">
    <div class="row" style="flex:1"><input id="s" type="search" placeholder="Search degrees, councils (PMDC, PEC, PCP, NCEAC), entry tests (MDCAT, ECAT, LAT), or roles..." aria-label="Search degrees">
    <select id="c" aria-label="Category"><option value="">All categories (${DEGREES.length})</option>${cats.map(c => `<option>${c}</option>`).join("")}</select></div>
  </div>
  <p class="small" id="deg-count" aria-live="polite">Structured Pakistani degree blueprints (Verified: Nov 2026). Select up to 3 degrees using "+ Compare" to compare accreditation, eligibility, entry tests, and career paths side by side.</p>
  <div id="cmp-panel"></div>
  <div id="out"></div>`;

  const out = document.getElementById("out"),
    cmpPanel = document.getElementById("cmp-panel"),
    countEl = document.getElementById("deg-count"),
    s = document.getElementById("s"),
    c = document.getElementById("c");

  const renderCmpPanel = () => {
    if (!cmpIds.length || location.hash.slice(1)) {
      cmpPanel.innerHTML = "";
      return;
    }
    const items = cmpIds.map(id => DEGREES.find(d => d.id === id)).filter(Boolean);
    cmpPanel.innerHTML = `<div class="cmp-tray">
      <div class="cmp-tray-head">
        <div>
          <strong>Comparing ${items.length} of 3 degrees:</strong>
          ${items.map(d => `<span class="tag brand">${d.name}</span>`).join(" ")}
        </div>
        <button type="button" class="btn sm" id="cmp-clear">Clear comparison</button>
      </div>
      ${
        items.length < 2
          ? `<p class="small" style="margin:0">Select at least one more degree card below to view the side-by-side comparison table.</p>`
          : `<div class="cmp-table-wrap">
              <table class="info-table" style="margin:0">
                <thead>
                  <tr>
                    <th>Criteria</th>
                    ${items.map(d => `<th><a href="#${d.id}">${d.name}</a></th>`).join("")}
                  </tr>
                </thead>
                <tbody>
                  <tr><td><strong>Category</strong></td>${items.map(d => `<td>${d.cat}</td>`).join("")}</tr>
                  <tr><td><strong>Duration</strong></td>${items.map(d => `<td>${d.dur}</td>`).join("")}</tr>
                  <tr><td><strong>Accreditation / Council</strong></td>${items.map(d => `<td>${d.accred || "HEC"}${d.src ? ` <a href="${d.src}" target="_blank" rel="noopener" class="small">[Source &nearr;]</a>` : ""}</td>`).join("")}</tr>
                  <tr><td><strong>Eligibility</strong></td>${items.map(d => `<td>${d.elig}</td>`).join("")}</tr>
                  <tr><td><strong>Entry Test Requirement</strong></td>${items.map(d => `<td>${d.test || "Check university admissions portal"}</td>`).join("")}</tr>
                  <tr><td><strong>Required Subjects</strong></td>${items.map(d => `<td>${d.subj.join(", ")}</td>`).join("")}</tr>
                  <tr><td><strong>Core Study Areas</strong></td>${items.map(d => `<td>${d.study.join(", ")}</td>`).join("")}</tr>
                  <tr><td><strong>Key Skills</strong></td>${items.map(d => `<td>${d.skills.join(", ")}</td>`).join("")}</tr>
                  <tr><td><strong>Job Roles</strong></td>${items.map(d => `<td>${d.jobs.join(", ")}</td>`).join("")}</tr>
                  <tr><td><strong>Higher Study</strong></td>${items.map(d => `<td>${d.higher.join(", ")}</td>`).join("")}</tr>
                  <tr><td><strong>Future Outlook</strong></td>${items.map(d => `<td>${d.future}</td>`).join("")}</tr>
                </tbody>
              </table>
            </div>`
      }
    </div>`;

    const clearBtn = document.getElementById("cmp-clear");
    if (clearBtn) {
      clearBtn.onclick = () => {
        cmpIds = [];
        store.set("fp_degree_cmp", cmpIds);
        draw();
      };
    }
  };

  const detail = d =>
    `<div style="margin-bottom:20px"><a href="degree-explorer.html" id="back" class="btn sm">&larr; Back to all degrees</a></div>
    <div class="card" style="margin-bottom:24px;border-top:4px solid var(--brand)">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:12px">
        <div>
          <span class="tag brand">${d.cat}</span>
          <span class="tag teal">${d.dur}</span>
          <span class="tag">Verified: Nov 2026</span>
          <h2 style="margin:8px 0 4px">${d.name}</h2>
        </div>
      </div>
      ${d.accred ? `<p><strong>Accreditation &amp; Regulatory Council:</strong> ${d.accred} ${d.src ? `&mdash; <a href="${d.src}" target="_blank" rel="noopener">Official Council Portal &nearr;</a>` : ""}</p>` : ""}
      <p><strong>Eligibility:</strong> ${d.elig}</p>
      ${d.test ? `<p><strong>Entry test requirement:</strong> ${d.test}</p>` : ""}
      <p style="margin:0"><strong>Future outlook:</strong> ${d.future}</p>
    </div>
    <div class="grid">${[
      ["Required subjects", d.subj],
      ["What you will study", d.study],
      ["Important skills", d.skills],
      ["Job roles", d.jobs],
      ["Higher education", d.higher]
    ]
      .map(
        ([t, a]) =>
          `<article class="card"><h3><span class="ic">${DETAIL_IC[t] || SVG.spark}</span>${t}</h3>${L(a)}</article>`
      )
      .join("")}</div>
    <div class="card" style="margin-top:20px;background:var(--bg)">
      <p><strong>Universities &amp; Regulatory Bodies:</strong> See our <a href="universities.html">University Finder &amp; Evaluation Checklist</a> for verifying HEC/council accreditation, fee structures, and admission test dates.</p>
      <p style="margin:0"><strong>Related degrees:</strong> ${d.rel
        .map(r => `<a href="#${r}" class="tag brand" style="text-decoration:none">${dName(r)} &rarr;</a>`)
        .join(" ")}</p>
    </div>`;

  const draw = () => {
    const h = location.hash.slice(1),
      d = DEGREES.find(x => x.id === h);
    renderCmpPanel();
    if (d) {
      out.innerHTML = detail(d);
      document.title = d.name + " | FuturePath";
      return;
    }
    const q = s.value.toLowerCase(),
      f = DEGREES.filter(
        d => (!c.value || d.cat === c.value) && JSON.stringify(d).toLowerCase().includes(q)
      );
    countEl.textContent = `Showing ${f.length} of ${DEGREES.length} degrees (Verified: Nov 2026). Select "+ Compare" on up to 3 cards to compare side by side.`;
    out.innerHTML = f.length
      ? `<div class="grid">${f
          .map(d => {
            const active = cmpIds.includes(d.id);
            return `<article class="card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:8px">
                  <span class="tag brand">${d.cat}</span>
                  <span class="small" style="font-weight:600">${d.dur}</span>
                </div>
                <h3><span class="ic">${CAT_IC[d.cat] || SVG.cap}</span><a href="#${d.id}" style="text-decoration:none;color:inherit">${d.name}</a></h3>
                <p style="margin-bottom:8px">${d.future}</p>
                ${d.accred ? `<p class="small" style="margin-bottom:6px"><strong>Council:</strong> ${d.accred}</p>` : ""}
                ${d.test ? `<p class="small" style="margin-bottom:8px"><strong>Entry test:</strong> ${d.test}</p>` : ""}
                <p class="small" style="margin-top:auto"><strong>Top roles:</strong> ${d.jobs.slice(0, 3).join(", ")}</p>
                <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
                  <a href="#${d.id}" class="link-arrow">Explore degree details</a>
                  <button type="button" class="cmp-btn" data-id="${d.id}" aria-pressed="${active ? "true" : "false"}">${
              active ? "✓ Comparing" : "+ Compare"
            }</button>
                </div>
              </article>`;
          })
          .join("")}</div>`
      : "<p>No degrees match. Clear the search or choose another category.</p>";

    out.querySelectorAll(".cmp-btn").forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        if (cmpIds.includes(id)) {
          cmpIds = cmpIds.filter(x => x !== id);
        } else {
          if (cmpIds.length >= 3) cmpIds.shift();
          cmpIds.push(id);
        }
        store.set("fp_degree_cmp", cmpIds);
        draw();
      };
    });
  };

  s.oninput = c.onchange = () => {
    if (location.hash) history.replaceState(null, "", location.pathname);
    draw();
  };
  addEventListener("hashchange", draw);
  draw();
}

/* ==========================================================================
   3. Skills Roadmap Tracker & Accordion Helper (with Clickable Free Resources)
   ========================================================================== */
function accordion(arr, rows, map, isSkills = false) {
  let skillProg = isSkills ? store.get("fp_skill_progress", {}) : {};

  const getSkillStats = x => {
    const total = (x.road || []).length;
    const done = (skillProg[x.n] || []).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { done, total, pct };
  };

  const renderAll = () => {
    let totalSteps = 0,
      doneSteps = 0;
    if (isSkills) {
      arr.forEach(x => {
        const st = getSkillStats(x);
        totalSteps += st.total;
        doneSteps += st.done;
      });
    }

    const controls = `<div class="acc-controls">
      <span class="small" id="skill-overall" aria-live="polite">${
        isSkills
          ? `<strong>Roadmap Tracker:</strong> ${doneSteps} of ${totalSteps} total milestones completed (${
              totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0
            }%) across ${arr.length} core skills. Check off steps inside each skill as you learn.`
          : "Click any topic below to view the complete step-by-step roadmap, tools, and portfolio guide."
      }</span>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${isSkills ? `<button type="button" class="btn sm" id="skill-reset">Reset progress</button>` : ""}
        <button type="button" class="btn sm" id="exp-all">Expand all</button>
        <button type="button" class="btn sm" id="col-all">Collapse all</button>
      </div>
    </div>`;

    // Preserve currently open accordions on re-render
    const openStates = [...app.querySelectorAll("details.acc")].map(d => d.open);

    app.innerHTML =
      controls +
      arr
        .map((x, idx) => {
          const isOpen = openStates.length ? openStates[idx] : idx === 0;
          const st = isSkills ? getSkillStats(x) : null;
          return `<details class="card acc"${isOpen ? " open" : ""}>
            <summary>
              <h3><span class="ic">${map ? pickIC(map, x.n) : SVG.spark}</span>${x.n}</h3>
              <div class="acc-summary-right">
                ${
                  isSkills
                    ? `<div class="prog-wrap" title="${st.done} of ${st.total} steps completed">
                        <span class="tag ${st.done === st.total ? "teal" : "brand"}">${st.done}/${st.total} steps</span>
                        <div class="prog-bar"><div class="prog-fill" style="width:${st.pct}%"></div></div>
                      </div>`
                    : `<span class="tag">${x.time || x.car || "Roadmap"}</span>`
                }
                <span class="acc-chevron" aria-hidden="true">&#9662;</span>
              </div>
            </summary>
            <div class="acc-body">
              ${rows
                .map(([k, t]) => {
                  if (isSkills && k === "road" && Array.isArray(x[k])) {
                    const checkedList = skillProg[x.n] || [];
                    return `<div class="acc-field" style="grid-column:1 / -1">
                      <p><strong>${t} (Beginner-to-Advanced Interactive Checklist &mdash; click to mark complete):</strong></p>
                      <div class="check-list-interactive">
                        ${x[k]
                          .map((stepText, sIdx) => {
                            const isChecked = checkedList.includes(sIdx);
                            return `<label class="check-item">
                              <input type="checkbox" class="road-cb" data-skill="${x.n}" data-idx="${sIdx}"${
                              isChecked ? " checked" : ""
                            }>
                              <span><strong>Step ${sIdx + 1}:</strong> ${stepText}</span>
                            </label>`;
                          })
                          .join("")}
                      </div>
                    </div>`;
                  }
                  if (isSkills && k === "free" && Array.isArray(x.freeLinks) && x.freeLinks.length) {
                    return `<div class="acc-field">
                      <p><strong>${t} (Verified Official Links &middot; Nov 2026):</strong></p>
                      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:6px">
                        ${x.freeLinks
                          .map(
                            ([label, url]) =>
                              `<a href="${url}" target="_blank" rel="noopener" class="tag brand" style="text-decoration:none">${label} &nearr;</a>`
                          )
                          .join("")}
                      </div>
                    </div>`;
                  }
                  return `<div class="acc-field"><p><strong>${t}:</strong> ${
                    Array.isArray(x[k]) ? "" : x[k]
                  }</p>${
                    Array.isArray(x[k]) ? `<ol>${x[k].map(i => `<li>${i}</li>`).join("")}</ol>` : ""
                  }</div>`;
                })
                .join("")}
            </div>
          </details>`;
        })
        .join("");

    const expBtn = document.getElementById("exp-all"),
      colBtn = document.getElementById("col-all"),
      rstBtn = document.getElementById("skill-reset");
    if (expBtn && colBtn) {
      expBtn.onclick = () => app.querySelectorAll("details.acc").forEach(d => (d.open = true));
      colBtn.onclick = () => app.querySelectorAll("details.acc").forEach(d => (d.open = false));
    }
    if (rstBtn) {
      rstBtn.onclick = () => {
        skillProg = {};
        store.del("fp_skill_progress");
        renderAll();
      };
    }
    if (isSkills) {
      app.querySelectorAll(".road-cb").forEach(cb => {
        cb.onchange = () => {
          const sk = cb.dataset.skill,
            i = parseInt(cb.dataset.idx, 10);
          const list = new Set(skillProg[sk] || []);
          if (cb.checked) list.add(i);
          else list.delete(i);
          skillProg[sk] = [...list];
          store.set("fp_skill_progress", skillProg);
          renderAll();
        };
      });
    }
  };

  renderAll();
}

/* ==========================================================================
   4. Online Earning Hub + Interactive Scam Red-Flag Checker
   ========================================================================== */
function onlineEarning() {
  app.innerHTML = `<div class="note"><strong>No guaranteed earnings &mdash; all timelines are estimates.</strong> Beginners often earn nothing during their first several months while building skills and portfolio proof.<br><strong>Scam checklist:</strong> never pay to get a job; ignore "easy money" or "guaranteed daily income" offers; don't share your CNIC or bank PIN; don't cash cheques and send money back; keep communication and payment on trusted platforms.</div>
  <div class="tool-box" id="scam-checker">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <span class="eyebrow">Interactive Safety Tool</span>
        <h3 style="margin-bottom:4px">Is This Online Opportunity Legit? &mdash; Scam Red-Flag Checker</h3>
        <p class="small" style="margin:0">Check any warning signs that apply to a freelance offer, WhatsApp/Telegram message, or remote job post.</p>
      </div>
      <button type="button" class="btn sm" id="scam-reset">Reset checker</button>
    </div>
    <div class="check-list-interactive" id="scam-flags">
      <label class="check-item"><input type="checkbox" value="critical"><span>They ask you to pay a registration, training, ID card, or "security deposit" fee before starting.</span></label>
      <label class="check-item"><input type="checkbox" value="critical"><span>They promise guaranteed daily or weekly earnings for simple tasks (liking videos, clicking ads, typing captchas).</span></label>
      <label class="check-item"><input type="checkbox" value="critical"><span>They ask for your bank PIN, OTP code, personal account password, or front/back CNIC photos on WhatsApp/Telegram.</span></label>
      <label class="check-item"><input type="checkbox" value="critical"><span>They ask you to receive money or a cheque in your account and forward part of it to someone else.</span></label>
      <label class="check-item"><input type="checkbox" value="warn"><span>They insist on moving off a trusted marketplace (like Upwork or Fiverr) before a contract or payment milestone exists.</span></label>
      <label class="check-item"><input type="checkbox" value="warn"><span>There is no clear written scope of work, verifiable client profile, or official company website.</span></label>
    </div>
    <div id="scam-verdict" class="verdict-box safe" aria-live="polite">
      <strong>0 red flags selected:</strong> No immediate scam flags checked. Still confirm written scope, never work for free "test projects" that look like real client work, and use trusted payment platforms.
    </div>
  </div>
  <div id="earn-accordions"></div>`;

  const flagsWrap = document.getElementById("scam-flags"),
    verdictEl = document.getElementById("scam-verdict"),
    resetBtn = document.getElementById("scam-reset");

  const updateVerdict = () => {
    const checked = [...flagsWrap.querySelectorAll("input:checked")];
    const hasCritical = checked.some(c => c.value === "critical");
    if (!checked.length) {
      verdictEl.className = "verdict-box safe";
      verdictEl.innerHTML =
        "<strong>0 red flags selected:</strong> No immediate scam flags checked. Still confirm written scope, never work for free \"test projects\" that look like real client work, and use trusted payment platforms.";
    } else if (hasCritical || checked.length >= 2) {
      verdictEl.className = "verdict-box danger";
      verdictEl.innerHTML = `<strong>High Scam Risk (${checked.length} red flag${
        checked.length > 1 ? "s" : ""
      } detected):</strong> Do not pay any money, do not share personal documents, and walk away immediately. Legitimate clients pay you for real skills &mdash; they never charge fees or ask for OTPs/PINs.`;
    } else {
      verdictEl.className = "verdict-box warn";
      verdictEl.innerHTML =
        "<strong>Caution (1 warning sign detected):</strong> Proceed carefully. Insist on keeping communication, contracts, and escrow payments on a trusted platform before delivering work.";
    }
  };

  flagsWrap.addEventListener("change", updateVerdict);
  resetBtn.onclick = () => {
    flagsWrap.querySelectorAll("input").forEach(i => (i.checked = false));
    updateVerdict();
  };

  // Mount accordions into #earn-accordions
  const accMount = document.getElementById("earn-accordions");
  const renderEarnAcc = () => {
    const controls = `<div class="acc-controls">
      <span class="small">Click any of the ${EARN.length} skill-based earning pathways below to inspect required skills, tools, portfolio projects, client strategies, and realistic beginner estimates.</span>
      <div style="display:flex;gap:8px">
        <button type="button" class="btn sm" id="exp-all">Expand all</button>
        <button type="button" class="btn sm" id="col-all">Collapse all</button>
      </div>
    </div>`;
    const rows = [
      ["what", "What it is"],
      ["how", "How it works"],
      ["skills", "Required skills"],
      ["time", "Estimated learning timeline"],
      ["tools", "Core tools"],
      ["port", "Starter portfolio projects"],
      ["clients", "How to find clients"],
      ["paid", "Getting paid safely"],
      ["expect", "Realistic beginner expectations"],
      ["hard", "Common challenges"]
    ];
    accMount.innerHTML =
      controls +
      EARN.map(
        (x, idx) =>
          `<details class="card acc"${idx === 0 ? " open" : ""}>
            <summary>
              <h3><span class="ic">${pickIC(EARN_IC, x.n)}</span>${x.n}</h3>
              <div class="acc-summary-right">
                <span class="tag">Estimated Timeline</span>
                <span class="acc-chevron" aria-hidden="true">&#9662;</span>
              </div>
            </summary>
            <div class="acc-body">
              ${rows
                .filter(([k]) => x[k])
                .map(([k, t]) => `<div class="acc-field"><p><strong>${t}:</strong> ${x[k]}</p></div>`)
                .join("")}
            </div>
          </details>`
      ).join("");

    document.getElementById("exp-all").onclick = () =>
      accMount.querySelectorAll("details.acc").forEach(d => (d.open = true));
    document.getElementById("col-all").onclick = () =>
      accMount.querySelectorAll("details.acc").forEach(d => (d.open = false));
  };
  renderEarnAcc();
}

/* ==========================================================================
   5. Career Opportunities (Filter Chips + Search + Expanded Roadmaps)
   ========================================================================== */
function careers() {
  const envs = ["All", "Remote", "Office", "Freelancing", "Entrepreneurship"];
  let activeEnv = "All";
  app.innerHTML = `<div class="note"><strong>Illustrative Career &amp; Progression Estimates:</strong> Career timelines (e.g. 0&ndash;2 yrs, 2&ndash;5 yrs, 5+ yrs) and earning routes shown below are illustrative industry estimates, never a guarantee. Actual progression depends on individual skill, employer, and economic conditions.</div>
  <div class="finder-toolbar">
    <input id="car-search" type="search" placeholder="Search careers, daily work, skills, or workplaces..." aria-label="Search careers">
  </div>
  <div class="filter-chips" role="group" aria-label="Filter careers by work style">
    ${envs
      .map(
        (e, i) =>
          `<button type="button" class="chip${i === 0 ? " active" : ""}" data-env="${e}" aria-pressed="${
            i === 0 ? "true" : "false"
          }">${e === "All" ? `All Career Paths (${CAREERS.length})` : e}</button>`
      )
      .join("")}
  </div>
  <div class="grid" id="career-grid"></div>`;

  const grid = document.getElementById("career-grid"),
    searchIn = document.getElementById("car-search");

  const renderCareers = () => {
    const q = searchIn.value.toLowerCase();
    const list = CAREERS.filter(
      c =>
        (activeEnv === "All" || (c.e && c.e.includes(activeEnv))) &&
        JSON.stringify(c).toLowerCase().includes(q)
    );
    grid.innerHTML = list.length
      ? list
          .map(
            c =>
              `<article class="card">
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
                  ${c.e.map(env => `<span class="tag">${env}</span>`).join("")}
                </div>
                <h3><span class="ic">${pickIC(CAREER_IC, c.n)}</span>${c.n}</h3>
                ${c.daily ? `<p><strong>Daily responsibilities:</strong> ${c.daily}</p>` : ""}
                <p><strong>Required education:</strong> ${c.edu}</p>
                <p><strong>Core skills:</strong> ${c.skills.join(", ")}</p>
                <p><strong>Job opportunities:</strong> ${c.opp}</p>
                <p><strong>Earning routes:</strong> ${c.earn}</p>
                ${c.prog ? `<p><strong>Career progression:</strong> ${c.prog}</p>` : ""}
                ${
                  c.road && c.road.length
                    ? `<div style="margin:10px 0;padding:10px 12px;background:var(--bg);border-radius:var(--r);border:1px solid var(--line)">
                        <p class="small" style="font-weight:700;color:var(--ink);margin-bottom:6px">Beginner 4-Step Roadmap:</p>
                        <ol class="small" style="margin:0;padding-left:18px">${c.road.map(r => `<li>${r}</li>`).join("")}</ol>
                      </div>`
                    : ""
                }
                <p class="small" style="margin-top:auto;padding-top:8px"><strong>Related degrees:</strong> ${c.deg
                  .map(d => `<a href="degree-explorer.html#${d}">${dName(d)}</a>`)
                  .join(", ")}</p>
              </article>`
          )
          .join("")
      : "<p>No careers match your filter. Try clearing the search box.</p>";
  };

  renderCareers();
  searchIn.oninput = renderCareers;
  app.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      app.querySelectorAll(".chip").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      activeEnv = btn.dataset.env;
      renderCareers();
    });
  });
}

/* ==========================================================================
   6. University Finder Filters & Evaluation Checklist (18 Pakistani Universities)
   ========================================================================== */
const UNIS = [
  { n: "NUST (National University of Sciences & Technology)", city: "Islamabad", sec: "Public", accred: "HEC, PEC, NCEAC, PCATP, NBEAC", fields: "Engineering, CS, AI, Data Science, Business, Architecture (SADA), Natural Sciences", test: "NUST NET / SAT / ACT", verified: "Verified: Nov 2026", url: "https://nust.edu.pk" },
  { n: "FAST-NUCES (National University of Computer & Emerging Sciences)", city: "Islamabad / Lahore / Karachi / Peshawar / Chiniot-Faisalabad", sec: "Private", accred: "HEC, NCEAC, PEC", fields: "Computer Science, Software Engineering, AI, Data Science, Cybersecurity, Electrical Engineering, BBA", test: "FAST NU Test / NTS NAT / SAT (Pre-Medical computing applicants require board Additional Math)", verified: "Verified: Nov 2026", url: "https://nu.edu.pk" },
  { n: "COMSATS University Islamabad (CUI)", city: "Islamabad / Lahore / Wah / Abbottabad / Sahiwal / Vehari / Attock", sec: "Public", accred: "HEC, PEC, NCEAC, PCATP", fields: "CS, Software Engineering, AI, Electrical Engineering, Biosciences, Architecture, Business", test: "NTS NAT (CUI Test)", verified: "Verified: Nov 2026", url: "https://www.comsats.edu.pk" },
  { n: "Quaid-i-Azam University (QAU)", city: "Islamabad", sec: "Public", accred: "HEC, PCP, PBC", fields: "Natural Sciences, Pharmacy (Pharm-D — min. 60% FSc), Computer Science, Economics, Law (5-Yr LLB), Social Sciences", test: "HSSC + SSC Merit Formula & Mandatory HEC LAT (min. 50% for LLB; check ugadmissions.qau.edu.pk for USAT updates)", verified: "Verified: Nov 2026", url: "https://qau.edu.pk" },
  { n: "PIEAS (Pakistan Institute of Engineering & Applied Sciences)", city: "Islamabad", sec: "Public", accred: "HEC, PEC, NCEAC", fields: "Electrical, Mechanical, Chemical & Metallurgy Engineering, Computer & Information Sciences, Physics", test: "PIEAS Written Admission Test", verified: "Verified: Nov 2026", url: "https://www.pieas.edu.pk" },
  { n: "LUMS (Lahore University of Management Sciences)", city: "Lahore", sec: "Private", accred: "HEC, AACSB, PEC, NCEAC, PBC", fields: "Business (BBA), Accounting & Finance, CS, Electrical Engineering, Economics, Law (BA-LLB)", test: "SAT / LCAT / LMAT + Mandatory HEC LAT (for Law)", verified: "Verified: Nov 2026", url: "https://lums.edu.pk" },
  { n: "UET Lahore (University of Engineering & Technology)", city: "Lahore", sec: "Public", accred: "HEC, PEC, NCEAC, PCATP", fields: "Civil, Mechanical, Electrical & Chemical Engineering, Computer Science, Data Science, Architecture (B.Arch)", test: "UET ECAT (Mandatory)", verified: "Verified: Nov 2026", url: "https://www.uet.edu.pk" },
  { n: "University of the Punjab (PU)", city: "Lahore", sec: "Public", accred: "HEC, PCP, PBC, NCEAC", fields: "Pharm-D, Law (LLB), Computer Science (FCIT/PUCIT), Commerce, Economics, Psychology, Media, Fine Arts", test: "PU Entry Test & Mandatory HEC LAT (for LLB)", verified: "Verified: Nov 2026", url: "https://www.pu.edu.pk" },
  { n: "King Edward Medical University (KEMU)", city: "Lahore", sec: "Public", accred: "PMDC, PNMC, HEC", fields: "Medicine (MBBS), Allied Health Sciences (DPT, Medical Lab Technology, Imaging), BS Nursing (Generic 4-Yr)", test: "PMDC National MDCAT (for MBBS) / UHS & Punjab Centralized Admission (for Nursing & AHS)", verified: "Verified: Nov 2026", url: "https://kemu.edu.pk" },
  { n: "NCA (National College of Arts)", city: "Lahore / Rawalpindi", sec: "Public", accred: "HEC, PCATP", fields: "Architecture (B.Arch), Visual Communication Design, Fine Arts, Product/Textile Design, Multimedia", test: "NCA Drawing & Aptitude Test + Interview", verified: "Verified: Nov 2026", url: "https://www.nca.edu.pk" },
  { n: "Forman Christian College (A Chartered University — FCCU)", city: "Lahore", sec: "Private", accred: "HEC, NCEAC, NBEAC", fields: "Computer Science, Business (BBA), Biotechnology, Economics, Psychology, Mass Communication", test: "FCCU Entry Test (FEAT)", verified: "Verified: Nov 2026", url: "https://www.fccollege.edu.pk" },
  { n: "IBA Karachi (Institute of Business Administration)", city: "Karachi", sec: "Public", accred: "HEC, NBEAC, NCEAC", fields: "BBA, Accounting & Finance, Computer Science, Economics & Mathematics, Social Sciences", test: "IBA Aptitude Test / SAT", verified: "Verified: Nov 2026", url: "https://www.iba.edu.pk" },
  { n: "NED University of Engineering & Technology", city: "Karachi", sec: "Public", accred: "HEC, PEC, NCEAC, PCATP", fields: "Civil, Mechanical, Electrical & Software Engineering, CS, Artificial Intelligence, Architecture, Textile Sciences", test: "NED Pre-Admission Entry Test", verified: "Verified: Nov 2026", url: "https://www.neduet.edu.pk" },
  { n: "University of Karachi (UoK)", city: "Karachi", sec: "Public", accred: "HEC, PCP, PBC, NCEAC", fields: "Pharmacy (Pharm-D), Computer Science (UBIT), Business (KUBS), Visual Studies, Law, Psychology, Natural Sciences", test: "UoK Entry Test + HEC LAT (for Law)", verified: "Verified: Nov 2026", url: "https://www.uok.edu.pk" },
  { n: "Dow University of Health Sciences (DUHS)", city: "Karachi", sec: "Public", accred: "PMDC, PCP, PNMC, HEC", fields: "Medicine (MBBS), Dentistry (BDS), Pharm-D, BS Nursing (BSN), DPT & Allied Health Sciences", test: "PMDC MDCAT (for MBBS/BDS) / DUHS Entry Test (for Pharm-D, BSN & Allied Health)", verified: "Verified: Nov 2026", url: "https://www.duhs.edu.pk" },
  { n: "Aga Khan University (AKU)", city: "Karachi", sec: "Private", accred: "HEC, PMDC, PNMC", fields: "Medicine (MBBS), BS Nursing (BSN) & Post-RN BScN, Education, Clinical Research", test: "AKU Admission Test + PMDC MDCAT (for MBBS) + Structured Interviews", verified: "Verified: Nov 2026", url: "https://www.aku.edu" },
  { n: "GIKI (Ghulam Ishaq Khan Institute of Engineering Sciences & Technology)", city: "Topi / KPK", sec: "Private", accred: "HEC, PEC, NCEAC", fields: "Mechanical, Electrical & Materials Engineering, Computer Science, AI, Data Science, Cyber Security, Management Sciences", test: "GIKI Undergraduate Admission Test", verified: "Verified: Nov 2026", url: "https://giki.edu.pk" },
  { n: "UET Peshawar (University of Engineering & Technology)", city: "Peshawar", sec: "Public", accred: "HEC, PEC, NCEAC, PCATP", fields: "Civil, Electrical, Mechanical & Mechatronics Engineering, Computer Systems, CS, Architecture", test: "ETEA Engineering Entrance Test", verified: "Verified: Nov 2026", url: "https://www.uetpeshawar.edu.pk" }
];

const UNI_CHECKS = [
  "Confirmed the university and specific degree programme are on the official HEC Recognised Universities list (and accredited by PEC/PMDC/PCP/PNMC/PCATP/PBC/NCEAC if applicable).",
  "Calculated total 4-to-5-year cost (tuition per semester, admission fee, hostel/transport, and books) using the university's official fee schedule.",
  "Checked the required entry test (NET, ECAT, MDCAT, NAT, LAT, SAT, or ETEA) and noted official registration deadlines.",
  "Reviewed the department's faculty profiles, lab facilities, and semester curriculum on the official website.",
  "Checked need-based or merit scholarship availability directly on the university's financial aid page.",
  "Verified campus location, safe commute time, or on-campus hostel availability."
];

function universitiesTool() {
  const cities = ["Islamabad", "Lahore", "Karachi", "Topi / KPK", "Peshawar"];
  let sector = "All";
  let checked = store.get("fp_uni_check", []);

  app.innerHTML = `<div class="tool-box">
    <span class="eyebrow">Interactive Directory (${UNIS.length} Institutions)</span>
    <h3>Explore Major HEC-Recognised Universities</h3>
    <p class="small">Filter by city, sector (Public/Private), or academic field. Every card links directly to the university's official website &mdash; never rely on third-party fee tables; always verify current fees and admission dates on the official portal.</p>
    <div class="finder-toolbar" style="margin-top:14px">
      <div class="row" style="flex:1">
        <input id="uni-search" type="search" placeholder="Search university name, field (e.g. Pharm-D, BDS, Law, CS), council (PEC, PMDC), or test..." aria-label="Search universities">
        <select id="uni-city" aria-label="Filter by city"><option value="">All cities</option>${cities.map(c => `<option>${c}</option>`).join("")}</select>
      </div>
    </div>
    <div class="filter-chips" role="group" aria-label="Filter by sector">
      ${["All", "Public", "Private"]
        .map(
          (s, i) =>
            `<button type="button" class="chip${i === 0 ? " active" : ""}" data-sec="${s}" aria-pressed="${
              i === 0 ? "true" : "false"
            }">${s === "All" ? `All Sectors (${UNIS.length})` : s}</button>`
        )
        .join("")}
    </div>
    <div class="grid" id="uni-grid"></div>
  </div>
  <div class="tool-box" id="uni-checklist-box">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <span class="eyebrow">Personal Scorecard</span>
        <h3 style="margin-bottom:4px">Interactive University Evaluation Checklist</h3>
        <p class="small" id="uni-check-status" aria-live="polite" style="margin:0"></p>
      </div>
      <button type="button" class="btn sm" id="uni-check-reset">Reset checklist</button>
    </div>
    <div class="check-list-interactive" id="uni-checks"></div>
  </div>`;

  const grid = document.getElementById("uni-grid"),
    sIn = document.getElementById("uni-search"),
    cSel = document.getElementById("uni-city"),
    checksWrap = document.getElementById("uni-checks"),
    statusEl = document.getElementById("uni-check-status");

  const renderUnis = () => {
    const q = sIn.value.toLowerCase(),
      city = cSel.value;
    const list = UNIS.filter(
      u =>
        (sector === "All" || u.sec === sector) &&
        (!city || u.city.includes(city)) &&
        JSON.stringify(u).toLowerCase().includes(q)
    );
    grid.innerHTML = list.length
      ? list
          .map(
            u =>
              `<article class="card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:8px;flex-wrap:wrap">
                  <span class="tag ${u.sec === "Public" ? "teal" : "brand"}">${u.sec} Sector</span>
                  <span class="small" style="font-weight:600">${u.city}</span>
                </div>
                <h3>${u.n}</h3>
                <p><strong>Known programs:</strong> ${u.fields}</p>
                <p class="small" style="margin-bottom:6px"><strong>Recognition:</strong> ${u.accred}</p>
                <p class="small"><strong>Admission test:</strong> ${u.test}</p>
                <div style="margin-top:auto;padding-top:12px;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
                  <a href="${u.url}" target="_blank" rel="noopener" class="link-arrow">Official website</a>
                  <span class="small" style="font-size:0.78rem">${u.verified}</span>
                </div>
              </article>`
          )
          .join("")
      : "<p>No universities match your filter. Try clearing the search or choosing All cities.</p>";
  };

  const renderChecklist = () => {
    statusEl.innerHTML = `<strong>${checked.length} of ${UNI_CHECKS.length} criteria verified</strong> for your shortlisted university (saved automatically).`;
    checksWrap.innerHTML = UNI_CHECKS.map(
      (txt, idx) =>
        `<label class="check-item"><input type="checkbox" data-idx="${idx}"${
          checked.includes(idx) ? " checked" : ""
        }><span>${txt}</span></label>`
    ).join("");
    checksWrap.querySelectorAll("input").forEach(cb => {
      cb.onchange = () => {
        const idx = parseInt(cb.dataset.idx, 10);
        const set = new Set(checked);
        if (cb.checked) set.add(idx);
        else set.delete(idx);
        checked = [...set];
        store.set("fp_uni_check", checked);
        renderChecklist();
      };
    });
  };

  renderUnis();
  renderChecklist();
  sIn.oninput = cSel.onchange = renderUnis;
  app.querySelectorAll(".chip").forEach(btn => {
    btn.onclick = () => {
      app.querySelectorAll(".chip").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      sector = btn.dataset.sec;
      renderUnis();
    };
  });
  document.getElementById("uni-check-reset").onclick = () => {
    checked = [];
    store.del("fp_uni_check");
    renderChecklist();
  };
}

/* ==========================================================================
   7. Scholarships Filters & Application Document Checklist (12 Programmes)
   ========================================================================== */
const SCHOLS = [
  { n: "HEC Need-Based Scholarships", cat: "Need-Based", lvl: "Undergraduate", status: "Active Recurring Cycle", elig: "Pakistani students admitted on merit to participating HEC-recognised public/private universities who demonstrate verified financial need via the university Financial Aid Office (FAO).", cov: "Full or partial tuition fee waiver plus monthly living/book stipend paid through the university financial aid office.", verified: "Verified: Nov 2026", url: "https://www.hec.gov.pk" },
  { n: "Benazir Undergraduate Scholarship Project (BUSP / Ehsaas)", cat: "Government", lvl: "Undergraduate", status: "Periodic Cohort Intake — Check Portal", elig: "Undergraduate students from low-income families (income below BISP/HEC threshold) enrolled in regular 4- or 5-year programmes at public sector HEC universities (self-finance/evening excluded).", cov: "100% tuition fee coverage plus annual living stipend (50% quota reserved for female students). Check portal & university FAO for active cohort announcements.", verified: "Verified: Nov 2026", url: "https://ehsaas.hec.gov.pk" },
  { n: "PEEF (Punjab Educational Endowment Fund)", cat: "Need-Based", lvl: "Undergraduate", status: "Active Recurring Cycle", elig: "Domicile holders of Punjab (plus special quotas for other provinces/AJK/GB) scoring at least 60% marks with verified family monthly income within PEEF limits.", cov: "Monthly educational stipends for Intermediate, Undergraduate, and Master's students.", verified: "Verified: Nov 2026", url: "https://www.peef.org.pk" },
  { n: "SEEF (Sindh) & BEEF (Balochistan) Provincial Endowment Funds", cat: "Government", lvl: "Undergraduate", status: "Active Recurring Cycle", elig: "Meritorious and financially deserving students holding Sindh domicile (SEEF) or Balochistan domicile (BEEF) enrolled in approved public and private degree institutions.", cov: "Tuition fee support and annual/monthly stipends for undergraduate and professional degree students.", verified: "Verified: Nov 2026", url: "https://seef.sindh.gov.pk", url2: "https://beef.org.pk", url2Label: "BEEF Portal" },
  { n: "Pakistan Bait-ul-Mal (PBM) Education Stipends", cat: "Need-Based", lvl: "Undergraduate", status: "Active Semester/Annual Cycle", elig: "Deserving students from low-income households enrolled in government/public sector colleges and HEC-recognised public universities (requires bonafide certificate).", cov: "Semester-by-semester tuition fee assistance paid directly to the public institution.", verified: "Verified: Nov 2026", url: "https://www.pbm.gov.pk" },
  { n: "PM Youth Programme (Laptop & Skill Schemes)", cat: "Government", lvl: "Undergraduate", status: "Periodic Government Phases", elig: "High-achieving students enrolled in public sector HEC-recognised universities across Pakistan meeting merit thresholds when federal phases open.", cov: "Provision of laptops for academic research and access to national youth skill development tracks via the Digital Youth Hub.", verified: "Verified: Nov 2026", url: "https://pmyp.gov.pk" },
  { n: "University Institutional Outreach & Merit Aid (LUMS NOP, IBA NTHP, NUST Aid)", cat: "Merit-Based", lvl: "Undergraduate", status: "Active Recurring Cycle", elig: "Talented students with financial need (LUMS National Outreach Programme, IBA National Talent Hunt, NUST/FAST/AKU Need-Based Aid) or top board/entry-test scorers.", cov: "25% to 100% tuition fee waivers (up to full tuition, hostel, and stipend for LUMS NOP and IBA NTHP scholars).", verified: "Verified: Nov 2026", url: "https://nop.lums.edu.pk", url2: "https://nthp.iba.edu.pk", url2Label: "IBA NTHP" },
  { n: "Fulbright Pakistan Student Program (USEFP)", cat: "International", lvl: "Postgraduate", status: "Active Annual Cycle (Spring)", elig: "Pakistani citizens with a 16-year degree (4-year BS or 2-year BSc + 2-year MSc), strong academic record, GRE & TOEFL/IELTS scores, and commitment to return to Pakistan.", cov: "Fully funded Master's or PhD in the United States (tuition, airfare, living stipend, and health insurance).", verified: "Verified: Nov 2026", url: "https://usefp.org" },
  { n: "Chevening Scholarships (UK Government)", cat: "International", lvl: "Postgraduate", status: "Active Annual Cycle (Aug–Nov)", elig: "Pakistani citizens with an undergraduate degree and at least 2 years (2,800 hours) of work, paid/unpaid internship, or volunteering experience.", cov: "Fully funded 1-year Master's degree at any UK university, return airfare, visa, and monthly living allowance.", verified: "Verified: Nov 2026", url: "https://www.chevening.org" },
  { n: "DAAD Scholarships (Germany — EPOS & Study Tracks)", cat: "International", lvl: "Postgraduate", status: "Active Annual Cycle", elig: "Graduates with a 4-year Bachelor's degree (plus at least 2 years of professional experience for DAAD EPOS development-related Master's/PhD courses).", cov: "Monthly living stipend, health insurance, and travel allowance at tuition-free German public universities.", verified: "Verified: Nov 2026", url: "https://www.daad.de/en/" },
  { n: "Commonwealth Master's & PhD Scholarships (UK)", cat: "International", lvl: "Postgraduate", status: "Active Annual Cycle (CSC & HEC)", elig: "Pakistani citizens holding a strong first degree who apply simultaneously via the Commonwealth Scholarship Commission (CSC) portal and HEC nomination portal.", cov: "Full UK university tuition, return flights, and monthly living stipend.", verified: "Verified: Nov 2026", url: "https://cscuk.fcdo.gov.uk", url2: "https://www.hec.gov.pk", url2Label: "HEC Portal" },
  { n: "Erasmus Mundus Joint Masters (European Union)", cat: "International", lvl: "Postgraduate", status: "Active Annual Cycle (Oct–Feb)", elig: "Students holding a 16-year Bachelor's degree applying directly to up to 3 Erasmus Mundus Joint Master's consortia via the official EU catalogue.", cov: "Full participation costs, travel, visa, installation, and monthly subsistence across 2+ European universities.", verified: "Verified: Nov 2026", url: "https://erasmus-plus.ec.europa.eu" }
];

const SCH_CHECKS = [
  "Attested copies of Matric, Intermediate, or Bachelor's transcripts and degree certificates.",
  "Valid CNIC or B-Form (plus parent/guardian CNIC and provincial domicile certificate).",
  "Verified family income certificate, salary slips/tax return, and recent utility bills (for need-based aid).",
  "Tailored Personal Statement / Statement of Purpose (1–2 pages written and edited by yourself, never generic AI copy).",
  "Two academic or professional recommendation letters requested from teachers at least 3 weeks before the deadline.",
  "Confirmed official portal deadline and verified zero application/agent fee is being demanded."
];

function scholarshipsTool() {
  let activeCat = "All";
  let checked = store.get("fp_sch_check", []);

  app.innerHTML = `<div class="tool-box">
    <span class="eyebrow">Interactive Finder (${SCHOLS.length} Programmes)</span>
    <h3>Filter National &amp; International Scholarship Programmes</h3>
    <p class="small">Filter genuine Pakistani and international scholarship schemes by funding type and degree level. Every card displays cycle status and links directly to the official portal.</p>
    <div class="finder-toolbar" style="margin-top:14px">
      <div class="row" style="flex:1">
        <input id="sch-search" type="search" placeholder="Search scholarship name, eligibility, country, or coverage..." aria-label="Search scholarships">
        <select id="sch-level" aria-label="Study level"><option value="">All levels</option><option>Undergraduate</option><option>Postgraduate</option></select>
      </div>
    </div>
    <div class="filter-chips" role="group" aria-label="Filter by scholarship type">
      ${["All", "Need-Based", "Merit-Based", "Government", "International"]
        .map(
          (c, i) =>
            `<button type="button" class="chip${i === 0 ? " active" : ""}" data-cat="${c}" aria-pressed="${
              i === 0 ? "true" : "false"
            }">${c === "All" ? `All Programmes (${SCHOLS.length})` : c}</button>`
        )
        .join("")}
    </div>
    <div class="grid" id="sch-grid"></div>
  </div>
  <div class="tool-box">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <span class="eyebrow">Application Prep</span>
        <h3 style="margin-bottom:4px">Scholarship Document Readiness Checklist</h3>
        <p class="small" id="sch-check-status" aria-live="polite" style="margin:0"></p>
      </div>
      <button type="button" class="btn sm" id="sch-check-reset">Reset checklist</button>
    </div>
    <div class="check-list-interactive" id="sch-checks"></div>
  </div>`;

  const grid = document.getElementById("sch-grid"),
    sIn = document.getElementById("sch-search"),
    lSel = document.getElementById("sch-level"),
    checksWrap = document.getElementById("sch-checks"),
    statusEl = document.getElementById("sch-check-status");

  const renderSch = () => {
    const q = sIn.value.toLowerCase(),
      lvl = lSel.value;
    const list = SCHOLS.filter(
      s =>
        (activeCat === "All" || s.cat === activeCat) &&
        (!lvl || s.lvl === lvl) &&
        JSON.stringify(s).toLowerCase().includes(q)
    );
    grid.innerHTML = list.length
      ? list
          .map(
            s =>
              `<article class="card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;gap:8px;flex-wrap:wrap">
                  <span class="tag brand">${s.cat}</span>
                  <span class="tag teal">${s.lvl}</span>
                </div>
                <h3>${s.n}</h3>
                <p class="small" style="margin-bottom:8px"><strong>Cycle status:</strong> ${s.status}</p>
                <p><strong>Eligibility:</strong> ${s.elig}</p>
                <p><strong>Coverage:</strong> ${s.cov}</p>
                <div style="margin-top:auto;padding-top:12px;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
                  <div style="display:flex;gap:12px;flex-wrap:wrap">
                    <a href="${s.url}" target="_blank" rel="noopener" class="link-arrow">Official portal</a>
                    ${s.url2 ? `<a href="${s.url2}" target="_blank" rel="noopener" class="link-arrow">${s.url2Label || "Secondary portal"}</a>` : ""}
                  </div>
                  <span class="small" style="font-size:0.78rem">${s.verified}</span>
                </div>
              </article>`
          )
          .join("")
      : "<p>No scholarships match your filter. Try selecting All levels or All Programmes.</p>";
  };

  const renderChecks = () => {
    statusEl.innerHTML = `<strong>${checked.length} of ${SCH_CHECKS.length} application documents ready</strong> (saved automatically).`;
    checksWrap.innerHTML = SCH_CHECKS.map(
      (txt, idx) =>
        `<label class="check-item"><input type="checkbox" data-idx="${idx}"${
          checked.includes(idx) ? " checked" : ""
        }><span>${txt}</span></label>`
    ).join("");
    checksWrap.querySelectorAll("input").forEach(cb => {
      cb.onchange = () => {
        const idx = parseInt(cb.dataset.idx, 10);
        const set = new Set(checked);
        if (cb.checked) set.add(idx);
        else set.delete(idx);
        checked = [...set];
        store.set("fp_sch_check", checked);
        renderChecks();
      };
    });
  };

  renderSch();
  renderChecks();
  sIn.oninput = lSel.onchange = renderSch;
  app.querySelectorAll(".chip").forEach(btn => {
    btn.onclick = () => {
      app.querySelectorAll(".chip").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      activeCat = btn.dataset.cat;
      renderSch();
    };
  });
  document.getElementById("sch-check-reset").onclick = () => {
    checked = [];
    store.del("fp_sch_check");
    renderChecks();
  };
}

/* ==========================================================================
   8. Internships Directory, Readiness Checklist & Student Email Template
   ========================================================================== */
const INT_PORTALS = [
  { n: "PSEB TechDestination / National IT Internships", type: "National Programmes", desc: "Official Pakistan Software Export Board (PSEB) IT, software, and AI internship/apprenticeship portal connecting computing graduates with registered software houses.", verified: "Verified: Nov 2026", url: "https://techdestination.com", url2: "https://www.pseb.org.pk", url2Label: "PSEB Official" },
  { n: "Prime Minister's Youth Programme (PMYP Digital Youth Hub)", type: "National Programmes", desc: "Federal youth portal for internship and skill announcements. Note: Initial Ba-Ikhtiyar Naujawan (BNIP) WSIP/BSIP cohorts have concluded; check PMYP for new federal batches.", verified: "Verified: Nov 2026", url: "https://pmyp.gov.pk" },
  { n: "DigiSkills.pk (Ignite & Virtual University)", type: "National Programmes", desc: "Official government-funded free practical training in freelancing, graphic design, SEO, data analytics, and WordPress to build your first portfolio.", verified: "Verified: Nov 2026", url: "https://digiskills.pk" },
  { n: "LinkedIn Jobs (Pakistan & Remote Internship Filter)", type: "Pakistan Portals", desc: "Search 'Intern' or 'Trainee' in Lahore, Karachi, Islamabad, or Remote and connect directly with engineering leads, HR managers, and founders.", verified: "Verified: Nov 2026", url: "https://www.linkedin.com/jobs" },
  { n: "Rozee.pk Student & Graduate Internships", type: "Pakistan Portals", desc: "Verified local internship and management trainee (MTO) postings across banking, FMCGs, engineering, media, and software companies.", verified: "Verified: Nov 2026", url: "https://www.rozee.pk" },
  { n: "Mustakbil.com Internships", type: "Pakistan Portals", desc: "Pakistani job and internship board listing entry-level trainee and summer internship openings across major cities.", verified: "Verified: Nov 2026", url: "https://www.mustakbil.com" },
  { n: "Interns.pk Virtual Skill Program", type: "Remote & Open Source", desc: "Structured remote frontend and coding challenges designed for Pakistani students starting with zero prior industry experience.", verified: "Verified: Nov 2026", url: "https://interns.pk" },
  { n: "Google Summer of Code (GSoC)", type: "Remote & Open Source", desc: "Global paid remote open-source software development programme where student contributors work with mentored open-source organizations.", verified: "Verified: Nov 2026", url: "https://summerofcode.withgoogle.com" },
  { n: "Outreachy & MLH Fellowship", type: "Remote & Open Source", desc: "Paid remote open-source internships in software engineering, documentation, UX, and data science with global mentorship.", verified: "Verified: Nov 2026", url: "https://www.outreachy.org", url2: "https://fellowship.mlh.io", url2Label: "MLH Fellowship" }
];

const INT_CHECKS = [
  "Created a clean 1-page PDF CV leading with education, core tools, and 2–3 real practice projects (with live demo or GitHub/Behance links).",
  "Published proof of work online (GitHub repositories with clear READMEs, Figma/Behance case studies, or Google Sheets/writing samples).",
  "Updated LinkedIn headline and summary to state clearly what internship role and intake season you are seeking.",
  "Shortlisted 15–20 target companies or software houses and researched what products or services they build.",
  "Practised answering 'Walk me through a project you built and a bug/problem you solved' plus 2 thoughtful questions for interviewers."
];

function internshipsTool() {
  let activeType = "All";
  let checked = store.get("fp_int_check", []);

  app.innerHTML = `<div class="tool-box">
    <span class="eyebrow">Verified Platforms (${INT_PORTALS.length} Portals)</span>
    <h3>Where to Find Legitimate Internships</h3>
    <p class="small">Filter verified national portals, government programmes, and global remote fellowships. Never pay any registration, certificate, or 'portal activation' fee for an internship.</p>
    <div class="filter-chips" role="group" aria-label="Filter internship portals">
      ${["All", "Pakistan Portals", "National Programmes", "Remote & Open Source"]
        .map(
          (t, i) =>
            `<button type="button" class="chip${i === 0 ? " active" : ""}" data-type="${t}" aria-pressed="${
              i === 0 ? "true" : "false"
            }">${t === "All" ? `All Portals (${INT_PORTALS.length})` : t}</button>`
        )
        .join("")}
    </div>
    <div class="grid" id="int-grid"></div>
  </div>
  <div class="tool-box">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <span class="eyebrow">First-Internship Prep</span>
        <h3 style="margin-bottom:4px">Interactive Internship Readiness Checklist</h3>
        <p class="small" id="int-check-status" aria-live="polite" style="margin:0"></p>
      </div>
      <button type="button" class="btn sm" id="int-check-reset">Reset checklist</button>
    </div>
    <div class="check-list-interactive" id="int-checks"></div>
  </div>
  <div class="tool-box">
    <span class="eyebrow">Outreach Helper</span>
    <h3>Student Internship Cold-Email / LinkedIn Pitch Builder</h3>
    <p class="small">No work experience yet? Fill in the fields below to generate a polite, project-focused message you can send to a company or hiring manager.</p>
    <div class="grid-2" style="margin:14px 0">
      <div><label for="p-name">Your name</label><input id="p-name" type="text" placeholder="e.g. Ayesha Khan" style="width:100%"></div>
      <div><label for="p-edu">Your degree / stream</label><input id="p-edu" type="text" placeholder="e.g. 4th-semester BS Computer Science student" style="width:100%"></div>
      <div><label for="p-role">Target internship role</label><input id="p-role" type="text" placeholder="e.g. Frontend Web Development Intern" style="width:100%"></div>
      <div><label for="p-skill">Project or skill proof</label><input id="p-skill" type="text" placeholder="e.g. built 3 responsive JavaScript apps on GitHub" style="width:100%"></div>
    </div>
    <div id="pitch-out" class="pitch-preview"></div>
    <div class="row">
      <button type="button" class="btn primary sm" id="copy-pitch">Copy email template</button>
      <span id="copy-msg" class="small" role="status" aria-live="polite"></span>
    </div>
  </div>`;

  const grid = document.getElementById("int-grid"),
    checksWrap = document.getElementById("int-checks"),
    statusEl = document.getElementById("int-check-status"),
    pitchOut = document.getElementById("pitch-out");

  const renderPortals = () => {
    const list = INT_PORTALS.filter(p => activeType === "All" || p.type === activeType);
    grid.innerHTML = list
      .map(
        p =>
          `<article class="card">
            <div style="margin-bottom:8px"><span class="tag brand">${p.type}</span></div>
            <h3>${p.n}</h3>
            <p>${p.desc}</p>
            <div style="margin-top:auto;padding-top:12px;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
              <div style="display:flex;gap:12px;flex-wrap:wrap">
                <a href="${p.url}" target="_blank" rel="noopener" class="link-arrow">Official platform</a>
                ${p.url2 ? `<a href="${p.url2}" target="_blank" rel="noopener" class="link-arrow">${p.url2Label}</a>` : ""}
              </div>
              <span class="small" style="font-size:0.78rem">${p.verified}</span>
            </div>
          </article>`
      )
      .join("");
  };

  const renderChecks = () => {
    statusEl.innerHTML = `<strong>${checked.length} of ${INT_CHECKS.length} readiness steps completed</strong> (saved automatically).`;
    checksWrap.innerHTML = INT_CHECKS.map(
      (txt, idx) =>
        `<label class="check-item"><input type="checkbox" data-idx="${idx}"${
          checked.includes(idx) ? " checked" : ""
        }><span>${txt}</span></label>`
    ).join("");
    checksWrap.querySelectorAll("input").forEach(cb => {
      cb.onchange = () => {
        const idx = parseInt(cb.dataset.idx, 10);
        const set = new Set(checked);
        if (cb.checked) set.add(idx);
        else set.delete(idx);
        checked = [...set];
        store.set("fp_int_check", checked);
        renderChecks();
      };
    });
  };

  const updatePitch = () => {
    const name = document.getElementById("p-name").value.trim() || "[Your Name]",
      edu = document.getElementById("p-edu").value.trim() || "[your current degree/stream]",
      role = document.getElementById("p-role").value.trim() || "[Target Internship Role]",
      skill = document.getElementById("p-skill").value.trim() || "[2–3 practice projects demonstrating your skills]";

    pitchOut.textContent =
      `Subject: Internship Inquiry — ${role} (${name})\n\n` +
      `Dear Hiring Team,\n\n` +
      `I am a ${edu} writing to inquire about a ${role} opportunity with your team.\n\n` +
      `Over the past few months, I have ${skill}. I have attached my one-page CV and included links to my portfolio/projects so you can review my actual work directly.\n\n` +
      `I would welcome the chance to contribute to your team and learn from your engineers/staff this semester. Thank you for your time and consideration.\n\n` +
      `Best regards,\n${name}\n[Link to GitHub / Portfolio / LinkedIn]`;
  };

  renderPortals();
  renderChecks();
  updatePitch();

  ["p-name", "p-edu", "p-role", "p-skill"].forEach(id => {
    document.getElementById(id).addEventListener("input", updatePitch);
  });

  document.getElementById("copy-pitch").onclick = () => {
    const msgEl = document.getElementById("copy-msg");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(pitchOut.textContent).then(() => {
        msgEl.textContent = "Copied to clipboard!";
        msgEl.style.color = "#0F766E";
      });
    } else {
      msgEl.textContent = "Select the text above and press Ctrl+C to copy.";
    }
  };

  app.querySelectorAll(".chip").forEach(btn => {
    btn.onclick = () => {
      app.querySelectorAll(".chip").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      activeType = btn.dataset.type;
      renderPortals();
    };
  });

  document.getElementById("int-check-reset").onclick = () => {
    checked = [];
    store.del("fp_int_check");
    renderChecks();
  };
}

/* ==========================================================================
   9. Free Learning Resources Search & Category Filter
   ========================================================================== */
function resourcesTool() {
  const blocks = [...document.querySelectorAll(".category-block")];
  const totalRes = document.querySelectorAll(".category-block .card").length;
  const cats = ["All", ...blocks.map(b => (b.querySelector("h3") || {}).textContent || "").filter(Boolean)];
  let activeCat = "All";

  app.innerHTML = `<div class="finder-toolbar">
    <input id="res-search" type="search" placeholder="Search free platforms by name or topic (e.g. Python, Harvard, Figma, English, project ideas, MDN)..." aria-label="Search learning resources">
  </div>
  <div class="filter-chips" role="group" aria-label="Filter resources by category">
    ${cats
      .map(
        (c, i) =>
          `<button type="button" class="chip${i === 0 ? " active" : ""}" data-cat="${c}" aria-pressed="${
            i === 0 ? "true" : "false"
          }">${c === "All" ? `All Categories (${totalRes})` : c}</button>`
      )
      .join("")}
  </div>
  <p class="small" id="res-count" aria-live="polite" style="margin-bottom:8px"></p>`;

  const sIn = document.getElementById("res-search"),
    countEl = document.getElementById("res-count");

  const filterResources = () => {
    const q = sIn.value.toLowerCase();
    let visibleCards = 0;

    blocks.forEach(block => {
      const catTitle = (block.querySelector("h3") || {}).textContent || "";
      const catMatch = activeCat === "All" || catTitle === activeCat;
      const cards = [...block.querySelectorAll(".card")];
      let blockVisible = 0;

      cards.forEach(card => {
        const textMatch = !q || card.textContent.toLowerCase().includes(q);
        const show = catMatch && textMatch;
        card.style.display = show ? "" : "none";
        if (show) {
          blockVisible++;
          visibleCards++;
        }
      });

      block.style.display = blockVisible > 0 ? "" : "none";
    });

    countEl.textContent = `Showing ${visibleCards} of ${totalRes} verified free learning platforms and study hubs.`;
  };

  filterResources();
  sIn.oninput = filterResources;
  app.querySelectorAll(".chip").forEach(btn => {
    btn.onclick = () => {
      app.querySelectorAll(".chip").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      activeCat = btn.dataset.cat;
      filterResources();
    };
  });
}

({
  "career-finder": finder,
  "degree-explorer": degrees,
  careers,
  skills: () =>
    accordion(
      SKILLS,
      [
        ["what", "What it is"],
        ["why", "Why learn it"],
        ["start", "To begin"],
        ["road", "Roadmap"],
        ["tools", "Tools"],
        ["free", "Free resources"],
        ["proj", "Practice projects"],
        ["port", "Portfolio"],
        ["car", "Careers"]
      ],
      SKILL_IC,
      true
    ),
  "online-earning": onlineEarning,
  universities: universitiesTool,
  scholarships: scholarshipsTool,
  internships: internshipsTool,
  resources: resourcesTool
}[page] || (() => {}))();
