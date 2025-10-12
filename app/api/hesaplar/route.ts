import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/components/ui/alertDep";

// GET - Hesaplar listele (oyun detayları ile)
export async function GET() {
  try {
    // Önce hesapları çek
    const { data: hesaplar, error: hesapError } = await supabase
      .from("hesaplar")
      .select("*")
      .order("mail", { ascending: false });

    if (hesapError) throw hesapError;

    // Eğer hesap yoksa boş array döndür
    if (!hesaplar || hesaplar.length === 0) {
      return NextResponse.json([]);
    }

    // Tüm oyun ID'lerini topla
    const tumOyunIdleri = Array.from(
      new Set(
        hesaplar
          .flatMap((hesap) => hesap.oyunlar || [])
          .filter((id) => id != null)
      )
    );

    // Oyunları bir seferde çek
    const { data: oyunlar, error: oyunError } = await supabase
      .from("oyunlar")
      .select("id, oyun_adi")
      .in("id", tumOyunIdleri);

    if (oyunError) throw oyunError;

    // Oyun ID -> Oyun Adı mapping oluştur
    const oyunMap = new Map(
      oyunlar?.map((oyun) => [oyun.id, oyun.oyun_adi]) || []
    );

    // Hesaplara oyun detaylarını ekle
    const enrichedHesaplar = hesaplar.map((hesap) => ({
      ...hesap,
      oyun_detaylari:
        hesap.oyunlar?.map((oyunId: number) => ({
          id: oyunId,
          oyun_adi: oyunMap.get(oyunId) || "Bilinmeyen Oyun",
        })) || [],
    }));

    return NextResponse.json(enrichedHesaplar);
  } catch (error) {
    console.error("Hesaplar getirilemedi:", error);
    showToast (`Hesaplar getirilemedi: ${error}`, "error");
    return NextResponse.json(
      { error: "Hesaplar getirilemedi", details: error },
      { status: 500 }
    );
  }
}

// POST - Yeni hesap ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("hesaplar")
      .insert([
        {
          mail: body.mail,
          mail_sifre: body.mail_sifre || null,
          kullanici_adi: body.kullanici_adi,
          ea_play_varmi:
            body.ea_play_varmi === true || body.ea_play_varmi === "1",
          ea_play_alinma_tarihi: body.ea_play_alinma_tarihi || null,
          ea_play_bitis_tarihi: body.ea_play_bitis_tarihi || null,
          oyunlar: body.oyunlar || [],
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Hesap ekleme hatası:", error);
    showToast (`Ekleme hatası: ${error}`, "error");
    return NextResponse.json(
      {
        error: "Hesap eklenemedi",
        details: error,
      },
      { status: 500 }
    );
  }
}