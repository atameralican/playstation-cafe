import { Github, Instagram, Facebook } from "lucide-react";
import Link from "next/link";
import Image from 'next/image'
import logo from '@/public/logo.png'
export default function MainFooter() {
  return (
    <footer className="">
      <div className="max-w-7xl mx-auto px-1 py-6">
        <div className="flex justify-between items-center pt-8 border-t border-slate-200 flex-wrap gap-6">
          <div className="text-sm">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl  hover:text-blue-400 transition-colors"
            >
              <Image
                    src={logo}
                    alt="Deplasman Playstation"
                    width={80}
                    height={80}
                    className="rounded-xl"
                  />
            </Link>
          </div>

          <div
            className="flex gap-6"
            role="navigation"
            aria-label="Social Media Links"
          >
            <Link
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 transition-colors"
              aria-label="Twitter"
            >
              <Instagram className="w-5 h-5" />
            </Link>

            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </Link>
          </div>

          <div className="text-sm">
            <p>© 2025 Alican ATAMER </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
