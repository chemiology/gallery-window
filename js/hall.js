async function loadHall() {

  const params = new URLSearchParams(location.search);
  const hallId = params.get("hall") || "hall01";

  // hall 정보 로드
  const hallRes = await fetch("data/hall.json");
  const hallData = await hallRes.json();

  const hall = hallData.halls.find(h => h.id === hallId);
  if (!hall) {
    console.error("Hall not found:", hallId);
    return;
  }

  document.getElementById("hallTitle").textContent = hall.title;

  // 전시 정보 로드
  const res = await fetch("./assets/config/gallery.json");
  const data = await res.json();

  const exhibition = data.exhibitions.find(
    ex => ex.id === hall.exhibitions[0]
  );

  if (!exhibition) {
    console.error("Exhibition not found:", hall.exhibitions[0]);
    return;
  }

  // 포스터
  const poster = document.getElementById("hallPoster");
  poster.src = `assets/posters/${exhibition.id}.jpg`;

  poster.onclick = () => {
    window.location.href =
      `exhibition.html?id=${exhibition.id}&hall=${hallId}`;
  };

  // 작가노트
  const note = await fetch(exhibition.artistNote);
  document.getElementById("artistNote").innerText =
    await note.text();

  // 프로필 (있으면)
  try {
    const profile = await fetch(
      `assets/profiles/${exhibition.id}.txt`
    );
    document.getElementById("artistProfile").innerText =
      await profile.text();
  } catch(e) {}

  // 작품보기 버튼
  const enterBtn = document.getElementById("enterExhibition");
  if (enterBtn) {
    enterBtn.href =
      `exhibition.html?id=${exhibition.id}&hall=${hallId}`;
  }
}

loadHall();
