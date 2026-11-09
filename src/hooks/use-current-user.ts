import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";

/**
 * The signed-in staff member (shares the "userProfile" cache with the layout).
 * `isAdmin` is the Litmus super-admin login; employees only get what their permissions allow.
 */
export function useCurrentUser() {
  const { data } = useQuery({ queryKey: ["userProfile"], queryFn: authApi.getMe });
  const user = data?.data;
  const isAdmin = user?.role === "ADMIN";
  const can = (permission: string) =>
    isAdmin || (user?.role === "EMPLOYEE" && Array.isArray(user?.permissions) && user.permissions.includes(permission));
  return { user, isAdmin, can };
}
