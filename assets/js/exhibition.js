/* =====================================================
   Gallery Window – Exhibition JS (Final)
===================================================== */

let images = [];
let currentIndex = 0;
let timer = null;
let slideSeconds = 10;
let autoMode = true;

let audio = null;

/* -----------------------------------------------------
   Utility
----------------------------------------------------- */

function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}


// URL에서 전시 ID 가져오기
const params = new URLSearchParams(window.location.search);
const exhibitionId = params.get("id");

// hidden input에 자동 삽입
if (exhibitionId) {
  const input = document.querySelector('input[name="exhibition_id"]');
  if (input) {
    input.value = exhibitionId;
  }
}

/* -----------------------------------------------------
   Init
----------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const exhibitionId = qs("id");
  if (!exhibitionId) return;

  loadExhibition(exhibitionId);
  setupControls();
});

/* -----------------------------------------------------
   Load Exhibition Data
----------------------------------------------------- */

async function loadExhibition(id) {
  try {
    const res = await fetch("assets/config/gallery.json");
    const data = await res.json();

    const exhibition = data.currentExhibitions.find(e => e.id === id);
    if (!exhibition) return;

    images = exhibition.images || [];
    slideSeconds = exhibition.slideSeconds || 10;

    if (images.length > 0) {
      showImage(0);
      startAuto();
    }

    if (exhibition.music) {
      setupAudio(exhibition.music);
    }

  } catch (err) {
    console.error("Exhibition load failed:", err);
  }
}

/* -----------------------------------------------------
   Image Display
----------------------------------------------------- */

function showImage(index) {
  const img = document.getElementById("exhibition-image");
  if (!img || images.length === 0) return;

  img.classList.remove("fade-in");
  img.classList.add("fade-out");

  setTimeout(() => {
    currentIndex = (index + images.length) % images.length;
    img.src = images[currentIndex];
    img.onload = () => {
      img.classList.remove("fade-out");
      img.classList.add("fade-in");
    };
  }, 400);
}

function nextImage() {
  showImage(currentIndex + 1);
}

function prevImage() {
  showImage(currentIndex - 1);
}

/* -----------------------------------------------------
   Auto / Manual
----------------------------------------------------- */

function startAuto() {
  stopAuto();
  autoMode = true;
  timer = setInterval(nextImage, slideSeconds * 1000);
}

function stopAuto() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  autoMode = false;
}

/* -----------------------------------------------------
   Audio
----------------------------------------------------- */

function setupAudio(src) {
  audio = new Audio(src);
  audio.loop = true;

  /* 1️⃣ 처음엔 아주 작고, muted 상태 */
  audio.volume = 0.05;
  audio.muted = true;

  /* 2️⃣ 페이지 로드 시 자동 재생 시도 */
  window.addEventListener("load", () => {
    audio.play().then(() => {
      /* 자동 재생 허용된 경우 */
      audio.muted = false;
    }).catch(() => {
      /* 차단된 경우 → 클릭 대기 */
    });
  });

  /* 3️⃣ 기존 클릭 재생 로직은 유지 */
  document.body.addEventListener("click", () => {
    if (audio && audio.paused) {
      audio.muted = false;
      audio.play().catch(() => {});
    }
  }, { once: true });
}

/* -----------------------------------------------------
   Controls
----------------------------------------------------- */

function setupControls() {
  const toggle = document.querySelector(".control-toggle");
  const box = document.querySelector(".control-box");

  if (toggle && box) {
    toggle.addEventListener("click", () => {
      box.style.display = box.style.display === "none" ? "block" : "none";
    });
  }

  // Auto / Manual
  document.querySelectorAll('input[name="mode"]').forEach(radio => {
    radio.addEventListener("change", e => {
      if (e.target.value === "auto") {
        startAuto();
      } else {
        stopAuto();
      }
    });
  });

  // Speed
  const speed = document.getElementById("speed");
  if (speed) {
    speed.addEventListener("input", e => {
      slideSeconds = Number(e.target.value);
      if (autoMode) startAuto();
    });
  }

  // Volume
  const volume = document.getElementById("volume");
  if (volume) {
    volume.addEventListener("input", e => {
      if (audio) audio.volume = Number(e.target.value);
    });
  }

  // Mute
  const mute = document.getElementById("mute");
  if (mute) {
    mute.addEventListener("click", () => {
      if (!audio) return;
      audio.muted = !audio.muted;
      mute.textContent = audio.muted ? "Unmute" : "Mute";
    });
  }

  // Keyboard (Manual)
  window.addEventListener("keydown", e => {
    if (autoMode) return;
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  });
}

/* =========================
   Exhibition Guestbook Logic
========================= */

const exhibitionId =
  new URLSearchParams(window.location.search).get("id");

const storageKey = `guestbook_${exhibitionId}`;
const listEl = document.getElementById("guestbook-list");
const formEl = document.getElementById("guestbook-form");
const inputEl = document.getElementById("guestbook-input");

function loadGuestbook() {
  const data = JSON.parse(localStorage.getItem(storageKey) || "[]");
  listEl.innerHTML = "";

  data.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.date} · ${item.text}`;
    listEl.appendChild(li);
  });
}

function saveGuestbook(text) {
  const data = JSON.parse(localStorage.getItem(storageKey) || "[]");
  const date = new Date().toISOString().slice(0, 10);

  data.unshift({ text, date });
  localStorage.setItem(storageKey, JSON.stringify(data));
}

if (formEl && listEl) {
  loadGuestbook();

  formEl.addEventListener("submit", e => {
    e.preventDefault();
    const text = inputEl.value.trim();
    if (!text) return;

    saveGuestbook(text);
    inputEl.value = "";
    loadGuestbook();
  });
}

function isExhibitionEnded(endDate) {
  const today = new Date().toISOString().slice(0, 10);
  return today > endDate;
}

function moveGuestbookToArchive(exhibitionId, endDate) {
  if (!isExhibitionEnded(endDate)) return;

  const activeKey = `guestbook_${exhibitionId}`;
  const archiveKey = `archiveGuestbook_${exhibitionId}`;

  const activeData = JSON.parse(localStorage.getItem(activeKey) || "[]");
  const archiveData = JSON.parse(localStorage.getItem(archiveKey) || "[]");

  if (activeData.length > 0) {
    localStorage.setItem(
      archiveKey,
      JSON.stringify(activeData.concat(archiveData))
    );
    localStorage.removeItem(activeKey);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const guestbook = document.querySelector(".exhibition-guestbook");
  const input = document.getElementById("guestbook-input");

  if (!guestbook || !input) return;

  input.addEventListener("focus", () => {
    guestbook.classList.add("active");
  });

  input.addEventListener("blur", () => {
    guestbook.classList.remove("active");
  });
});

