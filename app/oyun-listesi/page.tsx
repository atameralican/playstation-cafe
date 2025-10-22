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
    useEffect(() => {
//eğer veri yoksa hiç yapamayacağımız ale getir veri yoksa bu alan olmasın filtreleme alanı
        if (searchText) {
            
        }
    }, [searchText]);





    // ================= Toogle (person ve pstype) ==========
    const [psType, setPsType] = useState({
        ps5: true,
        ps4: true,
        ps3: true,
      });
      const [person, setPerson] = useState({ bir: true, iki: true, dort: true });
    
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
                className="lg:w-2/4 w-full "
              />
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
        </CardContent>
      </Card>
    </div>
  );
}

export default  OyunListesiPage
