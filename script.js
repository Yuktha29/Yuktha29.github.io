const sidebar = document.getElementById("sidebar");
const backdrop = document.getElementById("backdrop");
const openBtn = document.getElementById("openMenuBtn");
const closeBtn = document.getElementById("closeMenuBtn");

function openMenu(){
  sidebar.classList.add("open");
  backdrop.hidden = false;
  openBtn?.setAttribute("aria-expanded", "true");
}

function closeMenu(){
  sidebar.classList.remove("open");
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

// Projects accordion (click to open/close)
(function () {
  const headers = document.querySelectorAll(".proj-header");
  if (!headers.length) return;

  function closeAll(exceptId = null) {
    headers.forEach((btn) => {
      const id = btn.getAttribute("aria-controls");
      const panel = id ? document.getElementById(id) : null;
      const keep = exceptId && id === exceptId;
      if (!panel || keep) return;
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
      closeAll(id);
      btn.setAttribute("aria-expanded", String(!isOpen));
      panel.hidden = isOpen;
    });
  });

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
