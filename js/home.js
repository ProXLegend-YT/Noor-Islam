/* Noor Islam — home page dynamic content */

(function(){
  // ---- Streak widget ----
  const s = getStreak();
  document.getElementById("streak-title").textContent =
    s.count >= 2 ? `${s.count} day streak — keep it up!` : "Start your streak today";
  document.getElementById("streak-sub").textContent =
    s.count >= 2 ? "You've visited Noor Islam every day — masha'Allah!" : "Come back tomorrow to begin building your streak.";
  const days = [];
  for(let i=6;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); days.push(`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`); }
  document.getElementById("streak-dots").innerHTML = days.map(d=>{
    const hit = (s.history||[]).includes(d);
    return `<span style="width:14px;height:14px;border-radius:50%;background:${hit?'linear-gradient(135deg,var(--gold-400),var(--gold-600))':'var(--bg-alt)'};border:1px solid var(--border);display:inline-block;"></span>`;
  }).join("");
})();

(function(){
  // ---- Verse of the day (rotates by day of year) ----
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(),0,0)) / 86400000);
  const verse = VERSE_OF_DAY[day % VERSE_OF_DAY.length];
  document.getElementById("verse-ar").textContent = verse.ar;
  document.getElementById("verse-en").textContent = verse.en;
  document.getElementById("verse-ur").textContent = verse.ur;
  document.getElementById("verse-ref").textContent = verse.ref;
  document.getElementById("verse-copy").addEventListener("click", ()=>{
    navigator.clipboard?.writeText(`${verse.ar}\n\n"${verse.en}"\n— ${verse.ref}`);
    toast("Verse copied to clipboard");
  });

  // ---- Daily reminder (rotates through quotes) ----
  const q = QUOTES[day % QUOTES.length];
  document.getElementById("daily-reminder").textContent = `"${q.text}" — ${q.ref}`;

  // ---- News ----
  const newsGrid = document.getElementById("news-grid");
  newsGrid.innerHTML = NEWS.map(n => `
    <article class="card reveal">
      <span class="chip">${n.tag}</span>
      <h4 style="margin-top:12px;">${n.title}</h4>
      <p style="font-size:14px;">${n.summary}</p>
    </article>`).join("");

  // ---- Ramadan / Eid countdown (Ramadan 1448 AH: expected 8 Feb 2027 – Eid al-Fitr 9 Mar 2027) ----
  function countdownTo(dateStr, el){
    const target = new Date(dateStr).getTime();
    const diff = target - Date.now();
    if(diff <= 0){ document.getElementById(el).textContent = "Today!"; return; }
    const days = Math.ceil(diff / 86400000);
    document.getElementById(el).textContent = `${days} days`;
  }
  countdownTo("2027-02-08T00:00:00", "ramadan-countdown");
  countdownTo("2027-03-09T00:00:00", "eid-countdown");

  // ---- Hijri date + prayer times via Aladhan API ----
  const grid = document.getElementById("home-prayer-grid");
  const PRAYERS = [["Fajr","🌅"],["Dhuhr","☀️"],["Asr","🌤️"],["Maghrib","🌇"],["Isha","🌙"]];

  function renderSkeleton(){
    grid.innerHTML = PRAYERS.map(p=>`<div class="glass" style="padding:12px;text-align:center;"><div class="skeleton" style="height:14px;margin-bottom:8px;"></div><div class="skeleton" style="height:18px;"></div></div>`).join("");
  }
  renderSkeleton();

  function renderPrayerTimes(timings, city){
    document.getElementById("home-location").textContent = city;
    grid.innerHTML = PRAYERS.map(([name,icon])=>`
      <div class="glass" style="padding:12px 6px;text-align:center;">
        <div style="font-size:18px;">${icon}</div>
        <div style="font-size:12px;color:var(--text-muted);margin:4px 0;">${name}</div>
        <div style="font-weight:800;color:var(--primary);font-size:14px;">${timings[name]}</div>
      </div>`).join("");
    findNext(timings);
  }

  function findNext(timings){
    const now = new Date();
    const order = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];
    for(const name of order){
      const [h,m] = timings[name].split(":").map(Number);
      const t = new Date(); t.setHours(h,m,0,0);
      if(t > now){
        const mins = Math.round((t - now)/60000);
        document.getElementById("home-next-prayer").textContent = `${name} in ${Math.floor(mins/60)}h ${mins%60}m`;
        return;
      }
    }
    document.getElementById("home-next-prayer").textContent = "Isha has passed — Fajr begins the new day";
  }

  async function loadPrayerTimes(lat, lon, cityLabel){
    try{
      const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`);
      const data = await res.json();
      renderPrayerTimes(data.data.timings, cityLabel);
      const hijri = data.data.date.hijri;
      document.getElementById("hijri-date").textContent = `${hijri.day} ${hijri.month.en} ${hijri.year} AH`;
      document.getElementById("gregorian-date").textContent = data.data.date.gregorian.weekday.en + ", " + data.data.date.gregorian.date;
    }catch(e){
      document.getElementById("home-location").textContent = "Unavailable offline";
      document.getElementById("hijri-date").textContent = "—";
    }
  }

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      pos => loadPrayerTimes(pos.coords.latitude, pos.coords.longitude, "Your location"),
      ()  => loadPrayerTimes(21.4225, 39.8262, "Makkah (default)"),
      {timeout:6000}
    );
  } else {
    loadPrayerTimes(21.4225, 39.8262, "Makkah (default)");
  }
})();
