import Link from "next/link";
import { LayoutDashboard, User, BookOpen, Video, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Pure Server Component (§1/§7): static quick-link cards, no data, no interactivity.
const QUICK_LINKS = [
  { href: "/tomfountainhead-admin/artist", label: "Artist Info", icon: User },
  { href: "/tomfountainhead-admin/rates", label: "Rates, Books & Services", icon: BookOpen },
  { href: "/tomfountainhead-admin/learning", label: "Learning Videos", icon: Video },
  { href: "/tomfountainhead-admin/shop", label: "Shop Content", icon: ShoppingBag },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-600 mt-1">Welcome to the Tom Fountainhead admin panel</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {QUICK_LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="cursor-pointer transition-shadow hover:shadow-md border-slate-200 bg-white">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100">
                  <link.icon className="h-6 w-6 text-slate-700" />
                </div>
                <div>
                  <CardTitle className="text-slate-900">{link.label}</CardTitle>
                  <CardDescription className="text-slate-500">Edit and manage content</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle className="text-slate-900">Quick Links</CardTitle>
          <CardDescription>Manage website content from the sidebar sections</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• <strong>Artist Info:</strong> Titles, endorsements, music and bio</li>
            <li>• <strong>Rates, Books &amp; Services:</strong> Base prices, album discount, long song surcharge for Quote Builder</li>
            <li>• <strong>Learning Videos:</strong> Standalone videos or courses with multiple videos</li>
            <li>• <strong>Shop Content:</strong> Physical and digital products (picks, tabs, merch)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
