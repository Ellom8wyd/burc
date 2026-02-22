/**
 * Türkiye İl ve İlçe Koordinat Veritabanı
 * Her il için merkez koordinatları ve popüler ilçeler
 */

const Locations = (() => {

  // Tüm iller ve büyük ilçeler
  const CITIES = {
    "Adana": { lat: 37.0000, lng: 35.3213, tz: 3, districts: {
      "Seyhan": { lat: 36.9917, lng: 35.3322 }, "Çukurova": { lat: 37.0167, lng: 35.3833 },
      "Yüreğir": { lat: 37.0500, lng: 35.3833 }, "Sarıçam": { lat: 37.0667, lng: 35.4167 },
      "Ceyhan": { lat: 37.0286, lng: 35.8125 }, "Kozan": { lat: 37.4556, lng: 35.8153 }
    }},
    "Adıyaman": { lat: 37.7648, lng: 38.2786, tz: 3, districts: {} },
    "Afyonkarahisar": { lat: 38.7507, lng: 30.5567, tz: 3, districts: {} },
    "Ağrı": { lat: 39.7191, lng: 43.0503, tz: 3, districts: {} },
    "Aksaray": { lat: 38.3687, lng: 34.0370, tz: 3, districts: {} },
    "Amasya": { lat: 40.6499, lng: 35.8353, tz: 3, districts: {} },
    "Ankara": { lat: 39.9334, lng: 32.8597, tz: 3, districts: {
      "Çankaya": { lat: 39.9179, lng: 32.8621 }, "Keçiören": { lat: 39.9833, lng: 32.8667 },
      "Mamak": { lat: 39.9333, lng: 32.9167 }, "Yenimahalle": { lat: 39.9667, lng: 32.8000 },
      "Etimesgut": { lat: 39.9500, lng: 32.6833 }, "Sincan": { lat: 39.9833, lng: 32.5833 },
      "Altındağ": { lat: 39.9500, lng: 32.8667 }, "Pursaklar": { lat: 40.0333, lng: 32.9000 },
      "Polatlı": { lat: 39.5842, lng: 32.1472 }, "Gölbaşı": { lat: 39.7833, lng: 32.8000 },
      "Beypazarı": { lat: 40.1678, lng: 31.9214 }, "Çubuk": { lat: 40.2400, lng: 33.0300 }
    }},
    "Antalya": { lat: 36.8969, lng: 30.7133, tz: 3, districts: {
      "Muratpaşa": { lat: 36.8833, lng: 30.7000 }, "Kepez": { lat: 36.9500, lng: 30.7167 },
      "Konyaaltı": { lat: 36.8833, lng: 30.6333 }, "Alanya": { lat: 36.5500, lng: 32.0000 },
      "Manavgat": { lat: 36.7833, lng: 31.4333 }, "Serik": { lat: 36.9167, lng: 31.1000 },
      "Kaş": { lat: 36.2000, lng: 29.6333 }, "Kemer": { lat: 36.5833, lng: 30.5500 }
    }},
    "Ardahan": { lat: 41.1105, lng: 42.7022, tz: 3, districts: {} },
    "Artvin": { lat: 41.1828, lng: 41.8183, tz: 3, districts: {} },
    "Aydın": { lat: 37.8560, lng: 27.8416, tz: 3, districts: {
      "Efeler": { lat: 37.8500, lng: 27.8333 }, "Kuşadası": { lat: 37.8606, lng: 27.2597 },
      "Söke": { lat: 37.7500, lng: 27.4167 }, "Nazilli": { lat: 37.9167, lng: 28.3167 },
      "Didim": { lat: 37.3739, lng: 27.2681 }
    }},
    "Balıkesir": { lat: 39.6484, lng: 27.8826, tz: 3, districts: {
      "Altıeylül": { lat: 39.6500, lng: 27.8833 }, "Karesi": { lat: 39.6500, lng: 27.8833 },
      "Edremit": { lat: 39.5961, lng: 27.0250 }, "Bandırma": { lat: 40.3500, lng: 27.9667 },
      "Ayvalık": { lat: 39.3167, lng: 26.6833 }
    }},
    "Bartın": { lat: 41.6344, lng: 32.3375, tz: 3, districts: {} },
    "Batman": { lat: 37.8812, lng: 41.1351, tz: 3, districts: {} },
    "Bayburt": { lat: 40.2552, lng: 40.2249, tz: 3, districts: {} },
    "Bilecik": { lat: 40.0567, lng: 30.0167, tz: 3, districts: {} },
    "Bingöl": { lat: 38.8855, lng: 40.4966, tz: 3, districts: {} },
    "Bitlis": { lat: 38.4013, lng: 42.1083, tz: 3, districts: {} },
    "Bolu": { lat: 40.7356, lng: 31.6061, tz: 3, districts: {} },
    "Burdur": { lat: 37.7167, lng: 30.2833, tz: 3, districts: {} },
    "Bursa": { lat: 40.1885, lng: 29.0610, tz: 3, districts: {
      "Osmangazi": { lat: 40.1833, lng: 29.0500 }, "Nilüfer": { lat: 40.2167, lng: 28.9500 },
      "Yıldırım": { lat: 40.2000, lng: 29.0833 }, "Görükle": { lat: 40.2333, lng: 28.8833 },
      "İnegöl": { lat: 40.0833, lng: 29.5167 }, "Mudanya": { lat: 40.3833, lng: 28.8833 },
      "Gemlik": { lat: 40.4333, lng: 29.1500 }
    }},
    "Çanakkale": { lat: 40.1553, lng: 26.4142, tz: 3, districts: {} },
    "Çankırı": { lat: 40.6013, lng: 33.6134, tz: 3, districts: {} },
    "Çorum": { lat: 40.5506, lng: 34.9556, tz: 3, districts: {} },
    "Denizli": { lat: 37.7765, lng: 29.0864, tz: 3, districts: {
      "Merkezefendi": { lat: 37.7833, lng: 29.1000 }, "Pamukkale": { lat: 37.7581, lng: 29.1017 }
    }},
    "Diyarbakır": { lat: 37.9144, lng: 40.2306, tz: 3, districts: {
      "Bağlar": { lat: 37.9000, lng: 40.2000 }, "Kayapınar": { lat: 37.9333, lng: 40.1667 },
      "Yenişehir": { lat: 37.9167, lng: 40.2333 }, "Sur": { lat: 37.9167, lng: 40.2333 }
    }},
    "Düzce": { lat: 40.8438, lng: 31.1565, tz: 3, districts: {} },
    "Edirne": { lat: 41.6818, lng: 26.5623, tz: 3, districts: {} },
    "Elazığ": { lat: 38.6810, lng: 39.2264, tz: 3, districts: {} },
    "Erzincan": { lat: 39.7500, lng: 39.5000, tz: 3, districts: {} },
    "Erzurum": { lat: 39.9000, lng: 41.2700, tz: 3, districts: {
      "Yakutiye": { lat: 39.9028, lng: 41.2750 }, "Palandöken": { lat: 39.8833, lng: 41.2667 },
      "Aziziye": { lat: 39.9500, lng: 41.1500 }
    }},
    "Eskişehir": { lat: 39.7767, lng: 30.5206, tz: 3, districts: {
      "Odunpazarı": { lat: 39.7667, lng: 30.5167 }, "Tepebaşı": { lat: 39.7833, lng: 30.5000 }
    }},
    "Gaziantep": { lat: 37.0662, lng: 37.3833, tz: 3, districts: {
      "Şahinbey": { lat: 37.0500, lng: 37.3667 }, "Şehitkamil": { lat: 37.0833, lng: 37.3833 },
      "Nizip": { lat: 37.0167, lng: 37.7833 }
    }},
    "Giresun": { lat: 40.9128, lng: 38.3895, tz: 3, districts: {} },
    "Gümüşhane": { lat: 40.4386, lng: 39.5086, tz: 3, districts: {} },
    "Hakkari": { lat: 37.5833, lng: 43.7333, tz: 3, districts: {} },
    "Hatay": { lat: 36.4018, lng: 36.3498, tz: 3, districts: {
      "Antakya": { lat: 36.2028, lng: 36.1500 }, "İskenderun": { lat: 36.5833, lng: 36.1667 },
      "Defne": { lat: 36.2333, lng: 36.1333 }, "Samandağ": { lat: 36.0833, lng: 35.9667 }
    }},
    "Iğdır": { lat: 39.9167, lng: 44.0500, tz: 3, districts: {} },
    "Isparta": { lat: 37.7648, lng: 30.5566, tz: 3, districts: {} },
    "İstanbul": { lat: 41.0082, lng: 28.9784, tz: 3, districts: {
      "Kadıköy": { lat: 40.9833, lng: 29.0333 }, "Beşiktaş": { lat: 41.0500, lng: 29.0000 },
      "Şişli": { lat: 41.0667, lng: 28.9833 }, "Bakırköy": { lat: 40.9833, lng: 28.8667 },
      "Fatih": { lat: 41.0167, lng: 28.9500 }, "Beyoğlu": { lat: 41.0333, lng: 28.9833 },
      "Üsküdar": { lat: 41.0167, lng: 29.0167 }, "Sarıyer": { lat: 41.1667, lng: 29.0500 },
      "Ataşehir": { lat: 40.9833, lng: 29.1167 }, "Maltepe": { lat: 40.9333, lng: 29.1333 },
      "Pendik": { lat: 40.8833, lng: 29.2500 }, "Kartal": { lat: 40.9000, lng: 29.1833 },
      "Tuzla": { lat: 40.8167, lng: 29.3000 }, "Ümraniye": { lat: 41.0167, lng: 29.0833 },
      "Beykoz": { lat: 41.1333, lng: 29.0833 }, "Sultanbeyli": { lat: 40.9500, lng: 29.2667 },
      "Çekmeköy": { lat: 41.0333, lng: 29.1833 }, "Sancaktepe": { lat: 41.0000, lng: 29.2333 },
      "Eyüpsultan": { lat: 41.0667, lng: 28.9333 }, "Bayrampaşa": { lat: 41.0500, lng: 28.9167 },
      "Gaziosmanpaşa": { lat: 41.0667, lng: 28.9167 }, "Kağıthane": { lat: 41.0833, lng: 28.9833 },
      "Sultangazi": { lat: 41.1000, lng: 28.8667 }, "Esenler": { lat: 41.0500, lng: 28.8833 },
      "Güngören": { lat: 41.0167, lng: 28.8667 }, "Bağcılar": { lat: 41.0333, lng: 28.8500 },
      "Bahçelievler": { lat: 41.0000, lng: 28.8500 }, "Küçükçekmece": { lat: 41.0000, lng: 28.7833 },
      "Başakşehir": { lat: 41.0833, lng: 28.8000 }, "Avcılar": { lat: 40.9833, lng: 28.7167 },
      "Esenyurt": { lat: 41.0333, lng: 28.6833 }, "Beylikdüzü": { lat: 41.0000, lng: 28.6333 },
      "Büyükçekmece": { lat: 41.0167, lng: 28.5833 }, "Arnavutköy": { lat: 41.1833, lng: 28.7333 },
      "Çatalca": { lat: 41.1333, lng: 28.4667 }, "Silivri": { lat: 41.0833, lng: 28.2500 },
      "Şile": { lat: 41.1833, lng: 29.6167 }, "Adalar": { lat: 40.8833, lng: 29.0833 },
      "Zeytinburnu": { lat: 41.0000, lng: 28.9000 }
    }},
    "İzmir": { lat: 38.4189, lng: 27.1287, tz: 3, districts: {
      "Konak": { lat: 38.4167, lng: 27.1333 }, "Karşıyaka": { lat: 38.4500, lng: 27.1000 },
      "Bornova": { lat: 38.4667, lng: 27.2167 }, "Buca": { lat: 38.3833, lng: 27.1667 },
      "Bayraklı": { lat: 38.4500, lng: 27.1667 }, "Çiğli": { lat: 38.5000, lng: 27.0667 },
      "Karabağlar": { lat: 38.3833, lng: 27.1167 }, "Gaziemir": { lat: 38.3167, lng: 27.1333 },
      "Balçova": { lat: 38.3833, lng: 27.0333 }, "Narlıdere": { lat: 38.4000, lng: 26.9833 },
      "Güzelbahçe": { lat: 38.3667, lng: 26.8833 }, "Torbalı": { lat: 38.1500, lng: 27.3500 },
      "Menemen": { lat: 38.6000, lng: 27.0667 }, "Kemalpaşa": { lat: 38.4333, lng: 27.4167 },
      "Ödemiş": { lat: 38.2333, lng: 27.9667 }, "Bergama": { lat: 39.1167, lng: 27.1833 },
      "Urla": { lat: 38.3167, lng: 26.7667 }, "Çeşme": { lat: 38.3167, lng: 26.3000 },
      "Seferihisar": { lat: 38.2000, lng: 26.8333 }, "Foça": { lat: 38.6667, lng: 26.7500 },
      "Aliağa": { lat: 38.8000, lng: 26.9667 }
    }},
    "Kahramanmaraş": { lat: 37.5858, lng: 36.9371, tz: 3, districts: {} },
    "Karabük": { lat: 41.2061, lng: 32.6204, tz: 3, districts: {} },
    "Karaman": { lat: 37.1759, lng: 33.2287, tz: 3, districts: {} },
    "Kars": { lat: 40.6167, lng: 43.1000, tz: 3, districts: {} },
    "Kastamonu": { lat: 41.3887, lng: 33.7827, tz: 3, districts: {} },
    "Kayseri": { lat: 38.7312, lng: 35.4787, tz: 3, districts: {
      "Melikgazi": { lat: 38.7333, lng: 35.4833 }, "Kocasinan": { lat: 38.7500, lng: 35.5000 },
      "Talas": { lat: 38.6833, lng: 35.5500 }
    }},
    "Kırıkkale": { lat: 39.8468, lng: 33.5153, tz: 3, districts: {} },
    "Kırklareli": { lat: 41.7333, lng: 27.2167, tz: 3, districts: {} },
    "Kırşehir": { lat: 39.1458, lng: 34.1709, tz: 3, districts: {} },
    "Kilis": { lat: 36.7184, lng: 37.1212, tz: 3, districts: {} },
    "Kocaeli": { lat: 40.8533, lng: 29.8815, tz: 3, districts: {
      "İzmit": { lat: 40.7667, lng: 29.9167 }, "Gebze": { lat: 40.8000, lng: 29.4333 },
      "Darıca": { lat: 40.7667, lng: 29.3667 }, "Çayırova": { lat: 40.8333, lng: 29.3833 },
      "Derince": { lat: 40.7500, lng: 29.8167 }, "Gölcük": { lat: 40.7167, lng: 29.8333 },
      "Körfez": { lat: 40.7833, lng: 29.7500 }, "Kartepe": { lat: 40.6833, lng: 30.0333 }
    }},
    "Konya": { lat: 37.8667, lng: 32.4833, tz: 3, districts: {
      "Selçuklu": { lat: 37.9000, lng: 32.4333 }, "Meram": { lat: 37.8333, lng: 32.4333 },
      "Karatay": { lat: 37.8833, lng: 32.5167 }, "Ereğli": { lat: 37.5167, lng: 34.0500 }
    }},
    "Kütahya": { lat: 39.4167, lng: 29.9833, tz: 3, districts: {} },
    "Malatya": { lat: 38.3552, lng: 38.3095, tz: 3, districts: {} },
    "Manisa": { lat: 38.6191, lng: 27.4289, tz: 3, districts: {
      "Şehzadeler": { lat: 38.6167, lng: 27.4333 }, "Yunusemre": { lat: 38.6000, lng: 27.4000 },
      "Akhisar": { lat: 38.9167, lng: 27.8333 }, "Turgutlu": { lat: 38.5000, lng: 27.7000 },
      "Salihli": { lat: 38.4833, lng: 28.1333 }
    }},
    "Mardin": { lat: 37.3212, lng: 40.7245, tz: 3, districts: {} },
    "Mersin": { lat: 36.8121, lng: 34.6415, tz: 3, districts: {
      "Yenişehir": { lat: 36.8167, lng: 34.6333 }, "Toroslar": { lat: 36.8500, lng: 34.6000 },
      "Akdeniz": { lat: 36.8000, lng: 34.6000 }, "Mezitli": { lat: 36.7667, lng: 34.5500 },
      "Tarsus": { lat: 36.9167, lng: 34.8833 }, "Silifke": { lat: 36.3833, lng: 33.9333 },
      "Erdemli": { lat: 36.6167, lng: 34.3000 }
    }},
    "Muğla": { lat: 37.2153, lng: 28.3636, tz: 3, districts: {
      "Menteşe": { lat: 37.2167, lng: 28.3667 }, "Bodrum": { lat: 37.0333, lng: 27.4333 },
      "Fethiye": { lat: 36.6500, lng: 29.1167 }, "Marmaris": { lat: 36.8500, lng: 28.2667 },
      "Milas": { lat: 37.3167, lng: 27.7833 }, "Dalaman": { lat: 36.7667, lng: 28.8000 },
      "Datça": { lat: 36.7333, lng: 27.6833 }, "Köyceğiz": { lat: 36.9667, lng: 28.6833 },
      "Ortaca": { lat: 36.8333, lng: 28.7667 }
    }},
    "Muş": { lat: 38.7432, lng: 41.5064, tz: 3, districts: {} },
    "Nevşehir": { lat: 38.6244, lng: 34.7239, tz: 3, districts: {} },
    "Niğde": { lat: 37.9667, lng: 34.6833, tz: 3, districts: {} },
    "Ordu": { lat: 40.9862, lng: 37.8797, tz: 3, districts: {} },
    "Osmaniye": { lat: 37.0742, lng: 36.2461, tz: 3, districts: {} },
    "Rize": { lat: 41.0201, lng: 40.5234, tz: 3, districts: {} },
    "Sakarya": { lat: 40.6940, lng: 30.4358, tz: 3, districts: {
      "Adapazarı": { lat: 40.7833, lng: 30.4000 }, "Serdivan": { lat: 40.7000, lng: 30.3500 },
      "Erenler": { lat: 40.7500, lng: 30.3833 }
    }},
    "Samsun": { lat: 41.2928, lng: 36.3313, tz: 3, districts: {
      "İlkadım": { lat: 41.2833, lng: 36.3333 }, "Atakum": { lat: 41.3333, lng: 36.2667 },
      "Canik": { lat: 41.2667, lng: 36.3667 }, "Bafra": { lat: 41.5667, lng: 35.9000 },
      "Çarşamba": { lat: 41.2000, lng: 36.7167 }
    }},
    "Şanlıurfa": { lat: 37.1591, lng: 38.7969, tz: 3, districts: {
      "Eyyübiye": { lat: 37.1500, lng: 38.8000 }, "Haliliye": { lat: 37.1667, lng: 38.7833 },
      "Karaköprü": { lat: 37.1833, lng: 38.7500 }
    }},
    "Siirt": { lat: 37.9333, lng: 41.9500, tz: 3, districts: {} },
    "Sinop": { lat: 42.0231, lng: 35.1531, tz: 3, districts: {} },
    "Sivas": { lat: 39.7477, lng: 37.0179, tz: 3, districts: {} },
    "Şırnak": { lat: 37.5164, lng: 42.4611, tz: 3, districts: {} },
    "Tekirdağ": { lat: 40.9833, lng: 27.5167, tz: 3, districts: {
      "Süleymanpaşa": { lat: 40.9833, lng: 27.5167 }, "Çorlu": { lat: 41.1667, lng: 27.8000 },
      "Çerkezköy": { lat: 41.2833, lng: 27.9833 }
    }},
    "Tokat": { lat: 40.3167, lng: 36.5500, tz: 3, districts: {} },
    "Trabzon": { lat: 41.0027, lng: 39.7168, tz: 3, districts: {
      "Ortahisar": { lat: 41.0000, lng: 39.7167 }, "Akçaabat": { lat: 41.0167, lng: 39.5667 },
      "Yomra": { lat: 40.9500, lng: 39.8667 }, "Of": { lat: 40.9500, lng: 40.2333 }
    }},
    "Tunceli": { lat: 39.1079, lng: 39.5401, tz: 3, districts: {} },
    "Uşak": { lat: 38.6823, lng: 29.4082, tz: 3, districts: {} },
    "Van": { lat: 38.5012, lng: 43.3730, tz: 3, districts: {
      "İpekyolu": { lat: 38.5000, lng: 43.3667 }, "Tuşba": { lat: 38.5167, lng: 43.4000 },
      "Edremit": { lat: 38.4500, lng: 43.2833 }
    }},
    "Yalova": { lat: 40.6500, lng: 29.2667, tz: 3, districts: {} },
    "Yozgat": { lat: 39.8181, lng: 34.8147, tz: 3, districts: {} },
    "Zonguldak": { lat: 41.4564, lng: 31.7987, tz: 3, districts: {
      "Ereğli": { lat: 41.2833, lng: 31.4167 }, "Devrek": { lat: 41.2167, lng: 31.9500 }
    }}
  };

  function getCityList() {
    return Object.keys(CITIES).sort((a, b) => a.localeCompare(b, 'tr'));
  }

  function getDistricts(city) {
    const c = CITIES[city];
    if (!c) return [];
    return Object.keys(c.districts).sort((a, b) => a.localeCompare(b, 'tr'));
  }

  function getCoordinates(city, district) {
    const c = CITIES[city];
    if (!c) return null;

    if (district && c.districts[district]) {
      return {
        lat: c.districts[district].lat,
        lng: c.districts[district].lng,
        tz: c.tz
      };
    }

    return { lat: c.lat, lng: c.lng, tz: c.tz };
  }

  function searchCities(query) {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase().replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g');
    return getCityList().filter(city => {
      const c = city.toLowerCase().replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g');
      return c.includes(q);
    });
  }

  return {
    getCityList,
    getDistricts,
    getCoordinates,
    searchCities,
    CITIES
  };

})();
