import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/apiAuth'

// GET - Oyunları listele (is_deleted false olanlar)
// NOT: GET herkese açık (public sayfada gösterilecek)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('oyunlar')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Oyunlar getirilemedi:', error)
    return NextResponse.json({ error: 'Oyunlar getirilemedi' }, { status: 500 })
  }
}

// POST - Yeni oyun ekle (SADECE ADMIN)
export async function POST(request: NextRequest) {
  // Admin kontrolü
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const body = await request.json()

    const { data, error } = await supabase
      .from('oyunlar')
      .insert([
        {
          oyun_adi: body.oyunAdi,
          cihaz_turu: body.cihazTuru,
          kac_kisilik: parseInt(body.kacKisilik),
          kategori: body.kategori,
          ea_playde_mi: body.eaPlaydeMi === '1',
          gorsel: body.gorselUrl
        }
      ])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Oyun ekleme hatası:', error)
    return NextResponse.json(
      {
        error: 'Oyun eklenemedi',
        details: error
      },
      { status: 500 }
    )
  }
}

// PUT - Oyun güncelle (SADECE ADMIN)
export async function PUT(request: NextRequest) {
  // Admin kontrolü
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('oyunlar')
      .update({
        oyun_adi: updateData.oyunAdi,
        cihaz_turu: updateData.cihazTuru,
        kac_kisilik: parseInt(updateData.kacKisilik),
        kategori: updateData.kategori,
        ea_playde_mi: updateData.eaPlaydeMi === '1',
        gorsel: updateData.gorselUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', parseInt(id))
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Oyun güncelleme hatası:', error)
    return NextResponse.json(
      {
        error: 'Oyun güncellenemedi',
        details: error
      },
      { status: 500 }
    )
  }
}

// DELETE - Oyun sil (soft delete) (SADECE ADMIN)
export async function DELETE(request: NextRequest) {
  // Admin kontrolü
  const authError = await requireAdmin(request)
  if (authError) return authError

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID gerekli' }, { status: 400 })
    }

    const { error } = await supabase
      .from('oyunlar')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', parseInt(id))

    if (error) throw error
    return NextResponse.json({ message: 'Oyun silindi' })
  } catch (error) {
    console.error('Oyun silme hatası:', error)
    return NextResponse.json({ error: 'Oyun silinemedi' }, { status: 500 })
  }
}
