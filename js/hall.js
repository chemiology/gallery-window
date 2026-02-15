async function loadHall() {

  const params = new URLSearchParams(location.search);
  const hallId = params.get("hall");

  const res = await fetch("./data/hall.json");
  const data = await res.json();

  const hall = data.halls.find(h => h.id === hallId);

  document.getElementById("hallTitle").textContent =
    hall ? hall.title : "Hall";

  const list = document.getElementById("exhibitionList");
  list.innerHTML = "";

  if (hall && hall.exhibitions.length > 0) {

    hall.exhibitions.forEach((ex, i) => {

const card = document.createElement("div");
card.className = "hall-card";

card.innerHTML = `
  <a href="exhibition.html?id=${ex}&hall=${hall.id}" class="hall-link">
    <div class="poster-wrap">
      <img src="assets/posters/${ex}.jpg" alt="${ex}">
      <div class="poster-caption">${ex}</div>
    </div>
  </a>
`;

list.appendChild(card);
  setTimeout(() => {
    card.classList.add("show");
  }, i * 180);

    });

  }
}

    });

    // ✅ 전시 입구 내용 로드 (여기에 추가)
    loadHallEntry(hall.exhibitions[0]);

  }
}


async function loadHallEntry(exhibitionId) {

  const params = new URLSearchParams(location.search);
  const hallId = params.get("hall") || "hall01";

  const res = await fetch("./assets/config/gallery.json");
  const data = await res.json();

  const exhibition = data.exhibitions.find(
    ex => ex.id === exhibitionId
  );

  if (!exhibition) return;

// 전시장 입장 버튼 연결
const enterBtn = document.getElementById("enterExhibition");

if (enterBtn) {

  enterBtn.href =
    `exhibition.html?id=${exhibition.id}&hall=${hallId}`;

  enterBtn.addEventListener("click", function(e) {
    e.preventDefault();

    const fade = document.getElementById("pageFade");
    fade.classList.add("active");

    setTimeout(() => {
      window.location.href = enterBtn.href;
    }, 500);
  });
}


  // 포스터
  document.getElementById("hallPoster").src =
    `assets/posters/${exhibition.id}.jpg`;

  // 작가노트
  const note = await fetch(`./assets/notes/${exhibition.id}.txt`);
  document.getElementById("artistNote").innerText =
    await note.text();

  // 작가 프로필 (선택)
  try {
    const profile = await fetch(`./assets/profiles/${exhibition.id}.txt`);
    document.getElementById("artistProfile").innerText =
      await profile.text();
  } catch(e) {}
}

// 입구 영역 부드럽게 등장
setTimeout(() => {
  document.querySelector(".hall-entry")
    ?.classList.add("show");
}, 400);


loadHall();

document.addEventListener("click", function(e) {

  const link = e.target.closest(".hall-link");
  if (!link) return;

  e.preventDefault();

  const fade = document.getElementById("pageFade");
  fade.classList.add("active");

  setTimeout(() => {
    window.location.href = link.href;
  }, 500);
});

