/**
 * Doğum Haritası Çizici
 * SVG tabanlı zodiak çemberi, gezegen, ev ve açı çizimi
 */

const ChartRenderer = (() => {

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const CENTER = 300;
  const OUTER_R = 280;
  const SIGN_R = 255;
  const INNER_R = 230;
  const HOUSE_R = 170;
  const PLANET_R = 195;
  const ASPECT_R = 140;

  // Burç sembolleri (daha büyük ve okunur)
  const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  const SIGN_COLORS = [
    '#FF4136', '#8BC34A', '#FFEB3B', '#2196F3',
    '#FF9800', '#4CAF50', '#E91E63', '#9C27B0',
    '#FF5722', '#607D8B', '#00BCD4', '#3F51B5'
  ];
  const ELEMENT_COLORS = {
    'Ateş': '#FF6B35',
    'Toprak': '#7CB342',
    'Hava': '#42A5F5',
    'Su': '#AB47BC'
  };

  function createSVG(container) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 600 600');
    svg.setAttribute('class', 'natal-chart-svg');
    svg.id = 'natal-chart-svg';

    // Defs: filtreler ve gradyanlar
    const defs = document.createElementNS(SVG_NS, 'defs');

    // Glow filtresi
    defs.innerHTML = `
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="planet-glow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <radialGradient id="center-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(15,10,40,0.9)"/>
        <stop offset="70%" stop-color="rgba(10,5,30,0.95)"/>
        <stop offset="100%" stop-color="rgba(5,2,20,1)"/>
      </radialGradient>
      <radialGradient id="chart-bg-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="rgba(20,15,60,0.3)"/>
        <stop offset="100%" stop-color="rgba(5,2,20,0.6)"/>
      </radialGradient>
      <linearGradient id="sign-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="rgba(100,80,200,0.15)"/>
        <stop offset="50%" stop-color="rgba(60,40,150,0.08)"/>
        <stop offset="100%" stop-color="rgba(100,80,200,0.15)"/>
      </linearGradient>
    `;

    svg.appendChild(defs);
    container.appendChild(svg);
    return svg;
  }

  function polarToXY(angleDeg, radius) {
    // Astrolojik konvansiyon: 0° = sol (ASC), saatin tersi
    const rad = (180 - angleDeg) * Math.PI / 180;
    return {
      x: CENTER + radius * Math.cos(rad),
      y: CENTER - radius * Math.sin(rad)
    };
  }

  function drawSignRing(svg, ascendant) {
    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('class', 'sign-ring');

    // Dış çember
    const outerCircle = document.createElementNS(SVG_NS, 'circle');
    outerCircle.setAttribute('cx', CENTER);
    outerCircle.setAttribute('cy', CENTER);
    outerCircle.setAttribute('r', OUTER_R);
    outerCircle.setAttribute('fill', 'none');
    outerCircle.setAttribute('stroke', 'rgba(180,160,255,0.4)');
    outerCircle.setAttribute('stroke-width', '1.5');
    outerCircle.setAttribute('filter', 'url(#glow)');
    group.appendChild(outerCircle);

    // İç çember
    const innerCircle = document.createElementNS(SVG_NS, 'circle');
    innerCircle.setAttribute('cx', CENTER);
    innerCircle.setAttribute('cy', CENTER);
    innerCircle.setAttribute('r', INNER_R);
    innerCircle.setAttribute('fill', 'none');
    innerCircle.setAttribute('stroke', 'rgba(180,160,255,0.3)');
    innerCircle.setAttribute('stroke-width', '1');
    group.appendChild(innerCircle);

    // Burç halka arka planı
    const ringBg = document.createElementNS(SVG_NS, 'circle');
    ringBg.setAttribute('cx', CENTER);
    ringBg.setAttribute('cy', CENTER);
    ringBg.setAttribute('r', (OUTER_R + INNER_R) / 2);
    ringBg.setAttribute('fill', 'none');
    ringBg.setAttribute('stroke', 'url(#sign-ring-gradient)');
    ringBg.setAttribute('stroke-width', OUTER_R - INNER_R);
    group.appendChild(ringBg);

    // Ev çemberi
    const houseCircle = document.createElementNS(SVG_NS, 'circle');
    houseCircle.setAttribute('cx', CENTER);
    houseCircle.setAttribute('cy', CENTER);
    houseCircle.setAttribute('r', HOUSE_R);
    houseCircle.setAttribute('fill', 'none');
    houseCircle.setAttribute('stroke', 'rgba(180,160,255,0.15)');
    houseCircle.setAttribute('stroke-width', '0.5');
    group.appendChild(houseCircle);

    // Merkez dairesi
    const centerCircle = document.createElementNS(SVG_NS, 'circle');
    centerCircle.setAttribute('cx', CENTER);
    centerCircle.setAttribute('cy', CENTER);
    centerCircle.setAttribute('r', ASPECT_R);
    centerCircle.setAttribute('fill', 'url(#center-gradient)');
    centerCircle.setAttribute('stroke', 'rgba(180,160,255,0.1)');
    centerCircle.setAttribute('stroke-width', '0.5');
    group.appendChild(centerCircle);

    // Burç bölümleri ve sembolleri
    const rotation = ascendant || 0;
    for (let i = 0; i < 12; i++) {
      const startAngle = rotation + i * 30;
      const midAngle = startAngle + 15;
      const endAngle = startAngle + 30;

      // Bölme çizgileri
      const p1 = polarToXY(startAngle, INNER_R);
      const p2 = polarToXY(startAngle, OUTER_R);
      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', p1.x);
      line.setAttribute('y1', p1.y);
      line.setAttribute('x2', p2.x);
      line.setAttribute('y2', p2.y);
      line.setAttribute('stroke', 'rgba(180,160,255,0.25)');
      line.setAttribute('stroke-width', '0.8');
      group.appendChild(line);

      // Burç sembolü
      const pos = polarToXY(midAngle, SIGN_R);
      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('x', pos.x);
      text.setAttribute('y', pos.y);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'central');
      text.setAttribute('fill', SIGN_COLORS[i]);
      text.setAttribute('font-size', '18');
      text.setAttribute('font-family', 'serif');
      text.setAttribute('filter', 'url(#glow)');
      text.setAttribute('class', 'sign-symbol');
      text.setAttribute('style', `animation-delay: ${i * 0.08}s`);
      text.textContent = SIGN_SYMBOLS[i];
      group.appendChild(text);

      // Derece işaretleri (her 10 derecede)
      for (let d = 0; d < 30; d += 10) {
        if (d === 0) continue;
        const tickAngle = rotation + i * 30 + d;
        const t1 = polarToXY(tickAngle, INNER_R);
        const t2 = polarToXY(tickAngle, INNER_R + 5);
        const tick = document.createElementNS(SVG_NS, 'line');
        tick.setAttribute('x1', t1.x);
        tick.setAttribute('y1', t1.y);
        tick.setAttribute('x2', t2.x);
        tick.setAttribute('y2', t2.y);
        tick.setAttribute('stroke', 'rgba(180,160,255,0.15)');
        tick.setAttribute('stroke-width', '0.5');
        group.appendChild(tick);
      }
    }

    svg.appendChild(group);
  }

  function drawHouses(svg, houses, ascendant) {
    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('class', 'houses');

    for (let i = 0; i < 12; i++) {
      const angle = houses.cusps[i];
      const isAngle = (i === 0 || i === 3 || i === 6 || i === 9);

      // Ev çizgileri
      const p1 = polarToXY(angle, isAngle ? 0 : HOUSE_R);
      const p2 = polarToXY(angle, INNER_R);

      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', p1.x);
      line.setAttribute('y1', p1.y);
      line.setAttribute('x2', p2.x);
      line.setAttribute('y2', p2.y);

      if (isAngle) {
        line.setAttribute('stroke', 'rgba(255,215,0,0.6)');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('filter', 'url(#glow)');
      } else {
        line.setAttribute('stroke', 'rgba(180,160,255,0.2)');
        line.setAttribute('stroke-width', '0.8');
        line.setAttribute('stroke-dasharray', '4,4');
      }
      group.appendChild(line);

      // Ev numarası
      const nextCusp = houses.cusps[(i + 1) % 12];
      let midAngle = angle + ((nextCusp - angle + 360) % 360) / 2;
      if (Math.abs(nextCusp - angle) > 180) {
        midAngle = angle + ((nextCusp - angle + 360) % 360) / 2;
      }

      const numPos = polarToXY(midAngle, HOUSE_R + 18);
      const houseNum = document.createElementNS(SVG_NS, 'text');
      houseNum.setAttribute('x', numPos.x);
      houseNum.setAttribute('y', numPos.y);
      houseNum.setAttribute('text-anchor', 'middle');
      houseNum.setAttribute('dominant-baseline', 'central');
      houseNum.setAttribute('fill', 'rgba(180,160,255,0.5)');
      houseNum.setAttribute('font-size', '10');
      houseNum.setAttribute('font-family', "'Cormorant Garamond', serif");
      houseNum.textContent = toRoman(i + 1);
      group.appendChild(houseNum);
    }

    // ASC, DSC, MC, IC etiketleri
    const labels = [
      { text: 'ASC', angle: houses.ascendant, color: '#FFD700' },
      { text: 'DSC', angle: houses.descendant, color: '#FFD700' },
      { text: 'MC', angle: houses.mc, color: '#FFD700' },
      { text: 'IC', angle: houses.ic, color: '#FFD700' }
    ];

    labels.forEach(label => {
      const pos = polarToXY(label.angle, OUTER_R + 18);
      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('x', pos.x);
      text.setAttribute('y', pos.y);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'central');
      text.setAttribute('fill', label.color);
      text.setAttribute('font-size', '11');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('font-family', "'Cormorant Garamond', serif");
      text.setAttribute('filter', 'url(#glow)');
      text.setAttribute('class', 'angle-label');
      text.textContent = label.text;
      group.appendChild(text);
    });

    svg.appendChild(group);
  }

  function drawPlanets(svg, planets) {
    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('class', 'planets');

    // Gezegen pozisyonlarını topla ve çakışmaları çöz
    const positions = [];
    for (const [key, planet] of Object.entries(planets)) {
      if (!planet || !planet.planet) continue;
      positions.push({
        key,
        longitude: planet.longitude,
        angle: planet.longitude,
        info: planet.planet,
        sign: planet.sign,
        degreeFormatted: planet.degreeFormatted,
        fullFormatted: planet.fullFormatted
      });
    }

    // Çakışma çözücü
    positions.sort((a, b) => a.angle - b.angle);
    const MIN_GAP = 8;
    for (let pass = 0; pass < 5; pass++) {
      for (let i = 0; i < positions.length; i++) {
        const next = (i + 1) % positions.length;
        let diff = (positions[next].angle - positions[i].angle + 360) % 360;
        if (diff < MIN_GAP && diff > 0) {
          positions[i].angle -= (MIN_GAP - diff) / 2;
          positions[next].angle += (MIN_GAP - diff) / 2;
        }
      }
    }

    // Gezegenleri çiz
    positions.forEach((p, idx) => {
      const pos = polarToXY(p.angle, PLANET_R);
      const color = p.info.color || '#FFFFFF';

      // Gezegen noktası (küçük daire)
      const dot = document.createElementNS(SVG_NS, 'circle');
      dot.setAttribute('cx', pos.x);
      dot.setAttribute('cy', pos.y);
      dot.setAttribute('r', '3');
      dot.setAttribute('fill', color);
      dot.setAttribute('filter', 'url(#planet-glow)');
      dot.setAttribute('class', 'planet-dot');
      dot.setAttribute('style', `animation-delay: ${idx * 0.12}s`);
      group.appendChild(dot);

      // Gezegen bağlantı çizgisi
      const innerPos = polarToXY(p.longitude, INNER_R);
      const connLine = document.createElementNS(SVG_NS, 'line');
      connLine.setAttribute('x1', innerPos.x);
      connLine.setAttribute('y1', innerPos.y);
      connLine.setAttribute('x2', pos.x);
      connLine.setAttribute('y2', pos.y);
      connLine.setAttribute('stroke', color);
      connLine.setAttribute('stroke-width', '0.5');
      connLine.setAttribute('stroke-opacity', '0.3');
      group.appendChild(connLine);

      // Gezegen sembolü
      const symbolPos = polarToXY(p.angle, PLANET_R + 2);
      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('x', symbolPos.x);
      text.setAttribute('y', symbolPos.y);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'central');
      text.setAttribute('fill', color);
      text.setAttribute('font-size', '16');
      text.setAttribute('filter', 'url(#planet-glow)');
      text.setAttribute('class', 'planet-symbol');
      text.setAttribute('style', `animation-delay: ${idx * 0.12}s`);
      text.setAttribute('data-planet', p.key);

      // Tooltip
      const title = document.createElementNS(SVG_NS, 'title');
      title.textContent = `${p.info.name}: ${p.fullFormatted} (${p.degreeFormatted})`;
      text.appendChild(title);

      text.textContent = p.info.symbol;
      group.appendChild(text);
    });

    svg.appendChild(group);
    return positions;
  }

  function drawAspects(svg, aspects, planets) {
    const group = document.createElementNS(SVG_NS, 'g');
    group.setAttribute('class', 'aspects');

    aspects.forEach((aspect, idx) => {
      const p1 = planets[aspect.planet1];
      const p2 = planets[aspect.planet2];
      if (!p1 || !p2) return;

      const pos1 = polarToXY(p1.longitude, ASPECT_R);
      const pos2 = polarToXY(p2.longitude, ASPECT_R);

      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', pos1.x);
      line.setAttribute('y1', pos1.y);
      line.setAttribute('x2', pos2.x);
      line.setAttribute('y2', pos2.y);
      line.setAttribute('stroke', aspect.aspect.color);
      line.setAttribute('stroke-width', aspect.aspect.type === 'major' ? '1' : '0.5');
      line.setAttribute('stroke-opacity', 0.15 + aspect.exactness * 0.45);
      line.setAttribute('class', 'aspect-line');
      line.setAttribute('style', `animation-delay: ${idx * 0.03}s`);

      if (aspect.aspect.angle === 90 || aspect.aspect.angle === 150 || aspect.aspect.angle === 45) {
        line.setAttribute('stroke-dasharray', '4,3');
      }

      // Tooltip
      const title = document.createElementNS(SVG_NS, 'title');
      title.textContent = `${aspect.planet1Info.name} ${aspect.aspect.symbol} ${aspect.planet2Info.name} (${aspect.aspect.name}, orb: ${aspect.orb.toFixed(1)}°)`;
      line.appendChild(title);

      group.appendChild(line);
    });

    svg.appendChild(group);
  }

  function toRoman(num) {
    const map = { 10: 'X', 9: 'IX', 5: 'V', 4: 'IV', 1: 'I' };
    let result = '';
    for (const [value, numeral] of Object.entries(map).sort((a, b) => b[0] - a[0])) {
      while (num >= value) { result += numeral; num -= value; }
    }
    return result;
  }

  // ============================================
  // ANA RENDER FONKSİYONU
  // ============================================

  function render(container, chartData) {
    container.innerHTML = '';

    const svg = createSVG(container);
    const asc = chartData.houses.ascendant;

    // Katmanları sırayla çiz
    drawSignRing(svg, asc);
    drawHouses(svg, chartData.houses, asc);
    drawAspects(svg, chartData.aspects, chartData.planets);
    drawPlanets(svg, chartData.planets);

    // Animasyonu tetikle
    requestAnimationFrame(() => {
      svg.classList.add('rendered');
    });

    return svg;
  }

  // ============================================
  // BİLGİ PANELİ OLUŞTURMA
  // ============================================

  function renderInfoPanel(container, chartData) {
    container.innerHTML = '';

    // Gezegen tablosu
    const planetSection = createSection('Gezegen Pozisyonları', 'planet-positions');
    const planetTable = document.createElement('div');
    planetTable.className = 'planet-table';

    const anglesRow = createAngleRow('Yükselen (ASC)', chartData.ascendant);
    planetTable.appendChild(anglesRow);
    const mcRow = createAngleRow('Gökyüzü Ortası (MC)', chartData.mc);
    planetTable.appendChild(mcRow);

    const order = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'node', 'chiron'];
    order.forEach((key, idx) => {
      const planet = chartData.planets[key];
      if (!planet || !planet.planet) return;
      const house = chartData.planetHouses[key];
      const row = createPlanetRow(planet, house, idx);
      planetTable.appendChild(row);
    });

    planetSection.appendChild(planetTable);
    container.appendChild(planetSection);

    // Evler + Açılar + Analiz: Yan yana 2-sütun
    const dualRow = document.createElement('div');
    dualRow.className = 'info-dual-row';

    // SOL: Evler + Analiz
    const leftCol = document.createElement('div');
    leftCol.className = 'info-dual-col';

    // Ev tablosu
    const houseSection = createSection('Ev Başlangıçları', 'house-cusps');
    const houseGrid = document.createElement('div');
    houseGrid.className = 'house-grid';
    for (let i = 0; i < 12; i++) {
      const cusp = chartData.houses.cusps[i];
      const info = AstroEngine.getPlanetInfo('sun', cusp);
      const div = document.createElement('div');
      div.className = 'house-item';
      div.style.animationDelay = `${i * 0.06}s`;
      div.innerHTML = `
        <span class="house-num">${toRoman(i + 1)}</span>
        <span class="house-sign" style="color: ${SIGN_COLORS[info.signIndex]}">${info.sign.symbol}</span>
        <span class="house-deg">${info.degreeFormatted}</span>
      `;
      houseGrid.appendChild(div);
    }
    houseSection.appendChild(houseGrid);
    leftCol.appendChild(houseSection);

    // Analiz
    const analysisSection = createSection('Element & Modalite', 'analysis');
    const analysisContent = document.createElement('div');
    analysisContent.className = 'analysis-content';
    const elemDiv = document.createElement('div');
    elemDiv.className = 'analysis-group';
    elemDiv.innerHTML = '<h4>Elementler</h4>';
    const totalElem = Object.values(chartData.analysis.elements).reduce((a, b) => a + b, 0);
    for (const [elem, val] of Object.entries(chartData.analysis.elements)) {
      const pct = (val / totalElem * 100).toFixed(0);
      const bar = document.createElement('div');
      bar.className = 'analysis-bar-wrapper';
      bar.innerHTML = `
        <span class="analysis-label">${elem}</span>
        <div class="analysis-bar">
          <div class="analysis-bar-fill" style="width: ${pct}%; background: ${ELEMENT_COLORS[elem]}; animation-delay: ${Object.keys(chartData.analysis.elements).indexOf(elem) * 0.15}s"></div>
        </div>
        <span class="analysis-value">${pct}%</span>
      `;
      elemDiv.appendChild(bar);
    }
    analysisContent.appendChild(elemDiv);
    const modDiv = document.createElement('div');
    modDiv.className = 'analysis-group';
    modDiv.innerHTML = '<h4>Modaliteler</h4>';
    const totalMod = Object.values(chartData.analysis.modalities).reduce((a, b) => a + b, 0);
    const modColors = { 'Öncü': '#FF6B6B', 'Sabit': '#4ECDC4', 'Değişken': '#FFE66D' };
    for (const [mod, val] of Object.entries(chartData.analysis.modalities)) {
      const pct = (val / totalMod * 100).toFixed(0);
      const bar = document.createElement('div');
      bar.className = 'analysis-bar-wrapper';
      bar.innerHTML = `
        <span class="analysis-label">${mod}</span>
        <div class="analysis-bar">
          <div class="analysis-bar-fill" style="width: ${pct}%; background: ${modColors[mod]}; animation-delay: ${Object.keys(chartData.analysis.modalities).indexOf(mod) * 0.15 + 0.6}s"></div>
        </div>
        <span class="analysis-value">${pct}%</span>
      `;
      modDiv.appendChild(bar);
    }
    analysisContent.appendChild(modDiv);
    analysisSection.appendChild(analysisContent);
    leftCol.appendChild(analysisSection);

    // SAĞ: Açılar
    const rightCol = document.createElement('div');
    rightCol.className = 'info-dual-col';
    const aspectSection = createSection('Açılar (Aspektler)', 'aspects-list');
    const aspectList = document.createElement('div');
    aspectList.className = 'aspect-list';
    const majorAspects = chartData.aspects.filter(a => a.aspect.type === 'major');
    const minorAspects = chartData.aspects.filter(a => a.aspect.type === 'minor');
    if (majorAspects.length > 0) {
      const majorTitle = document.createElement('div');
      majorTitle.className = 'aspect-category';
      majorTitle.textContent = 'Ana Açılar';
      aspectList.appendChild(majorTitle);
      majorAspects.forEach((a, idx) => {
        aspectList.appendChild(createAspectRow(a, idx));
      });
    }
    if (minorAspects.length > 0) {
      const minorTitle = document.createElement('div');
      minorTitle.className = 'aspect-category';
      minorTitle.textContent = 'Yardımcı Açılar';
      aspectList.appendChild(minorTitle);
      minorAspects.forEach((a, idx) => {
        aspectList.appendChild(createAspectRow(a, idx + majorAspects.length));
      });
    }
    aspectSection.appendChild(aspectList);
    rightCol.appendChild(aspectSection);

    dualRow.appendChild(leftCol);
    dualRow.appendChild(rightCol);
    container.appendChild(dualRow);
  }

  function createSection(title, className) {
    const section = document.createElement('div');
    section.className = `info-section ${className}`;
    const h3 = document.createElement('h3');
    h3.className = 'section-title';
    h3.textContent = title;
    section.appendChild(h3);
    return section;
  }

  function createAngleRow(label, data) {
    const row = document.createElement('div');
    row.className = 'planet-row angle-row';
    row.innerHTML = `
      <div class="planet-icon" style="color: #FFD700">★</div>
      <div class="planet-name">${label}</div>
      <div class="planet-sign" style="color: ${SIGN_COLORS[data.signIndex]}">${data.sign.symbol} ${data.sign.name}</div>
      <div class="planet-degree">${data.degreeFormatted}</div>
    `;
    return row;
  }

  function createPlanetRow(planet, house, idx) {
    const row = document.createElement('div');
    row.className = 'planet-row';
    row.style.animationDelay = `${idx * 0.06}s`;
    row.innerHTML = `
      <div class="planet-icon" style="color: ${planet.planet.color}">${planet.planet.symbol}</div>
      <div class="planet-name">${planet.planet.name}</div>
      <div class="planet-sign" style="color: ${SIGN_COLORS[planet.signIndex]}">${planet.sign.symbol} ${planet.sign.name}</div>
      <div class="planet-degree">${planet.degreeFormatted}</div>
      <div class="planet-house">Ev ${house}</div>
    `;
    return row;
  }

  function createAspectRow(aspect, idx) {
    const row = document.createElement('div');
    row.className = 'aspect-row';
    row.style.animationDelay = `${idx * 0.04}s`;
    const orbStr = aspect.orb.toFixed(1);
    const strength = aspect.exactness > 0.7 ? 'strong' : aspect.exactness > 0.4 ? 'medium' : 'weak';
    row.innerHTML = `
      <span class="aspect-planet" style="color: ${aspect.planet1Info.color}">${aspect.planet1Info.symbol}</span>
      <span class="aspect-symbol" style="color: ${aspect.aspect.color}">${aspect.aspect.symbol}</span>
      <span class="aspect-planet" style="color: ${aspect.planet2Info.color}">${aspect.planet2Info.symbol}</span>
      <span class="aspect-name">${aspect.aspect.name}</span>
      <span class="aspect-orb ${strength}">${orbStr}°</span>
    `;
    return row;
  }

  // ============================================
  // PUBLIC API
  // ============================================

  return {
    render,
    renderInfoPanel,
    SIGN_COLORS,
    ELEMENT_COLORS
  };

})();
