"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import SelectBoxDep from "@/components/ui/selectBoxDep";
import { tvBoyutlari, tvMarkalari } from "@/lib/adminPages";
import { Checkbox } from "@radix-ui/themes";
import { useServiceHook } from "@/components/useServiceHook/useServiceHook";
import { showToast } from "@/components/ui/alertDep";
import DeleteAlertModal from "@/components/ui/deleteAlertDep";
import { useTheme } from "next-themes";
import { getAgGridTheme } from "@/lib/agGridTheme";
ModuleRegistry.registerModules([AllCommunityModule]);
interface TV {
  id: number;
  created_at: Date;
  updated_at: Date;
  marka: string;
  model: string | null;
  seriNo: string | null;
  boyut: string;
  garanti: boolean | false;
  ariza: boolean | false;
  aciklama: string | null;
  tv_fotograf: string | null;
  ekstra_1?: string;
  ekstra_2?: string;
}

export default function TelevizyonlarPage() {
  const { serviseGit } = useServiceHook();
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [tvList, setTvList] = useState<TV[]>([]);
  const [data, setData] = useState<Partial<TV>>({
    marka: "",
    model: "",
    seriNo: "",
    boyut: "",
    garanti: false,
    ariza: false,
    aciklama: "",
    tv_fotograf: "",
  });

  const temizle = () => {
    setData((prev) => ({
      ...prev,
      marka: "",
      model: "",
      seriNo: "",
      boyut: "",
      garanti: false,
      ariza: false,
      aciklama: "",
      tv_fotograf: "",
    }));

    // setDuzenlenenId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    tvGetir();
  }, []);
  //fotoğraf
  const handleFileUpload = async (files: File[]) => {
    let gorselUrl = data?.tv_fotograf;

    if (files.length > 0) {
      const reader = new FileReader();
      gorselUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(files[0]);
      });
      setData((prev) => ({ ...prev, tv_fotograf: gorselUrl }));
    }
  };
  //============ services =============
  const tvGetir = async () => {
    await serviseGit<TV[]>({
      method: "GET",
      url: "/api/televizyonlar",
      onSuccess: (res) => {
        if (res[0]) {
          setTvList(res as TV[]);
        } else {
          showToast("Ekli televizyon bulunamadı", "error");
        }
      },
      onError(error) {
        console.log("/api/televizyonlar: ", error.message);
        showToast(`Televizyonlar getirilemedi: ${error}`, "error");
      },
    });
  };

  const tvEkle = async () => {
    if (!data.marka || !data.boyut) {
      showToast("Lütfen marka ve model bilgisi giriniz.", "error");
      return;
    }
    serviseGit({
      method: "POST",
      url: "/api/televizyonlar",
      body: {
        marka: data.marka,
        model: data.model,
        seriNo: data.seriNo,
        boyut: data.boyut,
        garanti: data.garanti,
        ariza: data.ariza,
        aciklama: data.aciklama,
        tv_fotograf: data.tv_fotograf,
      },
      onSuccess: () => {
        showToast("Televizyon başarıyla eklendi", "success");
        tvGetir();
        temizle();
      },
      onError: (error) => {
        showToast(`Ekleme hatası: ${error.message}`, "error");
      },
    });
  };

  const tvSil = async (id: number) => {
    if (!id) {
      showToast("Geçersiz TV idsi.", "error");
      return;
    }
    await serviseGit({
      url: `/api/televizyonlar/${id}`,
      method: "DELETE",
      onSuccess: () => {
        showToast("TV silindi!", "success");
        tvGetir();
      },
      onError: (error) => {
        showToast(`Silme hatası: ${error.message}`, "error");
        console.log("api/televizyonlar/[id]-DELETE: ", error.message);
      },
    });
  };

  // ========== DATAGRID ==============
  const colDefs: ColDef<TV>[] = [
    { field: "marka", headerName: "Marka", filter: true, minWidth: 150 },
    { field: "model", headerName: "Model", filter: false, minWidth: 150 },
    { field: "seriNo", headerName: "Seri No", filter: false, minWidth: 200 },
    {
      field: "boyut",
      headerName: "Boyut",
      filter: true,
    },
    {
      field: "garanti",
      headerName: "Garanti",
      filter: true,
    },
    { field: "ariza", headerName: "Arıza" },
    { field: "aciklama", headerName: "Açıklama", minWidth: 200 },
    {
      headerName: "Sil",
      cellRenderer: (params: { data: TV }) => {
        return (
          <div className="flex items-center justify-center w-full h-full">
            <DeleteAlertModal onClick={() => tvSil(params.data.id)} />
          </div>
        );
      },
      width: 60,
      // pinned: "right",
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
            Televizyonlar
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Yeni televizyon ekleme ve televizyonları görüntüleme sayfası
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 gap-x-4 gap-y-6">
        <div className="md:col-span-4 lg:col-span-3 xl:col-span-2">
          <Label htmlFor="marka" className="mb-1">
            Marka
          </Label>
          <SelectBoxDep
            data={tvMarkalari}
            value={data?.marka || ""}
            placeholder="Seçiniz"
            onValueChange={(e) =>
              setData((prev) => ({
                ...prev,
                marka: e,
              }))
            }
          />
        </div>

        <div className="md:col-span-4 lg:col-span-3 xl:col-span-2">
          <Label htmlFor="model" className="mb-1">
            Model
          </Label>
          <Input
            type="text"
            id="model"
            value={data.model || ""}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                model: e.target.value,
              }))
            }
            placeholder="Giriniz..."
          />
        </div>

        <div className="md:col-span-4 lg:col-span-3 xl:col-span-3">
          <Label htmlFor="boyut" className="mb-1">
            Boyut
          </Label>
          <SelectBoxDep
            data={tvBoyutlari.map((item) => ({
              label: `${item.inc} İnç - ${item.ekran} Ekran`,
              value: item.inc,
            }))}
            value={data.boyut || ""}
            placeholder="Seçiniz"
            onValueChange={(e) =>
              setData((prev) => ({
                ...prev,
                boyut: e,
              }))
            }
          />
        </div>

        <div className="md:col-span-5 lg:col-span-3 xl:col-span-4">
          <Label htmlFor="seriNo" className="mb-1">
            Seri No
          </Label>
          <Input
            type="text"
            id="seriNo"
            value={data.seriNo || ""}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                seriNo: e.target.value,
              }))
            }
            placeholder="Giriniz..."
          />
        </div>

        <div className="md:col-span-2 lg:col-span-2 xl:col-span-1 gap-2 flex md:flex-col  md:justify-end">
          <div className="flex gap-2">
            <Checkbox
              checked={data.garanti}
              color="cyan"
              onCheckedChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  garanti: !!e,
                }))
              }
            />
            <Label htmlFor="garanti" className="">
              Garanti
            </Label>
          </div>

          <div className="flex gap-2">
            <Checkbox
              checked={data.ariza}
              color="red"
              onCheckedChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  ariza: !!e,
                }))
              }
            />
            <Label htmlFor="arızaDurumu" className="mb-1">
              Arıza
            </Label>
          </div>
        </div>

        <div className="md:col-span-5 lg:col-span-4 xl:col-span-4">
          <Label htmlFor="aciklama" className="mb-1">
            Açıklama
          </Label>
          <Input
            type="text"
            id="aciklama"
            value={data.aciklama || ""}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                aciklama: e.target.value,
              }))
            }
            placeholder="Giriniz..."
          />
        </div>

        <div className="md:col-span-8 lg:col-span-3 xl:col-span-3">
          <Label htmlFor="picture" className="mb-1">
            Televizyon Fotoğrafı
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
            {data.tv_fotograf && (
              <HoverCard>
                <HoverCardTrigger>
                  <Button variant="ghost" size="icon">
                    👁️
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="p-2 w-auto">
                  <img
                    src={data.tv_fotograf!}
                    alt="Önizleme"
                    className="w-40 h-40 object-cover rounded"
                  />
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
        </div>

        <div className=" md:col-span-4 lg:col-span-3 xl:col-span-2  content-end">
          <Button onClick={tvEkle} variant="outline" size={"lg"}>
            Ekle
          </Button>
        </div>
      </div>

      <hr className="my-8 w-full" />
      <h3 className="font-bold">TV Listesi</h3>
      <div 
        className="pb-5"
        style={{ width: "100%", height: "500px" }}
      >
        <AgGridReact
          theme={getAgGridTheme(theme === "dark")}
          rowData={tvList}
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
