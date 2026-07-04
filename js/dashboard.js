/* Noor Islam — Dashboard: aggregates data already stored across the site */
(function(){
  const streak = JSON.parse(localStorage.getItem("noor-streak") || 'null') || {count:0};
  const bookmarks = JSON.parse(localStorage.getItem("noor-bookmarks") || "[]");
  const hadithBookmarks = JSON.parse(localStorage.getItem("noor-hadith-bookmarks") || "[]");
  const tasbihCount = parseInt(localStorage.getItem("noor-tasbih-count") || "0", 10);
  const lastRead = JSON.parse(localStorage.getItem("noor-last-read") || "null");
  const leaderboard = JSON.parse(localStorage.getItem("noor-quiz-leaderboard") || "[]");
  const memoryBest = localStorage.getItem("noor-memory-best");
  const bestQuiz = leaderboard.length ? Math.max(...leaderboard.map(l=>l.score)) : 0;

  document.getElementById("stat-cards").innerHTML = `
    <div class="card text-center"><div style="font-size:30px;">🔥</div><h3 style="margin:8px 0 2px;">${streak.count}</h3><p style="font-size:13px;">Day Streak</p></div>
    <div class="card text-center"><div style="font-size:30px;">⭐</div><h3 style="margin:8px 0 2px;">${bookmarks.length + hadithBookmarks.length}</h3><p style="font-size:13px;">Bookmarks Saved</p></div>
    <div class="card text-center"><div style="font-size:30px;">📿</div><h3 style="margin:8px 0 2px;">${tasbihCount}</h3><p style="font-size:13px;">Total Tasbih Count</p></div>
    <div class="card text-center"><div style="font-size:30px;">🧠</div><h3 style="margin:8px 0 2px;">${leaderboard.length}</h3><p style="font-size:13px;">Quizzes Completed</p></div>
  `;

  document.getElementById("reading-history").innerHTML = lastRead
    ? `<div class="glass" style="padding:16px;display:flex;justify-content:space-between;align-items:center;">
         <div><b>Surah ${lastRead.n} — ${lastRead.name}</b><br><small style="color:var(--text-muted);">Last opened</small></div>
         <a href="quran.html?surah=${lastRead.n}" class="btn btn-primary btn-sm">Continue →</a>
       </div>`
    : `<p style="color:var(--text-muted);font-size:14px;">You haven't started reading yet — <a href="quran.html" style="color:var(--accent-strong);font-weight:700;">open the Qur'an</a> to begin.</p>`;

  document.getElementById("bookmarked-ayahs").innerHTML = bookmarks.length
    ? bookmarks.slice().reverse().map(b=>`
        <div style="padding:10px 0;border-bottom:1px solid var(--border);">
          <p style="font-family:var(--font-arabic);direction:rtl;font-size:18px;margin:0 0 4px;color:var(--primary);">${b.text}</p>
          <a href="quran.html?surah=${b.surah}" style="font-size:12px;color:var(--text-muted);">Surah ${b.surah}, Ayah ${b.ayah}</a>
        </div>`).join("")
    : `<p style="color:var(--text-muted);font-size:14px;">No bookmarked ayahs yet — tap the ★ icon while reading.</p>`;

  // ---- Achievement badges ----
  const BADGES = [
    {icon:"🔥", name:"3-Day Streak", earned: streak.count >= 3},
    {icon:"🔥", name:"7-Day Streak", earned: streak.count >= 7},
    {icon:"⭐", name:"First Bookmark", earned: (bookmarks.length + hadithBookmarks.length) >= 1},
    {icon:"📚", name:"Bookworm (5 bookmarks)", earned: (bookmarks.length + hadithBookmarks.length) >= 5},
    {icon:"📿", name:"100 Tasbih", earned: tasbihCount >= 100},
    {icon:"📿", name:"1000 Tasbih", earned: tasbihCount >= 1000},
    {icon:"🧠", name:"Quiz Taker", earned: leaderboard.length >= 1},
    {icon:"🏆", name:"Quiz Master (score 5+)", earned: bestQuiz >= 5},
    {icon:"🧩", name:"Memory Match Solved", earned: !!memoryBest},
    {icon:"📖", name:"Started Reading", earned: !!lastRead},
  ];
  document.getElementById("badges-grid").innerHTML = BADGES.map(b=>`
    <div class="card text-center" style="opacity:${b.earned?1:.35};padding:16px 10px;">
      <div style="font-size:28px;">${b.icon}</div>
      <p style="font-size:12px;font-weight:700;margin:6px 0 0;">${b.name}</p>
      <small style="color:var(--text-muted);">${b.earned ? "Earned" : "Locked"}</small>
    </div>`).join("");

  document.getElementById("reset-all").addEventListener("click", ()=>{
    if(!confirm("This will permanently clear your streak, bookmarks, scores and preferences on this device. Continue?")) return;
    ["noor-streak","noor-bookmarks","noor-hadith-bookmarks","noor-tasbih-count","noor-last-read",
     "noor-quiz-leaderboard","noor-memory-best","noor-theme","noor-notify","noor-adhan","noor-reciter",
     "noor-profile","noor-threads","noor-community-lang","noor-yt-key","noor-install-dismissed"]
      .forEach(k => localStorage.removeItem(k));
    toast("All local data has been reset");
    setTimeout(()=> location.reload(), 1000);
  });
})();
