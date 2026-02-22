/**
 * Ana Uygulama Mantığı
 * Form yönetimi, kullanıcı etkileşimleri ve sonuç gösterimi
 */

document.addEventListener('DOMContentLoaded', () => {

  // DOM
  const citySelect = document.getElementById('city');
  const districtSelect = document.getElementById('district');
  const birthDay = document.getElementById('birthDay');
  const birthMonth = document.getElementById('birthMonth');
  const birthYear = document.getElementById('birthYear');
  const birthHour = document.getElementById('birthHour');
  const birthMinute = document.getElementById('birthMinute');
  const calcBtn = document.getElementById('calcBtn');
  const chartContainer = document.getElementById('chartContainer');
  const infoPanel = document.getElementById('infoPanel');
  const resultsSection = document.getElementById('results');
  const heroSection = document.getElementById('hero');
  const formCard = document.getElementById('formCard');
  const summaryBox = document.getElementById('summaryBox');
  const interpretationsPanel = document.getElementById('interpretationsPanel');

  // ============================================
  // YILDIZ ARKAPLANI
  // ============================================
  function createStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let shootingStars = [];
    let w, h;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight * 3;
    }

    function initStars() {
      stars = [];
      const count = Math.floor((w * h) / 3000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.5 + 0.3,
          brightness: Math.random(),
          speed: Math.random() * 0.0008 + 0.0002,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function spawnShootingStar() {
      if (shootingStars.length > 2) return;
      if (Math.random() > 0.003) return;
      shootingStars.push({
        x: Math.random() * w * 0.8,
        y: Math.random() * h * 0.3,
        len: Math.random() * 80 + 40,
        speed: Math.random() * 8 + 6,
        angle: Math.PI / 4 + Math.random() * 0.3,
        life: 1,
        decay: Math.random() * 0.015 + 0.01
      });
    }

    function draw(time) {
      ctx.clearRect(0, 0, w, h);
      stars.forEach(star => {
        const twinkle = 0.5 + 0.5 * Math.sin(time * star.speed + star.phase);
        const alpha = star.brightness * twinkle * 0.8 + 0.1;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 210, 255, ${alpha})`;
        ctx.fill();
        if (star.r > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 180, 255, ${alpha * 0.1})`;
          ctx.fill();
        }
      });
      spawnShootingStar();
      shootingStars = shootingStars.filter(s => s.life > 0);
      shootingStars.forEach(s => {
        const tailX = s.x - Math.cos(s.angle) * s.len;
        const tailY = s.y - Math.sin(s.angle) * s.len;
        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(255, 255, 255, 0)`);
        grad.addColorStop(0.7, `rgba(200, 180, 255, ${s.life * 0.4})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${s.life * 0.9})`);
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.life})`;
        ctx.fill();
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.life -= s.decay;
      });
      requestAnimationFrame(draw);
    }

    resize();
    initStars();
    window.addEventListener('resize', () => { resize(); initStars(); });
    requestAnimationFrame(draw);
  }

  function createNebula() {
    const container = document.getElementById('nebula');
    if (!container) return;
    for (let i = 0; i < 5; i++) {
      const blob = document.createElement('div');
      blob.className = 'nebula-blob';
      blob.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${200 + Math.random() * 400}px;
        height: ${200 + Math.random() * 400}px;
        animation-delay: ${Math.random() * 20}s;
        animation-duration: ${25 + Math.random() * 20}s;
        opacity: ${0.03 + Math.random() * 0.04};
      `;
      const colors = ['#6a0dad', '#1a237e', '#004d40', '#b71c1c', '#1565c0'];
      blob.style.background = `radial-gradient(ellipse, ${colors[i % colors.length]}, transparent 70%)`;
      container.appendChild(blob);
    }
  }

  // ============================================
  // FORM
  // ============================================
  function populateCities() {
    const cities = Locations.getCityList();
    citySelect.innerHTML = '<option value="">İl Seçin</option>';
    cities.forEach(city => {
      const opt = document.createElement('option');
      opt.value = city;
      opt.textContent = city;
      citySelect.appendChild(opt);
    });
  }

  function updateDistricts() {
    const city = citySelect.value;
    districtSelect.innerHTML = '<option value="">İlçe Seçin (opsiyonel)</option>';
    districtSelect.disabled = true;
    if (!city) return;
    const districts = Locations.getDistricts(city);
    if (districts.length > 0) {
      districtSelect.disabled = false;
      districts.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d;
        districtSelect.appendChild(opt);
      });
    }
  }

  citySelect.addEventListener('change', updateDistricts);

  // Auto-tab between date/time fields
  [birthDay, birthMonth, birthYear, birthHour, birthMinute].forEach((input, idx, arr) => {
    input.addEventListener('input', () => {
      const maxLen = input === birthYear ? 4 : 2;
      if (input.value.length >= maxLen && idx < arr.length - 1) {
        arr[idx + 1].focus();
      }
    });
  });

  // ============================================
  // HESAPLAMA
  // ============================================
  function getDateString() {
    const d = parseInt(birthDay.value);
    const m = parseInt(birthMonth.value);
    const y = parseInt(birthYear.value);
    if (!d || !m || !y) return null;
    if (d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > 2030) return null;
    return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }

  function getTimeString() {
    const h = parseInt(birthHour.value);
    const min = parseInt(birthMinute.value);
    if (isNaN(h) || isNaN(min)) return null;
    if (h < 0 || h > 23 || min < 0 || min > 59) return null;
    return `${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}`;
  }

  function getFormattedDate() {
    return `${String(birthDay.value).padStart(2,'0')}/${String(birthMonth.value).padStart(2,'0')}/${birthYear.value}`;
  }

  function getFormattedTime() {
    return `${String(birthHour.value).padStart(2,'0')}:${String(birthMinute.value).padStart(2,'0')}`;
  }

  function validateForm() {
    if (!getDateString()) { showError('Geçerli bir doğum tarihi girin (GG/AA/YYYY)'); return false; }
    if (!getTimeString()) { showError('Geçerli bir doğum saati girin (00-23:00-59)'); return false; }
    if (!citySelect.value) { showError('Doğum yeri seçin'); return false; }
    return true;
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

  function calculate() {
    if (!validateForm()) return;
    const coords = Locations.getCoordinates(citySelect.value, districtSelect.value);
    if (!coords) { showError('Konum bulunamadı'); return; }
    const chartData = AstroEngine.calculate(
      getDateString(),
      getTimeString(),
      coords.lat,
      coords.lng,
      coords.tz
    );
    showResults(chartData, coords);
  }

  function showResults(chartData, coords) {
    resultsSection.classList.add('visible');
    formCard.classList.add('minimized');
    setTimeout(() => {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);

    ChartRenderer.render(chartContainer, chartData);
    ChartRenderer.renderInfoPanel(infoPanel, chartData);
    renderSummary(chartData);
    renderInterpretations(chartData);
    spawnCelebrationParticles();
  }

  // ============================================
  // ÖZET
  // ============================================
  function renderSummary(chartData) {
    if (!summaryBox) return;
    const sun = chartData.planets.sun;
    const moon = chartData.planets.moon;
    const asc = chartData.ascendant;
    const SIGN_COLORS = ChartRenderer.SIGN_COLORS;

    summaryBox.innerHTML = `
      <div class="summary-inner">
        <div class="summary-trinity">
          <div class="trinity-item">
            <div class="trinity-symbol" style="color: ${sun.planet.color}">☉</div>
            <div class="trinity-label">Güneş Burcu</div>
            <div class="trinity-value" style="color: ${SIGN_COLORS[sun.signIndex]}">${sun.sign.symbol} ${sun.sign.name}</div>
            <div class="trinity-degree">${sun.degreeFormatted}</div>
          </div>
          <div class="trinity-item">
            <div class="trinity-symbol" style="color: ${moon.planet.color}">☽</div>
            <div class="trinity-label">Ay Burcu</div>
            <div class="trinity-value" style="color: ${SIGN_COLORS[moon.signIndex]}">${moon.sign.symbol} ${moon.sign.name}</div>
            <div class="trinity-degree">${moon.degreeFormatted}</div>
          </div>
          <div class="trinity-item">
            <div class="trinity-symbol" style="color: #FFD700">★</div>
            <div class="trinity-label">Yükselen</div>
            <div class="trinity-value" style="color: ${SIGN_COLORS[asc.signIndex]}">${asc.sign.symbol} ${asc.sign.name}</div>
            <div class="trinity-degree">${asc.degreeFormatted}</div>
          </div>
        </div>
        <div class="summary-meta">
          <span>${getFormattedDate()}</span>
          <span>${getFormattedTime()}</span>
          <span>${citySelect.value}${districtSelect.value ? ', ' + districtSelect.value : ''}</span>
        </div>
      </div>
    `;
    summaryBox.classList.add('visible');
  }

  // ============================================
  // YORUMLAR
  // ============================================
  function renderInterpretations(chartData) {
    if (!interpretationsPanel) return;
    interpretationsPanel.innerHTML = '';

    const sunSign = chartData.planets.sun.sign.name;
    const moonSign = chartData.planets.moon.sign.name;
    const ascSign = chartData.ascendant.sign.name;
    const mcSign = chartData.mc.sign.name;

    const sunInterp = Interpretations.getSunInterpretation(sunSign);
    const moonInterp = Interpretations.getMoonInterpretation(moonSign);
    const ascInterp = Interpretations.getAscInterpretation(ascSign);
    const mcInterp = Interpretations.getMCInterpretation(mcSign);

    const sectionTitle = document.createElement('h2');
    sectionTitle.className = 'interp-main-title';
    sectionTitle.textContent = '✦ Kişisel Yorum';
    interpretationsPanel.appendChild(sectionTitle);

    // Güneş Yorumu
    if (sunInterp) {
      interpretationsPanel.appendChild(createInterpCard(
        sunInterp.title, sunInterp.text, '#FFD700', '☉', 0
      ));
    }

    // Ay Yorumu
    if (moonInterp) {
      interpretationsPanel.appendChild(createInterpCard(
        moonInterp.title, moonInterp.text, '#C0C0C0', '☽', 1
      ));
    }

    // Yükselen Yorumu
    if (ascInterp) {
      interpretationsPanel.appendChild(createInterpCard(
        ascInterp.title, ascInterp.text, '#B8A0FF', '★', 2
      ));
    }

    // MC Yorumu
    if (mcInterp) {
      interpretationsPanel.appendChild(createInterpCard(
        'Gökyüzü Ortası (MC)', mcInterp, '#4a7fdb', '⟰', 3
      ));
    }

    // Sentez
    const synthCard = document.createElement('div');
    synthCard.className = 'interp-card synth-card';
    synthCard.style.animationDelay = '0.6s';
    synthCard.innerHTML = `
      <div class="interp-header">
        <span class="interp-icon" style="color: #c76a8a">✦</span>
        <h3 class="interp-title">Sentez — Üçlü Birleşim</h3>
      </div>
      <div class="interp-body">
        <p>Güneşiniz <strong>${sunSign}</strong>, Ayınız <strong>${moonSign}</strong> ve Yükseleniz <strong>${ascSign}</strong> ile benzersiz bir kozmik imzaya sahipsiniz.</p>
        <p>${getSynthesis(sunSign, moonSign, ascSign)}</p>
      </div>
    `;
    interpretationsPanel.appendChild(synthCard);

    interpretationsPanel.classList.add('visible');
  }

  function createInterpCard(title, text, color, icon, idx) {
    const card = document.createElement('div');
    card.className = 'interp-card';
    card.style.animationDelay = `${idx * 0.15}s`;
    card.innerHTML = `
      <div class="interp-header">
        <span class="interp-icon" style="color: ${color}">${icon}</span>
        <h3 class="interp-title">${title}</h3>
      </div>
      <div class="interp-body"><p>${text}</p></div>
    `;
    return card;
  }

  function getSynthesis(sun, moon, asc) {
    const elements = { 'Koç':'Ateş','Boğa':'Toprak','İkizler':'Hava','Yengeç':'Su','Aslan':'Ateş','Başak':'Toprak','Terazi':'Hava','Akrep':'Su','Yay':'Ateş','Oğlak':'Toprak','Kova':'Hava','Balık':'Su' };
    const sunEl = elements[sun] || '';
    const moonEl = elements[moon] || '';
    const ascEl = elements[asc] || '';

    const allSame = (sunEl === moonEl && moonEl === ascEl);
    const allDiff = (sunEl !== moonEl && moonEl !== ascEl && sunEl !== ascEl);

    let synthesis = '';
    if (allSame) {
      synthesis = `Üç temel noktanız da ${sunEl} elementinde — bu sizi ${sunEl === 'Ateş' ? 'son derece tutkulu, enerjik ve kararlı' : sunEl === 'Toprak' ? 'son derece pratik, güvenilir ve ayakları yere basan' : sunEl === 'Hava' ? 'son derece iletişimci, sosyal ve entelektüel' : 'son derece sezgisel, duygusal ve empatik'} biri yapar. Tek element hakimiyeti büyük bir odaklanma gücü verir ancak eksik elementleri bilinçli olarak geliştirmeniz dengeli bir yaşam için önemlidir.`;
    } else if (allDiff) {
      synthesis = `Üç farklı elementin birleşimi sizi çok yönlü ve uyumlu kılar. ${sunEl} güneşiniz kimliğinize ${sunEl === 'Ateş' ? 'tutku' : sunEl === 'Toprak' ? 'kararlılık' : sunEl === 'Hava' ? 'merak' : 'derinlik'} katarken, ${moonEl} ayınız duygusal dünyanıza ${moonEl === 'Ateş' ? 'heyecan' : moonEl === 'Toprak' ? 'stabilite' : moonEl === 'Hava' ? 'hafiflik' : 'hassasiyet'} getirir. ${ascEl} yükseleniz ise dünyaya ${ascEl === 'Ateş' ? 'cesur' : ascEl === 'Toprak' ? 'güvenilir' : ascEl === 'Hava' ? 'çekici' : 'gizemli'} bir yüz göstermenizi sağlar.`;
    } else {
      const dominant = [sunEl, moonEl, ascEl].sort().reduce((a,b,i,arr) => {
        const count = arr.filter(x=>x===b).length;
        return count > (a.count||0) ? {el:b,count} : a;
      }, {});
      synthesis = `Haritanızda ${dominant.el || sunEl} elementi baskın konumda. Bu, yaşamınızda ${(dominant.el||sunEl) === 'Ateş' ? 'aksiyon, tutku ve liderlik' : (dominant.el||sunEl) === 'Toprak' ? 'pratiklik, maddi güvenlik ve somutluk' : (dominant.el||sunEl) === 'Hava' ? 'iletişim, fikir alışverişi ve sosyallik' : 'duygusal derinlik, sezgi ve empati'} temalarının ön plana çıktığını gösterir. ${sun} güneşinizin gücü, ${moon} ayınızın duygusal zenginliği ve ${asc} yükseleninin dış dünyaya sunduğu imaj birleşerek size kendine özgü bir karakter kazandırır.`;
    }
    return synthesis;
  }

  // ============================================
  // PARTİKÜLLER
  // ============================================
  function spawnCelebrationParticles() {
    const container = document.createElement('div');
    container.className = 'celebration-particles';
    document.body.appendChild(container);
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'c-particle';
      particle.style.cssText = `
        left: ${40 + Math.random() * 20}%;
        top: ${20 + Math.random() * 20}%;
        --dx: ${(Math.random() - 0.5) * 200}px;
        --dy: ${(Math.random() - 0.5) * 200}px;
        animation-delay: ${Math.random() * 0.5}s;
        background: ${['#FFD700', '#C0C0C0', '#FF69B4', '#00CED1', '#FF4500', '#4169E1'][Math.floor(Math.random() * 6)]};
      `;
      container.appendChild(particle);
    }
    setTimeout(() => container.remove(), 2000);
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

  document.getElementById('birthForm').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); calculate(); }
  });

  const recalcBtn = document.getElementById('recalcBtn');
  if (recalcBtn) {
    recalcBtn.addEventListener('click', () => {
      resultsSection.classList.remove('visible');
      formCard.classList.remove('minimized');
      summaryBox.classList.remove('visible');
      if (interpretationsPanel) interpretationsPanel.classList.remove('visible');
      heroSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Parallax
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroH = heroSection ? heroSection.offsetHeight : 600;
        if (scrollY < heroH) {
          const canvas = document.getElementById('starfield');
          if (canvas) canvas.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // INIT
  populateCities();
  createStarfield();
  createNebula();
  setTimeout(() => document.body.classList.add('loaded'), 100);
});
