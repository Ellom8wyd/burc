/**
 * Astroloji Hesaplama Motoru
 * Gezegen pozisyonları, ev hesaplamaları ve açı hesaplamaları
 * VSOP87 bazlı basitleştirilmiş yüksek hassasiyetli hesaplamalar
 */

const AstroEngine = (() => {

  // ============================================
  // SABITLER
  // ============================================
  const DEG = Math.PI / 180;
  const RAD = 180 / Math.PI;
  const J2000 = 2451545.0; // J2000.0 epoch

  // Burç isimleri ve sembolleri
  const SIGNS = [
    { name: 'Koç', symbol: '♈', element: 'Ateş', modality: 'Öncü' },
    { name: 'Boğa', symbol: '♉', element: 'Toprak', modality: 'Sabit' },
    { name: 'İkizler', symbol: '♊', element: 'Hava', modality: 'Değişken' },
    { name: 'Yengeç', symbol: '♋', element: 'Su', modality: 'Öncü' },
    { name: 'Aslan', symbol: '♌', element: 'Ateş', modality: 'Sabit' },
    { name: 'Başak', symbol: '♍', element: 'Toprak', modality: 'Değişken' },
    { name: 'Terazi', symbol: '♎', element: 'Hava', modality: 'Öncü' },
    { name: 'Akrep', symbol: '♏', element: 'Su', modality: 'Sabit' },
    { name: 'Yay', symbol: '♐', element: 'Ateş', modality: 'Değişken' },
    { name: 'Oğlak', symbol: '♑', element: 'Toprak', modality: 'Öncü' },
    { name: 'Kova', symbol: '♒', element: 'Hava', modality: 'Sabit' },
    { name: 'Balık', symbol: '♓', element: 'Su', modality: 'Değişken' }
  ];

  // Gezegen bilgileri
  const PLANETS = {
    sun:     { name: 'Güneş',   symbol: '☉', color: '#FFD700' },
    moon:    { name: 'Ay',      symbol: '☽', color: '#C0C0C0' },
    mercury: { name: 'Merkür',  symbol: '☿', color: '#A0D2DB' },
    venus:   { name: 'Venüs',   symbol: '♀', color: '#FF69B4' },
    mars:    { name: 'Mars',    symbol: '♂', color: '#FF4500' },
    jupiter: { name: 'Jüpiter', symbol: '♃', color: '#FFA500' },
    saturn:  { name: 'Satürn',  symbol: '♄', color: '#DAA520' },
    uranus:  { name: 'Uranüs',  symbol: '♅', color: '#00CED1' },
    neptune: { name: 'Neptün',  symbol: '♆', color: '#4169E1' },
    pluto:   { name: 'Plüton',  symbol: '♇', color: '#8B4513' },
    node:    { name: 'Kuzey Düğüm', symbol: '☊', color: '#9370DB' },
    chiron:  { name: 'Chiron',  symbol: '⚷', color: '#808080' }
  };

  // Açı (aspect) tanımları
  const ASPECTS = [
    { name: 'Kavuşum',    symbol: '☌', angle: 0,   orb: 8, color: '#FFD700', type: 'major' },
    { name: 'Karşıt',     symbol: '☍', angle: 180, orb: 8, color: '#FF4444', type: 'major' },
    { name: 'Üçgen',      symbol: '△', angle: 120, orb: 7, color: '#44FF44', type: 'major' },
    { name: 'Kare',       symbol: '□', angle: 90,  orb: 7, color: '#FF4444', type: 'major' },
    { name: 'Altmışlık',  symbol: '⚹', angle: 60,  orb: 5, color: '#44FF44', type: 'major' },
    { name: 'Kuinkünks',  symbol: '⚻', angle: 150, orb: 3, color: '#AAAAAA', type: 'minor' },
    { name: 'Yarı Kare',  symbol: '∠', angle: 45,  orb: 2, color: '#FF8844', type: 'minor' },
    { name: 'Yarı Altmışlık', symbol: '⚺', angle: 30, orb: 2, color: '#88FF88', type: 'minor' }
  ];

  // ============================================
  // YARDIMCI FONKSİYONLAR
  // ============================================

  function normalize(deg) {
    deg = deg % 360;
    return deg < 0 ? deg + 360 : deg;
  }

  function sin(deg) { return Math.sin(deg * DEG); }
  function cos(deg) { return Math.cos(deg * DEG); }
  function tan(deg) { return Math.tan(deg * DEG); }
  function asin(x) { return Math.asin(x) * RAD; }
  function acos(x) { return Math.acos(Math.max(-1, Math.min(1, x))) * RAD; }
  function atan2(y, x) { return Math.atan2(y, x) * RAD; }

  // ============================================
  // JULIAN DAY HESAPLAMA
  // ============================================

  function dateToJD(year, month, day, hour, minute, second) {
    if (month <= 2) {
      year -= 1;
      month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    const dayFraction = day + (hour + minute / 60 + (second || 0) / 3600) / 24;
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + dayFraction + B - 1524.5;
  }

  function jdToT(jd) {
    return (jd - J2000) / 36525.0;
  }

  // ============================================
  // NÜTİSYON VE OBLİKLİK
  // ============================================

  function obliquityOfEcliptic(T) {
    const eps0 = 23.439291 - 0.0130042 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T;
    const omega = 125.04 - 1934.136 * T;
    const L0 = 280.4665 + 36000.7698 * T;
    const Lm = 218.3165 + 481267.8813 * T;
    const dEps = (9.20 * cos(omega) + 0.57 * cos(2 * L0) + 0.10 * cos(2 * Lm) - 0.09 * cos(2 * omega)) / 3600;
    return eps0 + dEps;
  }

  function nutation(T) {
    const omega = 125.04 - 1934.136 * T;
    const L0 = 280.4665 + 36000.7698 * T;
    const Lm = 218.3165 + 481267.8813 * T;
    const dPsi = (-17.20 * sin(omega) - 1.32 * sin(2 * L0) - 0.23 * sin(2 * Lm) + 0.21 * sin(2 * omega)) / 3600;
    return dPsi;
  }

  // ============================================
  // SİDEREAL TIME
  // ============================================

  function greenwichSiderealTime(jd) {
    const T = jdToT(jd);
    let gmst = 280.46061837 + 360.98564736629 * (jd - J2000) + 0.000387933 * T * T - T * T * T / 38710000;
    gmst = normalize(gmst);
    const dPsi = nutation(T);
    const eps = obliquityOfEcliptic(T);
    gmst += dPsi * cos(eps);
    return normalize(gmst);
  }

  function localSiderealTime(jd, longitude) {
    return normalize(greenwichSiderealTime(jd) + longitude);
  }

  // ============================================
  // GÜNEŞ HESAPLAMA (Yüksek hassasiyet)
  // ============================================

  function calcSun(T) {
    // Güneşin ortalama boylamı
    const L0 = normalize(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
    // Ortalama anomali
    const M = normalize(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
    // Yörünge eksantrikliği
    const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;
    // Merkez denklemi
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M)
            + (0.019993 - 0.000101 * T) * sin(2 * M)
            + 0.000289 * sin(3 * M);
    // Gerçek boylam
    const sunLon = L0 + C;
    // Apparent longitude (nütasyon düzeltmesi)
    const omega = 125.04 - 1934.136 * T;
    const lambda = sunLon - 0.00569 - 0.00478 * sin(omega);

    return { longitude: normalize(lambda), trueLon: normalize(sunLon) };
  }

  // ============================================
  // AY HESAPLAMA (Gelişmiş)
  // ============================================

  function calcMoon(T) {
    // Ay ortalama boylamı
    const Lm = normalize(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841 - T * T * T * T / 65194000);
    // Ortalama anomali
    const Mm = normalize(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T * T * T / 69699 - T * T * T * T / 14712000);
    // Ortalama uzaklık
    const D = normalize(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T + T * T * T / 545868 - T * T * T * T / 113065000);
    // Güneş ortalama anomali
    const Ms = normalize(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + T * T * T / 24490000);
    // Yükselen düğüm boylamı
    const F = normalize(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T - T * T * T / 3526000 + T * T * T * T / 863310000);

    const E = 1 - 0.002516 * T - 0.0000074 * T * T;

    // Ana pertürbasyon terimleri (boylam)
    let dL = 0;
    dL += 6288774 * sin(Mm);
    dL += 1274027 * sin(2 * D - Mm);
    dL += 658314 * sin(2 * D);
    dL += 213618 * sin(2 * Mm);
    dL += -185116 * E * sin(Ms);
    dL += -114332 * sin(2 * F);
    dL += 58793 * sin(2 * D - 2 * Mm);
    dL += 57066 * E * sin(2 * D - Mm - Ms);
    dL += 53322 * sin(2 * D + Mm);
    dL += 45758 * E * sin(2 * D - Ms);
    dL += -40923 * E * sin(Mm - Ms);
    dL += -34720 * sin(D);
    dL += -30383 * E * sin(Mm + Ms);
    dL += 15327 * sin(2 * D - 2 * F);
    dL += -12528 * sin(2 * F + Mm);
    dL += 10980 * sin(2 * F - Mm);
    dL += 10675 * sin(4 * D - Mm);
    dL += 10034 * sin(3 * Mm);
    dL += 8548 * sin(4 * D - 2 * Mm);
    dL += -7888 * E * sin(2 * D + Ms - Mm);
    dL += -6766 * E * sin(2 * D + Ms);
    dL += -5163 * sin(D - Mm);
    dL += 4987 * E * sin(D + Ms);
    dL += 4036 * E * sin(2 * D - Ms + Mm);
    dL += 3994 * sin(2 * D + 2 * Mm);
    dL += 3861 * sin(4 * D);
    dL += 3665 * sin(2 * D - 3 * Mm);
    dL += -2689 * E * sin(Ms - 2 * Mm);
    dL += -2602 * sin(2 * D + Mm - 2 * F);
    dL += 2390 * E * sin(2 * D - Mm - 2 * Ms); // Düzeltilmiş
    dL += -2348 * sin(D + Mm);
    dL += 2236 * E * E * sin(2 * D - 2 * Ms);
    dL += -2120 * E * sin(Mm + 2 * Ms); // Düzeltilmiş
    dL += -2069 * E * E * sin(2 * Ms);

    const moonLon = Lm + dL / 1000000;
    return { longitude: normalize(moonLon) };
  }

  // ============================================
  // GEZEGEN HESAPLAMALARI (VSOP87 basitleştirilmiş)
  // ============================================

  // Gezegen yörünge elemanları [L0, L1, a, e0, e1, I, omega, Omega, Pi]
  const ORBITAL_ELEMENTS = {
    mercury: {
      L: [252.250324, 149472.6746358], a: 0.387098310,
      e: [0.20563175, 0.000020407], I: [7.004986, 0.0018215],
      omega: [29.124279, 1.1403196], Omega: [48.330893, 1.1861883]
    },
    venus: {
      L: [181.979801, 58517.8156760], a: 0.723329820,
      e: [0.00677188, -0.000047766], I: [3.394662, 0.0010037],
      omega: [54.891836, 0.5081678], Omega: [76.679920, 0.9011190]
    },
    earth: {
      L: [100.466449, 35999.3728519], a: 1.000001018,
      e: [0.01670862, -0.000042037], I: [0, 0],
      omega: [102.937348, 1.7195269], Omega: [0, 0]
    },
    mars: {
      L: [355.433275, 19140.2993313], a: 1.523679342,
      e: [0.09340062, 0.000090484], I: [1.849726, -0.0006011],
      omega: [286.502166, 1.0697667], Omega: [49.558093, 0.7720959]
    },
    jupiter: {
      L: [34.351484, 3034.9056746], a: 5.202603191,
      e: [0.04849485, 0.000163244], I: [1.303270, -0.0019872],
      omega: [273.867347, 1.4564632], Omega: [100.464441, 1.0209550]
    },
    saturn: {
      L: [50.077471, 1222.1137943], a: 9.554909596,
      e: [0.05550862, -0.000346818], I: [2.488878, 0.0025515],
      omega: [339.391263, 1.1407659], Omega: [113.665524, 0.8770880]
    },
    uranus: {
      L: [314.055005, 428.4669983], a: 19.218446062,
      e: [0.04629590, -0.000027337], I: [0.773196, 0.0007744],
      omega: [98.999170, 1.0852075], Omega: [74.005947, 0.5211258]
    },
    neptune: {
      L: [304.348665, 218.4862002], a: 30.110386869,
      e: [0.00898809, 0.000006408], I: [1.769952, -0.0093082],
      omega: [276.336104, 0.7029613], Omega: [131.784057, 1.1022039]
    }
  };

  function calcPlanetPosition(planet, T) {
    const el = ORBITAL_ELEMENTS[planet];
    if (!el) return null;

    const L = normalize(el.L[0] + el.L[1] * T);
    const e = el.e[0] + el.e[1] * T;
    const I = el.I[0] + el.I[1] * T;
    const omega = normalize(el.omega[0] + el.omega[1] * T);
    const Omega = normalize(el.Omega[0] + el.Omega[1] * T);

    // Ortalama anomali
    const M = normalize(L - omega);

    // Kepler denklemi (iteratif)
    let E0 = M;
    for (let i = 0; i < 15; i++) {
      const dE = (M - (E0 - e * RAD * sin(E0))) / (1 - e * cos(E0));
      E0 += dE;
      if (Math.abs(dE) < 1e-9) break;
    }

    // Gerçek anomali
    const nu = 2 * atan2(
      Math.sqrt(1 + e) * sin(E0 / 2),
      Math.sqrt(1 - e) * cos(E0 / 2)
    );

    // Heliosentrik ekliptik boylam
    const lonH = normalize(nu + omega);

    return { helioLon: lonH, inclination: I, node: Omega, e: e };
  }

  function helioToGeo(planetData, earthData) {
    if (!planetData || !earthData) return 0;
    // Basitleştirilmiş heliosentrik→geosentrik dönüşüm
    const l = planetData.helioLon;
    const Le = earthData.helioLon;
    // Dış gezegenler için yaklaşık formül
    const geoLon = normalize(l + 180 + (Le - l));
    return geoLon;
  }

  function calcAllPlanets(T) {
    const earthData = calcPlanetPosition('earth', T);
    const sunData = calcSun(T);
    const moonData = calcMoon(T);

    const results = {};

    // Güneş
    results.sun = {
      longitude: sunData.longitude,
      ...getPlanetInfo('sun', sunData.longitude)
    };

    // Ay
    results.moon = {
      longitude: moonData.longitude,
      ...getPlanetInfo('moon', moonData.longitude)
    };

    // Gezegenler
    const planetNames = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

    for (const name of planetNames) {
      const pData = calcPlanetPosition(name, T);
      if (!pData) continue;

      // Heliosentrik → Geosentrik dönüşüm (geliştirilmiş)
      let geoLon;
      if (name === 'mercury' || name === 'venus') {
        // İç gezegenler için özel hesaplama
        const pLon = pData.helioLon * DEG;
        const eLon = earthData.helioLon * DEG;
        const pR = pData.e; // Basitleştirilmiş yarıçap
        const planetEl = ORBITAL_ELEMENTS[name];
        const a = planetEl.a;
        const eR = ORBITAL_ELEMENTS.earth.a;

        const x = a * Math.cos(pLon) - eR * Math.cos(eLon);
        const y = a * Math.sin(pLon) - eR * Math.sin(eLon);
        geoLon = normalize(Math.atan2(y, x) * RAD);
      } else {
        // Dış gezegenler
        const planetEl = ORBITAL_ELEMENTS[name];
        const a = planetEl.a;
        const eR = ORBITAL_ELEMENTS.earth.a;
        const pLon = pData.helioLon * DEG;
        const eLon = earthData.helioLon * DEG;

        const x = a * Math.cos(pLon) - eR * Math.cos(eLon);
        const y = a * Math.sin(pLon) - eR * Math.sin(eLon);
        geoLon = normalize(Math.atan2(y, x) * RAD);
      }

      results[name] = {
        longitude: geoLon,
        ...getPlanetInfo(name, geoLon)
      };
    }

    // Plüton (basitleştirilmiş hesaplama)
    results.pluto = calcPluto(T);

    // Kuzey Ay Düğümü
    const nodeData = calcLunarNode(T);
    results.node = {
      longitude: nodeData,
      ...getPlanetInfo('node', nodeData)
    };

    // Chiron (basitleştirilmiş)
    results.chiron = calcChiron(T);

    // Retro tespiti: T+1 gün'deki pozisyonlarla karşılaştır
    const dT = 1 / 36525; // ~1 gün ileri
    const futureEarth = calcPlanetPosition('earth', T + dT);
    const retroPlanets = ['mercury','venus','mars','jupiter','saturn','uranus','neptune'];
    for (const name of retroPlanets) {
      const futP = calcPlanetPosition(name, T + dT);
      if (!futP || !futureEarth) continue;
      const planetEl = ORBITAL_ELEMENTS[name];
      const a = planetEl.a;
      const eR = ORBITAL_ELEMENTS.earth.a;
      const pLon = futP.helioLon * DEG;
      const eLon = futureEarth.helioLon * DEG;
      const x = a * Math.cos(pLon) - eR * Math.cos(eLon);
      const y = a * Math.sin(pLon) - eR * Math.sin(eLon);
      const futGeoLon = normalize(Math.atan2(y, x) * RAD);
      let diff = futGeoLon - results[name].longitude;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      results[name].retrograde = diff < 0;
    }
    // Plüton retro
    const futPluto = calcPluto(T + dT);
    if (futPluto && results.pluto) {
      let pDiff = futPluto.longitude - results.pluto.longitude;
      if (pDiff > 180) pDiff -= 360;
      if (pDiff < -180) pDiff += 360;
      results.pluto.retrograde = pDiff < 0;
    }
    // Güneş ve Ay asla retro olmaz
    results.sun.retrograde = false;
    results.moon.retrograde = false;
    if (results.node) results.node.retrograde = false;
    if (results.chiron) results.chiron.retrograde = false;

    return results;
  }

  function calcPluto(T) {
    // Plüton basitleştirilmiş hesaplama
    const S = 50.03 + 0.033459652 * T * 36525;
    const P = 238.95 + 0.003968789 * T * 36525;

    let lon = 238.958116 + 144.9600 * T;
    lon += 6.6540 * sin(S);
    lon += 1.2100 * sin(2 * S);
    lon -= 0.7045 * sin(P - S);
    lon -= 0.3565 * sin(2 * (P - S));
    lon = normalize(lon);

    return {
      longitude: lon,
      ...getPlanetInfo('pluto', lon)
    };
  }

  function calcLunarNode(T) {
    // Kuzey Ay Düğümü (True Node)
    let node = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + T * T * T / 467441 - T * T * T * T / 60616000;
    // True node düzeltmeleri
    const omega = node;
    const D = 297.8501921 + 445267.1114034 * T;
    const M = 357.5291092 + 35999.0502909 * T;
    const Mm = 134.9633964 + 477198.8675055 * T;
    const F = 93.2720950 + 483202.0175233 * T;

    node -= 1.4979 * sin(2 * (D - F));
    node -= 0.1500 * sin(M);
    node -= 0.1226 * sin(2 * D);
    node += 0.1176 * sin(2 * F);
    node -= 0.0801 * sin(2 * (Mm - F));

    return normalize(node);
  }

  function calcChiron(T) {
    // Chiron basitleştirilmiş yörünge
    const L = normalize(209.3 + 1.850 * T * 100);
    const M = normalize(L - 339.0);
    const e = 0.3786;
    let E = M;
    for (let i = 0; i < 10; i++) {
      E = M + e * RAD * sin(E);
    }
    const nu = 2 * atan2(
      Math.sqrt(1 + e) * sin(E / 2),
      Math.sqrt(1 - e) * cos(E / 2)
    );
    const lon = normalize(nu + 339.0);

    return {
      longitude: lon,
      ...getPlanetInfo('chiron', lon)
    };
  }

  function getPlanetInfo(planetId, longitude) {
    const signIndex = Math.floor(longitude / 30);
    const degree = longitude % 30;
    const sign = SIGNS[signIndex];
    const degInt = Math.floor(degree);
    const minFloat = (degree - degInt) * 60;
    const minInt = Math.floor(minFloat);
    const secInt = Math.floor((minFloat - minInt) * 60);

    return {
      sign: sign,
      signIndex: signIndex,
      degree: degree,
      degreeFormatted: `${degInt}°${String(minInt).padStart(2, '0')}'${String(secInt).padStart(2, '0')}"`,
      fullFormatted: `${sign.symbol} ${degInt}°${String(minInt).padStart(2, '0')}'`,
      planet: PLANETS[planetId]
    };
  }

  // ============================================
  // EV HESAPLAMALARI (Placidus Sistemi)
  // ============================================

  function calcHouses(jd, latitude, longitude) {
    const T = jdToT(jd);
    const lst = localSiderealTime(jd, longitude);
    const eps = obliquityOfEcliptic(T);
    const lat = latitude;

    // MC (Medium Coeli / Gökyüzünün Ortası)
    const RAMC = lst;
    let MC = normalize(atan2(sin(RAMC), cos(RAMC) * cos(eps)));
    // MC her zaman RAMC'nin ekliptik karşılığıdır
    MC = normalize(atan2(sin(RAMC) * cos(eps), cos(RAMC)));

    // Aşağıdaki çeyrek kontrolü
    if (cos(RAMC) < 0) MC = normalize(MC + 180);

    // ASC (Yükselen Burç)
    const ASC = normalize(
      atan2(cos(RAMC), -(sin(RAMC) * cos(eps) + tan(lat) * sin(eps)))
    );

    // Placidus Ev Hesabı
    const houses = new Array(12);
    houses[0] = ASC;      // 1. Ev başlangıcı
    houses[9] = MC;       // 10. Ev başlangıcı
    houses[3] = normalize(MC + 180); // IC (4. Ev)
    houses[6] = normalize(ASC + 180); // DSC (7. Ev)

    // Placidus ara evler (2, 3, 11, 12)
    houses[10] = calcPlacidusHouse(RAMC, eps, lat, 1/3, true);   // 11. Ev
    houses[11] = calcPlacidusHouse(RAMC, eps, lat, 2/3, true);   // 12. Ev
    houses[1]  = calcPlacidusHouse(RAMC, eps, lat, 1/3, false);  // 2. Ev
    houses[2]  = calcPlacidusHouse(RAMC, eps, lat, 2/3, false);  // 3. Ev

    // 5, 6, 8, 9 (karşıt evler)
    houses[4] = normalize(houses[10] + 180); // 5. Ev
    houses[5] = normalize(houses[11] + 180); // 6. Ev
    houses[7] = normalize(houses[1] + 180);  // 8. Ev
    houses[8] = normalize(houses[2] + 180);  // 9. Ev

    return {
      cusps: houses,
      ascendant: ASC,
      mc: MC,
      ic: normalize(MC + 180),
      descendant: normalize(ASC + 180)
    };
  }

  function calcPlacidusHouse(RAMC, eps, lat, fraction, isAbove) {
    // İteratif Placidus hesaplama
    let cusp;
    if (isAbove) {
      // MC üstü (11, 12)
      let RA = RAMC + fraction * 90;
      for (let i = 0; i < 20; i++) {
        const D = asin(sin(eps) * sin(RA));
        const AD = asin(tan(lat) * tan(D));
        RA = RAMC + fraction * (90 + AD);
      }
      cusp = normalize(atan2(sin(RA) * cos(eps), cos(RA)));
      if (cos(RA) < 0) cusp = normalize(cusp + 180);
    } else {
      // MC altı (2, 3)
      let RA = RAMC + 180 + fraction * 90;
      for (let i = 0; i < 20; i++) {
        const D = asin(sin(eps) * sin(RA));
        const AD = asin(tan(lat) * tan(D));
        RA = RAMC + 180 + fraction * (90 + AD);
      }
      cusp = normalize(atan2(sin(RA) * cos(eps), cos(RA)));
      if (cos(RA) < 0) cusp = normalize(cusp + 180);
    }
    return cusp;
  }

  // ============================================
  // AÇI (ASPECT) HESAPLAMALARI
  // ============================================

  function calcAspects(planets) {
    const aspects = [];
    const planetKeys = Object.keys(planets);

    for (let i = 0; i < planetKeys.length; i++) {
      for (let j = i + 1; j < planetKeys.length; j++) {
        const p1Key = planetKeys[i];
        const p2Key = planetKeys[j];
        const p1 = planets[p1Key];
        const p2 = planets[p2Key];

        if (!p1 || !p2) continue;

        let diff = Math.abs(p1.longitude - p2.longitude);
        if (diff > 180) diff = 360 - diff;

        for (const aspect of ASPECTS) {
          const orb = Math.abs(diff - aspect.angle);
          if (orb <= aspect.orb) {
            aspects.push({
              planet1: p1Key,
              planet2: p2Key,
              planet1Info: p1.planet,
              planet2Info: p2.planet,
              aspect: aspect,
              orb: orb,
              exactness: 1 - (orb / aspect.orb), // 1 = tam, 0 = sınırda
              applying: false // Bu basitleştirilmiş versiyon
            });
            break;
          }
        }
      }
    }

    // Önem sırasına göre sırala
    aspects.sort((a, b) => b.exactness - a.exactness);
    return aspects;
  }

  // ============================================
  // GEZEGEN EVLERİ
  // ============================================

  function findPlanetHouses(planets, houses) {
    const result = {};
    for (const [key, planet] of Object.entries(planets)) {
      if (!planet) continue;
      let houseNum = 0;
      for (let i = 0; i < 12; i++) {
        const next = (i + 1) % 12;
        let start = houses.cusps[i];
        let end = houses.cusps[next];

        if (end < start) end += 360;
        let pLon = planet.longitude;
        if (pLon < start) pLon += 360;

        if (pLon >= start && pLon < end) {
          houseNum = i + 1;
          break;
        }
      }
      result[key] = houseNum || 1;
    }
    return result;
  }

  // ============================================
  // ELEMENT VE MODALİTE ANALİZİ
  // ============================================

  function analyzeChart(planets) {
    const elements = { Ateş: 0, Toprak: 0, Hava: 0, Su: 0 };
    const modalities = { Öncü: 0, Sabit: 0, Değişken: 0 };

    // Ağırlıklar
    const weights = {
      sun: 3, moon: 3, mercury: 2, venus: 2, mars: 2,
      jupiter: 1, saturn: 1, uranus: 0.5, neptune: 0.5, pluto: 0.5
    };

    for (const [key, planet] of Object.entries(planets)) {
      if (!planet || !planet.sign || !weights[key]) continue;
      const w = weights[key];
      elements[planet.sign.element] += w;
      modalities[planet.sign.modality] += w;
    }

    return { elements, modalities };
  }

  // ============================================
  // ANA HESAPLAMA FONKSİYONU
  // ============================================

  function calculate(birthDate, birthTime, latitude, longitude, timezone) {
    // Doğum zamanını UTC'ye çevir
    const [year, month, day] = birthDate.split('-').map(Number);
    const [hour, minute] = birthTime.split(':').map(Number);

    const utcHour = hour - timezone;
    const jd = dateToJD(year, month, day, utcHour, minute, 0);
    const T = jdToT(jd);

    // Gezegen pozisyonları
    const planets = calcAllPlanets(T);

    // Ev hesaplamaları
    const houses = calcHouses(jd, latitude, longitude);

    // Açılar
    const aspects = calcAspects(planets);

    // Gezegen-ev eşleşmeleri
    const planetHouses = findPlanetHouses(planets, houses);

    // Analiz
    const analysis = analyzeChart(planets);

    // Yükselen ve MC bilgileri
    const ascInfo = getPlanetInfo('sun', houses.ascendant);
    const mcInfo = getPlanetInfo('sun', houses.mc);

    return {
      planets,
      houses,
      aspects,
      planetHouses,
      analysis,
      ascendant: {
        longitude: houses.ascendant,
        ...ascInfo,
        name: 'Yükselen'
      },
      mc: {
        longitude: houses.mc,
        ...mcInfo,
        name: 'Gökyüzü Ortası (MC)'
      },
      julianDay: jd,
      T: T
    };
  }

  // ============================================
  // PUBLIC API
  // ============================================

  return {
    calculate,
    SIGNS,
    PLANETS,
    ASPECTS,
    normalize,
    getPlanetInfo,
    dateToJD,
    jdToT
  };

})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AstroEngine;
}
