/**
 * Synastry (Burç Uyumu) Sayfa Mantığı
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // DOM
  // ============================================
  const calcBtn = document.getElementById('synCalcBtn');
  const resultsSection = document.getElementById('synResults');
  const formSection = document.getElementById('synFormSection');

  // Kişi 1
  const p1 = {
    name: document.getElementById('p1Name'),
    day: document.getElementById('p1Day'),
    month: document.getElementById('p1Month'),
    year: document.getElementById('p1Year'),
    hour: document.getElementById('p1Hour'),
    minute: document.getElementById('p1Minute'),
    city: document.getElementById('p1City'),
    district: document.getElementById('p1District')
  };

  // Kişi 2
  const p2 = {
    name: document.getElementById('p2Name'),
    day: document.getElementById('p2Day'),
    month: document.getElementById('p2Month'),
    year: document.getElementById('p2Year'),
    hour: document.getElementById('p2Hour'),
    minute: document.getElementById('p2Minute'),
    city: document.getElementById('p2City'),
    district: document.getElementById('p2District')
  };

  // ============================================
  // YILDIZ ARKAPLANI
  // ============================================
  function createStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [], shootingStars = [], w, h;
    function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight * 3; }
    function initStars() {
      stars = [];
      const count = Math.floor((w * h) / 3500);
      for (let i = 0; i < count; i++) {
        stars.push({ x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.5+0.3, brightness: Math.random(), speed: Math.random()*0.0008+0.0002, phase: Math.random()*Math.PI*2 });
      }
    }
    function spawnShooting() {
      if (shootingStars.length > 2 || Math.random() > 0.003) return;
      shootingStars.push({ x: Math.random()*w*0.8, y: Math.random()*h*0.3, len: Math.random()*80+40, speed: Math.random()*8+6, angle: Math.PI/4+Math.random()*0.3, life: 1, decay: Math.random()*0.015+0.01 });
    }
    function draw(time) {
      ctx.clearRect(0,0,w,h);
      stars.forEach(s => {
        const tw = 0.5+0.5*Math.sin(time*s.speed+s.phase);
        const a = s.brightness*tw*0.8+0.1;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle = `rgba(220,210,255,${a})`; ctx.fill();
        if (s.r > 1.2) { ctx.beginPath(); ctx.arc(s.x,s.y,s.r*3,0,Math.PI*2); ctx.fillStyle=`rgba(200,180,255,${a*0.1})`; ctx.fill(); }
      });
      spawnShooting();
      shootingStars = shootingStars.filter(s => s.life > 0);
      shootingStars.forEach(s => {
        const tx=s.x-Math.cos(s.angle)*s.len, ty=s.y-Math.sin(s.angle)*s.len;
        const g=ctx.createLinearGradient(tx,ty,s.x,s.y);
        g.addColorStop(0,`rgba(255,255,255,0)`); g.addColorStop(0.7,`rgba(200,180,255,${s.life*0.4})`); g.addColorStop(1,`rgba(255,255,255,${s.life*0.9})`);
        ctx.beginPath(); ctx.moveTo(tx,ty); ctx.lineTo(s.x,s.y); ctx.strokeStyle=g; ctx.lineWidth=1.5; ctx.stroke();
        ctx.beginPath(); ctx.arc(s.x,s.y,2,0,Math.PI*2); ctx.fillStyle=`rgba(255,255,255,${s.life})`; ctx.fill();
        s.x+=Math.cos(s.angle)*s.speed; s.y+=Math.sin(s.angle)*s.speed; s.life-=s.decay;
      });
      requestAnimationFrame(draw);
    }
    resize(); initStars();
    window.addEventListener('resize', () => { resize(); initStars(); });
    requestAnimationFrame(draw);
  }

  function createNebula() {
    const container = document.getElementById('nebula');
    if (!container) return;
    const colors = ['#6a0dad','#1a237e','#004d40','#b71c1c','#1565c0'];
    for (let i = 0; i < 5; i++) {
      const blob = document.createElement('div');
      blob.className = 'nebula-blob';
      blob.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${200+Math.random()*400}px;height:${200+Math.random()*400}px;animation-delay:${Math.random()*20}s;animation-duration:${25+Math.random()*20}s;opacity:${0.03+Math.random()*0.04};background:radial-gradient(ellipse,${colors[i%5]},transparent 70%)`;
      container.appendChild(blob);
    }
  }

  // ============================================
  // FORM YARDIMCILARI
  // ============================================
  function populateCities(selectEl) {
    const cities = Locations.getCityList();
    selectEl.innerHTML = '<option value="">İl Seçin</option>';
    cities.forEach(c => { const o = document.createElement('option'); o.value = c; o.textContent = c; selectEl.appendChild(o); });
  }

  function bindDistrictUpdate(cityEl, districtEl) {
    cityEl.addEventListener('change', () => {
      districtEl.innerHTML = '<option value="">İlçe (opsiyonel)</option>';
      districtEl.disabled = true;
      if (!cityEl.value) return;
      const districts = Locations.getDistricts(cityEl.value);
      if (districts.length > 0) {
        districtEl.disabled = false;
        districts.forEach(d => { const o = document.createElement('option'); o.value = d; o.textContent = d; districtEl.appendChild(o); });
      }
    });
  }

  // Auto tab
  function bindAutoTab(inputs) {
    inputs.forEach((inp, idx, arr) => {
      inp.addEventListener('input', () => {
        const maxLen = inp.placeholder === 'YYYY' ? 4 : 2;
        if (inp.value.length >= maxLen && idx < arr.length - 1) arr[idx+1].focus();
      });
    });
  }

  function getDate(person) {
    const d = parseInt(person.day.value), m = parseInt(person.month.value), y = parseInt(person.year.value);
    if (!d||!m||!y||d<1||d>31||m<1||m>12||y<1900||y>2030) return null;
    return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }

  function getTime(person) {
    const h = parseInt(person.hour.value), min = parseInt(person.minute.value);
    if (isNaN(h)||isNaN(min)||h<0||h>23||min<0||min>59) return null;
    return `${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}`;
  }

  function showError(msg) {
    const existing = document.querySelector('.error-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
  }

  // ============================================
  // HESAPLAMA
  // ============================================
  function calculate() {
    // Validate both
    const date1 = getDate(p1), time1 = getTime(p1);
    const date2 = getDate(p2), time2 = getTime(p2);
    if (!date1 || !time1) { showError('1. kişinin doğum bilgileri eksik veya hatalı'); return; }
    if (!date2 || !time2) { showError('2. kişinin doğum bilgileri eksik veya hatalı'); return; }
    if (!p1.city.value) { showError('1. kişi için il seçin'); return; }
    if (!p2.city.value) { showError('2. kişi için il seçin'); return; }

    const coords1 = Locations.getCoordinates(p1.city.value, p1.district.value);
    const coords2 = Locations.getCoordinates(p2.city.value, p2.district.value);
    if (!coords1 || !coords2) { showError('Konum bulunamadı'); return; }

    const chart1 = AstroEngine.calculate(date1, time1, coords1.lat, coords1.lng, coords1.tz);
    const chart2 = AstroEngine.calculate(date2, time2, coords2.lat, coords2.lng, coords2.tz);

    const compat = SynastryEngine.calculateCompatibility(chart1, chart2);

    const name1 = p1.name.value || 'Kişi 1';
    const name2 = p2.name.value || 'Kişi 2';

    showResults(chart1, chart2, compat, name1, name2);
  }

  // ============================================
  // SONUÇLARI GÖSTER
  // ============================================
  function showResults(chart1, chart2, compat, name1, name2) {
    resultsSection.innerHTML = '';
    resultsSection.classList.add('visible');
    formSection.classList.add('minimized');
    setTimeout(() => resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);

    // GENEL SKOR DAİRESİ
    const scoreSection = document.createElement('div');
    scoreSection.className = 'syn-score-hero';
    scoreSection.innerHTML = `
      <div class="syn-score-circle-wrapper">
        <svg class="syn-score-svg" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="88" fill="none" stroke="rgba(140,120,255,0.1)" stroke-width="6"/>
          <circle cx="100" cy="100" r="88" fill="none" stroke="url(#scoreGrad)" stroke-width="6"
            stroke-dasharray="${2 * Math.PI * 88}" stroke-dashoffset="${2 * Math.PI * 88 * (1 - compat.overall / 100)}"
            stroke-linecap="round" class="syn-score-ring" transform="rotate(-90 100 100)"/>
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#d4a854"/>
              <stop offset="50%" stop-color="#c76a8a"/>
              <stop offset="100%" stop-color="#8a6cc7"/>
            </linearGradient>
          </defs>
          <text x="100" y="92" text-anchor="middle" fill="#e8e4f5" font-family="'Cormorant Garamond',serif" font-size="48" font-weight="300" class="syn-score-num">
            ${compat.overall}
          </text>
          <text x="100" y="116" text-anchor="middle" fill="rgba(200,190,230,0.5)" font-family="'Cormorant Garamond',serif" font-size="14" letter-spacing="3">
            UYUM
          </text>
        </svg>
      </div>
      <div class="syn-score-names">
        <span class="syn-name">${name1}</span>
        <span class="syn-heart">♡</span>
        <span class="syn-name">${name2}</span>
      </div>
      <div class="syn-score-label">${getOverallLabel(compat.overall)}</div>
      <div class="syn-signs-summary">
        <span>${chart1.planets.sun.sign.symbol} ${chart1.planets.sun.sign.name}</span>
        <span class="syn-and">&</span>
        <span>${chart2.planets.sun.sign.symbol} ${chart2.planets.sun.sign.name}</span>
      </div>
    `;
    resultsSection.appendChild(scoreSection);

    // Score count-up animation
    const scoreNumEl = scoreSection.querySelector('.syn-score-num');
    if (scoreNumEl) {
      const target = compat.overall;
      let current = 0;
      const duration = 1800;
      const startTime = performance.now();
      function countUp(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        current = Math.round(eased * target);
        scoreNumEl.textContent = current;
        if (progress < 1) requestAnimationFrame(countUp);
      }
      requestAnimationFrame(countUp);
    }

    // KATEGORİ BARLARI
    const catsSection = document.createElement('div');
    catsSection.className = 'syn-categories';
    const catOrder = ['sun','moon','venus','mars','mercury','element','aspects'];
    const catColors = {
      sun: '#FFD700', moon: '#C0C0C0', venus: '#FF69B4', mars: '#FF4500',
      mercury: '#A0D2DB', element: '#4ecdc4', aspects: '#8a6cc7'
    };

    catOrder.forEach((key, idx) => {
      const cat = compat.categories[key];
      if (!cat) return;
      const bar = document.createElement('div');
      bar.className = 'syn-cat-bar';
      bar.style.animationDelay = `${0.3 + idx * 0.1}s`;
      bar.innerHTML = `
        <div class="syn-cat-header">
          <span class="syn-cat-icon" style="color:${catColors[key]}">${cat.icon}</span>
          <span class="syn-cat-label">${cat.label}</span>
          <span class="syn-cat-pct">${cat.score}%</span>
        </div>
        <div class="syn-cat-track">
          <div class="syn-cat-fill" style="--target-width:${cat.score}%;background:${catColors[key]};animation-delay:${0.5 + idx * 0.12}s"></div>
        </div>
        <div class="syn-cat-desc">${cat.desc}</div>
      `;
      catsSection.appendChild(bar);
    });
    resultsSection.appendChild(catsSection);

    // ÇAPRAZ AÇILAR
    if (compat.aspects.length > 0) {
      const aspectSection = document.createElement('div');
      aspectSection.className = 'syn-section syn-aspects-section';
      let aspectHTML = `<h3 class="syn-section-title">Gezegenler Arası Açılar</h3><div class="syn-aspect-grid">`;
      compat.aspects.slice(0, 15).forEach((a, idx) => {
        const typeClass = a.type === 'positive' ? 'positive' : a.type === 'negative' ? 'negative' : 'neutral';
        aspectHTML += `
          <div class="syn-aspect-item ${typeClass}" style="animation-delay:${0.6 + idx * 0.05}s">
            <span class="syn-asp-planets">
              <span style="color:${getPlanetColor(a.planet1)}">${a.planet1Symbol}</span>
              <span class="syn-asp-symbol" style="color:${a.aspect.color || '#aaa'}">${a.aspect.symbol}</span>
              <span style="color:${getPlanetColor(a.planet2)}">${a.planet2Symbol}</span>
            </span>
            <span class="syn-asp-names">${a.planet1Name} ${a.aspect.name} ${a.planet2Name}</span>
            <span class="syn-asp-orb">${a.orb.toFixed(1)}°</span>
          </div>
        `;
      });
      aspectHTML += '</div>';
      aspectSection.innerHTML = aspectHTML;
      resultsSection.appendChild(aspectSection);
    }

    // GÜÇLÜ YÖNLER
    const strengthsSection = document.createElement('div');
    strengthsSection.className = 'syn-section syn-strengths';
    strengthsSection.innerHTML = `
      <h3 class="syn-section-title"><span style="color:#4ecdc4">✦</span> Güçlü Yönler</h3>
      ${compat.strengths.map((s, i) => `<div class="syn-point positive" style="animation-delay:${0.8+i*0.1}s"><span class="syn-point-icon">✓</span><p>${s}</p></div>`).join('')}
    `;
    resultsSection.appendChild(strengthsSection);

    // ZORLUKLAR
    const challengesSection = document.createElement('div');
    challengesSection.className = 'syn-section syn-challenges';
    challengesSection.innerHTML = `
      <h3 class="syn-section-title"><span style="color:#FF6B6B">✦</span> Zorluklar & Büyüme Alanları</h3>
      ${compat.challenges.map((c, i) => `<div class="syn-point negative" style="animation-delay:${1+i*0.1}s"><span class="syn-point-icon">!</span><p>${c}</p></div>`).join('')}
    `;
    resultsSection.appendChild(challengesSection);

    // DETAYLI YORUM
    const interpSection = document.createElement('div');
    interpSection.className = 'syn-section syn-interp';
    interpSection.innerHTML = `<h3 class="syn-section-title syn-interp-main-title">✦ İlişki Yorumu</h3>`;
    compat.interpretation.forEach((sec, idx) => {
      const card = document.createElement('div');
      card.className = 'syn-interp-card';
      card.style.animationDelay = `${1.2 + idx * 0.15}s`;
      card.innerHTML = `
        <div class="syn-interp-header">
          <span class="syn-interp-icon" style="color:${sec.color}">${sec.icon}</span>
          <h4>${sec.title}</h4>
        </div>
        <p>${sec.text}</p>
      `;
      interpSection.appendChild(card);
    });
    resultsSection.appendChild(interpSection);

    // YENİDEN HESAPLA
    const recalcDiv = document.createElement('div');
    recalcDiv.className = 'recalc-wrapper';
    recalcDiv.innerHTML = '<button id="synRecalcBtn">↺ Yeniden Hesapla</button>';
    resultsSection.appendChild(recalcDiv);
    document.getElementById('synRecalcBtn').addEventListener('click', () => {
      resultsSection.classList.remove('visible');
      formSection.classList.remove('minimized');
      formSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  function getOverallLabel(score) {
    if (score >= 90) return '🌟 Kozmik Ruh Eşleri';
    if (score >= 80) return '💫 Mükemmel Uyum';
    if (score >= 70) return '✨ Güçlü Bağlantı';
    if (score >= 60) return '🌙 İyi Uyum';
    if (score >= 50) return '⚖️ Dengelenmiş';
    if (score >= 40) return '🔥 Zorlayıcı ama Öğretici';
    return '🌊 Karmaşık Dinamik';
  }

  function getPlanetColor(key) {
    const colors = { sun:'#FFD700', moon:'#C0C0C0', mercury:'#A0D2DB', venus:'#FF69B4', mars:'#FF4500', jupiter:'#FFA500', saturn:'#DAA520' };
    return colors[key] || '#aaa';
  }

  // ============================================
  // EVENTS
  // ============================================
  calcBtn.addEventListener('click', (e) => {
    e.preventDefault();
    calcBtn.classList.add('clicked');
    setTimeout(() => calcBtn.classList.remove('clicked'), 600);
    calculate();
  });

  // ============================================
  // INIT
  // ============================================
  populateCities(p1.city);
  populateCities(p2.city);
  bindDistrictUpdate(p1.city, p1.district);
  bindDistrictUpdate(p2.city, p2.district);
  bindAutoTab([p1.day, p1.month, p1.year, p1.hour, p1.minute]);
  bindAutoTab([p2.day, p2.month, p2.year, p2.hour, p2.minute]);
  createStarfield();
  createNebula();
  initSplash();
  initCursorGlow();
  setTimeout(() => document.body.classList.add('loaded'), 100);

  function initSplash() {
    const splash = document.getElementById('splashScreen');
    if (!splash) return;
    setTimeout(() => splash.classList.add('fade-out'), 1500);
    setTimeout(() => splash.remove(), 2200);
  }

  function initCursorGlow() {
    if (window.matchMedia('(hover: none)').matches) return;
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    let mx = -200, my = -200, cx = -200, cy = -200;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function animate() {
      cx += (mx - cx) * 0.1; cy += (my - cy) * 0.1;
      glow.style.transform = `translate(${cx - 150}px, ${cy - 150}px)`;
      requestAnimationFrame(animate);
    }
    animate();
  }
});
