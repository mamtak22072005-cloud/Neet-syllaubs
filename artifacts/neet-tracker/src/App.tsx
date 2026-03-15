import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { StoreProvider } from "@/hooks/use-store";
import { Layout } from "@/components/Layout";
import { Auth } from "@/pages/Auth";
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

function AppContent() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #0e0b1e 0%, #0f172a 60%, #0b1120 100%)' }}
      >
        <div className="text-center space-y-4">
          <div
            className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 8px 24px rgba(124,58,237,0.4)' }}
          >
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
          </div>
          <p className="text-sm text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <StoreProvider userId={user.uid}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Layout>
          <Router />
        </Layout>
      </WouterRouter>
    </StoreProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AppContent />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
