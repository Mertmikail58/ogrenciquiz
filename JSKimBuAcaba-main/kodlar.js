//veri havuzu oluştur
const ogrenciler = [
    { ad: "Enes", ipucu: "Hiperaktif" },
    { ad: "Bilal", ipucu: "Kumarbaz"  },
    { ad: "Umut", ipucu: "Çalgıcı"  },
    { ad: "Tuğba", ipucu: "Sincap"  },
    { ad: "Erayinho", ipucu: "Okulu bıraktı"  }
];
//nesneleri değişkene al
const kapsayici = document.getElementById("container");
const ipucuAlani = document.getElementById("hint");
const tahminGirisi= document.getElementById("guessInput");
const tahminButonu = document.getElementById("guessButton");
const kalanHakAlani = document.getElementById("attempts");
const sonucAlani = document.getElementById("result");
const puanAlani = document.getElementById("score");

tahminButonu.addEventListener("click", sonucKontrol);
//sayaçlar ve rastgele seçilen kelimeler için değişken oluştur
let sayac = 0;
let rastgeleOgrenci = {};
let kart = null;
let harfler = [];


//Oyunu yükleme fonksiyonunu çağır
oyunuBaslat();


let zorlukSeviyesi; // Global zorluk seviyesi değişkeni

function oyunuBaslat(zorluk) {
    let filtreliOgrenciler = [];

    // Belirtilen zorluk seviyesine göre öğrencileri filtrele
    switch (zorluk) {
        case "kolay":
            filtreliOgrenciler = ogrenciler.filter(ogrenci => ogrenci.ad.length <= 4);
            break;
        case "orta":
            filtreliOgrenciler = ogrenciler.filter(ogrenci => ogrenci.ad.length > 4 && ogrenci.ad.length < 7);
            break;
        case "zor":
            filtreliOgrenciler = ogrenciler.filter(ogrenci => ogrenci.ad.length >=8);
            break;
        default:
            filtreliOgrenciler = ogrenciler; // Varsayılan olarak tüm öğrencileri al
    }

    // Eğer filtrelenmiş öğrenci bulunamazsa veya boşsa hata mesajı göster
    if (filtreliOgrenciler.length === 0) {
        console.error("Filtrelenmiş öğrenci bulunamadı veya dizi boş.");
        console.error("Zorluk seviyesi:", zorluk);
        console.error("Filtrelenmiş öğrenciler:", filtreliOgrenciler);
        return;
    }

    // Filtrelenmiş öğrencilerden rastgele birini seç
    rastgeleOgrenci = filtreliOgrenciler[Math.floor(Math.random() * filtreliOgrenciler.length)];
    
    ipucuAlani.innerHTML = "Acaba kim bu? " + rastgeleOgrenci.ipucu;
    kartlariOlustur();
}




// Kartları açmak için fonksiyon güncellendi
function kartAc() {
    if (this.classList.contains("revealed")) return; // Eğer kart zaten açıldıysa, işlem yapma

    let yarisi = Math.ceil(harfler.length / 2); // Kelimenin yarısı
    let kalanHak = yarisi - sayac;

    if (this.dataset.index == 0 && !this.classList.contains("revealed")) return; // Baş harfin açılmasını engelle

    // Açılmış sesli harf varsa ve orta seviyede oynanıyorsa işlem yapma
    if (sayac < yarisi && isSesliHarfAciKontrol(harfler[this.dataset.index])) return;

    sayac++;

    if (sayac <= yarisi) {
        this.innerHTML = harfler[this.dataset.index];
        this.classList.add("revealed");

        // Eğer açılan harf sesliyse ve daha önce bir sesli harf açılmışsa, tahmin hakkını düşür
        if (isSesliHarf(harfler[this.dataset.index]) && sesliHarfAcildiMi()) {
            kalanHak--;
        }

        // Tahmin hakkının negatif olmasını engelle
        if (kalanHak < 0) {
            kalanHak = 0;
        }

        kalanHakAlani.innerHTML = kalanHak + " tahmin hakkınız kaldı!";
    }

    if (sayac == yarisi) {
        tahminButonu.disabled = false;
        kalanHakAlani.innerHTML = "Kelimeyi tahmin etmek için " + (3 - yarisi) + " hakkınız var!";
        
    }
}



// Sesli harflerin kontrolünü yapan fonksiyon
function isSesliHarf(harf) {
    const sesliHarfler = ['a', 'e', 'ı', 'i', 'o', 'ö', 'u', 'ü']; // Türk alfabesindeki sesli harfler (küçük harfler)
    return sesliHarfler.includes(harf.toLowerCase());
}

// Daha önce sesli harf açılıp açılmadığını kontrol eden fonksiyon
function sesliHarfAcildiMi() {
    let acilanSesliHarfSayisi = 0;
    document.querySelectorAll('.card.revealed').forEach(card => {
        if (isSesliHarf(card.innerHTML)) {
            acilanSesliHarfSayisi++;
        }
    });
    return acilanSesliHarfSayisi > 0;
}

// Sesli harf açma kontrolü için fonksiyon
function isSesliHarfAciKontrol(harf) {
    return isSesliHarf(harf) && sesliHarfAcildiMi();
}


function secimYap(zorlukSeviyesi) {
    console.log("Seçilen zorluk seviyesi:", zorlukSeviyesi);
    oyunuBaslat(zorlukSeviyesi);
}


// Kartları oluşturma fonksiyonunu güncellendi
function kartlariOlustur(){
    sayac=0;
    kapsayici.innerHTML="";
    
    //Önce kelimeyi parçala ve harfleri diziye at
    harfler = rastgeleOgrenci.ad.toUpperCase().split("");

    // Harfleri karıştır
    harfler = shuffleArray(harfler);

    harfler.forEach((harf,index)=>{
        kart=document.createElement("div");
        kart.innerHTML="?";
        kart.className="card";
        kart.dataset.value=harf;
        kart.dataset.index=index;
        kapsayici.appendChild(kart);
        kart.addEventListener("click",kartAc);
    })
}

// Diziyi karıştırmak için fonksiyon
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Tahmin butonuna tıklama olayı için dinleyici ekle
tahminButonu.addEventListener("click", sonucKontrol);

// Zorluk seviyelerine göre puanları belirle
const puanlar = {
    kolay: 10,
    orta: 20,
    zor: 30
};

let toplamPuan = 100; // Toplam puan 100 olarak başlasın

function sonucKontrol() {
    let tahmin = tahminGirisi.value.trim().toUpperCase();
    let dogruCevap = rastgeleOgrenci.ad.toUpperCase();
    let sonucMesaji = "";
    let puan = puanlar[zorlukSeviyesi]; // Zorluk seviyesine göre puanı al

    // Eğer tahmin alanı boş değilse ve tahmin doğruysa veya kullanıcı kelimeyi doğrudan girmişse
    if (tahmin && (tahmin === dogruCevap || tahmin === rastgeleOgrenci.ad.toUpperCase())) {
        toplamPuan += puan; // Doğru tahminde puanı artır
        sonucMesaji = "Tebrikler! Doğru tahmin ettiniz! Cevap: " + dogruCevap + ". Puanınız: " + toplamPuan;
    } else {
        // Her harf açıldığında puanı düşür
        toplamPuan -= 10;
        sonucMesaji = "Maalesef yanlış tahmin ettiniz. Doğru cevap: " + dogruCevap + ". Puanınız: " + toplamPuan;
    }
    sonucAlani.textContent = sonucMesaji;
}

