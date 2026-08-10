import { create } from "zustand";
import { UserProfileType } from "../types/auth.types";

interface AuthState {
  user: UserProfileType | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfileType | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
