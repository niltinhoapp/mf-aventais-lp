// =====================
// CONFIGURAÇÃO WHATSAPP
// =====================
const PHONE = "5517981167666";
const MESSAGE =
  "Olá! Quero fazer um orçamento de aventais personalizados (atacado/varejo).";

function waLink() {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;
}

// aplica WhatsApp em todos os CTAs
document.querySelectorAll("[data-wa]").forEach((el) => {
  el.setAttribute("href", waLink());
  el.setAttribute("target", "_blank");
});

// =====================
// MODAL DE VÍDEO (simples)
// =====================
const modal = document.getElementById("videoModal");
const player = document.getElementById("videoPlayer");

document.querySelectorAll("[data-video]").forEach((btn) => {
  btn.addEventListener("click", () => {
    player.src = btn.dataset.video;
    modal.classList.add("open");
    player.play();
  });
});

document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", () => {
    player.pause();
    player.src = "";
    modal.classList.remove("open");
  });
});
