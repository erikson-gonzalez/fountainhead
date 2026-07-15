import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";

// Ported from AppLayout. Server Component — it only composes the (client)
// navbar/cart-drawer with the (server) footer. The manual scrollTo(0,0) effect
// is dropped: the App Router restores scroll on navigation natively.
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative selection:bg-primary/30">
      <Navbar />
      <CartDrawer />
      <main className="flex-grow flex flex-col">{children}</main>
      <Footer />
    </div>
  );
}
