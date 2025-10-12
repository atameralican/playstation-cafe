"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {  evetHayir,} from "@/lib/adminPages";
import React, { useState, useEffect } from "react";
import SegmentedDep from "@/components/ui/segmentedDep";
import { showToast } from "@/components/ui/alertDep";
import { useServiceHook } from "@/components/useServiceHook/useServiceHook";
import { Button } from "@radix-ui/themes";
import { DatePickerDep } from "@/components/ui/custom/datePickerDep";

interface Hesap {
  id: number;
  mail: string; //
  mail_sifre?: string | null; //
  kullanici_adi: string; //
  ea_play_varmi?: boolean | false; //
  ea_play_alinma_tarihi?: Date | null; //
  ea_play_bitis_tarihi?: Date | null; //
  oyunlar?: number[] | null; //
  is_deleted?: boolean | null; //
  deleted_at?: string | null;
  deleted_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

interface Oyun {
  id: number;
  oyun_adi: string;
}

export default function HesaplarPage() {
  const { serviseGit } = useServiceHook();

  const [gameList, setGameList] = useState<
    Array<{ id: number; label: string }>
  >([]);

  const [data, setData] = useState<Partial<Hesap>>({
    mail: "",
    kullanici_adi: "",
    ea_play_alinma_tarihi: undefined,
    ea_play_bitis_tarihi: undefined,
    oyunlar: [],
  });

  useEffect(() => {
    getHesaplar();
    getOyunList();
  }, []);

  const getHesaplar = async () => {
    await serviseGit<Hesap[]>({
      url: "/api/hesaplar",
      onSuccess: (data) => {
        console.log("data", data);
      },
      onError: (error) => {
        showToast(`Hesaplar yüklenemedi: ${error.message}`, "error");
      },
    });
  };
  // Oyunlar listesi gelecek. sadece id ve ismi geliyor. 
  const getOyunList = async () => {
    await serviseGit<Oyun[]>({
      url: "/api/oyunlar/minimal",
      onSuccess: (data) => {
        const typedData = data as Oyun[];
        setGameList(
          typedData.map((game) => ({
            id: game.id,
            label: game.oyun_adi,
          }))
        );
      },
      onError: (error) => {
        showToast(`Hesaplar yüklenemedi: ${error.message}`, "error");
      },
    });
  };

  const hesapEkle = async () => {
    if (!data.mail || !data.kullanici_adi) {
      showToast("Lütfen tüm zorunlu alanları doldurun.", "error");
      return;
    }
    await serviseGit({
      url: "/api/hesaplar",
      method: "POST",
      body: {
        mail: data.mail,
        kullanici_adi: data.kullanici_adi,
        ea_play_alinma_tarihi:
          data.ea_play_alinma_tarihi?.toISOString().split("T")[0] || null,
        ea_play_bitis_tarihi:
          data.ea_play_bitis_tarihi?.toISOString().split("T")[0] || null,
      },
      onSuccess: () => {
        showToast("Hesap eklendi!", "success");
      },
      onError: (error) => {
        showToast(`Ekleme hatası: ${error.message}`, "error");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-neutral-600 dark:text-neutral-400 text-3xl font-bold">
            Hesaplar
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Yeni hesap ekleme ve silme.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-x-4 gap-y-6">
        <div className="lg:col-span-3 xl:col-span-2">
          <Label htmlFor="oyunAdi" className="mb-1">
            Mail
          </Label>
          <Input
            type="email"
            id="mail"
            value={data.mail}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                mail: e.target.value,
              }))
            }
            placeholder="Mail"
          />
        </div>

        <div className="lg:col-span-3 xl:col-span-2">
          <Label htmlFor="kullaniciAdi" className="mb-1">
            Kullanıcı Adı
          </Label>
          <Input
            type="text"
            id="kullaniciAdi"
            value={data.kullanici_adi || ""}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                kullanici_adi: e.target.value,
              }))
            }
            placeholder="Kullanıcı Adı"
          />
        </div>

        <div className="lg:col-span-3 xl:col-span-2">
          <Label htmlFor="sifre" className="mb-1">
            Şifre
          </Label>
          <Input
            type="password"
            id="sifre"
            value={data.mail_sifre || ""}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                mail_sifre: e.target.value,
              }))
            }
            placeholder="Hesap Şifresi"
          />
        </div>

        <div className="lg:col-span-3 xl:col-span-2">
          <Label htmlFor="oyunlar" className="mb-1">
            Oyunlar
          </Label>
         
        </div>
        <div></div>

        <div className="lg:col-span-3 xl:col-span-2">
          <Label htmlFor="eaplay" className="mb-1">
            EaPlay Var Mı?
          </Label>
          <SegmentedDep
            data={evetHayir}
            value={data.ea_play_varmi ? "1" : "2"}
            onValueChange={(e) =>
              setData((prev) => ({
                ...prev,
                ea_play_varmi: e === "1" ? true : false,
              }))
            }
            radius="full"
            size="2"
          />
        </div>

        <div className="lg:col-span-3 xl:col-span-2">
          <Label htmlFor="eaPlayBaslangic" className="mb-1">
            EaPlay Alınma Tarihi
          </Label>
          <DatePickerDep
            value={data.ea_play_alinma_tarihi}
            onValueChange={(date) =>
              setData({ ...data, ea_play_alinma_tarihi: date })
            }
            placeholder="Tarih seçin"
          />
        </div>

        <div className="lg:col-span-3 xl:col-span-2">
          <Label htmlFor="eaPlayBitis" className="mb-1">
            EaPlay Bitiş Tarihi
          </Label>
          <DatePickerDep
            value={data.ea_play_bitis_tarihi}
            onValueChange={(date) =>
              setData({ ...data, ea_play_bitis_tarihi: date })
            }
            placeholder="Tarih seçin"
          />
        </div>

        <div className="lg:col-span-2 xl:col-span-2 lg:self-end flex gap-y-2 gap-x-2 gap-2">
          <Button onClick={hesapEkle} color="blue" variant="surface">
            Ekle
          </Button>
        </div>
      </div>

      <hr className="my-8" />
    </div>
  );
}
