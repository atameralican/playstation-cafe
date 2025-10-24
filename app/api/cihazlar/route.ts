import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/apiAuth";

// GET - Cihazlar listele 
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('cihazlar')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Cihazlar getirilemedi:', error);
    return NextResponse.json({ error: 'Cihazlar getirilemedi' }, { status: 500 });
  }
}

// POST - Yeni cihaz ekle (SADECE ADMIN)
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("cihazlar")
      .insert([
        {
          cihaz_turu: body.cihaz_turu,
          seri_no: body.seri_no || null,
          acilis_hesabi: body.acilis_hesabi || null,
          ikinci_hesap: body.ikinci_hesap || null,
          kol_iki_mail: body.kol_iki_mail || null,
          kasa_tipi: body.kasa_tipi || null,
          aciklama: body.aciklama || null,
          hafiza: body.hafiza || null,
          cihaz_fotograf: body.cihaz_fotograf || null,
          yuklu_oyunlar: body.yuklu_oyunlar || [],
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Cihaz ekleme hatası:", error);
    return NextResponse.json(
      {
        error: "Cihaz eklenemedi",
        details: error,
      },
      { status: 500 }
    );
  }
}

// PUT - Cihaz güncelle (SADECE ADMIN)
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
      .from("cihazlar")
      .update({
        cihaz_turu: updateData.cihaz_turu,
        seri_no: updateData.seri_no || null,
        acilis_hesabi: updateData.acilis_hesabi || null,
        ikinci_hesap: updateData.ikinci_hesap || null,
        kol_iki_mail: updateData.kol_iki_mail || null,
        kasa_tipi: updateData.kasa_tipi || null,
        aciklama: updateData.aciklama || null,
        hafiza: updateData.hafiza || null,
        cihaz_fotograf: updateData.cihaz_fotograf || null,
        yuklu_oyunlar: updateData.yuklu_oyunlar || [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", parseInt(id))
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Cihaz güncelleme hatası:", error);
    return NextResponse.json(
      {
        error: "Cihaz güncellenemedi",
        details: error,
      },
      { status: 500 }
    );
  }
}

// DELETE - Cihaz sil (soft delete) (SADECE ADMIN)
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
      .from("cihazlar")
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", parseInt(id));

    if (error) throw error;
    return NextResponse.json({ message: "Cihaz silindi" });
  } catch (error) {
    console.error("Cihaz silme hatası:", error);
    return NextResponse.json(
      { error: "Cihaz silinemedi" },
      { status: 500 }
    );
  }
}
