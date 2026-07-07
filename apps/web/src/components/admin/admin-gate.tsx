import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminAuthStore } from "@/store/admin-auth-store";

export function AdminGate({ children }: { children: ReactNode }) {
  const token = useAdminAuthStore((s) => s.token);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!token) {
      setLocation("/tomfountainhead-admin/login");
    }
  }, [token, setLocation]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-500">Verificando sesión...</div>
      </div>
    );
  }

  return <>{children}</>;
}
