"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

type NavItem = {
  label: string;
  href: string;
  active?: boolean;
  dropdown?: { label: string; href: string }[];
};

const NAV_LEFT: NavItem[] = [
  { label: "HOME", href: "/" },
  { label: "ABOUT US", href: "/about-us" },
  { label: "OUR TEAM", href: "/our-team" },
];

const NAV_RIGHT: NavItem[] = [
  {
    label: "GALLERY",
    href: "/main-gallery",
    dropdown: [
      { label: "Courtney's Work", href: "/courtneys-work" },
      { label: "Rafael's Work", href: "/rafaels-work" },
      { label: "Kory's Work", href: "/korys-work" },
      { label: "Cornelius's Work", href: "/corneliuss-work" },
    ],
  },
  { label: "SERVICES", href: "/services" },
  { label: "BOOKING", href: "/booking" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() || "/";
  const forceCompact = pathname.startsWith("/booking");
  const compact = scrolled || forceCompact;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: compact ? "rgb(24,24,24)" : "rgba(0,0,0,0)",
        height: compact ? 80 : 150,
        boxShadow: compact ? "0 5px 10px rgba(0,0,0,0.03)" : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-x-0 top-0 z-[99] flex items-stretch"
    >
      <div className="mx-auto flex h-full items-stretch justify-between">
        <NavCluster items={NAV_LEFT} align="end" scrolled={compact} pathname={pathname} />

        <Link
          href="/"
          aria-label="Ecdysis Barber Shop home"
          className="flex shrink-0 items-center justify-center px-[48px] outline-none focus:outline-none focus-visible:outline-none"
        >
          <Image
            src="/images/Ecdysis-Logo-For-Website-1-1.png"
            alt="Ecdysis Barber Shop | Broken Arrow"
            width={150}
            height={100}
            priority
            className={`h-auto transition-all duration-300 ease-in-out ${
              compact ? "w-[90px]" : "w-[120px] md:w-[150px]"
            }`}
          />
        </Link>

        <NavCluster items={NAV_RIGHT} align="start" scrolled={compact} pathname={pathname} />
      </div>
    </motion.header>
  );
}

function NavCluster({
  items,
  align,
  scrolled,
  pathname,
}: {
  items: NavItem[];
  align: "start" | "end";
  scrolled: boolean;
  pathname: string;
}) {
  return (
    <nav
      className={`hidden items-stretch gap-[4px] md:flex ${
        align === "end" ? "justify-end" : "justify-start"
      }`}
    >
      {items.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <NavLink
            key={item.label}
            item={{ ...item, active: isActive || item.active }}
            scrolled={scrolled}
          />
        );
      })}
    </nav>
  );
}

function NavLink({ item, scrolled }: { item: NavItem; scrolled: boolean }) {
  const baseClasses = scrolled
    ? "inline-flex items-center py-[28px] px-[23px] " +
      "font-sans text-[16px] font-bold uppercase tracking-normal leading-[24px] " +
      "outline-none focus:outline-none focus-visible:outline-none " +
      "transition-all duration-300 ease-in-out hover:text-ec-tan"
    : "inline-flex items-start pt-[81px] px-[23px] pb-[44px] " +
      "font-sans text-[16px] font-bold uppercase tracking-normal leading-[24px] " +
      "outline-none focus:outline-none focus-visible:outline-none " +
      "transition-all duration-300 ease-in-out hover:text-ec-tan";

  if (item.dropdown) {
    return (
      <div className="group relative">
        <Link
          href={item.href}
          className={`${baseClasses} gap-1.5 text-white`}
        >
          {item.label}
          <ChevronDown className={`h-3 w-3 ${scrolled ? "" : "mt-[6px]"}`} />
        </Link>
        <div
          className="absolute left-1/2 top-full hidden min-w-[230px] -translate-x-1/2 flex-col bg-ec-dark/95 py-3 shadow-lg backdrop-blur-sm group-hover:flex"
          role="menu"
        >
          {item.dropdown.map((sub) => (
            <Link
              key={sub.label}
              href={sub.href}
              role="menuitem"
              className="px-[15px] py-[10px] text-[15px] font-normal leading-[24px] text-white transition-colors duration-200 hover:bg-white/5 hover:text-ec-tan"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`${baseClasses} ${item.active ? "text-ec-tan-active" : "text-white"}`}
    >
      {item.label}
    </Link>
  );
}

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M3 4.5l3 3 3-3" />
    </svg>
  );
}
