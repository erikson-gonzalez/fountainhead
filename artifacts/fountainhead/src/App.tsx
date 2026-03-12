import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AppLayout } from "@/components/layout/app-layout";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function Router() {
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
