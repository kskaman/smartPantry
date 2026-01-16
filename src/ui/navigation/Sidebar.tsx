"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import clsx from "clsx";

import { NAV_LINKS } from "../../constants";
import { Button } from "../components";

interface SidebarProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const isActiveRoute = (pathname: string, href: string) => {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
};

const Sidebar = ({ expanded, setExpanded }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <div
      className={clsx(
        // container
        "flex flex-col items-center h-full gap-4 bg-[var(--navbar-bg)]",
        // width + padding
        expanded ? "w-[200px] px-4 pb-5 pt-0" : "w-[56px] p-1"
      )}
    >
      {/* toggle */}
      <div
        className={clsx(
          "w-full h-14 flex items-center",
          expanded ? "justify-end" : "justify-center"
        )}
      >
        {expanded ? (
          <Button
            variant="icon"
            icon={<ArrowLeft />}
            onClick={() => setExpanded(false)}
          />
        ) : (
          <Button
            variant="icon"
            icon={<ArrowRight />}
            onClick={() => setExpanded(true)}
          />
        )}
      </div>

      {/* navigation */}
      <nav className="flex flex-col w-full h-full flex-1 gap-1">
        {NAV_LINKS.map(({ name, Icon, to }) => {
          const active = isActiveRoute(pathname, to);

          return (
            <Link
              key={name}
              href={to}
              aria-current={active ? "page" : undefined}
              className={clsx(
                `flex items-center justify-between gap-2
                w-full py-[10px] px-3 rounded-[8px] no-underline`,
                active
                  ? `bg-[var(--nav-item-bg-active)] 
                  text-[var(--nav-item-text-active-color)]`
                  : "text-[var(--nav-item-text-color)]"
              )}
            >
              <div className="flex items-center gap-2">
                <Icon
                  height={24}
                  width={24}
                  color={
                    active
                      ? "var(--nav-item-text-active-color)"
                      : "var(--nav-item-text-color)"
                  }
                />

                {expanded && <span className="text-small">{name}</span>}
              </div>

              {expanded && active && (
                <div className="w-4 rotate-180">
                  <ArrowLeft color="var(--nav-item-text-active-color)" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
