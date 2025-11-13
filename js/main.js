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
});
