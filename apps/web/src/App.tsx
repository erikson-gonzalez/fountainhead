import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AppLayout } from "@/components/layout/app-layout";
import { AdminLayout } from "@/components/layout/admin-layout";
import Home from "@/pages/home";
import About from "@/pages/about";
import Discography from "@/pages/discography";
import Live from "@/pages/live";
import Services from "@/pages/services";
import Shop from "@/pages/shop";
import Book from "@/pages/book";
import QuoteBuilder from "@/pages/quote";
import Checkout from "@/pages/checkout";
import Portal from "@/pages/portal";
import PortalAccess from "@/pages/portal-access";
import News from "@/pages/news";
import NotFound from "@/pages/not-found";
import AdminDashboard from "@/pages/admin/admin-dashboard";
import AdminArtist from "@/pages/admin/admin-artist";
import AdminRates from "@/pages/admin/admin-rates";
import AdminLearning from "@/pages/admin/admin-learning";
import AdminShop from "@/pages/admin/admin-shop";
import AdminLogin from "@/pages/admin/admin-login";
import { AdminGate } from "@/components/admin/admin-gate";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/tomfountainhead-admin");

  if (isAdmin) {
    if (location === "/tomfountainhead-admin/login") {
      return (
        <div className="min-h-screen flex flex-col bg-slate-50">
          <header className="h-14 border-b border-slate-200 bg-white flex items-center px-6">
            <a href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-medium">
              ← Back to site
            </a>
            <span className="text-slate-300 mx-4">|</span>
            <span className="font-semibold text-slate-900">Tom Fountainhead Admin</span>
          </header>
          <main className="flex-1 flex items-center justify-center">
            <AdminLogin />
          </main>
        </div>
      );
    }
    return (
      <AdminGate>
        <AdminLayout>
          <Switch>
            <Route path="/tomfountainhead-admin" component={AdminDashboard} />
            <Route path="/tomfountainhead-admin/artist" component={AdminArtist} />
            <Route path="/tomfountainhead-admin/rates" component={AdminRates} />
            <Route path="/tomfountainhead-admin/learning" component={AdminLearning} />
            <Route path="/tomfountainhead-admin/shop" component={AdminShop} />
            <Route component={NotFound} />
          </Switch>
        </AdminLayout>
      </AdminGate>
    );
  }

  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/discography" component={Discography} />
        <Route path="/live" component={Live} />
        <Route path="/services" component={Services} />
        <Route path="/news" component={News} />
        <Route path="/shop" component={Shop} />
        <Route path="/book" component={Book} />
        <Route path="/quote" component={QuoteBuilder} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/portal" component={Portal} />
        <Route path="/portal/access" component={PortalAccess} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
