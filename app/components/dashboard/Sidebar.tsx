"use client";

import { useState , useEffect} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Renewals", href: "/dashboard/renewals" },
  { label: "Reminders", href: "/dashboard/reminders" },
  { label: "Settings", href: "/dashboard/settings" },
];

function IconDashboard() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  );
}
function IconRenewals() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l-.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
const ICONS = [IconDashboard, IconRenewals, IconBell, IconSettings];

function HamburgerIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
      {collapsed ? (
        <>
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </>
      ) : (
        <>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </>
      )}
    </svg>
  );
}

function Logo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-3 overflow-hidden">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="6 4 52 52" fill="none" className="w-full h-full">
          <defs>
            <linearGradient id="sidebar-logo-grad" x1="12" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#F97316"/>
              <stop offset="1" stopColor="#4338CA"/>
            </linearGradient>
          </defs>
          <path d="M32 10L47 17V29.4C47 39.5 40.6 48.1 32 51.5C23.4 48.1 17 39.5 17 29.4V17L32 10Z" fill="#0F0F10" stroke="url(#sidebar-logo-grad)" strokeWidth="3" strokeLinejoin="round"/>
          <path d="M25 24.5V21.8C25 18 28 15 32 15C36 15 39 18 39 21.8V24.5" stroke="url(#sidebar-logo-grad)" strokeWidth="3" strokeLinecap="round"/>
          <path d="M23.5 26H40.5V37.5H23.5V26Z" fill="#151516"/>
          <path d="M28 35.5V28L36 35.5V28" stroke="url(#sidebar-logo-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {!collapsed && (
        <span className="whitespace-nowrap text-lg font-bold tracking-wide text-[var(--text-primary)]">
          RenewVault
        </span>
      )}
    </div>
  );
}
function NavList({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {NAV_ITEMS.map((item, i) => {
        const Icon = ICONS[i];
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              collapsed ? "justify-center" : ""
            } ${
              isActive
                ? "nav-item-active"
                : "text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]"
            }`}
          >
            <span className={`flex-shrink-0 ${isActive ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}>
              <Icon />
            </span>
            {!collapsed && <span>{item.label}</span>}

            {collapsed && (
              <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1.5 text-xs font-medium text-[var(--text-primary)] opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 z-50">
                {item.label}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}


export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const BREAKPOINT = 1024;

    function handleResize() {
      const desktop = window.innerWidth >= BREAKPOINT;
      setIsDesktop(desktop);

      if (!desktop) {
        setCollapsed(true); // force-collapse on mobile/tablet, every time
      }
    }

    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function toggleCollapsed() {
    if (!isDesktop) return; // manual toggle disabled below breakpoint
    setCollapsed((prev) => !prev);
  }

  return (
    <aside
      className={`sticky top-0 z-30 flex h-screen shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-all duration-300 ease-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className={`sidebar-header-glow flex items-center border-b border-[var(--border)]/60 px-5 py-6 ${collapsed ? "flex-col gap-4" : "justify-between"}`}>
        <Logo collapsed={collapsed} />
        <button
          onClick={toggleCollapsed}
          className={`hidden lg:flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white transition-colors hover:bg-[var(--surface-2)]`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <HamburgerIcon collapsed={collapsed} />
        </button>
      </div>
      <NavList collapsed={collapsed} />
    </aside>
  );
}