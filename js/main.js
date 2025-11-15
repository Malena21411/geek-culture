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

/* ============================= */
/*       REPRODUCTOR MÚSICA      */
/* ============================= */

// Catálogo de temas
const tracks = [
  { title: "Turururu Turururu", file: "music/musica.mp3" },
  { title: "Star Man",       file: "music/musica2.mp3" },
  { title: "Te habia olvidado",     file: "music/musica3.mp3" }
  // Agregá más si querés
];

let currentTrackIndex = 0;
let isPlaying = false;

const audio      = new Audio();
audio.loop       = false;
audio.volume     = 0.5;

// Elementos del DOM
const mpTitle    = document.getElementById("mp-title");
const mpPlayBtn  = document.getElementById("mp-play");
const mpPrevBtn  = document.getElementById("mp-prev");
const mpNextBtn  = document.getElementById("mp-next");
const mpSeek     = document.getElementById("mp-seek");
const mpCurrent  = document.getElementById("mp-current");
const mpDuration = document.getElementById("mp-duration");
const mpVolume   = document.getElementById("mp-volume");
const mpPlaylist = document.getElementById("mp-playlist");

// Playlist desplegable
const mfToggleList = document.getElementById("mfToggleList");

// Botón del header = mute global
const musicBtnHeader = document.getElementById("musicToggle");
let headerMuted = false;

// Rellenar la playlist
if (mpPlaylist) {
  tracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.textContent = track.title;
    li.dataset.index = index;
    li.classList.add("mf-item");
    li.addEventListener("click", () => {
      loadTrack(index);
      playTrack();
    });
    mpPlaylist.appendChild(li);
  });
}

function highlightActiveTrack() {
  if (!mpPlaylist) return;
  const items = mpPlaylist.querySelectorAll(".mf-item");
  items.forEach((item, i) => {
    item.classList.toggle("active", i === currentTrackIndex);
  });
}

function loadTrack(index) {
  currentTrackIndex = index;
  const track = tracks[currentTrackIndex];
  audio.src = track.file;
  if (mpTitle) mpTitle.textContent = track.title;
  highlightActiveTrack();
}

function playTrack() {
  audio.play();
  isPlaying = true;
  if (mpPlayBtn) mpPlayBtn.textContent = "⏸";
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  if (mpPlayBtn) mpPlayBtn.textContent = "▶";
}

// Controles principales
if (mpPlayBtn) {
  mpPlayBtn.addEventListener("click", () => {
    if (!audio.src) loadTrack(currentTrackIndex);
    isPlaying ? pauseTrack() : playTrack();
  });
}

if (mpPrevBtn) {
  mpPrevBtn.addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    playTrack();
  });
}

if (mpNextBtn) {
  mpNextBtn.addEventListener("click", () => {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    playTrack();
  });
}

// Auto siguiente tema al terminar
audio.addEventListener("ended", () => {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(currentTrackIndex);
  playTrack();
});

// Formatear tiempo
function formatTime(sec) {
  const m = Math.floor(sec / 60) || 0;
  const s = Math.floor(sec % 60) || 0;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Actualizar barra de progreso
audio.addEventListener("timeupdate", () => {
  if (!mpSeek || !mpCurrent || !mpDuration) return;
  const current = audio.currentTime;
  const duration = audio.duration || 0;

  mpCurrent.textContent = formatTime(current);
  mpDuration.textContent = duration ? formatTime(duration) : "0:00";

  if (duration) {
    mpSeek.value = (current / duration) * 100;
  }
});

// Buscar con el range
if (mpSeek) {
  mpSeek.addEventListener("input", () => {
    if (!audio.duration) return;
    const newTime = (mpSeek.value / 100) * audio.duration;
    audio.currentTime = newTime;
  });
}

// Volumen
if (mpVolume) {
  mpVolume.addEventListener("input", () => {
    audio.volume = mpVolume.value;
  });
}

// Mute/unmute global desde el botón del header
if (musicBtnHeader) {
  musicBtnHeader.addEventListener("click", () => {
    headerMuted = !headerMuted;
    audio.muted = headerMuted;
    musicBtnHeader.textContent = headerMuted ? "🔇" : "🎵";
  });
}

// Mostrar / ocultar playlist
if (mfToggleList) {
  mfToggleList.addEventListener("click", () => {
    document.querySelector(".mf-playlist-wrap")
      .classList.toggle("open");
  });
}

// Cargar primera pista sin reproducir
if (tracks.length > 0) {
  loadTrack(0);
}

