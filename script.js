const sidebar = document.getElementById("sidebar");
const backdrop = document.getElementById("backdrop");
const openBtn = document.getElementById("openMenuBtn");
const closeBtn = document.getElementById("closeMenuBtn");

function openMenu() {
  sidebar.classList.add("open");
  backdrop.hidden = false;
  backdrop.classList.add("show");
  openBtn?.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  sidebar.classList.remove("open");
  backdrop.classList.remove("show");
  backdrop.hidden = true;
  openBtn?.setAttribute("aria-expanded", "false");
}

openBtn?.addEventListener("click", openMenu);
closeBtn?.addEventListener("click", closeMenu);
backdrop?.addEventListener("click", closeMenu);

document.querySelectorAll(".nav-item").forEach((a) => {
  a.addEventListener("click", () => {
    if (window.innerWidth <= 760) closeMenu();
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

/* Pixie dust sparkles on nav hover */
const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

function rand(min, max){ return Math.random() * (max - min) + min; }

function makeSparkle(target, x, y){
  if (reduceMotion) return;

  const s = document.createElement("span");
  s.className = "sparkle";

  // random drift
  s.style.setProperty("--dx", `${rand(-16, 16)}px`);
  s.style.setProperty("--dy", `${rand(-18, 10)}px`);

  // color variation using your palette
  const colors = ["#B0C4B1", "#DEDBD2", "#4A5759"];
  const c = colors[Math.floor(Math.random() * colors.length)];
  s.style.background = c;

  s.style.left = `${x}px`;
  s.style.top = `${y}px`;

  target.appendChild(s);

  // cleanup
  setTimeout(() => s.remove(), 700);
}

// throttle sparkles so it doesn't spam
let lastSparkleAt = 0;

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("mousemove", (e) => {
    const now = performance.now();
    if (now - lastSparkleAt < 45) return; // throttle
    lastSparkleAt = now;

    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // create 1–2 sparkles per tick
    makeSparkle(item, x, y);
    if (Math.random() < 0.35) makeSparkle(item, x + rand(-8, 8), y + rand(-6, 6));
  });
});
// Experiences accordion (click to open/close)
(function () {
  const headers = document.querySelectorAll(".exp-header");
  if (!headers.length) return;

  function closeAll(exceptId = null) {
    headers.forEach((btn) => {
      const id = btn.getAttribute("aria-controls");
      const panel = id ? document.getElementById(id) : null;
      const shouldKeepOpen = exceptId && id === exceptId;

      if (!panel) return;

      if (shouldKeepOpen) return;

      btn.setAttribute("aria-expanded", "false");
      panel.hidden = true;
    });
  }

  headers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("aria-controls");
      const panel = id ? document.getElementById(id) : null;
      if (!panel) return;

      const isOpen = btn.getAttribute("aria-expanded") === "true";

      // accordion behavior: close others
      closeAll(id);

      // toggle current
      btn.setAttribute("aria-expanded", String(!isOpen));
      panel.hidden = isOpen;
    });
  });

  // Footer year (nice touch)
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

// Projects: only one open at a time
// Projects: only one open at a time
(function () {
  const headers = document.querySelectorAll(".proj-header");
  if (!headers.length) return;

  function closeAll() {
    headers.forEach((btn) => {
      const id = btn.getAttribute("aria-controls");
      const panel = id ? document.getElementById(id) : null;
      btn.setAttribute("aria-expanded", "false");
      if (panel) panel.hidden = true;
    });
  }

  headers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("aria-controls");
      const panel = id ? document.getElementById(id) : null;
      if (!panel) return;

      const isOpen = btn.getAttribute("aria-expanded") === "true";

      closeAll();                 
      if (!isOpen) {              
        btn.setAttribute("aria-expanded", "true");
        panel.hidden = false;
      }
    });
  });

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();


function setActiveNavByPage() {
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  document.querySelectorAll(".nav-item").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();

    // Only auto-activate real page links
    if (href.endsWith(".html")) {
      const target = href.split("/").pop();
      a.classList.toggle("active", target === current);
    } else {
      a.classList.remove("active");
    }
  });

  // Optional: set mobile topbar title from active nav text
  const activeText = document.querySelector(".nav-item.active span:last-child")?.textContent?.trim();
  if (activeText) {
    const topbarTitle = document.querySelector(".topbar-title");
    if (topbarTitle) topbarTitle.textContent = activeText;
  }
}

document.addEventListener("DOMContentLoaded", setActiveNavByPage);

// Tech Stack tabs (active + swap skills)
(function () {
  const tabs = document.querySelectorAll(".tech-tab");
  const title = document.querySelector(".tech-card-title");
  const grid = document.querySelector(".tech-skill-grid");

  if (!tabs.length || !title || !grid) return;

  const data = {
    frontend: { icon: "<>", label: "Frontend Skills", skills: ["React","TypeScript","Next.js","Tailwind CSS","HTML/CSS","JavaScript","Vue.js","Redux"] },
    backend:  { icon: "🗄️", label: "Backend Skills",  skills: ["Python","Flask","Node.js","PHP","REST APIs","Auth","Microservices","ML Pipelines"] },
    database: { icon: "🛢️", label: "Database Skills", skills: ["PostgreSQL","SQL","BCNF","Indexing","EXPLAIN ANALYZE","Query Optimization","Data Modeling","Transactions"] },
    cloud:    { icon: "☁️", label: "Cloud & DevOps",   skills: ["AWS EC2","Docker","GitHub Actions","CI/CD","Linux","Monitoring","Deployments","Networking"] },
    tools:    { icon: "🛠️", label: "Tools",           skills: ["Git","GitHub","Jira","Trello","VS Code","Figma","Postman","Notion"] },
    mobile:   { icon: "📱", label: "Mobile",          skills: ["React Native","Mobile UI","APIs","State Mgmt"] },
  };

  function render(cat){
    const d = data[cat];
    if (!d) return;

    title.innerHTML = `<span class="tech-card-ico">${d.icon}</span> ${d.label}`;
    grid.innerHTML = d.skills.map(s => `<div class="tech-skill">${s}</div>`).join("");
  }

  tabs.forEach((t) => {
    t.addEventListener("click", () => {
      tabs.forEach(x => x.classList.remove("active"));
      t.classList.add("active");
      render(t.dataset.cat);
    });
  });

  // initial render based on active tab
  const first = document.querySelector(".tech-tab.active") || tabs[0];
  if (first) render(first.dataset.cat);
})();

(function () {
  const body = document.body;
  const toggleBtn = document.getElementById("sidebarToggle");
  const ropePath = document.getElementById("ropePath");
  const mascot = document.querySelector(".mascot");
  const sidebar = document.getElementById("sidebar");

  if (!toggleBtn || !ropePath || !mascot || !sidebar) return;

  // Persist state
  const saved = localStorage.getItem("sidebarCollapsed");
  if (saved === "1") body.classList.add("sidebar-collapsed");

  // Helpers
  const lerp = (a, b, t) => a + (b - a) * t;

  function getPoint(el, offsetX = 0.75, offsetY = 0.65) {
    const r = el.getBoundingClientRect();
    // point in sidebar-local coordinates (top-left of sidebar header area)
    const sidebarRect = sidebar.getBoundingClientRect();
    return {
      x: (r.left - sidebarRect.left) + r.width * offsetX,
      y: (r.top - sidebarRect.top) + r.height * offsetY,
    };
  }

  // Rope endpoints (start = mascot hand-ish, end = either hanging or button)
  let currentEnd = null;
  let targetEnd = null;

  function setRope(start, end, sag = 18) {
    // simple quadratic curve with sag
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2 + sag;
    ropePath.setAttribute(
      "d",
      `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${end.x.toFixed(1)} ${end.y.toFixed(1)}`
    );
  }

  function computeStart() {
    // adjust these if you want the rope to originate from a specific spot on the GIF
    return getPoint(mascot, 0.80, 0.70);
  }

  function computeHangingEnd() {
    // “hanging” target: somewhere below/right in header area
    const baseX = body.classList.contains("sidebar-collapsed") ? 55 : 140;
    return { x: baseX, y: 120 };
  }

  function computeButtonEnd() {
    return getPoint(toggleBtn, 0.50, 0.50);
  }

  // Smoothly animate rope end toward target
  let raf = null;
  function animateRope() {
    const start = computeStart();
    if (!currentEnd) currentEnd = computeHangingEnd();
    if (!targetEnd) targetEnd = computeHangingEnd();

    currentEnd = {
      x: lerp(currentEnd.x, targetEnd.x, 0.18),
      y: lerp(currentEnd.y, targetEnd.y, 0.18),
    };

    const pulling = body.classList.contains("rope-pulling");
    const sag = pulling ? 6 : 22;

    setRope(start, currentEnd, sag);

    raf = requestAnimationFrame(animateRope);
  }

  // Start rope loop
  animateRope();
  window.addEventListener("resize", () => {
    // snap a bit on resize so it doesn’t drift weird
    currentEnd = body.classList.contains("rope-pulling") ? computeButtonEnd() : computeHangingEnd();
  });

  function doPullAnimationAndToggle() {
    // Rope shoots to button, then sidebar collapses/opens
    body.classList.add("rope-pulling");
    targetEnd = computeButtonEnd();

    // After the rope "connects", toggle the sidebar width
    setTimeout(() => {
      const isCollapsed = body.classList.toggle("sidebar-collapsed");
      localStorage.setItem("sidebarCollapsed", isCollapsed ? "1" : "0");
      toggleBtn.setAttribute("aria-pressed", isCollapsed ? "true" : "false");
    }, 220);

    // Let rope relax back to hanging after the sidebar finishes moving
    setTimeout(() => {
      body.classList.remove("rope-pulling");
      targetEnd = computeHangingEnd();
    }, 720);
  }

  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    doPullAnimationAndToggle();
  });
})();
