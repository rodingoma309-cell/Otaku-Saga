// Script commun pour le menu hamburger sur toutes les pages
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("hamburgerBtn");
  const menu = document.getElementById("navMenu");

  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    menu.classList.toggle("open");
    btn.classList.toggle("is-active");
  });

  // fermer le menu quand on clique sur un lien (mobile)
  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      menu.classList.remove("open");
      btn.classList.remove("is-active");
    });
  });
});
