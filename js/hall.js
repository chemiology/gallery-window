console.log("NEW HALL.JS LOADED");

/* ======================================
   Hall Loader – Stable Final Version
====================================== */

async function loadHall() {

  const params = new URLSearchParams(location.search);
  const hallId = params.get("hall") || "hall01";

  try {

    // hall 정보 로드
    const res = await fetch("/gallery-window/data/hall.json");
    const data = await res.json();

    const hall = data.halls.find(h => h.id === hallId);

    // 타이틀
    document.getElementById("hallTitle").textContent =
      hall ? hall.title : "Hall";

    // 전시가 있을 때만 입구 로드
    if (hall && hall.exhibitions && hall.exhibitions.length > 0) {
      loadHallEntry(hall.exhibitions[0], hallId);
    }

  } catch (err) {
    console.error("Hall load failed:", err);
  }
}


/* ======================================
   Hall Entry Loader
====================================== */

async function loadHallEntry(exhibitionId, hallId) {

  try {

    const res = await fetch("/gallery-window/assets/config/gallery.json");
    const data = await res.json();

    const exhibition =
      (data.exhibitions || data.currentExhibitions || [])
        .find(ex => ex.id === exhibitionId);

    if (!exhibition) {
      console.error("Exhibition not found:", exhibitionId);
      return;
    }

    /* ---------- 포스터 ---------- */

    const poster = document.getElementById("hallPoster");

    if (poster) {
      poster.src =
        `/gallery-window/assets/posters/${exhibition.id}.jpg`;

      poster.onclick = () => {
        window.location.href =
          `/gallery-window/exhibition.html?id=${exhibition.id}&hall=${hallId}`;
      };
    }


    /* ---------- 작품보기 버튼 ---------- */

    const enterBtn = document.getElementById("enterExhibition");

    if (enterBtn) {

      const target =
        `/gallery-window/exhibition.html?id=${exhibition.id}&hall=${hallId}`;

      enterBtn.href = target;

      enterBtn.onclick = (e) => {
        e.preventDefault();

        const fade = document.getElementById("pageFade");
        fade?.classList.add("active");

        setTimeout(() => {
          window.location.href = target;
        }, 450);
      };
    }


    /* ---------- 작가노트 ---------- */

    try {
      const note = await fetch(
        `/gallery-window/assets/notes/${exhibition.id}.txt`
      );

      document.getElementById("artistNote").innerText =
        await note.text();

    } catch {
      console.warn("Artist note missing");
    }


    /* ---------- 작가 프로필 ---------- */

    try {
      const profile = await fetch(
        `/gallery-window/assets/profiles/${exhibition.id}.txt`
      );

      document.getElementById("artistProfile").innerHTML =
        await profile.text();

    } catch {
      console.warn("Artist profile missing");
    }

  } catch (err) {
    console.error("Hall entry load failed:", err);
  }
}


/* ======================================
   Entrance Animation (single trigger)
====================================== */

window.addEventListener("load", () => {
  setTimeout(() => {
    document.querySelector(".hall-entry")
      ?.classList.add("show");
  }, 200);
});


/* ======================================
   Start
====================================== */

loadHall();
