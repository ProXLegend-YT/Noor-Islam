/* Noor Islam — shared site behaviour: header, footer, theme, menu, utilities */

const NAV_LINKS = [
  {href:"index.html",label:"Home"},
  {href:"quran.html",label:"Qur'an"},
  {href:"prayer-times.html",label:"Prayer Times"},
  {href:"hadith.html",label:"Hadith"},
  {href:"library.html",label:"Library"},
  {href:"videos.html",label:"Videos"},
  {href:"tools.html",label:"Tools"},
  {href:"quiz.html",label:"Quiz"},
  {href:"community.html",label:"Community"},
  {href:"donate.html",label:"Donate"},
  {href:"contact.html",label:"Contact"},
];

function currentPage(){
  const p = location.pathname.split("/").pop();
  return p === "" ? "index.html" : p;
}

function renderHeader(){
  const mount = document.getElementById("site-header");
  if(!mount) return;
  const cur = currentPage();
  mount.innerHTML = `
  <header class="site-header">
    <div class="container nav-inner">
      <a href="index.html" class="brand"><span class="star8" aria-hidden="true"></span> Noor <span>Islam</span></a>
      <nav class="nav-links" aria-label="Primary">
        ${NAV_LINKS.map(l=>`<a href="${l.href}" class="${l.href===cur?'active':''}">${l.label}</a>`).join("")}
      </nav>
      <div class="nav-actions">
        <button class="icon-btn" id="theme-toggle" aria-label="Toggle dark mode" title="Toggle dark mode">🌙</button>
        <a href="community.html" class="btn btn-gold btn-sm" style="display:none" id="login-cta">Sign in</a>
        <button class="hamburger" id="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
      </div>
    </div>
  </header>
  <div class="mobile-nav" id="mobile-nav">
    ${NAV_LINKS.map(l=>`<a href="${l.href}">${l.label}</a>`).join("")}
  </div>`;

  const burger = document.getElementById("hamburger");
  const mnav = document.getElementById("mobile-nav");
  burger.addEventListener("click",()=>{
    burger.classList.toggle("open");
    mnav.classList.toggle("open");
  });
  mnav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
    burger.classList.remove("open"); mnav.classList.remove("open");
  }));
}

function renderFooter(){
  const mount = document.getElementById("site-footer");
  if(!mount) return;
  mount.innerHTML = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-quote">
        <p>"وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا"</p>
        <span>"And whoever fears Allah, He will make a way out for him." — Surah At-Talaq 65:2</span>
      </div>
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="brand" style="color:#fff;margin-bottom:14px;display:inline-flex;"><span class="star8" aria-hidden="true"></span> Noor <span>Islam</span></a>
          <p>A digital home for the Qur'an, authentic Hadith, prayer times, and daily reminders — built to serve Muslims worldwide.</p>
          <div class="social-row">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">◎</a>
            <a href="#" aria-label="YouTube">▶</a>
            <a href="#" aria-label="Twitter / X">𝕏</a>
          </div>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><a href="quran.html">Read Qur'an</a></li>
            <li><a href="hadith.html">Hadith Collection</a></li>
            <li><a href="prayer-times.html">Prayer Times</a></li>
            <li><a href="library.html">Islamic Library</a></li>
          </ul>
        </div>
        <div>
          <h4>Community</h4>
          <ul>
            <li><a href="community.html">Discussion Forum</a></li>
            <li><a href="quiz.html">Islamic Quiz</a></li>
            <li><a href="donate.html">Donate</a></li>
            <li><a href="videos.html">Videos</a></li>
          </ul>
        </div>
        <div>
          <h4>Support</h4>
          <ul>
            <li><a href="contact.html">Contact Us</a></li>
            <li><a href="contact.html#faq">FAQ</a></li>
            <li><a href="tools.html">Islamic Tools</a></li>
            <li><a href="#" id="footer-year-link">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© <span id="year"></span> Noor Islam. Built with faith, for the Ummah.</span>
        <span>May Allah accept our efforts. آمين</span>
      </div>
    </div>
  </footer>`;
  document.getElementById("year").textContent = new Date().getFullYear();
}

function initTheme(){
  const saved = localStorage.getItem("noor-theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);
  const btn = document.getElementById("theme-toggle");
  if(btn) btn.textContent = saved === "dark" ? "☀️" : "🌙";
  btn?.addEventListener("click", ()=>{
    const now = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", now);
    localStorage.setItem("noor-theme", now);
    btn.textContent = now === "dark" ? "☀️" : "🌙";
  });
}

function initReveal(){
  const els = document.querySelectorAll(".reveal");
  if(!els.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  },{threshold:.12});
  els.forEach(el=>io.observe(el));
}

function initToTop(){
  const btn = document.createElement("button");
  btn.className = "to-top"; btn.id = "to-top"; btn.innerHTML = "↑"; btn.setAttribute("aria-label","Back to top");
  document.body.appendChild(btn);
  window.addEventListener("scroll", ()=> btn.classList.toggle("show", window.scrollY > 500));
  btn.addEventListener("click", ()=> window.scrollTo({top:0,behavior:"smooth"}));
}

function toast(msg, ms=2600){
  let el = document.getElementById("noor-toast");
  if(!el){
    el = document.createElement("div");
    el.className = "toast"; el.id = "noor-toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=> el.classList.remove("show"), ms);
}

function registerSW(){
  if("serviceWorker" in navigator){
    window.addEventListener("load", ()=>{
      navigator.serviceWorker.register("sw.js").catch(()=>{});
    });
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  renderHeader();
  renderFooter();
  initTheme();
  initReveal();
  initToTop();
  registerSW();
});
