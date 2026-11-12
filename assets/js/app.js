const app = document.getElementById("app"),
  page = app && app.dataset.page,
  L = a => "<ul>" + a.map(x => `<li>${x}</li>`).join("") + "</ul>";

const SUBJ = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Business/Commerce", "Art and Design", "English"],
  INT = ["Technology", "Medical", "Business", "Engineering", "Arts and Design", "Psychology", "Finance", "Media"],
  STR = ["Creativity", "Problem-solving", "Communication", "Analytical thinking", "Leadership"],
  WORK = ["Working with computers", "Helping people", "Managing businesses", "Creating designs", "Research and experiments"],
  ENV = ["Remote", "Office", "Freelancing", "Entrepreneurship"];

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
  "Engineer": SVG.gear,
  "Business Manager or Entrepreneur": SVG.briefcase,
  "Accountant or Financial Analyst": SVG.finance,
  "Psychologist or Counsellor": SVG.mind,
  "Designer (Graphic or UI/UX)": SVG.design,
  "Media Producer or Journalist": SVG.media,
  "Cybersecurity Analyst": SVG.shield
},
SKILL_IC = {
  "Web Development": SVG.code,
  "Python Programming": SVG.code,
  "Data Analysis": SVG.chart,
  "Graphic Design": SVG.design,
  "UI/UX Design": SVG.pen,
  "Digital Marketing and SEO": SVG.briefcase,
  "AI and Prompt Engineering": SVG.spark
},
EARN_IC = {
  "Freelance Web Development": SVG.code,
  "Graphic Design Freelancing": SVG.design,
  "Content Writing": SVG.pen,
  "YouTube and Content Creation": SVG.media
},
CAT_IC = {
  "Computer Science": SVG.code,
  "Software Engineering": SVG.code,
  "Artificial Intelligence": SVG.spark,
  "Cybersecurity": SVG.shield,
  "Medical and Healthcare": SVG.medical,
  "Engineering": SVG.gear,
  "Business Administration": SVG.briefcase,
  "Accounting and Finance": SVG.finance,
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

function finder() {
  app.innerHTML = `<div class="note"><strong>Honest methodology:</strong> Recommendations are guidance, not a prediction of your perfect career. Scores transparently compare your answers with our career profiles (Interests: 3 pts, Strengths: 2 pts, Work style: 2 pts, Subjects: 1 pt, Environment: 1 pt).</div>
  <div class="finder-toolbar">
    <div class="finder-status" id="q-status">Select options in steps 2 to 6 below to calculate your career match score.</div>
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
    resetBtn = document.getElementById("q-reset");

  form.addEventListener("change", () => {
    const count = form.querySelectorAll('input[type="checkbox"]:checked').length;
    statusEl.innerHTML = count
      ? `<strong>${count} criteria selected</strong> across your subjects, interests, strengths, and work preferences.`
      : "Select options in steps 2 to 6 below to calculate your career match score.";
  });

  resetBtn.addEventListener("click", () => {
    form.reset();
    statusEl.textContent = "Select options in steps 2 to 6 below to calculate your career match score.";
    document.getElementById("err").textContent = "";
    document.getElementById("res").innerHTML = "";
  });

  form.onsubmit = e => {
    e.preventDefault();
    const v = k => [...document.querySelectorAll(`[name=${k}]:checked`)].map(x => x.value),
      a = { sub: v("sub"), int: v("int"), str: v("str"), work: v("work"), env: v("env") },
      W = { int: 3, str: 2, work: 2, sub: 1, env: 1 },
      K = { int: "i", str: "s", work: "w", sub: "sub", env: "e" },
      total = Object.keys(W).reduce((t, k) => t + W[k] * a[k].length, 0);
    if (!total) {
      document.getElementById("err").textContent = "Pick at least one option in questions 2 to 6.";
      return;
    }
    document.getElementById("err").textContent = "";
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
      r = document.getElementById("res");

    r.innerHTML =
      `<h2>Your top career matches</h2>` +
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
                  <div class="res-meta-grid">
                    <div class="res-meta-item"><strong>Related Degrees</strong>${c.deg
                      .map(d => `<a href="degree-explorer.html#${d}">${dName(d)}</a>`)
                      .join(", ")}</div>
                    <div class="res-meta-item"><strong>Key Skills</strong>${c.skills.map(s => `<span class="tag">${s}</span>`).join(" ")}</div>
                    <div class="res-meta-item"><strong>Education Path</strong>${c.edu}</div>
                    <div class="res-meta-item"><strong>Opportunities</strong>${c.opp}</div>
                    <div class="res-meta-item"><strong>Earning Routes</strong>${c.earn} (not guaranteed)</div>
                  </div>
                  <p style="margin-top:8px"><strong>Recommended starting roadmap:</strong></p>
                  <ol>${c.road.map(x => `<li>${x}</li>`).join("")}</ol>
                </article>`
            )
            .join("")
        : "<p>No matches yet. Try selecting more options.</p>");
    r.focus();
    r.scrollIntoView({ behavior: "smooth" });
  };
}

function degrees() {
  const cats = [...new Set(DEGREES.map(d => d.cat))];
  app.innerHTML = `<div class="finder-toolbar">
    <div class="row" style="flex:1"><input id="s" type="search" placeholder="Search degrees, subjects, or job roles..." aria-label="Search degrees">
    <select id="c" aria-label="Category"><option value="">All categories (${DEGREES.length})</option>${cats.map(c => `<option>${c}</option>`).join("")}</select></div>
  </div>
  <p class="small">Sample educational guidance. Always verify admission criteria and seat availability on each university's official site.</p>
  <div id="out"></div>`;

  const out = document.getElementById("out"),
    s = document.getElementById("s"),
    c = document.getElementById("c");

  const detail = d =>
    `<div style="margin-bottom:20px"><a href="degree-explorer.html" id="back" class="btn sm">&larr; Back to all degrees</a></div>
    <div class="card" style="margin-bottom:24px;border-top:4px solid var(--brand)">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:12px">
        <div>
          <span class="tag brand">${d.cat}</span>
          <span class="tag teal">${d.dur}</span>
          <h2 style="margin:8px 0 4px">${d.name}</h2>
        </div>
      </div>
      <p><strong>Eligibility:</strong> ${d.elig}</p>
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
      <p><strong>Universities:</strong> See our <a href="universities.html">University Finder checklist</a> for evaluating HEC recognition, fee structures, and admission tests.</p>
      <p style="margin:0"><strong>Related degrees:</strong> ${d.rel
        .map(r => `<a href="#${r}" class="tag brand" style="text-decoration:none">${dName(r)} &rarr;</a>`)
        .join(" ")}</p>
    </div>`;

  const draw = () => {
    const h = location.hash.slice(1),
      d = DEGREES.find(x => x.id === h);
    if (d) {
      out.innerHTML = detail(d);
      document.title = d.name + " | FuturePath";
      return;
    }
    const q = s.value.toLowerCase(),
      f = DEGREES.filter(
        d => (!c.value || d.cat === c.value) && JSON.stringify(d).toLowerCase().includes(q)
      );
    out.innerHTML = f.length
      ? `<div class="grid">${f
          .map(
            d =>
              `<article class="card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
                  <span class="tag brand">${d.cat}</span>
                  <span class="small" style="font-weight:600">${d.dur}</span>
                </div>
                <h3><span class="ic">${CAT_IC[d.cat] || SVG.cap}</span><a href="#${d.id}" style="text-decoration:none;color:inherit">${d.name}</a></h3>
                <p style="margin-bottom:12px">${d.future}</p>
                <p class="small" style="margin-top:auto"><strong>Top roles:</strong> ${d.jobs.slice(0, 3).join(", ")}</p>
                <div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--line)">
                  <a href="#${d.id}" class="link-arrow">Explore degree details</a>
                </div>
              </article>`
          )
          .join("")}</div>`
      : "<p>No degrees match. Clear the search or choose another category.</p>";
  };

  s.oninput = c.onchange = () => {
    if (location.hash) history.replaceState(null, "", location.pathname);
    draw();
  };
  addEventListener("hashchange", draw);
  draw();
}

function accordion(arr, rows, map) {
  const controls = `<div class="acc-controls">
    <span class="small">Click any topic below to view the complete step-by-step roadmap, tools, and portfolio guide.</span>
    <div style="display:flex;gap:8px">
      <button type="button" class="btn sm" id="exp-all">Expand all</button>
      <button type="button" class="btn sm" id="col-all">Collapse all</button>
    </div>
  </div>`;

  app.innerHTML =
    controls +
    arr
      .map(
        (x, idx) =>
          `<details class="card acc"${idx === 0 ? " open" : ""}>
            <summary>
              <h3><span class="ic">${map ? pickIC(map, x.n) : SVG.spark}</span>${x.n}</h3>
              <div class="acc-summary-right">
                <span class="tag">${x.time || x.car || "Roadmap"}</span>
                <span class="acc-chevron" aria-hidden="true">&#9662;</span>
              </div>
            </summary>
            <div class="acc-body">
              ${rows
                .map(
                  ([k, t]) =>
                    `<div class="acc-field"><p><strong>${t}:</strong> ${
                      Array.isArray(x[k]) ? "" : x[k]
                    }</p>${
                      Array.isArray(x[k]) ? `<ol>${x[k].map(i => `<li>${i}</li>`).join("")}</ol>` : ""
                    }</div>`
                )
                .join("")}
            </div>
          </details>`
      )
      .join("");

  const expBtn = document.getElementById("exp-all"),
    colBtn = document.getElementById("col-all");
  if (expBtn && colBtn) {
    expBtn.onclick = () => app.querySelectorAll("details.acc").forEach(d => (d.open = true));
    colBtn.onclick = () => app.querySelectorAll("details.acc").forEach(d => (d.open = false));
  }
}

function careers() {
  const envs = ["All", "Remote", "Office", "Freelancing", "Entrepreneurship"];
  app.innerHTML = `<div class="filter-chips" role="group" aria-label="Filter careers by work style">
    ${envs
      .map(
        (e, i) =>
          `<button type="button" class="chip${i === 0 ? " active" : ""}" data-env="${e}">${
            e === "All" ? `All Career Paths (${CAREERS.length})` : e
          }</button>`
      )
      .join("")}
  </div>
  <div class="grid" id="career-grid"></div>`;

  const grid = document.getElementById("career-grid");
  const renderCareers = envFilter => {
    const list =
      envFilter === "All" ? CAREERS : CAREERS.filter(c => c.e && c.e.includes(envFilter));
    grid.innerHTML = list
      .map(
        c =>
          `<article class="card">
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px">
              ${c.e.map(env => `<span class="tag">${env}</span>`).join("")}
            </div>
            <h3><span class="ic">${CAREER_IC[c.n] || SVG.spark}</span>${c.n}</h3>
            <p><strong>Skills:</strong> ${c.skills.join(", ")}</p>
            <p><strong>Education:</strong> ${c.edu}</p>
            <p><strong>Where:</strong> ${c.opp}</p>
            <p class="small" style="margin-top:8px"><strong>Related degrees:</strong> ${c.deg
              .map(d => `<a href="degree-explorer.html#${d}">${dName(d)}</a>`)
              .join(", ")}</p>
          </article>`
      )
      .join("");
  };

  renderCareers("All");
  app.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      app.querySelectorAll(".chip").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderCareers(btn.dataset.env);
    });
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
      SKILL_IC
    ),
  "online-earning": () => {
    accordion(
      EARN,
      [
        ["what", "What it is"],
        ["how", "How it works"],
        ["skills", "Skills"],
        ["time", "Learning time"],
        ["tools", "Tools"],
        ["port", "Portfolio"],
        ["clients", "Finding clients"],
        ["paid", "Getting paid"],
        ["hard", "Challenges"]
      ],
      EARN_IC
    );
    app.insertAdjacentHTML(
      "afterbegin",
      `<div class="note"><strong>No guaranteed earnings.</strong> Beginners often earn nothing at first.<br><strong>Scam checklist:</strong> never pay to get a job; ignore "easy money" or "guaranteed income" offers; don't share your CNIC or bank PIN; don't cash cheques and send money back; keep communication and payment on trusted platforms.</div>`
    );
  }
}[page] || (() => {}))();
