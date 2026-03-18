import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data since API doesn't have a specific live dates endpoint in schema
// In a real app this would be fetched from the backend
const SHOWS = [
  { id: 1, date: "2025-06-15", venue: "Wacken Open Air", city: "Wacken, DE", project: "Fountainhead", status: "Upcoming" },
  { id: 2, date: "2025-08-22", venue: "Tech Fest", city: "Newark, UK", project: "Guest Soloist", status: "Upcoming" },
  { id: 3, date: "2024-11-10", venue: "Euroblast", city: "Bristol, UK", project: "Fountainhead", status: "Past" },
  { id: 4, date: "2024-09-05", venue: "ProgPower Europe", city: "Atlanta, US", project: "Masterclass", status: "Past" },
];

export default function Live() {
  const upcoming = SHOWS.filter(s => s.status === "Upcoming");
  const past = SHOWS.filter(s => s.status === "Past");

  return (
    <div className="w-full pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
        <div>
          <h1 className="font-display text-5xl font-bold text-white uppercase tracking-wider mb-2">Live Dates</h1>
          <div className="h-1 w-24 bg-primary mb-6" />
          <p className="text-muted-foreground text-lg">Performances, masterclasses, and clinics worldwide.</p>
        </div>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
          Book for a Clinic / Show
        </Button>
      </div>

      <div className="space-y-16">
        <section>
          <h2 className="text-secondary font-bold uppercase tracking-[0.2em] mb-8 flex items-center">
            <span className="w-2 h-2 bg-secondary rounded-full mr-3 animate-pulse" />
            Upcoming
          </h2>
          <div className="space-y-4">
            {upcoming.map(show => (
              <div key={show.id} className="glass-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-6">
                  <div className="text-center min-w-[80px]">
                    <div className="text-sm text-primary uppercase font-bold">{new Date(show.date).toLocaleString('default', { month: 'short' })}</div>
                    <div className="font-display text-3xl text-white font-bold">{new Date(show.date).getDate()}</div>
                  </div>
                  <div className="w-px h-12 bg-white/10 hidden md:block" />
                  <div>
                    <h3 className="text-white font-bold text-xl mb-1">{show.venue}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {show.city}</span>
                      <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-sm text-xs uppercase tracking-wider">{show.project}</span>
                    </div>
                  </div>
                </div>
                <Button>Get Tickets <ExternalLink className="w-3 h-3 ml-2" /></Button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-muted-foreground font-bold uppercase tracking-[0.2em] mb-8">Past Highlights</h2>
          <div className="space-y-2 opacity-60 hover:opacity-100 transition-opacity">
            {past.map(show => (
              <div key={show.id} className="p-4 border-b border-white/5 flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground w-24">{show.date}</span>
                  <span className="text-white font-medium">{show.venue}</span>
                </div>
                <span className="text-muted-foreground hidden sm:inline">{show.city}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
