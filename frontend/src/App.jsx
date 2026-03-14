import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CandidatesPage from './pages/CandidatesPage';
import CandidateDetailPage from './pages/CandidateDetailPage';
import SessionsPage from './pages/SessionsPage';
import AuditLogsPage from './pages/AuditLogsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'dark:!bg-slate-800 dark:!text-slate-100 dark:!border-slate-700 !bg-white !text-slate-900 !border-slate-200 !rounded-xl !text-sm !shadow-xl',
              }}
            />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route path="/dashboard"
                element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
              <Route path="/candidates"
                element={<ProtectedLayout><CandidatesPage /></ProtectedLayout>} />
              <Route path="/candidates/:id"
                element={<ProtectedLayout><CandidateDetailPage /></ProtectedLayout>} />
              <Route path="/sessions"
                element={<ProtectedLayout><SessionsPage /></ProtectedLayout>} />
              <Route path="/audit-logs"
                element={<ProtectedLayout><AuditLogsPage /></ProtectedLayout>} />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
