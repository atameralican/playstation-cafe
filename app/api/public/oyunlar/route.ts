import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface MasaBilgisi {
  masa_no: number;
  id: number;
}

interface OyunDetay {
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

// GET - Tüm oyunları masa bilgileriyle beraber getir (PUBLIC - Herkes Erişebilir)
export async function GET() {
  try {
    // 1. Tüm oyunları al
    const { data: oyunlar, error: oyunError } = await supabase
      .from("oyunlar")
      .select("*")
      .eq("is_deleted", false)
      .order("oyun_adi", { ascending: true });

    if (oyunError) throw oyunError;

    if (!oyunlar || oyunlar.length === 0) {
      return NextResponse.json([]);
    }

    // 2. Tüm masaları al (cihaz bilgileriyle)
    const { data: masalar, error: masaError } = await supabase
      .from("masalar")
      .select("*")
      .eq("is_deleted", false);

    if (masaError) throw masaError;

    // 3. Her oyun için hangi masalarda olduğunu bul
    const oyunDetaylar: OyunDetay[] = oyunlar.map((oyun) => {
      const ps3Masalar: MasaBilgisi[] = [];
      const ps4Masalar: MasaBilgisi[] = [];
      const ps5Masalar: MasaBilgisi[] = [];

      // Her masayı kontrol et
      masalar?.forEach((masa) => {
        // Cihaz 1'i kontrol et
        if (masa.cihaz?.yuklu_oyunlar?.includes(oyun.id)) {
          const cihazTuru = masa.cihaz.cihaz_turu?.toLowerCase() || "";
          
          if (cihazTuru.includes("ps3")) {
            ps3Masalar.push({ masa_no: masa.masa_no, id: masa.id });
          } else if (cihazTuru.includes("ps5")) {
            ps5Masalar.push({ masa_no: masa.masa_no, id: masa.id });
          } else if (cihazTuru.includes("ps4")) {
            ps4Masalar.push({ masa_no: masa.masa_no, id: masa.id });
          }
        }

        // Cihaz 2'yi kontrol et (varsa)
        if (masa.cihaz2?.yuklu_oyunlar?.includes(oyun.id)) {
          const cihazTuru = masa.cihaz2.cihaz_turu?.toLowerCase() || "";
          
          if (cihazTuru.includes("ps3")) {
            ps3Masalar.push({ masa_no: masa.masa_no, id: masa.id });
          } else if (cihazTuru.includes("ps5")) {
            ps5Masalar.push({ masa_no: masa.masa_no, id: masa.id });
          } else if (cihazTuru.includes("ps4")) {
            ps4Masalar.push({ masa_no: masa.masa_no, id: masa.id });
          }
        }
      });

      // Duplicate masaları kaldır ve sırala
      const uniquePs3 = Array.from(
        new Map(ps3Masalar.map((m) => [m.masa_no, m])).values()
      ).sort((a, b) => a.masa_no - b.masa_no);

      const uniquePs4 = Array.from(
        new Map(ps4Masalar.map((m) => [m.masa_no, m])).values()
      ).sort((a, b) => a.masa_no - b.masa_no);

      const uniquePs5 = Array.from(
        new Map(ps5Masalar.map((m) => [m.masa_no, m])).values()
      ).sort((a, b) => a.masa_no - b.masa_no);

      return {
        ...oyun,
        ps3_masalar: uniquePs3,
        ps4_masalar: uniquePs4,
        ps5_masalar: uniquePs5,
      };
    });

    return NextResponse.json(oyunDetaylar);
  } catch (error) {
    console.error("Oyunlar getirilemedi:", error);
    return NextResponse.json(
      { error: "Oyunlar getirilemedi", details: error },
      { status: 500 }
    );
  }
}
