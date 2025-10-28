"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import SelectBoxDep from "@/components/ui/selectBoxDep";
import { useServiceHook } from "@/components/useServiceHook/useServiceHook";
import { showToast } from "@/components/ui/alertDep";
import { AlertDialog, Flex, Button as RadixButton } from "@radix-ui/themes";
import { Textarea } from "@/components/ui/textarea";
import { useTheme } from "next-themes";
import { getAgGridTheme } from "@/lib/agGridTheme";
import type { Masa, } from "@/lib/types/masalar";
import { Pencil } from "lucide-react";
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
  const { theme } = useTheme();
  const [tvListMini, setTvListMini] = useState<TV[]>([]);
  const [cihazListMini, setCihazListMini] = useState<Cihaz[]>([]);
  const [masaList, setMasaList] = useState<Masa[]>([]);
  const [duzenlenenId, setDuzenlenenId] = useState<number | null>(null);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [silinecekMasaId, setSilinecekMasaId] = useState<number | null>(null);

  const [data, setData] = useState({
    masa_no: "",
    cihaz: "",
    cihaz2: "",
    tv: "",
    aciklama: "",
    problem: "",
  });

  useEffect(() => {
    getMiniCihazList();
    getTvList();
    getMasalar();
  }, []);

  const temizle = () => {
    setData({
      masa_no: "",
      cihaz: "",
      cihaz2: "",
      tv: "",
      aciklama: "",
      problem: "",
    });
    setDuzenlenenId(null);
  };

  // ============= SERVICE İŞLEMLERİ =============
  const getMiniCihazList = async () => {
    await serviseGit<Cihaz[]>({
      method: "GET",
      url: "/api/cihazlar/minimal",
      onSuccess: (data) => {
        setCihazListMini(data as Cihaz[]);
      },
      onError: (error) => {
        console.log("/api/cihazlar/minimal: ", error.message);
        showToast(`Cihazlar Yüklenemedi: ${error.message}`, "error");
      },
    });
  };

  const getTvList = async () => {
    await serviseGit<TV[]>({
      method: "GET",
      url: "/api/televizyonlar",
      onSuccess: (data) => {
        setTvListMini(data as TV[]);
      },
      onError: (error) => {
        console.log("/api/tvler: ", error.message);
        showToast(`Tvler Yüklenemedi: ${error.message}`, "error");
      },
    });
  };

  const getMasalar = async () => {
    await serviseGit<Masa[]>({
      method: "GET",
      url: "/api/masalar",
      onSuccess: (data) => {
        setMasaList(data as Masa[]);
      },
      onError: (error) => {
        console.log("/api/masalar: ", error.message);
        showToast(`Masalar Yüklenemedi: ${error.message}`, "error");
      },
    });
  };

  const masaEkle = async () => {
    if (!data.masa_no || !data.cihaz) {
      showToast("Lütfen masa no ve en az bir cihaz seçiniz.", "error");
      return;
    }

    const method = duzenlenenId ? "PUT" : "POST";
    const body = duzenlenenId ? { id: duzenlenenId, ...data } : data;

    await serviseGit({
      url: "/api/masalar",
      method: method,
      body: body,
      onSuccess: () => {
        showToast(
          duzenlenenId ? "Masa güncellendi!" : "Masa eklendi!",
          "success"
        );
        temizle();
        getMasalar();
      },
      onError: (error) => {
        showToast(
          `${duzenlenenId ? "Güncelleme" : "Ekleme"} hatası: ${error.message}`,
          "error"
        );
        console.log("api/masalar: ", error.message);
      },
    });
  };

  const masaDuzenle = (masa: Masa) => {
    setDuzenlenenId(masa.id);
    setData({
      masa_no: masa.masa_no,
      cihaz: masa.cihaz?.id?.toString() || "",
      cihaz2: masa.cihaz2?.id?.toString() || "",
      tv: masa.televizyon?.id?.toString() || "",
      aciklama: masa.aciklama || "",
      problem: masa.problem || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const masaSilBaslat = (id: number) => {
    setSilinecekMasaId(id);
    setDeleteReason("");
    setDeleteDialogOpen(true);
  };

  const masaSil = async () => {
    if (!silinecekMasaId) return;

    if (!deleteReason.trim()) {
      showToast("Lütfen silme sebebini giriniz.", "error");
      return;
    }

    await serviseGit({
      url: `/api/masalar/${silinecekMasaId}?reason=${encodeURIComponent(
        deleteReason
      )}`,
      method: "DELETE",
      onSuccess: () => {
        showToast("Masa silindi!", "success");
        getMasalar();
        setDeleteDialogOpen(false);
        setSilinecekMasaId(null);
        setDeleteReason("");
      },
      onError: (error) => {
        showToast(`Silme hatası: ${error.message}`, "error");
        console.log("api/masalar/[id]-DELETE: ", error.message);
      },
    });
  };

  // ========== DATAGRID ==============
  const colDefs: ColDef<Masa>[] = [
    {
      field: "masa_no",
      headerName: "Masa No",
      filter: true,
      width: 120,
    },
    {
      field: "cihaz",
      headerName: "Cihaz 1",
      valueFormatter: (params) => {
        const cihaz = params.value;
        return cihaz ? `${cihaz.cihaz_turu} - ${cihaz.kasa_tipi}` : "Yok";
      },
      width: 150,
    },
    {
      field: "cihaz2",
      headerName: "Cihaz 2",
      valueFormatter: (params) => {
        const cihaz2 = params.value;
        return cihaz2 ? `${cihaz2.cihaz_turu} - ${cihaz2.kasa_tipi}` : "-";
      },
      width: 150,
    },
    {
      field: "televizyon",
      headerName: "Televizyon",
      valueFormatter: (params) => {
        const tv = params.value;
        return tv ? `${tv.marka} ${tv.boyut}"` : "Yok";
      },
      width: 150,
    },
    // {
    //   field: "yuklu_oyunlar",
    //   headerName: "Toplam Oyun",
    //   valueFormatter: (params) => {
    //     const oyunlar = params.value;
    //     return oyunlar ? `${oyunlar.length} oyun` : "0 oyun";
    //   },
    //   width: 130,
    // },
     {
    // ✅ DEĞİŞTİ: yuklu_oyunlar → yuklu_oyun_sayisi
    field: "yuklu_oyun_sayisi",
    headerName: "Toplam Oyun",
    valueFormatter: (params) => {
      return `${params.value || 0} oyun`;
    },
    width: 130,
  },
    {
      field: "aciklama",
      headerName: "Açıklama",
      minWidth: 200,
    },
    {
      field: "problem",
      headerName: "Problem",
      minWidth: 200,
    },
    {
      headerName: "İşlemler",
      cellRenderer: (params: { data: Masa }) => {
        return (
          <div className="flex items-center justify-center gap-1 h-full">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => masaDuzenle(params.data)}
            >
              <Pencil className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </Button>
            <DeleteAlertModal 
              onClick={() => masaSilBaslat(params.data.id)}
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

        <div className="md:col-span-6 lg:col-span-4 xl:col-span-3">
          <Label htmlFor="cihaz1" className="mb-1">
            Playstation 1 *
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

        <div className="md:col-span-6 lg:col-span-4 xl:col-span-3">
          <Label htmlFor="cihaz2" className="mb-1">
            Playstation 2 (Opsiyonel)
          </Label>
          <SelectBoxDep
            data={cihazListMini.map((item) => ({
              label: `${item?.cihaz_turu} - ${item?.kasa_tipi} (${item?.acilis_hesabi})`,
              value: item.id.toString() || "",
            }))}
            value={data.cihaz2 || ""}
            placeholder="Seçiniz"
            onValueChange={(e) =>
              setData((prev) => ({
                ...prev,
                cihaz2: e,
              }))
            }
          />
        </div>

        <div className="md:col-span-3 lg:col-span-2 xl:col-span-2">
          <Label htmlFor="tv" className="mb-1">
            Ekran
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
            placeholder="Giriniz..."
          />
        </div>

        <div className="md:col-span-5 lg:col-span-3 xl:col-span-3">
          <Label htmlFor="problem" className="mb-1">
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

        <div className="md:col-span-4 lg:col-span-3 xl:col-span-2 content-end">
          <div className="flex gap-2">
            <Button onClick={masaEkle} variant="outline" size={"lg"}>
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
      <h3 className="font-bold">Masa Listesi ({masaList.length})</h3>
      <div 
        className="pb-5"
        style={{ width: "100%", height: "500px" }}
      >
        <AgGridReact
          theme={getAgGridTheme(theme === "dark")}
          rowData={masaList}
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

      {/* Silme Dialog - Radix UI */}
      <AlertDialog.Root open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialog.Content maxWidth="500px">
          <AlertDialog.Title>Masayı Silmek İstediğinize Emin Misiniz?</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Bu işlem geri alınamaz. Lütfen silme sebebinizi belirtiniz.
          </AlertDialog.Description>

          <div className="my-4">
            <Label htmlFor="deleteReason" className="mb-2 block">
              Silme Sebebi *
            </Label>
            <Textarea
              id="deleteReason"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Silme sebebini giriniz..."
              rows={3}
            />
          </div>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <RadixButton
                variant="soft"
                color="gray"
                onClick={() => {
                  setDeleteReason("");
                  setSilinecekMasaId(null);
                }}
              >
                İptal
              </RadixButton>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <RadixButton variant="solid" color="red" onClick={masaSil}>
                Sil
              </RadixButton>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </div>
  );
}

export default Masalar;
