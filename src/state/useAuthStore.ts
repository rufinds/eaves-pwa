import { create } from 'zustand';
import {
  login as loginService,
  logout as logoutService,
  subscribeToAuthChanges,
} from '../services/authService';
import type { User } from '../types/User';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  /** False until the stored session has been checked once. */
  isInitialized: boolean;
  isLoading: boolean;
  /** Starts listening to auth changes. Returns the cleanup function. */
  initialize: () => () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  initialize: () =>
    subscribeToAuthChanges((user) => {
      set({ user, isAuthenticated: user !== null, isInitialized: true });
    }),
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const user = await loginService(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  logout: async () => {
    await logoutService();
    set({ user: null, isAuthenticated: false });
  },
}));
