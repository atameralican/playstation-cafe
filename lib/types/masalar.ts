export interface Masa {
  id: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at?: string | null;
  deleted_by?: string | null;
  deleted_reason?: string | null;

  masa_no: string;
  durum?: "aktif" | "bakim" | "arizali" | "kapali";

  cihaz?: CihazMinimal | null;
  cihaz2?: CihazMinimal | null;
  televizyon?: TVMinimal | null;

  yuklu_oyun_sayisi?: number;

  aciklama?: string | null;
  problem?: string | null;
}

export interface CihazMinimal {
  id: number;
  cihaz_turu: string;
  kasa_tipi: string;
  yuklu_oyunlar?: number[];
}

export interface TVMinimal {
  id: number;
  marka: string;
  boyut: string;
}

export interface MinimalOyun {
  id: number;
  oyun_adi: string;
}