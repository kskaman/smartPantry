"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { NAV_LINKS } from "../../constants";

const isActiveRoute = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

const BottomNavbar = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-center h-full bg-[var(--navbar-bg)]">
      <nav className="flex items-center justify-evenly w-full h-full p-2">
        {NAV_LINKS.map(({ name, Icon, to }) => {
          const active = isActiveRoute(pathname, to);

          return (
            <Link
              key={name}
              href={to}
              aria-current={active ? "page" : undefined}
              className={clsx(
                "flex items-center justify-center px-3 py-1 rounded-[8px] no-underline",
                active
                  ? "bg-[var(--nav-item-bg-active)] text-[var(--nav-item-text-active-color)]"
                  : "text-[var(--nav-item-text-color)]"
              )}
            >
              <div className="flex flex-col items-center gap-2">
                <Icon
                  height={24}
                  width={24}
                  color={
                    active
                      ? "var(--nav-item-text-active-color)"
                      : "var(--nav-item-text-color)"
                  }
                />

                {/* hidden <640, show >=640 */}
                <span className="text-preset-4 hidden sm:inline">{name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNavbar;
