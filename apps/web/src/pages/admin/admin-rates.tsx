import { useState, useEffect } from "react";
import { adminFetch } from "@/store/admin-auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Percent, Music2, BookOpen, Briefcase } from "lucide-react";
import { AdminServices } from "@/components/admin/admin-services";
import { AdminBooks } from "@/components/admin/admin-books";

const BASE_PRICE_SERVICES = [
  { key: "base_price_mixing", label: "Mixing", default: 200 },
  { key: "base_price_mastering", label: "Mastering", default: 30 },
  { key: "base_price_mixing-mastering", label: "Mixing + Mastering", default: 300 },
  { key: "base_price_production", label: "Production", default: 300 },
  { key: "base_price_guitar-solo", label: "Guitar Solo", default: 300 },
  { key: "base_price_stem-mastering", label: "Stem Mastering", default: 100 },
  { key: "base_price_string-arrangement", label: "String Arrangement", default: 200 },
  { key: "base_price_cowriting", label: "Co-writing", default: 300 },
] as const;

const DEFAULT_CONFIG: Record<string, string> = {
  album_discount_percent: "10",
  album_min_songs: "8",
  long_song_surcharge_percent: "10",
};

export default function AdminRates() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminFetch("/api/admin/quote-config")
      .then((r) => r.json())
      .then((data) => setConfig(data.config ?? {}))
      .catch(() => setConfig({}))
      .finally(() => setLoading(false));
  }, []);

  const getValue = (key: string, fallback: string | number) => {
    const v = config[key];
    return v !== undefined && v !== "" ? v : String(fallback);
  };

  const setValue = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await adminFetch("/api/admin/quote-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-slate-500">Loading rates...</div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Rates, Books &amp; Services
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Configure Quote Builder, bookings, and services.
        </p>
      </div>

      <Tabs defaultValue="rates" className="w-full">
        <TabsList className="bg-slate-200/80 p-1 h-auto gap-1">
          <TabsTrigger value="rates" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Music2 className="w-4 h-4" />
            Rates
          </TabsTrigger>
          <TabsTrigger value="books" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <BookOpen className="w-4 h-4" />
            Books
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Briefcase className="w-4 h-4" />
            Services
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rates" className="mt-6">
      <form onSubmit={handleSave} className="space-y-8">
        <Card className="bg-white border-slate-200 w-full">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Music2 className="w-5 h-5" />
              Base Prices (€ per song)
            </CardTitle>
            <CardDescription>
              Price per song for each service type in the Quote Builder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BASE_PRICE_SERVICES.map(({ key, label, default: def }) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="text-slate-700">{label}</Label>
                  <div className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3">
                    <span className="text-slate-500">€</span>
                    <Input
                      id={key}
                      type="number"
                      min="0"
                      step="1"
                      value={getValue(key, def)}
                      onChange={(e) => setValue(key, e.target.value)}
                      className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 w-full">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Percent className="w-5 h-5" />
              Discounts &amp; Surcharges
            </CardTitle>
            <CardDescription>
              Album discount (8+ songs) and long song surcharge (&gt;6 min)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="album_discount_percent" className="text-slate-700">Album discount (%)</Label>
                <Input
                  id="album_discount_percent"
                  type="number"
                  min="0"
                  max="100"
                  value={getValue("album_discount_percent", DEFAULT_CONFIG.album_discount_percent)}
                  onChange={(e) => setValue("album_discount_percent", e.target.value)}
                  className="bg-white border-slate-200"
                />
                <p className="text-xs text-slate-500">Applied when song count ≥ album min</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="album_min_songs" className="text-slate-700">Album min songs</Label>
                <Input
                  id="album_min_songs"
                  type="number"
                  min="1"
                  max="20"
                  value={getValue("album_min_songs", DEFAULT_CONFIG.album_min_songs)}
                  onChange={(e) => setValue("album_min_songs", e.target.value)}
                  className="bg-white border-slate-200"
                />
                <p className="text-xs text-slate-500">Full album = this many songs or more</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="long_song_surcharge_percent" className="text-slate-700">Long song surcharge (%)</Label>
                <Input
                  id="long_song_surcharge_percent"
                  type="number"
                  min="0"
                  max="100"
                  value={getValue("long_song_surcharge_percent", DEFAULT_CONFIG.long_song_surcharge_percent)}
                  onChange={(e) => setValue("long_song_surcharge_percent", e.target.value)}
                  className="bg-white border-slate-200"
                />
                <p className="text-xs text-slate-500">+% per song over 6 minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          {saved && <span className="text-sm text-green-600 font-medium">Saved!</span>}
        </div>
      </form>
        </TabsContent>

        <TabsContent value="books" className="mt-6">
          <AdminBooks />
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <AdminServices />
        </TabsContent>
      </Tabs>
    </div>
  );
}
