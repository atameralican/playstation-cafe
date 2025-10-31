import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/apiAuth";

// GET - Televizyonlar listele
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('televizyonlar')
      .select('id ,marka ,model ,seriNo ,boyut ,garanti ,ariza ,aciklama ,tv_fotograf ')
      .eq('is_deleted', false)
      .order('marka', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Televizyonlar getirilemedi:', error);
    return NextResponse.json({ error: 'Televizyonlar getirilemedi' }, { status: 500 });
  }
}

// POST - Yeni televizyon ekle (SADECE ADMIN)
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("televizyonlar")
      .insert([
        {
          marka: body.marka,
          model: body.model || null,
          seriNo: body.seriNo || null,
          boyut: body.boyut,
          garanti: body.garanti,
          ariza: body.ariza,
          aciklama: body.aciklama || null,
          tv_fotograf: body.tv_fotograf || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Televizyon ekleme hatası:", error);
    return NextResponse.json(
      {
        error: "Televizyon eklenemedi",
        details: error,
      },
      { status: 500 }
    );
  }
}

// PUT - Televizyon güncelle (SADECE ADMIN)
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
      .from("televizyonlar")
      .update({
        marka: updateData.marka,
        model: updateData.model || null,
        seriNo: updateData.seriNo || null,
        boyut: updateData.boyut,
        garanti: updateData.garanti,
        ariza: updateData.ariza,
        aciklama: updateData.aciklama || null,
        tv_fotograf: updateData.tv_fotograf || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parseInt(id))
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Televizyon güncelleme hatası:", error);
    return NextResponse.json(
      {
        error: "Televizyon güncellenemedi",
        details: error,
      },
      { status: 500 }
    );
  }
}

// DELETE - Televizyon sil (soft delete) (SADECE ADMIN)
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
      .from("televizyonlar")
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", parseInt(id));

    if (error) throw error;
    return NextResponse.json({ message: "Televizyon silindi" });
  } catch (error) {
    console.error("Televizyon silme hatası:", error);
    return NextResponse.json(
      { error: "Televizyon silinemedi" },
      { status: 500 }
    );
  }
}
