/**
 * Ev Yorumları - Her gezegenin her evdeki anlamı
 */
const HouseInterpretations = (() => {

  // Gezegen → Ev → Yorum (Sadece ana 7 gezegen + Kuzey Düğüm)
  const DATA = {
    sun: {
      name: 'Güneş', symbol: '☉',
      houses: {
        1: 'Güneşiniz 1. evde: Kimliğiniz güçlü, kendinize güveniniz yüksek. Lider ruhlusunuz ve varlığınız hissedilir. Fiziksel görünümünüz önemli bir ifade aracınız.',
        2: 'Güneşiniz 2. evde: Maddi güvenlik kimliğinizin bir parçası. Para kazanma ve değerli şeyler biriktirme konusunda doğal bir yeteneğiniz var.',
        3: 'Güneşiniz 3. evde: İletişim ve öğrenme hayatınızın merkezinde. Yazarlık, öğretmenlik veya medya alanlarında parlayabilirsiniz. Kardeşlerle bağınız önemli.',
        4: 'Güneşiniz 4. evde: Aile ve yuva kimliğinizin temelini oluşturur. Köklere, geleneğe ve ev ortamına derin bir bağınız var. Yaşlandıkça daha çok parlarsınız.',
        5: 'Güneşiniz 5. evde: Yaratıcılık, eğlence ve aşk hayatınız zengin. Sanatsal ifade, çocuklarla bağ ve romantizm sizi besler. Sahne sizin doğal yeriniz.',
        6: 'Güneşiniz 6. evde: Çalışkanlık ve hizmet etme kimliğinizin parçası. Günlük rutinleriniz, sağlığınız ve iş disiplininiz sizi tanımlar.',
        7: 'Güneşiniz 7. evde: İlişkiler ve ortaklıklar hayatınızın odak noktası. Kendinizi bir partner aracılığıyla keşfedersiniz. Evlilik ve iş ortaklıkları kritik öneme sahip.',
        8: 'Güneşiniz 8. evde: Dönüşüm, gizem ve derinlik sizi çeker. Kriz anlarında en güçlünüz. Miras, ortak finans ve psikolojik derinlik hayatınızda belirleyici.',
        9: 'Güneşiniz 9. evde: Felsefe, seyahat ve yüksek eğitim kimliğinizin parçası. Farklı kültürlerle bağ kurar, hayatın anlamını ararsınız.',
        10: 'Güneşiniz 10. evde: Kariyer ve toplumsal statü son derece önemli. Kamusal alanda tanınma, otorite ve başarı hedefleriniz büyük. Yönetici ruhlulusunuz.',
        11: 'Güneşiniz 11. evde: Topluluk, arkadaşlıklar ve idealler sizi tanımlar. Grup içinde parlarsınız. Sosyal sorumluluk ve geleceğe yönelik vizyonunuz güçlü.',
        12: 'Güneşiniz 12. evde: İç dünya, spiritüellik ve bilinçaltı derinliğiniz büyük. Yalnızlıkta kendinizi bulursunuz. Sanat, meditasyon ve hayırseverlik ruhunuzu besler.'
      }
    },
    moon: {
      name: 'Ay', symbol: '☽',
      houses: {
        1: 'Ayınız 1. evde: Duygularınız yüzünüze yansır; ruh haliniz herkes tarafından fark edilir. Sezgisel, duyarlı ve değişken bir kişiliğiniz var.',
        2: 'Ayınız 2. evde: Maddi güvenlik duygusal huzurunuzun temelidir. Parayla duygusal bir ilişkiniz var — harcamalarınız ruh halinize göre değişebilir.',
        3: 'Ayınız 3. evde: Duygularınızı konuşarak veya yazarak ifade edersiniz. Kardeşlerle, komşularla duygusal bağlarınız güçlü. Merak ve öğrenme sizi rahatlatır.',
        4: 'Ayınız 4. evde (Ay kendi evinde): Aile ve yuva kavramı duygusal dünyanızın çekirdeği. Eviniz sığınağınız, anılar ve gelenekler ruhunuzu besler.',
        5: 'Ayınız 5. evde: Yaratıcı ifade ve eğlence duygusal dengenizi sağlar. Çocuklarla doğal bir bağınız, romantizmde duygusal derinliğiniz var.',
        6: 'Ayınız 6. evde: Günlük rutinler ve iş ortamı duygusal dengenizi etkiler. Başkalarına yardım etmek sizi iyileştirir. Sağlık konularında hassassınız.',
        7: 'Ayınız 7. evde: İlişkilerde duygusal güvenlik ararsınız. Partneriniz duygusal dünyanızı derinden etkiler. Yalnızlıktan hoşlanmazsınız.',
        8: 'Ayınız 8. evde: Duygusal yoğunluk ve dönüşüm süreçleri hayatınızın parçası. Derin bağlar kurar, yüzeysel ilişkilerden kaçınırsınız.',
        9: 'Ayınız 9. evde: Seyahat, felsefe ve spiritüel arayışlar duygusal dünyanızı besler. Farklı kültürlerle bağ kurmak sizi huzurlu kılar.',
        10: 'Ayınız 10. evde: Kariyer ve kamusal imajınız duygusal dünyanızla iç içe. Toplum tarafından tanınmak duygusal ihtiyacınız. Annenizin etkisi güçlü.',
        11: 'Ayınız 11. evde: Arkadaşlıklar ve topluluklar duygusal güvenliğiniz için kritik. Grup dinamiklerinden etkilenirsiniz. İdealleriniz kalbinizden gelir.',
        12: 'Ayınız 12. evde: Zengin bir iç dünya ve güçlü sezgiler. Duygularınızı gizleme eğilimindesiniz. Yalnızlık, meditasyon ve hayal kurma sizi iyileştirir.'
      }
    },
    venus: {
      name: 'Venüs', symbol: '♀',
      houses: {
        1: 'Venüs 1. evde: Çekici, zarif ve sevimli bir görünüm. İnsanlar sizden kolayca hoşlanır. Güzellik ve uyum hayatınızın her alanına yansır.',
        2: 'Venüs 2. evde: Lüks zevkleriniz ve güzel şeylere tutkunuz var. Para kazanma konusunda şanslı ve yeteneklisiniz. Kaliteli yaşam standartlarınız yüksek.',
        3: 'Venüs 3. evde: İletişiminiz tatlı ve diplomatik. Yazma, şiir ve sanatsal ifade yetenekleriniz güçlü. Kardeşler ve komşularla ilişkileriniz uyumlu.',
        4: 'Venüs 4. evde: Evinizi güzelleştirmek ve huzurlu bir aile ortamı yaratmak sizin için önemli. Aile ilişkilerinde uyum ve sevgi ararsınız.',
        5: 'Venüs 5. evde: Aşk hayatınız zengin ve romantik. Yaratıcı sanatlar, eğlence ve flört doğal yetenekleriniz. Çocuklarla aranız çok iyi.',
        6: 'Venüs 6. evde: İş ortamında uyum ve güzellik ararsınız. İş arkadaşlarıyla ilişkileriniz genellikle iyi. Sağlık ve beslenme konusunda estetik bakışınız var.',
        7: 'Venüs 7. evde (Venüs kendi evinde): Evlilik ve ortaklıklar hayatınızda şans getirir. Çekici partnerler çekersiniz. İlişkileriniz genellikle uyumlu.',
        8: 'Venüs 8. evde: Aşkta yoğun ve dönüştürücü deneyimler. Tutkulu ilişkiler, ortak finans konusunda şans. Gizli ilişkilere yatkınlık olabilir.',
        9: 'Venüs 9. evde: Yabancı kültürler, seyahat ve felsefe aşkınızın kaynağı. Farklı ülkelerden partnerler çekebilirsiniz. Eğitim hayatınız keyifli.',
        10: 'Venüs 10. evde: Kariyerinizde çekiciliğiniz ve diplomatik yetenekleriniz sizi yükseltir. Sanat, moda veya güzellik sektöründe başarı potansiyeliniz yüksek.',
        11: 'Venüs 11. evde: Arkadaşlıklar hayatınızda büyük bir yer tutar. Sosyal çevreniz geniş ve zengin. Grup aktiviteleri ve topluluk çalışmaları sizi mutlu eder.',
        12: 'Venüs 12. evde: Gizli aşklar, karşılıksız sevgiler veya idealize edilmiş ilişkiler. Sanat ve müzik ruhi bir boyut taşır. Yalnızlıkta sevgiyi bulursunuz.'
      }
    },
    mars: {
      name: 'Mars', symbol: '♂',
      houses: {
        1: 'Mars 1. evde: Enerjik, cesur ve rekabetçi. Fiziksel olarak güçlü ve aktif bir yapınız var. Hızlı karar alır, hemen harekete geçersiniz.',
        2: 'Mars 2. evde: Para kazanma konusunda agresif ve kararlı. Finansal hedefleriniz için savaşırsınız. Impulsif harcama eğilimi olabilir.',
        3: 'Mars 3. evde: Keskin zekalı ve tartışmacı. İletişiminiz doğrudan ve bazen sert olabilir. Kısa yolculuklar ve hızlı kararlar.',
        4: 'Mars 4. evde: Ev ortamında enerji ve bazen gerginlik. Aile içi liderlik, ev tamiratı ve emlak yatırımları. Güçlü bir "benim alanım" duygusu.',
        5: 'Mars 5. evde: Tutkulu aşk hayatı, rekabetçi sporlar ve yaratıcı ateş. Çocuklarla dinamik ilişkiler. Macera ve risk alma isteği yüksek.',
        6: 'Mars 6. evde: Çalışkan, disiplinli ve verimli. İş ortamında lider pozisyon alır, tembelliğe tahammülsüzsünüz. Fiziksel egzersiz sağlığınız için şart.',
        7: 'Mars 7. evde: İlişkilerde tutku ve bazen çatışma. Güçlü, enerjik partnerler çekersiniz. İş ortaklıklarında liderlik mücadelesi.',
        8: 'Mars 8. evde: Dönüşüm gücü yüksek, cinsel enerji yoğun. Kriz anlarında en iyi performansınız. Araştırma ve gizli bilgilere ulaşma tutkusu.',
        9: 'Mars 9. evde: Maceracı, felsefece tutkulu. Uzun yolculuklara, spora ve idealler uğruna mücadeleye yatkın. İnançlarınız için savaşırsınız.',
        10: 'Mars 10. evde: Kariyer hırsı güçlü. Yönetici ve lider pozisyonlara doğal yükseliş. Rekabetçi iş ortamlarında parlarsınız.',
        11: 'Mars 11. evde: Arkadaş gruplarında lider. Toplumsal hedefler için aktif mücadele. Grup dinamiklerinde bazen çatışma.',
        12: 'Mars 12. evde: Enerjiniz gizli kanallardan akar. Bilinçaltı öfke veya bastırılmış istekler. Perde arkasında çalışma, spiritüel pratikler.'
      }
    },
    mercury: {
      name: 'Merkür', symbol: '☿',
      houses: {
        1: 'Merkür 1. evde: Zeki, konuşkan ve meraklı bir kişilik. İletişim yetenekleriniz güçlü. Hızlı düşünür ve çevrenizi sürekli analiz edersiniz.',
        2: 'Merkür 2. evde: Finansal zeka ve ticari yetenek. Para kazanma konusunda birden fazla fikriniz var. Yazarlık veya iletişim yoluyla gelir.',
        3: 'Merkür 3. evde (kendi evinde): İletişim, yazma ve öğrenme konusunda doğuştan yetenekli. Kardeşlerle güçlü zihinsel bağ. Çok yönlü ilgi alanları.',
        4: 'Merkür 4. evde: Ev ortamında entelektüel aktiviteler. Aile içi iletişim önemli. Evden çalışma veya ev tabanlı ticaret.',
        5: 'Merkür 5. evde: Yaratıcı yazarlık, zeki flört ve entelektüel hobiler. Çocuklarla iletişiminiz güçlü. Oyunlar ve bulmacalar ilginizi çeker.',
        6: 'Merkür 6. evde (kendi evinde): İş ortamında analitik ve detaycı. Sağlık konularında bilgi toplama eğilimi. Veri analizi ve organizasyon yetenekli.',
        7: 'Merkür 7. evde: İletişim odaklı ilişkiler. Entelektüel partnerler çekersiniz. Müzakere ve arabuluculuk yetenekleriniz güçlü.',
        8: 'Merkür 8. evde: Derin araştırma ve analiz yeteneği. Psikoloji, dedektiflik ve gizli bilgilere merak. Finansal planlama konusunda stratejik.',
        9: 'Merkür 9. evde: Felsefe, yabancı diller ve yüksek eğitim konusunda yetenekli. Farklı kültürlerin bilgisini toplarsınız. Yayıncılık potansiyeli.',
        10: 'Merkür 10. evde: Kariyeriniz iletişim, yazarlık veya eğitim merkezli. Kamusal konuşma yeteneği. Birden fazla kariyer yolu mümkün.',
        11: 'Merkür 11. evde: Arkadaş çevresi entelektüel. Grup iletişiminde lider. Teknoloji ve yenilikçi fikirlerle bağlantılı.',
        12: 'Merkür 12. evde: Zengin bir iç diyalog ve sezgisel düşünce. Gizli bilgilere erişim. Yazarlık, psikoloji veya spiritüel arayışlarda zihinsel derinlik.'
      }
    },
    jupiter: {
      name: 'Jüpiter', symbol: '♃',
      houses: {
        1: 'Jüpiter 1. evde: İyimser, cömert ve şanslı bir kişilik. Fiziksel olarak iri yapılı olabilirsiniz. Hayata geniş bir perspektifle bakarsınız.',
        2: 'Jüpiter 2. evde: Finansal şans ve bolluk. Para kazanma konusunda doğal yetenek. Cömert ama bazen aşırı harcama eğilimi.',
        3: 'Jüpiter 3. evde: Eğitim ve iletişimde genişleme. Birden fazla dil bilme potansiyeli. Yayıncılık ve medya alanlarında şans.',
        4: 'Jüpiter 4. evde: Geniş ve huzurlu bir ev ortamı. Aile desteği güçlü. Emlak yatırımlarında şans. Yaşlılıkta konforlu yaşam.',
        5: 'Jüpiter 5. evde: Yaratıcılık, eğlence ve aşk hayatında şans. Çocuklarla bereketli ilişkiler. Sanat ve sporda genişleme.',
        6: 'Jüpiter 6. evde: İş ortamında büyüme fırsatları. Sağlık genel olarak iyi. Başkalarına hizmet etme konusunda cömert.',
        7: 'Jüpiter 7. evde: Evlilik ve ortaklıklarda şans. Cömert ve destekleyici partnerler çekersiniz. Hukuki konularda olumlu sonuçlar.',
        8: 'Jüpiter 8. evde: Miras, ortak finans ve dönüşüm konularında şans. Derin spiritüel deneyimler. Kriz anlarında beklenmedik yardımlar.',
        9: 'Jüpiter 9. evde (kendi evinde): Felsefe, eğitim ve seyahatte büyük şans. Akademik başarı, yurtdışı bağlantılar. Bilgelik arayışı.',
        10: 'Jüpiter 10. evde: Kariyer ve kamusal alanda şans. Toplumda saygı gören bir pozisyon. Liderlik ve otorite doğal olarak gelir.',
        11: 'Jüpiter 11. evde: Geniş ve destekleyici sosyal çevre. Grup çalışmalarında şans. Hayırseverlik ve toplumsal projeler.',
        12: 'Jüpiter 12. evde: Gizli koruyucu melekler. Spiritüel büyüme ve iç huzur. Hayırseverlik ve kurumsal çalışmalarda şans.'
      }
    },
    saturn: {
      name: 'Satürn', symbol: '♄',
      houses: {
        1: 'Satürn 1. evde: Ciddi, disiplinli ve sorumluluk sahibi kişilik. Erken yaşta olgunluk. Zamanla gençleşirsiniz.',
        2: 'Satürn 2. evde: Maddi konularda tutumlu ve dikkatli. Para kazanmak emek ister ama uzun vadede güçlü bir temel kurarsınız.',
        3: 'Satürn 3. evde: İletişimde dikkatli ve ölçülü. Eğitim zorlu ama yapılandırılmış bir zeka. Kardeşlerle sorumluluk bağı.',
        4: 'Satürn 4. evde: Aile ortamında ciddiyet ve sorumluluk. Çocukluk zorlu olabilir ama ev konusunda güçlü bir temel kurarsınız.',
        5: 'Satürn 5. evde: Yaratıcılık ve aşk konusunda kısıtlamalar. Geç gelen ama derin romantizm. Çocuklarla sorumluluk bağı.',
        6: 'Satürn 6. evde: İş disiplini ve sağlık konusunda ciddi yaklaşım. Kronik sağlık konularına dikkat. Çalışkanlık ödüllendirilir.',
        7: 'Satürn 7. evde: İlişkilerde ciddiyet ve sorumluluk. Geç evlilik ama kalıcı. Yaşça büyük partnerler çekebilirsiniz.',
        8: 'Satürn 8. evde: Dönüşüm süreçleri yavaş ama derin. Finansal konularda dikkatli. Ölüm ve kayıp temaları yaşam dersleri taşır.',
        9: 'Satürn 9. evde: Eğitim ve felsefede disiplinli bir yaklaşım. Geleneksel değerler. Yapılandırılmış dünya görüşü.',
        10: 'Satürn 10. evde (kendi evinde): Kariyer hırsı güçlü, yükseliş yavaş ama kalıcı. Otorite pozisyonlarında doğal başarı.',
        11: 'Satürn 11. evde: Az ama sadık arkadaşlar. Grup sorumluluğu. Toplumsal hedeflere yapılandırılmış yaklaşım.',
        12: 'Satürn 12. evde: Gizli korkular ve bilinçaltı kısıtlamalar. Yalnızlıktan ders çıkarma. Spiritüel disiplin zamanla özgürleştirici olur.'
      }
    }
  };

  function getInterpretation(planetKey, houseNum) {
    const planet = DATA[planetKey];
    if (!planet || !planet.houses[houseNum]) return null;
    return {
      planet: planet.name,
      symbol: planet.symbol,
      house: houseNum,
      text: planet.houses[houseNum]
    };
  }

  function getAllForChart(planetHouses) {
    const results = [];
    const order = ['sun','moon','mercury','venus','mars','jupiter','saturn'];
    for (const key of order) {
      const house = planetHouses[key];
      if (house) {
        const interp = getInterpretation(key, house);
        if (interp) results.push(interp);
      }
    }
    return results;
  }

  return { getInterpretation, getAllForChart, DATA };
})();
