import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const location = useLocation();

  const { data: userResponse, isLoading, isError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: authApi.getMe,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium animate-pulse">Verifying session...</p>
        </div>
      </div>
    );
  }

  const user = userResponse?.data;

  // Not logged in
  if (isError || !user) {
    // Determine the best login route based on the requested path or allowed roles
    let loginPath = "/?login=true";
    if (location.pathname.startsWith("/admin")) {
      loginPath = "/admin/login";
    } else if (location.pathname.startsWith("/lab")) {
      loginPath = "/laboratory/login";
    }

    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Logged in, but wrong role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Send them to their appropriate dashboard/home
    if (user.role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "LAB") return <Navigate to="/lab/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
