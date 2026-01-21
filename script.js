/* =========================================================
   CONFIGURAÇÃO CENTRAL (WHATSAPP + CONVERSÃO)
========================================================= */
const CONFIG = {
  whatsapp: {
    phone: "5517981167666",
    defaultText:
      "Olá! Gostaria de fazer um orçamento de aventais personalizados (atacado/varejo).",
    heroText:
      "Olá! Quero fazer um orçamento de aventais personalizados. Pode me enviar modelos, personalização e valores?",
  },
  googleAds: {
    sendTo: "AW-XXXXXXXXXX/CONVERSION_LABEL", // TROCAR
  },
};

/* =========================================================
   HELPERS
========================================================= */
function waLink(text = CONFIG.whatsapp.defaultText) {
  return `https://wa.me/${CONFIG.whatsapp.phone}?text=${encodeURIComponent(
    text
  )}`;
}

function trackMetaLead(source) {
  try {
    if (window.fbq) {
      fbq("track", "Lead", { source });
    }
  } catch (_) {}
}

function trackGoogleConversion() {
  try {
    if (window.gtag) {
      gtag("event", "conversion", {
        send_to: CONFIG.googleAds.sendTo,
      });
    }
  } catch (_) {}
}

/* =========================================================
   APLICAR WHATSAPP EM TODOS OS CTAs
========================================================= */
const CTA_IDS = [
  "ctaTop",
  "ctaHero",
  "ctaBenefits",
  "ctaGallery",
  "ctaFinal",
  "ctaSpotlight",
  "waFloat",
];

CTA_IDS.forEach((id) => {
  const el = document.getElementById(id);
  if (!el) return;

  el.href = waLink();

  el.addEventListener(
    "click",
    () => {
      trackMetaLead(id);
      trackGoogleConversion();
    },
    { passive: true }
  );
});

/* Texto mais forte no CTA principal do HERO */
const heroCTA = document.getElementById("ctaHero");
if (heroCTA) {
  heroCTA.addEventListener(
    "click",
    () => {
      heroCTA.href = waLink(CONFIG.whatsapp.heroText);
    },
    { passive: true }
  );
}

/* =========================================================
   WHATSAPP FLUTUANTE (NÃO COBRE RODAPÉ)
========================================================= */
const waFloat = document.getElementById("waFloat");
const footer = document.querySelector(".footer");

function updateWaLift() {
  if (!waFloat || !footer) return;
  const h = waFloat.getBoundingClientRect().height;
  waFloat.style.setProperty("--lift", `${h + 20}px`);
}

if (waFloat && footer) {
  updateWaLift();
  window.addEventListener("resize", updateWaLift);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        waFloat.classList.toggle("lift", entry.isIntersecting);
      });
    },
    { threshold: 0.01 }
  );

  observer.observe(footer);
}

/* =========================================================
   HERO CAROUSEL
========================================================= */
const carousel = document.querySelector(".heroCarousel");
const slides = Array.from(document.querySelectorAll(".heroCarousel__slide"));
const dots = Array.from(document.querySelectorAll(".dotBtn"));
const prevBtn = document.querySelector(".heroCarousel__nav--prev");
const nextBtn = document.querySelector(".heroCarousel__nav--next");

let current = 0;
let autoTimer = null;
const INTERVAL = 4500;

function showSlide(index) {
  if (!slides.length) return;

  current = (index + slides.length) % slides.length;

  slides.forEach((s) => s.classList.remove("is-active"));
  dots.forEach((d) => d.classList.remove("is-active"));

  slides[current].classList.add("is-active");
  dots[current]?.classList.add("is-active");
}

function startAuto() {
  stopAuto();
  if (slides.length > 1) {
    autoTimer = setInterval(() => showSlide(current + 1), INTERVAL);
  }
}

function stopAuto() {
  if (autoTimer) clearInterval(autoTimer);
  autoTimer = null;
}

/* Navegação */
prevBtn?.addEventListener("click", () => {
  showSlide(current - 1);
  startAuto();
});

nextBtn?.addEventListener("click", () => {
  showSlide(current + 1);
  startAuto();
});

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showSlide(Number(dot.dataset.dot));
    startAuto();
  });
});

/* Pausa quando interagir */
carousel?.addEventListener("mouseenter", stopAuto);
carousel?.addEventListener("mouseleave", startAuto);
carousel?.addEventListener("focusin", stopAuto);
carousel?.addEventListener("focusout", startAuto);

/* Swipe mobile */
let startX = 0;
let startY = 0;
let swiping = false;

carousel?.addEventListener(
  "touchstart",
  (e) => {
    const t = e.touches[0];
    startX = t.clientX;
    startY = t.clientY;
    swiping = true;
    stopAuto();
  },
  { passive: true }
);

carousel?.addEventListener(
  "touchmove",
  (e) => {
    if (!swiping) return;
    const t = e.touches[0];
    if (Math.abs(t.clientY - startY) > Math.abs(t.clientX - startX)) {
      swiping = false;
      startAuto();
    }
  },
  { passive: true }
);

carousel?.addEventListener(
  "touchend",
  (e) => {
    if (!swiping) return;
    swiping = false;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) {
      dx < 0 ? showSlide(current + 1) : showSlide(current - 1);
    }
    startAuto();
  },
  { passive: true }
);

/* Init */
showSlide(0);
startAuto();

/* =========================================================
   MODAL DE VÍDEO
========================================================= */
const modal = document.getElementById("videoModal");
const player = document.getElementById("videoPlayer");

function openVideo(src) {
  if (!modal || !player) return;
  player.src = src;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  player.play().catch(() => {});
}

function closeVideo() {
  if (!modal || !player) return;
  player.pause();
  player.removeAttribute("src");
  player.load();
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

/* Abrir vídeo */
document.querySelectorAll(".videoCard__thumb").forEach((btn) => {
  btn.addEventListener("click", () => {
    const src = btn.dataset.video;
    if (src) openVideo(src);
  });
});

/* Fechar modal */
document.querySelectorAll("[data-close='1']").forEach((el) => {
  el.addEventListener("click", closeVideo);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeVideo();
});
