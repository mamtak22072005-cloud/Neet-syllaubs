import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { StoreProvider } from "@/hooks/use-store";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { Subject } from "@/pages/Subject";
import { Chapter } from "@/pages/Chapter";
import { Todos } from "@/pages/Todos";
import { TodoDetail } from "@/pages/TodoDetail";
import { Progress } from "@/pages/Progress";
import { Profile } from "@/pages/Profile";
import { StudyGroup } from "@/pages/StudyGroup";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/progress" component={Progress} />
        <Route path="/study" component={StudyGroup} />
        <Route path="/profile" component={Profile} />
        <Route path="/subject/:id" component={Subject} />
        <Route path="/subject/:subId/chapter/:chapId" component={Chapter} />
        <Route path="/todos" component={Todos} />
        <Route path="/todos/:id" component={TodoDetail} />
        <Route>
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-muted-foreground">Page not found</p>
          </div>
        </Route>
      </Switch>
    </AnimatePresence>
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
