"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { kisiSayisi, customPsType, evetHayir, oyunTurleri } from "@/lib/adminPages";
import React, { useState, useEffect } from "react";
import SegmentedDep from "@/components/ui/segmentedDep";
import { Button } from "@/components/ui/button";
import { IconPlus, IconTrash, IconEdit } from "@tabler/icons-react";
import { FileUpload } from "@/components/ui/admin-file-upload";
import SelectBoxDep from "@/components/ui/selectBoxDep";
import DeleteAlertModal from "@/components/ui/deleteAlertDep";

interface Oyun {
  id: number;
  created_at: string;
  oyun_adi: string;
  cihaz_turu: string;
  kac_kisilik: number;
  kategori: string;
  ea_playde_mi: boolean;
  gorsel: string | null;
}

export default function OyunlarPage() {
  const [oyunAdi, setOyunAdi] = useState("");
  const [psType, setPsType] = useState("2");
  const [person, setPerson] = useState("2");
  const [gameType, setGameType] = useState("");
  const [eaMi, setEaMi] = useState("1");
  const [files, setFiles] = useState<File[]>([]);
  const [oyunlar, setOyunlar] = useState<Oyun[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [duzenlenenId, setDuzenlenenId] = useState<number | null>(null);
const [mevcutGorsel, setMevcutGorsel] = useState<string | null>(null);
const [resetFileUpload, setResetFileUpload] = useState(false);
  useEffect(() => {
    oyunlariYukle();
  }, []);

  const oyunlariYukle = async () => {
    try {
      const response = await fetch('/api/oyunlar');
      const data = await response.json();
      if (Array.isArray(data)) {
        setOyunlar(data);
      }
    } catch (error) {
      console.error('Oyunlar yüklenemedi:', error);
    }
  };

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

const formuTemizle = () => {
  setOyunAdi("");
  setFiles([]);
  setGameType("");
  setPsType("2");
  setPerson("2");
  setEaMi("1");
  setDuzenlenenId(null);
  setMevcutGorsel(null);
  
  // FileUpload'u reset et
  setResetFileUpload(true);
  setTimeout(() => setResetFileUpload(false), 100);
};

const oyunDuzenle = (oyun: Oyun) => {
  setDuzenlenenId(oyun.id);
  setOyunAdi(oyun.oyun_adi);
  setGameType(oyun.kategori);
  setPsType(oyun.cihaz_turu === "ps3" ? "1" : "2");
  setPerson(oyun.kac_kisilik.toString());
  setEaMi(oyun.ea_playde_mi ? "1" : "2");
  
  // Mevcut görseli kaydet (yeni görsel seçilmezse bu kullanılacak)
  setMevcutGorsel(oyun.gorsel);
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

 const oyunKaydet = async () => {
  if (!oyunAdi || !gameType) {
    alert('Lütfen oyun adı ve kategori giriniz!');
    return;
  }

  setYukleniyor(true);

  try {
    // Yeni görsel varsa base64'e çevir, yoksa mevcut görseli kullan
    let gorselUrl = mevcutGorsel;  // Default: mevcut görsel
    
    if (files.length > 0) {
      // Yeni görsel seçildiyse (şimdilik base64 - sonra UploadThing ekleyeceğiz)
      const reader = new FileReader();
      gorselUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(files[0]);
      });
    }

    const oyunData = {
      oyunAdi,
      cihazTuru: psType === "1" ? "ps3" : "ps4-ps5",
      kacKisilik: person,
      kategori: gameType,
      eaPlaydeMi: eaMi,
      gorselUrl
    };

    let response;
    
    if (duzenlenenId) {
      response = await fetch('/api/oyunlar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: duzenlenenId, ...oyunData })
      });
    } else {
      response = await fetch('/api/oyunlar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(oyunData)
      });
    }

    if (response.ok) {
      alert(duzenlenenId ? '✅ Oyun güncellendi!' : '✅ Oyun eklendi!');
      formuTemizle();
      oyunlariYukle();
    } else {
      const errorData = await response.json();
      alert('❌ Hata: ' + (errorData.error || 'İşlem başarısız'));
    }
  } catch (error) {
    console.error('Hata:', error);
    alert('❌ Bir hata oluştu!');
  } finally {
    setYukleniyor(false);
  }
};

  const oyunSil = async (id: number) => {
    if (!confirm('Bu oyunu silmek istediğinize emin misiniz?')) return;

    try {
      const response = await fetch(`/api/oyunlar?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('✅ Oyun silindi!');
        oyunlariYukle();
      }
    } catch (error) {
      console.error('Silme hatası:', error);
      alert('❌ Silme hatası!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-neutral-600 dark:text-neutral-400 text-3xl font-bold">
            Oyunlar
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {duzenlenenId ? 'Oyun düzenleniyor' : 'Yeni oyun ekle'}
          </p>
        </div>
        {duzenlenenId && (
          <Button onClick={formuTemizle} variant="outline">
            İptal Et
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-x-4 gap-y-6">
        <div className="lg:col-span-5 xl:col-span-4">
          <Label htmlFor="oyunAdi" className="mb-1">Oyun Adı</Label>
          <Input 
            type="text" 
            id="oyunAdi"
            value={oyunAdi}
            onChange={(e) => setOyunAdi(e.target.value)}
            placeholder="Oyun Adı" 
          />
        </div>

        <div className="lg:col-span-3 xl:col-span-2">
          <Label htmlFor="kategori" className="mb-1">Oyun Kategorisi</Label>
          <SelectBoxDep
            data={oyunTurleri}
            value={gameType}
            placeholder="Seçiniz"
            onValueChange={setGameType}
          />
        </div>

        <div className="lg:col-span-3 xl:col-span-2">
          <Label htmlFor="cihaz" className="mb-1">Cihaz Türü</Label>
          <SegmentedDep
            data={customPsType}
            value={psType}
            onValueChange={setPsType}
            radius="full"
            size="2"
          />
        </div>

        <div className="lg:col-span-6 xl:col-span-3 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="kisi" className="mb-1">Kaç Kişilik</Label>
            <SegmentedDep
              data={kisiSayisi}
              value={person}
              onValueChange={setPerson}
              radius="full"
              size="2"
            />
          </div>

          <div>
            <Label htmlFor="ea" className="mb-1">EA Playde Mi</Label>
            <SegmentedDep
              data={evetHayir}
              value={eaMi}
              onValueChange={setEaMi}
              radius="full"
              size="2"
            />
          </div>
        </div>

       <div className="lg:col-span-5 xl:col-span-4">
  <FileUpload 
  single 
  onChange={handleFileUpload} 
  title="Oyun Görseli"
  reset={resetFileUpload} // Reset prop'u ekle
/>
</div>

        <div className="lg:col-span-2 xl:col-span-2 lg:self-end">
          <Button
            onClick={oyunKaydet}
            disabled={yukleniyor}
            variant="outline"
          >
            <IconPlus /> {yukleniyor ? 'İşleniyor...' : (duzenlenenId ? 'Güncelle' : 'Ekle')}
          </Button>
        </div>
      </div>

      <hr className="my-8"/>

      <div>
        <h2 className="text-2xl font-bold mb-4 text-neutral-700 dark:text-neutral-300">
          Eklenen Oyunlar ({oyunlar.length})
        </h2>
        
        {oyunlar.length === 0 ? (
          <p className="text-neutral-500">Henüz oyun eklenmemiş.</p>
        ) : (
          <div className="grid gap-4">
            {oyunlar.map((oyun) => (
              <div 
                key={oyun.id} 
                className="border border-neutral-200 dark:border-neutral-800 p-4 rounded-lg flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4 items-center">
                  {oyun.gorsel && (
                    <img 
                      src={oyun.gorsel} 
                      alt={oyun.oyun_adi} 
                      className="w-16 h-16 object-cover rounded" 
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-lg">{oyun.oyun_adi}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {oyun.kategori} • {oyun.cihaz_turu} • {oyun.kac_kisilik} Kişilik
                      {oyun.ea_playde_mi && ' • EA Play'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => oyunDuzenle(oyun)}
                    variant="outline"
                    size="sm"
                  >
                    <IconEdit size={16} />
                  </Button>
                  <DeleteAlertModal  onClick={() => oyunSil(oyun.id)}></DeleteAlertModal>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}