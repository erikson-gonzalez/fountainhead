import { useListServices } from "@workspace/api-client-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Services() {
  const { data, isLoading } = useListServices();

  return (
    <div className="w-full pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white uppercase tracking-wider mb-6">Rates & Services</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Transparent pricing for premium audio production and education. Bundle discounts available upon request.</p>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white/5 rounded-sm" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {data?.services?.map(service => (
            <div key={service.id} className="glass-panel p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-primary">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-display font-bold text-xl text-white">{service.name}</h3>
                  <span className="text-[10px] uppercase tracking-widest bg-white/10 px-2 py-1 rounded-sm text-muted-foreground">
                    {service.category}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">{service.description}</p>
              </div>
              
              <div className="flex items-center md:flex-col justify-between md:justify-center md:items-end gap-4 min-w-[150px]">
                <div className="text-right">
                  <div className="font-display text-2xl font-bold text-secondary">{formatPrice(service.priceEur)}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{service.unit}</div>
                </div>
                
                {['mixing', 'mastering', 'production', 'guitar-solo'].includes(service.category) ? (
                  <Link href="/quote"><Button size="sm">Get Quote</Button></Link>
                ) : (
                  <Link href="/book"><Button size="sm" variant="outline">Book Now</Button></Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
