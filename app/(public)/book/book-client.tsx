"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Guitar, Lightbulb, MessageCircle, Mic2, Music4 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCartStore } from "@/store/cart-store";
import { cn, formatPrice } from "@/lib/utils";

export type BookView = {
  id: number;
  name: string;
  description: string;
  priceEur: number;
  unit: string;
  tag: string | null;
  icon: string | null;
  imageUrl: string | null;
  linkType: string;
};

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  Lightbulb,
  Mic2,
  Music4,
  Guitar,
};

const BOOKING_CONTACT_KEY = "fountainhead-booking-contact";

export function BookClient({ books }: { books: BookView[] }) {
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const selectedBook = selectedBookId ? books.find((b) => b.id === selectedBookId) : null;
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const setIsOpen = useCartStore((state) => state.setIsOpen);

  const doSubmit = (goToCheckout: boolean) => {
    setFormError(null);
    const name = formName.trim();
    const phone = formPhone.trim();
    const email = formEmail.trim();
    if (!name || name.length < 2) {
      setFormError("Please enter your name.");
      return;
    }
    if (!phone && !email) {
      setFormError("Please enter your WhatsApp number or email.");
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!selectedBook) return;

    try {
      sessionStorage.setItem(BOOKING_CONTACT_KEY, JSON.stringify({ name, phone: phone || undefined, email: email || undefined }));
    } catch {
      // sessionStorage may be unavailable (private mode); non-fatal.
    }

    addItem({
      type: "booking",
      bookingId: selectedBook.id,
      name: selectedBook.name,
      priceEur: selectedBook.priceEur,
      quantity: 1,
    });

    setSelectedBookId(null);
    setFormName("");
    setFormPhone("");
    setFormEmail("");

    if (goToCheckout) {
      setIsOpen(false);
      router.push("/checkout");
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="w-full pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="mb-16">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-wider">Book a Session</h1>
        <p className="text-muted-foreground">Schedule your 1-on-1 session or studio time.</p>
      </div>

      <div className="space-y-12">
        {/* Education & Sessions */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-display text-sm uppercase tracking-[0.3em] text-muted-foreground">Education & Sessions</h2>
            <div className="flex-1 h-px bg-white/8" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map((book) => {
              const Icon = (book.icon && ICON_MAP[book.icon]) ? ICON_MAP[book.icon] : BookOpen;
              const tagLabel = book.tag ?? "Session";
              if (book.linkType === "quote") {
                return (
                  <div key={book.id} className="group flex flex-col border border-white/10 rounded-sm bg-card hover:border-primary/40 transition-all overflow-hidden">
                    {book.imageUrl ? (
                      <div className="aspect-video w-full overflow-hidden bg-slate-800">
                        <img src={book.imageUrl} alt="" className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-slate-800/50 flex items-center justify-center">
                        <Icon className="w-12 h-12 text-slate-500" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-sm bg-white/5 text-muted-foreground border border-white/8">
                          {tagLabel}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-lg text-white mb-2">{book.name}</h3>
                      <p className="text-sm text-muted-foreground flex-1 mb-4">{book.description}</p>
                      <div className="pt-4 border-t border-white/6">
                        <div className="font-display text-xl font-bold text-white">{formatPrice(book.priceEur)}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">{book.unit}</div>
                      </div>
                      <Link href="/quote">
                        <Button className="mt-4 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                          Book Now <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={book.id}
                  onClick={() => {
                    setSelectedBookId(book.id);
                    setFormError(null);
                  }}
                  className={cn(
                    "group flex flex-col border rounded-sm cursor-pointer transition-all bg-card hover:border-primary/40 overflow-hidden",
                    selectedBookId === book.id
                      ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(225,29,72,0.1)]"
                      : "border-white/10 hover:border-white/30"
                  )}
                >
                  {book.imageUrl ? (
                    <div className="aspect-video w-full overflow-hidden bg-slate-800">
                      <img src={book.imageUrl} alt="" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-video w-full bg-slate-800/50 flex items-center justify-center">
                      <Icon className="w-12 h-12 text-slate-500" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-sm bg-white/5 text-muted-foreground border border-white/8">
                        {tagLabel}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-white mb-2">{book.name}</h3>
                    <p className="text-sm text-muted-foreground flex-1 mb-4">{book.description}</p>
                    <div className="pt-4 border-t border-white/6">
                      <div className="font-display text-xl font-bold text-white">{formatPrice(book.priceEur)}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">{book.unit}</div>
                    </div>
                    <Button className="mt-4 w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                      Book Now <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <Dialog
          open={!!selectedBookId}
          onOpenChange={(open) => { if (!open) { setSelectedBookId(null); setFormError(null); } }}
        >
          <DialogContent className="bg-[#0f0f0f] border border-white/10 text-white sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <DialogTitle className="text-white">Your contact details</DialogTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">Tom will reach out directly after payment to coordinate.</p>
                </div>
              </div>
            </DialogHeader>

            <p className="text-muted-foreground text-sm border-l-2 border-primary/50 pl-4">
              Once you complete payment, you&apos;ll receive direct contact with Tom via WhatsApp or Email to coordinate your session.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); doSubmit(false); }} className="space-y-4">
              <div>
                <Label htmlFor="booking-name" className="text-muted-foreground uppercase tracking-wider text-xs">Name</Label>
                <Input
                  id="booking-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Your name"
                  className="mt-2 h-11 bg-black/50 border-white/10 focus:border-primary"
                />
              </div>
              <div>
                <Label htmlFor="booking-phone" className="text-muted-foreground uppercase tracking-wider text-xs">WhatsApp</Label>
                <Input
                  id="booking-phone"
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="+49 123 456 7890"
                  className="mt-2 h-11 bg-black/50 border-white/10 focus:border-primary"
                />
                <p className="text-muted-foreground text-xs mt-1">Include country code + number (e.g. +49 123 456 7890)</p>
              </div>
              <div>
                <Label htmlFor="booking-email" className="text-muted-foreground uppercase tracking-wider text-xs">Email</Label>
                <Input
                  id="booking-email"
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 h-11 bg-black/50 border-white/10 focus:border-primary"
                />
                <p className="text-muted-foreground text-xs mt-1">At least one required so Tom can reach you.</p>
              </div>
              {formError && <p className="text-destructive text-sm">{formError}</p>}
              <div className="flex gap-3 pt-1">
                <Button type="submit" variant="outline" className="flex-1 text-sm">
                  Add to Cart
                </Button>
                <Button type="button" className="flex-1 gap-2 text-sm" onClick={() => doSubmit(true)}>
                  Buy <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
