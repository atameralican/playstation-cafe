import React, { useMemo } from "react";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { CountingNumber } from "../shadcn-io/counting-number";
import Link from "next/link";

interface StatisticCardProps {
  iconName?: keyof typeof Icons; // Type-safe icon name
  startNumber?: number;
  endNumber?: number;
  inView?: boolean;
  title?: string;
  href?:string;
  description?: string;
  className?: string;
}

function StatisticCard({
  startNumber = 0,
  href="/",
  iconName = "Gamepad2",
  endNumber = 100,
  inView = true,
  title,
  description,
  className,
}: StatisticCardProps) {
  const IconComponent = Icons[iconName] as LucideIcon;

const randomRotateClass = useMemo(() => {
    const rotateClasses = [
      "-rotate-12",
      "-rotate-6", 
      "-rotate-3",
      "rotate-0",
      "rotate-3",
      "rotate-6",
      "rotate-12"
    ];
    return rotateClasses[Math.floor(Math.random() * rotateClasses.length)];
  }, []);

  return (
    <div className={className}>
      <Link href={href}>
      <article>
        <div className={`w-14 h-14 rounded shadow-md bg-gradient-to-br from-indigo-100 to-purple-100 flex justify-center items-center ${randomRotateClass} mb-6 transition-transform hover:rotate-0`}>
          <IconComponent className={`w-8 h-8 text-indigo-600`} />
        </div>
        <CountingNumber
          number={endNumber}
          fromNumber={startNumber}
          className="text-4xl"
          inView={inView}
        /><span className="text-4xl">+</span>
        {title && (
          <h2>
            <span className="inline-flex font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-indigo-300 mb-2">
              {title}
            </span>
          </h2>
        )}
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
      </article>
      </Link>
    </div>
  );
}

export default StatisticCard;
