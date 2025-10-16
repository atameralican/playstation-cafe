import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';



export async function GET() {
    try {
        const { data, error } = await supabase
            .from('cihazlar')
            .select('id, cihaz_turu, kasa_tipi,acilis_hesabi,ikinci_hesap ')
            .eq('is_deleted', false)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        console.error('Cihazlar getirilemedi:', error);
        return NextResponse.json({ error: 'Cihazlar getirilemedi' }, { status: 500 });
    }
}