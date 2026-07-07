import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone } from "lucide-react";
import { parseEndorsements } from "@/utils/endorsements";

const DEFAULT_HERO_VIDEO = "https://assets.mixkit.co/videos/3587/3587-720.mp4";

interface ArtistFormData {
  heroVideoUrl?: string;
  heroPosterUrl?: string;
  heroTitlePrefix?: string;
  heroTitleHighlight?: string;
  heroTitleSuffix?: string;
  heroTagline?: string;
  testimonialsSectionTitle?: string;
  testimonialsSectionSubtitle?: string;
  aboutHeading?: string;
  aboutSubheading?: string;
  aboutPortraitUrl?: string;
  bio?: string;
  endorsements?: string;
  endorsementsSectionTitle?: string;
  tagline?: string;
}

export function AdminHeroPreview({ form }: { form: UseFormReturn<ArtistFormData> }) {
  const videoUrl = form.watch("heroVideoUrl")?.trim() || DEFAULT_HERO_VIDEO;
  const posterUrl = form.watch("heroPosterUrl")?.trim() || `${import.meta.env.BASE_URL}images/hero-bg.png`;
  const prefixRaw = form.watch("heroTitlePrefix")?.trim();
  const highlightRaw = form.watch("heroTitleHighlight")?.trim();
  const suffixRaw = form.watch("heroTitleSuffix")?.trim();
  const prefix = prefixRaw || null;
  const highlight = highlightRaw || null;
  const suffix = suffixRaw || null;
  const tagline = form.watch("heroTagline")?.trim() || "Berlin-based virtuoso guitarist...";

  const HeroContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <section
      className={`relative w-full flex items-center justify-center overflow-hidden ${
        isMobile ? "min-h-[600px] pt-12" : "min-h-[450px] md:min-h-[550px]"
      }`}
    >
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster={posterUrl || undefined}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/20" />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div
        className={`relative z-10 text-center mx-auto ${
          isMobile
            ? "px-4 max-w-[280px] pt-2"
            : "px-6 max-w-4xl mt-12"
        }`}
      >
        <h1
          className={`font-display font-bold text-foreground uppercase tracking-[0.1em] leading-tight ${
            isMobile
              ? "text-3xl mb-4"
              : "text-5xl md:text-7xl lg:text-8xl mb-6"
          }`}
        >
          {prefix}
          {prefix && (highlight || suffix) && <br />}
          {highlight && <span className="text-gradient-red">{highlight}</span>}
          {highlight && suffix && " "}
          {suffix}
        </h1>
        <p
          className={`text-muted-foreground font-light tracking-wide mx-auto ${
            isMobile
              ? "text-sm mb-6 max-w-xs"
              : "text-xl md:text-2xl mb-10 max-w-2xl"
          }`}
        >
          {tagline}
        </p>
        <div className={`flex flex-col items-center justify-center gap-4 ${isMobile ? "" : "sm:flex-row gap-6"}`}>
          <Button size={isMobile ? "default" : "lg"} className={isMobile ? "w-full" : "w-full sm:w-auto"}>
            Hire for Production
          </Button>
          <Button
            variant="outline"
            size={isMobile ? "default" : "lg"}
            className={isMobile ? "w-full" : "w-full sm:w-auto text-foreground border-primary/25 hover:bg-primary/10 hover:border-primary/50 hover:text-primary"}
          >
            Book a Lesson
          </Button>
        </div>
      </div>
    </section>
  );

  const [view, setView] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="space-y-4 mt-6 pt-6 border-t border-slate-200">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm font-medium text-slate-700">Preview — matches Home hero section</p>
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          <button
            type="button"
            onClick={() => setView("desktop")}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              view === "desktop" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Monitor className="w-4 h-4" />
            Desktop
          </button>
          <button
            type="button"
            onClick={() => setView("mobile")}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              view === "mobile" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Mobile
          </button>
        </div>
      </div>
      {view === "desktop" ? (
        <div className="rounded-lg overflow-hidden border border-slate-300 bg-black min-h-[520px] w-full">
          <HeroContent />
        </div>
      ) : (
        <div className="flex justify-center p-8 bg-gradient-to-b from-slate-400 to-slate-500 rounded-2xl">
          {/* iPhone 14-style frame */}
          <div className="relative w-[320px] bg-black rounded-[3rem] p-3 shadow-2xl border-[12px] border-slate-800">
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20 ring-2 ring-slate-800" aria-hidden="true" />
            <div className="w-full h-[620px] rounded-[2.25rem] overflow-hidden bg-black">
              <HeroContent isMobile />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminTestimonialsHeaderPreview({ form }: { form: UseFormReturn<ArtistFormData> }) {
  const title = form.watch("testimonialsSectionTitle")?.trim() || "Industry Voices";
  const subtitle = form.watch("testimonialsSectionSubtitle")?.trim() || "What top artists and students say...";

  return (
    <div className="space-y-4 mt-6 pt-6 border-t border-slate-200">
      <p className="text-sm font-medium text-slate-700">Preview — matches Home testimonials section</p>
      <div className="rounded-lg overflow-hidden border border-slate-300 bg-black/50 border-y border-white/5 p-12 text-center">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground tracking-wider mb-4">
          {title}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      </div>
    </div>
  );
}

export function AdminAboutPreview({ form }: { form: UseFormReturn<ArtistFormData> }) {
  const heading = form.watch("aboutHeading")?.trim() || "TOM GELDSCHLÄGER";
  const subheading = form.watch("aboutSubheading")?.trim() || "Fountainhead";
  const bio = form.watch("bio")?.trim() || "";
  const paragraphs = bio ? bio.split(/\n\n+/).filter(Boolean) : ["Biography text..."];
  const endorsementsRaw = form.watch("endorsements")?.trim() || "";
  const endorsementItems = parseEndorsements(endorsementsRaw);
  const portraitUrl = form.watch("aboutPortraitUrl")?.trim() || `${import.meta.env.BASE_URL}images/about-portrait.png`;
  const endorsementsSectionTitle = form.watch("endorsementsSectionTitle")?.trim() || "Official Endorsements";

  const AboutContent = ({ compact = false }: { compact?: boolean }) => (
    <div className={`grid gap-6 items-center ${compact ? "grid-cols-1 gap-4" : "grid-cols-1 lg:grid-cols-2 gap-8"}`}>
      <div className="relative aspect-[3/4] max-w-sm mx-auto w-full">
        <div className="absolute inset-0 bg-primary/20 translate-x-2 translate-y-2 rounded-sm border border-primary/30" />
        <img
          src={portraitUrl}
          alt=""
          className="relative z-10 w-full h-full object-cover rounded-sm shadow-xl"
        />
      </div>
      <div className={compact ? "min-w-0" : ""}>
        <h1 className={`font-display font-bold text-white mb-2 break-words whitespace-normal min-w-0 ${compact ? "text-sm sm:text-base tracking-tight leading-snug" : "text-4xl md:text-5xl"}`}>
          {heading}
        </h1>
        <h2 className={`text-primary uppercase font-semibold ${compact ? "text-sm tracking-[0.2em] mb-4" : "text-lg md:text-xl tracking-[0.3em] mb-6 md:mb-8"}`}>
          {subheading}
        </h2>
        <div className={`space-y-4 md:space-y-6 text-muted-foreground leading-relaxed font-light ${compact ? "text-sm" : "text-lg"}`}>
          {paragraphs.slice(0, 2).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="mt-6 flex gap-3 flex-wrap">
          <Button size={compact ? "sm" : "default"}>Contact Tom</Button>
          <Button variant="outline" size={compact ? "sm" : "default"}>
            View Discography
          </Button>
        </div>
        <div className={compact ? "mt-6 pt-4 border-t border-white/10" : "mt-8 pt-6 border-t border-white/10"}>
          <h3 className={`font-display text-white uppercase mb-4 break-words whitespace-normal ${compact ? "text-xs sm:text-sm tracking-widest" : "text-lg tracking-widest"}`}>
            {endorsementsSectionTitle}
          </h3>
          <div className={`flex flex-wrap gap-4 opacity-70 ${compact ? "gap-2" : ""}`}>
            {endorsementItems.slice(0, compact ? 4 : 6).map((item, i) => {
              const name = typeof item === "string" ? item : item?.name;
              const url = typeof item === "object" && item?.url ? item.url : null;
              return url ? (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="font-display font-bold hover:opacity-100 transition-opacity text-sm">
                  {name}
                </a>
              ) : (
                <span key={i} className="font-display font-bold text-sm">{name}</span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const [view, setView] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="space-y-4 mt-6 pt-6 border-t border-slate-200">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm font-medium text-slate-700">Preview — matches About page</p>
        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          <button
            type="button"
            onClick={() => setView("desktop")}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              view === "desktop" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Monitor className="w-4 h-4" />
            Desktop
          </button>
          <button
            type="button"
            onClick={() => setView("mobile")}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              view === "mobile" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Mobile
          </button>
        </div>
      </div>
      {view === "desktop" ? (
        <div className="rounded-lg overflow-hidden border border-slate-300 bg-black p-6 min-h-[420px]">
          <AboutContent />
        </div>
      ) : (
        <div className="flex justify-center p-8 bg-gradient-to-b from-slate-400 to-slate-500 rounded-2xl">
          <div className="relative w-[320px] bg-black rounded-[3rem] p-3 shadow-2xl border-[12px] border-slate-800">
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20 ring-2 ring-slate-800" aria-hidden="true" />
            <div className="w-full h-[620px] rounded-[2.25rem] overflow-hidden overflow-y-auto bg-black p-4">
              <AboutContent compact />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminTaglineSeoHelp() {
  return (
    <div className="space-y-4 mt-6 pt-6 border-t border-slate-200">
      <p className="text-sm text-slate-600">
        <strong>Tagline</strong> se usa como meta description (SEO). No aparece visible en el sitio. La{" "}
        <strong>Biografía</strong> se edita arriba en About y se muestra en <code className="text-xs bg-slate-100 px-1 rounded">/about</code>.
      </p>
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
        <h4 className="text-sm font-semibold text-slate-800">Recomendaciones SEO / Meta</h4>
        <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
          <li>Mantén el tagline entre 120–160 caracteres para que Google lo muestre completo en resultados de búsqueda.</li>
          <li>Incluye palabras clave relevantes (género, instrumento, ubicación, rol).</li>
          <li>Usa un tono que invite al clic; evita ser genérico.</li>
          <li>Evita repetir exactamente el título de la página.</li>
        </ul>
      </div>
    </div>
  );
}
