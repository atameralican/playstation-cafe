"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { evetHayir } from "@/lib/adminPages";
import React, { useState, useEffect } from "react";
import SegmentedDep from "@/components/ui/segmentedDep";
import { showToast } from "@/components/ui/alertDep";
import { useServiceHook } from "@/components/useServiceHook/useServiceHook";
import { Button } from "@/components/ui/button";
import { DatePickerDep } from "@/components/ui/custom/datePickerDep";
import { TagBoxDep } from "@/components/ui/custom/tagBoxDep";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useTheme } from "next-themes";
import { getAgGridTheme } from "@/lib/agGridTheme";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Hesap {
  id: number;
  mail: string;
  mail_sifre?: string | null;
  kullanici_adi: string;
  ea_play_varmi?: boolean | false;
  ea_play_alinma_tarihi?: Date | null;
  ea_play_bitis_tarihi?: Date | null;
  oyunlar?: number[] | null;
  oyun_detaylari?: Array<{ id: number; oyun_adi: string } | null>;
  is_deleted?: boolean | null;
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
  const { theme } = useTheme();
  const [hesapList, setHesapList] = useState<Hesap[]>([]);
  const [formKey, setFormKey] = useState(0); // tagbox içini boşaltabilmek için
  const [gameList, setGameList] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [data, setData] = useState<Partial<Hesap>>({
    mail: "",
    kullanici_adi: "",
    mail_sifre: "",
    ea_play_varmi: false,
    ea_play_alinma_tarihi: undefined,
    ea_play_bitis_tarihi: undefined,
    oyunlar: [],
  });

  // sayfa açılır açılmaz veriler gelsin
  useEffect(() => {
    getHesaplar();
    getOyunList();
  }, []);

  const temizle = () => {
    setData((prev) => ({
      ...prev,
      mail: "",
      kullanici_adi: "",
      mail_sifre: "",
      ea_play_alinma_tarihi: undefined,
      ea_play_bitis_tarihi: undefined,
      oyunlar: [],
    }));
    setFormKey((prev) => prev + 1);
  };
  // ========== DATAGRID ==============
  const colDefs: ColDef<Hesap>[] = [
    { field: "mail", headerName: "Mail Adresi", filter: true },
    { field: "kullanici_adi", headerName: "Kullanıcı Adı", filter: true },
    {
      field: "ea_play_varmi",
      filter: "agNumberColumnFilter",
      headerName: "EAPlay",
    },
    {
      field: "ea_play_alinma_tarihi",
      filter: "agDateColumnFilter",
      headerName: "EAPlay Alınma T.",
    },
    {
      field: "ea_play_bitis_tarihi",
      filter: "agDateColumnFilter",
      headerName: "EAPlay Bitiş T.",
    },
    {
      field: "oyun_detaylari",
      headerName: "Oyunlar",
      filter: true,
      valueFormatter: (params) => {
        const oyunlar = params.value as
          | Array<{ id: number; oyun_adi: string }>
          | undefined;
        return oyunlar?.map((oyun) => oyun.oyun_adi).join(", ") || "";
      },
    },
  ];

  const defaultColDef: ColDef = {
    flex: 1,
  };

  // ========== SERVICE ==============

  // Hesapları getirme
  const getHesaplar = async () => {
    await serviseGit<Hesap[]>({
      url: "/api/hesaplar",
      onSuccess: (data) => {
        console.log("data", data);
        setHesapList(data as Hesap[]);
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
            label: game.oyun_adi,
            value: game.id.toString(),
          }))
        );
      },
      onError: (error) => {
        showToast(`Hesaplar yüklenemedi: ${error.message}`, "error");
      },
    });
  };

  // Yeni hesap ekleme
  const hesapEkle = async () => {
    if (
      !data.mail ||
      !data.kullanici_adi ||
      !data.oyunlar ||
      data.oyunlar.length === 0
    ) {
      showToast("Lütfen tüm zorunlu alanları doldurun.", "error");
      return;
    }
    await serviseGit({
      url: "/api/hesaplar",
      method: "POST",
      body: {
        mail: data.mail,
        kullanici_adi: data.kullanici_adi,
        mail_sifre: data.mail_sifre || null,
        ea_play_varmi: data.ea_play_varmi,
        ea_play_alinma_tarihi:
          data.ea_play_alinma_tarihi?.toLocaleDateString().split("T")[0] ||
          null,
        ea_play_bitis_tarihi:
          data.ea_play_bitis_tarihi?.toLocaleDateString().split("T")[0] || null,
        oyunlar: data.oyunlar,
      },
      onSuccess: () => {
        showToast("Hesap eklendi!", "success");
        temizle();
        getHesaplar();
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

      <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 gap-x-4 gap-y-6">
        <div className="md:col-span-4 lg:col-span-3 xl:col-span-2">
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

        <div className="md:col-span-4 lg:col-span-3 xl:col-span-2">
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

        <div className="md:col-span-4 lg:col-span-3 xl:col-span-2">
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

        <div className="md:col-span-4 lg:col-span-3 xl:col-span-2">
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

        <div className="md:col-span-4 lg:col-span-3 xl:col-span-2">
          <Label htmlFor="eaPlayBaslangic" className="mb-1">
            EaPlay Alınma Tarihi
          </Label>
          <DatePickerDep
            value={data.ea_play_alinma_tarihi}
            disabled={!data.ea_play_varmi}
            onValueChange={(date) => {
              setData({ ...data, ea_play_alinma_tarihi: date });
            }}
            placeholder="Tarih seçin"
          />
        </div>

        <div className="md:col-span-4 lg:col-span-3 xl:col-span-2">
          <Label htmlFor="eaPlayBitis" className="mb-1">
            EaPlay Bitiş Tarihi
          </Label>
          <DatePickerDep
            value={data.ea_play_bitis_tarihi}
            disabled={!data.ea_play_varmi}
            onValueChange={(date) =>
              setData({ ...data, ea_play_bitis_tarihi: date })
            }
            placeholder="Tarih seçin"
          />
        </div>

        <div className="md:col-span-8 lg:col-span-5 ">
          <Label htmlFor="oyunlar" className="mb-1">
            Oyunlar
          </Label>
          <TagBoxDep
            key={formKey}
            options={gameList}
            onValueChange={(value) =>
              setData((prev) => ({
                ...prev,
                oyunlar: value.map((v) => Number(v)),
              }))
            }
            placeholder="Oyun Seçiniz..."
            className="w-full "
            value={data.oyunlar?.map(String) || []}
            maxCount={4}
          />
        </div>

        <div className="md:col-span-4  lg:col-span-2 xl:col-span-1 content-end">
          <Button onClick={hesapEkle} variant="outline" size={"lg"}>
            Ekle
          </Button>
        </div>
      </div>

      <hr className="my-8 w-full" />
      <h3 className="font-bold">PSN Hesapları Listesi</h3>
      <div 
        className="pb-5"
        style={{ width: "100%", height: "500px" }}
      >
        <AgGridReact
          theme={getAgGridTheme(theme === "dark")}
          rowData={hesapList}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          //onGridReady={(params) => params.api.autoSizeAllColumns()}
          //onGridSizeChanged={(params) => params.api.autoSizeAllColumns()}
        />
      </div>
    </div>
  );
}
