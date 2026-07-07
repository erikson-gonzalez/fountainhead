import { useMemo, useState, useEffect } from "react";
import { MapPin, ExternalLink, Search, ChevronDown, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useLiveShows } from "@/hooks/use-live-shows";

interface BookingInquiryModalProps {
  open: boolean;
  onClose: () => void;
}

function BookingInquiryModal({ open, onClose }: BookingInquiryModalProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const reset = () => {
    setName(""); setContact(""); setMessage(""); setSent(false); setSending(false);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 600));
    setSending(false);
    setSent(true);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="bg-[#0f0f0f] border border-white/10 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl uppercase tracking-wider">Book a Clinic / Show</DialogTitle>
        </DialogHeader>

        {sent ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-primary" />
            <p className="text-white font-medium">Message sent!</p>
            <p className="text-muted-foreground text-sm">Tom will get back to you soon.</p>
            <Button onClick={handleClose} className="mt-2">Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">WhatsApp or Email</label>
              <Input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+49 123 456 789 or you@email.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your event, location, date…"
                rows={4}
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={sending}>
              {sending ? "Sending…" : "Send"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function Live() {
  const { data: shows = [], isLoading } = useLiveShows();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [pastSearch, setPastSearch] = useState("");
  const [expandedYears, setExpandedYears] = useState<Set<number>>(new Set());
  const [initializedExpansion, setInitializedExpansion] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const currentYear = new Date().getFullYear();
  const upcoming = useMemo(
    () =>
      shows
        .filter((s) => s.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [shows, today]
  );
  const past = useMemo(
    () =>
      shows
        .filter((s) => s.date < today)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [shows, today]
  );

  const pastFiltered = useMemo(() => {
    if (!pastSearch.trim()) return past;
    const q = pastSearch.toLowerCase().trim();
    return past.filter(
      (s) =>
        s.venue.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.project.toLowerCase().includes(q)
    );
  }, [past, pastSearch]);

  const pastByYear = useMemo(() => {
    const map = new Map<number, typeof pastFiltered>();
    for (const s of pastFiltered) {
      const year = new Date(s.date).getFullYear();
      if (!map.has(year)) map.set(year, []);
      map.get(year)!.push(s);
    }
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  }, [pastFiltered]);

  useEffect(() => {
    if (initializedExpansion || pastByYear.length === 0) return;
    const currentYearCount = pastByYear.find(([y]) => y === currentYear)?.[1].length ?? 0;
    let remaining = 10 - currentYearCount;
    const toExpand = new Set<number>();
    for (const [year, yearShows] of pastByYear) {
      if (year === currentYear) continue;
      if (remaining <= 0) break;
      toExpand.add(year);
      remaining -= yearShows.length;
    }
    setExpandedYears(toExpand);
    setInitializedExpansion(true);
  }, [pastByYear, currentYear, initializedExpansion]);

  const toggleYear = (year: number) => {
    setExpandedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedYears(new Set(pastByYear.map(([y]) => y)));
  };
  const collapseAll = () => setExpandedYears(new Set());

  return (
    <div className="w-full pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div>
          <h1 className="font-display text-5xl font-bold text-white uppercase tracking-wider mb-2">Live Dates</h1>
          <div className="h-1 w-24 bg-primary mb-6" />
          <p className="text-muted-foreground text-lg">Performances, masterclasses, and clinics worldwide.</p>
        </div>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10" onClick={() => setBookingOpen(true)}>
          Book for a Clinic / Show
        </Button>
      </div>

      <div className="space-y-16">
        {(isLoading || upcoming.length > 0) && (
        <section>
          <h2 className="text-secondary font-bold uppercase tracking-[0.2em] mb-8 flex items-center">
            <span className="w-2 h-2 bg-secondary rounded-full mr-3 animate-pulse" />
            Upcoming
          </h2>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="glass-panel p-6 h-24 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {upcoming.map((show) => (
                <div
                  key={show.id}
                  className="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className="text-center min-w-[80px]">
                      <div className="text-sm text-primary uppercase font-bold">
                        {new Date(show.date).toLocaleString("default", { month: "short" })}
                      </div>
                      <div className="font-display text-3xl text-white font-bold">
                        {new Date(show.date).getDate()}
                      </div>
                    </div>
                    <div className="w-px h-12 bg-white/10 hidden md:block" />
                    <div>
                      <h3 className="text-white font-bold text-xl mb-1">{show.venue}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {show.city}
                        </span>
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-sm text-xs uppercase tracking-wider">
                          {show.project}
                        </span>
                      </div>
                    </div>
                  </div>
                  {show.ticketUrl ? (
                    <Button asChild>
                      <a href={show.ticketUrl} target="_blank" rel="noopener noreferrer">
                        Get Tickets <ExternalLink className="w-3 h-3 ml-2" />
                      </a>
                    </Button>
                  ) : (
                    <Button variant="outline" className="border-white/20" onClick={() => setBookingOpen(true)}>
                      Book for a Clinic / Show
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
        )}

        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-muted-foreground font-bold uppercase tracking-[0.2em]">Past Highlights</h2>
            {past.length > 5 && (
              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search venue, city, project..."
                    value={pastSearch}
                    onChange={(e) => setPastSearch(e.target.value)}
                    className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground"
                  />
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={expandAll}
                    className="text-muted-foreground hover:text-white text-xs"
                  >
                    Expand
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={collapseAll}
                    className="text-muted-foreground hover:text-white text-xs"
                  >
                    Collapse
                  </Button>
                </div>
              </div>
            )}
          </div>
          {isLoading ? (
            <div className="space-y-2 opacity-60">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 border-b border-white/5 h-12 animate-pulse" />
              ))}
            </div>
          ) : pastFiltered.length === 0 ? (
            <p className="text-muted-foreground italic">
              {pastSearch ? "No results for your search." : "No past shows."}
            </p>
          ) : (
            <div className="space-y-2 opacity-60 hover:opacity-100 transition-opacity">
              {pastByYear.map(([year, yearShows]) => {
                const isCurrentYear = year === currentYear;
                const showRow = (show: typeof yearShows[number]) => (
                  <div
                    key={show.id}
                    className="p-4 pl-10 border-b border-white/5 flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-muted-foreground w-24">{show.date}</span>
                      <span className="text-white font-medium">{show.venue}</span>
                    </div>
                    <span className="text-muted-foreground hidden sm:inline">{show.city}</span>
                  </div>
                );

                if (isCurrentYear) {
                  return (
                    <div key={year}>
                      <div className="py-3 px-4 font-bold text-white">
                        {year} ({yearShows.length})
                      </div>
                      {yearShows.map(showRow)}
                    </div>
                  );
                }

                return (
                  <Collapsible
                    key={year}
                    open={expandedYears.has(year)}
                    onOpenChange={() => toggleYear(year)}
                  >
                    <CollapsibleTrigger className="flex w-full items-center justify-between py-3 px-4 text-left font-bold text-white hover:bg-white/5 rounded-sm transition-colors">
                      <span className="flex items-center gap-2">
                        {expandedYears.has(year) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        {year} ({yearShows.length})
                      </span>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {yearShows.map(showRow)}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <BookingInquiryModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
