/* Noor Islam — Tools page logic */
(function(){
  // Tabs
  const tabs = document.getElementById("tool-tabs");
  tabs.querySelectorAll(".filter-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      tabs.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".tool-panel").forEach(p=>p.style.display="none");
      document.getElementById("panel-"+btn.dataset.t).style.display="block";
    });
  });

  // ---- Tasbih counter ----
  let count = parseInt(localStorage.getItem("noor-tasbih-count") || "0", 10);
  const countEl = document.getElementById("tasbih-count");
  const roundsEl = document.getElementById("tasbih-rounds");
  function paintTasbih(){
    countEl.textContent = count;
    roundsEl.textContent = `${Math.floor(count/33)} rounds of 33`;
  }
  paintTasbih();
  document.getElementById("tasbih-tap").addEventListener("click", ()=>{
    count++;
    localStorage.setItem("noor-tasbih-count", count);
    paintTasbih();
    if(navigator.vibrate) navigator.vibrate(15);
    if(count % 33 === 0) toast(`Round complete — ${count/33} × 33`);
  });
  document.getElementById("tasbih-reset").addEventListener("click", ()=>{
    count = 0; localStorage.setItem("noor-tasbih-count", 0); paintTasbih();
  });

  // ---- Duas ----
  const duaCats = ["All", ...new Set(DUAS.map(d=>d.cat))];
  let activeDuaCat = "All";
  const duaFilters = document.getElementById("dua-filters");
  duaFilters.innerHTML = duaCats.map(c=>`<button class="filter-btn ${c==='All'?'active':''}" data-c="${c}">${c}</button>`).join("");
  function renderDuas(){
    const items = DUAS.filter(d => activeDuaCat==="All" || d.cat===activeDuaCat);
    document.getElementById("dua-grid").innerHTML = items.map(d=>`
      <div class="card reveal in">
        <span class="chip chip-gold">${d.cat}</span>
        <h4 style="margin-top:10px;">${d.title}</h4>
        <p style="font-family:var(--font-arabic);font-size:22px;direction:rtl;color:var(--primary);line-height:1.9;">${d.ar}</p>
        <p style="font-style:italic;font-size:13.5px;">${d.translit}</p>
        <p style="font-size:14px;">${d.mean}</p>
      </div>`).join("");
  }
  duaFilters.querySelectorAll(".filter-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      duaFilters.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active"); activeDuaCat = btn.dataset.c; renderDuas();
    });
  });
  renderDuas();

  // ---- 99 Names ----
  function renderNames(filter=""){
    const f = filter.trim().toLowerCase();
    const items = NAMES_OF_ALLAH.filter(n => !f || n.trans.toLowerCase().includes(f) || n.mean.toLowerCase().includes(f));
    document.getElementById("names-grid").innerHTML = items.map(n=>`
      <div class="card reveal in text-center" style="padding:20px 14px;">
        <span class="chip" style="margin-bottom:10px;">${n.n}</span>
        <p style="font-family:var(--font-arabic);font-size:26px;color:var(--primary);margin-bottom:6px;">${n.ar}</p>
        <b style="font-size:14px;">${n.trans}</b>
        <p style="font-size:12.5px;margin:4px 0 0;">${n.mean}</p>
      </div>`).join("");
  }
  renderNames();
  document.getElementById("names-search").addEventListener("input", e=>renderNames(e.target.value));

  // ---- Zakat calculator ----
  document.getElementById("z-calc").addEventListener("click", ()=>{
    const val = id => parseFloat(document.getElementById(id).value) || 0;
    const total = val("z-cash") + val("z-gold") + val("z-invest") + val("z-owed") - val("z-debt");
    const nisab = val("z-nisab");
    const box = document.getElementById("z-result");
    box.style.display = "block";
    if(nisab > 0 && total < nisab){
      document.getElementById("z-amount").textContent = "0.00";
      document.getElementById("z-note").textContent = "Your net wealth is below the Nisab threshold, so Zakat is not currently due.";
    } else if(total <= 0){
      document.getElementById("z-amount").textContent = "0.00";
      document.getElementById("z-note").textContent = "Enter your assets above to calculate your Zakat.";
    } else {
      const zakat = total * 0.025;
      document.getElementById("z-amount").textContent = zakat.toLocaleString(undefined,{maximumFractionDigits:2});
      document.getElementById("z-note").textContent = `Based on net qualifying wealth of ${total.toLocaleString()} held for one lunar year.`;
    }
  });

  // ---- Islamic Events Calendar ----
  const EVENTS = [
    {name:"Mawlid al-Nabi ﷺ", date:"2026-08-25", desc:"Commemoration of the birth of Prophet Muhammad ﷺ."},
    {name:"Isra and Mi'raj", date:"2027-01-05", desc:"The Prophet's ﷺ night journey and ascension."},
    {name:"Ramadan Begins", date:"2027-02-08", desc:"The month of fasting, Qur'an and spiritual renewal."},
    {name:"Laylat al-Qadr (est. 27th night)", date:"2027-03-06", desc:"The Night of Decree, better than a thousand months."},
    {name:"Eid al-Fitr", date:"2027-03-09", desc:"Celebration marking the end of Ramadan."},
    {name:"Day of Arafah", date:"2027-05-15", desc:"The most blessed day of the year; fasting is highly recommended for non-pilgrims."},
    {name:"Eid al-Adha", date:"2027-05-16", desc:"The Festival of Sacrifice, honouring Prophet Ibrahim (AS)."},
    {name:"Islamic New Year 1449", date:"2027-06-06", desc:"The beginning of the new Hijri year."},
  ];
  function renderEvents(){
    const now = Date.now();
    document.getElementById("events-grid").innerHTML = EVENTS.map(e=>{
      const days = Math.ceil((new Date(e.date) - now) / 86400000);
      return `<div class="card reveal in">
        <span class="chip chip-gold">${days > 0 ? days + " days away" : "Recently passed"}</span>
        <h4 style="margin-top:10px;">${e.name}</h4>
        <p style="font-size:14px;">${e.desc}</p>
        <p style="font-size:12px;color:var(--text-muted);margin:0;">${new Date(e.date).toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"})} · dates are estimated, subject to moon sighting</p>
      </div>`;
    }).join("");
  }
  renderEvents();

  // ---- Hijri date converter ----
  document.getElementById("d-convert").addEventListener("click", async ()=>{
    const input = document.getElementById("d-input").value;
    if(!input){ toast("Pick a date first"); return; }
    const [y,m,d] = input.split("-");
    try{
      const res = await fetch(`https://api.aladhan.com/v1/gToH/${d}-${m}-${y}`);
      const data = await res.json();
      const h = data.data.hijri;
      document.getElementById("d-result").style.display = "block";
      document.getElementById("d-hijri").textContent = `${h.day} ${h.month.en} ${h.year} AH`;
    }catch(e){
      toast("Couldn't reach the conversion service — check your connection");
    }
  });
})();
