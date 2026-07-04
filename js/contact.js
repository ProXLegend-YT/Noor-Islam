/* Noor Islam — Contact page logic */
(function(){
  document.getElementById("contact-form").addEventListener("submit", (e)=>{
    e.preventDefault();
    toast("Message sent — JazakAllah khair, we'll reply soon!");
    e.target.reset();
  });

  let mood = null;
  document.querySelectorAll("#feedback-emoji button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.querySelectorAll("#feedback-emoji button").forEach(b=>b.style.transform="scale(1)");
      btn.style.transform = "scale(1.3)";
      mood = btn.dataset.v;
    });
  });
  document.getElementById("feedback-submit").addEventListener("click", ()=>{
    if(!mood){ toast("Pick a mood first"); return; }
    toast("Thank you for your feedback!");
    document.getElementById("feedback-text").value = "";
  });

  const FAQS = [
    {q:"Is Noor Islam free to use?",a:"Yes — every feature, including the Qur'an reader, Hadith collection and prayer times, is completely free."},
    {q:"How are prayer times calculated?",a:"We use your device's location together with standard astronomical calculation methods to give accurate Fajr, Dhuhr, Asr, Maghrib and Isha times for your area."},
    {q:"Can I use Noor Islam offline?",a:"Core pages and previously loaded content are cached for offline use. Live features like prayer times and Qur'an audio need an internet connection to update."},
    {q:"How do I report incorrect content?",a:"Use the contact form above and select 'Content correction' — our team reviews every report."},
    {q:"Is my donation secure?",a:"This build ships with a demo checkout only. Before accepting real donations, connect a licensed payment processor such as Stripe or PayPal."},
  ];
  document.getElementById("faq-list").innerHTML = FAQS.map((f,i)=>`
    <div class="card" style="margin-bottom:12px;cursor:pointer;" data-i="${i}">
      <div class="flex justify-between items-center">
        <b>${f.q}</b><span class="faq-arrow">+</span>
      </div>
      <p class="faq-answer" style="display:none;margin-top:10px;margin-bottom:0;">${f.a}</p>
    </div>`).join("");
  document.querySelectorAll("#faq-list .card").forEach(card=>{
    card.addEventListener("click", ()=>{
      const ans = card.querySelector(".faq-answer");
      const arrow = card.querySelector(".faq-arrow");
      const open = ans.style.display === "block";
      ans.style.display = open ? "none" : "block";
      arrow.textContent = open ? "+" : "−";
    });
  });
})();
