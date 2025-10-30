"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconDeviceGamepad2,
  IconDeviceTvOldFilled,
  IconNumber,
  IconPacman,
  IconPasswordUser,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import logo from "@/public/logo.png"
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function SidebarAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      if (response.ok) {
        toast.success('Çıkış yapıldı')
        router.push('/login')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Bir hata oluştu')
    }
  }

  const links = [
    {
      label: "Oyunlar",
      href: "/admin/oyunlar",
      icon: (
        <IconPacman className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "PSN Hesapları",
      href: "/admin/hesaplar",
      icon: (
        <IconPasswordUser className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Playstationlar",
      href: "/admin/playstationlar",
      icon: (
        <IconDeviceGamepad2 className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Televizyonlar",
      href: "/admin/televizyonlar",
      icon: (
        <IconDeviceTvOldFilled className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Masalar",
      href: "/admin/masalar",
      icon: (
        <IconNumber className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden md:flex-row",
        "h-screen bg-gray-100 dark:bg-neutral-800"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
              
              {/* Logout butonu - click handler ile */}
              <button
                onClick={handleLogout}
                className="flex items-center justify-start gap-2 group/sidebar py-2 px-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                {open && (
                  <span className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0">
                    Çıkış Yap
                  </span>
                )}
              </button>
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Admin User",
                href: "/admin",
                icon: (
                  <img
                    src={logo.src}
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard>{children}</Dashboard>
    </div>
  );
}

export const Logo = () => {
  return (
    <a
      href="/admin"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image src={logo} alt="Deplasman Bay Bayan Playstation Salonu Kırşehir" width={50} height={50} className="object-cover scale-100" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Deplasman PS
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/admin"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image src={logo} alt="Deplasman Bay Bayan Playstation Salonu Kırşehir" width={30} height={30} />
    </Link>
  );
};

const Dashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex h-full w-full flex-1 flex-col rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};
