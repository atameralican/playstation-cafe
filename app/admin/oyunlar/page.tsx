"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { kisiSayisi, customPsType, evetHayir } from "@/lib/adminPages";
import React, { useState } from "react";
import SegmentedDep from "@/components/ui/segmentedDep";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { FileUpload } from "@/components/ui/admin-file-upload";
export default function OyunlarPage() {
  const [psType, setPsType] = React.useState("2"); //ps4/ps5
  const [person, setPerson] = React.useState("2");
  const [eaMi, setEaMi] = React.useState("1");
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };
  return (
    <div className="space-y-6">
      <h1 className="text-neutral-600 dark:text-neutral-400 text-3xl font-bold">Oyunlar</h1>
      <p className="text-neutral-600 dark:text-neutral-400">
        Oyunlar buradan eklenecektir. 
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-12 gap-x-4 gap-y-6">
        {/* <div className="lg:grid-cols-2 lg:grid-cols-12 gap-4"> */}

        <div className="lg:col-span-4 xl:col-span-2">
          <Label htmlFor="number" className="mb-1">
            ID
          </Label>
          <Input type="number" disabled id="number" placeholder="Oyun ID" />
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <Label htmlFor="text" className="mb-1">
            Oyun Adı
          </Label>
          <Input type="text" id="text" placeholder="Oyun Adı" />
        </div>

        <div className="lg:col-span-3 xl:col-span-2">
          <Label htmlFor="text" className="mb-1">
            Cihaz Türü
          </Label>
          <SegmentedDep
            data={customPsType}
            value={psType}
            onValueChange={setPsType}
            radius="full"
            size="2"
          />
        </div>
        <div className="lg:col-span-6 xl:col-span-3 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="text" className="mb-1">
              Kaç Kişilik
            </Label>
            <SegmentedDep
              data={kisiSayisi}
              value={person}
              onValueChange={setPerson}
              radius="full"
              size="2"
            />
          </div>

          <div>
            <Label htmlFor="text" className="mb-1">
              EA Playde Mi
            </Label>
            <SegmentedDep
              data={evetHayir}
              value={eaMi}
              onValueChange={setEaMi}
              radius="full"
              size="2"
            />
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <FileUpload single onChange={handleFileUpload} title="Oyun Görseli" />
        </div>

        <div className="lg:col-span-2 xl:col-span-2 lg:self-end lg:items-end">
          <Button
            onClick={() => console.log(files)}
            variant="outline"
            aria-label="Submit"
          >
            <IconPlus /> Ekle
          </Button>
        </div>
      </div>
    </div>
  );
}
