import { useState } from 'react';
import { Button } from '@/shared/components';
import { useLogin } from '../hooks/useLogin';
import { validateLoginForm } from '../services/authService';
import { getApiErrorMessage } from '@/core/api/client';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    
      const validationErrors = validateLoginForm(email, password);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      
      // Limpiar errores y hacer login
      setErrors({});
      await loginMutation.mutateAsync({ email, password });
      
  };


  const demoCredentials = [
    {
      email: 'admin@selene.com',
      password: 'admin123',
      name: 'Admin de Selene',
      buttonText: 'Usar Admin de Selene'
    },
    {
      email: 'employee@selene.com',
      password: 'employee123',
      name: 'Empleado de Selene',
      buttonText: 'Usar Empleado de Selene'
    },
    {email:'admin@helios.com',
    password:'admin123',
    name: 'Admin de Helios',
    buttonText:'Usar Admin de Helios'
  },
  {email:'employee@helios.com',
  password:'employee123',
  name: 'Empleado de Helios',
  buttonText:'Usar Empleado de Helios'}
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
   
        
        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="tu@email.com"
                disabled={loginMutation.isPending}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="••••••••"
                disabled={loginMutation.isPending}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Error de login */}
          {loginMutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">
                {getApiErrorMessage(loginMutation.error) || 'Error al iniciar sesión'}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loginMutation.isPending}
              disabled={loginMutation.isPending}
              className="w-full"
            >
              {loginMutation.isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </div>

          {/* Demo credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Credenciales de prueba:</h4>
            <div className="text-xs text-blue-800 space-y-1">
              {demoCredentials.map((credential) => (
                <p key={credential.email} onClick={() => {
                  setEmail(credential.email);
                  setPassword(credential.password);
                }} className="cursor-pointer hover:text-blue-600 p-2 bg-blue-300/20 rounded-md">
                  <strong>{credential.name}:</strong> {credential.email} / {credential.password}
                </p>
              ))}
            </div>
           
          </div>
        </form>
      </div>
    </div>
  );
} 