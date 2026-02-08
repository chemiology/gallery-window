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

function renderExhibitions(exhibitions) {
  const container = document.querySelector(".exhibitions");
  if (!container) return;

  container.innerHTML = "";

 const MAX_VISIBLE_HALLS = 1;

exhibitions.forEach((exhibition, index) => {

  if (index < MAX_VISIBLE_HALLS) {

    const block = document.createElement("div");
    block.className = "exhibition";

    const hall = document.createElement("div");
    hall.className = "hall-label";
    hall.textContent = `${index + 1}관`;
    block.appendChild(hall);

    // ↓ 기존 코드 그대로
    // block에 이미지, 링크 추가
    // appendChild 실행
  }

});



  // ↓↓↓ 이하 기존 코드 그대로
});


    const body = document.createElement("div");
    body.className = "exhibition-body";

    const posterWrap = document.createElement("div");
    const img = document.createElement("img");
    img.src = exhibition.poster;
    img.alt = exhibition.title;
    img.style.cursor = "pointer";
    img.onclick = () => {
      location.href = `exhibition.html?id=${exhibition.id}`;
    };

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.innerHTML = `<h3>${exhibition.title}</h3><p>${exhibition.artist}</p>`;

    posterWrap.appendChild(img);
    posterWrap.appendChild(meta);

    const noteWrap = document.createElement("div");
    noteWrap.className = "artist-note";
    noteWrap.textContent = "Loading…";

    if (exhibition.artistNote) {
      fetch(exhibition.artistNote)
        .then(res => res.text())
        .then(text => {
          noteWrap.textContent = text;
        })
        .catch(() => {
          noteWrap.textContent = "";
        });
    }

    body.appendChild(posterWrap);
    body.appendChild(noteWrap);
    block.appendChild(body);
    container.appendChild(block);
  });
}

function renderHomepageGuestbook() {
  const area = document.getElementById("guestbook-area");
  if (!area) return;

  area.innerHTML = "";
  const ul = document.createElement("ul");
  area.appendChild(ul);

  // 모든 전시 방명록 수집 (자기 것만)
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

  // 오래된 순 → 최신 순
  all.sort((a, b) => a.date.localeCompare(b.date));

  all.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.text;
    ul.appendChild(li);
  });
}

function renderHeadlineNotice(notice) {
  const container = document.getElementById("headline-notice");
  if (!container) return;

  if (!notice || !notice.text || notice.text.trim() === "") {
    container.style.display = "none";
    return;
  }

  container.textContent = notice.text;
}

