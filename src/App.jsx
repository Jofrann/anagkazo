import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import TrainingCenter from './pages/TrainingCenter';
import LevelLibrary from './pages/LevelLibrary';
import SimulationCenter from './pages/SimulationCenter';
import FieldAssistant from './pages/FieldAssistant';
import ResponseGenerator from './pages/ResponseGenerator';
import ObjectionLibrary from './pages/ObjectionLibrary';
import PeopleTracking from './pages/PeopleTracking';
import PersonDetail from './pages/PersonDetail';
import MyProgress from './pages/MyProgress';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/training" element={<TrainingCenter />} />
        <Route path="/levels" element={<LevelLibrary />} />
        <Route path="/simulation" element={<SimulationCenter />} />
        <Route path="/field-assistant" element={<FieldAssistant />} />
        <Route path="/response-generator" element={<ResponseGenerator />} />
        <Route path="/objections" element={<ObjectionLibrary />} />
        <Route path="/people" element={<PeopleTracking />} />
        <Route path="/people/:id" element={<PersonDetail />} />
        <Route path="/progress" element={<MyProgress />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App