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

// 기본값 설정
const finalId = exhibitionId || "avatar_ii";

const input = document.querySelector('input[name="exhibition_id"]');
if (input) {
  input.value = finalId;
}

/* -----------------------------------------------------
   Init
----------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  if (!exhibitionId) return;

// hidden input에 자동 삽입
if (exhibitionId) {
  const input = document.querySelector('input[name="exhibition_id"]');
  if (input) {
    input.value = exhibitionId;
  }
}

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

    // 테마 색 적용
    if (exhibition.themeColor) {
      document.body.style.setProperty(
        "--theme-color",
        exhibition.themeColor
      );
    }

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
   Auto Slide
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
   Image Display
----------------------------------------------------- */

function showImage(index) {
  const img = document.getElementById("exhibition-image");
  if (!img || images.length === 0) return;

  const isLoopReset =
  (currentIndex === images.length - 1 && index === 0);

  currentIndex = (index + images.length) % images.length;

  if (isLoopReset) {
    document.querySelector(".viewer").classList.add("loop-dark");
    setTimeout(() => {
      document.querySelector(".viewer").classList.remove("loop-dark");
    }, 900);
  }

  img.classList.remove("visible");
  img.src = images[currentIndex];

  img.onload = () => {
    setTimeout(() => {
      img.classList.add("visible");
    }, 150);
  };
}

function nextImage() {
  showImage(currentIndex + 1);
}

function prevImage() {
  showImage(currentIndex - 1);
}

/* -----------------------------------------------------
   Audio
----------------------------------------------------- */

function setupAudio(src) {
  audio = new Audio(src);
  audio.loop = true;
  audio.volume = 0.5;
  audio.preload = "auto";

  // 시작은 muted
  audio.muted = true;

  // 자동 재생 시도 (실패해도 괜찮음)
  audio.play().catch(() => {});

  // 어떤 클릭이든 강제로 활성화
  const enableAudio = () => {
    if (!audio) return;

    audio.muted = false;
    audio.play().catch(() => {});
  };

  window.addEventListener("pointerdown", enableAudio, { once: true });
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

      if (audio.paused) {
        audio.play().catch(() => {});
        audio.muted = false;
        mute.textContent = "Mute";
        return;
      }

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
    li.classList.add("highlight-new");

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

    const guestbookBox =
      document.querySelector(".exhibition-guestbook");

    guestbookBox.classList.add("flash");

    setTimeout(()=>{
      guestbookBox.classList.remove("flash");
}, 420);


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