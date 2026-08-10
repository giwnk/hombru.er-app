"use server";

import { createServerSupabase } from "@/lib/supabase/supabase";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import { ActionResponse } from "../types/auth.types";
import { RegisterFormValues, registerSchema } from "../types/register.schema";

export async function registerService(
  payload: RegisterFormValues
): Promise<ActionResponse> {
  try {
    const validatedData = registerSchema.safeParse(payload);

    if (!validatedData.success) {
      return {
        success: false,
        error: AUTH_MESSAGES.ERROR.INVALID_PAYLOAD,
      };
    }

    const { email, password, full_name, username } = validatedData.data;

    const supabase = await createServerSupabase();

    const { data: existingUser } = await supabase
      .from("user_profiles")
      .select("username")
      .eq("username", username)
      .maybeSingle();

    if (existingUser) {
      return {
        success: false,
        error: AUTH_MESSAGES.ERROR.USERNAME_TAKEN,
      };
    }

    const { headers } = await import("next/headers");
    const headerList = await headers();
    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      headerList.get("origin") ||
      headerList.get("referer") ||
      "http://localhost:3000";

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/auth/activation-success`,
        data: {
          full_name,
          username,
        },
      },
    });

    if (signUpError) {
      return {
        success: false,
        error: signUpError.message,
      };
    }

    return {
      success: true,
      message: AUTH_MESSAGES.SUCCESS.REGISTER,
    };
  } catch (err) {
    console.error("Register Server Action Error:", err);
    return {
      success: false,
      error: AUTH_MESSAGES.ERROR.SERVER_ERROR,
    };
  }
}
