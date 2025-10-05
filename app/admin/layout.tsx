import { SidebarAdmin } from "@/components/SideBar/admin-sidebar";
import type { Metadata } from "next";
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
export const metadata: Metadata = {
  title: "Admin Panel - Deplasman Playstation",
  description: "Kırşehir Deplasman Playstation Yönetim Paneli",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SidebarAdmin>
     <Theme >{children}</Theme></SidebarAdmin>;
}