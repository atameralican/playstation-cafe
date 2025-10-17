import React from "react";
import { CountingNumber } from '@/components/ui/shadcn-io/counting-number';
import { Gamepad2 } from 'lucide-react';
import StatisticCard from "@/components/ui/custom/statisticCard";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
        Deplasman Bay Bayan Playstation Salonu
      </h3>

         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-20 place-items-center">

        <StatisticCard href="/admin/oyunlar" title="Oyun" endNumber={22} description="lorem" iconName="Trophy" />
        <StatisticCard href="/admin/playstationlar" title="Playstation" endNumber={44} description="lorem" iconName="Gamepad2" />
        <StatisticCard href="/admin/televizyonlar" title="Televizyon" endNumber={123} description="lorem" iconName="Tv2" />
        <StatisticCard href="/admin/masalar" title="Masa" endNumber={77} description="lorem" iconName="DoorOpen" />
        <StatisticCard href="/admin/hesaplar" title="Hesap" endNumber={234} description="lorem" iconName="User" />
      
      </div>
    </div>
  );
}