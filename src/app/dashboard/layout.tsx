import type React from "react";
import { DashboardSidebar } from "./_components/sidebar";
import { UserNav } from "./_components/uder-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      <DashboardSidebar />
      <div className="flex-1 bg-white">
        <div className="flex justify-end p-4 border-b">
          <UserNav />
        </div>
        <main className="p-6 bg-[#F3F4F6]">{children}</main>
      </div>
    </div>
  );
}
