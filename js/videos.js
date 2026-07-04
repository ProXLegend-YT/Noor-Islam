/* Noor Islam — Videos page logic */
(function(){
  const CATS = [
    {id:"quran recitation", label:"Quran Recitation", icon:"📖"},
    {id:"quran tafsir explanation", label:"Tafsir", icon:"📝"},
    {id:"islamic history", label:"Islamic History", icon:"🏛️"},
    {id:"islamic motivation reminder", label:"Islamic Motivation", icon:"✨"},
    {id:"nasheed", label:"Nasheeds", icon:"🎵"},
    {id:"naat sharif urdu", label:"Naats", icon:"🌹"},
    {id:"islamic shorts", label:"Islamic Shorts", icon:"🎬"},
  ];
  let active = CATS[0].id;
  const catRow = document.getElementById("video-cats");
  catRow.innerHTML = CATS.map(c=>`<button class="filter-btn ${c.id===active?'active':''}" data-c="${c.id}">${c.icon} ${c.label}</button>`).join("");

  const apiKeyInput = document.getElementById("yt-key");
  apiKeyInput.value = localStorage.getItem("noor-yt-key") || "";
  document.getElementById("save-key").addEventListener("click", ()=>{
    localStorage.setItem("noor-yt-key", apiKeyInput.value.trim());
    toast("API key saved to this browser");
    render();
  });

  function launcherCards(query){
    const grid = document.getElementById("video-grid");
    const label = CATS.find(c=>c.id===query)?.label || query;
    grid.innerHTML = `
      <div class="card reveal in" style="grid-column:1/-1;text-align:center;">
        <div style="font-size:36px;">🔎</div>
        <h4>Explore "${label}" on YouTube</h4>
        <p>Add a free YouTube Data API v3 key above to load a live, trending grid with thumbnails, view counts and publish dates directly on this page — otherwise, open curated results in a new tab.</p>
        <a class="btn btn-gold" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(label+' islamic')}">Search "${label}" on YouTube ↗</a>
      </div>`;
  }

  async function liveGrid(query, key){
    const grid = document.getElementById("video-grid");
    grid.innerHTML = `<div class="text-center" style="grid-column:1/-1;padding:40px 0;"><span class="star8 spin"></span></div>`;
    try{
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=9&q=${encodeURIComponent(query+" islamic")}&type=video&key=${key}`;
      const res = await fetch(url);
      const data = await res.json();
      if(data.error){ throw new Error(data.error.message); }
      grid.innerHTML = data.items.map(v=>`
        <div class="card reveal in video-card" data-id="${v.id.videoId}" style="cursor:pointer;">
          <img src="${v.snippet.thumbnails.medium.url}" alt="${v.snippet.title}" style="border-radius:12px;margin-bottom:12px;">
          <h4 style="font-size:15px;">${v.snippet.title}</h4>
          <p style="font-size:12.5px;color:var(--text-muted);">${v.snippet.channelTitle} · ${new Date(v.snippet.publishTime).toLocaleDateString()}</p>
        </div>`).join("");
      grid.querySelectorAll(".video-card").forEach(card=>{
        card.addEventListener("click", ()=>{
          document.getElementById("video-player-wrap").style.display = "block";
          document.getElementById("video-player").src = `https://www.youtube-nocookie.com/embed/${card.dataset.id}?autoplay=1`;
          document.getElementById("video-player-wrap").scrollIntoView({behavior:"smooth"});
        });
      });
    }catch(e){
      toast("Couldn't load live results — check your API key");
      launcherCards(query);
    }
  }

  function render(){
    const key = localStorage.getItem("noor-yt-key");
    if(key) liveGrid(active, key);
    else launcherCards(active);
  }

  catRow.querySelectorAll(".filter-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      catRow.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      active = btn.dataset.c;
      render();
    });
  });

  document.getElementById("video-search").addEventListener("keydown", (e)=>{
    if(e.key === "Enter" && e.target.value.trim()){
      active = e.target.value.trim();
      const key = localStorage.getItem("noor-yt-key");
      key ? liveGrid(active, key) : launcherCards(active);
    }
  });

  render();
})();
