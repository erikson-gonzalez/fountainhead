import { useState } from "react";
import { useLocation } from "wouter";
import { useListPortalLessons, useListPortalResources } from "@workspace/api-client-react";
import { Play, Download, Lock, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Portal() {
  const [activeTab, setActiveTab] = useState<"lessons" | "resources" | "community">("lessons");
  
  // In a real app, auth state would guard this. 
  // We use a URL query param for demo purposes to simulate entering the portal.
  const isDemoAuth = window.location.search.includes("demo=true");
  const [, setLocation] = useLocation();

  if (!isDemoAuth) {
    setLocation("/portal/access");
    return null;
  }

  const { data: lessonsData } = useListPortalLessons();
  const { data: resourcesData } = useListPortalResources();

  return (
    <div className="w-full pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <header className="mb-12 border-b border-white/10 pb-8">
        <h1 className="font-display text-4xl font-bold text-white mb-2 uppercase tracking-wider">My Learning</h1>
        <p className="text-muted-foreground">Welcome back. Pick up where you left off.</p>
      </header>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: "lessons", label: "Video Masterclasses", icon: Play },
          { id: "resources", label: "Tabs & Downloads", icon: Download },
          { id: "community", label: "Community", icon: Users },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-sm font-medium tracking-wider uppercase text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.id ? "bg-white text-black" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "lessons" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lessonsData?.lessons?.map(lesson => (
            <div key={lesson.id} className="group bg-card border border-white/5 rounded-sm overflow-hidden">
              <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
                <Play className="w-16 h-16 text-white/50 group-hover:text-white transition-colors relative z-10" />
                <div className="absolute bottom-4 right-4 bg-black/80 px-2 py-1 text-xs text-white rounded-sm font-mono">
                  {lesson.duration}m
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">{lesson.level}</span>
                  <span className="text-[10px] text-muted-foreground">{lesson.topic}</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{lesson.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{lesson.description}</p>
                <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary">
                  Start Streaming <Lock className="w-3 h-3 ml-2 opacity-50" />
                </Button>
                <p className="text-center text-[10px] text-muted-foreground/50 mt-3">Stream only. Download prohibited.</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "resources" && (
        <div className="glass-panel rounded-sm">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <div className="col-span-6 md:col-span-8">File Name</div>
            <div className="col-span-3 md:col-span-2 text-center">Type</div>
            <div className="col-span-3 md:col-span-2 text-right">Action</div>
          </div>
          {resourcesData?.resources?.map(file => (
            <div key={file.id} className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 items-center hover:bg-white/5 transition-colors">
              <div className="col-span-6 md:col-span-8 flex items-center gap-3">
                <FileText className="w-5 h-5 text-secondary" />
                <div>
                  <p className="text-white font-medium">{file.title}</p>
                  <p className="text-xs text-muted-foreground">{file.description}</p>
                </div>
              </div>
              <div className="col-span-3 md:col-span-2 text-center text-sm text-muted-foreground">
                {file.fileType.toUpperCase()}
              </div>
              <div className="col-span-3 md:col-span-2 text-right">
                <Button size="sm" variant="secondary" className="w-full md:w-auto text-xs">
                  <Download className="w-3 h-3 md:mr-2" /> <span className="hidden md:inline">Download</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "community" && (
        <div className="text-center py-32 glass-panel border border-white/5">
          <Users className="w-16 h-16 text-white/20 mx-auto mb-6" />
          <h2 className="font-display text-2xl text-white mb-2">Discord Community</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">Join the private student discord server to share progress, ask questions, and collaborate.</p>
          <Button size="lg">Join Server</Button>
        </div>
      )}
    </div>
  );
}
