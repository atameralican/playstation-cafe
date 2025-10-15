import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';


export async function GET() {
  const { data, error } = await supabase
    .from('oyunlar')
    .select('id, oyun_adi')
    .order('oyun_adi', { ascending: true });

  if (error) throw error;
  return NextResponse.json(data);
}