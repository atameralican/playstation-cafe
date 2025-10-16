import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// DELETE - Masa sil (soft delete with reason)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const reason = searchParams.get("reason") || "Belirtilmemiş";
    const deletedBy = searchParams.get("deleted_by") || "Admin"; // Auth eklenince düzenlenecek

    const { error } = await supabase
      .from("masalar")
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        deleted_by: deletedBy,
        deleted_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq("id", parseInt(id));

    if (error) throw error;
    return NextResponse.json({ 
      message: "Masa silindi",
      reason: reason 
    });
  } catch (error) {
    console.error("Masa silme hatası:", error);
    return NextResponse.json(
      { error: "Masa silinemedi" },
      { status: 500 }
    );
  }
}
