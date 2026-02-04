document.addEventListener("DOMContentLoaded", () => {
  loadGallery();
  renderHomepageGuestbook();
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

    if (exhibitions.length === 2) {
      const hall = document.createElement("div");
      hall.className = "hall-label";
      hall.textContent = index === 0 ? "1관" : "2관";
      block.appendChild(hall);
    }

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

  const keys = Object.keys(localStorage).filter(k =>
    k.startsWith("guestbook_")
  );

  let all = [];
  keys.forEach(key => {
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.forEach(item => all.push(item.text));
  });

  if (all.length === 0) return;

  let idx = Number(localStorage.getItem("homepageGuestbookIndex"));
  if (Number.isNaN(idx)) idx = 0;
  if (idx >= all.length) idx = 0;

  const li = document.createElement("li");
  li.textContent = all[idx];
  ul.appendChild(li);

  localStorage.setItem("homepageGuestbookIndex", idx + 1);
}
