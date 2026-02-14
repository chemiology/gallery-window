async function loadCurrentExhibition() {

  const res = await fetch("data/hall.json");
  const data = await res.json();

  const hall01 = data.halls.find(h => h.id === "hall01");
  if (!hall01 || hall01.exhibitions.length === 0) return;

  const exId = hall01.exhibitions[0];

  const container = document.getElementById("currentExhibition");

  container.innerHTML = `
    <a href="exhibition.html?id=${exId}" class="current-ex-link">
      <img src="assets/posters/${exId}.jpg"
           alt="${exId}"
           style="width:100%; max-width:900px; display:block; margin:auto;">
    </a>
  `;
}

loadCurrentExhibition();

async function loadSecondHallPreview() {

  const res = await fetch("data/hall.json");
  const data = await res.json();

  const hall02 = data.halls.find(h => h.id === "hall02");
  if (!hall02 || hall02.exhibitions.length === 0) return;

  const exId = hall02.exhibitions[0];

  const container = document.getElementById("secondHallPreview");

  container.innerHTML = `
    <a href="exhibition.html?id=${exId}">
      <img src="assets/posters/${exId}.jpg"
           alt="${exId}"
           style="width:100%;">
      <div style="margin-top:10px; font-size:18px;">
        2관 전시
      </div>
    </a>
  `;
}

loadSecondHallPreview();

