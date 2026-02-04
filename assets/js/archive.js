fetch("gallery.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("archive-list");
    const today = new Date().toISOString().slice(0, 10);

    data.archive.forEach(exhibition => {
      if (today <= exhibition.endDate) return;

      const section = document.createElement("section");
      section.className = "archive-item";

      section.innerHTML = `
        <div class="archive-poster">
          <img src="${exhibition.poster}" alt="${exhibition.title}">
        </div>

        <div class="archive-info">
          <h2>${exhibition.title}</h2>
          <p class="artist">${exhibition.artist}</p>
          <p class="period">${exhibition.startDate} – ${exhibition.endDate}</p>

          <div class="archive-note" data-note="${exhibition.artistNote}">
            작가노트 보기
          </div>

          <div class="archive-guestbook" data-id="${exhibition.id}">
            <!-- 읽기 전용 방명록 -->
          </div>
        </div>
      `;

      container.appendChild(section);
      loadArchiveGuestbook(exhibition.id, section);
    });
  });

function loadArchiveGuestbook(id, section) {
  const key = `archiveGuestbook_${id}`;
  const data = JSON.parse(localStorage.getItem(key) || "[]");

  if (data.length === 0) return;

  const box = section.querySelector(".archive-guestbook");
  const ul = document.createElement("ul");

  data.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.text;
    ul.appendChild(li);
  });

  box.appendChild(ul);
}
