import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        document.cookie = `session=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        set({ user, token, isAuthenticated: true });
      },
      clearAuth: () => {
        document.cookie = 'session=; path=/; max-age=0';
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: 'auth-store' }
  )
);
