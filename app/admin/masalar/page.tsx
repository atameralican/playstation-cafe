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
ModuleRegistry.registerModules([AllCommunityModule]);
interface Cihaz {
  id: number;
  acilis_hesabi: string;
  ikinci_hesap?: string;
  cihaz_turu?: string;
  kasa_tipi?: string;
}
interface TV {
  id: number;
  marka: string;
  model?: string;
  boyut?: string;
  kasa_tipi?: string;
}

function Masalar() {
  const { serviseGit } = useServiceHook();
  const [tvListMini, setTvListMini] = useState<TV[]>([]);
  const [cihazListMini, setCihazListMini] = useState<Cihaz[]>([]);
  const [data, setData] = useState({
    masa_no: "",
    cihaz: "",
    tv: "",
    aciklama: "",
    problem: "",
  });
  useEffect(() => {
    getMiniCihazList();
    getTvList();
  }, []);

  const getMiniCihazList = async () => {
    await serviseGit<Cihaz[]>({
      method: "GET",
      url: "/api/cihazlar/minimal",
      onSuccess: (data) => {
        console.log(data);
        setCihazListMini(data as Cihaz[]);
      },
      onError: (error) => {
        console.log("/api/cihazlar/minimal: ", error.message);
        showToast(`Cihazlar Yüklenemedi:  ${error.message}`, "error");
      },
    });
  };

  const getTvList = async () => {
    await serviseGit<TV[]>({
      method: "GET",
      url: "/api/televizyonlar",
      onSuccess: (data) => {
        console.log(data);
        setTvListMini(data as TV[]);
      },
      onError: (error) => {
        console.log("/api/tvler: ", error.message);
        showToast(`Tvler Yüklenemedi:  ${error.message}`, "error");
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-neutral-600 dark:text-neutral-400 text-3xl font-bold">
            Masalar
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Yeni masa ekleme ve ekran / playstation eşleştirme ekranı.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 gap-x-4 gap-y-6">
        <div className="md:col-span-3 lg:col-span-2 xl:col-span-2">
          <Label htmlFor="masaNo" className="mb-1">
            Masa No
          </Label>
          <Input
            type="text"
            id="masano"
            value={data.masa_no}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                masa_no: e.target.value,
              }))
            }
            placeholder="Masa No"
          />
        </div>

        <div className="md:col-span-6 lg:col-span-4 xl:col-span-4">
          <Label htmlFor="masaNo" className="mb-1">
            Playstation
          </Label>
          <SelectBoxDep
            data={cihazListMini.map((item) => ({
              label: `${item?.cihaz_turu} - ${item?.kasa_tipi} (${item?.acilis_hesabi})`,
              value: item.id.toString() || "",
            }))}
            value={data.cihaz || ""}
            placeholder="Seçiniz"
            onValueChange={(e) =>
              setData((prev) => ({
                ...prev,
                cihaz: e,
              }))
            }
          />
        </div>

        <div className="md:col-span-3 lg:col-span-2 xl:col-span-2">
          <Label htmlFor="masaNo" className="mb-1">
            ekran
          </Label>
          <SelectBoxDep
            data={tvListMini.map((item) => ({
              label: `${item?.marka || ""} - ${item?.boyut || ""}"${
                item?.model ? ` (${item.model})` : ""
              }`,

              value: item.id.toString() || "",
            }))}
            value={data.tv || ""}
            placeholder="Seçiniz"
            onValueChange={(e) =>
              setData((prev) => ({
                ...prev,
                tv: e,
              }))
            }
          />
        </div>

        <div className="md:col-span-5 lg:col-span-4 xl:col-span-4">
          <Label htmlFor="masaNo" className="mb-1">
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
            placeholder="Giriniz..."
          />
        </div>

        <div className="md:col-span-5 lg:col-span-3 xl:col-span-3">
          <Label htmlFor="masaNo" className="mb-1">
            Problem
          </Label>
          <Input
            type="text"
            id="problem"
            value={data.problem}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                problem: e.target.value,
              }))
            }
            placeholder="Giriniz..."
          />
        </div>

        <div className=" md:col-span-2 lg:col-span-3 xl:col-span-2  content-end">
           <Button 
           //onClick={tvEkle} 
           variant="outline" size={"lg"}>
            Ekle
          </Button> 
        </div>
      </div>

      <hr className="my-8 w-full" />
      <h3 className="font-bold">TV Listesi</h3>
      <div style={{ width: "100%", height: "500px" }} className="pb-5">
        Ekle dediğimizde servise giderken id ile tv yi ve cihazı maple falan object olarak koymamız lazım. 
        {/* <AgGridReact
          rowData={tvList}
          columnDefs={colDefs}
          onGridReady={(params) => params.api.autoSizeAllColumns()}
          onGridSizeChanged={(params) => params.api.autoSizeAllColumns()}
          // defaultColDef={defaultColDef}
          //rowSelection="single"
        /> */}
      </div>
    </div>
  );
}

export default Masalar;
