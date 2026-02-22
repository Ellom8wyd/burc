/**
 * Açı Yorumları ve Retro Anlamları
 */
const AspectInterpretations = (() => {

  // Gezegen çifti → açı tipi → yorum
  // Anahtar: "planet1-planet2" sıralı, açı: conjunction/trine/square/opposition/sextile
  const ASPECTS = {
    'sun-moon': {
      conjunction: 'Güneş-Ay kavuşumu: Kimliğiniz ve duygusal dünyanız iç içe geçmiş. Güçlü bir iç bütünlük ve kararlılık, ama bazen kendinize mesafe almakta zorlanırsınız.',
      trine: 'Güneş-Ay üçgeni: İç dünyanız ve dış kimliğiniz uyum içinde. Duygusal zekanız yüksek, ilişkilerde doğal bir denge kurarsınız.',
      square: 'Güneş-Ay karesi: Kimliğiniz ve duygularınız arasında gerilim. İstekleriniz ve ihtiyaçlarınız çatışabilir, ama bu iç çatışma büyüme motivasyonunuz olur.',
      opposition: 'Güneş-Ay karşıtlığı: Bilinç ve bilinçaltı arasında bir denge arayışı. İlişkilerde ayna etkisi — partneriniz aracılığıyla kendinizi keşfedersiniz.',
      sextile: 'Güneş-Ay altmışlığı: Kimliğinizle duygularınız arasında üretken bir uyum. Fırsatları sezgisel olarak değerlendirirsiniz.'
    },
    'sun-mercury': {
      conjunction: 'Güneş-Merkür kavuşumu: Zekanız kimliğinizle bütünleşmiş. Kendinizi ifade etme konusunda doğal bir yeteneğiniz var. Zihniniz sürekli aktif.',
    },
    'sun-venus': {
      conjunction: 'Güneş-Venüs kavuşumu: Çekicilik, zarafet ve sanatsal yetenek doğuştan. İnsanlar sizi sevimli bulur. Güzellik ve uyum arayışı kimliğinizin parçası.',
      trine: 'Güneş-Venüs üçgeni: Aşk ve yaratıcılıkta doğal yetenek. Sosyal ilişkilerde şanslı, sanatsal ifadede yetenekli.',
      square: 'Güneş-Venüs karesi: Değer gördüğünüzü hissetme ile kendinizi ifade etme arasında gerilim. Aşırı lükse eğilim veya özgüven eksikliği.',
      opposition: 'Güneş-Venüs karşıtlığı: Kimliğiniz ve değerleriniz arasında denge arayışı. İlişkilerde kendinizi kaybetme veya aşırı bağımsızlık arası gidip gelirsiniz.'
    },
    'sun-mars': {
      conjunction: 'Güneş-Mars kavuşumu: Güçlü irade, cesaret ve fiziksel enerji. Rekabetçi, doğrudan ve kararlı bir yapı. Bazen agresif olabilirsiniz.',
      trine: 'Güneş-Mars üçgeni: Enerji ve irade uyumlu şekilde birleşir. Hedeflerinize doğal bir akışla ulaşırsınız. Fiziksel dayanıklılık yüksek.',
      square: 'Güneş-Mars karesi: İç çatışma ve öfke yönetimi konuları. Güçlü bir itici güç ama sabırsızlık ve çatışma eğilimi. Doğru kanalize edilirse büyük başarı.',
      opposition: 'Güneş-Mars karşıtlığı: Başkalarıyla güç mücadeleleri. Cesaret ve enerji yüksek ama yönlendirme gerekiyor. Rekabet ilişkilere yansıyabilir.'
    },
    'sun-jupiter': {
      conjunction: 'Güneş-Jüpiter kavuşumu: İyimser, cömert ve şanslı bir yapı. Hayata geniş perspektifle bakar, büyük düşünürsünüz.',
      trine: 'Güneş-Jüpiter üçgeni: Hayatta doğal bir şans ve bolluk. Fırsatlar kendiğinden gelir. Felsefi derinlik ve cömertlik.',
      square: 'Güneş-Jüpiter karesi: Aşırıya kaçma eğilimi — çok fazla harcama, çok fazla söz verme. İyimserlik bazen gerçekçilikten kopabilir.',
      opposition: 'Güneş-Jüpiter karşıtlığı: Büyüklenmeci eğilimler ile mütevazılık arasında denge. Başkalarının size büyük beklentileri olabilir.'
    },
    'sun-saturn': {
      conjunction: 'Güneş-Satürn kavuşumu: Disiplinli, ciddi ve sorumluluk sahibi. Erken yaşta olgunluk. Başarı emek ve sabırla gelir, ama kalıcıdır.',
      trine: 'Güneş-Satürn üçgeni: Disiplin ve yaratıcılık uyum içinde. Uzun vadeli hedeflere ulaşma yeteneği. Güvenilir ve kararlı bir yapı.',
      square: 'Güneş-Satürn karesi: Özgüven üzerinde baskı. Otoriteyle çatışma, engellenme hissi. Ama bu zorluklar aracılığıyla büyük karakter gücü inşa edersiniz.',
      opposition: 'Güneş-Satürn karşıtlığı: Başkalarının beklentileri ve kendi ihtiyaçlarınız arasında gerilim. Otorite figürleriyle güç dinamikleri.'
    },
    'moon-venus': {
      conjunction: 'Ay-Venüs kavuşumu: Duygusal zarafet ve sevgi dolu bir iç dünya. İlişkilerde doğal bir uyum ve çekicilik. Sanat ve güzellik ruhunuzu besler.',
      trine: 'Ay-Venüs üçgeni: Duygusal ve romantik hayatınız uyumlu. İnsanlar yanınızda rahat eder. Estetik duyarlılığınız yüksek.',
      square: 'Ay-Venüs karesi: Duygusal ihtiyaçlarınız ve sevgi gösterme biçiminiz arasında gerilim. Aşırı şımartma veya duygusal mesafe.',
      opposition: 'Ay-Venüs karşıtlığı: İç dünyanız ve ilişkileriniz arasında denge arayışı. Sevgiyi verme ve alma arasında salınım.'
    },
    'moon-mars': {
      conjunction: 'Ay-Mars kavuşumu: Duygusal yoğunluk ve tutku. Hisleriniz güçlü ve anlık. Korumacı ve savunmacı bir iç yapı.',
      trine: 'Ay-Mars üçgeni: Duygusal cesaret ve harekete geçme yeteneği. Sezgileriniz ve enerjiniz birbirini destekler.',
      square: 'Ay-Mars karesi: Duygusal patlamalar ve iç huzursuzluk. Öfke yönetimi önemli. Ama bu enerji doğru kanalize edilirse büyük şeyler başarırsınız.',
      opposition: 'Ay-Mars karşıtlığı: Duygusal ihtiyaçlarınız ve eylem isteğiniz çatışabilir. İlişkilerde tutku ama bazen gerginlik.'
    },
    'venus-mars': {
      conjunction: 'Venüs-Mars kavuşumu: Güçlü romantik ve cinsel çekim. Tutku ve zarafet birleşir. Sanatsal yaratıcılıkta ateş. Çekiciliğiniz manyetik.',
      trine: 'Venüs-Mars üçgeni: Aşk ve tutku doğal bir uyum içinde. İlişkilerde hem romantik hem fiziksel doyum. Sanatsal ifade güçlü.',
      square: 'Venüs-Mars karesi: Arzu ve sevgi arasında gerilim. Tutkulu ama çalkantılı ilişkiler. Yaratıcı enerji yüksek ama yönlendirilmesi gerekir.',
      opposition: 'Venüs-Mars karşıtlığı: Güçlü romantik çekim ama ilişkilerde güç mücadeleleri. "Karşıt kutuplar birbirini çeker" dinamiği.'
    },
    'mercury-venus': {
      conjunction: 'Merkür-Venüs kavuşumu: Zarif iletişim, diplomatik konuşma. Yazarlık ve şiir yeteneği. Sosyal becerilerde doğal ustalık.',
      trine: 'Merkür-Venüs üçgeni: Güzel konuşma, sanatsal yazma yeteneği. İletişimde çekicilik. Müzik ve dil konusunda doğal yetenek.'
    },
    'jupiter-saturn': {
      conjunction: 'Jüpiter-Satürn kavuşumu: Büyüme ve kısıtlama arasında dengeli bir yapı. Gerçekçi iyimserlik. Büyük projeleri disiplinle hayata geçirme yeteneği.',
      opposition: 'Jüpiter-Satürn karşıtlığı: Genişleme ve kısıtlama arasında döngüsel bir çatışma. Ekonomik dalgalanmalar ve kariyer değişimleri.',
      square: 'Jüpiter-Satürn karesi: Büyüme arzusu sürekli engellerle karşılaşır. Ama bu engeller sizi daha güçlü ve bilge kılar.'
    }
  };

  // ============================================
  // RETRO ANLAMI
  // ============================================
  const RETROGRADE = {
    mercury: {
      name: 'Merkür Retrosu ☿℞',
      text: 'Merkür doğumunuzda retro: iç dünyanızda derin bir düşünce ve analiz kapasitesi. İletişimde dikkatsiz hatalar yapabilirsiniz ama yazılı ifade ve araştırma konusunda güçlüsünüz. Geçmişe dönük düşünme ve yeniden değerlendirme doğanıza işlemiş.'
    },
    venus: {
      name: 'Venüs Retrosu ♀℞',
      text: 'Venüs doğumunuzda retro: aşk ve ilişki konularında içe dönük bir yaklaşımınız var. Sevgiyi alışılmadık şekillerde ifade edebilirsiniz. Geçmiş ilişkiler ve eski aşklar hayatınızda tekrar eden temalar olabilir. Kendi değerinizi keşfetmek yaşam dersiniz.'
    },
    mars: {
      name: 'Mars Retrosu ♂℞',
      text: 'Mars doğumunuzda retro: enerjiniz içe dönük ve stratejik. Doğrudan saldırmak yerine bekler ve hesaplarsınız. Öfkenizi bastırma eğilimi olabilir — sağlıklı yollarla ifade etmeyi öğrenmek önemli. İç motivasyonunuz dış dünyadan daha güçlü.'
    },
    jupiter: {
      name: 'Jüpiter Retrosu ♃℞',
      text: 'Jüpiter doğumunuzda retro: şans ve büyüme dışarıdan değil, içten gelir. Manevi zenginlik maddi zenginlikten daha önemli olabilir. Kendi felsefenizi geliştirme ve iç bilgeliği keşfetme süreciniz var.'
    },
    saturn: {
      name: 'Satürn Retrosu ♄℞',
      text: 'Satürn doğumunuzda retro: dış dünya kurallarından çok kendi iç disiplininiz geçerli. Otoriteyle ilişkiniz karmaşık olabilir. Kendi kurallarınızı ve sınırlarınızı belirlemeyi öğrenirsiniz.'
    },
    uranus: {
      name: 'Uranüs Retrosu ♅℞',
      text: 'Uranüs doğumunuzda retro: yenilikçi fikirleriniz iç dünyanızda gelişir. Dışarıdan sıradan görünseniz de iç dünyanız devrimci. Değişim ihtiyacı dışarıdan değil içerden gelir.'
    },
    neptune: {
      name: 'Neptün Retrosu ♆℞',
      text: 'Neptün doğumunuzda retro: spiritüel duyarlılığınız derinlere işler. Hayaller ve sezgiler iç dünyanızda daha yoğun yaşanır. İllüzyonları çözme ve gerçeği bulma konusunda güçlü bir iç pusulanız var.'
    },
    pluto: {
      name: 'Plüton Retrosu ♇℞',
      text: 'Plüton doğumunuzda retro: dönüşüm süreçleri iç dünyada yaşanır. Dış değişimlerden çok iç değişimler sizi tanımlar. Geçmişin derinliklerini kazma ve köklere inme eğilimi.'
    }
  };

  function getAspectInterpretation(planet1Key, planet2Key, aspectName) {
    // Aspect adını normalleştir
    const nameMap = { 'Kavuşum':'conjunction','Üçgen':'trine','Kare':'square','Karşıt':'opposition','Altmışlık':'sextile' };
    const normAspect = nameMap[aspectName] || aspectName.toLowerCase();

    // İki yönlü arama
    const key1 = `${planet1Key}-${planet2Key}`;
    const key2 = `${planet2Key}-${planet1Key}`;
    const data = ASPECTS[key1] || ASPECTS[key2];
    if (!data) return null;
    return data[normAspect] || null;
  }

  function getRetrogradeMeaning(planetKey) {
    return RETROGRADE[planetKey] || null;
  }

  function getAllAspectInterpretations(aspects) {
    const results = [];
    for (const aspect of aspects) {
      const interp = getAspectInterpretation(aspect.planet1, aspect.planet2, aspect.aspect.name);
      if (interp) {
        results.push({
          planet1: aspect.planet1Name || aspect.planet1,
          planet2: aspect.planet2Name || aspect.planet2,
          planet1Symbol: aspect.planet1Symbol,
          planet2Symbol: aspect.planet2Symbol,
          aspectName: aspect.aspect.name,
          aspectSymbol: aspect.aspect.symbol,
          text: interp,
          type: aspect.aspect.type
        });
      }
    }
    return results;
  }

  return { getAspectInterpretation, getRetrogradeMeaning, getAllAspectInterpretations, RETROGRADE };
})();
