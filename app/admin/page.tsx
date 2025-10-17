"use client";

import React, { useEffect, useState } from "react";
import StatisticCard from "@/components/ui/custom/statisticCard";
import { useServiceHook } from "@/components/useServiceHook/useServiceHook";
interface Sayilar {
  oyunCount: number;
  hesapCount: number;
  cihazCount: number;
  tvCount: number;
  masaCount: number;
}
export default function AdminPage() {
  const { serviseGit } = useServiceHook();
  const [counts, setCounts] = useState({
    oyunCount: 0,
    hesapCount: 0,
    cihazCount: 0,
    tvCount: 0,
    masaCount: 0,
  });

  const getSayilar = async () => {
    await serviseGit<Sayilar>({
      method: "GET",
      url: "/api/stats",
      onSuccess: (data) => {
        setCounts(data);
      },
      onError: (error) => {
        console.log("/api/cihazlar: ", error.message);
      },
    });
  };

  useEffect(() => {
    getSayilar();
  }, []);
  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
        Deplasman Bay Bayan Playstation Salonu
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-20 place-items-center">
        <StatisticCard
          href="/admin/oyunlar"
          title="Oyun"
          endNumber={counts.oyunCount}
          description="lorem"
          iconName="Trophy"
        />
        <StatisticCard
          href="/admin/playstationlar"
          title="Playstation"
          endNumber={counts.cihazCount}
          description="lorem"
          iconName="Gamepad2"
        />
        <StatisticCard
          href="/admin/televizyonlar"
          title="Televizyon"
          endNumber={counts.tvCount}
          description="lorem"
          iconName="Tv2"
        />
        <StatisticCard
          href="/admin/masalar"
          title="Masa"
          endNumber={counts.masaCount}
          description="lorem"
          iconName="DoorOpen"
        />
        <StatisticCard
          href="/admin/hesaplar"
          title="Hesap"
          endNumber={counts.hesapCount}
          description="lorem"
          iconName="User"
        />
      </div>
    </div>
  );
}
