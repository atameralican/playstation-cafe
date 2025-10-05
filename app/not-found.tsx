// app/not-found.tsx
"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center ">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="mb-6 text-xl">Oops! Sayfa bulunamadı.</p>
      <Link
        href="/"
        className="rounded-md bg-emerald-800 px-4 py-2 text-white hover:bg-emerald-600 transition"
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
