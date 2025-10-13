import {  NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';


export async function GET() {
  const { data, error } = await supabase
    .from('hesaplar')
    .select('id, mail, kullanici_adi')
    .order('mail', { ascending: true });

  if (error) throw error;
  return NextResponse.json(data);
}