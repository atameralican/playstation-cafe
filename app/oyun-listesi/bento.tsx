"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { useServiceHook } from "@/components/useServiceHook/useServiceHook";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { showToast } from "@/components/ui/alertDep";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface MasaBilgisi {
  masa_no: number;
  id: number;
}

interface Oyun {
  id: number;
  oyun_adi: string;
  cihaz_turu: string;
  kac_kisilik: number;
  kategori: string;
  ea_playde_mi: boolean;
  gorsel: string | null;
  aciklama?: string;
  ps3_masalar: MasaBilgisi[];
  ps4_masalar: MasaBilgisi[];
  ps5_masalar: MasaBilgisi[];
}

export function BentoGridDemo() {
  const [oyunlar, setOyunlar] = useState<Oyun[]>([]);
  const { serviseGit } = useServiceHook();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    oyunlariYukle();
  }, []);
  useEffect(() => {
    console.log("oyunlar", oyunlar);
  }, [oyunlar]);
  const oyunlariYukle = async () => {
    await serviseGit<Oyun[]>({
      url: "/api/public/oyunlar",
      method: "GET",
      onSuccess: (data) => {
        setOyunlar(data);
      },
      onError: (error) => {
        showToast(`Oyunlar yüklenemedi: ${error.message}`, "error");
      },
    });
  };

  // Sayfalama hesaplaması
  const totalPages = Math.ceil(oyunlar.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOyunlar = oyunlar.slice(startIndex, startIndex + itemsPerPage);
  return (
    <>
      <BentoGrid className="max-w-4xl mx-auto">
        {currentOyunlar.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.oyun_adi}
            category={item.kategori}
            eaPlay={item.ea_playde_mi}
            gorsel={item.gorsel||""}
            person={item.kac_kisilik}
            ps3_masalar={item.ps3_masalar}
            ps4_masalar={item.ps4_masalar}
            ps5_masalar={item.ps5_masalar}
            description={item?.aciklama}
            className={i % 5 === 0 ? "md:col-span-2" : ""}
          />
        ))}
      </BentoGrid>

      {totalPages > 1 && (
        <Pagination className="mt-6 flex justify-center">
          <PaginationContent className="gap-2">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={cn(
                  currentPage === 1 && "opacity-50 pointer-events-none"
                )}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className={cn(
                  currentPage === totalPages && "opacity-50 pointer-events-none"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

     
    </>
  );
}

