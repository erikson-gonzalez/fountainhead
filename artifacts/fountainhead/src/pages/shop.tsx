import { useState } from "react";
import { useListProducts, ProductCategory } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

const CATEGORIES: { label: string, value: ProductCategory }[] = [
  { label: "All Items", value: "all" },
  { label: "Merch", value: "merch" },
  { label: "Signature Picks", value: "picks" },
  { label: "Courses", value: "courses" },
  { label: "Sample Packs", value: "sample-packs" },
];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("all");
  const { data, isLoading } = useListProducts({ category: activeCategory !== "all" ? activeCategory : undefined });
  const addItem = useCartStore(state => state.addItem);

  return (
    <div className="w-full pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 uppercase tracking-wider">Official Store</h1>
        
        <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "px-6 py-2 text-sm font-medium tracking-widest uppercase border transition-all",
                activeCategory === cat.value 
                  ? "border-secondary bg-secondary/10 text-secondary" 
                  : "border-white/10 text-muted-foreground hover:border-white/30 hover:text-white"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-96 bg-white/5 border border-white/10 rounded-sm" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {data?.products?.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group flex flex-col bg-card border border-white/5 hover:border-white/20 transition-all rounded-sm overflow-hidden"
            >
              <div className="aspect-[4/5] relative bg-black flex items-center justify-center p-8 overflow-hidden">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <Package className="w-16 h-16 text-white/10" />
                )}
                {product.digital && (
                  <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm">
                    Digital Download
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-secondary text-xs uppercase tracking-widest mb-2">{product.category}</p>
                <h3 className="text-white font-bold text-lg mb-2 leading-tight">{product.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{product.description}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="font-display font-bold text-xl text-white">{formatPrice(product.priceEur)}</span>
                  <Button 
                    size="sm" 
                    onClick={() => addItem({
                      type: 'product',
                      id: product.id,
                      productId: product.id,
                      name: product.name,
                      priceEur: product.priceEur,
                      quantity: 1,
                      imageUrl: product.imageUrl
                    })}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" /> Add
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
