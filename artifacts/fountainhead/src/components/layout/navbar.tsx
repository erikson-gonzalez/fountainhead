import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

const LINKS = [
  { label: "About", href: "/about" },
  { label: "Discography", href: "/discography" },
  { label: "Live", href: "/live" },
  { label: "Services", href: "/services" },
  { label: "Shop", href: "/shop" },
  { label: "Book", href: "/book" },
  { label: "Portal", href: "/portal" },
];

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const setIsCartOpen = useCartStore((state) => state.setIsOpen);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-40 transition-all duration-500",
        scrolled ? "bg-background/92 backdrop-blur-md border-b border-secondary/10 py-4" : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3 relative z-50">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 border border-primary/30 group-hover:bg-primary/20 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-primary" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6c-2.5 0-3.5 3-3.5 3S10 9 12 9s3.5-3 3.5-3-1 3-3.5 3z" />
            </svg>
          </div>
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
                location === link.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
              {location === link.href && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-2 left-0 right-0 h-px bg-primary/70"
                />
              )}
            </Link>
          ))}
          
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
                location === link.href ? "text-primary" : "text-foreground hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </header>
  );
}
