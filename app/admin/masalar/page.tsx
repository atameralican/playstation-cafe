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

function Masalar() {
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
        <div className="md:col-span-4 lg:col-span-3 xl:col-span-2">
          <Label htmlFor="masaNo" className="mb-1">
            Masa No
          </Label>
string - input
        </div>

        <div className="md:col-span-4 lg:col-span-3 xl:col-span-2">
          <Label htmlFor="masaNo" className="mb-1">
            playstation
          </Label>
          object olacak heralde. selectbox olmalı. (aslında id ve cihaz adı ile cihaz gelecek sonra mapleme yapılacak. ama bu durumdada c)
        </div>

        <div className="md:col-span-4 lg:col-span-3 xl:col-span-2">
          <Label htmlFor="masaNo" className="mb-1">
            ekran
          </Label>
          selectbox ile ekranlar gelecek. id gelsin mapleme yapılacak
        </div>

        <div className="md:col-span-4 lg:col-span-3 xl:col-span-2">
          <Label htmlFor="masaNo" className="mb-1">
            Açıklama
          </Label>
          string - input
        </div>

                <div className="md:col-span-4 lg:col-span-3 xl:col-span-2">
          <Label htmlFor="masaNo" className="mb-1">
            Problem
          </Label>
          string - input
        </div>


        
        

        <div className=" md:col-span-4 lg:col-span-3 xl:col-span-2  content-end">
          {/* <Button onClick={tvEkle} variant="outline" size={"lg"}>
            Ekle
          </Button> */}
        </div>
      </div>

      <hr className="my-8 w-full" />
      <h3 className="font-bold">TV Listesi</h3>
      <div style={{ width: "100%", height: "500px" }} className="pb-5">
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
