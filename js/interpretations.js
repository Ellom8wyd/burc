/**
 * Astroloji Yorum Veritabanı
 * Güneş, Ay, Yükselen ve MC yorumları
 */

const Interpretations = (() => {

  const SUN_SIGNS = {
    'Koç': {
      title: 'Koç Güneşi ☉♈',
      text: `Güneşiniz Koç burcunda: doğuştan bir lider ve öncü ruhunuz var. Hayatta ilk adımı atan, cesur kararlar alabilen birisiniz. Enerjiniz yüksek, rekabetçi yapınız sizi sürekli ileriye taşır. Sabırsızlığınız zaman zaman başınızı ağrıtsa da bu aynı zamanda sizi hızlı hareket etmeye ve fırsatları yakalamaya iter. Kariyer hayatında bağımsız çalışmayı sever, kendi işinizi kurmaya yatkınsınızdır. Liderlik pozisyonlarında parlarsınız. Parayla ilişkiniz "kazan ve harca" şeklindedir; birikimden çok yeni girişimlere yatırım yapmayı tercih edersiniz. Aşk hayatında tutkulu, doğrudan ve fethedici bir yapınız vardır, ilk hamleyi siz yaparsınız. Eğitim hayatında rekabetçi ortamlar sizi motive eder, ancak monoton derslerden çabuk sıkılırsınız. Spor ve fiziksel aktiviteler ruhunuzu besler.`
    },
    'Boğa': {
      title: 'Boğa Güneşi ☉♉',
      text: `Güneşiniz Boğa burcunda: istikrar, konfor ve güvenlik sizin için hayatın temelidir. Sabırlı, kararlı ve son derece güvenilir birisiniz. Beş duyunuzla dünyayı deneyimlersiniz, güzel yemekler, kaliteli kumaşlar, hoş kokular sizin için lüks değil, gereklilik. Kariyer hayatında adım adım yükselmeyi tercih eder, sağlam temeller üzerine inşa edersiniz. Finansal konularda doğuştan yeteneklisiniz; para biriktirme ve yatırım yapma konusunda güçlü bir sezginiz var. Mülk edinmek ve maddi güvence sağlamak öncelikleriniz arasında. Aşk hayatında sadık, şefkatli ve duyusal bir partnersiniz; güven inşa etmek zaman alsa da bir kez bağlandığınızda sonsuza dek bağlanırsınız. Okulda uygulamalı, somut konularda başarılısınız. Sanat ve müzikle doğal bir bağınız var.`
    },
    'İkizler': {
      title: 'İkizler Güneşi ☉♊',
      text: `Güneşiniz İkizler burcunda: zeki, meraklı ve iletişim konusunda son derece yeteneklisiniz. Aynı anda birden fazla konuyla ilgilenebilir, bilgiyi hızla özümser ve aktarırsınız. Sosyal çevreniz geniştir ve her ortama kolayca uyum sağlarsınız. Kariyer hayatında medya, yazarlık, eğitim, satış veya teknoloji gibi iletişim gerektiren alanlarda parlarsınız. Çok yönlülüğünüz hem gücünüz hem de zayıflığınızdır, odaklanmak bazen zorlaşabilir. Finansal konularda birden fazla gelir kaynağı yaratma eğilimindesinizdir. Aşk hayatında entelektüel uyum sizin için fiziksel çekimden bile önemlidir; sizi güldüren ve zihinsel olarak uyaran birine ihtiyaç duyarsınız. Eğitimde dil öğrenme, tartışma ve araştırma konularında doğal bir yeteneğiniz var. Rutinden kaçınır, sürekli yeni şeyler öğrenmek istersiniz.`
    },
    'Yengeç': {
      title: 'Yengeç Güneşi ☉♋',
      text: `Güneşiniz Yengeç burcunda: duygusal derinliğiniz ve sezgileriniz en büyük gücünüzdür. Aile ve yuva sizin için kutsaldır. Koruyucu, besleyici ve empatik bir yapınız var. Kariyer hayatında insanlarla birebir çalışma, psikoloji, gastronomi, emlak veya bakım sektörlerinde başarılı olursunuz. İş ortamında güven duyduğunuz insanlarla çalışmanız performansınızı artırır. Finansal konularda güvence odaklısınızdır, acil durum fonu ve ev sahibi olma hayatınızın öncelikleri arasındadır. Aşk hayatında derin bağlar kurar, partnerinizi ailenizin bir parçası olarak görürsünüz; ancak kırılgan yönünüz sizi savunmacı yapabilir. Eğitim hayatında tarih, edebiyat ve psikoloji gibi insani konulara ilgi duyarsınız. Nostalji güçlü bir duygunuzdur.`
    },
    'Aslan': {
      title: 'Aslan Güneşi ☉♌',
      text: `Güneşiniz Aslan burcunda: yaratıcılık, karizma ve liderlik DNA'nızda var. Sahneye çıkmak, takdir görmek ve ilham kaynağı olmak sizin doğal halinizdir. Cömert, sıcak kalpli ve sadık birisiniz. Kariyer hayatında sanat, eğlence, yöneticilik veya girişimcilik alanlarında öne çıkarsınız. Sıradan işlerde mutsuz olursunuz, işinizde bir miktar drama ve tutku olmalı. Finansal konularda cömertsiniz, bazen gereğinden fazla harcayabilirsiniz ama para kazanma konusunda da yeteneklisiniz. Aşk hayatında romantik, tutkulu ve gösterişli bir partnersiniz; sevdiğiniz kişiyi şımartmayı seversiniz. Karşılığında da hayranlık ve sadakat beklersiniz. Eğitim hayatında yaratıcı projeler ve sunum yapma konusunda parlarsınız. Drama, müzik ve performans sanatları sizi çeker.`
    },
    'Başak': {
      title: 'Başak Güneşi ☉♍',
      text: `Güneşiniz Başak burcunda: analitik zekanız, detaylara olan dikkatiniz ve mükemmeliyetçiliğiniz sizi farklı kılar. Pratik çözümler üretme ve düzeni sağlama konusunda doğal bir yeteneğiniz var. Kariyer hayatında sağlık, analiz, yazılım, muhasebe, düzenleme veya danışmanlık alanlarında başarılı olursunuz. Kalite sizin için her şeydir ve standartlarınız yüksektir. Finansal konularda tutumlu ve planlısınızdır; bütçe yapma ve detaylı takip etme konusunda zodiağın en iyisisiniz. Aşk hayatında ilk başta mesafeli görünseniz de altında derin bir özveri ve ilgi yatar. Partnerinize küçük jestlerle sevginizi gösterirsiniz. Eğitim hayatında bilim, matematik ve araştırma konularında doğuştan parlarsınız. Eleştirel düşünme en güçlü yanınızdır. Sağlığınıza özen göstermek yaşam felsefenizin bir parçasıdır.`
    },
    'Terazi': {
      title: 'Terazi Güneşi ☉♎',
      text: `Güneşiniz Terazi burcunda: denge, uyum ve güzellik hayatınızın temel taşlarıdır. Diplomatik, zarif ve adalet duygusuna sahipsiniz. İlişkiler sizin için hayatın anlamını oluşturur. Kariyer hayatında hukuk, diplomasi, sanat, tasarım, halkla ilişkiler veya arabuluculuk alanlarında parlarsınız. Takım çalışmasında güçlüsünüz ve iş ortaklıkları sizin lehinize çalışır. Finansal konularda lüks zevkleriniz olsa da dengeli harcama yapma eğilimindesinizdir; ortaklık yoluyla kazanç elde edebilirsiniz. Aşk hayatı sizin için yaşamın merkezindedir, romantik, zarif ve adanmış bir partnersiniz. Karar vermekte zorlanmanız ilişkilerde bazen gerginlik yaratabilir. Eğitim hayatında sosyal bilimler, felsefe ve estetik konulara yatkınsınızdır. Güzel sanatlar ve müzik ruhunuzu besler.`
    },
    'Akrep': {
      title: 'Akrep Güneşi ☉♏',
      text: `Güneşiniz Akrep burcunda: yoğun, tutkulu ve derin bir ruha sahipsiniz. Yüzeyde sakin görünseniz de içinizde fırtınalar kopar. Dönüşüm ve yenilenme sizin doğal döngünüzdür. Kariyer hayatında araştırma, psikoloji, tıp, finans, dedektiflik veya kriz yönetimi alanlarında başarılı olursunuz. Gizli bilgilere ulaşmak ve karmaşık problemleri çözmek sizi heyecanlandırır. Finansal konularda stratejik düşünürsünüz; yatırım, miras ve ortak kaynaklar konusunda keskin bir sezginiz var. Borsa ve kripto gibi alanlara ilgi duyabilirsiniz. Aşk hayatında ya hep ya hiç yaklaşımınız vardır, yüzeysel ilişkiler sizi tatmin etmez. Derin, dönüştürücü ve tutkulu bir bağ ararsınız. Eğitimde psikoloji, biyoloji ve gizem içeren konulara çekilirsiniz. İç dünyanız zengindir.`
    },
    'Yay': {
      title: 'Yay Güneşi ☉♐',
      text: `Güneşiniz Yay burcunda: özgürlük, macera ve bilgelik arayışı hayatınızın itici gücüdür. İyimser, cömert ve felsefi bir bakış açınız var. Ufkunuzu genişletmek için sürekli yeni deneyimler ararsınız. Kariyer hayatında eğitim, yayıncılık, seyahat, felsefe veya uluslararası ilişkiler alanlarında başarılı olursunuz. Kısıtlayıcı ortamlardan kaçınır, özgürce çalışabileceğiniz pozisyonları tercih edersiniz. Finansal konularda risk almaktan korkmazsınız; şans sizden yana olsa da plansız harcamalar dengenizi bozabilir. Aşk hayatında eğlenceli, maceracı ve entelektüel bir partnersiniz. Kısıtlanmaktan hoşlanmazsınız, size alan tanıyan bir ilişki ideal olanıdır. Eğitim hayatında felsefe, din bilimleri ve yabancı diller ilginizi çeker. Seyahat etmek sizin için en iyi eğitimdir.`
    },
    'Oğlak': {
      title: 'Oğlak Güneşi ☉♑',
      text: `Güneşiniz Oğlak burcunda: disiplinli, hırslı ve sorumluluk sahibi bir yapınız var. Uzun vadeli hedefler belirler ve onlara ulaşmak için sabırla çalışırsınız. Kariyer sizin için bir kimlik meselesidir. İş hayatında yöneticilik, finans, mühendislik, kamu yönetimi veya şirket kuruculuğunda parlarsınız. Statü ve toplumsal saygınlık sizin için önemlidir. Finansal konularda zodiağın en disiplinli işaretlerinden birisiniz; uzun vadeli yatırımlar, emeklilik planları ve mülk edinme öncelikleriniz arasındadır. Aşk hayatında ilk başta soğuk veya mesafeli görünebilirsiniz ama zaman içinde derin ve sadık bir partner olduğunuz ortaya çıkar. Güvenilirlik sizin aşk dilinizdir. Eğitim hayatında yapılandırılmış ve hedef odaklı bir yaklaşımınız var. Matematik, ekonomi ve yönetim bilimleri ilginizi çeker.`
    },
    'Kova': {
      title: 'Kova Güneşi ☉♒',
      text: `Güneşiniz Kova burcunda: özgün, yenilikçi ve insancıl bir vizyona sahipsiniz. Kalıpların dışında düşünür, toplumsal değişim için çalışırsınız. Bireyselliğiniz en belirgin özelliğinizdir. Kariyer hayatında teknoloji, bilim, sosyal girişimcilik, aktivizm veya havacılık gibi geleceğe yönelik alanlarda öne çıkarsınız. Geleneksel iş yapılarından hoşlanmazsınız. Finansal konularda alışılmadık yollarla para kazanabilirsiniz; kripto para, teknoloji yatırımları veya topluluk odaklı projeler ilginizi çeker. Aşk hayatında entelektüel özgürlük ve arkadaşlık temelli bir ilişki ararsınız. Kıskançlık ve sahiplenme sizi bunaltır. Eğitim hayatında bilim, felsefe ve toplumsal konulara ilgi duyarsınız. Ezberci eğitim sistemi size göre değildir, kendi öğrenme yolunuzu yaratırsınız.`
    },
    'Balık': {
      title: 'Balık Güneşi ☉♓',
      text: `Güneşiniz Balık burcunda: empatik, sezgisel ve yaratıcı bir ruha sahipsiniz. Görünmeyen dünyalara ve duygusal derinliklere doğal bir bağınız var. Hayallere dalmak sizin için bir kaçış değil, ilham kaynağıdır. Kariyer hayatında sanat, müzik, sinema, psikoloji, spiritüellik veya hayırseverlik alanlarında parlarsınız. Başkalarına yardım etmek sizi derinden tatmin eder. Finansal konularda sezgileriniz güçlüdür ama pratik detayları gözden kaçırabilirsiniz; güvendiğiniz birinin mali konularda desteği işinize yarar. Aşk hayatında romantik, fedakar ve derinden seven bir partnersiniz. Ruh eşi kavramına inanır ve derin duygusal bağlar ararsınız. Sınırlar koymayı öğrenmek sizin için önemlidir. Eğitim hayatında sanat, edebiyat ve psikoloji konularına yatkınsınızdır. Yaratıcı yazma ve müzik yetenekleriniz olabilir.`
    }
  };

  const MOON_SIGNS = {
    'Koç': {
      title: 'Koç Ayı ☽♈',
      text: `Ayınız Koç burcunda: duygularınız anlık, yoğun ve patlamasal. Hissettiğiniz şeyi anında ifade edersiniz, öfke de sevinç de hızla gelir ve geçer. Duygusal olarak bağımsızlığa ihtiyaç duyar, kendinizi ifade edemediğiniz ortamlarda boğulursunuz. Stresinizi fiziksel aktiviteyle atarsınız. Çocukluğunuzda rekabetçi veya enerjik bir ortamda büyümüş olabilirsiniz. İç dünyanızda bir savaşçı yaşar.`
    },
    'Boğa': {
      title: 'Boğa Ayı ☽♉',
      text: `Ayınız Boğa burcunda: duygusal güvenlik ve konfor sizin için hayati öneme sahip. Huzurlu bir ev ortamı, güzel yemekler ve dokunsal hazlar iç dünyanızı besler. Değişime dirençlisinizdir ama bu aynı zamanda sizi kararlı ve güvenilir kılar. Duygularınız yavaş ama derin akar. Maddi güvence duygusal dengenizi doğrudan etkiler. Sanata ve doğaya yakınlık ruhunuzu iyileştirir.`
    },
    'İkizler': {
      title: 'İkizler Ayı ☽♊',
      text: `Ayınız İkizler burcunda: duygularınızı konuşarak, yazarak veya analiz ederek işlersiniz. Zihniniz sürekli aktiftir ve duygusal huzur bulmak için entelektüel uyarıma ihtiyaç duyarsınız. Sıkılmak sizin için duygusal bir kriz olabilir. Sosyal bağlantılar ruhunuzu besler. Çok yönlü ilgi alanlarınız var ve iç dünyanız bir kelebekler bahçesi gibi sürekli hareket halindedir. Espri ve zeka güvenli alanınızdır.`
    },
    'Yengeç': {
      title: 'Yengeç Ayı ☽♋',
      text: `Ayınız Yengeç burcunda (Ay kendi evinde): duygusal dünyanız son derece zengin ve derin. Sezgileriniz güçlü, empati yeteneğiniz olağanüstü. Aile ve yuva kavramı ruhunuzun çekirdeğidir. Anılarınız sizi derinden etkiler ve nostalji güçlü bir duygusunuzdur. Kendinizi güvende hissetmek için tanıdık ortamlara ihtiyaç duyarsınız. Başkalarını beslemek ve korumak size huzur verir. Ay döngülerinden güçlü etkilenirsiniz.`
    },
    'Aslan': {
      title: 'Aslan Ayı ☽♌',
      text: `Ayınız Aslan burcunda: iç dünyanızda bir sanatçı ve performansçı yaşıyor. Takdir edilmek, sevilmek ve özel hissetmek duygusal temel ihtiyaçlarınız. Cömert, sıcak ve dramatik bir duygusal yapınız var. Yaratıcı ifade sizi iyileştirir. Görmezden gelinmek en büyük duygusal yaranızdır. Çocuk gibi bir coşkunuz var, oyun, eğlence ve kahkaha ruhunuzu besler. Aşkta romantizm sizin için vazgeçilmezdir.`
    },
    'Başak': {
      title: 'Başak Ayı ☽♍',
      text: `Ayınız Başak burcunda: duygusal güvenliğinizi düzen, rutin ve faydalılık hissi sağlar. Kaygılı bir iç dünyanız olabilir, zihniniz sürekli analiz eder ve endişelenir. Kendinizi işe yarar hissetmek duygusal dengeniz için kritiktir. Sağlık konularına dikkat eder, detaylara takılabilirsiniz. Başkalarına yardım etmek sizi rahatlatır. Mükemmeliyetçi iç sesinizi yumuşatmayı öğrenmek sizin için önemli bir yaşam dersidir.`
    },
    'Terazi': {
      title: 'Terazi Ayı ☽♎',
      text: `Ayınız Terazi burcunda: uyum, güzellik ve ilişkiler duygusal dünyanızın merkezindedir. Çatışmadan kaçınır, barış ortamında huzur bulursunuz. Yalnızlık sizi derinden rahatsız edebilir, bir partnere veya yakın arkadaşlara ihtiyaç duyarsınız. Estetik ortamlar ruhunuzu besler. Kararlarınızda başkalarının görüşlerini fazla önemseyebilirsiniz. Sanat ve müzik duygusal dengenizi sağlar.`
    },
    'Akrep': {
      title: 'Akrep Ayı ☽♏',
      text: `Ayınız Akrep burcunda: duygusal dünyanız bir okyanusun derinlikleri gibidir, yoğun, gizemli ve dönüştürücü. Her şeyi derinden hisseder, sezgileriniz neredeyse psişik düzeydedir. Güven sizin için en kıymetli şeydir ve ihanet affetmekte zorlanırsınız. Kontrol ihtiyacınız duygusal güvensizlikten kaynaklanabilir. Dönüşüm süreçleri acı verse de her seferinde daha güçlü yeniden doğarsınız. Terapötik süreçler size iyi gelir.`
    },
    'Yay': {
      title: 'Yay Ayı ☽♐',
      text: `Ayınız Yay burcunda: iç dünyanız iyimserlik, macera ve anlam arayışıyla doludur. Duygusal olarak özgürlüğe ihtiyaç duyar, kısıtlanmaktan bunalırsınız. Felsefi veya spiritüel arayışlar ruhunuzu besler. Seyahat ve yeni deneyimler duygusal dengenizi sağlar. Olumsuz durumlarda bile bir ışık görme eğilimindesiniz ki bu güçlü bir hediyedir. Espri anlayışınız ve neşeniz bulaşıcıdır.`
    },
    'Oğlak': {
      title: 'Oğlak Ayı ☽♑',
      text: `Ayınız Oğlak burcunda: duygusal dünyanızda olgunluk, sorumluluk ve kontrol ön plandadır. Küçük yaştan itibaren duygusal olarak kendine yeten biri olmuş olabilirsiniz. İç dünyanızda bir ciddiyet ve derinlik var. Başarı ve statü duygusal güvenliğinizle doğrudan bağlantılı. Duygularınızı ifade etmekte zorlanabilir, zayıflık göstermekten kaçınabilirsiniz. Zamanla duygusal duvarlarınızı yıkmayı öğrenirsiniz.`
    },
    'Kova': {
      title: 'Kova Ayı ☽♒',
      text: `Ayınız Kova burcunda: duygusal dünyayı mantıkla anlamaya çalışırsınız. Bağımsızlık ve bireysellik iç dünyanızın temelini oluşturur. Geleneksel duygusal kalıplara uymaz, ilişkilerde arkadaşlık ve entelektüel paylaşım ararsınız. Topluluk ve grup dinamikleri sizi besler. Duygularınızı zihinselleştirme eğilimindesiniz, hissetmekten çok düşünürsünüz. İnsanlık için bir şeyler yapmak size derin bir tatmin verir.`
    },
    'Balık': {
      title: 'Balık Ayı ☽♓',
      text: `Ayınız Balık burcunda: duygusal dünyanız sınırsız, akışkan ve derinden empatik. Çevrenizdeki insanların duygularını sünger gibi emersiniz. Hayal gücünüz inanılmaz zengin, sanatsal ve spiritüel duyarlılığınız yüksek. Yalnız kalma ve hayal kurma zamanlarına ihtiyaç duyarsınız. Sınır koymakta zorluk yaşayabilir, başkalarının acılarını kendi acınız gibi hissedebilirsiniz. Müzik, su ve meditasyon sizi iyileştirir.`
    }
  };

  const ASC_SIGNS = {
    'Koç': {
      title: 'Koç Yükseleni ★♈',
      text: `Yükseleniz Koç burcunda: dünyaya enerjik, kararlı ve cesur bir izlenim bırakırsınız. İlk tanışmalarda dinamik, hızlı ve doğrudan biri olarak algılanırsınız. Fiziksel olarak atletik bir duruşunuz, keskin bakışlarınız olabilir. Hayata "savaşçı" modunda yaklaşır, yeni başlangıçlara herkesten önce atılırsınız. İlk izleniminiz güçlü ve unutulmazdır. Beden diliniz kararlılık ve güç yansıtır.`
    },
    'Boğa': {
      title: 'Boğa Yükseleni ★♉',
      text: `Yükseleniz Boğa burcunda: sakin, zarif ve güvenilir bir ilk izlenim bırakırsınız. Fiziksel olarak çekici, sağlam yapılı ve bakımlı görünürsünüz. Yavaş ama emin adımlarla ilerler, acele etmezsiniz. İnsanlar yanınızda huzur hisseder. Tarzınız kaliteli ve klasiktir. Konfor alanınızdan çıkmakta zorlanabilirsiniz ama bu sizi aynı zamanda istikrarlı ve güvenilir kılar.`
    },
    'İkizler': {
      title: 'İkizler Yükseleni ★♊',
      text: `Yükseleniz İkizler burcunda: zeki, konuşkan ve meraklı bir ilk izlenim bırakırsınız. Genç gösteren bir görünümünüz ve hareketli bir beden diliniz var. İnsanlar sizi eğlenceli, bilgili ve çok yönlü bulur. Sürekli hareket halinde gibisiniz, elleriiniz, mimikleriniz, sesiniz hep aktif. Adaptasyon yeteneğiniz yüksektir ve yeni ortamlara anında uyum sağlarsınız.`
    },
    'Yengeç': {
      title: 'Yengeç Yükseleni ★♋',
      text: `Yükseleniz Yengeç burcunda: sıcak, koruyucu ve biraz çekingen bir ilk izlenim bırakırsınız. Yumuşak hatlarınız, ifadeli gözleriniz ve anaç bir auranız olabilir. İnsanlar yanınızda kendilerini güvende hisseder. Ortama alışana kadar kendinizi kabuğunuzun içinde tutarsınız ama açıldığınızda çok sevecen ve sadık birisiniz. Yüz ifadeleriniz duygularınızı ele verir.`
    },
    'Aslan': {
      title: 'Aslan Yükseleni ★♌',
      text: `Yükseleniz Aslan burcunda: gösterişli, karizmatik ve kendinden emin bir ilk izlenim bırakırsınız. Bir odaya girdiğinizde fark edilirsiniz, duruşunuz, tarzınız ve enerjiniz dikkat çeker. Saçlarınız genellikle gür ve etkileyicidir. Doğal bir liderlik auranız var. İnsanlar sizi güçlü, cömert ve ilham verici bulur. Sahne sizin doğal ortamınızdır.`
    },
    'Başak': {
      title: 'Başak Yükseleni ★♍',
      text: `Yükseleniz Başak burcunda: düzenli, temiz ve zeki bir ilk izlenim bırakırsınız. Detaylara olan dikkatiniz görünümünüze de yansır, her şey yerli yerindedir. İnsanlar sizi güvenilir, çalışkan ve mütevazı bulur. Analitik bakışınız karşınızdakini okur. Mükemmeliyetçi bir yaklaşımınız var; hem kendinize hem başkalarına yüksek standartlar koyarsınız.`
    },
    'Terazi': {
      title: 'Terazi Yükseleni ★♎',
      text: `Yükseleniz Terazi burcunda: zarif, çekici ve diplomatik bir ilk izlenim bırakırsınız. Fiziksel olarak dengeli yüz hatlarınız, hoş bir gülümsemeniz ve şık bir tarzınız var. İnsanlar yanınızda rahat eder, çatışma yaratmazsınız. Sosyal ortamlarda doğal bir arabulucu ve ev sahibisinizdir. Güzellik ve estetik hayatınızın her alanına yansır.`
    },
    'Akrep': {
      title: 'Akrep Yükseleni ★♏',
      text: `Yükseleniz Akrep burcunda: yoğun, manyetik ve gizemli bir ilk izlenim bırakırsınız. Bakışlarınız delici, auranız güçlüdür. İnsanlar sizi çözemez ama sizden etkilenir. Bir odaya girdiğinizde sessiz ama güçlü bir varlık hissedilir. Güven kolay vermez, yüzeysel ilişkilerden kaçınırsınız. Dönüşüm ve yenilenme temanız sürekli hayatınızda işler.`
    },
    'Yay': {
      title: 'Yay Yükseleni ★♐',
      text: `Yükseleniz Yay burcunda: neşeli, iyimser ve maceracı bir ilk izlenim bırakırsınız. Geniş bir gülümsemeniz, rahat bir duruşunuz ve enerjik bir auranız var. İnsanlar yanınızda kendilerini iyi hisseder çünkü iyimserliğiniz bulaşıcıdır. Uzun boylu veya atletik bir yapınız olabilir. Felsefi sohbetlere ve kültürel deneyimlere yatkınsınızdır.`
    },
    'Oğlak': {
      title: 'Oğlak Yükseleni ★♑',
      text: `Yükseleniz Oğlak burcunda: olgun, ciddi ve profesyonel bir ilk izlenim bırakırsınız. Yaşınızdan büyük gösterebilir veya erken yaşta sorumluluk üstlenmiş olabilirsiniz. İnsanlar sizi güvenilir, yapılandırılmış ve hedef odaklı bulur. Kemik yapınız belirgin, duruşunuz diktir. Zamanla gençleşirsiniz, yaşlandıkça daha rahat ve eğlenceli biri olursunuz.`
    },
    'Kova': {
      title: 'Kova Yükseleni ★♒',
      text: `Yükseleniz Kova burcunda: farklı, özgün ve biraz eksantrik bir ilk izlenim bırakırsınız. Tarzınız alışılmadıktır, kalabalıkta öne çıkarsınız. İnsanlar sizi ilginç, zeki ve öngörülemez bulur. Toplumsal normlara meydan okursunuz. Arkadaş canlısı ama mesafeli bir auranız var. Teknoloji ve yenilik hayatınızın her alanına nüfuz eder.`
    },
    'Balık': {
      title: 'Balık Yükseleni ★♓',
      text: `Yükseleniz Balık burcunda: rüya gibi, yumuşak ve empatik bir ilk izlenim bırakırsınız. Gözleriniz derin ve hayalperest, auranız etere yakındır. İnsanlar yanınızda huzur bulur ama sizi tam olarak çözemez. Sanatsal ve spiritüel bir görünümünüz var. Ortamın enerjisini anında hisseder, kamelyon gibi uyum sağlarsınız. Sınırlarınız belirsiz olabilir.`
    }
  };

  const MC_SIGNS = {
    'Koç': 'Gökyüzü Ortanız Koç burcunda: kariyerinizde öncü, bağımsız ve cesur bir yol izlersiniz. Kendi işinizi kurmaya veya liderlik rollerine yatkınsınız.',
    'Boğa': 'Gökyüzü Ortanız Boğa burcunda: kariyerinizde istikrar, finansal güvenlik ve somut sonuçlar ararsınız. Sanat, finans veya emlak alanları size uyar.',
    'İkizler': 'Gökyüzü Ortanız İkizler burcunda: kariyerinizde iletişim, yazarlık, eğitim ve çok yönlülük ön plandadır. Birden fazla kariyer yolunuz olabilir.',
    'Yengeç': 'Gökyüzü Ortanız Yengeç burcunda: kariyerinizde bakım, ev, aile ve duygusal bağlantı temaları öne çıkar. Gastronomi, psikoloji veya emlak alanlarında başarılı olabilirsiniz.',
    'Aslan': 'Gökyüzü Ortanız Aslan burcunda: kariyerinizde yaratıcılık, liderlik ve tanınırlık ararsınız. Sanat, eğlence sektörü veya yöneticilik size uyar.',
    'Başak': 'Gökyüzü Ortanız Başak burcunda: kariyerinizde detaylara hakimiyet, hizmet ve mükemmellik ararsınız. Sağlık, analiz veya danışmanlık alanları size uyar.',
    'Terazi': 'Gökyüzü Ortanız Terazi burcunda: kariyerinizde diplomasi, güzellik ve ortaklıklar ön plandadır. Hukuk, sanat veya halkla ilişkiler alanlarında parlarsınız.',
    'Akrep': 'Gökyüzü Ortanız Akrep burcunda: kariyerinizde derinlik, dönüşüm ve güç temaları işler. Psikoloji, finans, araştırma veya kriz yönetimi size uyar.',
    'Yay': 'Gökyüzü Ortanız Yay burcunda: kariyerinizde özgürlük, eğitim ve uluslararası bağlantılar ararsınız. Akademi, yayıncılık veya seyahat sektörü size uyar.',
    'Oğlak': 'Gökyüzü Ortanız Oğlak burcunda: kariyerinizde otorite, yapı ve uzun vadeli başarı ararsınız. Yöneticilik, devlet kurumları veya şirket yönetimi size uyar.',
    'Kova': 'Gökyüzü Ortanız Kova burcunda: kariyerinizde yenilikçilik, teknoloji ve toplumsal etki ararsınız. Bilim, teknoloji veya sosyal girişimcilik size uyar.',
    'Balık': 'Gökyüzü Ortanız Balık burcunda: kariyerinizde yaratıcılık, spiritüellik ve insanlığa hizmet temaları işler. Sanat, müzik, psikoloji veya hayırseverlik size uyar.'
  };

  function getSunInterpretation(signName) { return SUN_SIGNS[signName] || null; }
  function getMoonInterpretation(signName) { return MOON_SIGNS[signName] || null; }
  function getAscInterpretation(signName) { return ASC_SIGNS[signName] || null; }
  function getMCInterpretation(signName) { return MC_SIGNS[signName] || ''; }

  return {
    getSunInterpretation,
    getMoonInterpretation,
    getAscInterpretation,
    getMCInterpretation
  };

})();
