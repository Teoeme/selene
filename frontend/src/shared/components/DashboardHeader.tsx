import { useAuthUser } from "@/core/auth";
import { APP_DESCRIPTION, APP_NAME } from "../constants"
import { Button } from "./Button";
import { useLogout } from "@/features/auth";

export const DashboardHeader = () => {
    const user  = useAuthUser();
    const logoutMutation = useLogout()
    
    const handleLogout = () => {
        logoutMutation.mutate();
      };
    
    return (
        <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary-900 mb-2">
              {APP_NAME}
            </h1>
            <p className="text-lg text-gray-600">
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
        </div>
    )
}

