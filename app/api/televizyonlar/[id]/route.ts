import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// PUT - Televizyon güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from("televizyonlar")
      .update({
        marka: body.marka,
        model: body.model || null,
        seriNo: body.seriNo || null,
        boyut: body.boyut,
        garanti: body.garanti,
        ariza: body.ariza,
        aciklama: body.aciklama || null,
        tv_fotograf: body.tv_fotograf || null,
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
      { error: "Televizyon güncellenemedi", details: error },
      { status: 500 }
    );
  }
}

// DELETE - Televizyon sil (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("televizyonlar")
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
      { error: "Televizyon silinemedi", details: error },
      { status: 500 }
    );
  }
}