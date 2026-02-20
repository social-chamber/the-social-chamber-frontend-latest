"use client";

import LogoutModal from "@/components/shared/modals/LogoutModal";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Info,
  LogOut,
  NotebookPen,
  BarChart3,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handLogout = () => {
    try {
      toast.success("Logout successful!");
      setTimeout(async () => {
        await signOut({
          callbackUrl: "/login",
        });
      }, 1000);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const routes = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Booking",
      href: "/dashboard/booking",
      icon: Calendar,
    },
  
    {
      name: "Content",
      href: "/dashboard/content",
      icon: FileText,
    },
    {
      name: "Blog",
      href: "/dashboard/blog",
      icon: NotebookPen,
    },
    {
      name: "Faq",
      href: "/dashboard/faq",
      icon: Info,
    },
    {
      name: "Promo",
      href: "/dashboard/promo",
      icon: FileText,
    },
    {
      name: "Promo Usage",
      href: "/dashboard/promo-usage",
      icon: BarChart3,
    },
  ];

  return (
    <div className="w-72 border-r max-h-screen sticky top-0 border-zinc-800/10 bg-white text-white">
      <div className="flex flex-col h-full">
        <div className="w-full flex items-center justify-center py-5">
          <Image
            src="/img/logo.png"
            alt="Social Chamber"
            width={80}
            height={80}
            className="w-[80px] h-[80px] object-cover"
          />
        </div>
        <nav className="flex-1 px-2 py-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex text-base font-medium leading-[120%] items-center gap-3 rounded-lg px-3 py-4 mb-5 transition-all hover:text-orange-500",
                pathname === route.href
                  ? "bg-orange-500/10 text-orange-500"
                  : "text-[#000000]"
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800/10">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-3 rounded-lg px-3 py-4 text-base font-medium leading-[120%] text-[#000000] transition-all hover:text-orange-500"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>

        {/* logout modal  */}
        {isOpen && (
          <LogoutModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={handLogout}
          />
        )}
      </div>
    </div>
  );
}
