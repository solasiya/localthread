import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: () => React.JSX.Element;
  roles?: string[];
}

export function ProtectedRoute({
  path,
  component: Component,
  roles = []
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {() => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          );
        }

        if (!user) {
          return <Redirect to={`/auth?redirect=${encodeURIComponent(path)}`} />;
        }

        if (roles.length > 0 && !roles.includes(user.role)) {
          return <Redirect to="/" />;
        }

        return <Component />;
      }}
    </Route>
  );
}
