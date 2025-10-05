import type { Metadata } from "next";
import { SidebarDemo } from "@/components/SideBar/admin-sidebar";

export const metadata: Metadata = {
  title: "Admin Panel - Deplasman Playstation",
  description: "Kırşehir Deplasman Playstation Yönetim Paneli",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SidebarDemo>{children}</SidebarDemo>;
}