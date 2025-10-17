import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// PUT - Cihaz güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from("cihazlar")
      .update({
        cihaz_turu: body.cihaz_turu,
        seri_no: body.seri_no || null,
        acilis_hesabi: body.acilis_hesabi || null,
        ikinci_hesap: body.ikinci_hesap || null,
        kol_iki_mail: body.kol_iki_mail || null,
        kasa_tipi: body.kasa_tipi || null,
        aciklama: body.aciklama || null,
        cihaz_fotograf: body.cihaz_fotograf || null,
        yuklu_oyunlar: body.yuklu_oyunlar || [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Cihaz güncellenemedi", details: error },
      { status: 500 }
    );
  }
}

// DELETE - Cihaz sil (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("cihazlar")
      .update({ 
        is_deleted: true, 
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Silme hatası:", error);
    return NextResponse.json(
      { error: "Cihaz silinemedi", details: error },
      { status: 500 }
    );
  }
}