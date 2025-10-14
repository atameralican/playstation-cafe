import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { navItems } from "@/components/Navbar/menu-list";
import { MainNavbar } from "@/components/Navbar/main-navbar";
import { ThemeProvider } from "@/components/theme-provider";
import MainFooter from "@/components/Footer/main-footer";
import GlobalLoadingOverlay from "@/components/useServiceHook/GlobalLoadingOverlay";

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

          <main className="flex-1 w-full px-4 py-6 sm:px-6 sm:py-8 md:px-8 xl:container xl:mx-auto justify-center"> 
            {children}
            <GlobalLoadingOverlay />
          </main>

          <MainFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
