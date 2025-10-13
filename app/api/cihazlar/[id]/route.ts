import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Promise<> ekleyin
) {
  try {
    const { id } = await params; // await ekleyin
    
    const { data, error } = await supabase
      .from("cihazlar")
      .update({ is_deleted: true, deleted_at: new Date().toISOString() })
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