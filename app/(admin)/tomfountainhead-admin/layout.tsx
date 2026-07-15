"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  User,
  BookOpen,
  Video,
  ShoppingBag,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/tomfountainhead-admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tomfountainhead-admin/artist", label: "Artist Info", icon: User },
  { href: "/tomfountainhead-admin/rates", label: "Rates, Books & Services", icon: BookOpen },
  { href: "/tomfountainhead-admin/learning", label: "Learning Videos", icon: Video },
  { href: "/tomfountainhead-admin/shop", label: "Shop Content", icon: ShoppingBag },
];

const LOGIN_PATH = "/tomfountainhead-admin/login";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // The login page keeps its own bare shell (no sidebar). This mirrors the old
  // App.tsx Router branch; middleware separately leaves /login unguarded.
  if (pathname === LOGIN_PATH) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <header className="h-14 border-b border-slate-200 bg-white flex items-center px-6">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium">
            ← Back to site
          </Link>
          <span className="text-slate-300 mx-4">|</span>
          <span className="font-semibold text-slate-900">Tom Fountainhead Admin</span>
        </header>
        <main className="flex-1 flex items-center justify-center">{children}</main>
      </div>
    );
  }

  return (
    <div className="admin-theme min-h-screen flex bg-slate-50 text-slate-900">
      {/* Sidebar — full height */}
      <aside className="w-64 shrink-0 flex flex-col bg-slate-900 border-r border-slate-800 min-h-screen">
        <div className="p-4 border-b border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Back to site</span>
          </Link>
        </div>
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Admin Panel</p>
              <p className="text-sm font-semibold text-white">Tom Fountainhead</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/tomfountainhead-admin"
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-slate-700 text-white shadow-md"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                )}
              >
                <item.icon className="w-4 h-4 shrink-0 opacity-90" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => signOut({ callbackUrl: LOGIN_PATH })}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6 bg-slate-50">
        <div className="max-w-5xl mx-auto w-full">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4 pb-3 border-b border-slate-200">
            <Link href="/tomfountainhead-admin" className="hover:text-slate-700">Admin</Link>
            <span aria-hidden>›</span>
            <span className="text-slate-700 font-medium">
              {pathname === "/tomfountainhead-admin" && "Dashboard"}
              {pathname.startsWith("/tomfountainhead-admin/artist") && "Artist Info"}
              {pathname.startsWith("/tomfountainhead-admin/rates") && "Rates, Books & Services"}
              {pathname.startsWith("/tomfountainhead-admin/learning") && "Learning Videos"}
              {pathname.startsWith("/tomfountainhead-admin/shop") && "Shop Content"}
            </span>
          </nav>
          {children}
        </div>
      </main>
    </div>
  );
}
