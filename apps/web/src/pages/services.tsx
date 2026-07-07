import { useListServices } from "@workspace/api-client-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Sliders,
  Disc3,
  Music4,
  Guitar,
  ArrowRight,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Sliders,
  Disc3,
  Music4,
  Guitar,
};

const CATEGORY_META: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  mixing:       { icon: Sliders,   color: "text-primary",   label: "Mixing" },
  mastering:    { icon: Disc3,     color: "text-primary",   label: "Mastering" },
  production:   { icon: Music4,    color: "text-primary",   label: "Production" },
  "guitar-solo":{ icon: Guitar,    color: "text-primary",   label: "Guitar" },
};

export default function Services() {
  const { data, isLoading } = useListServices();

  const studioServices = data?.services ?? [];

  return (
    <div className="w-full pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-16">
        <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground uppercase tracking-wider mb-4">
          Rates & Services
        </h1>
        <div className="h-1 w-20 bg-primary mb-6" />
        <p className="text-muted-foreground text-lg max-w-2xl">
          Transparent pricing for premium audio production and education. Bundle discounts available upon request.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-white/5 rounded-sm" />
          ))}
        </div>
      ) : (
        <>
          {/* Studio / Production Services */}
          {studioServices.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="font-display text-sm uppercase tracking-[0.3em] text-muted-foreground">Production & Engineering</h2>
                <div className="flex-1 h-px bg-white/8" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {studioServices.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </section>
          )}

        </>
      )}

      {/* Bottom CTA */}
      <div className="mt-20 glass-panel p-10 text-center">
        <h3 className="font-display text-2xl font-bold text-foreground uppercase tracking-wider mb-3">
          Need a custom package?
        </h3>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Multiple songs, full album production, or ongoing mixing retainers — get in touch for a tailored quote.
        </p>
        <Link href="/quote">
          <Button size="lg" className="gap-2">
            Build a Quote <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: { id: number; name: string; description: string; category: string; priceEur: number; unit: string; icon?: string | null; tag?: string | null } }) {
  const Icon = (service.icon && ICON_MAP[service.icon]) ? ICON_MAP[service.icon] : (CATEGORY_META[service.category]?.icon ?? Music4);
  const tagLabel = service.tag ?? CATEGORY_META[service.category]?.label ?? service.category;

  return (
    <div className="group relative flex flex-col bg-card border border-white/6 rounded-sm overflow-hidden hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      {/* Top accent bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-7 flex flex-col flex-1">
        {/* Icon + badge */}
        <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-sm bg-white/5 text-muted-foreground border border-white/8">
            {tagLabel}
          </span>
        </div>

        {/* Name + description */}
        <h3 className="font-display font-bold text-xl text-foreground mb-3 leading-snug">
          {service.name}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-6">
          {service.description}
        </p>

        {/* Price */}
        <div className="mb-6 pt-5 border-t border-white/6">
          <div className="font-display text-3xl font-bold text-foreground">
            {formatPrice(service.priceEur)}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
            {service.unit}
          </div>
        </div>

        {/* CTA */}
        <Link href={`/quote?service=${service.category}`}>
          <Button className="w-full gap-2 group-hover:gap-3 transition-all">
            Get a Quote <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
