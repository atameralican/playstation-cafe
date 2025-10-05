"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { psTypes, kisiSayisi } from "@/lib/adminPages";
import React, { useState } from "react";
import SelectBoxDep from "@/components/ui/selectBoxDep";
import { SegmentedControl } from "@radix-ui/themes";
import SegmentedDep from "@/components/ui/segmentedDep";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
export default function OyunlarPage() {
  const [psType, setPsType] = React.useState("");
  const [person, setPerson] = React.useState("2");
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Oyunlar</h1>
      <p className="text-neutral-600 dark:text-neutral-400">
        Hoş geldiniz! Burası oyunların bulunacağı sayfa
      </p>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-6">
        <div className="md:col-span-2">
          <Label htmlFor="number" className="mb-1">
            ID
          </Label>
          <Input type="number" disabled id="number" placeholder="Oyun ID" />
        </div>

        <div className="md:col-span-4">
          <Label htmlFor="text" className="mb-1">
            Oyun Adı
          </Label>
          <Input type="text" id="text" placeholder="Oyun Adı" />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="text" className="mb-1">
            Cihaz Türü
          </Label>
          <SelectBoxDep
            data={psTypes}
            value={psType}
            onValueChange={(val) => setPsType(val)}
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="text" className="mb-1">
            Kişi Sayısı
          </Label>
          <SegmentedDep
            data={kisiSayisi}
            value={person}
            onValueChange={setPerson}
            radius="full"
            size="2"
          />
        </div>
        <div className="md:col-span-2 self-end items-end">
        <Button variant="outline" aria-label="Submit">
		<IconPlus /> Ekle
	</Button>
        </div>
      </div>
    </div>
  );
}
