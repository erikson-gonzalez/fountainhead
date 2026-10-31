"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

const LINKS = [
  { label: "About", href: "/about" },
  { label: "Discography", href: "/discography" },
  { label: "Live", href: "/live" },
  { label: "Services", href: "/services" },
  { label: "Shop", href: "/shop" },
  { label: "Book", href: "/book" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const setIsCartOpen = useCartStore((state) => state.setIsOpen);
  const { data: session } = useSession();
  // Only surface a portal user in the public navbar (admins sign in elsewhere).
  const user = session?.user?.role === "portal" ? session.user : null;

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const SCROLL_DOWN_THRESHOLD = 100;
    const SCROLL_UP_THRESHOLD = 30;
    const DEBOUNCE_MS = 120;
    let timeoutId: ReturnType<typeof setTimeout>;

    const updateScrolled = () => {
      const y = window.scrollY;
      setScrolled((prev) =>
        prev ? y > SCROLL_UP_THRESHOLD : y > SCROLL_DOWN_THRESHOLD
      );
    };

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateScrolled, DEBOUNCE_MS);
    };

    updateScrolled(); // set initial state immediately
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-40 py-4 md:py-5 transition-all duration-300",
        scrolled ? "bg-background/92 backdrop-blur-md border-b border-secondary/10" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3 relative z-50">
          <Image
            src="/images/logo-heart-red.png"
            alt="Fountainhead"
            width={36}
            height={36}
            priority
            className="w-9 h-9 object-contain transition-transform group-hover:scale-105"
          />
          <span className="font-display font-bold text-xl tracking-[0.2em] text-foreground">
            FOUNTAINHEAD
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium tracking-wider uppercase transition-colors hover:text-primary relative",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
              {pathname === link.href && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-2 left-0 right-0 h-px bg-primary/70"
                />
              )}
            </Link>
          ))}

          <Link
            href="/portal"
            className={cn(
              "relative p-2 transition-colors",
              pathname.startsWith("/portal") ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
            title={user ? `Signed in as ${user.name}` : "Sign in"}
          >
            {user ? (
              <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                <User className="w-3.5 h-3.5" />
              </div>
            ) : (
              <User className="w-5 h-5" />
            )}
          </Link>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </nav>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 lg:hidden relative z-50">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-foreground p-2"
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ height: mobileOpen ? "100vh" : 0, opacity: mobileOpen ? 1 : 0 }}
        className="lg:hidden fixed inset-0 bg-background/98 backdrop-blur-xl z-40 overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "text-2xl font-display tracking-widest uppercase transition-colors",
                pathname === link.href ? "text-primary" : "text-foreground hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/portal"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "text-2xl font-display tracking-widest uppercase transition-colors flex items-center gap-3",
              pathname.startsWith("/portal") ? "text-primary" : "text-foreground hover:text-primary"
            )}
          >
            {user ? user.name : "Sign In"}
          </Link>
        </div>
      </motion.div>
    </header>
  );
}
