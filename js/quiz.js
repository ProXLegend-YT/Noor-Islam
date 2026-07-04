/* Noor Islam — Quiz page logic */
(function(){
  let level, questions, idx, score;

  function start(lvl){
    level = lvl;
    questions = [...QUIZ_QUESTIONS[lvl]].sort(()=>Math.random()-0.5);
    idx = 0; score = 0;
    document.getElementById("quiz-setup").style.display = "none";
    document.getElementById("quiz-done").style.display = "none";
    document.getElementById("quiz-play").style.display = "block";
    showQuestion();
  }

  function showQuestion(){
    const q = questions[idx];
    document.getElementById("q-progress").textContent = `Question ${idx+1} of ${questions.length}`;
    document.getElementById("q-score").textContent = `Score: ${score}`;
    document.getElementById("q-text").textContent = q.q;
    document.getElementById("q-next").style.display = "none";
    document.getElementById("q-options").innerHTML = q.options.map((o,i)=>
      `<button class="filter-btn" style="text-align:left;padding:14px 18px;" data-i="${i}">${o}</button>`
    ).join("");
    document.querySelectorAll("#q-options button").forEach(btn=>{
      btn.addEventListener("click", ()=> answer(Number(btn.dataset.i)));
    });
  }

  function answer(i){
    const q = questions[idx];
    document.querySelectorAll("#q-options button").forEach((btn,bi)=>{
      btn.disabled = true;
      if(bi === q.a) btn.style.cssText += "background:rgba(23,114,89,.18);border-color:var(--emerald-600);";
      if(bi === i && i !== q.a) btn.style.cssText += "background:rgba(180,40,40,.14);border-color:#b42828;";
    });
    if(i === q.a) score++;
    document.getElementById("q-score").textContent = `Score: ${score}`;
    document.getElementById("q-next").style.display = "inline-flex";
  }

  document.getElementById("q-next").addEventListener("click", ()=>{
    idx++;
    if(idx < questions.length) showQuestion();
    else finish();
  });

  function finish(){
    document.getElementById("quiz-play").style.display = "none";
    document.getElementById("quiz-done").style.display = "block";
    document.getElementById("final-score").textContent = `You scored ${score} out of ${questions.length} (${level})`;
  }

  function leaderboardKey(){ return "noor-quiz-leaderboard"; }
  function getLeaderboard(){ return JSON.parse(localStorage.getItem(leaderboardKey()) || "[]"); }
  function renderLeaderboard(){
    const board = getLeaderboard().sort((a,b)=>b.score-a.score).slice(0,10);
    document.getElementById("leaderboard").innerHTML = board.map(e=>
      `<li>${e.name} — <b>${e.score}/${e.total}</b> <span style="color:var(--text-muted);font-size:12px;">(${e.level})</span></li>`
    ).join("") || "<p style='color:var(--text-muted);font-size:13px;'>No scores yet — be the first!</p>";
  }
  renderLeaderboard();

  document.getElementById("save-score").addEventListener("click", ()=>{
    const name = document.getElementById("player-name").value.trim() || "Anonymous";
    const board = getLeaderboard();
    board.push({name, score, total: questions.length, level, ts: Date.now()});
    localStorage.setItem(leaderboardKey(), JSON.stringify(board));
    renderLeaderboard();
    toast("Score saved to leaderboard");
  });

  document.getElementById("quiz-restart").addEventListener("click", ()=>{
    document.getElementById("quiz-done").style.display = "none";
    document.getElementById("quiz-setup").style.display = "block";
  });

  document.querySelectorAll("[data-lvl]").forEach(btn=>{
    btn.addEventListener("click", ()=> start(btn.dataset.lvl));
  });
})();
