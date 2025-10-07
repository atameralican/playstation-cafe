import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { navItems } from "@/components/Navbar/menu-list";
import { MainNavbar } from "@/components/Navbar/main-navbar";
import { ThemeProvider } from "@/components/theme-provider";
import MainFooter from "@/components/Footer/main-footer";
import GlobalLoadingOverlay from "@/components/useServiceHook/GlobalLoadingOverlay";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deplasman Playstation",
  description: "Kırşehir Deplasman Playstation Salonu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <html lang="tr" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <MainNavbar navItems={navItems} />

          <main className="flex-1 overflow-y-auto container mx-auto p-8">
            {children}
            <GlobalLoadingOverlay />
          </main>

          <MainFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
