import { supabase } from '@/lib/supabase';
//resim eklerken dosyanın supabase-storage 'a atılması için 
export async function uploadImageToStorage(
  file: File,
  oyunAdi: string,
  oyunId?: number
): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = oyunId 
      ? `${oyunAdi.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${oyunId}.${fileExt}`
      : `${oyunAdi.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}.${fileExt}`;

    // Storage'a yükle
    const { data, error } = await supabase.storage
      .from('oyun-gorselleri')
      .upload(fileName, file, {
        cacheControl: '31536000',
        upsert: true
      });

    if (error) throw error;

    // Public URL al
    const { data: urlData } = supabase.storage
      .from('oyun-gorselleri')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Upload hatası:', error);
    return null;
  }
}