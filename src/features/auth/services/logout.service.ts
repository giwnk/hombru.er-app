"use server";

import { createServerSupabase } from "@/lib/supabase/supabase";
import { AUTH_MESSAGES } from "../constants/auth.constants";
import { ActionResponse } from "@/shared/response.type";

export async function logoutService(): Promise<ActionResponse> {
  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      message: AUTH_MESSAGES.SUCCESS.LOGOUT,
    };
  } catch (err) {
    console.error("Logout Server Action Error:", err);
    return {
      success: false,
      error: AUTH_MESSAGES.ERROR.LOGOUT_FAILED,
    };
  }
}
