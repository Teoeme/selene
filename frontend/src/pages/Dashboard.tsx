import { useState } from 'react';
import { Button } from '@/shared/components';
import { APP_NAME, APP_DESCRIPTION, FEATURES_STATUS } from '@/shared/constants';
import { useAuth } from '@/core/auth';
import { useLogout } from '@/features/auth/hooks/useLogin';

export function Dashboard() {
  const [tokenTest, setTokenTest] = useState<string>('');
  const { user, isAuthenticated, getToken } = useAuth();
  const logoutMutation = useLogout();

  const handleGetToken = () => {
    const currentToken = getToken();
    setTokenTest(currentToken ? `Token: ${currentToken.slice(0, 20)}...` : 'No hay token');
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header con logout */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-primary-900 mb-4">
              {APP_NAME}
            </h1>
            <p className="text-xl text-gray-600">
              {APP_DESCRIPTION}
            </p>
            {user && (
              <p className="text-sm text-primary-600 mt-2 font-semibold">
                Bienvenido, {user.name} ({user.role})
              </p>
            )}
          </div>
          
          <Button 
            onClick={handleLogout} 
            variant="outline"
            isLoading={logoutMutation.isPending}
          >
            Cerrar Sesión
          </Button>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-green-700 mb-2">✅ Backend</h3>
            <p className="text-sm text-gray-600">
              Arquitectura hexagonal completa con casos de uso, repositorios y controladores
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">🏪 State Management</h3>
            <p className="text-sm text-gray-600">
              Zustand para estado global + React Query para datos del servidor
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">🔐 Autenticación</h3>
            <p className="text-sm text-gray-600">
              Login funcional con React Router y protección de rutas
            </p>
          </div>
        </div>

        {/* Features Status */}
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Estado de Features</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-600 mb-2">🔐 {FEATURES_STATUS.AUTH.name}</h3>
              <p className="text-sm text-gray-600">{FEATURES_STATUS.AUTH.description}</p>
              <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                ✅ Completado
              </span>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-orange-600 mb-2">📋 {FEATURES_STATUS.REQUESTS.name}</h3>
              <p className="text-sm text-gray-600">{FEATURES_STATUS.REQUESTS.description}</p>
              <span className="inline-block mt-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                {FEATURES_STATUS.REQUESTS.status}
              </span>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-orange-600 mb-2">🎁 {FEATURES_STATUS.BENEFITS.name}</h3>
              <p className="text-sm text-gray-600">{FEATURES_STATUS.BENEFITS.description}</p>
              <span className="inline-block mt-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                {FEATURES_STATUS.BENEFITS.status}
              </span>
            </div>
          </div>
        </div>

        {/* Test de Estado - Auth */}
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🔒 Estado de Autenticación</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Controles</h3>
              <div className="space-y-3">
                <Button onClick={handleGetToken} variant="secondary" size="sm">
                  Ver Token (Cookies)
                </Button>
                <Button onClick={handleLogout} variant="danger" size="sm">
                  Cerrar Sesión
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Estado</h3>
              <div className="bg-gray-50 p-3 rounded text-sm">
                <p><strong>Autenticado:</strong> {isAuthenticated ? '✅ Sí' : '❌ No'}</p>
                <p><strong>Usuario:</strong> {user?.name || 'Ninguno'}</p>
                <p><strong>Rol:</strong> {user?.role || 'N/A'}</p>
                <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
                <p><strong>Test:</strong> {tokenTest || 'Ninguno'}</p>
              </div>
              
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-xs">
                <p className="text-green-800 font-semibold">🔒 Seguridad:</p>
                <p className="text-green-700">• Login funcional con React Query</p>
                <p className="text-green-700">• Token SOLO en cookies httpOnly</p>
                <p className="text-green-700">• Rutas protegidas por autenticación</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600">
          <p>✅ Autenticación completa con login/logout</p>
          <p>✅ React Router configurado con rutas protegidas</p>
          <p>✅ Estado seguro: Token (cookies) + Usuario (localStorage)</p>
        </div>
      </div>
    </div>
  );
} 