import { cn } from "@/lib/utils";
import "@radix-ui/themes/styles.css";
import { Gamepad2 } from "lucide-react";
import * as React from "react";
import Image from "next/image";
import logo from "@/public/logo.png";

interface MasaBilgisi {
  masa_no: number;
  id: number;
}

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[22rem] md:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title = "",
  description,
  person,
  category,
  eaPlay,
  gorsel,
  ps3_masalar,
  ps4_masalar,
  ps5_masalar,
}: {
  className?: string;
  gorsel?: string;
  person?: number;
  category?: string;
  title: string;
  description?: string | React.ReactNode;
  eaPlay?: boolean;
  ps3_masalar?: MasaBilgisi[];
  ps4_masalar?: MasaBilgisi[];
  ps5_masalar?: MasaBilgisi[];
}) => {
  return (
    <div
      className={cn(
        "group/bento shadow-input row-span-1 flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 transition duration-200 hover:shadow-xl dark:border-white/[0.2] dark:bg-black dark:shadow-none",
        className
      )}
    >
      <div className="transition duration-200">
        <div className="flex flex-row md:flex-col gap-3 md:gap-4">
          {/* fotorafı */}
          <div className="relative w-2/5 md:w-full h-32 md:h-48 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              alt={title}
              src={gorsel || logo}
              fill
              className="object-cover"
            />
          </div>

          {/* kategori kol sayısı vb bilgiler */}
          <div className="flex flex-col justify-end md:justify-between w-3/5 md:w-full">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300">
                {category}
              </span>
              {eaPlay && (
                <span className="bg-pink-100 text-pink-800 text-sm font-medium px-2.5 py-0.5 rounded-sm dark:bg-pink-900 dark:text-pink-300">
                  EA
                </span>
              )}
            </div>

            <div className="mt-2 font-sans font-bold text-neutral-700 dark:text-neutral-200">
              {title}
            </div>

            {description && (
              <div className="mt-1 font-sans text-xs text-neutral-600 dark:text-neutral-300">
                {description}
              </div>
            )}

            {person && person > 0 && (
              <div className="flex items-center gap-1 mt-2">
                {[...Array(person)].map((_, i) => (
                  <Gamepad2 key={i} size={16} />
                ))}
              </div>
            )}
          </div>
        </div>

        <hr className="my-2" />

        {/* hangi masada var pstürüne göre */}
        <div className="flex flex-col- gap-y-1 font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300">
          {ps5_masalar?.[0] && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">
              <span className="font-bold">PS5:</span>
              {ps5_masalar?.map((masa) => (
                <span className="ms-2" key={masa.id}>
                  {masa.masa_no}
                </span>
              ))}
            </span>
          )}

          {ps4_masalar?.[0] && (
            <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-green-400 border border-green-400">
              <span className="font-bold">PS4:</span>
              {ps4_masalar?.map((masa) => (
                <span className="ms-2" key={masa.id}>
                  {masa.masa_no}
                </span>
              ))}
            </span>
          )}

          {ps3_masalar?.[0] && (
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-indigo-400 border border-indigo-400">
              <span className="font-bold">PS3:</span>
              {ps3_masalar?.map((masa) => (
                <span className="ms-2" key={masa.id}>
                  {masa.masa_no}
                </span>
              ))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
