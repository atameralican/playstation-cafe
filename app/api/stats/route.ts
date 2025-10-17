import {  NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
//Bütün 
export async function GET() {
  try {
    const [oyunRes, hesapRes, cihazRes, tvRes, masaRes] = await Promise.all([
  supabase.from('oyunlar').select('*', { count: 'exact', head: true }).eq('is_deleted', false).order('created_at', { ascending: false }),
  supabase.from('hesaplar').select('*', { count: 'exact', head: true }).eq('is_deleted', false).order('created_at', { ascending: false }),
  supabase.from('cihazlar').select('*', { count: 'exact', head: true }).eq('is_deleted', false).order('created_at', { ascending: false }),
  supabase.from('televizyonlar').select('*', { count: 'exact', head: true }).eq('is_deleted', false).order('created_at', { ascending: false }),
  supabase.from('masalar').select('*', { count: 'exact', head: true }).eq('is_deleted', false).order('created_at', { ascending: false }),
]);

if (oyunRes.error || hesapRes.error||cihazRes.error||tvRes.error||masaRes.error) {
  throw oyunRes.error || hesapRes.error||cihazRes.error||tvRes.error||masaRes.error;
}

return NextResponse.json({
  oyunCount: oyunRes.count,
  hesapCount: hesapRes.count,
  cihazCount: cihazRes.count,
  tvCount:  tvRes.count,
  masaCount: masaRes.count,
});
  } catch (error) {
    console.error('Sayılar getirilemedi:', error);
    return NextResponse.json({ error: 'Sayılar getirilemedi' }, { status: 500 });
  }
}