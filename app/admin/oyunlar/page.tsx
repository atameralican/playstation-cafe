"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  kisiSayisi,
  customPsType,
  evetHayir,
  oyunTurleri,
} from "@/lib/adminPages";
import React, { useState, useEffect, useRef } from "react";
import SegmentedDep from "@/components/ui/segmentedDep";
import SelectBoxDep from "@/components/ui/selectBoxDep";
import GameAddPageCard from "@/components/ui/game-add-card";
import { showToast } from "@/components/ui/alertDep";
import { useServiceHook } from "@/components/useServiceHook/useServiceHook";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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
    gorsel: "",
  });
  const [oyunlar, setOyunlar] = useState<Oyun[]>([]);
  const [duzenlenenId, setDuzenlenenId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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

  const handleFileUpload = async (files: File[]) => {
    let gorselUrl = data?.gorsel;

    if (files.length > 0) {
      const reader = new FileReader();
      gorselUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(files[0]);
      });
      setData((prev) => ({ ...prev, gorsel: gorselUrl }));
    }
  };

  const formuTemizle = () => {
    setData({
      oyunAdi: "",
      gameType: "",
      psType: "2",
      person: "2",
      eaMi: "1",
      gorsel: "",
    });

    setDuzenlenenId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const oyunDuzenle = (oyun: Oyun) => {
    setDuzenlenenId(oyun.id);
    setData({
      oyunAdi: oyun.oyun_adi,
      gameType: oyun.kategori,
      psType: oyun.cihaz_turu === "ps3" ? "1" : "2",
      person: oyun.kac_kisilik.toString(),
      eaMi: oyun.ea_playde_mi ? "1" : "2",
      gorsel: oyun.gorsel || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const oyunKaydet = async () => {
    if (!data.oyunAdi || !data.gameType) {
      showToast("Lütfen oyun adı ve kategori giriniz!", "error");
      return;
    }

    const oyunData = {
      oyunAdi: data?.oyunAdi,
      cihazTuru: data.psType === "1" ? "ps3" : "ps4-ps5",
      kacKisilik: data.person,
      kategori: data.gameType,
      eaPlaydeMi: data.eaMi,
      gorselUrl: data.gorsel,
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

      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-6">
        <div className=" md:col-span-6 lg:col-span-4">
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

        <div className=" md:col-span-6 lg:col-span-3 xl:col-span-2">
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

        <div className=" md:col-span-4 lg:col-span-3 xl:col-span-2">
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

        <div className=" md:col-span-4 lg:col-span-3 xl:col-span-2">
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

        <div className="md:col-span-4 lg:col-span-3 xl:col-span-2">
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

        <div className=" md:col-span-6 lg:col-span-4">
          <Label htmlFor="picture" className="mb-1">
            Cihaz Fotoğrafı
          </Label>
          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              id="gorsel"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const files = e.target.files ? Array.from(e.target.files) : [];
                handleFileUpload(files);
              }}
            />
            {data.gorsel && (
              <HoverCard>
                <HoverCardTrigger>
                  <Button variant="ghost" size="icon">
                    👁️
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="p-2 w-auto">
                  <img
                    src={data.gorsel}
                    alt="Önizleme"
                    className="w-40 h-40 object-cover rounded"
                  />
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        </div>

        <div className=" md:col-span-4 lg:col-span-3 xl:col-span-4  content-end">
          <div className="lg:self-end flex gap-y-2 gap-x-2 gap-2">
            <Button onClick={oyunKaydet} variant="outline">
              {duzenlenenId ? "Güncelle" : "Ekle"}
            </Button>
            {duzenlenenId && (
              <Button onClick={formuTemizle} variant="destructive">
                İptal Et
              </Button>
            )}
          </div>
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
