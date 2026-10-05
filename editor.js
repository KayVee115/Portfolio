/* Edit Portfolio mode. Reads and modifies PORTFOLIO_DATA (js/data.js).
   Rendering stays in js/app.js (render, applyData, ORIGINAL_DATA). Saved edits live in localStorage. */
(function () {
  const KEY = "portfolio_data_v1";
  const STATUSES = ["Planned", "In Progress", "Completed", "On Hold", "Pending"];
  const TABS = [["personal", "Personal"], ["experience", "Experience"], ["projects", "Projects"], ["education", "Education"], ["certifications", "Certifications"], ["skills", "Skills"]];
  const clone = o => JSON.parse(JSON.stringify(o));
  const get = (o, p) => p.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
  const set = (o, p, v) => { const k = p.split("."), l = k.pop(); k.reduce((a, x) => a[x], o)[l] = v; };
  const pairs = (v, a, b) => v.split("\n").filter(s => s.trim()).map(s => { const i = s.indexOf("|"); return i < 0 ? { [a]: s.trim(), [b]: "" } : { [a]: s.slice(0, i).trim(), [b]: s.slice(i + 1).trim() }; });
  const split = (v, sep) => v.split(sep).map(s => s.trim()).filter(Boolean);
  const KINDS = {
    text: { to: v => v ?? "", from: v => v.trim() },
    area: { to: v => v ?? "", from: v => v.trim() },
    lines: { to: a => (a || []).join("\n"), from: v => split(v, "\n") },
    tags: { to: a => (a || []).join(", "), from: v => split(v, ",") },
    metrics: { to: a => (a || []).map(m => m.value + " | " + m.label).join("\n"), from: v => pairs(v, "value", "label") },
    links: { to: a => (a || []).map(l => l.label + " | " + l.url).join("\n"), from: v => pairs(v, "label", "url") }
  };

  let draft, committed, dirty = false, tab = "personal", root, skills = [];
  const opened = new Set();

  /* helper fields (start/end, degreeName, specialization, cgpa) are derived back into the display strings */
  function normalize(d) {
    d.experience.forEach(e => { if (e.start === undefined) { const [a, b] = (e.duration || "").split("\u2013").map(s => s.trim()); e.start = a || ""; e.end = b || ""; } });
    d.education.forEach(e => {
      if (e.degreeName === undefined) { const i = (e.degree || "").indexOf(" \u2013 "); e.degreeName = i < 0 ? e.degree || "" : e.degree.slice(0, i); e.specialization = i < 0 ? "" : e.degree.slice(i + 3); }
      if (e.cgpa === undefined) e.cgpa = (e.grade || "").replace(/^CGPA:\s*/, "");
    });
  }
  function derive(d) {
    d.experience.forEach(e => { e.duration = [e.start, e.end].filter(Boolean).join(" \u2013 "); });
    d.education.forEach(e => { e.degree = [e.degreeName, e.specialization].filter(Boolean).join(" \u2013 "); e.grade = e.cgpa ? "CGPA: " + e.cgpa : ""; });
  }
  const skillRows = () => ["primary", "secondary"].flatMap(g => Object.entries(draft.skills[g] || {}).map(([name, items]) => ({ g, name, items })));
  function writeSkills() {
    const s = { primary: {}, secondary: {} };
    skills.forEach(r => { let n = r.name || "Category"; while (s[r.g][n]) n += " "; s[r.g][n] = r.items; });
    draft.skills = s;
  }
  function apply(d) { const y = window.scrollY; applyData(clone(d)); render(); window.scrollTo(0, y); }
  function live() { derive(draft); apply(draft); dirty = true; msg("Unsaved changes. Click Save Changes to keep them."); }
  function msg(t) { const m = root && root.querySelector("#edMsg"); if (m) m.textContent = t; }
  function fresh(d) { draft = clone(d); normalize(draft); skills = skillRows(); }

  /* ---------- field builders ---------- */
  const field = (path, label, kind = "text", o = {}) => {
    const id = "f_" + path.replace(/\./g, "_"), v = esc(KINDS[kind].to(get(draft, path)));
    const ctl = kind === "text" ? `<input id="${id}" data-path="${path}" data-kind="text" value="${v}">`
      : `<textarea id="${id}" rows="${o.rows || 3}" data-path="${path}" data-kind="${kind}">${v}</textarea>`;
    return `<div class="ef"><label for="${id}">${label}</label>${ctl}${o.hint ? `<small>${o.hint}</small>` : ""}</div>`;
  };
  const statusSel = (path, cur) => {
    const list = STATUSES.includes(cur) || !cur ? STATUSES : [...STATUSES, cur];
    return `<div class="ef"><label for="s_${path.replace(/\./g, "_")}">Status</label><select id="s_${path.replace(/\./g, "_")}" data-path="${path}" data-kind="text">${list.map(s => `<option ${s === cur ? "selected" : ""}>${esc(s)}</option>`).join("")}</select></div>`;
  };
  const item = (ref, lf, label, inner) => `<details class="ei" data-ref="${ref}" data-lf="${lf}" ${opened.has(ref) ? "open" : ""}><summary>${esc(label || "Untitled")}</summary>${inner}<button type="button" class="danger" data-act="del" data-path="${ref}">Delete</button></details>`;
  const add = (act, label) => `<button type="button" class="add" data-act="${act}">${label}</button>`;

  const PANES = {
    personal: () => field("personal.name", "Name") + field("personal.headline", "Headline") + field("personal.location", "Location") +
      field("about.summary", "Professional summary", "area", { rows: 5 }) + field("contact.email", "Email") + field("contact.linkedin", "LinkedIn URL"),
    experience: () => draft.experience.map((e, i) => { const b = "experience." + i; return item(b, "role", e.role || e.company,
      field(b + ".company", "Company") + field(b + ".department", "Department") + field(b + ".role", "Role") + field(b + ".location", "Location") +
      field(b + ".start", "Start date") + field(b + ".end", "End date") + field(b + ".description", "Description (optional)", "area") +
      field(b + ".metrics", "Metrics", "metrics", { rows: 5, hint: "One per line: value | label" }) +
      field(b + ".details", "Responsibilities", "lines", { rows: 7, hint: "One per line" })); }).join("") + add("add-experience", "+ Add Experience"),
    projects: () => draft.projects.map((p, i) => { const b = "projects." + i; const more = [p.overview, p.objective, p.approach, p.workPerformed, (p.links || []).length].some(Boolean);
      return item(b, "title", p.title,
        field(b + ".title", "Title") + field(b + ".category", "Category") + statusSel(b + ".status", p.status) +
        field(b + ".description", "Description", "area") + field(b + ".metrics", "Metrics", "metrics", { hint: "One per line: value | label" }) +
        field(b + ".tools", "Tools", "tags", { hint: "Comma-separated" }) + field(b + ".workflow", "Workflow steps", "lines", { rows: 4, hint: "One step per line" }) +
        field(b + ".findings", "Key findings", "lines", { hint: "One per line" }) +
        `<details class="more" ${more ? "open" : ""}><summary>More fields (shown in project details)</summary>` +
        field(b + ".overview", "Overview", "area") + field(b + ".objective", "Objective", "area") + field(b + ".approach", "Approach / Methodology", "area") +
        field(b + ".workPerformed", "Work performed", "area") + field(b + ".links", "Links", "links", { hint: "One per line: label | https://..." }) + `</details>`); }).join("") + add("add-project", "+ Add Project"),
    education: () => draft.education.map((e, i) => { const b = "education." + i; return item(b, "school", e.school,
      field(b + ".school", "Institution") + field(b + ".degreeName", "Degree") + field(b + ".specialization", "Specialization") + field(b + ".years", "Years") + field(b + ".cgpa", "CGPA")); }).join("") + add("add-education", "+ Add Education"),
    certifications: () => draft.certifications.map((c, i) => { const b = "certifications." + i; return item(b, "name", c.name,
      field(b + ".name", "Certification name") + field(b + ".issuer", "Institution") + field(b + ".year", "Year")); }).join("") + add("add-certification", "+ Add Certification"),
    skills: () => skills.map((r, i) => `<div class="ei skillrow"><div class="ef"><label>Category</label><input data-si="${i}" data-f="name" value="${esc(r.name)}"></div>
      <div class="ef"><label>Emphasis</label><select data-si="${i}" data-f="g"><option value="primary" ${r.g === "primary" ? "selected" : ""}>Main</option><option value="secondary" ${r.g === "secondary" ? "selected" : ""}>Secondary</option></select></div>
      <div class="ef"><label>Skills</label><textarea rows="2" data-si="${i}" data-f="items">${esc((r.items || []).join(", "))}</textarea><small>Comma-separated</small></div>
      <button type="button" class="danger" data-act="del-skill" data-i="${i}">Delete category</button></div>`).join("") + add("add-skill", "+ Add Skill Category")
  };

  function paint() {
    root.querySelectorAll("[data-tab]").forEach(b => b.setAttribute("aria-selected", b.dataset.tab === tab));
    root.querySelector("#edBody").innerHTML = PANES[tab]();
  }

  /* ---------- actions ---------- */
  const NEW = {
    "add-experience": ["experience", () => ({ company: "", department: "", role: "New experience", location: "", start: "", end: "", duration: "", description: "", metrics: [], details: [], workflowLabel: "", workflow: [] })],
    "add-project": ["projects", () => ({ title: "New Project", category: "", status: "Planned", description: "", overview: "", metrics: [], tools: [], workflow: [], objective: "", approach: "", workPerformed: "", findings: [], images: [], documents: [], links: [], placeholders: [] })],
    "add-education": ["education", () => ({ school: "New institution", degree: "", degreeName: "", specialization: "", years: "", cgpa: "", grade: "" })],
    "add-certification": ["certifications", () => ({ name: "New certification", issuer: "", year: "" })]
  };
  const ACTIONS = {
    close: () => close(),
    save() {
      derive(draft);
      try { localStorage.setItem(KEY, JSON.stringify(draft)); } catch (e) { msg("Could not save: browser storage is unavailable."); return; }
      committed = JSON.stringify(draft); dirty = false; apply(draft); msg("Saved in this browser.");
    },
    reset() {
      if (!confirm("Reset all changes and restore the original portfolio data?")) return;
      try { localStorage.removeItem(KEY); } catch (e) {}
      applyData(clone(ORIGINAL_DATA)); render(); committed = JSON.stringify(D); dirty = false; fresh(D); opened.clear(); paint(); msg("Original data restored.");
    },
    export() {
      derive(draft);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" }));
      a.download = "portfolio-data.json"; document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000); msg("Exported portfolio-data.json");
    },
    import: () => root.querySelector("#edFile").click(),
    "add-skill"() { skills.push({ g: "primary", name: "New category", items: [] }); writeSkills(); live(); paint(); },
    "del-skill"(t) {
      const r = skills[+t.dataset.i]; if (!confirm(`Delete the skill category "${r.name}"?`)) return;
      skills.splice(+t.dataset.i, 1); writeSkills(); live(); paint();
    },
    del(t) {
      const [k, i] = t.dataset.path.split("."), it = draft[k][+i];
      if (!confirm(`Delete "${it.title || it.role || it.company || it.school || it.name || "this entry"}"? This cannot be undone.`)) return;
      draft[k].splice(+i, 1); opened.clear(); live(); paint();
    }
  };
  Object.keys(NEW).forEach(a => { ACTIONS[a] = () => { const [k, mk] = NEW[a]; draft[k].push(mk()); opened.add(k + "." + (draft[k].length - 1)); live(); paint(); const d = root.querySelectorAll("details.ei"); d[d.length - 1] && d[d.length - 1].scrollIntoView && d[d.length - 1].scrollIntoView({ block: "nearest" }); }; });

  function importFile(file) {
    const fr = new FileReader();
    fr.onload = () => {
      let p; try { p = JSON.parse(fr.result); } catch (e) { return msg("Import failed: not valid JSON."); }
      const ok = p && p.personal && p.skills && ["experience", "projects", "education", "certifications"].every(k => Array.isArray(p[k]));
      if (!ok) return msg("Import failed: file is not portfolio data.");
      if (!confirm("Replace the current portfolio data with the imported file?")) return;
      fresh(Object.assign(clone(ORIGINAL_DATA), p)); opened.clear(); skills = skillRows(); ACTIONS.save(); paint(); msg("Imported and saved.");
    };
    fr.readAsText(file);
  }

  function open() {
    if (root) return;
    const pj = document.getElementById("overlay"); if (pj) pj.classList.remove("show");
    fresh(D); committed = JSON.stringify(D); dirty = false;
    root = document.createElement("div"); root.className = "editor";
    root.innerHTML = `<div class="ed-panel" role="dialog" aria-modal="true" aria-label="Edit Portfolio">
      <div class="ed-head"><h2>Edit Portfolio</h2><button type="button" class="ed-btn" data-act="close">Close</button></div>
      <p class="ed-note">Changes preview live. Save Changes keeps them in this browser only; use Export to back them up or to update the published site.</p>
      <div class="ed-tabs" role="tablist">${TABS.map(([id, l]) => `<button type="button" role="tab" data-tab="${id}">${l}</button>`).join("")}</div>
      <div class="ed-body" id="edBody"></div>
      <div class="ed-foot"><span id="edMsg" role="status"></span><div class="ed-actions">
        <button type="button" class="ed-btn primary" data-act="save">Save Changes</button><button type="button" class="ed-btn" data-act="reset">Reset Changes</button>
        <button type="button" class="ed-btn" data-act="export">Export Portfolio Data</button><button type="button" class="ed-btn" data-act="import">Import Portfolio Data</button>
        <input type="file" id="edFile" accept=".json,application/json" hidden></div></div></div>`;
    document.body.append(root); document.body.style.overflow = "hidden";
    root.addEventListener("click", e => {
      const t = e.target.closest("[data-act],[data-tab]"); if (!t) return;
      if (t.dataset.tab) { tab = t.dataset.tab; paint(); } else ACTIONS[t.dataset.act](t);
    });
    root.addEventListener("change", e => {
      const el = e.target;
      if (el.id === "edFile") { if (el.files && el.files[0]) importFile(el.files[0]); el.value = ""; return; }
      if (el.dataset.si !== undefined) {
        const r = skills[+el.dataset.si], f = el.dataset.f;
        r[f] = f === "items" ? split(el.value, ",") : el.value.trim();
        writeSkills(); if (f === "g") { skills = skillRows(); paint(); }
      } else if (el.dataset.path) set(draft, el.dataset.path, KINDS[el.dataset.kind].from(el.value));
      else return;
      const d = el.closest("[data-ref]");
      if (d) d.querySelector("summary").textContent = get(draft, d.dataset.ref + "." + d.dataset.lf) || "Untitled";
      live();
    });
    root.addEventListener("toggle", e => { const r = e.target.dataset && e.target.dataset.ref; if (r) e.target.open ? opened.add(r) : opened.delete(r); }, true);
    paint(); root.querySelector("[data-tab]").focus();
  }
  function close() {
    if (!root) return;
    if (dirty) { if (!confirm("Discard unsaved changes?")) return; applyData(JSON.parse(committed)); render(); }
    root.remove(); root = null; document.body.style.overflow = "";
  }

  document.addEventListener("click", e => { if (e.target.closest("[data-edit-open]")) open(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && root) close(); });
  if (location.hash === "#edit") open();
})();
