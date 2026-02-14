async function loadHall() {

  const params = new URLSearchParams(location.search);
  const hallId = params.get("hall");

  const res = await fetch("data/hall.json");
  const data = await res.json();

  const hall = data.halls.find(h => h.id === hallId);

  document.getElementById("hallTitle").textContent =
    hall ? hall.title : "Hall";

  const list = document.getElementById("exhibitionList");
  list.innerHTML = "";

  if (hall && hall.exhibitions.length > 0) {

    hall.exhibitions.forEach(ex => {

      const link = document.createElement("a");
      link.textContent = ex;
      link.href = `exhibition.html?id=${ex}&hall=${hallId}`;

      link.style.display = "block";
      link.style.margin = "20px";
      link.style.fontSize = "20px";
      link.style.textDecoration = "none";
      link.style.cursor = "pointer";

      list.appendChild(link);

    });

  }
}

loadHall();
