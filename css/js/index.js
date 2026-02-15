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

  exhibitions.forEach((exhibition, index) => {

    const block = document.createElement("div");
    block.className = "exhibition";

    if (exhibitions.length === 2) {
      const hall = document.createElement("div");
      hall.className = "hall-label";
      hall.textContent = index === 0 ? "1관" : "2관";
      block.appendChild(hall);
    }

  // ↓↓↓ 이하 기존 코드 그대로

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
          noteWrap.classList.add("exhibition-text");
          noteWrap.innerHTML = text;

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

async function renderHomepageGuestbook() {

  const area = document.getElementById("guestbook-area");
  if (!area) return;

  area.innerHTML = "";
  const ul = document.createElement("ul");
  area.appendChild(ul);

  try {

    const res = await fetch(
      window.GUESTBOOK_URL + "?mode=list"
    );

    const data = await res.json();

    if (!data || data.length === 0) {
      const li = document.createElement("li");
      li.textContent = "아직 방명록이 없습니다.";
      ul.appendChild(li);
      return;
    }

    data.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item.message;
      ul.appendChild(li);
    });

  } catch (err) {
    const li = document.createElement("li");
    li.textContent = "방명록을 불러올 수 없습니다.";
    ul.appendChild(li);
  }
}


function renderHeadlineNotice(notice) {
  const container = document.getElementById("headline-notice");
  if (!container) return;

  if (!notice || !notice.text || notice.text.trim() === "") {
    container.style.display = "none";
    return;
  }

  container.innerHTML = notice.text;
}

document.addEventListener("click", function(e) {

  const link = e.target.closest("a[href*='exhibition.html']");
  if (!link) return;

  e.preventDefault();

  // exhibition → hall 입구로 변경
  const url = new URL(link.href);
  const id = url.searchParams.get("id");

  window.location.href = `hall.html?hall=hall01`;
});

