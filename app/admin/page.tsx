import LoaderDeplasman from '@/components/ui/loaderDep';
import React from 'react';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
        Dashboard
      </h1>

     <button></button>
      <LoaderDeplasman visible={false}/>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="p-6 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200 dark:border-neutral-700"
          >
            <h3 className="text-lg font-semibold mb-2">İstatistik {idx + 1}</h3>
            <p className="text-3xl font-bold">1,234</p>
          </div>
        ))}
      </div>
    </div>
  );
}