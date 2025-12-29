"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, Package, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/inventory", label: "Inventory", icon: Package },
  { href: "/dashboard/recipes", label: "Recipes", icon: ChefHat },
];

export function NavDropdown() {
  const pathname = usePathname();
  const router = useRouter();

  const currentItem =
    navItems.find((item) => pathname === item.href) || navItems[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <span>{currentItem.label}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <DropdownMenuItem
              key={item.href}
              onClick={() => router.push(item.href)}
              className={isActive ? "bg-accent" : ""}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
