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
import { showToast } from "@/components/ui/alertDep";
import { useServiceHook } from "@/components/useServiceHook/useServiceHook";
import { Button } from "@/components/ui/button";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import defaultImg from "@/public/logo.png"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";
import DeleteAlertModal from "@/components/ui/deleteAlertDep";
import { useTheme } from "next-themes";
import { getAgGridTheme } from "@/lib/agGridTheme";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Oyun {
  id: number;
  created_at: string;
  oyun_adi: string;
  cihaz_turu: string;
  kac_kisilik: number;
  kategori: string;
  ea_playde_mi: boolean;
  gorsel: string | null;
  aciklama?: string;
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
  const { theme } = useTheme();

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

  // ========== DATAGRID ==============
  const colDefs: ColDef<Oyun>[] = [
    {
      headerName: "Oyun",
      field: "oyun_adi",
      cellRenderer: (params: { data: Oyun }) => {
        return (
          <div className="flex items-center gap-3 py-2">
            {/* Modern görsel container */}
            <div className="relative overflow-hidden rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <Image
                src={params.data.gorsel || defaultImg}
                alt={params.data.oyun_adi}
                width={48}
                height={48}
                className="w-12 h-12 object-cover"
              />
            </div>
            
            {/* Oyun bilgileri */}
            <div className="flex flex-col">
              <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                {params.data.oyun_adi}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {params.data.cihaz_turu.toLocaleUpperCase()}
                </span>
                {params.data.ea_playde_mi && (
                  <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/20 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                    EA Play
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      },
      minWidth: 280,
      flex: 2,
      filter: true,
    },
    { 
      field: "kategori", 
      headerName: "Kategori",
      cellRenderer: (params: { data: Oyun }) => {
        return (
          <span className="inline-flex items-center rounded-lg bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-400">
            {params.data.kategori}
          </span>
        );
      },
      minWidth: 120,
      filter: true 
    },
    { 
      field: "kac_kisilik", 
      headerName: "Kişi Sayısı",
      cellRenderer: (params: { data: Oyun }) => {
        const kisiIcon = params.data.kac_kisilik === 1 ? "👤" : "👥";
        return (
          <div className="flex items-center gap-1.5">
            <span className="text-base">{kisiIcon}</span>
            <span className="font-medium">{params.data.kac_kisilik} Kişilik</span>
          </div>
        );
      },
      minWidth: 100,
      filter: true 
    },
    { 
      field: "aciklama", 
      headerName: "Açıklama",
      cellRenderer: (params: { data: Oyun }) => {
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {params.data.aciklama || "—"}
          </span>
        );
      },
      flex: 1,
      minWidth: 150,
      filter: true 
    },
    {
      headerName: "İşlemler",
      cellRenderer: (params: { data: Oyun }) => {
        return (
          <div className="flex items-center justify-center gap-1 h-full">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              onClick={() => oyunDuzenle(params.data)}
            >
              <Pencil className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </Button>
            <DeleteAlertModal 
              onClick={() => oyunSil(params.data.id)}
              
            />
          </div>
        );
      },
      width: 100,
      pinned: "right",
      sortable: false,
      filter: false,
    },
  ];

  const defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
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
            Oyun Görseli
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
                    className="w-40 h-40 object-cover rounded-lg"
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
        
        <div 
          className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
          style={{ width: "100%", height: "500px" }}
        >
          <AgGridReact
            theme={getAgGridTheme(theme === "dark")}
            rowData={oyunlar}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            onGridReady={(params) => {
              params.api.sizeColumnsToFit();
            }}
            onGridSizeChanged={(params) => {
              params.api.sizeColumnsToFit();
            }}
            rowHeight={68}
            animateRows={true}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50]}
          />
        </div>
      </div>
    </div>
  );
}