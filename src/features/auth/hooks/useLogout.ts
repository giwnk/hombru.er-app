import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AUTH_MESSAGES, AUTH_ROUTES } from "../constants/auth.constants";
import { logoutService } from "../services/logout.service";
import { useAuthStore } from "../stores/auth.store";

export const useLogout = () => {
  const router = useRouter();
  const logoutState = useAuthStore((state) => state.logout);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await logoutService();
      logoutState();

      if (response.success) {
        toast.success(response.message || AUTH_MESSAGES.SUCCESS.LOGOUT);
      } else {
        toast.error(response.error || AUTH_MESSAGES.ERROR.LOGOUT_FAILED);
      }

      router.push(AUTH_ROUTES.LOGIN);
    } catch (error) {
      console.error("useLogout Error:", error);
      logoutState();
      router.push(AUTH_ROUTES.LOGIN);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogout, isLoading };
};
