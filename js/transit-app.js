/**
 * Günlük Transit Sayfası Mantığı
 */
document.addEventListener('DOMContentLoaded', () => {

  const calcBtn = document.getElementById('transitCalcBtn');
  const resultsSection = document.getElementById('transitResults');
  const formSection = document.getElementById('transitFormSection');
  const tDay = document.getElementById('tDay');
  const tMonth = document.getElementById('tMonth');
  const tYear = document.getElementById('tYear');
  const tHour = document.getElementById('tHour');
  const tMinute = document.getElementById('tMinute');
  const tCity = document.getElementById('tCity');
  const tDistrict = document.getElementById('tDistrict');

  // Transit gezegen yorumları
  const TRANSIT_INTERP = {
    'sun': {
      conjunction: 'Güneş transit {natal} üzerinden geçiyor — bugün bu alandaki kimliğiniz ve enerjiniz güçlenmiş durumda. Kendinize odaklanın.',
      trine: 'Güneş transitinden üçgen — uyumlu bir enerji akışı var. Bu alanda doğal ve rahat hissedeceksiniz.',
      square: 'Güneş transitinden kare — iç gerilim ve meydan okumalar. Sabırlı olun, bu kısa süreli bir sınav.',
      opposition: 'Güneş transitinden karşıtlık — başkalarıyla denge arayışı. İlişkilerde farkındalık günü.'
    },
    'moon': {
      conjunction: 'Ay transit {natal} üzerinde — duygusal hassasiyet yüksek. Sezgilerinize güvenin.',
      trine: 'Ay transitinden üçgen — duygusal huzur ve akış. İlişkilerde uyum.',
      square: 'Ay transitinden kare — duygusal dalgalanmalar. Tepkisel olmaktan kaçının.',
      opposition: 'Ay transitinden karşıtlık — duygusal dengeleme günü. İç ve dış dünya arasında köprü kurun.'
    },
    'mercury': {
      conjunction: 'Merkür transit {natal} üzerinde — zihinsel aktivite yoğun. İletişim, öğrenme ve yazma için ideal.',
      trine: 'Merkür transitinden üçgen — düşünceler berrak, iletişim akıcı. Önemli konuşmalar için iyi bir zaman.',
      square: 'Merkür transitinden kare — yanlış anlaşılma riski. Önemli kararları erteleyin.',
      opposition: 'Merkür transitinden karşıtlık — farklı bakış açılarıyla yüzleşme. Dinlemeye odaklanın.'
    },
    'venus': {
      conjunction: 'Venüs transit {natal} üzerinde — aşk, güzellik ve uyum enerjisi güçlü. Romantik fırsatlar.',
      trine: 'Venüs transitinden üçgen — sosyal hayat ve ilişkilerde şans. Estetik projeler için ideal.',
      square: 'Venüs transitinden kare — ilişkilerde sürtünme veya aşırı harcama eğilimi.',
      opposition: 'Venüs transitinden karşıtlık — ilişkilerde denge arayışı. Karşınızdakinin ihtiyaçlarına dikkat.'
    },
    'mars': {
      conjunction: 'Mars transit {natal} üzerinde — enerji patlaması! Harekete geçme zamanı ama öfkeye dikkat.',
      trine: 'Mars transitinden üçgen — cesaret ve motivasyon yüksek. Fiziksel aktivite ve girişimler için mükemmel.',
      square: 'Mars transitinden kare — gerginlik ve çatışma riski. Enerjinizi sporla atın.',
      opposition: 'Mars transitinden karşıtlık — başkalarıyla güç mücadeleleri. Diplomasi şart.'
    },
    'jupiter': {
      conjunction: 'Jüpiter transit {natal} üzerinde — şans, genişleme ve fırsatlar dönemi. Bu enerji aylar boyunca etkili!',
      trine: 'Jüpiter transitinden üçgen — bollluk ve büyüme zamanı. Eğitim, seyahat ve felsefe öne çıkıyor.',
      square: 'Jüpiter transitinden kare — aşırıya kaçma riski. İyimserlik gerçekçilikle dengelenmeli.',
      opposition: 'Jüpiter transitinden karşıtlık — büyük fırsatlar ama dikkatli değerlendirme gerektiriyor.'
    },
    'saturn': {
      conjunction: 'Satürn transit {natal} üzerinde — ciddi yaşam dersleri dönemi. Sorumluluk ve olgunlaşma zamanı. Bu transit aylar sürer.',
      trine: 'Satürn transitinden üçgen — disiplin ve yapılandırma kolay geliyor. Kariyer atılımları için destekleyici.',
      square: 'Satürn transitinden kare — zorlayıcı bir dönem. Engeller ve sınırlamalar ama büyük büyüme potansiyeli.',
      opposition: 'Satürn transitinden karşıtlık — ilişkilerde ve kariyerde ciddi değerlendirme zamanı. Dengeyi bulun.'
    }
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
      for (let i = 0; i < count; i++) stars.push({ x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.5+0.3, brightness: Math.random(), speed: Math.random()*0.0008+0.0002, phase: Math.random()*Math.PI*2 });
    }
    function draw(time) {
      ctx.clearRect(0,0,w,h);
      stars.forEach(s => {
        const tw = 0.5+0.5*Math.sin(time*s.speed+s.phase), a = s.brightness*tw*0.8+0.1;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle=`rgba(220,210,255,${a})`; ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    resize(); initStars(); window.addEventListener('resize', () => { resize(); initStars(); }); requestAnimationFrame(draw);
  }
  function createNebula() {
    const c = document.getElementById('nebula'); if (!c) return;
    ['#6a0dad','#1a237e','#004d40','#b71c1c','#1565c0'].forEach((col,i) => {
      const b = document.createElement('div'); b.className='nebula-blob';
      b.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;width:${200+Math.random()*400}px;height:${200+Math.random()*400}px;animation-delay:${Math.random()*20}s;animation-duration:${25+Math.random()*20}s;opacity:${0.03+Math.random()*0.04};background:radial-gradient(ellipse,${col},transparent 70%)`;
      c.appendChild(b);
    });
  }

  // ============================================
  // SPLASH SCREEN
  // ============================================
  function initSplash() {
    const splash = document.getElementById('splashScreen');
    if (!splash) return;
    setTimeout(() => splash.classList.add('fade-out'), 1500);
    setTimeout(() => splash.remove(), 2200);
  }

  // ============================================
  // CURSOR GLOW
  // ============================================
  function initCursorGlow() {
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    let mx = 0, my = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function animate() {
      cx += (mx - cx) * 0.12; cy += (my - cy) * 0.12;
      glow.style.transform = `translate(${cx - 150}px, ${cy - 150}px)`;
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ============================================
  // FORM
  // ============================================
  function populateCities() {
    const cities = Locations.getCityList();
    tCity.innerHTML = '<option value="">İl Seçin</option>';
    cities.forEach(c => { const o = document.createElement('option'); o.value = c; o.textContent = c; tCity.appendChild(o); });
  }
  tCity.addEventListener('change', () => {
    tDistrict.innerHTML = '<option value="">İlçe (opsiyonel)</option>'; tDistrict.disabled = true;
    if (!tCity.value) return;
    const d = Locations.getDistricts(tCity.value);
    if (d.length > 0) { tDistrict.disabled = false; d.forEach(x => { const o = document.createElement('option'); o.value = x; o.textContent = x; tDistrict.appendChild(o); }); }
  });

  [tDay, tMonth, tYear, tHour, tMinute].forEach((inp, idx, arr) => {
    inp.addEventListener('input', () => {
      const maxLen = inp.placeholder === 'YYYY' ? 4 : 2;
      if (inp.value.length >= maxLen && idx < arr.length - 1) arr[idx+1].focus();
    });
  });

  function showError(msg) {
    const existing = document.querySelector('.error-toast'); if (existing) existing.remove();
    const toast = document.createElement('div'); toast.className = 'error-toast'; toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
  }

  // ============================================
  // HESAPLAMA
  // ============================================
  function calculate() {
    const d = parseInt(tDay.value), m = parseInt(tMonth.value), y = parseInt(tYear.value);
    const h = parseInt(tHour.value), min = parseInt(tMinute.value);
    if (!d||!m||!y||d<1||d>31||m<1||m>12||y<1900) { showError('Geçerli doğum tarihi girin'); return; }
    if (isNaN(h)||isNaN(min)||h<0||h>23||min<0||min>59) { showError('Geçerli doğum saati girin'); return; }
    if (!tCity.value) { showError('İl seçin'); return; }

    const coords = Locations.getCoordinates(tCity.value, tDistrict.value);
    if (!coords) { showError('Konum bulunamadı'); return; }

    const dateStr = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const timeStr = `${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}`;

    // Natal harita
    const natal = AstroEngine.calculate(dateStr, timeStr, coords.lat, coords.lng, coords.tz);

    // Bugünkü harita (şu an)
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    const nowTimeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const transit = AstroEngine.calculate(todayStr, nowTimeStr, coords.lat, coords.lng, coords.tz);

    showResults(natal, transit);
  }

  // ============================================
  // SONUÇLAR
  // ============================================
  function showResults(natal, transit) {
    resultsSection.innerHTML = '';
    resultsSection.classList.add('visible');
    formSection.classList.add('minimized');
    setTimeout(() => resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);

    const now = new Date();
    const dateLabel = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    // HEADER
    const header = document.createElement('div');
    header.className = 'transit-header';
    header.innerHTML = `
      <h2 class="gradient-text" style="font-family:var(--font-display);font-size:1.6rem;text-align:center;margin-bottom:0.3rem">Bugünkü Gökyüzü</h2>
      <p style="text-align:center;color:var(--text-muted);font-family:var(--font-mono);font-size:0.75rem">${dateLabel}</p>
    `;
    resultsSection.appendChild(header);

    // TRANSIT GEZEGENLERİN MEVCUT POZİSYONLARI
    const planetColors = { sun:'#FFD700', moon:'#C0C0C0', mercury:'#A0D2DB', venus:'#FF69B4', mars:'#FF4500', jupiter:'#FFA500', saturn:'#DAA520', uranus:'#00CED1', neptune:'#4169E1', pluto:'#8B4513' };
    const planetNames = { sun:'Güneş', moon:'Ay', mercury:'Merkür', venus:'Venüs', mars:'Mars', jupiter:'Jüpiter', saturn:'Satürn', uranus:'Uranüs', neptune:'Neptün', pluto:'Plüton' };
    const planetSymbols = { sun:'☉', moon:'☽', mercury:'☿', venus:'♀', mars:'♂', jupiter:'♃', saturn:'♄', uranus:'♅', neptune:'♆', pluto:'♇' };

    const posSection = document.createElement('div');
    posSection.className = 'syn-section';
    posSection.style.animationDelay = '0.2s';
    let posHTML = '<h3 class="syn-section-title">Gezegen Pozisyonları (Şu An)</h3><div class="transit-planet-grid">';
    const order = ['sun','moon','mercury','venus','mars','jupiter','saturn','uranus','neptune','pluto'];
    order.forEach(key => {
      const p = transit.planets[key];
      if (!p) return;
      const retro = p.retrograde ? ' <span class="retro-badge">℞</span>' : '';
      posHTML += `
        <div class="transit-planet-item" style="animation-delay:${order.indexOf(key)*0.05}s">
          <span class="transit-p-icon" style="color:${planetColors[key]}">${planetSymbols[key]}</span>
          <span class="transit-p-name">${planetNames[key]}${retro}</span>
          <span class="transit-p-sign" style="color:${getSignColor(p.signIndex)}">${p.sign.symbol} ${p.sign.name}</span>
          <span class="transit-p-deg">${p.degreeFormatted}</span>
        </div>
      `;
    });
    posHTML += '</div>';
    posSection.innerHTML = posHTML;
    resultsSection.appendChild(posSection);

    // AKTİF TRANSİTLER (natal'a açılar)
    const activeTransits = findTransitAspects(transit, natal);

    if (activeTransits.length > 0) {
      const tSection = document.createElement('div');
      tSection.className = 'syn-section';
      tSection.style.animationDelay = '0.4s';
      let tHTML = '<h3 class="syn-section-title">Aktif Transitler — Sizi Etkileyen Açılar</h3>';

      activeTransits.forEach((t, idx) => {
        const typeClass = t.type === 'positive' ? 'positive' : t.type === 'negative' ? 'negative' : 'neutral';
        const interp = getTransitInterp(t.transitPlanet, t.aspectType, t.natalPlanet);
        tHTML += `
          <div class="transit-active-item ${typeClass}" style="animation-delay:${0.5+idx*0.08}s">
            <div class="transit-active-header">
              <span style="color:${planetColors[t.transitPlanet]}">${planetSymbols[t.transitPlanet]}</span>
              <span class="syn-asp-symbol">${t.aspectSymbol}</span>
              <span style="color:${planetColors[t.natalPlanet]}">${planetSymbols[t.natalPlanet]}</span>
              <span class="transit-active-label">Transit ${planetNames[t.transitPlanet]} ${t.aspectName} Natal ${planetNames[t.natalPlanet]}</span>
              <span class="syn-asp-orb">${t.orb.toFixed(1)}°</span>
            </div>
            ${interp ? `<p class="transit-active-interp">${interp}</p>` : ''}
          </div>
        `;
      });
      tSection.innerHTML = tHTML;
      resultsSection.appendChild(tSection);
    }

    // RETRO GEZEGENLERİ GÖSTER
    const retroPlanets = order.filter(k => transit.planets[k] && transit.planets[k].retrograde);
    if (retroPlanets.length > 0) {
      const rSection = document.createElement('div');
      rSection.className = 'syn-section';
      rSection.style.animationDelay = '0.6s';
      let rHTML = '<h3 class="syn-section-title"><span style="color:#FF6B6B">℞</span> Retro Gezegenler</h3>';
      retroPlanets.forEach(key => {
        rHTML += `
          <div class="transit-retro-item" style="border-left-color:${planetColors[key]}">
            <span class="transit-p-icon" style="color:${planetColors[key]};font-size:1.3rem">${planetSymbols[key]}℞</span>
            <div>
              <strong style="color:var(--text-primary)">${planetNames[key]} Retroda</strong>
              <p style="color:var(--text-secondary);font-size:0.88rem;line-height:1.6;margin-top:0.3rem">${getRetroMeaning(key)}</p>
            </div>
          </div>
        `;
      });
      rSection.innerHTML = rHTML;
      resultsSection.appendChild(rSection);
    }

    // YENİDEN
    const recalc = document.createElement('div');
    recalc.className = 'recalc-wrapper';
    recalc.innerHTML = '<button id="transitRecalcBtn">↺ Yeniden Hesapla</button>';
    resultsSection.appendChild(recalc);
    document.getElementById('transitRecalcBtn').addEventListener('click', () => {
      resultsSection.classList.remove('visible'); formSection.classList.remove('minimized');
      formSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  function findTransitAspects(transit, natal) {
    const aspects = [];
    const transitPlanets = ['sun','moon','mercury','venus','mars','jupiter','saturn'];
    const natalPlanets = ['sun','moon','mercury','venus','mars','jupiter','saturn'];
    const aspectDefs = [
      { angle:0, orb:6, name:'Kavuşum', symbol:'☌', type:'neutral' },
      { angle:60, orb:4, name:'Altmışlık', symbol:'⚹', type:'positive' },
      { angle:90, orb:5, name:'Kare', symbol:'□', type:'negative' },
      { angle:120, orb:5, name:'Üçgen', symbol:'△', type:'positive' },
      { angle:180, orb:6, name:'Karşıt', symbol:'☍', type:'neutral' }
    ];

    for (const tKey of transitPlanets) {
      for (const nKey of natalPlanets) {
        const tp = transit.planets[tKey], np = natal.planets[nKey];
        if (!tp || !np) continue;
        let diff = Math.abs(tp.longitude - np.longitude);
        if (diff > 180) diff = 360 - diff;

        for (const asp of aspectDefs) {
          const orb = Math.abs(diff - asp.angle);
          if (orb <= asp.orb) {
            aspects.push({
              transitPlanet: tKey, natalPlanet: nKey,
              aspectName: asp.name, aspectSymbol: asp.symbol, aspectType: asp.name.toLowerCase(),
              orb, type: asp.type,
              exactness: 1 - orb / asp.orb
            });
            break;
          }
        }
      }
    }

    aspects.sort((a, b) => b.exactness - a.exactness);
    return aspects.slice(0, 20);
  }

  function getTransitInterp(transitPlanet, aspectType, natalPlanet) {
    const planetNames = { sun:'Güneş', moon:'Ay', mercury:'Merkür', venus:'Venüs', mars:'Mars', jupiter:'Jüpiter', saturn:'Satürn' };
    const aspMap = { 'kavuşum':'conjunction','üçgen':'trine','kare':'square','karşıt':'opposition','altmışlık':'trine' };
    const data = TRANSIT_INTERP[transitPlanet];
    if (!data) return null;
    const aspKey = aspMap[aspectType] || aspectType;
    const text = data[aspKey];
    if (!text) return null;
    return text.replace('{natal}', 'natal ' + (planetNames[natalPlanet] || natalPlanet));
  }

  function getRetroMeaning(key) {
    const meanings = {
      mercury: 'İletişimde yavaşlama, geçmiş konuları yeniden gözden geçirme zamanı. Sözleşme ve önemli kararları mümkünse erteleyin.',
      venus: 'Eski ilişkiler yeniden gündeme gelebilir. Estetik değişiklikler ve büyük harcamalar için ideal değil.',
      mars: 'Enerji içe dönük. Yeni projelere başlamak yerine mevcut olanları tamamlamak daha verimli.',
      jupiter: 'İç büyüme ve felsefik değerlendirme dönemi. Dışa dönük genişleme yerine manevi derinleşme.',
      saturn: 'İç disiplin ve kişisel sorumlulukları yeniden değerlendirme zamanı.',
      uranus: 'İç devrim. Dıştan sakin görünüp içten büyük değişimler yaşayabilirsiniz.',
      neptune: 'Spiritüel derinleşme. Hayaller ve sezgiler güçleniyor ama illüzyonlara dikkat.',
      pluto: 'Derin iç dönüşüm. Geçmişin gölgelerini aydınlatma zamanı.'
    };
    return meanings[key] || 'Bu gezegen şu anda retro hareket ediyor.';
  }

  function getSignColor(idx) {
    const colors = ['#FF4444','#66BB6A','#FFEB3B','#42A5F5','#FF7043','#26A69A','#EC407A','#AB47BC','#FF7043','#5C6BC0','#29B6F6','#78909C'];
    return colors[idx % 12];
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

  // INIT
  populateCities();
  createStarfield();
  createNebula();
  initSplash();
  initCursorGlow();
  setTimeout(() => document.body.classList.add('loaded'), 100);
});
