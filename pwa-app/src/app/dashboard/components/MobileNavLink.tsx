"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
        isActive ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      <span>{label}</span>
    </Link>
  );
}
