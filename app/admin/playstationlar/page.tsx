"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  kisiSayisi,
  customPsType,
  evetHayir,
  oyunTurleri,
  psTypes,
  kasaTipleri,
} from "@/lib/adminPages";
import React, { useState, useEffect } from "react";
import SegmentedDep from "@/components/ui/segmentedDep";
import { FileUpload } from "@/components/ui/admin-file-upload";
import SelectBoxDep from "@/components/ui/selectBoxDep";
import GameAddPageCard from "@/components/ui/game-add-card";
import { showToast } from "@/components/ui/alertDep";
import { useServiceHook } from "@/components/useServiceHook/useServiceHook";
import { Button } from "@radix-ui/themes";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

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
  ekstra_1?: string;
  ekstra_2?: string;
}

interface Hesap {
  id: number;
  mail: string;
kullanici_adi: string;
}

export default function PlaystationlarPage() {
  // ekran ilk açılacak  hem cşhazlar hemde hesaplar minimal gelecek. hesaplar birde kaydetme işleminde tekrar gelecek. 
  //yine tablo olarak göstermek mantıklı. tabloda fotograf gosterebiliyorsun sonucta
  //post service için birtane useeffect lazım data adında ve interface ister oda
  //1. hesap mail 2. hesap mail file uploader ekle butonu kaldı

  const { serviseGit } = useServiceHook();
    const [resetFileUpload, setResetFileUpload] = useState(false);
  const [cihazList, setCihazList] = useState<Cihaz[]>([]);
  const [hesapList, setHesapList] = useState<Hesap[]>([]);
  const [data, setData] = useState<Partial<Cihaz>>({
    cihaz_turu: "PS4",
    seri_no: "",
    acilis_hesabi: "",
    ikinci_hesap: "",
    kol_iki_mail: "",
    kasa_tipi: "",
    aciklama: "",
    cihaz_fotograf: "",
  });

  useEffect(() => {
    getCihazlar();
    getHesaplarMiniList();
  }, []);

const temizle=()=>{
  setData({
    seri_no: "",
    acilis_hesabi: "",
    ikinci_hesap: "",
    kol_iki_mail: "",
    kasa_tipi: "",
    aciklama: "",
    cihaz_fotograf: "",
  });
  setResetFileUpload(true);
  setTimeout(() => setResetFileUpload(false), 100);
}

  //fotoğraf
  const handleFileUpload = async(files: File[]) => {
    let gorselUrl = data?.cihaz_fotograf ;

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
  const getCihazlar=async()=>{
     await serviseGit<Cihaz[]>({
      method: "GET",
          url: "/api/cihazlar",
          onSuccess: (data) => {
            console.log("/api/cihazlar: ", data);
            setCihazList(data as Cihaz[]);
          },
          onError: (error) => {
            console.log("/api/cihazlar: ",error.message)
            showToast(`Cihaz Listesi Yüklenemedi:  ${error.message}`, "error");
          },
        });
  }

    const getHesaplarMiniList=async()=>{
     await serviseGit<Hesap[]>({
      method: "GET",
          url: "/api/hesaplar/minimal",
          onSuccess: (data) => {
            console.log("/api/hesaplar/minimal:", data);
            setHesapList(data as Hesap[]);
          },
          onError: (error) => {
            console.log("/api/hesaplar/minimal: ",error.message)
            showToast(`Hesap Listesi Yüklenemedi:  ${error.message}`, "error");
          },
        });
  };

  const cihazEkle = async () => {
      if (!data.cihaz_turu || !data.kasa_tipi ) {
        showToast("Lütfen cihaz türü ve kasa tipini giriniz.", "error");
        return;
      }
      await serviseGit({
        url: "/api/cihazlar",
        method: "POST",
        body: {
          cihaz_turu: data.cihaz_turu,
          seri_no: data.seri_no,
          acilis_hesabi: data.acilis_hesabi,
          ikinci_hesap: data.ikinci_hesap,
          kol_iki_mail: data.kol_iki_mail,
          kasa_tipi: data.kasa_tipi,
          aciklama: data.aciklama,
          cihaz_fotograf: data.cihaz_fotograf,
        },
        onSuccess: () => {
          showToast("Cihaz eklendi!", "success");
          temizle();
          getCihazlar();
        },
        onError: (error) => {
          showToast(`Ekleme hatası: ${error.message}`, "error");
          console.log("api/cihazlar-POST: ",error.message)
        },
      });
    };

  // ========== DATAGRID ==============
  const colDefs: ColDef<Cihaz>[] = [
    { field: "cihaz_turu", headerName: "Cihaz Türü", filter: true },
    { field: "kasa_tipi",headerName: "Kasa Tipi" , filter: true },
    { field: "seri_no", headerName: "Seri No", filter: false },
    { field: "acilis_hesabi",  headerName: "Açılış Hesabı" , filter: true },
    { field: "ikinci_hesap",  headerName: "Ekür Hesap" , filter: true },
    { field: "kol_iki_mail", headerName: "Kol İki Mail" },
    { field: "aciklama", headerName: "Açıklama" }, 
  ]

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

      <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-x-4 gap-y-6">
        <div className="lg:col-span-4 xl:col-span-3">
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
        <div className="lg:col-span-4 xl:col-span-3">
          <Label htmlFor="kasatipi" className="mb-1">
            Kasa Tipi
          </Label>
          <SelectBoxDep
            data={kasaTipleri}
            value={data?.kasa_tipi||""}
            placeholder="Seçiniz"
            onValueChange={(e) =>
              setData((prev) => ({
                ...prev,
                kasa_tipi: e,
              }))
            }
          />
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
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
        <div className="lg:col-span-4 xl:col-span-3">
          <Label htmlFor="acilisHesabi" className="mb-1">
            Açılış Hesabı
          </Label>
          <SelectBoxDep
            data={hesapList}
            value={data.acilis_hesabi || ""}
            labelKey="mail"
            valueKey="mail"
            placeholder="Seçiniz"
          onValueChange={(e) =>
            setData((prev) => ({
              ...prev,
              acilis_hesabi: e,
            }))
          }
          />
        </div>
        <div className="lg:col-span-4 xl:col-span-3">
          <Label htmlFor="kardesHesap" className="mb-1">
            2. Hesap
          </Label>
          <SelectBoxDep
            data={hesapList}
            value={data?.ikinci_hesap || ""}
            labelKey="mail"
            valueKey="mail"
            placeholder="Seçiniz"
          onValueChange={(e) =>
            setData((prev) => ({
              ...prev,
              ikinci_hesap: e,
            }))
          }
          />
        </div>
        <div className="lg:col-span-4 xl:col-span-3">
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
        <div className="lg:col-span-5 xl:col-span-4">
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
        <div className="lg:col-span-4 xl:col-span-3">
          <Label htmlFor="gorsel" className="mb-1">
            Cihaz Fotoğrafı
          </Label>
          <FileUpload
            single
            onChange={handleFileUpload}
            reset={resetFileUpload}
          />
        </div>
        <div className="lg:col-span-2 xl:col-span-1">
          <Button
            onClick={cihazEkle} 
            color="blue" variant="surface">
            Ekle
          </Button>
        </div>

      </div>

      <hr className="my-8 w-full" />
            <h3 className="font-bold">PSN Hesapları Listesi</h3>
            <div style={{ width: "100%", height: "500px" }} className="pb-5">
              <AgGridReact
                rowData={cihazList}
                columnDefs={colDefs}
                // defaultColDef={defaultColDef}
              />
            </div>
    </div>
  );
}