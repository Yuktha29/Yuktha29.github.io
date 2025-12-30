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

// Tech Stack tabs + search
(function () {
  const tabs = document.querySelectorAll(".tech-tab");
  const panels = document.querySelectorAll(".tech-panel");
  const search = document.getElementById("techSearch");

  if (!tabs.length || !panels.length) return;

  function setActive(cat) {
    tabs.forEach((t) => {
      const on = t.dataset.cat === cat;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });

    panels.forEach((p) => {
      p.classList.toggle("is-active", p.dataset.panel === cat);
    });

    // clear any previous search filtering when switching categories
    if (search) {
      search.value = "";
      panels.forEach((p) => {
        p.querySelectorAll(".tchip").forEach((c) => (c.style.display = ""));
      });
    }
  }

  tabs.forEach((t) => {
    t.addEventListener("click", () => setActive(t.dataset.cat));
  });

  if (search) {
    search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      const activePanel = document.querySelector(".tech-panel.is-active");
      if (!activePanel) return;

      activePanel.querySelectorAll(".tchip").forEach((chip) => {
        const show = chip.textContent.toLowerCase().includes(q);
        chip.style.display = show ? "" : "none";
      });
    });
  }
})();
