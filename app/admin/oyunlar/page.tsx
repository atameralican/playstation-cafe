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
import { FileUpload } from "@/components/ui/admin-file-upload";
import SelectBoxDep from "@/components/ui/selectBoxDep";
import GameAddPageCard from "@/components/ui/game-add-card";
import { showToast } from "@/components/ui/alertDep";
import { useServiceHook } from "@/components/useServiceHook/useServiceHook";
import { Button } from "@radix-ui/themes";

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
  const [data, setData] = useState({
    oyunAdi: "",
    psType: "2",
    person: "2",
    gameType: "",
    eaMi: "1",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [oyunlar, setOyunlar] = useState<Oyun[]>([]);
  const [duzenlenenId, setDuzenlenenId] = useState<number | null>(null);
  const [mevcutGorsel, setMevcutGorsel] = useState<string | null>(null);
  const [resetFileUpload, setResetFileUpload] = useState(false);
  const { serviseGit } = useServiceHook();

  useEffect(() => {
    oyunlariYukle();
  }, []);

  const oyunlariYukle = async () => {
    await serviseGit<Oyun[]>({
      url: "/api/oyunlar",
      onSuccess: (data) => {
        setOyunlar(data as Oyun[]);
      },
      onError: (error) => {
        showToast(`Oyunlar yüklenemedi: ${error.message}`, "error");
      },
    });
  };

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

  const formuTemizle = () => {
    setData({
      oyunAdi: "",
      gameType: "",
      psType: "2",
      person: "2",
      eaMi: "1",
    });

    setDuzenlenenId(null);
    setMevcutGorsel(null);
    setFiles([]);
    setResetFileUpload(true);
    setTimeout(() => setResetFileUpload(false), 100);
  };

  const oyunDuzenle = (oyun: Oyun) => {
    setDuzenlenenId(oyun.id);
    setData({
      oyunAdi: oyun.oyun_adi,
      gameType: oyun.kategori,
      psType: oyun.cihaz_turu === "ps3" ? "1" : "2",
      person: oyun.kac_kisilik.toString(),
      eaMi: oyun.ea_playde_mi ? "1" : "2",
    });
    setMevcutGorsel(oyun.gorsel);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const oyunKaydet = async () => {
    if (!data.oyunAdi || !data.gameType) {
      showToast("Lütfen oyun adı ve kategori giriniz!", "error");
      return;
    }

    // Yeni görsel varsa base64'e çevir, yoksa mevcut görseli kullan
    let gorselUrl = mevcutGorsel;

    if (files.length > 0) {
      const reader = new FileReader();
      gorselUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(files[0]);
      });
    }

    const oyunData = {
      oyunAdi: data?.oyunAdi,
      cihazTuru: data.psType === "1" ? "ps3" : "ps4-ps5",
      kacKisilik: data.person,
      kategori: data.gameType,
      eaPlaydeMi: data.eaMi,
      gorselUrl,
    };

    if (duzenlenenId) {
      // Güncelleme işlemi
      await serviseGit({
        url: "/api/oyunlar",
        method: "PUT",
        body: { id: duzenlenenId, ...oyunData },
        onSuccess: () => {
          showToast("Oyun güncellendi!", "success");
          formuTemizle();
          oyunlariYukle();
        },
        onError: (error) => {
          showToast(`Güncelleme hatası: ${error.message}`, "error");
        },
      });
    } else {
      // Ekleme işlemi
      await serviseGit({
        url: "/api/oyunlar",
        method: "POST",
        body: oyunData,
        onSuccess: () => {
          showToast("Oyun eklendi!", "success");
          formuTemizle();
          oyunlariYukle();
        },
        onError: (error) => {
          showToast(`Ekleme hatası: ${error.message}`, "error");
        },
      });
    }
  };

  const oyunSil = async (id: number) => {
    await serviseGit({
      url: `/api/oyunlar?id=${id}`,
      method: "DELETE",
      onSuccess: () => {
        showToast("Oyun silme işlemi başarılı.", "success");
        oyunlariYukle();
      },
      onError: (error) => {
        showToast(`Silme hatası: ${error.message}`, "error");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-neutral-600 dark:text-neutral-400 text-3xl font-bold">
            Oyunlar
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Yeni oyun ekle veya mevcut oyunları düzenle.
          </p>
        </div>
       
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
            onValueChange={(e) =>
              setData((prev) => ({
                ...prev,
                gameType: e,
              }))
            }
          />
        </div>

        <div className="lg:col-span-3 xl:col-span-2">
          <Label htmlFor="cihaz" className="mb-1">
            Cihaz Türü
          </Label>
          <SegmentedDep
            data={customPsType}
            value={data.psType}
            onValueChange={(e) =>
              setData((prev) => ({
                ...prev,
                psType: e,
              }))
            }
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
              onValueChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  person: e,
                }))
              }
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
              onValueChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  eaMi: e,
                }))
              }
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
            reset={resetFileUpload}
          />
        </div>

        <div className="lg:col-span-2 xl:col-span-2 lg:self-end flex gap-y-2 gap-x-2 gap-2">
          <Button onClick={oyunKaydet} color="blue" variant="surface">
            {duzenlenenId ? "Güncelle" : "Ekle"}
          </Button>
          {duzenlenenId && (
            <Button onClick={formuTemizle} color="red" variant="surface">
              İptal Et
            </Button>
          )}
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