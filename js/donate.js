/* Noor Islam — Donate page logic (demo checkout, no real payment processing) */
(function(){
  const CAMPAIGNS = [
    {id:1,title:"Build a Mosque in Rural Mali",raised:38400,goal:60000,icon:"🕌",desc:"Construction funds for a community mosque serving over 900 worshippers."},
    {id:2,title:"Orphan Sponsorship Programme",raised:21750,goal:30000,icon:"🧕",desc:"Monthly sponsorship covering education, food and healthcare for orphaned children."},
    {id:3,title:"Ramadan Food Aid",raised:54200,goal:80000,icon:"🍚",desc:"Iftar meals and food packages for families across South &amp; Southeast Asia."},
  ];

  document.getElementById("campaign-grid").innerHTML = CAMPAIGNS.map(c=>{
    const pct = Math.min(100, Math.round((c.raised/c.goal)*100));
    return `
    <div class="card reveal">
      <div style="font-size:32px;">${c.icon}</div>
      <h4>${c.title}</h4>
      <p style="font-size:14px;">${c.desc}</p>
      <div class="progress"><i style="width:${pct}%;"></i></div>
      <div class="flex justify-between" style="font-size:12.5px;margin:8px 0 16px;color:var(--text-muted);">
        <span>$${c.raised.toLocaleString()} raised</span><span>${pct}% of $${c.goal.toLocaleString()}</span>
      </div>
      <button class="btn btn-primary btn-block btn-sm select-campaign" data-t="${c.title}">Donate to this project</button>
    </div>`;
  }).join("");

  const chipAmounts = [25,50,100,250,500];
  let selectedAmount = null;
  const chipRow = document.getElementById("amount-chips");
  chipRow.innerHTML = chipAmounts.map(a=>`<button class="filter-btn" data-a="${a}">$${a}</button>`).join("");
  chipRow.querySelectorAll(".filter-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      chipRow.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      selectedAmount = Number(btn.dataset.a);
      document.getElementById("custom-amount").value = "";
    });
  });
  document.getElementById("custom-amount").addEventListener("input", ()=>{
    selectedAmount = null;
    chipRow.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));
  });

  document.querySelectorAll(".select-campaign").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.getElementById("checkout-title").textContent = `Donate to: ${btn.dataset.t}`;
      document.getElementById("checkout-title").scrollIntoView({behavior:"smooth", block:"center"});
    });
  });

  document.getElementById("donate-btn").addEventListener("click", ()=>{
    const custom = parseFloat(document.getElementById("custom-amount").value);
    const amount = selectedAmount || custom;
    if(!amount || amount <= 0){ toast("Choose or enter an amount first"); return; }
    const method = document.getElementById("pay-method").value;
    const recurring = document.getElementById("recurring").checked ? " (monthly)" : "";
    toast(`Demo checkout: $${amount}${recurring} via ${method} — connect a real payment gateway to process this.`, 4200);
  });
})();
