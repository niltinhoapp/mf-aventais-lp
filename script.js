// =====================
// WhatsApp config
// =====================
const PHONE = "5517981167666";
const DEFAULT_TEXT = "Olá! Gostaria de fazer um orçamento de aventais personalizados (atacado/varejo).";

function waLink(text = DEFAULT_TEXT) {
  const msg = encodeURIComponent(text);
  return `https://wa.me/${PHONE}?text=${msg}`;
}

// aplica link em CTAs
["ctaTop", "ctaHero", "ctaBenefits", "ctaGallery", "ctaFinal", "waFloat"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.setAttribute("href", waLink());
});

// texto mais “forte” no botão principal do hero
const heroCTA = document.getElementById("ctaHero");
if (heroCTA) {
  heroCTA.addEventListener("click", () => {
    heroCTA.setAttribute(
      "href",
      waLink("Olá! Quero fazer orçamento. Pode me enviar modelos, personalização e valores (atacado/varejo)?")
    );
  });
}

// =====================
// WhatsApp flutuante: sobe perto do rodapé (sempre visível)
// =====================
const wa = document.getElementById("waFloat");
const footerEl = document.querySelector(".footer");

if (wa && footerEl) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) wa.classList.add("lift");
      else wa.classList.remove("lift");
    });
  }, { threshold: 0.05 });

  obs.observe(footerEl);
}

// =====================
// HERO CAROUSEL
// =====================
const carousel = document.querySelector(".heroCarousel");
const slides = Array.from(document.querySelectorAll(".heroCarousel__slide"));
const dots = Array.from(document.querySelectorAll(".dotBtn"));
const prevBtn = document.querySelector(".heroCarousel__nav--prev");
const nextBtn = document.querySelector(".heroCarousel__nav--next");

let current = 0;
let timer = null;
const INTERVAL = 4500;

function setActive(index) {
  if (!slides.length) return;
  current = (index + slides.length) % slides.length;

  slides.forEach((s) => s.classList.remove("is-active"));
  dots.forEach((d) => d.classList.remove("is-active"));

  slides[current].classList.add("is-active");
  if (dots[current]) dots[current].classList.add("is-active");
}

function startAuto() {
  stopAuto();
  if (slides.length <= 1) return;
  timer = setInterval(() => setActive(current + 1), INTERVAL);
}

function stopAuto() {
  if (timer) clearInterval(timer);
  timer = null;
}

// Botões
if (prevBtn) prevBtn.addEventListener("click", () => { setActive(current - 1); startAuto(); });
if (nextBtn) nextBtn.addEventListener("click", () => { setActive(current + 1); startAuto(); });

// Dots
dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const i = Number(dot.dataset.dot);
    setActive(i);
    startAuto();
  });
});

// Pausa hover/focus
if (carousel) {
  carousel.addEventListener("mouseenter", stopAuto);
  carousel.addEventListener("mouseleave", startAuto);
  carousel.addEventListener("focusin", stopAuto);
  carousel.addEventListener("focusout", startAuto);
}

// Swipe mobile
let startX = 0;
let startY = 0;
let isSwiping = false;

if (carousel) {
  carousel.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    isSwiping = true;
    stopAuto();
  }, { passive: true });

  carousel.addEventListener("touchmove", (e) => {
    if (!isSwiping) return;
    const t = e.touches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;

    // se estiver rolando a página (vertical), não é swipe
    if (Math.abs(dy) > Math.abs(dx)) {
      isSwiping = false;
      startAuto();
    }
  }, { passive: true });

  carousel.addEventListener("touchend", (e) => {
    if (!isSwiping) return;
    isSwiping = false;

    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;

    if (Math.abs(dx) > 40) {
      if (dx < 0) setActive(current + 1);
      else setActive(current - 1);
    }
    startAuto();
  }, { passive: true });
}

// init carrossel
setActive(0);
startAuto();

// =====================
// VIDEO MODAL
// =====================
const modal = document.getElementById("videoModal");
const player = document.getElementById("videoPlayer");

function openVideo(src){
  if (!modal || !player) return;
  player.src = src;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  player.play().catch(() => {});
}

function closeVideo(){
  if (!modal || !player) return;
  player.pause();
  player.removeAttribute("src");
  player.load();
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

document.querySelectorAll(".videoCard__thumb").forEach((btn) => {
  btn.addEventListener("click", () => {
    const src = btn.getAttribute("data-video");
    if (src) openVideo(src);
  });
});

document.querySelectorAll("[data-close='1']").forEach((el) => {
  el.addEventListener("click", closeVideo);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeVideo();
});
