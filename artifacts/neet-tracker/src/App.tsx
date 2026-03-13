import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { StoreProvider } from "@/hooks/use-store";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { Subject } from "@/pages/Subject";
import { Chapter } from "@/pages/Chapter";
import { Todos } from "@/pages/Todos";
import { TodoDetail } from "@/pages/TodoDetail";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/subject/:id" component={Subject} />
      <Route path="/subject/:subId/chapter/:chapId" component={Chapter} />
      <Route path="/todos" component={Todos} />
      <Route path="/todos/:id" component={TodoDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <StoreProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Layout>
              <Router />
            </Layout>
          </WouterRouter>
          <Toaster />
        </StoreProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
