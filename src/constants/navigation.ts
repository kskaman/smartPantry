import { House, Warehouse, CookingPot, Settings } from "lucide-react";

export const NAV_LINKS = [
  {
    name: "Home",
    to: "/dashboard/home",
    Icon: House,
  },
  {
    name: "Inventory",
    to: "/dashboard/inventory",
    Icon: Warehouse,
  },
  {
    name: "Recipes",
    to: "/dashboard/recipes",
    Icon: CookingPot,
  },
  {
    name: "Settings",
    to: "/dashboard/settings",
    Icon: Settings,
  },
];
