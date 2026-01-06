"use client";

import { useState } from "react";

import { BottomNavbar, Sidebar } from "@/ui/navigation";
import { Divider, LogoutButton } from "@/ui/components";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-[var(--main-page-bg)] flex">
      {/* Sidebar – md+ */}
      <aside className="hidden md:flex">
        <Sidebar expanded={expanded} setExpanded={setExpanded} />
        {/* Divider to the right of sidebar */}
        <Divider orientation="vertical" />
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        {/* Header */}
        <header className="bg-[var(--topbar-bg)] h-[56px] flex items-center px-4">
          <div className="ml-auto">
            <LogoutButton />
          </div>
        </header>

        {/* Divider under header */}
        <Divider />

        {/* Main Content */}
        <div className="flex-1 main-page">
          <main className="flex-1">{children}</main>
        </div>

        {/* Bottom navigation – mobile only */}
        <div className="md:hidden sticky bottom-0 z-10 bg-[var(--navbar-bg)] h-[56px]">
          {/* Divider above bottom nav */}
          <Divider />
          <BottomNavbar />
        </div>
      </div>
    </div>
  );
}
