import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AUTH_MESSAGES, AUTH_ROUTES } from "../constants/auth.constants";
import { registerSchema, type RegisterFormValues } from "../types/register.schema";
import { registerService } from "../services/register.service";

export const useRegister = () => {
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const submitHandler = async (data: RegisterFormValues) => {
    form.clearErrors();

    try {
      const response = await registerService(data);

      if (!response.success) {
        // Tempelkan error langsung di field atau root form, BUKAN di toast
        if (
          response.error &&
          response.error.toLowerCase().includes("username")
        ) {
          form.setError("username", {
            type: "manual",
            message: response.error,
          });
        } else {
          form.setError("root", {
            type: "manual",
            message: response.error || AUTH_MESSAGES.ERROR.INVALID_PAYLOAD,
          });
        }
        return;
      }

      form.reset();
      // Redirect ke halaman sukses registrasi / cek email
      router.push(AUTH_ROUTES.VERIFY_EMAIL);
    } catch (error) {
      console.error("useRegister Error:", error);
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
