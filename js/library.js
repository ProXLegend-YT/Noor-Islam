/* Noor Islam — Library page logic */
(function(){
  const cats = ["All", ...new Set(LIBRARY_BOOKS.map(b=>b.cat))];
  let activeCat = "All";
  const filterRow = document.getElementById("cat-filters");
  filterRow.innerHTML = cats.map(c=>`<button class="filter-btn ${c==='All'?'active':''}" data-c="${c}">${c}</button>`).join("");

  function render(){
    const q = document.getElementById("book-search").value.trim().toLowerCase();
    const items = LIBRARY_BOOKS.filter(b =>
      (activeCat === "All" || b.cat === activeCat) &&
      (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
    );
    document.getElementById("book-grid").innerHTML = items.map(b=>`
      <div class="card reveal in">
        <span class="chip chip-gold">${b.cat}</span>
        <h4 style="margin-top:12px;">${b.title}</h4>
        <p style="font-size:13.5px;color:var(--text-muted);margin-bottom:6px;">by ${b.author}</p>
        <p style="font-size:14px;">${b.desc}</p>
        <button class="btn btn-outline btn-sm btn-block" onclick="toast('Downloading is coming soon — this preview highlights the book so you can find a full edition from your favourite Islamic publisher or library.')">View Details</button>
      </div>`).join("") || `<p style="grid-column:1/-1;text-align:center;">No books matched your search.</p>`;
  }

  filterRow.querySelectorAll(".filter-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      filterRow.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      activeCat = btn.dataset.c;
      render();
    });
  });
  document.getElementById("book-search").addEventListener("input", render);
  render();

  // Local PDF reader (file stays on-device via object URL)
  document.getElementById("pdf-input").addEventListener("change", (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    const url = URL.createObjectURL(file);
    document.getElementById("pdf-embed").src = url;
    document.getElementById("pdf-view").style.display = "block";
  });
})();
