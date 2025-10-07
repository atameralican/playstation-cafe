// components/GlobalLoadingOverlay.tsx
"use client";

import React from "react";
import { useGlobalLoading } from "@/components/useServiceHook/useServiceHook";
import { Loader2 } from "lucide-react";

const GlobalLoadingOverlay = () => {
  const { loadings, isLoading } = useGlobalLoading();

  if (!isLoading) return null;

  return (
    <>
      {/* Blur overlay - tüm ekranı kaplar ve tıklamaları engeller */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
        style={{ pointerEvents: 'all' }} // Tüm tıklamaları engelle
      />
      
      {/* Loading content - blur'un üstünde */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
        <div className="bg-white rounded-lg p-8 shadow-2xl max-w-sm w-full mx-4 pointer-events-auto">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <div className="space-y-2 text-center w-full">
              {loadings.map((loading) => (
                <p key={loading.id} className="text-sm font-medium text-gray-700">
                  {loading.text}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GlobalLoadingOverlay;