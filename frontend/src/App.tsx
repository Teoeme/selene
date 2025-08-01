import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import { ProtectedRoute } from '@/core/router/ProtectedRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { EmployeeDashboard } from '@/pages/EmployeeDashboard';
import { useAuth } from '@/core/auth';
import { AdminDashboard } from './pages/AdminDashboard';

function DashboardRouter() {
  const { user } = useAuth();
  
  if (user?.role === 'EMPLOYEE') {
    return <EmployeeDashboard />;
  }
  if(user?.role === 'ADMIN') {
    return <AdminDashboard />;
  }
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<Navigate to={ROUTES.DASHBOARD} replace />} 
        />

        {/* Login */}
        <Route 
          path={ROUTES.LOGIN} 
          element={
            <ProtectedRoute requireAuth={false}>
              <LoginPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Dashboard */}
        <Route 
          path={ROUTES.DASHBOARD} 
          element={
            <ProtectedRoute requireAuth={true}>
              <DashboardRouter />
            </ProtectedRoute>
          } 
        />

        {/* 404 redireige al dashboard */}
        <Route 
          path="*" 
          element={<Navigate to={ROUTES.DASHBOARD} replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 