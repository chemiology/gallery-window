document.addEventListener("DOMContentLoaded", () => {
  // 대표화면(home)에서만 실행
  if (!document.body.classList.contains("home")) return;
  loadGallery();
  renderHomepageGuestbook();
});

async function loadGallery() {
  try {
    const response = await fetch("assets/config/gallery.json");
    const data = await response.json();

    renderHeadlineNotice(data.headlineNotice);
    renderExhibitions(data.currentExhibitions || []);

  } catch (error) {
    console.error("Gallery data load failed:", error);
  }
}

/* =========================
   전시관 렌더링 (정상 복구)
   ========================= */
function renderExhibitions(exhibitions) {

  const MAX_VISIBLE_HALLS = 1; 

  const container = document.querySelector(".exhibitions");
  if (!container) return;

  container.innerHTML = "";

  exhibitions
    .slice(0, MAX_VISIBLE_HALLS)
    .forEach((exhibition, index) => {

      const block = document.createElement("div");
      block.className = "exhibition";

      const hall = document.createElement("div");
      hall.className = "hall-label";
      hall.textContent = `${index + 1}관`;
      block.appendChild(hall);

      const img = document.createElement("img");
      img.src = exhibition.poster;
      img.alt = exhibition.title;
      img.onclick = () => {
        location.href = `exhibition.html?id=${exhibition.id}`;
      };


// 포스터 이미지
const img = document.createElement("img");
img.src = exhibition.poster;
img.alt = exhibition.title;
img.style.cursor = "pointer";
img.onclick = () => {
  location.href = `exhibition.html?id=${exhibition.id}`;
};

// 포스터 + 메타 래퍼
const posterWrap = document.createElement("div");
posterWrap.className = "poster-wrap";
posterWrap.appendChild(img);

// 작가/제목 메타
const meta = document.createElement("div");
meta.className = "meta";
meta.innerHTML = `
  <h3>${exhibition.title}</h3>
  <p>${exhibition.artist || ""}</p>
`;
posterWrap.appendChild(meta);

// 작가노트 (미리보기)
const noteWrap = document.createElement("div");
noteWrap.className = "artist-note";
noteWrap.textContent = exhibition.artistNotePreview || "";

// body에 추가
body.appendChild(posterWrap);
body.appendChild(noteWrap);


      block.appendChild(img);
      container.appendChild(block);
    });
}


/* =========================
   대표 공지
   ========================= */
function renderHeadlineNotice(notice) {
  const container = document.getElementById("headline-notice");
  if (!container) return;

  if (!notice || !notice.text || notice.text.trim() === "") {
    container.style.display = "none";
    return;
  }

  container.textContent = notice.text;
}

/* =========================
   방명록
   ========================= */
function renderHomepageGuestbook() {
  const area = document.getElementById("guestbook-area");
  if (!area) return;

  area.innerHTML = "";
  const ul = document.createElement("ul");
  area.appendChild(ul);

  const keys = Object.keys(localStorage).filter(k =>
    k.startsWith("guestbook_")
  );

  let all = [];
  keys.forEach(key => {
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.forEach(item => {
      all.push({
        text: item.text,
        date: item.date
      });
    });
  });

  if (all.length === 0) {
    const li = document.createElement("li");
    li.textContent = "아직 남긴 방명록이 없습니다.";
    ul.appendChild(li);
    return;
  }

  all.sort((a, b) => a.date.localeCompare(b.date));
  all.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.text;
    ul.appendChild(li);
  });
}
