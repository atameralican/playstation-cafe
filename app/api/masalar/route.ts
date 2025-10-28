import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/apiAuth";

// GET - Masalar listele
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("masalar")
      .select("id,masa_no,durum,cihaz,cihaz2,televizyon,aciklama,problem")
      .eq("is_deleted", false)
      .order("masa_no", { ascending: true });

    if (error) throw error;

    // Oyun sayısını hesapla
    const result = data.map(masa => {
      const oyunIds = [
        ...(masa.cihaz?.yuklu_oyunlar || []),
        ...(masa.cihaz2?.yuklu_oyunlar || [])
      ];
      const uniqueOyunIds = [...new Set(oyunIds)];
      
      return {
        ...masa,
        yuklu_oyun_sayisi: uniqueOyunIds.length
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Masalar getirilemedi:", error);
    return NextResponse.json(
      { error: "Masalar getirilemedi" },
      { status: 500 }
    );
  }
}

// POST - Yeni masa ekle (SADECE ADMIN)
export async function POST(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    // ✅ Cihaz 1 - Sadece gerekli alanları al
    let cihaz1Object = null;
    if (body.cihaz) {
      const { data: cihazData, error: cihazError } = await supabase
        .from("cihazlar")
        .select("id,yuklu_oyunlar,cihaz_turu,kasa_tipi")
        .eq("id", body.cihaz)
        .single();

      if (cihazError) throw cihazError;
      cihaz1Object = cihazData;
    }

    // ✅ Cihaz 2 - Sadece gerekli alanları al
    let cihaz2Object = null;
    if (body.cihaz2) {
      const { data: cihazData2, error: cihazError2 } = await supabase
        .from("cihazlar")
        .select("id,yuklu_oyunlar,cihaz_turu,kasa_tipi")
        .eq("id", body.cihaz2)
        .single();

      if (cihazError2) throw cihazError2;
      cihaz2Object = cihazData2;
    }

    // ✅ Televizyon - Sadece gerekli alanları al
    let televizyonObject = null;
    if (body.tv) {
      const { data: tvData, error: tvError } = await supabase
        .from("televizyonlar")
        .select("id,marka,boyut")
        .eq("id", body.tv)
        .single();

      if (tvError) throw tvError;
      televizyonObject = tvData;
    }

    // ✅ Masayı kaydet (yuklu_oyunlar YOK!)
    const { data, error } = await supabase
      .from("masalar")
      .insert([
        {
          masa_no: body.masa_no,
          cihaz: cihaz1Object,
          cihaz2: cihaz2Object,
          televizyon: televizyonObject,
          // ❌ yuklu_oyunlar: yukluOyunlar, KALDIRILDI!
          aciklama: body.aciklama || null,
          problem: body.problem || null,
          durum: "aktif",
        },
      ])
      .select("id,masa_no,durum,cihaz,cihaz2,televizyon,aciklama,problem")
      .single();

    if (error) throw error;

    // Oyun sayısını hesapla ve ekle
    const oyunIds = [
      ...(data.cihaz?.yuklu_oyunlar || []),
      ...(data.cihaz2?.yuklu_oyunlar || [])
    ];
    const result = {
      ...data,
      yuklu_oyun_sayisi: [...new Set(oyunIds)].length
    };

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Masa ekleme hatası:", error);
    return NextResponse.json(
      { error: "Masa eklenemedi", details: error },
      { status: 500 }
    );
  }
}

// PUT - Masa güncelle (SADECE ADMIN)
export async function PUT(request: NextRequest) {
  const authError = await requireAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    // ✅ Cihaz 1 - Sadece gerekli alanları al
    let cihaz1Object = null;
    if (updateData.cihaz) {
      const { data: cihazData, error: cihazError } = await supabase
        .from("cihazlar")
        .select("id,yuklu_oyunlar,cihaz_turu,kasa_tipi")
        .eq("id", updateData.cihaz)
        .single();

      if (cihazError) throw cihazError;
      cihaz1Object = cihazData;
    }

    // ✅ Cihaz 2 - Sadece gerekli alanları al
    let cihaz2Object = null;
    if (updateData.cihaz2) {
      const { data: cihazData2, error: cihazError2 } = await supabase
        .from("cihazlar")
        .select("id,yuklu_oyunlar,cihaz_turu,kasa_tipi")
        .eq("id", updateData.cihaz2)
        .single();

      if (cihazError2) throw cihazError2;
      cihaz2Object = cihazData2;
    }

    // ✅ Televizyon - Sadece gerekli alanları al
    let televizyonObject = null;
    if (updateData.tv) {
      const { data: tvData, error: tvError } = await supabase
        .from("televizyonlar")
        .select("id,marka,boyut")
        .eq("id", updateData.tv)
        .single();

      if (tvError) throw tvError;
      televizyonObject = tvData;
    }

    // ✅ Masayı güncelle (yuklu_oyunlar YOK!)
    const { data, error } = await supabase
      .from("masalar")
      .update({
        masa_no: updateData.masa_no,
        cihaz: cihaz1Object,
        cihaz2: cihaz2Object,
        televizyon: televizyonObject,
        // ❌ yuklu_oyunlar: yukluOyunlar, KALDIRILDI!
        aciklama: updateData.aciklama || null,
        problem: updateData.problem || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parseInt(id))
      .select("id,masa_no,durum,cihaz,cihaz2,televizyon,aciklama,problem")
      .single();

    if (error) throw error;

    // Oyun sayısını hesapla ve ekle
    const oyunIds = [
      ...(data.cihaz?.yuklu_oyunlar || []),
      ...(data.cihaz2?.yuklu_oyunlar || [])
    ];
    const result = {
      ...data,
      yuklu_oyun_sayisi: [...new Set(oyunIds)].length
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Masa güncelleme hatası:", error);
    return NextResponse.json(
      { error: "Masa güncellenemedi", details: error },
      { status: 500 }
    );
  }
}

// DELETE - Masa sil (soft delete) (SADECE ADMIN)
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
      .from("masalar")
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", parseInt(id));

    if (error) throw error;
    return NextResponse.json({ message: "Masa silindi" });
  } catch (error) {
    console.error("Masa silme hatası:", error);
    return NextResponse.json(
      { error: "Masa silinemedi" },
      { status: 500 }
    );
  }
}