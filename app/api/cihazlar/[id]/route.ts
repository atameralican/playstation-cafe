import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

//soft delte
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const { data, error } = await supabase
      .from("cihazlar")
      .update({ is_deleted: true, deleted_at: new Date().toISOString() }) //aut olayı olduğunda deleted_by eklenecek.
      .eq("id", params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Silme işlemi hatası - cşhaz:", error);
    return NextResponse.json(
      { error: "Cihaz silinemedi", details: error },
      { status: 500 }
    );
  }
}