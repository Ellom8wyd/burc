/**
 * Synastry (Uyum) Hesaplama Motoru
 * İki doğum haritası arasındaki uyumu hesaplar
 */

const SynastryEngine = (() => {

  // ============================================
  // BURÇ UYUM MATRİSİ (0-100)
  // ============================================
  // Sıra: Koç, Boğa, İkizler, Yengeç, Aslan, Başak, Terazi, Akrep, Yay, Oğlak, Kova, Balık
  const SIGN_COMPAT = [
    //Koç  Boğ  İki  Yen  Asl  Baş  Ter  Akr  Yay  Oğl  Kov  Bal
    [ 78,  42,  82,  38,  95,  48,  62,  55,  97,  45,  80,  40], // Koç
    [ 42,  85,  48,  90,  55,  95,  72,  88,  35,  97,  40,  82], // Boğa
    [ 82,  48,  75,  42,  80,  55,  92,  38,  85,  42,  95,  52], // İkizler
    [ 38,  90,  42,  80,  55,  72,  40,  92,  35,  65,  38,  95], // Yengeç
    [ 95,  55,  80,  55,  82,  48,  72,  58,  92,  40,  62,  45], // Aslan
    [ 48,  95,  55,  72,  48,  78,  58,  65,  52,  92,  55,  68], // Başak
    [ 62,  72,  92,  40,  72,  58,  70,  52,  68,  55,  88,  48], // Terazi
    [ 55,  88,  38,  92,  58,  65,  52,  78,  42,  72,  48,  90], // Akrep
    [ 97,  35,  85,  35,  92,  52,  68,  42,  80,  40,  82,  50], // Yay
    [ 45,  97,  42,  65,  40,  92,  55,  72,  40,  82,  52,  60], // Oğlak
    [ 80,  40,  95,  38,  62,  55,  88,  48,  82,  52,  72,  45], // Kova
    [ 40,  82,  52,  95,  45,  68,  48,  90,  50,  60,  45,  80], // Balık
  ];

  // ============================================
  // GEZEGEN AĞIRLIKLARI
  // ============================================
  const PLANET_WEIGHTS = {
    sun:     { weight: 10, name: 'Güneş',  symbol: '☉' },
    moon:    { weight: 10, name: 'Ay',     symbol: '☽' },
    mercury: { weight: 5,  name: 'Merkür', symbol: '☿' },
    venus:   { weight: 9,  name: 'Venüs',  symbol: '♀' },
    mars:    { weight: 8,  name: 'Mars',   symbol: '♂' },
    jupiter: { weight: 4,  name: 'Jüpiter',symbol: '♃' },
    saturn:  { weight: 5,  name: 'Satürn', symbol: '♄' },
    uranus:  { weight: 2,  name: 'Uranüs', symbol: '♅' },
    neptune: { weight: 2,  name: 'Neptün', symbol: '♆' },
    pluto:   { weight: 2,  name: 'Plüton', symbol: '♇' }
  };

  // Önemli çift açıları ve puanları
  const PAIR_ASPECTS = [
    { angle: 0,   orb: 8,  name: 'Kavuşum',   symbol: '☌', score: 20, type: 'neutral'  },
    { angle: 60,  orb: 5,  name: 'Altmışlık', symbol: '⚹', score: 15, type: 'positive' },
    { angle: 90,  orb: 7,  name: 'Kare',      symbol: '□', score: -8, type: 'negative' },
    { angle: 120, orb: 7,  name: 'Üçgen',     symbol: '△', score: 18, type: 'positive' },
    { angle: 150, orb: 3,  name: 'Kuinkünks', symbol: '⚻', score: -5, type: 'negative' },
    { angle: 180, orb: 8,  name: 'Karşıt',    symbol: '☍', score: 10, type: 'neutral'  }
  ];

  // ============================================
  // ELEMENT UYUMU
  // ============================================
  const ELEMENT_COMPAT = {
    'Ateş-Ateş': 85,  'Ateş-Toprak': 40,  'Ateş-Hava': 88,   'Ateş-Su': 42,
    'Toprak-Toprak': 82, 'Toprak-Hava': 45, 'Toprak-Su': 85,
    'Hava-Hava': 78,  'Hava-Su': 40,
    'Su-Su': 88
  };

  function getElementCompat(e1, e2) {
    const key1 = `${e1}-${e2}`;
    const key2 = `${e2}-${e1}`;
    return ELEMENT_COMPAT[key1] || ELEMENT_COMPAT[key2] || 50;
  }

  // ============================================
  // ANA UYUM HESAPLAMA
  // ============================================

  function calculateCompatibility(chart1, chart2) {
    const results = {
      overall: 0,
      categories: {},
      aspects: [],
      signCompat: {},
      details: [],
      strengths: [],
      challenges: []
    };

    // 1. GÜNEŞ BURCU UYUMU
    const sunCompat = calcSignCompat(chart1.planets.sun, chart2.planets.sun);
    results.categories.sun = {
      score: sunCompat,
      label: 'Güneş Uyumu',
      icon: '☉',
      desc: 'Temel kişilik ve ego uyumu'
    };

    // 2. AY BURCU UYUMU
    const moonCompat = calcSignCompat(chart1.planets.moon, chart2.planets.moon);
    results.categories.moon = {
      score: moonCompat,
      label: 'Ay Uyumu',
      icon: '☽',
      desc: 'Duygusal uyum ve iç dünya'
    };

    // 3. VENÜS UYUMU (Aşk)
    const venusCompat = calcVenusCompat(chart1, chart2);
    results.categories.venus = {
      score: venusCompat,
      label: 'Venüs Uyumu',
      icon: '♀',
      desc: 'Romantik çekim ve aşk dili'
    };

    // 4. MARS UYUMU (Tutku)
    const marsCompat = calcMarsCompat(chart1, chart2);
    results.categories.mars = {
      score: marsCompat,
      label: 'Mars Uyumu',
      icon: '♂',
      desc: 'Fiziksel çekim ve enerji'
    };

    // 5. İLETİŞİM (Merkür)
    const mercuryCompat = calcSignCompat(chart1.planets.mercury, chart2.planets.mercury);
    results.categories.mercury = {
      score: mercuryCompat,
      label: 'İletişim Uyumu',
      icon: '☿',
      desc: 'Zihinsel uyum ve iletişim'
    };

    // 6. ELEMENT UYUMU
    const elementCompat = calcElementCompat(chart1, chart2);
    results.categories.element = {
      score: elementCompat,
      label: 'Element Uyumu',
      icon: '🜂',
      desc: 'Temel element dengeleri'
    };

    // 7. ÇAPRAZ GEZEGENARASi AÇILAR
    const crossAspects = calcCrossAspects(chart1, chart2);
    results.aspects = crossAspects.aspects;
    const aspectScore = crossAspects.score;
    results.categories.aspects = {
      score: Math.max(0, Math.min(100, 50 + aspectScore)),
      label: 'Açı Uyumu',
      icon: '△',
      desc: 'Gezegenler arası açı harmonisi'
    };

    // GENEL SKOR HESAPLA (ağırlıklı ortalama)
    const weights = {
      sun: 20, moon: 20, venus: 18, mars: 12, mercury: 10, element: 10, aspects: 10
    };
    let totalWeight = 0;
    let weightedSum = 0;
    for (const [key, w] of Object.entries(weights)) {
      if (results.categories[key]) {
        weightedSum += results.categories[key].score * w;
        totalWeight += w;
      }
    }
    results.overall = Math.round(weightedSum / totalWeight);

    // GÜÇLÜ YÖNLER VE ZORLUKLAR
    results.strengths = generateStrengths(chart1, chart2, results);
    results.challenges = generateChallenges(chart1, chart2, results);

    // İLİŞKİ YORUMU
    results.interpretation = generateRelationshipInterpretation(chart1, chart2, results);

    return results;
  }

  // ============================================
  // YARDIMCI HESAPLAMA FONKSİYONLARI
  // ============================================

  function calcSignCompat(planet1, planet2) {
    if (!planet1 || !planet2) return 50;
    const i1 = planet1.signIndex;
    const i2 = planet2.signIndex;
    return SIGN_COMPAT[i1][i2];
  }

  function calcVenusCompat(c1, c2) {
    // Venüs-Venüs + Venüs-Mars çapraz
    const vv = calcSignCompat(c1.planets.venus, c2.planets.venus);
    const v1m2 = calcSignCompat(c1.planets.venus, c2.planets.mars);
    const m1v2 = calcSignCompat(c1.planets.mars, c2.planets.venus);
    const sunVenus1 = calcSignCompat(c1.planets.sun, c2.planets.venus);
    const sunVenus2 = calcSignCompat(c2.planets.sun, c1.planets.venus);
    return Math.round((vv * 3 + v1m2 * 2 + m1v2 * 2 + sunVenus1 + sunVenus2) / 9);
  }

  function calcMarsCompat(c1, c2) {
    const mm = calcSignCompat(c1.planets.mars, c2.planets.mars);
    const mv1 = calcSignCompat(c1.planets.mars, c2.planets.venus);
    const mv2 = calcSignCompat(c2.planets.mars, c1.planets.venus);
    const moonMars1 = calcSignCompat(c1.planets.moon, c2.planets.mars);
    const moonMars2 = calcSignCompat(c2.planets.moon, c1.planets.mars);
    return Math.round((mm * 2 + mv1 * 2 + mv2 * 2 + moonMars1 + moonMars2) / 9);
  }

  function calcElementCompat(c1, c2) {
    const getElement = (p) => p && p.sign ? p.sign.element : 'Ateş';
    const pairs = [
      [c1.planets.sun, c2.planets.sun, 3],
      [c1.planets.moon, c2.planets.moon, 3],
      [c1.planets.venus, c2.planets.venus, 2],
      [c1.planets.mars, c2.planets.mars, 1],
      [c1.planets.mercury, c2.planets.mercury, 1]
    ];
    let total = 0, weight = 0;
    for (const [p1, p2, w] of pairs) {
      total += getElementCompat(getElement(p1), getElement(p2)) * w;
      weight += w;
    }
    return Math.round(total / weight);
  }

  function calcCrossAspects(c1, c2) {
    const importantPlanets = ['sun', 'moon', 'mercury', 'venus', 'mars'];
    const aspects = [];
    let totalScore = 0;

    for (const p1Key of importantPlanets) {
      for (const p2Key of importantPlanets) {
        const p1 = c1.planets[p1Key];
        const p2 = c2.planets[p2Key];
        if (!p1 || !p2) continue;

        let diff = Math.abs(p1.longitude - p2.longitude);
        if (diff > 180) diff = 360 - diff;

        for (const aspect of PAIR_ASPECTS) {
          const orb = Math.abs(diff - aspect.angle);
          if (orb <= aspect.orb) {
            const exactness = 1 - (orb / aspect.orb);
            const pw1 = PLANET_WEIGHTS[p1Key]?.weight || 1;
            const pw2 = PLANET_WEIGHTS[p2Key]?.weight || 1;
            const weightedScore = aspect.score * exactness * (pw1 + pw2) / 20;

            aspects.push({
              planet1: p1Key,
              planet2: p2Key,
              planet1Name: PLANET_WEIGHTS[p1Key]?.name || p1Key,
              planet2Name: PLANET_WEIGHTS[p2Key]?.name || p2Key,
              planet1Symbol: PLANET_WEIGHTS[p1Key]?.symbol || '',
              planet2Symbol: PLANET_WEIGHTS[p2Key]?.symbol || '',
              aspect: aspect,
              orb: orb,
              exactness: exactness,
              type: aspect.type,
              sign1: p1.sign.name,
              sign2: p2.sign.name
            });

            totalScore += weightedScore;
            break;
          }
        }
      }
    }

    aspects.sort((a, b) => b.exactness - a.exactness);
    return { aspects, score: totalScore };
  }

  // ============================================
  // GÜÇLÜ YÖNLER VE ZORLUKLAR
  // ============================================

  function generateStrengths(c1, c2, results) {
    const strengths = [];
    const cats = results.categories;

    if (cats.sun.score >= 80) {
      strengths.push(`Güneş burçlarınız (${c1.planets.sun.sign.name} & ${c2.planets.sun.sign.name}) doğal bir uyum içinde, birbirinizi kolayca anlıyor, aynı dili konuşuyorsunuz.`);
    }
    if (cats.moon.score >= 80) {
      strengths.push(`Ay burçlarınız (${c1.planets.moon.sign.name} & ${c2.planets.moon.sign.name}) duygusal olarak mükemmel bir bağ kuruyor, birbirinizin ihtiyaçlarını sezgisel olarak hissedebilirsiniz.`);
    }
    if (cats.venus.score >= 75) {
      strengths.push(`Venüs uyumunuz güçlü, aşk diliniz benzer, romantizm anlayışınız örtüşüyor ve birbirinizi çekici bulmanız doğal.`);
    }
    if (cats.mars.score >= 75) {
      strengths.push(`Mars enerjiniz uyumlu, birlikte harekete geçmek, projeler üretmek ve fiziksel çekim konusunda güçlü bir sinerjiniz var.`);
    }
    if (cats.mercury.score >= 80) {
      strengths.push(`Merkür uyumunuz harika, iletişim aranızda rahat akıyor, tartışmalar bile yapıcı ve entelektüel olabiliyor.`);
    }

    // Özel açı güçleri
    const positiveAspects = results.aspects.filter(a => a.type === 'positive' && a.exactness > 0.6);
    if (positiveAspects.length >= 3) {
      strengths.push(`Haritalarınız arasında ${positiveAspects.length} güçlü pozitif açı var, bu kozmik bir mıknatıs gibi sizi bir arada tutar.`);
    }

    const sunMoonAspect = results.aspects.find(a =>
      (a.planet1 === 'sun' && a.planet2 === 'moon') ||
      (a.planet1 === 'moon' && a.planet2 === 'sun')
    );
    if (sunMoonAspect && (sunMoonAspect.type === 'positive' || sunMoonAspect.aspect.angle === 0)) {
      strengths.push(`Güneş-Ay bağlantısı mevcut, bu astrolojide "ruh eşi" göstergelerinden biri olarak kabul edilir. Birinizin kimliği diğerinin duygusal dünyasıyla rezonans halinde.`);
    }

    if (strengths.length === 0) {
      strengths.push(`Her ilişki kendine özgü güzelliklere sahiptir. Farklılıklarınız birbirinizi tamamlama potansiyeli taşır.`);
    }

    return strengths;
  }

  function generateChallenges(c1, c2, results) {
    const challenges = [];
    const cats = results.categories;

    if (cats.sun.score < 45) {
      challenges.push(`Güneş burçlarınız (${c1.planets.sun.sign.name} & ${c2.planets.sun.sign.name}) doğal olarak farklı frekanslarda, temel kişilik yapılarınız arasında sürtünme olabilir. Sabır ve anlayış gerektirir.`);
    }
    if (cats.moon.score < 45) {
      challenges.push(`Ay burçlarınız (${c1.planets.moon.sign.name} & ${c2.planets.moon.sign.name}) duygusal ihtiyaçlarınızın farklı olduğunu gösteriyor, birinin güvence ihtiyacı, diğerinin özgürlük ihtiyacıyla çatışabilir.`);
    }
    if (cats.venus.score < 45) {
      challenges.push(`Venüs uyumunuz düşük, sevgi gösterme biçimleriniz oldukça farklı. Birinin romantizm anlayışı diğerine yabancı gelebilir.`);
    }
    if (cats.mercury.score < 45) {
      challenges.push(`Merkür uyumunuz zayıf, iletişim tarzlarınız farklı olabilir. Yanlış anlaşılmaları önlemek için ekstra çaba gerekebilir.`);
    }

    const negativeAspects = results.aspects.filter(a => a.type === 'negative' && a.exactness > 0.5);
    if (negativeAspects.length >= 3) {
      challenges.push(`Haritalarınızda ${negativeAspects.length} gergin açı var, bu ilişkide büyüme potansiyeli yüksek ama çatışmalar da kaçınılmaz olabilir.`);
    }

    const saturnAspects = results.aspects.filter(a =>
      a.planet1 === 'saturn' || a.planet2 === 'saturn'
    );
    if (saturnAspects.some(a => a.type === 'negative')) {
      challenges.push(`Satürn etkileri ciddi ve kısıtlayıcı hissedilebilir, biriniz diğerine "ebeveyn" gibi davranabilir. Eşit bir denge kurmak önemli.`);
    }

    if (challenges.length === 0) {
      challenges.push(`Hiçbir ilişki zorluksuz olmaz. Küçük sürtünmeler büyüme fırsatı olarak görüldüğünde ilişki daha da güçlenir.`);
    }

    return challenges;
  }

  // ============================================
  // İLİŞKİ YORUMU, KAPSAMLI
  // ============================================

  function generateRelationshipInterpretation(c1, c2, results) {
    const sun1 = c1.planets.sun.sign.name;
    const sun2 = c2.planets.sun.sign.name;
    const moon1 = c1.planets.moon.sign.name;
    const moon2 = c2.planets.moon.sign.name;
    const venus1 = c1.planets.venus.sign.name;
    const venus2 = c2.planets.venus.sign.name;
    const mars1 = c1.planets.mars.sign.name;
    const mars2 = c2.planets.mars.sign.name;
    const overall = results.overall;

    const sections = [];

    // GENEL BAKIŞ
    let overallTone;
    if (overall >= 85) overallTone = 'Bu, astrolojik açıdan son derece güçlü bir bağlantı. Birbirinizi tamamlayan enerjiler, doğal bir çekim ve derin bir anlayış mevcut. Bu tür bir uyum nadir görülür.';
    else if (overall >= 70) overallTone = 'Güçlü bir uyumunuz var. Doğal bir çekim ve anlayış mevcut, bazı zorlu noktalar olsa da bunlar ilişkiyi zenginleştirme potansiyeli taşıyor.';
    else if (overall >= 55) overallTone = 'Dengelenmiş bir uyumunuz var. Hem uyumlu hem de zorlayıcı yönler mevcut. Bu, birbirinizden öğrenme ve büyüme potansiyeli yüksek bir ilişki.';
    else if (overall >= 40) overallTone = 'Farklılıklarınız belirgin ama bu ille de olumsuz değil. Farklı enerjiler birbirini dengeleyebilir, ancak karşılıklı anlayış ve sabır şart.';
    else overallTone = 'Kozmik enerjileriniz oldukça farklı frekanslarda. Bu ilişki hem büyük büyüme potansiyeli hem de ciddi zorluklar içerebilir. Bilinçli çaba ve iletişim kritik önem taşır.';

    sections.push({
      title: 'Genel Bakış',
      icon: '✦',
      color: '#d4a854',
      text: overallTone
    });

    // AŞK VE ROMANTİZM
    const loveScore = Math.round((results.categories.venus.score * 2 + results.categories.mars.score) / 3);
    let loveText = `${venus1} Venüsü ile ${venus2} Venüsü birleştiğinde `;
    if (loveScore >= 75) {
      loveText += `güçlü bir romantik çekim ortaya çıkar. Sevgi diliniz benzer, birbirinize nasıl değer verilmesi gerektiğini içgüdüsel olarak biliyorsunuz. ${mars1} ve ${mars2} Mars enerjileri de tutku ateşini canlı tutacak bir dinamik yaratıyor. Fiziksel ve duygusal çekim birbirini besler.`;
    } else if (loveScore >= 55) {
      loveText += `romantik bağınız sağlam temellere sahip olsa da bazı alanlarda uyum sağlamanız gerekebilir. Biriniz daha tutkulu yaklaşırken diğeri daha sakin olabilir, bu denge zamanla oturur. Romantizm anlayışınızı birbirinize anlatmak ilişkiyi güçlendirir.`;
    } else {
      loveText += `sevgi gösterme biçimleriniz farklılık gösterir. Bu bir engel değil, bir öğrenme fırsatı. Birbirinizin aşk dilini öğrenmek, hediye mi, zaman mı, söz mü, ilişkinin anahtarı olacak.`;
    }
    sections.push({ title: 'Aşk & Romantizm', icon: '♀', color: '#FF69B4', text: loveText });

    // DUYGUSAL BAĞLANTI
    const emotionalScore = results.categories.moon.score;
    let emotionalText = `${moon1} Ayı ile ${moon2} Ayı `;
    if (emotionalScore >= 75) {
      emotionalText += `duygusal bir senfoni oluşturur. Birbirinizin ruh hallerini neredeyse telepatik bir şekilde hissedebilirsiniz. Evde geçirilen akşamlar, paylaşılan sessizlikler bile bağınızı güçlendirir. Duygusal güvenlik ihtiyaçlarınız birbirine yakın olduğu için "yuva" kavramını benzer şekilde tanımlarsınız.`;
    } else if (emotionalScore >= 55) {
      emotionalText += `duygusal dünyalarınızda ortak noktalar barındırır ama farklılıklar da mevcut. Birinizin duygularını ifade etme biçimi diğerine zaman zaman yabancı gelebilir. Duygusal ihtiyaçlarınızı açıkça konuşmak ilişkinin temelini sağlamlaştırır.`;
    } else {
      emotionalText += `oldukça farklı duygusal ihtiyaçlar taşır. Biriniz daha bağımsız ve mesafeli olabilirken, diğeri yakınlık ve güvence arayabilir. Bu karşıtlık ilişkide gerilim yaratabilir ama aynı zamanda birbirinizin eksik yanlarını tamamlar, eğer empati ile yaklaşırsanız.`;
    }
    sections.push({ title: 'Duygusal Bağlantı', icon: '☽', color: '#C0C0C0', text: emotionalText });

    // İLETİŞİM
    const commScore = results.categories.mercury.score;
    let commText;
    if (commScore >= 75) {
      commText = `İletişiminiz akıcı ve doğal. Konuşmalar saatlerce sürebilir, birbirinizi yarım cümleyle bile anlarsınız. Tartışmalar bile entelektüel bir zenginlik taşır. Mizah anlayışınız da benzer olabilir ki bu büyük bir bağ kurma aracıdır.`;
    } else if (commScore >= 55) {
      commText = `İletişiminiz genel olarak iyi işler ama bazı konularda farklı bakış açıları çatışabilir. Biriniz daha analitik, diğeri daha duygusal iletişim kurabilir. "Senin demek istediğin..." gibi kontrol soruları yanlış anlaşılmaları önler.`;
    } else {
      commText = `İletişim tarzlarınız belirgin şekilde farklı. Biri sözcüklerle ifade ederken diğeri eylemlerle gösterebilir. Sabrın ve aktif dinlemenin ilişkinizdeki en değerli araçlar olacağını bilin. Zaman zaman "çevirmen" rolü üstlenmeniz gerekebilir.`;
    }
    sections.push({ title: 'İletişim & Zihinsel Uyum', icon: '☿', color: '#A0D2DB', text: commText });

    // UZUN VADELI POTANSİYEL
    const longTerm = Math.round((results.categories.sun.score + results.categories.moon.score + results.categories.element.score) / 3);
    let longText;
    if (longTerm >= 70) {
      longText = `Uzun vadeli potansiyeliniz yüksek. ${sun1} ve ${sun2} güneş enerjilerinin temel uyumu, birlikte yaşlanabilecek ve birlikte büyüyebilecek bir çift olduğunuzu gösteriyor. Element dengeniz de ilişkinin istikrarlı kalmasına katkı sağlar. Ortak hedefler ve değerler belirlemek bu potansiyeli gerçeğe dönüştürür.`;
    } else if (longTerm >= 50) {
      longText = `Uzun vadede ilişkiniz bilinçli çaba gerektirir ama kesinlikle mümkün. Farklılıklarınız zamanla ya öğretici olur ya da ayrıştırıcı, hangisi olacağını belirleyen, birbirinize gösterdiğiniz anlayıştır. Orta yol bulma becerisi bu ilişkinin anahtarı olacaktır.`;
    } else {
      longText = `Uzun vadeli sürdürülebilirlik, her iki tarafın da güçlü bir kararlılık ve esneklik göstermesine bağlı. Farklı temel enerjilere sahip olmanız, ilişkide sürekli bir "tercüme" çabası gerektirebilir. Ama astroloji kader değildir, en zorlu uyumlar bile bilinçli çaba ile başarılı ilişkilere dönüşebilir.`;
    }
    sections.push({ title: 'Uzun Vadeli Potansiyel', icon: '♄', color: '#DAA520', text: longText });

    // PARA VE MADDİ KONULAR
    const earthSigns = ['Boğa', 'Başak', 'Oğlak'];
    const hasEarth1 = earthSigns.includes(sun1) || earthSigns.includes(moon1);
    const hasEarth2 = earthSigns.includes(sun2) || earthSigns.includes(moon2);
    let moneyText;
    if (hasEarth1 && hasEarth2) {
      moneyText = `İkinizde de toprak elementi güçlü, maddi konularda benzer bir yaklaşımınız var. Birikim, yatırım ve finansal güvenlik konusunda muhtemelen aynı sayfadasınız. Birlikte güçlü bir ekonomik temel kurabilirsiniz.`;
    } else if (hasEarth1 || hasEarth2) {
      moneyText = `İkinizden biri maddi konularda daha pratik ve tutumlu yaklaşırken diğeri daha rahat harcayabilir. Bu farklılık iyi yönetilirse dengeleyici olur, biri çok tutumlu olmaktan, diğeri çok savurgan olmaktan kurtulur.`;
    } else {
      moneyText = `İkiniz de maddi konularda katı bir yaklaşıma sahip değilsiniz. Bu özgürleştirici olabilir ama ortak bir bütçe planı yapmak uzun vadede ilişkinize güvence sağlar. Finansal hedefleri birlikte belirlemek önemli.`;
    }
    sections.push({ title: 'Maddi Konular & Para', icon: '⟐', color: '#7CB342', text: moneyText });

    return sections;
  }

  // ============================================
  // PUBLIC API
  // ============================================
  return {
    calculateCompatibility
  };

})();
