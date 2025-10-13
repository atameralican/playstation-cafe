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

export default function PlaystationlarPage() {
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
            //value={data.ea_play_varmi ? "1" : "2"}
            //onValueChange={(e) =>
            //  setData((prev) => ({
            //    ...prev,
            //    ea_play_varmi: e === "1" ? true : false,
            //  }))
            //}
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
            value={""}
            placeholder="Seçiniz"
            //onValueChange={(e) =>
            //  setData((prev) => ({
            //    ...prev,
            //    gameType: e,
            //  }))
            //}
          />
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
          <Label htmlFor="serino" className="mb-1">
            Seri No
          </Label>
          <Input
                      type="text"
                      id="serino"
                      //value={data.mail}
                      //onChange={(e) =>
                      //  setData((prev) => ({
                      //    ...prev,
                      //    mail: e.target.value,
                      //  }))
                      //}
                      placeholder="Seri No"
                    />
        </div>
        <div className="lg:col-span-4 xl:col-span-3">
          <Label htmlFor="acilisHesabi" className="mb-1">
            Açılış Hesabı
          </Label>
           <SelectBoxDep
            data={oyunTurleri}
            value={""}
            placeholder="Seçiniz"
            //onValueChange={(e) =>
            //  setData((prev) => ({
            //    ...prev,
            //    gameType: e,
            //  }))
            //}
          />
        </div>
        <div className="lg:col-span-4 xl:col-span-3">
          <Label htmlFor="kardesHesap" className="mb-1">
            2. Hesap
          </Label>
           <SelectBoxDep
            data={oyunTurleri}
            value={""}
            placeholder="Seçiniz"
            //onValueChange={(e) =>
            //  setData((prev) => ({
            //    ...prev,
            //    gameType: e,
            //  }))
            //}
          />
        </div>
        <div className="lg:col-span-4 xl:col-span-3">
          <Label htmlFor="kolikimail" className="mb-1">
            Kol İki Mail
          </Label>
          <Input
                      type="text"
                      id="kolikimail"
                      //value={data.mail}
                      //onChange={(e) =>
                      //  setData((prev) => ({
                      //    ...prev,
                      //    mail: e.target.value,
                      //  }))
                      //}
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
                      //value={data.mail}
                      //onChange={(e) =>
                      //  setData((prev) => ({
                      //    ...prev,
                      //    mail: e.target.value,
                      //  }))
                      //}
                      placeholder="Açıklama"
                    />
        </div>
        <div className="lg:col-span-4 xl:col-span-3">
          <Label htmlFor="gorsel" className="mb-1">
            Cihaz Fotoğrafı
          </Label>
          <FileUpload
                      single
                     //onChange={handleFileUpload}
                     //reset={resetFileUpload}
                    />
        </div>
        <div className="lg:col-span-2 xl:col-span-1">
          <Button 
          //onClick={oyunKaydet} 
          color="blue" variant="surface">
                      Ekle
                    </Button>
        </div>
       
        </div>
    </div>
  );
}