document.addEventListener("DOMContentLoaded", () => {
  loadGallery();
});

async function loadGallery() {
  try {
    const response = await fetch("assets/config/gallery.json");
    const data = await response.json();
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

    // 1관 / 2관 표시 (2개일 때만)
    if (exhibitions.length === 2) {
      const hall = document.createElement("div");
      hall.className = "hall-label";
      hall.textContent = index === 0 ? "1관" : "2관";
      block.appendChild(hall);
    }

    const body = document.createElement("div");
    body.className = "exhibition-body";

    /* 포스터 영역 */
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

    /* 작가노트 영역 */
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
