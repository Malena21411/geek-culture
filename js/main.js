// js/main.js
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const toggle = document.getElementById("themeToggle");
  const year = document.getElementById("year");

  // Mostrar año automáticamente
  if (year) year.textContent = new Date().getFullYear();

  // Cargar modo guardado o por defecto
  const saved = localStorage.getItem("gc-theme");
  if (saved === "light") {
    body.classList.remove("dark");
    body.classList.add("light");
    toggle.textContent = "🌞";
  } else {
    body.classList.add("dark");
    toggle.textContent = "🌙";
  }

  // Cambiar tema al hacer clic
  toggle.addEventListener("click", () => {
    const isLight = body.classList.toggle("light");
    body.classList.toggle("dark", !isLight);
    toggle.textContent = isLight ? "🌞" : "🌙";
    localStorage.setItem("gc-theme", isLight ? "light" : "dark");
  });

  /* ============================
      MODAL DESTACADOS
  ==============================*/
  const cards = document.querySelectorAll(".cards .card");
  const modal = document.getElementById("modal");
  const modalContent = modal ? modal.querySelector(".modal-content") : null;

  if (cards && modal && modalContent) {
    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        e.preventDefault();

        const href = card.getAttribute("href") || "";
        const targetId = href.startsWith("#") ? href.slice(1) : href;

        const template = document.getElementById("modal-" + targetId);
        if (!template) return;

        modalContent.innerHTML = template.innerHTML;

        modal.classList.add("show");
        body.classList.add("modal-open");
      });
    });

    // Cerrar modal clickeando fuera
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
        body.classList.remove("modal-open");
      }
    });

    // Cerrar con ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("show")) {
        modal.classList.remove("show");
        body.classList.remove("modal-open");
      }
    });
  }
});
/* ============================= */
/*    CAROUSEL — NEON GALLERY    */
/* ============================= */

const slides = document.querySelectorAll(".gc-slide");
const dotsContainer = document.querySelector(".gc-dots");
let index = 0;

// Crear dots
slides.forEach((_, i) => {
  let dot = document.createElement("span");
  dot.addEventListener("click", () => showSlide(i));
  dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll("span");

function showSlide(i) {
  index = i;

  slides.forEach((s, n) => {
    s.classList.remove("active");
    dots[n].classList.remove("active");
  });

  slides[index].classList.add("active");
  dots[index].classList.add("active");
}

document.querySelector(".gc-prev").addEventListener("click", () => {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
});
document.querySelector(".gc-next").addEventListener("click", () => {
  index = (index + 1) % slides.length;
  showSlide(index);
});

// Inicio automático
showSlide(0);
setInterval(() => {
  index = (index + 1) % slides.length;
  showSlide(index);
}, 4500);
