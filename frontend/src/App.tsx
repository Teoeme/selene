import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants';
import { ProtectedRoute } from '@/core/router/ProtectedRoute';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { Dashboard } from '@/pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz - redirige según autenticación */}
          <Route 
          path="/" 
          element={<Navigate to={ROUTES.DASHBOARD} replace />} 
        />
        
        {/* Ruta de login - solo para no autenticados */}
        <Route 
          path={ROUTES.LOGIN} 
          element={
            <ProtectedRoute requireAuth={false}>
              <LoginPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta principal - solo para autenticados */}
        <Route 
          path={ROUTES.DASHBOARD} 
          element={
            <ProtectedRoute requireAuth={true}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta 404 - redirige al dashboard */}
        <Route 
          path="*" 
          element={<Navigate to={ROUTES.DASHBOARD} replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 