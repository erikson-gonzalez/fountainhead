import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getCartTotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[400px] glass-panel border-l border-white/10 z-50 flex flex-col shadow-2xl shadow-black"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="font-display text-xl tracking-widest text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                YOUR CART
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p>Your cart is empty.</p>
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.cartId} className="flex gap-4 p-4 bg-white/5 rounded-sm border border-white/5 relative group">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-sm border border-white/10" />
                    ) : (
                      <div className="w-20 h-20 bg-muted/50 rounded-sm border border-white/10 flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-primary uppercase tracking-wider mb-1">{item.type}</p>
                          <h4 className="font-medium text-white line-clamp-2 leading-tight">{item.name}</h4>
                        </div>
                        <button 
                          onClick={() => removeItem(item.cartId)}
                          className="text-muted-foreground hover:text-destructive transition-colors ml-2 mt-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-white/10 rounded-sm overflow-hidden">
                          <button 
                            className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white transition-colors"
                            onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-sm font-medium">{item.quantity}</span>
                          <button 
                            className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white transition-colors"
                            onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-display font-bold text-secondary">
                          {formatPrice(item.priceEur * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-black/40">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-display text-2xl font-bold text-white">{formatPrice(getCartTotal())}</span>
                </div>
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
