"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import type { PortalLesson, PortalResource } from "@workspace/db";
import { Play, Download, FileText, ShoppingBag, LogOut, User, BookOpen, Lock, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_ORDERS = [
  { id: "ORD-001", date: "2026-02-14", item: "Fretless Mastery Vol. 1 (Tab Pack)", category: "Tabs", price: 18, href: "/shop" },
  { id: "ORD-002", date: "2026-01-30", item: "Guitar Lesson — 45 min session", category: "Lesson", price: 45, href: "/book" },
  { id: "ORD-003", date: "2026-01-12", item: "Mixing — 1 Song", category: "Service", price: 200, href: "/quote" },
  { id: "ORD-004", date: "2025-12-20", item: "Extended Range Techniques (Tab)", category: "Tabs", price: 12, href: "/shop" },
  { id: "ORD-005", date: "2025-11-05", item: "Creative Coaching Session", category: "Coaching", price: 50, href: "/book" },
];

type TabId = "learning" | "history";
type SectionId = "videos" | "tabs" | "courses";

interface PortalUser {
  name: string;
  email: string;
  image: string | null;
}

export function PortalClient({
  user,
  lessons,
  resources,
}: {
  user: PortalUser;
  lessons: PortalLesson[];
  resources: PortalResource[];
}) {
  const [activeTab, setActiveTab] = useState<TabId>("learning");

  return (
    <div className="w-full pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/8 pb-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
            {user.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            ) : (
              <User className="w-6 h-6 text-primary" />
            )}
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-wider">
              {user.name}
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors self-start md:self-auto"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-10 border-b border-white/8">
        {[
          { id: "learning", label: "My Learning", icon: BookOpen },
          { id: "history", label: "Purchase History", icon: ShoppingBag },
        ].map((tab: { id: TabId; label: string; icon: typeof BookOpen }) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium tracking-wider uppercase transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-primary"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* My Learning */}
      {activeTab === "learning" && <LearningTab lessons={lessons} resources={resources} />}

      {/* Purchase History */}
      {activeTab === "history" && <HistoryTab />}
    </div>
  );
}

function LearningTab({ lessons, resources }: { lessons: PortalLesson[]; resources: PortalResource[] }) {
  const [section, setSection] = useState<SectionId>("videos");

  return (
    <div>
      <div className="flex gap-3 mb-8">
        {[
          { id: "videos", label: "Video Lessons" },
          { id: "tabs", label: "Tabs & PDFs" },
          { id: "courses", label: "My Courses" },
        ].map((s: { id: SectionId; label: string }) => (
          <button
            key={s.id}
            onClick={() => setSection(s.id)}
            className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-widest transition-colors ${
              section === s.id ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {section === "videos" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.length ? (
            lessons.map((lesson) => (
              <div key={lesson.id} className="group bg-card border border-white/5 rounded-sm overflow-hidden hover:border-primary/30 transition-colors">
                <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-primary/8 group-hover:bg-primary/15 transition-colors" />
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 group-hover:border-primary/40 flex items-center justify-center transition-colors relative z-10">
                    <Play className="w-6 h-6 text-white/60 group-hover:text-primary transition-colors ml-1" />
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 text-xs text-white/70 rounded-sm font-mono">
                    {lesson.duration}m
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{lesson.level}</span>
                    <span className="text-[10px] text-muted-foreground">{lesson.topic}</span>
                  </div>
                  <h3 className="text-foreground font-bold text-base mb-3 leading-snug">{lesson.title}</h3>
                  <Button variant="outline" className="w-full text-sm hover:border-primary hover:text-primary">
                    <Play className="w-3 h-3 mr-2" /> Watch Now
                  </Button>
                  <p className="flex items-center justify-center gap-1 text-center text-[10px] text-muted-foreground/40 mt-3">
                    <Lock className="w-2.5 h-2.5" /> Stream only — no download
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-24 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No video lessons yet. Book a session to get started.</p>
              <Link href="/book">
                <Button className="mt-6">Book a Lesson</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {section === "tabs" && (
        <div className="glass-panel rounded-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/8 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <div className="col-span-7">File</div>
            <div className="col-span-2 text-center">Type</div>
            <div className="col-span-3 text-right">Action</div>
          </div>
          {resources.length ? (
            resources.map((file) => (
              <div key={file.id} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-white/5 items-center hover:bg-primary/5 transition-colors">
                <div className="col-span-7 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary/60 shrink-0" />
                  <div>
                    <p className="text-foreground font-medium text-sm">{file.title}</p>
                    <p className="text-xs text-muted-foreground">{file.description}</p>
                  </div>
                </div>
                <div className="col-span-2 text-center text-xs text-muted-foreground font-mono">
                  {file.fileType.toUpperCase()}
                </div>
                <div className="col-span-3 text-right">
                  <Button size="sm" className="text-xs gap-1.5">
                    <Download className="w-3 h-3" /> Download
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <FileText className="w-10 h-10 mx-auto mb-4 opacity-20" />
              <p>No tabs yet. Purchase tab packs in the shop.</p>
              <Link href="/shop">
                <Button className="mt-6">Visit Shop</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {section === "courses" && (
        <div className="text-center py-24 text-muted-foreground">
          <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>You don&apos;t have any courses yet.</p>
          <Link href="/shop">
            <Button className="mt-6">Browse Courses</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

function HistoryTab() {
  return (
    <div>
      <p className="text-muted-foreground text-sm mb-6">Your past purchases — click Re-order to add them to your cart again.</p>
      <div className="glass-panel rounded-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/8 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <div className="col-span-2 hidden md:block">Order</div>
          <div className="col-span-9 md:col-span-5">Item</div>
          <div className="col-span-2 hidden md:block text-center">Category</div>
          <div className="col-span-2 hidden md:block text-center">Price</div>
          <div className="col-span-3 md:col-span-1 text-right">Action</div>
        </div>
        {MOCK_ORDERS.map((order) => (
          <div key={order.id} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-white/5 items-center hover:bg-primary/5 transition-colors">
            <div className="col-span-2 hidden md:block">
              <span className="text-xs font-mono text-muted-foreground">{order.id}</span>
              <p className="text-[10px] text-muted-foreground/50 mt-0.5">{order.date}</p>
            </div>
            <div className="col-span-9 md:col-span-5">
              <p className="text-foreground text-sm font-medium leading-snug">{order.item}</p>
              <p className="text-xs text-muted-foreground md:hidden mt-0.5">{order.date}</p>
            </div>
            <div className="col-span-2 hidden md:block text-center">
              <span className="text-[10px] uppercase tracking-widest text-primary/70 font-bold">{order.category}</span>
            </div>
            <div className="col-span-2 hidden md:block text-center text-sm text-foreground font-medium">
              €{order.price}
            </div>
            <div className="col-span-3 md:col-span-1 text-right">
              <Link href={order.href}>
                <Button size="sm" variant="outline" className="text-xs hover:border-primary hover:text-primary whitespace-nowrap">
                  Re-order
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
