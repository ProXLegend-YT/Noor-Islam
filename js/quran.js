/* Noor Islam — Qur'an reader logic (uses the free AlQuran Cloud API at runtime) */

(function(){
  const listEl = document.getElementById("surah-list");
  const searchEl = document.getElementById("surah-search");
  const titleEl = document.getElementById("reader-title");
  const subEl = document.getElementById("reader-sub");
  const ayahBox = document.getElementById("ayah-container");
  const bismillahEl = document.getElementById("bismillah");
  const translationSelect = document.getElementById("translation-select");

  function renderList(filter=""){
    const f = filter.trim().toLowerCase();
    const items = SURAHS.filter(s =>
      !f || s.trans.toLowerCase().includes(f) || s.mean.toLowerCase().includes(f) || String(s.n) === f
    );
    listEl.innerHTML = items.map(s => `
      <button class="surah-item" data-n="${s.n}" style="width:100%;text-align:left;background:none;border:none;border-bottom:1px solid var(--border);padding:12px 6px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;color:var(--text);">
        <span class="flex items-center gap-12">
          <span class="chip" style="min-width:30px;justify-content:center;">${s.n}</span>
          <span>
            <b style="display:block;font-size:14.5px;">${s.trans}</b>
            <small style="color:var(--text-muted);">${s.mean} · ${s.ayahs} ayahs · ${s.type}</small>
          </span>
        </span>
        <span style="font-family:var(--font-arabic);font-size:18px;color:var(--primary);">${s.name}</span>
      </button>`).join("") || `<p style="padding:20px 0;text-align:center;">No Surah matched your search.</p>`;

    listEl.querySelectorAll(".surah-item").forEach(btn=>{
      btn.addEventListener("click", ()=> loadSurah(Number(btn.dataset.n)));
    });
  }
  renderList();
  searchEl.addEventListener("input", e => renderList(e.target.value));

  function bookmarks(){ return JSON.parse(localStorage.getItem("noor-bookmarks") || "[]"); }
  function saveBookmarks(b){ localStorage.setItem("noor-bookmarks", JSON.stringify(b)); }
  function isBookmarked(surah,ayah){ return bookmarks().some(b=>b.surah===surah && b.ayah===ayah); }
  function toggleBookmark(surah,ayah,text){
    let b = bookmarks();
    if(isBookmarked(surah,ayah)){ b = b.filter(x=>!(x.surah===surah&&x.ayah===ayah)); toast("Bookmark removed"); }
    else { b.push({surah,ayah,text,ts:Date.now()}); toast("Ayah bookmarked"); }
    saveBookmarks(b);
  }

  // ---- Full-Surah audio player ----
  const surahAudio = document.getElementById("surah-audio");
  const surahPlayBtn = document.getElementById("surah-play-btn");
  const surahPlayerBox = document.getElementById("surah-player");
  const reciterSelect = document.getElementById("reciter-select");
  const savedReciter = localStorage.getItem("noor-reciter");
  if(savedReciter) reciterSelect.value = savedReciter;
  let currentSurahNum = null;

  function fmtTime(s){
    if(!isFinite(s)) return "00:00";
    const m = Math.floor(s/60), sec = Math.floor(s%60);
    return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  }
  function loadSurahAudio(n){
    currentSurahNum = n;
    const edition = reciterSelect.value;
    surahAudio.src = `https://cdn.islamic.network/quran/audio-surah/128/${edition}/${n}.mp3`;
    surahPlayBtn.textContent = "▶";
    document.getElementById("surah-progress").style.width = "0%";
    document.getElementById("surah-time").textContent = "00:00 / 00:00";
    surahPlayerBox.style.display = "flex";
  }
  surahPlayBtn.addEventListener("click", ()=>{
    document.querySelectorAll(".ayah-audio").forEach(a=>a.pause());
    if(surahAudio.paused){ surahAudio.play().catch(()=>toast("Couldn't start audio — check your connection")); surahPlayBtn.textContent = "❚❚"; }
    else { surahAudio.pause(); surahPlayBtn.textContent = "▶"; }
  });
  surahAudio.addEventListener("timeupdate", ()=>{
    const pct = surahAudio.duration ? (surahAudio.currentTime/surahAudio.duration)*100 : 0;
    document.getElementById("surah-progress").style.width = pct + "%";
    document.getElementById("surah-time").textContent = `${fmtTime(surahAudio.currentTime)} / ${fmtTime(surahAudio.duration)}`;
  });
  surahAudio.addEventListener("ended", ()=> surahPlayBtn.textContent = "▶");
  reciterSelect.addEventListener("change", ()=>{
    localStorage.setItem("noor-reciter", reciterSelect.value);
    if(currentSurahNum){ const wasPlaying = !surahAudio.paused; loadSurahAudio(currentSurahNum); if(wasPlaying){ surahAudio.play(); surahPlayBtn.textContent="❚❚"; } }
  });

  async function loadSurah(n){
    const meta = SURAHS.find(s=>s.n===n);
    titleEl.textContent = `${n}. ${meta.trans} — ${meta.mean}`;
    subEl.textContent = `${meta.type} · ${meta.ayahs} verses`;
    bismillahEl.style.display = (n !== 1 && n !== 9) ? "block" : "none";
    ayahBox.innerHTML = `<div class="text-center" style="padding:60px 0;"><span class="star8 spin"></span><p style="margin-top:14px;">Loading Surah ${meta.trans}…</p></div>`;
    localStorage.setItem("noor-last-read", JSON.stringify({n, name:meta.trans}));
    surahAudio.pause();
    loadSurahAudio(n);

    const lang = translationSelect.value;
    try{
      const [arRes, trRes, audioRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${n}/quran-uthmani`),
        fetch(`https://api.alquran.cloud/v1/surah/${n}/${lang}`),
        fetch(`https://api.alquran.cloud/v1/surah/${n}/ar.alafasy`)
      ]);
      const ar = await arRes.json(), tr = await trRes.json(), audio = await audioRes.json();
      renderAyahs(n, ar.data.ayahs, tr.data.ayahs, audio.data.ayahs);
    }catch(e){
      ayahBox.innerHTML = `<div class="card text-center"><p>Couldn't load this Surah right now — please check your connection and try again.</p></div>`;
    }
  }

  function renderAyahs(surahNum, arAyahs, trAyahs, audioAyahs){
    ayahBox.innerHTML = arAyahs.map((a,i)=>{
      const bm = isBookmarked(surahNum, a.numberInSurah);
      return `
      <div class="card reveal in" style="margin-bottom:16px;" data-ayah="${a.numberInSurah}">
        <div class="flex justify-between items-center" style="margin-bottom:14px;flex-wrap:wrap;gap:8px;">
          <span class="chip chip-gold">Ayah ${a.numberInSurah}</span>
          <div class="ayah-actions">
            <button class="icon-btn play-btn" title="Play audio" style="width:36px;height:36px;">▶</button>
            <button class="icon-btn bm-btn" title="Bookmark" style="width:36px;height:36px;${bm?'color:var(--accent-strong);border-color:var(--accent)':''}">★</button>
            <button class="icon-btn copy-btn" title="Copy" style="width:36px;height:36px;">⧉</button>
            <button class="icon-btn share-btn" title="Share" style="width:36px;height:36px;">↗</button>
          </div>
        </div>
        <p style="font-family:var(--font-arabic);font-size:26px;direction:rtl;line-height:2.1;color:var(--text);">${a.text}</p>
        <p style="font-size:15px;">${trAyahs[i].text}</p>
        <audio class="ayah-audio" preload="none" src="${audioAyahs[i].audio}"></audio>
      </div>`;
    }).join("");

    ayahBox.querySelectorAll(".card").forEach(card=>{
      const n = Number(card.dataset.ayah);
      const audioEl = card.querySelector(".ayah-audio");
      card.querySelector(".play-btn").addEventListener("click", (e)=>{
        document.querySelectorAll(".ayah-audio").forEach(a=>{ if(a!==audioEl) a.pause(); });
        const surahAudioEl = document.getElementById("surah-audio");
        surahAudioEl.pause();
        document.getElementById("surah-play-btn").textContent = "▶";
        if(audioEl.paused){ audioEl.play(); e.target.textContent="❚❚"; }
        else { audioEl.pause(); e.target.textContent="▶"; }
      });
      audioEl.addEventListener("ended", ()=> card.querySelector(".play-btn").textContent="▶");
      card.querySelector(".bm-btn").addEventListener("click", (e)=>{
        const arabicText = card.querySelector("p").textContent;
        toggleBookmark(surahNum, n, arabicText);
        e.target.style.color = isBookmarked(surahNum,n) ? "var(--accent-strong)" : "";
        e.target.style.borderColor = isBookmarked(surahNum,n) ? "var(--accent)" : "";
      });
      card.querySelector(".copy-btn").addEventListener("click", ()=>{
        const [ar,en] = card.querySelectorAll("p");
        navigator.clipboard?.writeText(`${ar.textContent}\n\n${en.textContent}\n— Surah ${surahNum}, Ayah ${n}`);
        toast("Ayah copied");
      });
      card.querySelector(".share-btn").addEventListener("click", ()=>{
        const [ar,en] = card.querySelectorAll("p");
        const text = `${en.textContent}\n— Surah ${surahNum}, Ayah ${n} | via Noor Islam`;
        if(navigator.share){ navigator.share({title:"Noor Islam", text}); }
        else { navigator.clipboard?.writeText(text); toast("Link copied to share"); }
      });
    });
  }

  translationSelect.addEventListener("change", ()=>{
    const last = JSON.parse(localStorage.getItem("noor-last-read") || "null");
    if(last) loadSurah(last.n);
  });

  // Continue reading banner
  const last = JSON.parse(localStorage.getItem("noor-last-read") || "null");
  if(last){
    document.getElementById("continue-card").style.display = "block";
    document.getElementById("continue-text").textContent = `Surah ${last.n} — ${last.name}`;
    document.getElementById("continue-btn").addEventListener("click", ()=> loadSurah(last.n));
  }

  // Deep link ?surah=NN
  const params = new URLSearchParams(location.search);
  if(params.get("surah")) loadSurah(Number(params.get("surah")));
})();
