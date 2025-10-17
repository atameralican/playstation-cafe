"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { psTypes, kasaTipleri } from "@/lib/adminPages";
import React, { useState, useEffect, useRef } from "react";
import SegmentedDep from "@/components/ui/segmentedDep";
import SelectBoxDep from "@/components/ui/selectBoxDep";
import { showToast } from "@/components/ui/alertDep";
import { useServiceHook } from "@/components/useServiceHook/useServiceHook";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import DeleteAlertModal from "@/components/ui/deleteAlertDep";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { MultiSelectRef, TagBoxDep } from "@/components/ui/custom/tagBoxDep";
import { useTheme } from "next-themes";
import { getAgGridTheme } from "@/lib/agGridTheme";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Cihaz {
  id: number;
  created_at: Date;
  updated_at: Date;
  cihaz_turu: string;
  seri_no?: string;
  acilis_hesabi?: string;
  ikinci_hesap?: string;
  kol_iki_mail?: string;
  kasa_tipi?: string;
  aciklama?: string;
  cihaz_fotograf?: string;
  yuklu_oyunlar?: number[];
  ekstra_1?: string;
  ekstra_2?: string;
}

interface Hesap {
  id: number;
  mail: string;
  kullanici_adi: string;
  value?: string;
  label?: string;
}

interface OyunOption {
  value: string;
  label: string;
  id?: number;
  oyun_adi?: string;
  cihaz_turu?: string;
  kategori?: string;
  gorsel?: string;
}

export default function PlaystationlarPage() {
  const { serviseGit } = useServiceHook();
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [duzenlenenId, setDuzenlenenId] = useState<number | null>(null);
  const [cihazList, setCihazList] = useState<Cihaz[]>([]);
  const [hesapList, setHesapList] = useState<
    { label: string; value: string }[]
  >([]);
  const [availableGames, setAvailableGames] = useState<OyunOption[]>([]); // Hesaplardaki oyunlar
   const multiSelectRef = useRef<MultiSelectRef>(null);
  const [data, setData] = useState<Partial<Cihaz>>({
    cihaz_turu: "PS4",
    seri_no: "",
    acilis_hesabi: "",
    ikinci_hesap: "",
    kol_iki_mail: "",
    kasa_tipi: "",
    aciklama: "",
    cihaz_fotograf: "",
    yuklu_oyunlar: [],
  });

  useEffect(() => {
    getCihazlar();
    getHesaplarMiniList();
  }, []);

  // Açılış hesabı veya ikinci hesap değiştiğinde oyunları getir
  useEffect(() => {
    if (data.acilis_hesabi || data.ikinci_hesap) {
      getHesapOyunlari();
    } else {
      // Hiçbir hesap seçili değilse oyun listesini temizle
      setAvailableGames([]);
      setData(prev => ({ ...prev, yuklu_oyunlar: [] }));
         if (multiSelectRef.current) {
      multiSelectRef.current.clear();
    }
    }
  }, [data.acilis_hesabi, data.ikinci_hesap]);

  const temizle = () => {
    setData({
      seri_no: "",
      cihaz_turu: "PS4",
      acilis_hesabi: "",
      ikinci_hesap: "",
      kol_iki_mail: "",
      kasa_tipi: "",
      aciklama: "",
      cihaz_fotograf: "",
      yuklu_oyunlar: [],
    });
    setAvailableGames([]);
     setDuzenlenenId(null);
       if (multiSelectRef.current) {
      multiSelectRef.current.clear();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  //fotoğraf
  const handleFileUpload = async (files: File[]) => {
    let gorselUrl = data?.cihaz_fotograf;

    if (files.length > 0) {
      const reader = new FileReader();
      gorselUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(files[0]);
      });
      setData((prev) => ({ ...prev, cihaz_fotograf: gorselUrl }));
    }
  };

  // ================ SERVICE ISLEMLERI =============
  const getCihazlar = async () => {
    await serviseGit<Cihaz[]>({
      method: "GET",
      url: "/api/cihazlar",
      onSuccess: (data) => {
        console.log("/api/cihazlar: ", data);
        setCihazList(data as Cihaz[]);
      },
      onError: (error) => {
        console.log("/api/cihazlar: ", error.message);
        showToast(`Cihaz Listesi Yüklenemedi:  ${error.message}`, "error");
      },
    });
  };

  const getHesaplarMiniList = async () => {
    await serviseGit<Hesap[]>({
      method: "GET",
      url: "/api/hesaplar/minimal",
      onSuccess: (data) => {
        setHesapList(
          data.map((hesap) => ({
            label: `${hesap.mail} - (${hesap.kullanici_adi})`,
            value: hesap.mail,
          }))
        );
      },
      onError: (error) => {
        console.log("/api/hesaplar/minimal: ", error.message);
        showToast(`Hesap Listesi Yüklenemedi:  ${error.message}`, "error");
      },
    });
  };

  // YENİ FONKSİYON: Seçili hesaplardaki oyunları getir
  const getHesapOyunlari = async () => {
    try {
      await serviseGit<{ oyunlar: OyunOption[], toplamOyun: number }>({
        method: "POST",
        url: "/api/cihazlar/hesap-oyunlari",
        body: {
          acilis_hesabi: data.acilis_hesabi,
          ikinci_hesap: data.ikinci_hesap
        },
        onSuccess: (response) => {
          const { oyunlar } = response as { oyunlar: OyunOption[], toplamOyun: number };
          setAvailableGames(oyunlar || []);
          
          // Mevcut seçili oyunları temizle (yeni hesaptaki oyunlar değişmiş olabilir)
       
    if (!duzenlenenId) {
         setData(prev => ({ ...prev, yuklu_oyunlar: [] }));
             if (multiSelectRef.current) {
      multiSelectRef.current.clear();
    }
    }
          
          if (oyunlar && oyunlar.length > 0) {
            showToast(`${oyunlar.length} oyun bulundu`, "success");
          } else {
            showToast("Seçili hesaplarda oyun bulunamadı", "error");
          }
        },
        onError: (error) => {
          console.log("/api/cihazlar/hesap-oyunlari: ", error.message);
          showToast(`Oyunlar yüklenemedi: ${error.message}`, "error");
          setAvailableGames([]);
        },
      });
    } catch (error) {
      console.error("Hesap oyunları getirilemedi:", error);
      setAvailableGames([]);
    }
  };

const cihazDuzenle = (cihaz: Cihaz) => {
    setDuzenlenenId(cihaz.id);
    setData({

       cihaz_turu: cihaz.cihaz_turu,
        seri_no: cihaz.seri_no || "",
        acilis_hesabi: cihaz.acilis_hesabi || "",
        ikinci_hesap: cihaz.ikinci_hesap || "",
        kol_iki_mail: cihaz.kol_iki_mail || "",
        kasa_tipi: cihaz.kasa_tipi || "",
        aciklama: cihaz.aciklama || "",
        cihaz_fotograf: cihaz.cihaz_fotograf || "",
        yuklu_oyunlar: cihaz.yuklu_oyunlar || [],
    });
    if (multiSelectRef.current) {
    let selectOyunlar:string[]=[]
    if (cihaz.yuklu_oyunlar?.[0]) {
       selectOyunlar=cihaz.yuklu_oyunlar.map((x)=>x.toString())
    }else{
      selectOyunlar=[]
    }
      multiSelectRef.current.setSelectedValues(selectOyunlar);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };



  const cihazEkle = async () => {
    if (!data.cihaz_turu || !data.kasa_tipi) {
      showToast("Lütfen cihaz türü ve kasa tipini giriniz.", "error");
      return;
    }
   const method = duzenlenenId ? "PUT" : "POST";
    const body = duzenlenenId 
      ? { id: duzenlenenId, ...data } 
      : {
        cihaz_turu: data.cihaz_turu,
        seri_no: data.seri_no,
        acilis_hesabi: data.acilis_hesabi,
        ikinci_hesap: data.ikinci_hesap,
        kol_iki_mail: data.kol_iki_mail,
        kasa_tipi: data.kasa_tipi,
        aciklama: data.aciklama,
        cihaz_fotograf: data.cihaz_fotograf,
        yuklu_oyunlar: data.yuklu_oyunlar || [],
      };
      await serviseGit({
      url: "/api/cihazlar",
      method: method,
      body: body,
      onSuccess: () => {
        showToast(
                  duzenlenenId ? "Cihaz güncellendi!" : "Cihaz eklendi!",
                  "success"
                );
        temizle();
        getCihazlar();
      },
      onError: (error) => {
        showToast(`${duzenlenenId ? "Güncelleme" : "Ekleme"} hatası: ${error.message}`, "error");
              },
            });
          };

  const cihazSil = async (id: number) => {
    if (!id) {
      showToast("Geçersiz cihaz idsi.", "error");
      return;
    }
    await serviseGit({
      url: `/api/cihazlar/${id}`,
      method: "DELETE",
      onSuccess: () => {
        showToast("Cihaz silindi!", "success");
        getCihazlar();
      },
      onError: (error) => {
        showToast(`Silme hatası: ${error.message}`, "error");
        console.log("api/cihazlar/[id]-DELETE: ", error.message);
      },
    });
  };

  // ========== DATAGRID ==============
  const colDefs: ColDef<Cihaz>[] = [
    { field: "cihaz_turu", headerName: "Cihaz Türü", filter: true },
    { field: "kasa_tipi", headerName: "Kasa Tipi", filter: true },
    { field: "seri_no", headerName: "Seri No", filter: false, width: 250 },
    {
      minWidth: 250,
      field: "acilis_hesabi",
      headerName: "Açılış Hesabı",
      filter: true,
    },
    {
      minWidth: 250,
      field: "ikinci_hesap",
      headerName: "Ekür Hesap",
      filter: true,
    },
    { field: "kol_iki_mail", headerName: "Kol İki Mail" },
    { 
      field: "yuklu_oyunlar", 
      headerName: "Yüklü Oyun Sayısı",
      valueFormatter: (params) => {
        const oyunlar = params.value as number[] | undefined;
        return oyunlar ? `${oyunlar.length} oyun` : "0 oyun";
      },
      width: 150 
    },
    { field: "aciklama", headerName: "Açıklama" },
    {
      headerName: "Sil",
      cellRenderer: (params: { data: Cihaz }) => {
        return (
          <div className="flex items-center justify-center w-full h-full">
            <DeleteAlertModal onClick={() => cihazSil(params.data.id)} />
          </div>
        );
      },
      width: 60,
      // pinned: "right",
    },
     {
          headerName: "İşlemler",
          cellRenderer: (params: { data: Cihaz }) => {
            return (
              <div className="flex items-center justify-center gap-1 h-full">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => cihazDuzenle(params.data)}
                >
                  ✏️
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => cihazSil(params.data.id)}
                >
                  🗑️
                </Button>
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
    flex: 1,
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-neutral-600 dark:text-neutral-400 text-3xl font-bold">
            Cihazlar
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Yeni playstation ekleme ve silme.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 gap-x-4 gap-y-6">
        <div className="md:col-span-6 lg:col-span-3 xl:col-span-2">
          <Label htmlFor="cihazTuru" className="mb-1">
            Cihaz Türü
          </Label>
          <SegmentedDep
            data={psTypes}
            value={data?.cihaz_turu}
            onValueChange={(e) =>
              setData((prev) => ({
                ...prev,
                cihaz_turu: e,
              }))
            }
            radius="full"
            size="2"
          />
        </div>
        <div className="md:col-span-6  lg:col-span-3 xl:col-span-2">
          <Label htmlFor="kasatipi" className="mb-1">
            Kasa Tipi
          </Label>
          <SelectBoxDep
            data={kasaTipleri}
            value={data?.kasa_tipi || ""}
            placeholder="Seçiniz"
            onValueChange={(e) =>
              setData((prev) => ({
                ...prev,
                kasa_tipi: e,
              }))
            }
          />
        </div>
        <div className="md:col-span-6  lg:col-span-6 xl:col-span-4">
          <Label htmlFor="serino" className="mb-1">
            Seri No
          </Label>
          <Input
            type="text"
            id="serino"
            value={data.seri_no || ""}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                seri_no: e.target.value,
              }))
            }
            placeholder="Seri No"
          />
        </div>
        <div className="md:col-span-6  lg:col-span-6 xl:col-span-4">
          <Label htmlFor="acilisHesabi" className="mb-1">
            Açılış Hesabı
          </Label>
          <SelectBoxDep
            data={hesapList}
            value={data.acilis_hesabi || ""}
            placeholder="Seçiniz"
            onValueChange={(e) =>
              setData((prev) => ({
                ...prev,
                acilis_hesabi: e,
              }))
            }
          />
        </div>
        <div className="md:col-span-6  lg:col-span-6 xl:col-span-4">
          <Label htmlFor="kardesHesap" className="mb-1">
            2. Hesap
          </Label>
          <SelectBoxDep
            data={hesapList}
            value={data?.ikinci_hesap || ""}
            placeholder="Seçiniz"
            onValueChange={(e) =>
              setData((prev) => ({
                ...prev,
                ikinci_hesap: e,
              }))
            }
          />
        </div>
        <div className="md:col-span-6  lg:col-span-4 xl:col-span-4">
          <Label htmlFor="kolikimail" className="mb-1">
            Kol İki Mail
          </Label>
          <Input
            type="mail"
            id="kolikimail"
            value={data.kol_iki_mail}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                kol_iki_mail: e.target.value,
              }))
            }
            placeholder="Kol İki Mail"
          />
        </div>

        <div className="md:col-span-6  lg:col-span-4 xl:col-span-4 ">
          <Label htmlFor="oyunlar" className="mb-1">
            Yüklü Oyunlar {availableGames.length > 0 && `(${availableGames.length} oyun mevcut)`}
          </Label>
          <TagBoxDep
            ref={multiSelectRef}
            options={availableGames}
            onValueChange={(value) =>
              setData((prev) => ({
                ...prev,
                yuklu_oyunlar: value.map((v) => Number(v)),
              }))
            }
            placeholder={
              !data.acilis_hesabi && !data.ikinci_hesap 
                ? "Önce hesap seçiniz..." 
                : availableGames.length === 0 
                  ? "Seçili hesaplarda oyun yok..." 
                  : "Oyun Seçiniz..."
            }
            className="w-full"
            value={data.yuklu_oyunlar?.map(String) || []}
            maxCount={4}
            disabled={availableGames.length === 0}
          />
        </div>

        <div className="md:col-span-6 lg:col-span-4 xl:col-span-4">
          <Label htmlFor="aciklama" className="mb-1">
            Açıklama
          </Label>
          <Input
            type="text"
            id="aciklama"
            value={data.aciklama}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                aciklama: e.target.value,
              }))
            }
            placeholder="Açıklama"
          />
        </div>
        <div className="md:col-span-6  lg:col-span-4">
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
            {data.cihaz_fotograf && ( 
              <HoverCard>
                <HoverCardTrigger>
                  <Button variant="ghost" size="icon">
                    👁️
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="p-2 w-auto">
                  <img
                    src={data.cihaz_fotograf}
                    alt="Önizleme"
                    className="w-40 h-40 object-cover rounded"
                  />
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        </div>
        <div className="md:col-span-6  lg:col-span-2 xl:col-span-1 content-end">
          <div className="flex gap-2">
                      <Button onClick={cihazEkle} variant="outline" size={"lg"}>
                        {duzenlenenId ? "Güncelle" : "Ekle"}
                      </Button>
                      {duzenlenenId && (
                        <Button onClick={temizle} variant="destructive" size={"lg"}>
                          İptal
                        </Button>
                      )}
                    </div>
        </div>
      </div>

      <hr className="my-8 w-full" />
      <h3 className="font-bold">Playstation (Cihaz) Listesi ({cihazList.length})</h3>
      <div 
        className="pb-5"
        style={{ width: "100%", height: "500px" }}
      >
        <AgGridReact
          theme={getAgGridTheme(theme === "dark")}
          rowData={cihazList}
          columnDefs={colDefs}
          onGridReady={(params) => params.api.autoSizeAllColumns()}
          onGridSizeChanged={(params) => params.api.autoSizeAllColumns()}
          // defaultColDef={defaultColDef}
          //rowSelection="single"
        />
      </div>
    </div>
  );
}
