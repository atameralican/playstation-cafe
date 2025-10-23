"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ShineBorder } from '@/components/ui/shine-border'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { Gamepad2 } from 'lucide-react'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid'
import { showToast } from '@/components/ui/alertDep'
import { useServiceHook } from '@/components/useServiceHook/useServiceHook'
import { cn } from '@/lib/utils'
import { EmptyGameList } from '@/components/GameList/empty-list'


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

function OyunListesiPage() {
  const [searchText, setSearchText] = useState("");
  const [oyunlar, setOyunlar] = useState<Oyun[]>([]);
  const { serviseGit } = useServiceHook();
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredGames, setFilteredGames] = useState<Oyun[]>([]);
  const [psType, setPsType] = useState({
    ps5: true,
    ps4: true,
    ps3: true,
  });
  const [person, setPerson] = useState({ bir: true, iki: true, dort: true });

  useEffect(() => {
    oyunlariYukle();
  }, []);


//     //eğer veri yoksa hiç yapamayacağımız ale getir veri yoksa bu alan olmasın filtreleme alanı
//     //use client sebebiyle ayırma işlemini yap
//     //filtrelemeleri yap
//     let sonuc = [...oyunlar];
//     if (searchText) {
//       sonuc = sonuc.filter((oyun) =>
//         oyun.oyun_adi.toLowerCase().includes(searchText.toLowerCase())
//       );
//  sonuc = sonuc.filter((oyun) => {
//     const cihaz = oyun.cihaz_turu.toLowerCase();
//     return (
//       (psType.ps5 && cihaz === "ps5") ||
//       (psType.ps4 && cihaz === "ps4") ||
//       (psType.ps3 && cihaz === "ps3")
//     );
//   });
//     }

//     setFilteredGames(sonuc);
//   }, [searchText, oyunlar,psType]);

  // ================= Toogle (person ve pstype) ==========
useEffect(() => {

  let sonuc = [...oyunlar];
  
  // Oyun adına göre filtreleme
  if (searchText) {
    sonuc = sonuc.filter((oyun) =>
      oyun.oyun_adi.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  // PS tipine göre filtreleme
  sonuc = sonuc.filter((oyun) => {
    return psType.ps5 && oyun.ps5_masalar.length > 0 || psType.ps4 && oyun.ps4_masalar.length > 0 || psType.ps3 && oyun.ps3_masalar.length > 0;
  });

  // Kişi sayısına göre filtreleme 
  sonuc = sonuc.filter((oyun) => {
    if (person.bir && oyun.kac_kisilik === 1) return true;
    if (person.iki && oyun.kac_kisilik === 2) return true;
    if (person.dort && oyun.kac_kisilik === 4) return true;
    return false;
  });

  setFilteredGames(sonuc);
  
  // Sayfa numarasını sıfırla (filtreleme değiştiğinde ilk sayfaya dön)
  setCurrentPage(1);
}, [searchText, oyunlar, psType, person]);

  const tooglePerson = (format: keyof typeof person) => {
    setPerson((prev) => ({
      ...prev,
      [format]: !prev[format],
    }));
  };
  const tooglePsType = (format: keyof typeof psType) => {
    setPsType((prev) => ({
      ...prev,
      [format]: !prev[format],
    }));
  };

  //=============== Oyun cards (bento) ==================

  const itemsPerPage = 5;

  const oyunlariYukle = async () => {
    await serviseGit<Oyun[]>({
      url: "/api/public/oyunlar",
      method: "GET",
      onSuccess: (data) => {
        setOyunlar(data);
        setFilteredGames(data);
      },
      onError: (error) => {
        showToast(`Oyunlar yüklenemedi: ${error.message}`, "error");
      },
    });
  };

  // Sayfalama hesaplaması
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOyunlar = filteredGames.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div>
      <Card className="relative w-full overflow-hidden">
        <ShineBorder
          borderWidth={2}
          shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
        />
        <CardHeader>
          <CardTitle>
            <div className="flex flex-row justify-between items-center">
              <Input
                type="text"
                placeholder="Oyun adı yazın..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="lg:w-1/4 w-full "
              />
              {filteredGames.length>0&& <div className="my-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <strong>{filteredGames.length}</strong> oyun bulundu.
          </div>}
              <Card className="p-2 w-fit">
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1">
                    <Toggle
                      pressed={person.bir}
                      onPressedChange={() => tooglePerson("bir")}
                      aria-label="1 kişilik oyun"
                      size="sm"
                    >
                      <div className="relative">
                        <Gamepad2 className="w-4 h-4" />
                        <span className="absolute -top-1 -right-1 text-[10px] font-bold"></span>
                      </div>
                    </Toggle>
                    <Toggle
                      pressed={person.iki}
                      onPressedChange={() => tooglePerson("iki")}
                      aria-label="2 kişilik oyun"
                      size="sm"
                    >
                      <div className="relative">
                        <Gamepad2 className="w-4 h-4" />
                        <span className="absolute -top-2 -right-1 text-[10px] font-bold">
                          2
                        </span>
                      </div>
                    </Toggle>
                    <Toggle
                      pressed={person.dort}
                      onPressedChange={() => tooglePerson("dort")}
                      aria-label="4 kişilik oyun"
                      size="sm"
                    >
                      <div className="relative">
                        <Gamepad2 className="w-4 h-4" />
                        <span className="absolute -top-2 -right-1 text-[10px] font-bold">
                          4
                        </span>
                      </div>
                    </Toggle>
                  </div>

                  <hr className="w-px h-6 bg-gray-400 dark:bg-gray-400 border-0  mx-3  " />

                  <div className="flex items-center gap-1">
                    <Toggle
                      pressed={psType.ps5}
                      onPressedChange={() => tooglePsType("ps5")}
                      aria-label="Playstation5"
                      size="sm"
                    >
                      PS5
                    </Toggle>
                    <Toggle
                      pressed={psType.ps4}
                      onPressedChange={() => tooglePsType("ps4")}
                      aria-label="Playstation4"
                      size="sm"
                    >
                      PS4
                    </Toggle>
                    <Toggle
                      pressed={psType.ps3}
                      onPressedChange={() => tooglePsType("ps3")}
                      aria-label="Playstation3"
                      size="sm"
                    >
                      PS3
                    </Toggle>
                  </div>
                </div>
              </Card>
            </div>
          </CardTitle>
        </CardHeader>
        <hr />
        <CardContent>
                {filteredGames.length>0?<> <BentoGrid className="max-w-4xl mx-auto">
            {currentOyunlar.map((item, i) => (
              <BentoGridItem
                key={i}
                title={item.oyun_adi}
                category={item.kategori}
                eaPlay={item.ea_playde_mi}
                gorsel={item.gorsel || ""}
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
                      currentPage === totalPages &&
                        "opacity-50 pointer-events-none"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}</>:<><EmptyGameList/></>}
         
        </CardContent>
      </Card>
    </div>
  );
}

export default  OyunListesiPage
