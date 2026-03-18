import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateOrder } from "@workspace/api-client-react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Valid email required"),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const { mutate: createOrder, isPending, isSuccess } = useCreateOrder();
  
  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  });

  const onSubmit = (data: CheckoutForm) => {
    // Map internal cart items to API OrderItems
    const orderItems = items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      priceEur: item.priceEur,
      productId: item.type === 'product' ? item.productId : undefined,
      serviceId: item.type === 'service' ? item.id : undefined,
      bookingId: item.type === 'booking' ? item.id : undefined,
    }));

    createOrder({
      data: {
        ...data,
        items: orderItems,
      }
    }, {
      onSuccess: () => {
        clearCart();
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="w-full pt-40 pb-24 px-6 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-lg">
          <CheckCircle2 className="w-24 h-24 text-primary mx-auto mb-8" />
          <h1 className="font-display text-4xl font-bold text-white mb-4">Order Received!</h1>
          <p className="text-muted-foreground mb-8 text-lg">Thank you. We have received your order and will email you the details shortly.</p>
          <Link href="/">
            <Button variant="outline">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full pt-40 pb-24 px-6 flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="font-display text-3xl text-white mb-4">Your Cart is Empty</h1>
        <Link href="/shop">
          <Button>Browse Store</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <h1 className="font-display text-4xl font-bold text-white mb-12 uppercase tracking-wider border-b border-white/10 pb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* FORM */}
        <div className="lg:col-span-7">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="glass-panel p-8 space-y-6">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6">Contact Information</h2>
              
              <div>
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block mb-2">Full Name</label>
                <input 
                  {...form.register("customerName")}
                  className="w-full bg-black/50 border border-white/10 rounded-sm p-4 text-white focus:border-primary outline-none transition-colors"
                />
                {form.formState.errors.customerName && <p className="text-destructive text-sm mt-1">{form.formState.errors.customerName.message}</p>}
              </div>

              <div>
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block mb-2">Email Address</label>
                <input 
                  type="email"
                  {...form.register("customerEmail")}
                  className="w-full bg-black/50 border border-white/10 rounded-sm p-4 text-white focus:border-primary outline-none transition-colors"
                />
                {form.formState.errors.customerEmail && <p className="text-destructive text-sm mt-1">{form.formState.errors.customerEmail.message}</p>}
              </div>
              
              <div>
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block mb-2">Order Notes (Optional)</label>
                <textarea 
                  {...form.register("notes")}
                  rows={3}
                  className="w-full bg-black/50 border border-white/10 rounded-sm p-4 text-white focus:border-primary outline-none transition-colors resize-none"
                />
              </div>
            </div>

            <div className="glass-panel p-8">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6 text-muted-foreground">Payment Method</h2>
              <div className="p-6 border border-white/10 bg-white/5 text-center rounded-sm">
                <p className="text-muted-foreground">This is a demonstration environment.<br/>No actual payment will be processed.</p>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" isLoading={isPending}>
              Complete Order &bull; {formatPrice(getCartTotal())}
            </Button>
          </form>
        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:col-span-5">
          <div className="glass-panel p-8 sticky top-32">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
              {items.map(item => (
                <div key={item.cartId} className="flex justify-between items-start py-4 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white font-medium pr-4">{item.name}</p>
                    <p className="text-muted-foreground text-sm mt-1">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-secondary font-bold whitespace-nowrap">{formatPrice(item.priceEur * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Taxes</span>
                <span>Calculated next step</span>
              </div>
              <div className="flex justify-between text-xl font-display font-bold text-white pt-4">
                <span>Total</span>
                <span className="text-primary">{formatPrice(getCartTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
