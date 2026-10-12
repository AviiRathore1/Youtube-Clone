// Demo data: replace these IDs with your own YouTube video IDs.
const IDS = ["g252t_XoWRE", "0fZDrUzkxxE", "Ooqg7UAAwWw"];
const CATEGORIES = ["All", "Music", "Tech", "Gaming", "Live", "Movies", "Sports"];

const videos = Array.from({ length: 12 }, (_, i) => ({
  id: IDS[i % IDS.length],
  cat: CATEGORIES[1 + (i % (CATEGORIES.length - 1))],
  title: "Video " + (i + 1),
  channel: "YouTube creator"
}));

let category = "All";
let query = "";

const grid = document.getElementById("videoGrid");
const bar = document.getElementById("categoryBar");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function renderCategories() {
  bar.innerHTML = CATEGORIES.map(c =>
    `<button class="category-btn${c === category ? " active" : ""}" data-cat="${c}">${c}</button>`).join("");
}

function renderVideos() {
  const list = videos.filter(v =>
    (category === "All" || v.cat === category) &&
    (v.title + " " + v.channel).toLowerCase().includes(query));
  grid.innerHTML = list.length
    ? list.map(v => `
      <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
        <button class="video-card" data-id="${v.id}" data-title="${esc(v.title)}">
          <img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy">
          <span class="video-title">${esc(v.title)}</span>
          <span class="channel-info">${esc(v.channel)}</span>
        </button>
      </div>`).join("")
    : '<p class="text-secondary">No videos match your search.</p>';
}

// Category filter
bar.addEventListener("click", e => {
  const btn = e.target.closest(".category-btn");
  if (!btn) return;
  category = btn.dataset.cat;
  renderCategories();
  renderVideos();
});

// Search filter
document.getElementById("searchInput").addEventListener("input", e => {
  query = e.target.value.trim().toLowerCase();
  renderVideos();
});

// Video player modal (iframe only loads when a card is clicked)
const modalEl = document.getElementById("playerModal");
const frame = document.getElementById("playerFrame");
const modal = new bootstrap.Modal(modalEl);

grid.addEventListener("click", e => {
  const card = e.target.closest(".video-card");
  if (!card) return;
  document.getElementById("playerTitle").textContent = card.dataset.title;
  frame.src = `https://www.youtube.com/embed/${card.dataset.id}?autoplay=1`;
  modal.show();
});
modalEl.addEventListener("hidden.bs.modal", () => { frame.src = ""; });

// Sidebar toggle: collapse on desktop, slide in on smaller screens
document.getElementById("menuBtn").addEventListener("click", () => {
  document.body.classList.toggle(window.innerWidth >= 1200 ? "sidebar-collapsed" : "sidebar-open");
});

// Load real titles and channel names (no API key needed); keeps placeholders if offline
IDS.forEach(id => {
  fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`)
    .then(r => r.json())
    .then(d => {
      videos.forEach(v => { if (v.id === id) { v.title = d.title; v.channel = d.author_name; } });
      renderVideos();
    })
    .catch(() => {});
});

renderCategories();
renderVideos();
lucide.createIcons();
