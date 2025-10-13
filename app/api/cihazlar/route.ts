import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/components/ui/alertDep";

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
    showToast (`Cihazlar getirilemedi: ${error}`, "error");
    return NextResponse.json({ error: 'Cihazlar getirilemedi' }, { status: 500 });
  }
}

// POST - Yeni hesap ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("cihazlar")
      .insert([
        {
          cihaz_turu: body.cihaz_turu,
          seri_no: body.seri_no || null,
          acilis_hesabi: body.acilis_hesabi|| null,
          ikinci_hesap: body.ikinci_hesap|| null,
          kol_iki_mail: body.kol_iki_mail|| null,
          kasa_tipi: body.kasa_tipi|| null,
          aciklama: body.aciklama|| null,
          cihaz_fotograf: body.cihaz_fotograf|| null,
         /////////// eğer hata yoksa baska bi klasmöre açı soft delete işlemini yap bu ve hesaplar için 
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


