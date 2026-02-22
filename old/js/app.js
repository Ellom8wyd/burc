/**
 * Ana Uygulama Mantığı
 * Form yönetimi, kullanıcı etkileşimleri ve sonuç gösterimi
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // DOM ELEMANLARI
  // ============================================
  const citySelect = document.getElementById('city');
  const districtSelect = document.getElementById('district');
  const birthDate = document.getElementById('birthDate');
  const birthTime = document.getElementById('birthTime');
  const calcBtn = document.getElementById('calcBtn');
  const chartContainer = document.getElementById('chartContainer');
  const infoPanel = document.getElementById('infoPanel');
  const resultsSection = document.getElementById('results');
  const heroSection = document.getElementById('hero');
  const formCard = document.getElementById('formCard');
  const summaryBox = document.getElementById('summaryBox');

  // ============================================
  // YILDIZ ARKAPLANi
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

      // Yıldızlar
      stars.forEach(star => {
        const twinkle = 0.5 + 0.5 * Math.sin(time * star.speed + star.phase);
        const alpha = star.brightness * twinkle * 0.8 + 0.1;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 210, 255, ${alpha})`;
        ctx.fill();

        // Büyük yıldızlara parlama
        if (star.r > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200, 180, 255, ${alpha * 0.1})`;
          ctx.fill();
        }
      });

      // Kayan yıldızlar
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

        // Baş parlama
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

  // ============================================
  // NEBULA / SİS EFEKTİ
  // ============================================
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
  // FORM YÖNETİMİ
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

  // ============================================
  // HESAPLAMA VE GÖSTERIM
  // ============================================

  function validateForm() {
    if (!birthDate.value) { showError('Doğum tarihi gerekli'); return false; }
    if (!birthTime.value) { showError('Doğum saati gerekli'); return false; }
    if (!citySelect.value) { showError('Doğum yeri gerekli'); return false; }
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
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function calculate() {
    if (!validateForm()) return;

    const coords = Locations.getCoordinates(citySelect.value, districtSelect.value);
    if (!coords) { showError('Konum bulunamadı'); return; }

    // Hesapla
    const chartData = AstroEngine.calculate(
      birthDate.value,
      birthTime.value,
      coords.lat,
      coords.lng,
      coords.tz
    );

    // UI güncellemeleri
    showResults(chartData, coords);
  }

  function showResults(chartData, coords) {
    // Animasyonla sonuçları göster
    resultsSection.classList.add('visible');
    formCard.classList.add('minimized');

    // Scroll
    setTimeout(() => {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);

    // Haritayı çiz
    ChartRenderer.render(chartContainer, chartData);

    // Bilgi panelini doldur
    ChartRenderer.renderInfoPanel(infoPanel, chartData);

    // Özet kutusu
    renderSummary(chartData);

    // Partiküller
    spawnCelebrationParticles();
  }

  function renderSummary(chartData) {
    if (!summaryBox) return;

    const sun = chartData.planets.sun;
    const moon = chartData.planets.moon;
    const asc = chartData.ascendant;

    summaryBox.innerHTML = `
      <div class="summary-inner">
        <div class="summary-trinity">
          <div class="trinity-item">
            <div class="trinity-symbol" style="color: ${sun.planet.color}">☉</div>
            <div class="trinity-label">Güneş Burcu</div>
            <div class="trinity-value" style="color: ${ChartRenderer.SIGN_COLORS[sun.signIndex]}">${sun.sign.symbol} ${sun.sign.name}</div>
            <div class="trinity-degree">${sun.degreeFormatted}</div>
          </div>
          <div class="trinity-item">
            <div class="trinity-symbol" style="color: ${moon.planet.color}">☽</div>
            <div class="trinity-label">Ay Burcu</div>
            <div class="trinity-value" style="color: ${ChartRenderer.SIGN_COLORS[moon.signIndex]}">${moon.sign.symbol} ${moon.sign.name}</div>
            <div class="trinity-degree">${moon.degreeFormatted}</div>
          </div>
          <div class="trinity-item">
            <div class="trinity-symbol" style="color: #FFD700">★</div>
            <div class="trinity-label">Yükselen</div>
            <div class="trinity-value" style="color: ${ChartRenderer.SIGN_COLORS[asc.signIndex]}">${asc.sign.symbol} ${asc.sign.name}</div>
            <div class="trinity-degree">${asc.degreeFormatted}</div>
          </div>
        </div>
        <div class="summary-meta">
          <span>${birthDate.value}</span>
          <span>${birthTime.value}</span>
          <span>${citySelect.value}${districtSelect.value ? ', ' + districtSelect.value : ''}</span>
        </div>
      </div>
    `;
    summaryBox.classList.add('visible');
  }

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
  // BUTON EVENT
  // ============================================
  calcBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Buton animasyonu
    calcBtn.classList.add('clicked');
    setTimeout(() => calcBtn.classList.remove('clicked'), 600);
    calculate();
  });

  // Enter tuşu
  document.getElementById('birthForm').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      calculate();
    }
  });

  // ============================================
  // YENİDEN HESAPLA BUTONU
  // ============================================
  const recalcBtn = document.getElementById('recalcBtn');
  if (recalcBtn) {
    recalcBtn.addEventListener('click', () => {
      resultsSection.classList.remove('visible');
      formCard.classList.remove('minimized');
      summaryBox.classList.remove('visible');
      heroSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ============================================
  // PARALAKS ETKİSİ
  // ============================================
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroH = heroSection ? heroSection.offsetHeight : 600;
        if (scrollY < heroH) {
          const factor = scrollY / heroH;
          const canvas = document.getElementById('starfield');
          if (canvas) {
            canvas.style.transform = `translateY(${scrollY * 0.3}px)`;
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // ============================================
  // BAŞLANGIÇ
  // ============================================
  populateCities();
  createStarfield();
  createNebula();

  // Giriş animasyonu
  setTimeout(() => document.body.classList.add('loaded'), 100);
});
