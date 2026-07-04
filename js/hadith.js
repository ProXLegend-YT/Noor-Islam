/* Noor Islam — Hadith page logic */
(function(){
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(),0,0)) / 86400000);
  const daily = HADITHS[day % HADITHS.length];
  document.getElementById("daily-hadith-text").textContent = `"${daily.text}"`;
  document.getElementById("daily-hadith-ref").textContent = `${daily.book} · ${daily.ref} · Narrated by ${daily.narrator}`;

  const books = ["All", ...new Set(HADITHS.map(h=>h.book))];
  let activeBook = "All";
  const filterRow = document.getElementById("book-filters");
  filterRow.innerHTML = books.map(b=>`<button class="filter-btn ${b==='All'?'active':''}" data-b="${b}">${b}</button>`).join("");

  function bmKey(){ return "noor-hadith-bookmarks"; }
  function bookmarks(){ return JSON.parse(localStorage.getItem(bmKey()) || "[]"); }
  function toggleBookmark(id){
    let b = bookmarks();
    if(b.includes(id)){ b = b.filter(x=>x!==id); toast("Removed from bookmarks"); }
    else { b.push(id); toast("Hadith bookmarked"); }
    localStorage.setItem(bmKey(), JSON.stringify(b));
    render();
  }

  function render(){
    const q = document.getElementById("hadith-search").value.trim().toLowerCase();
    const bm = bookmarks();
    const items = HADITHS.filter(h =>
      (activeBook === "All" || h.book === activeBook) &&
      (!q || h.text.toLowerCase().includes(q) || h.narrator.toLowerCase().includes(q) || h.category.toLowerCase().includes(q))
    );
    const list = document.getElementById("hadith-list");
    list.innerHTML = items.map(h=>`
      <div class="card reveal in">
        <div class="flex justify-between items-center" style="margin-bottom:12px;">
          <span class="chip chip-gold">${h.category}</span>
          <button class="icon-btn" style="width:34px;height:34px;${bm.includes(h.id)?'color:var(--accent-strong);border-color:var(--accent)':''}" data-id="${h.id}">★</button>
        </div>
        <p>"${h.text}"</p>
        <p style="font-size:12.5px;color:var(--text-muted);margin:0;">${h.book} · ${h.ref} · Narrated by ${h.narrator}</p>
      </div>`).join("") || `<p style="grid-column:1/-1;text-align:center;padding:30px 0;">No hadith matched your search.</p>`;

    list.querySelectorAll("button[data-id]").forEach(btn=>{
      btn.addEventListener("click", ()=> toggleBookmark(Number(btn.dataset.id)));
    });
  }

  filterRow.querySelectorAll(".filter-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      filterRow.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      activeBook = btn.dataset.b;
      render();
    });
  });
  document.getElementById("hadith-search").addEventListener("input", render);
  render();
})();
