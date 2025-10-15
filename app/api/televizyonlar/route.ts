import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/components/ui/alertDep";

// GET - tvler list
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('televizyonlar')
      .select('*')
      .eq('is_deleted', false)
      .order('marka', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Televizyonlar getirilemedi:', error);
    showToast(`Televizyonlar getirilemedi: ${error}`, "error");
    return NextResponse.json({ error: 'Televizyonlar getirilemedi' }, { status: 500 });
  }
}

// POST - Yeni tv ekle
export async function POST(request: NextRequest) {
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
    showToast(`Ekleme hatası: ${error}`, "error");
    return NextResponse.json(
      {
        error: "Televizyon eklenemedi",
        details: error,
      },
      { status: 500 }
    );
  }
}


