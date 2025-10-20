import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/apiAuth";

// GET - Hesaplar listele (oyun detayları ile, is_deleted false olanlar)
export async function GET() {
  try {
    const { data: hesaplar, error: hesapError } = await supabase
      .from("hesaplar")
      .select("*")
      .eq("is_deleted", false)
      .order("mail", { ascending: false });

    if (hesapError) throw hesapError;

    if (!hesaplar || hesaplar.length === 0) {
      return NextResponse.json([]);
    }

    const tumOyunIdleri = Array.from(
      new Set(
        hesaplar
          .flatMap((hesap) => hesap.oyunlar || [])
          .filter((id) => id != null)
      )
    );

    const { data: oyunlar, error: oyunError } = await supabase
      .from("oyunlar")
      .select("id, oyun_adi")
      .in("id", tumOyunIdleri);

    if (oyunError) throw oyunError;

    const oyunMap = new Map(
      oyunlar?.map((oyun) => [oyun.id, oyun.oyun_adi]) || []
    );

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
    return NextResponse.json(
      { error: "Hesaplar getirilemedi", details: error },
      { status: 500 }
    );
  }
}

// POST - Yeni hesap ekle (SADECE ADMIN)
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

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
    return NextResponse.json(
      {
        error: "Hesap eklenemedi",
        details: error,
      },
      { status: 500 }
    );
  }
}

// PUT - Hesap güncelle (SADECE ADMIN)
export async function PUT(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("hesaplar")
      .update({
        mail: updateData.mail,
        mail_sifre: updateData.mail_sifre || null,
        kullanici_adi: updateData.kullanici_adi,
        ea_play_varmi: updateData.ea_play_varmi === true || updateData.ea_play_varmi === "1",
        ea_play_alinma_tarihi: updateData.ea_play_alinma_tarihi || null,
        ea_play_bitis_tarihi: updateData.ea_play_bitis_tarihi || null,
        oyunlar: updateData.oyunlar || [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", parseInt(id))
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Hesap güncelleme hatası:", error);
    return NextResponse.json(
      {
        error: "Hesap güncellenemedi",
        details: error,
      },
      { status: 500 }
    );
  }
}

// DELETE - Hesap sil (soft delete) (SADECE ADMIN)
export async function DELETE(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    const { error } = await supabase
      .from("hesaplar")
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", parseInt(id));

    if (error) throw error;
    return NextResponse.json({ message: "Hesap silindi" });
  } catch (error) {
    console.error("Hesap silme hatası:", error);
    return NextResponse.json(
      { error: "Hesap silinemedi" },
      { status: 500 }
    );
  }
}
