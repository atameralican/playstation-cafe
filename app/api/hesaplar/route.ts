import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/components/ui/alertDep";

// GET - Hesaplar listele
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("hesaplar")
      .select("*")
      .order("mail", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    showToast("Hesaplar getirilemedi:" + error, "error");
    return NextResponse.json(
      { error: "Hesaplar getirilemedi 500" },
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
    showToast("Hesap ekleme hatası:" + error, "error");
    return NextResponse.json(
      {
        error: "Hesap eklenemedi",
        details: error,
      },
      { status: 500 }
    );
  }
}
