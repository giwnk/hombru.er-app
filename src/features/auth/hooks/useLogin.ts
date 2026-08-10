import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AUTH_MESSAGES, AUTH_ROUTES } from "../constants/auth.constants";
import { loginSchema, type LoginFormValues } from "../types/login.schema";
import { loginService } from "../services/login.service";
import { useAuthStore } from "../stores/auth.store";

export const useLogin = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitHandler = async (data: LoginFormValues) => {
    // Bersihkan root error sebelumnya
    form.clearErrors("root");

    try {
      const response = await loginService(data);

      if (!response.success) {
        // Tampilkan pesan error langsung di dalam form, BUKAN di toast
        form.setError("root", {
          type: "manual",
          message: response.error || AUTH_MESSAGES.ERROR.INVALID_CREDENTIALS,
        });
        return;
      }

      if (response.data) {
        setUser(response.data);
      }

      form.reset();
      router.push(AUTH_ROUTES.DASHBOARD);
    } catch (error) {
      console.error("useLogin Error:", error);
      form.setError("root", {
        type: "manual",
        message: AUTH_MESSAGES.ERROR.NETWORK_ERROR,
      });
    }
  };

  return {
    form,
    register: form.register,
    errors: form.formState.errors,
    onSubmit: form.handleSubmit(submitHandler),
    isSubmitting: form.formState.isSubmitting,
  };
};
