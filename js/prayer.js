/* Noor Islam — Prayer times, monthly timetable & Qibla finder */

(function(){
  const KAABA = {lat:21.4225, lon:39.8262};
  const PRAYERS = [["Fajr","🌅"],["Dhuhr","☀️"],["Asr","🌤️"],["Maghrib","🌇"],["Isha","🌙"]];
  let timings = null;
  let qiblaBearing = 0;

  function renderToday(t){
    const grid = document.getElementById("today-grid");
    grid.innerHTML = PRAYERS.map(([name,icon])=>`
      <div class="card text-center">
        <div style="font-size:22px;">${icon}</div>
        <div style="color:var(--text-muted);font-size:13px;margin:6px 0;">${name}</div>
        <div style="font-weight:800;color:var(--primary);font-size:17px;">${t[name]}</div>
      </div>`).join("");
  }

  function tickCountdown(){
    if(!timings) return;
    const now = new Date();
    const order = ["Fajr","Dhuhr","Asr","Maghrib","Isha"];
    let target = null, name = null;
    for(const n of order){
      const [h,m] = timings[n].split(":").map(Number);
      const t = new Date(); t.setHours(h,m,0,0);
      if(t > now){ target = t; name = n; break; }
    }
    if(!target){
      const [h,m] = timings.Fajr.split(":").map(Number);
      target = new Date(); target.setDate(target.getDate()+1); target.setHours(h,m,0,0);
      name = "Fajr";
    }
    const diff = target - now;
    const hh = String(Math.floor(diff/3600000)).padStart(2,"0");
    const mm = String(Math.floor((diff%3600000)/60000)).padStart(2,"0");
    const ss = String(Math.floor((diff%60000)/1000)).padStart(2,"0");
    document.getElementById("next-prayer-name").textContent = name;
    document.getElementById("next-prayer-countdown").textContent = `${hh}:${mm}:${ss}`;
  }
  setInterval(tickCountdown, 1000);

  async function loadMonthly(lat, lon){
    const now = new Date();
    try{
      const res = await fetch(`https://api.aladhan.com/v1/calendar?latitude=${lat}&longitude=${lon}&method=2&month=${now.getMonth()+1}&year=${now.getFullYear()}`);
      const data = await res.json();
      const tbody = document.getElementById("month-table");
      tbody.innerHTML = data.data.map(d=>`
        <tr style="border-top:1px solid var(--border);">
          <td style="padding:8px;">${d.date.gregorian.day} ${d.date.gregorian.month.en.slice(0,3)}</td>
          <td>${d.timings.Fajr.split(" ")[0]}</td>
          <td>${d.timings.Dhuhr.split(" ")[0]}</td>
          <td>${d.timings.Asr.split(" ")[0]}</td>
          <td>${d.timings.Maghrib.split(" ")[0]}</td>
          <td>${d.timings.Isha.split(" ")[0]}</td>
        </tr>`).join("");
    }catch(e){
      document.getElementById("month-table").innerHTML = `<tr><td colspan="6" style="padding:20px;text-align:center;">Couldn't load the monthly timetable — check your connection.</td></tr>`;
    }
  }

  // ---- Notifications ----
  const notifyBtn = document.getElementById("notify-toggle");
  function paintNotifyBtn(){
    const on = notificationsEnabled() && (typeof Notification !== "undefined") && Notification.permission === "granted";
    notifyBtn.textContent = on ? "✓ Notifications On" : "Enable Notifications";
  }
  paintNotifyBtn();
  notifyBtn.addEventListener("click", async ()=>{
    if(notificationsEnabled()){
      localStorage.setItem("noor-notify","off");
      paintNotifyBtn();
      toast("Prayer notifications turned off");
      return;
    }
    const granted = await requestNotifyPermission();
    if(granted){
      localStorage.setItem("noor-notify","on");
      paintNotifyBtn();
      toast("Notifications enabled — you'll be alerted at each prayer time");
      if(timings) schedulePrayerNotifications(timings);
    } else {
      toast("Notification permission was not granted");
    }
  });

  async function loadToday(lat, lon, label){
    document.getElementById("location-line").textContent = `Showing accurate prayer times for ${label}`;
    try{
      const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`);
      const data = await res.json();
      timings = data.data.timings;
      renderToday(timings);
      tickCountdown();
      schedulePrayerNotifications(timings);
    }catch(e){
      document.getElementById("location-line").textContent = "Couldn't fetch prayer times — please check your connection.";
    }
    loadMonthly(lat, lon);
  }

  function computeQibla(lat, lon){
    const φ1 = lat*Math.PI/180, φ2 = KAABA.lat*Math.PI/180;
    const Δλ = (KAABA.lon - lon)*Math.PI/180;
    const y = Math.sin(Δλ)*Math.cos(φ2);
    const x = Math.cos(φ1)*Math.sin(φ2) - Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
    let brng = Math.atan2(y,x)*180/Math.PI;
    return (brng+360)%360;
  }

  function setQiblaVisual(headingOffset){
    const arrow = document.getElementById("qibla-arrow");
    const rotation = qiblaBearing - (headingOffset||0);
    arrow.style.transform = `rotate(${rotation}deg)`;
    document.getElementById("qibla-degrees").textContent = `${Math.round(qiblaBearing)}° from North`;
  }

  document.getElementById("enable-compass").addEventListener("click", ()=>{
    if(typeof DeviceOrientationEvent !== "undefined" && typeof DeviceOrientationEvent.requestPermission === "function"){
      DeviceOrientationEvent.requestPermission().then(state=>{
        if(state === "granted"){ attachCompass(); toast("Compass enabled"); }
        else toast("Compass permission denied");
      }).catch(()=> toast("Compass not supported on this device"));
    } else {
      attachCompass();
      toast("Compass enabled (or unsupported on this device)");
    }
  });

  function attachCompass(){
    window.addEventListener("deviceorientationabsolute", handleOrientation, true);
    window.addEventListener("deviceorientation", handleOrientation, true);
  }
  function handleOrientation(e){
    const heading = e.webkitCompassHeading || (e.alpha != null ? 360 - e.alpha : 0);
    setQiblaVisual(heading);
  }

  function start(lat, lon, label){
    qiblaBearing = computeQibla(lat, lon);
    setQiblaVisual(0);
    loadToday(lat, lon, label);
  }

  document.getElementById("find-mosques").addEventListener("click", ()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        pos => window.open(`https://www.google.com/maps/search/mosques/@${pos.coords.latitude},${pos.coords.longitude},14z`, "_blank"),
        () => window.open("https://www.google.com/maps/search/mosques+near+me", "_blank")
      );
    } else {
      window.open("https://www.google.com/maps/search/mosques+near+me", "_blank");
    }
  });

  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      pos => start(pos.coords.latitude, pos.coords.longitude, "your current location"),
      ()  => start(KAABA.lat, KAABA.lon, "Makkah (location unavailable)"),
      {timeout:6000}
    );
  } else {
    start(KAABA.lat, KAABA.lon, "Makkah (location unavailable)");
  }
})();
