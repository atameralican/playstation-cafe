import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET - Masalar listele
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("masalar")
      .select("*")
      .eq("is_deleted", false)
      .order("masa_no", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Masalar getirilemedi:", error);
    return NextResponse.json(
      { error: "Masalar getirilemedi" },
      { status: 500 }
    );
  }
}

// POST - Yeni masa ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Cihaz 1 bilgilerini al
    let cihaz1Object = null;
    let yukluOyunlar: any[] = [];

    if (body.cihaz) {
      const { data: cihazData, error: cihazError } = await supabase
        .from("cihazlar")
        .select("*")
        .eq("id", body.cihaz)
        .single();

      if (cihazError) throw cihazError;
      cihaz1Object = cihazData;

      // Cihaz 1'in yüklü oyunlarını al
      if (cihazData?.yuklu_oyunlar && cihazData.yuklu_oyunlar.length > 0) {
        const { data: oyunlar1, error: oyunError1 } = await supabase
          .from("oyunlar")
          .select("*")
          .in("id", cihazData.yuklu_oyunlar);

        if (!oyunError1 && oyunlar1) {
          yukluOyunlar = [...yukluOyunlar, ...oyunlar1];
        }
      }
    }

    // Cihaz 2 bilgilerini al (opsiyonel)
    let cihaz2Object = null;
    if (body.cihaz2) {
      const { data: cihazData2, error: cihazError2 } = await supabase
        .from("cihazlar")
        .select("*")
        .eq("id", body.cihaz2)
        .single();

      if (cihazError2) throw cihazError2;
      cihaz2Object = cihazData2;

      // Cihaz 2'nin yüklü oyunlarını al
      if (cihazData2?.yuklu_oyunlar && cihazData2.yuklu_oyunlar.length > 0) {
        const { data: oyunlar2, error: oyunError2 } = await supabase
          .from("oyunlar")
          .select("*")
          .in("id", cihazData2.yuklu_oyunlar);

        if (!oyunError2 && oyunlar2) {
          // Duplicate oyunları engelle
          const mevcutOyunIds = new Set(yukluOyunlar.map((o) => o.id));
          const yeniOyunlar = oyunlar2.filter((o) => !mevcutOyunIds.has(o.id));
          yukluOyunlar = [...yukluOyunlar, ...yeniOyunlar];
        }
      }
    }

    // Televizyon bilgilerini al
    let televizyonObject = null;
    if (body.tv) {
      const { data: tvData, error: tvError } = await supabase
        .from("televizyonlar")
        .select("*")
        .eq("id", body.tv)
        .single();

      if (tvError) throw tvError;
      televizyonObject = tvData;
    }

    // Masayı kaydet
    const { data, error } = await supabase
      .from("masalar")
      .insert([
        {
          masa_no: body.masa_no,
          cihaz: cihaz1Object,
          cihaz2: cihaz2Object,
          televizyon: televizyonObject,
          yuklu_oyunlar: yukluOyunlar,
          aciklama: body.aciklama || null,
          problem: body.problem || null,
          durum: "aktif",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Masa ekleme hatası:", error);
    return NextResponse.json(
      {
        error: "Masa eklenemedi",
        details: error,
      },
      { status: 500 }
    );
  }
}

// PUT - Masa güncelle
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    // Cihaz 1 bilgilerini al
    let cihaz1Object = null;
    let yukluOyunlar: any[] = [];

    if (updateData.cihaz) {
      const { data: cihazData, error: cihazError } = await supabase
        .from("cihazlar")
        .select("*")
        .eq("id", updateData.cihaz)
        .single();

      if (cihazError) throw cihazError;
      cihaz1Object = cihazData;

      // Cihaz 1'in yüklü oyunlarını al
      if (cihazData?.yuklu_oyunlar && cihazData.yuklu_oyunlar.length > 0) {
        const { data: oyunlar1, error: oyunError1 } = await supabase
          .from("oyunlar")
          .select("*")
          .in("id", cihazData.yuklu_oyunlar);

        if (!oyunError1 && oyunlar1) {
          yukluOyunlar = [...yukluOyunlar, ...oyunlar1];
        }
      }
    }

    // Cihaz 2 bilgilerini al (opsiyonel)
    let cihaz2Object = null;
    if (updateData.cihaz2) {
      const { data: cihazData2, error: cihazError2 } = await supabase
        .from("cihazlar")
        .select("*")
        .eq("id", updateData.cihaz2)
        .single();

      if (cihazError2) throw cihazError2;
      cihaz2Object = cihazData2;

      // Cihaz 2'nin yüklü oyunlarını al
      if (cihazData2?.yuklu_oyunlar && cihazData2.yuklu_oyunlar.length > 0) {
        const { data: oyunlar2, error: oyunError2 } = await supabase
          .from("oyunlar")
          .select("*")
          .in("id", cihazData2.yuklu_oyunlar);

        if (!oyunError2 && oyunlar2) {
          // Duplicate oyunları engelle
          const mevcutOyunIds = new Set(yukluOyunlar.map((o) => o.id));
          const yeniOyunlar = oyunlar2.filter((o) => !mevcutOyunIds.has(o.id));
          yukluOyunlar = [...yukluOyunlar, ...yeniOyunlar];
        }
      }
    }

    // Televizyon bilgilerini al
    let televizyonObject = null;
    if (updateData.tv) {
      const { data: tvData, error: tvError } = await supabase
        .from("televizyonlar")
        .select("*")
        .eq("id", updateData.tv)
        .single();

      if (tvError) throw tvError;
      televizyonObject = tvData;
    }

    // Masayı güncelle
    const { data, error } = await supabase
      .from("masalar")
      .update({
        masa_no: updateData.masa_no,
        cihaz: cihaz1Object,
        cihaz2: cihaz2Object,
        televizyon: televizyonObject,
        yuklu_oyunlar: yukluOyunlar,
        aciklama: updateData.aciklama || null,
        problem: updateData.problem || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parseInt(id))
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Masa güncelleme hatası:", error);
    return NextResponse.json(
      {
        error: "Masa güncellenemedi",
        details: error,
      },
      { status: 500 }
    );
  }
}
