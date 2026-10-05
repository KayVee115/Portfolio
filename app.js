/* Rendering code. Content lives in js/data.js (PORTFOLIO_DATA). */
/* ===================== PRESENTATION (renders from PORTFOLIO_DATA) ===================== */
const D = PORTFOLIO_DATA;
/* Edit Portfolio support: keep the original, and load any edits saved in this browser (see js/editor.js) */
const ORIGINAL_DATA = JSON.parse(JSON.stringify(PORTFOLIO_DATA));
function applyData(n) { Object.keys(D).forEach(k => delete D[k]); Object.assign(D, n); }
try { const sv = localStorage.getItem("portfolio_data_v1"); if (sv) { const p = JSON.parse(sv); if (p && p.personal && Array.isArray(p.projects)) applyData(Object.assign(JSON.parse(JSON.stringify(ORIGINAL_DATA)), p)); } } catch (e) {}
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const NAV = [["Home","home"],["About","about"],["Experience","experience"],["Projects","projects"],["Skills","skills"],["Education","education"],["Contact","contact"]];

const SectionHeading = (title, sub) => `<div class="sec-head"><h2>${esc(title)}</h2>${sub ? `<p>${esc(sub)}</p>` : ""}</div>`;
const Section = (id, body, cls = "") => `<section id="${id}" class="${cls}"><div class="wrap fade">${body}</div></section>`;
const Workflow = (label, steps) => !steps || !steps.length ? "" :
  `<p class="wf-title">${esc(label)}</p><ol class="wf">${steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol>`;
const Metrics = list => !list || !list.length ? "" : `<div class="metrics">${list.map(m => `<div class="metric"><b>${esc(m.value)}</b><span>${esc(m.label)}</span></div>`).join("")}</div>`;

const Hero = p => `<div class="hero"><h1>${esc(p.name)}</h1><p class="headline">${esc(p.headline)}</p>
  <p class="lead">${esc(p.tagline)}</p><p class="loc">${esc(p.location)}</p>
  <div class="btns"><a class="btn primary" href="#projects">View My Work</a><a class="btn ghost" href="#contact">Let's Connect</a></div></div>`;

const ExperienceCard = e => `<article class="card exp"><h3>${esc(e.role)}</h3>
  <p class="co">${esc(e.company)}</p>
  <p class="meta">${esc([e.department, e.location, e.duration].filter(Boolean).join(", "))}</p>
  ${e.description ? `<p>${esc(e.description)}</p>` : ""}
  ${Metrics(e.metrics)}<ul>${(e.details || []).map(d => `<li>${esc(d)}</li>`).join("")}</ul>
  ${Workflow(e.workflowLabel, e.workflow)}</article>`;

const StatusTag = p => !p.status ? "" : `<span class="tag status ${p.status === "In Progress" ? "wip" : (p.status === "Completed" ? "" : "muted")}">${esc(p.status === "In Progress" ? "Currently in progress" : p.status)}</span>`;
const ProjectCard = (p, i) => `<article class="card proj">
  <div>${StatusTag(p)}<span class="tag">${esc(p.category)}</span></div>
  <h3>${esc(p.title)}</h3><p class="desc">${esc(p.description)}</p>
  ${p.metrics && p.metrics.length ? `<div class="mini">${p.metrics.map(m => `<div><b>${esc(m.value)}</b>${esc(m.label)}</div>`).join("")}</div>` : ""}
  ${p.tools && p.tools.length ? `<p class="tools">Tools: ${p.tools.map(esc).join(", ")}</p>` : ""}
  <button class="btn ghost" data-project="${i}">View Project</button></article>`;

const ProjectDetails = p => {
  const sec = (t, html) => html ? `<h4>${t}</h4>${html}` : "";
  const para = x => x ? `<p>${esc(x)}</p>` : "";
  const has = a => a && a.length;
  const ev = [
    ...(p.images || []).map(im => `<div><img src="${esc(im.src)}" alt="${esc(im.caption || p.title)}">${im.caption ? `<small>${esc(im.caption)}</small>` : ""}</div>`),
    ...[...(p.documents || []), ...(p.links || [])].map(d => `<div><a href="${esc(d.url)}" target="_blank" rel="noopener">${esc(d.label)}</a></div>`),
    ...(p.placeholders || []).map(x => `<div>${esc(x)}<small>To be added</small></div>`)
  ];
  const evidence = `<details class="evidence"><summary>Project Evidence</summary>${ev.length ? `<div class="ph">${ev.join("")}</div>` : ""}
    <p class="meta">Images, screenshots, charts, PDFs, reports, dashboards and project outputs can be added here.</p></details>`;
  return `<div class="pd"><button class="close" id="closeBtn">Close</button>
   ${StatusTag(p)}<span class="tag">${esc(p.category)}</span>
   <h2>${esc(p.title)}</h2>
   ${sec("Overview", para(p.overview || p.description))}${sec("Objective", para(p.objective))}${sec("Approach / Methodology", para(p.approach))}${sec("Work Performed", para(p.workPerformed))}
   ${has(p.workflow) || has(p.metrics) ? `<h4>Analysis / Output</h4>${Metrics(p.metrics)}${Workflow("Project workflow", p.workflow)}` : ""}
   ${sec("Key Findings", has(p.findings) ? `<ul>${p.findings.map(f => `<li>${esc(f)}</li>`).join("")}</ul>` : "")}
   ${sec("Tools Used", has(p.tools) ? `<ul class="chips">${p.tools.map(t => `<li>${esc(t)}</li>`).join("")}</ul>` : "")}
   <h4>Supporting Materials</h4>${evidence}</div>`;
};

const SkillCategory = (name, items, cls = "") => `<div class="card skill ${cls}"><h3>${esc(name)}</h3><ul class="chips">${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul></div>`;
const EducationEntry = e => `<div class="entry"><div><h3>${esc(e.school)}</h3><p>${esc(e.degree)}</p></div><div class="when">${esc(e.years)}<br>${esc(e.grade)}</div></div>`;
const LeadershipEntry = l => `<div class="entry"><div><h3>${esc(l.title)}</h3><p>${esc(l.org)}</p></div><div class="when">${esc(l.years)}</div></div>`;
const CertEntry = c => `<div class="entry"><div><h3>${esc(c.name)}</h3>${c.issuer ? `<p>${esc(c.issuer)}</p>` : ""}</div><div class="when">${esc(c.year)}</div></div>`;
const Contact = c => `<div class="card contact"><h2>${esc(c.heading)}</h2><p>${esc(c.text)}</p>
  <a class="big" href="mailto:${esc(c.email)}">${esc(c.email)}</a>
  <a class="big" href="${esc(c.linkedin)}" target="_blank" rel="noopener">${esc(c.linkedin)}</a></div>`;
const FocusStrip = items => `<ul class="strip" aria-label="Focus areas">${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>`;

function render() {
  document.getElementById("brand").textContent = D.personal.name;
  document.getElementById("links").innerHTML = NAV.map(([l, id]) => `<li><a href="#${id}">${l}</a></li>`).join("");
  document.getElementById("app").innerHTML =
    Section("home", Hero(D.personal), "") +
    Section("about", SectionHeading("About Me") + `<div class="about"><p>${esc(D.about.summary)}</p>${FocusStrip(D.about.focus)}</div>`) +
    Section("experience", SectionHeading("Professional Experience") + D.experience.map(ExperienceCard).join("")) +
    Section("projects", SectionHeading("Projects", "Select a project to explore the details.") + `<div class="grid">${D.projects.map(ProjectCard).join("")}</div>`) +
    Section("skills", SectionHeading("Skills") + `<div class="cols primary">${Object.entries(D.skills.primary).map(([n, i]) => SkillCategory(n, i, "main")).join("")}</div><div class="cols secondary">${Object.entries(D.skills.secondary).map(([n, i]) => SkillCategory(n, i, "minor")).join("")}</div>`) +
    Section("education", SectionHeading("Education") + `<div class="card">${D.education.map(EducationEntry).join("")}</div>` +
      (D.leadership.length ? `<h3 class="sub">Leadership & Positions of Responsibility</h3><div class="card">${D.leadership.map(LeadershipEntry).join("")}</div>` : "") +
      (D.certifications.length ? `<h3 class="sub">Certifications</h3><div class="card">${D.certifications.map(CertEntry).join("")}</div>` : "")) +
    Section("contact", Contact(D.contact));
  document.getElementById("foot").innerHTML = `<div class="foot-row"><span>\u00A9 ${new Date().getFullYear()} ${esc(D.personal.name)}</span><button type="button" class="edit-link" data-edit-open>Edit Portfolio</button></div>`;
  document.title = D.personal.name + " | " + D.personal.headline.replace("MBA | ", "MBA, ");
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .08 });
  document.querySelectorAll(".fade").forEach(el => io.observe(el));
}
render();

/* behaviour */
const links = document.getElementById("links"), btn = document.getElementById("menuBtn");
btn.onclick = () => { const o = links.classList.toggle("open"); btn.setAttribute("aria-expanded", o); };
links.addEventListener("click", () => { links.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); });
const ov = document.getElementById("overlay"), md = document.getElementById("modal");
let lastFocus;
function closeProject() { ov.classList.remove("show"); document.body.style.overflow = ""; lastFocus && lastFocus.focus(); }
document.addEventListener("click", e => {
  const c = e.target.closest("[data-project]");
  if (c) { lastFocus = c; md.innerHTML = ProjectDetails(D.projects[+c.dataset.project]); ov.classList.add("show"); ov.scrollTop = 0; document.body.style.overflow = "hidden"; document.getElementById("closeBtn").focus(); }
  else if (e.target.id === "closeBtn" || e.target === ov) closeProject();
});
document.addEventListener("keydown", e => { if (e.key === "Escape" && ov.classList.contains("show")) closeProject(); });
