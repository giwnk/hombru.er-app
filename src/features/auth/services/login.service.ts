"use server";

import { createServerSupabase } from "@/lib/supabase/supabase";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import { ActionResponse } from "@/shared/response.type";
import { UserProfileType } from "../types/auth.types";
import { LoginFormValues, loginSchema } from "../types/login.schema";

export async function loginService(
  payload: LoginFormValues
): Promise<ActionResponse<UserProfileType>> {
  try {
    const validatedData = loginSchema.safeParse(payload);
    if (!validatedData.success) {
      return {
        success: false,
        error: AUTH_MESSAGES.ERROR.INVALID_PAYLOAD,
      };
    }

    const supabase = await createServerSupabase();

    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: validatedData.data.email,
        password: validatedData.data.password,
      });

    if (authError) {
      if (
        authError.message.toLowerCase().includes("email not confirmed") ||
        authError.message.toLowerCase().includes("unconfirmed")
      ) {
        return {
          success: false,
          error: AUTH_MESSAGES.ERROR.EMAIL_UNCONFIRMED,
        };
      }

      return {
        success: false,
        error: AUTH_MESSAGES.ERROR.INVALID_CREDENTIALS,
      };
    }

    let userProfile: UserProfileType = {
      id: authData.user.id,
      full_name: authData.user.user_metadata?.full_name || "",
      username: authData.user.user_metadata?.username || "",
    };

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", authData.user.id)
      .maybeSingle();

    if (profile) {
      userProfile = {
        id: profile.id,
        full_name: profile.full_name || userProfile.full_name,
        username: profile.username || userProfile.username,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        created_at: profile.created_at,
      };
    }

    return {
      success: true,
      message: AUTH_MESSAGES.SUCCESS.LOGIN,
      data: userProfile,
    };
  } catch (err) {
    console.error("Login Server Action Error:", err);
    return {
      success: false,
      error: AUTH_MESSAGES.ERROR.SERVER_ERROR,
    };
  }
}
