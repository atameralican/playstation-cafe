import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';


export async function GET() {
  const { data, error } = await supabase

    .from('oyunlar')
    .select('id, oyun_adi,kategori,gorsel,kac_kisilik,ea_playde_mi,bulunan_masalar')
    // .eq('is_deleted', false)
    .order('oyun_adi', { ascending: true });


  if (error) throw error;
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate' },
  });
}