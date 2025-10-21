'use client'

import { useState, useEffect } from 'react'
import { useServiceHook } from '@/components/useServiceHook/useServiceHook'
import { showToast } from '@/components/ui/alertDep'
import Image from 'next/image'
import defaultImg from '@/public/logo.png'

interface MasaBilgisi {
  masa_no: number
  id: number
}

interface Oyun {
  id: number
  oyun_adi: string
  cihaz_turu: string
  kac_kisilik: number
  kategori: string
  ea_playde_mi: boolean
  gorsel: string | null
  aciklama?: string
  ps3_masalar: MasaBilgisi[]
  ps4_masalar: MasaBilgisi[]
  ps5_masalar: MasaBilgisi[]
}

export default function OyunlarPage() {
  const [oyunlar, setOyunlar] = useState<Oyun[]>([])
  const [filtreliOyunlar, setFiltreliOyunlar] = useState<Oyun[]>([])
  const [aramaMetni, setAramaMetni] = useState('')
  const [secilenKategori, setSecilenKategori] = useState('Tümü')
  const [secilenPlatform, setSecilenPlatform] = useState('Tümü')
  const { serviseGit } = useServiceHook()

  useEffect(() => {
    oyunlariYukle()
  }, [])

  useEffect(() => {
    filtrele()
  }, [aramaMetni, secilenKategori, secilenPlatform, oyunlar])

  const oyunlariYukle = async () => {
    await serviseGit<Oyun[]>({
      url: '/api/public/oyunlar',
      method: 'GET',
      onSuccess: (data) => {
        setOyunlar(data)
        setFiltreliOyunlar(data)
      },
      onError: (error) => {
        showToast(`Oyunlar yüklenemedi: ${error.message}`, 'error')
      },
    })
  }

  const filtrele = () => {
    let sonuc = [...oyunlar]

    // Arama filtresi
    if (aramaMetni) {
      sonuc = sonuc.filter((oyun) =>
        oyun.oyun_adi.toLowerCase().includes(aramaMetni.toLowerCase())
      )
    }

    // Kategori filtresi
    if (secilenKategori !== 'Tümü') {
      sonuc = sonuc.filter((oyun) => oyun.kategori === secilenKategori)
    }

    // Platform filtresi
    if (secilenPlatform !== 'Tümü') {
      sonuc = sonuc.filter((oyun) => {
        if (secilenPlatform === 'PS3') return oyun.ps3_masalar.length > 0
        if (secilenPlatform === 'PS4') return oyun.ps4_masalar.length > 0
        if (secilenPlatform === 'PS5') return oyun.ps5_masalar.length > 0
        return true
      })
    }

    setFiltreliOyunlar(sonuc)
  }

  // Unique kategorileri al
  const kategoriler = ['Tümü', ...new Set(oyunlar.map((o) => o.kategori))]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Oyun Listesi
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Cafemizde bulunan tüm oyunları keşfedin
          </p>
        </div>

        {/* Filtreler */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Arama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🔍 Oyun Ara
              </label>
              <input
                type="text"
                placeholder="Oyun adı yazın..."
                value={aramaMetni}
                onChange={(e) => setAramaMetni(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🎮 Kategori
              </label>
              <select
                value={secilenKategori}
                onChange={(e) => setSecilenKategori(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                {kategoriler.map((kat) => (
                  <option key={kat} value={kat}>
                    {kat}
                  </option>
                ))}
              </select>
            </div>

            {/* Platform */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🕹️ Platform
              </label>
              <select
                value={secilenPlatform}
                onChange={(e) => setSecilenPlatform(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
              >
                <option value="Tümü">Tümü</option>
                <option value="PS3">PS3</option>
                <option value="PS4">PS4</option>
                <option value="PS5">PS5</option>
              </select>
            </div>
          </div>

          {/* Sonuç sayısı */}
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <strong>{filtreliOyunlar.length}</strong> oyun bulundu
          </div>
        </div>

        {/* Oyun Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtreliOyunlar.map((oyun) => (
            <div
              key={oyun.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Görsel */}
              <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600">
                <Image
                  src={oyun.gorsel || defaultImg}
                  alt={oyun.oyun_adi}
                  fill
                  className="object-cover"
                />
                {oyun.ea_playde_mi && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    EA Play
                  </div>
                )}
              </div>

              {/* İçerik */}
              <div className="p-5">
                {/* Oyun Adı */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                  {oyun.oyun_adi}
                </h3>

                {/* Bilgiler */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">📂</span>
                    <span className="text-gray-700 dark:text-gray-300">{oyun.kategori}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {oyun.kac_kisilik === 1 ? '👤' : '👥'}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {oyun.kac_kisilik} Kişilik
                    </span>
                  </div>
                </div>

                {/* Masalar */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    📍 Nerede:
                  </p>

                  {oyun.ps3_masalar.length === 0 &&
                  oyun.ps4_masalar.length === 0 &&
                  oyun.ps5_masalar.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      Şu an hiçbir masada yok
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {oyun.ps3_masalar.length > 0 && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 min-w-[45px]">
                            PS3:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {oyun.ps3_masalar.map((masa) => (
                              <span
                                key={masa.id}
                                className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
                              >
                                Masa {masa.masa_no}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {oyun.ps4_masalar.length > 0 && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-medium text-purple-600 dark:text-purple-400 min-w-[45px]">
                            PS4:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {oyun.ps4_masalar.map((masa) => (
                              <span
                                key={masa.id}
                                className="inline-block px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-medium"
                              >
                                Masa {masa.masa_no}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {oyun.ps5_masalar.length > 0 && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 min-w-[45px]">
                            PS5:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {oyun.ps5_masalar.map((masa) => (
                              <span
                                key={masa.id}
                                className="inline-block px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-xs font-medium"
                              >
                                Masa {masa.masa_no}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Boş durum */}
        {filtreliOyunlar.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400 dark:text-gray-600">
              😔 Oyun bulunamadı
            </p>
            <p className="text-gray-500 dark:text-gray-500 mt-2">
              Farklı filtreler deneyin
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
