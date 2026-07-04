/* Noor Islam — Community forum (client-side demo backed by localStorage) */
(function(){
  const PKEY = "noor-profile";
  const TKEY = "noor-threads";

  function getProfile(){ return JSON.parse(localStorage.getItem(PKEY) || "null"); }
  function setProfile(p){ localStorage.setItem(PKEY, JSON.stringify(p)); }

  function seedThreads(){
    return [
      {id:1,title:"How do I stay consistent with Tahajjud?",body:"I can pray it for a few nights then I fall off. Any advice from those who've built the habit?",cat:"Islamic Q&A",author:"Bilal_92",ts:Date.now()-864e5*2,replies:[
        {author:"UmmAisha",text:"Start with just 2 rak'ahs, and set your alarm 15 minutes before Fajr rather than the middle of the night. Consistency over quantity.",ts:Date.now()-864e5}
      ]},
      {id:2,title:"Reflection: Surah Al-Kahf on Fridays",body:"Reading it this morning, the story of the two men with gardens really struck me — how quickly blessings can be tested. What part moved you most?",cat:"Reflections",author:"Yusuf.K",ts:Date.now()-864e5*4,replies:[]},
      {id:3,title:"Welcome to the Noor Islam community",body:"Introduce yourself below — where are you writing from, and what's one thing you're working on in your deen this month?",cat:"Announcements",author:"Noor Team",ts:Date.now()-864e5*7,replies:[
        {author:"Sara_M",text:"Writing from Jakarta! Working on memorising Juz 30 this month, please make dua for me.",ts:Date.now()-864e5*6}
      ]},
    ];
  }
  function getThreads(){
    let t = JSON.parse(localStorage.getItem(TKEY) || "null");
    if(!t){ t = seedThreads(); localStorage.setItem(TKEY, JSON.stringify(t)); }
    return t;
  }
  function saveThreads(t){ localStorage.setItem(TKEY, JSON.stringify(t)); }

  function renderProfile(){
    const p = getProfile();
    const box = document.getElementById("profile-card");
    if(p){
      box.innerHTML = `<div class="flex items-center gap-12">
        <div style="width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,var(--gold-400),var(--emerald-700));display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;">${p.name[0].toUpperCase()}</div>
        <div><b>${p.name}</b><br><small style="color:var(--text-muted);">Signed in locally on this device</small></div>
        <button class="btn btn-outline btn-sm" style="margin-left:auto;" id="signout-btn">Sign out</button>
      </div>`;
      document.getElementById("signout-btn").addEventListener("click", ()=>{ localStorage.removeItem(PKEY); renderProfile(); });
    } else {
      box.innerHTML = `<h4>Join the conversation</h4>
        <div class="field"><input type="text" id="signin-name" placeholder="Choose a display name"></div>
        <button class="btn btn-primary btn-block" id="signin-btn">Sign in (this device)</button>`;
      document.getElementById("signin-btn").addEventListener("click", ()=>{
        const name = document.getElementById("signin-name").value.trim();
        if(!name){ toast("Enter a display name"); return; }
        setProfile({name}); renderProfile();
      });
    }
  }
  renderProfile();

  const cats = ["All","General Discussion","Islamic Q&A","Reflections","Announcements"];
  let activeCat = "All";
  const filterRow = document.getElementById("forum-filters");
  filterRow.innerHTML = cats.map(c=>`<button class="filter-btn ${c==='All'?'active':''}" data-c="${c}">${c}</button>`).join("");
  filterRow.querySelectorAll(".filter-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      filterRow.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active"); activeCat = btn.dataset.c; renderThreads();
    });
  });

  function timeAgo(ts){
    const days = Math.floor((Date.now()-ts)/864e5);
    if(days<1) return "today";
    if(days===1) return "1 day ago";
    return `${days} days ago`;
  }

  function renderThreads(){
    const threads = getThreads().filter(t=>activeCat==="All"||t.cat===activeCat).sort((a,b)=>b.ts-a.ts);
    document.getElementById("thread-list").innerHTML = threads.map(t=>`
      <div class="card reveal in" style="margin-bottom:18px;">
        <div class="flex justify-between items-center" style="margin-bottom:10px;">
          <span class="chip chip-gold">${t.cat}</span>
          <small style="color:var(--text-muted);">by ${t.author} · ${timeAgo(t.ts)}</small>
        </div>
        <h4 style="margin-bottom:6px;">${t.title}</h4>
        <p>${t.body}</p>
        <div id="replies-${t.id}" style="border-top:1px solid var(--border);padding-top:12px;margin-top:8px;">
          ${t.replies.map(r=>`<div style="margin-bottom:10px;font-size:14px;"><b>${r.author}:</b> ${r.text} <small style="color:var(--text-muted);">· ${timeAgo(r.ts)}</small></div>`).join("")}
        </div>
        <div class="flex gap-8" style="margin-top:10px;">
          <input type="text" placeholder="Write a reply…" class="reply-input" data-id="${t.id}" style="flex:1;padding:10px 14px;border-radius:100px;border:1px solid var(--border);background:var(--surface);">
          <button class="btn btn-outline btn-sm reply-btn" data-id="${t.id}">Reply</button>
        </div>
      </div>`).join("") || `<p style="text-align:center;padding:30px 0;">No discussions in this category yet — start one above!</p>`;

    document.querySelectorAll(".reply-btn").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        const p = getProfile();
        if(!p){ toast("Sign in to reply"); return; }
        const input = document.querySelector(`.reply-input[data-id="${btn.dataset.id}"]`);
        if(!input.value.trim()) return;
        const threads = getThreads();
        const t = threads.find(x=>x.id==btn.dataset.id);
        t.replies.push({author:p.name, text:input.value.trim(), ts:Date.now()});
        saveThreads(threads);
        renderThreads();
      });
    });
  }
  renderThreads();

  document.getElementById("post-submit").addEventListener("click", ()=>{
    const p = getProfile();
    if(!p){ toast("Sign in to post"); return; }
    const title = document.getElementById("post-title").value.trim();
    const body = document.getElementById("post-body").value.trim();
    if(!title){ toast("Give your post a title"); return; }
    const threads = getThreads();
    threads.push({id:Date.now(), title, body, cat:document.getElementById("post-cat").value, author:p.name, ts:Date.now(), replies:[]});
    saveThreads(threads);
    document.getElementById("post-title").value = "";
    document.getElementById("post-body").value = "";
    renderThreads();
    toast("Discussion posted");
  });
})();
