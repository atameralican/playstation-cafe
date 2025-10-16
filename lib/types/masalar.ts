// ===============================================
// MASALAR SİSTEMİ - TYPE TANIMLARI
// ===============================================

/**
 * Masa interface'i
 * Veritabanındaki masalar tablosunun TypeScript karşılığı
 */
export interface Masa {
  // Temel Alanlar
  id: number;
  created_at: string;
  updated_at: string;

  // Soft Delete
  is_deleted: boolean;
  deleted_at?: string | null;
  deleted_by?: string | null;
  deleted_reason?: string | null;

  // Ana Bilgiler
  masa_no: string;
  durum?: "aktif" | "bakim" | "arizali" | "kapali";

  // JSONB Objeler
  cihaz?: CihazObject | null;
  cihaz2?: CihazObject | null;
  televizyon?: TelevizionObject | null;
  yuklu_oyunlar?: OyunObject[] | null;

  // Ek Bilgiler
  aciklama?: string | null;
  problem?: string | null;
  konum?: string | null;
  ozellikler?: string[] | null;

  // Ekstra Alanlar
  ekstra_1?: string | null;
  ekstra_2?: string | null;
  ekstra_3?: any | null;
}

/**
 * Cihaz objesi (JSONB içinde saklanır)
 * Cihazlar tablosundaki bir kaydın snapshot'ı
 */
export interface CihazObject {
  id: number;
  created_at: string;
  updated_at: string;
  cihaz_turu: string;
  seri_no?: string | null;
  acilis_hesabi?: string | null;
  ikinci_hesap?: string | null;
  kol_iki_mail?: string | null;
  kasa_tipi?: string | null;
  aciklama?: string | null;
  cihaz_fotograf?: string | null;
  yuklu_oyunlar?: number[] | null;
  ekstra_1?: string | null;
  ekstra_2?: string | null;
}

/**
 * Televizyon objesi (JSONB içinde saklanır)
 * Televizyonlar tablosundaki bir kaydın snapshot'ı
 */
export interface TelevizionObject {
  id: number;
  created_at: string;
  updated_at: string;
  marka: string;
  model?: string | null;
  seriNo?: string | null;
  boyut: string;
  garanti: boolean;
  ariza: boolean;
  aciklama?: string | null;
  tv_fotograf?: string | null;
  ekstra_1?: string | null;
  ekstra_2?: string | null;
}

/**
 * Oyun objesi (JSONB içinde saklanır)
 * Oyunlar tablosundaki bir kaydın snapshot'ı
 */
export interface OyunObject {
  id: number;
  created_at: string;
  oyun_adi: string;
  cihaz_turu: string;
  kac_kisilik: number;
  kategori: string;
  ea_playde_mi: boolean;
  gorsel?: string | null;
}

/**
 * Masa ekleme/güncelleme için form data
 */
export interface MasaFormData {
  masa_no: string;
  cihaz: string;
  cihaz2?: string;
  tv: string;
  aciklama?: string;
  problem?: string;
}

/**
 * Masa POST/PUT request body
 */
export interface MasaRequestBody {
  id?: number;
  masa_no: string;
  cihaz: string | number;
  cihaz2?: string | number;
  tv: string | number;
  aciklama?: string;
  problem?: string;
}

/**
 * Masa DELETE query parameters
 */
export interface MasaDeleteParams {
  reason: string;
  deleted_by?: string;
}

/**
 * API Response types
 */
export interface MasaApiResponse {
  success: boolean;
  data?: Masa | Masa[];
  error?: string;
  message?: string;
}

/**
 * Masa durum seçenekleri
 */
export const MASA_DURUM_OPTIONS = [
  { label: "Aktif", value: "aktif" },
  { label: "Bakımda", value: "bakim" },
  { label: "Arızalı", value: "arizali" },
  { label: "Kapalı", value: "kapali" },
] as const;

/**
 * Masa durumu type
 */
export type MasaDurumu = (typeof MASA_DURUM_OPTIONS)[number]["value"];
