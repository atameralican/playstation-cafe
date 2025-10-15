import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { acilis_hesabi, ikinci_hesap } = body;

    // En az bir hesap seçilmiş olmalı
    if (!acilis_hesabi && !ikinci_hesap) {
      return NextResponse.json(
        { error: "En az bir hesap seçilmelidir", oyunlar: [] },
        { status: 200 }
      );
    }

    // Seçili hesapların mail adreslerini array'e topla
    const hesapMailler = [];
    if (acilis_hesabi) hesapMailler.push(acilis_hesabi);
    if (ikinci_hesap) hesapMailler.push(ikinci_hesap);

    // Bu mail adreslerine ait hesapları getir
    const { data: hesaplar, error: hesapError } = await supabase
      .from("hesaplar")
      .select("id, mail, oyunlar")
      .in("mail", hesapMailler);

    if (hesapError) throw hesapError;

    // Hesaplardaki tüm oyun ID'lerini topla (unique olarak)
    const tumOyunIdleri = new Set<number>();
    
    hesaplar?.forEach((hesap) => {
      if (hesap.oyunlar && Array.isArray(hesap.oyunlar)) {
        hesap.oyunlar.forEach((oyunId: number) => {
          tumOyunIdleri.add(oyunId);
        });
      }
    });

    // Eğer hiç oyun yoksa boş dön
    if (tumOyunIdleri.size === 0) {
      return NextResponse.json({ oyunlar: [] });
    }

    // Bu ID'lere ait oyunları getir
    const { data: oyunlar, error: oyunError } = await supabase
      .from("oyunlar")
      .select("id, oyun_adi, cihaz_turu, kategori, gorsel")
      .in("id", Array.from(tumOyunIdleri))
      .order("oyun_adi", { ascending: true });

    if (oyunError) throw oyunError;

    // Oyunları label-value formatında dönüştür (TagBox için)
    const formattedOyunlar = oyunlar?.map((oyun) => ({
      value: oyun.id.toString(),
      label: oyun.oyun_adi,
      ...oyun // Diğer bilgileri de saklayalım (görsel, kategori vs.)
    })) || [];

    return NextResponse.json({ 
      oyunlar: formattedOyunlar,
      toplamOyun: formattedOyunlar.length 
    });

  } catch (error) {
    console.error("Hesap oyunları getirilemedi:", error);
    return NextResponse.json(
      { error: "Hesap oyunları getirilemedi", details: error },
      { status: 500 }
    );
  }
}