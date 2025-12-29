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

// Close drawer when a nav link is clicked (mobile)
document.querySelectorAll(".nav-item").forEach((a) => {
  a.addEventListener("click", () => {
    if (window.innerWidth <= 760) closeMenu();
  });
});

// Close on Esc
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});
