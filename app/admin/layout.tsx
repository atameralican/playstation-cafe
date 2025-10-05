import { SidebarAdmin } from "@/components/SideBar/admin-sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel - Deplasman Playstation",
  description: "Kırşehir Deplasman Playstation Yönetim Paneli",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SidebarAdmin>{children}</SidebarAdmin>;
}