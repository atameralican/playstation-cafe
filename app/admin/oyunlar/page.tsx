"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  kisiSayisi,
  customPsType,
  evetHayir,
  oyunTurleri,
} from "@/lib/adminPages";
import React, { useState, useEffect } from "react";
import SegmentedDep from "@/components/ui/segmentedDep";
import { Button } from "@/components/ui/button";
import { IconPlus,   } from "@tabler/icons-react";
import { FileUpload } from "@/components/ui/admin-file-upload";
import SelectBoxDep from "@/components/ui/selectBoxDep";
import GameAddPageCard from "@/components/ui/game-add-card";
import { showAlert } from "@/components/ui/alertDep";
import { useServiceHook } from "@/components/useServiceHook/useServiceHook";

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
  const [data, setData] = useState({oyunAdi:"",psType:"2",person:"2",gameType:"",eaMi:"1",});
  const [files, setFiles] = useState<File[]>([]);
  const [oyunlar, setOyunlar] = useState<Oyun[]>([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [duzenlenenId, setDuzenlenenId] = useState<number | null>(null);
  const [mevcutGorsel, setMevcutGorsel] = useState<string | null>(null);
  const [resetFileUpload, setResetFileUpload] = useState(false);
  
  useEffect(() => {
    oyunlariYukle();
  }, []);

  // const oyunlariYukle = async () => {
  //   try {
  //     const response = await fetch("/api/oyunlar");
  //     const data = await response.json();
  //     if (Array.isArray(data)) {
  //       setOyunlar(data);
  //     }
  //   } catch (error) {
  //     showAlert(`Oyunlar yüklenemedi: ${error}`, "error");
  //   }
  // };
const { serviseGit } = useServiceHook();
  const oyunlariYukle = async () => {
    await serviseGit<Oyun[]>({
      url: "/api/oyunlar",
      loadingText: "Oyunlar yükleniyor...",
      onSuccess: (data) => {
        // data geldiğinde ne yapılacak
        setOyunlar(data as Oyun[]); // State'i güncelle
      },
      onError: (error) => {
        // Hata olduğunda ne yapılacak
        console.error("Hata:", error.message);
        alert("Oyunlar yüklenemedi!");
      },
    });
  };


  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

  const formuTemizle = () => {
     setData((prev) => ({
      ...prev,
      oyunAdi: "",
      gameType: "",
      psType:  "2",
      person: "2",
      eaMi:"1",
    }));
    // setOyunAdi("");
    
    setDuzenlenenId(null);
    setMevcutGorsel(null);
    setFiles([]);

    // FileUpload'u reset et
    setResetFileUpload(true);
    setTimeout(() => setResetFileUpload(false), 100);
  };

  const oyunDuzenle = (oyun: Oyun) => {
    setDuzenlenenId(oyun.id);
    setData((prev) => ({
      ...prev,
      oyunAdi: oyun.oyun_adi,
      gameType: oyun.kategori,
      psType: oyun.cihaz_turu === "ps3" ? "1" : "2",
      person: oyun.kac_kisilik.toString(),
      eaMi:oyun.ea_playde_mi ? "1" : "2"
    }));
    // setOyunAdi(oyun.oyun_adi);
    // setGameType(oyun.kategori);
    // setPsType(oyun.cihaz_turu === "ps3" ? "1" : "2");
    // setPerson(oyun.kac_kisilik.toString());
    // setEaMi(oyun.ea_playde_mi ? "1" : "2");

    // Mevcut görseli kaydet (yeni görsel seçilmezse bu kullanılacak)
    setMevcutGorsel(oyun.gorsel);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const oyunKaydet = async () => {
    if (!data.oyunAdi || !data.gameType) {
      showAlert("Lütfen oyun adı ve kategori giriniz!","error");
      return;
    }

    setYukleniyor(true);

    try {
      // Yeni görsel varsa base64'e çevir, yoksa mevcut görseli kullan
      let gorselUrl = mevcutGorsel; // Default: mevcut görsel

      if (files.length > 0) {
        // Yeni görsel seçildiyse (şimdilik base64 - sonra UploadThing ekleyeceğiz)
        const reader = new FileReader();
        gorselUrl = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(files[0]);
        });
      }

      const oyunData = {
        oyunAdi:data?.oyunAdi,
        cihazTuru: data.psType === "1" ? "ps3" : "ps4-ps5",
        kacKisilik: data.person,
        kategori: data.gameType,
        eaPlaydeMi: data.eaMi,
        gorselUrl,
      };

      let response;

      if (duzenlenenId) {
        response = await fetch("/api/oyunlar", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: duzenlenenId, ...oyunData }),
        });
      } else {
        response = await fetch("/api/oyunlar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(oyunData),
        });
      }

      if (response.ok) {
        showAlert(duzenlenenId ? "Oyun güncellendi!" : "Oyun eklendi!","success");
        formuTemizle();
        oyunlariYukle();
      } else {
        const errorData = await response.json();
        showAlert("Hata: " + (errorData.error || "İşlem başarısız","error"));
      }
    } catch (error) {
      console.error("Hata:", error);
      showAlert("Bir hata oluştu!","error");
    } finally {
      setYukleniyor(false);
    }
  };

 const oyunSil = async (id: number) => {
  try {
    const response = await fetch(`/api/oyunlar?id=${id}`, { method: "DELETE" });
    if (response.ok) {
      showAlert("Oyun silme işlemi başarılı.", "success");
      oyunlariYukle();
    } else {
      showAlert("Silme işlemi başarısız ❌", "error");
    }
  } catch (error) {
    console.error("Silme hatası:", error);
    showAlert("Silme hatası oluştu ❌", "error");
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
            {duzenlenenId ? "Oyun düzenleniyor" : "Yeni oyun ekle"}
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
          <Label htmlFor="oyunAdi" className="mb-1">
            Oyun Adı
          </Label>
          <Input
            type="text"
            id="oyunAdi"
            value={data.oyunAdi}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                oyunAdi: e.target.value,
              }))
            }
            placeholder="Oyun Adı"
          />
        </div>

        <div className="lg:col-span-3 xl:col-span-2">
          <Label htmlFor="kategori" className="mb-1">
            Oyun Kategorisi
          </Label>
          <SelectBoxDep
            data={oyunTurleri}
            value={data.gameType}
            placeholder="Seçiniz"
            onValueChange={(e)=>setData((prev) => ({
                ...prev,
                gameType: e,
              }))}
            // onValueChange={setGameType}
          />
        </div>

        <div className="lg:col-span-3 xl:col-span-2">
          <Label htmlFor="cihaz" className="mb-1">
            Cihaz Türü
          </Label>
          <SegmentedDep
            data={customPsType}
            value={data.psType}
            // onValueChange={setPsType}
            onValueChange={(e)=>setData((prev) => ({
                ...prev,
                psType: e,
              }))}
            radius="full"
            size="2"
          />
        </div>

        <div className="lg:col-span-6 xl:col-span-3 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="kisi" className="mb-1">
              Kaç Kişilik
            </Label>
            <SegmentedDep
              data={kisiSayisi}
              value={data?.person}
              // onValueChange={setPerson}
              onValueChange={(e)=>setData((prev) => ({
                ...prev,
                person: e,
              }))}
              radius="full"
              size="2"
            />
          </div>

          <div>
            <Label htmlFor="ea" className="mb-1">
              EA Playde Mi
            </Label>
            <SegmentedDep
              data={evetHayir}
              value={data.eaMi}
              onValueChange={(e)=>setData((prev) => ({
                ...prev,
                eaMi: e,
              }))}
              // onValueChange={setEaMi}
              radius="full"
              size="2"
            />
          </div>
        </div>

        <div className="lg:col-span-2 xl:col-span-2">
          <Label htmlFor="ea" className="mb-1">
            Oyun Görseli
          </Label>
          <FileUpload
            single
            onChange={handleFileUpload}
            // title="Oyun Görseli"
            reset={resetFileUpload} // Reset prop'u ekle
          />
        </div>

        <div className="lg:col-span-2 xl:col-span-2 lg:self-end">
          <Button onClick={oyunKaydet} disabled={yukleniyor} variant="outline">
            <IconPlus />{" "}
            {yukleniyor ? "İşleniyor..." : duzenlenenId ? "Güncelle" : "Ekle"}
          </Button>
        </div>
      </div>

      <hr className="my-8" />

      <div>
        <h3 className="text-lg font-bold mb-4 text-neutral-700 dark:text-neutral-300">
          Eklenen Oyunlar ({oyunlar.length})
        </h3>
        <GameAddPageCard
          data={oyunlar}
          updateOnClick={oyunDuzenle}
          deleteOnClick={oyunSil}
        />
      </div>
    </div>
  );
}
