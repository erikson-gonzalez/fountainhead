import { ReactNode, useEffect } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { CartDrawer } from "./cart-drawer";
import { useLocation } from "wouter";

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-primary/30">
      <Navbar />
      <CartDrawer />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
