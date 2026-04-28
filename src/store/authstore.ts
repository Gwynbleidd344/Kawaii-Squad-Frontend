import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../lib/api';
import type {
  UserPublic,
  IdentityStatus,
  LoginRequest,
  RegisterRequest,
} from '../types/index';

export interface AuthStore {
  // State
  user: UserPublic | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: UserPublic | null) => void;
  setToken: (token: string | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;

  // Auth actions
  register: (data: RegisterRequest) => Promise<UserPublic>;
  login: (data: LoginRequest) => Promise<{ user: UserPublic; token: string }>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  fetchCurrentUser: () => Promise<UserPublic>;
  fetchUserStatus: () => Promise<IdentityStatus>;

  // Reset
  reset: () => void;
}

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Zustand auth store with persistence
 * Handles user authentication state and API interactions
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Setters
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setError: (error) => set({ error }),
      setLoading: (loading) => set({ isLoading: loading }),

      // Register new user
      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.register(data);
          set({
            user: response.user,
            isLoading: false,
          });
          return response.user;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Registration failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Login
      login: async (data: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.login(data);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });
          return {
            user: response.user,
            token: response.token,
          };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Login failed';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      // Logout
      logout: () => {
        apiClient.clearToken();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Check authentication status
      checkAuthStatus: async () => {
        const token = get().token;
        if (!token) {
          set({ isAuthenticated: false });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await apiClient.getMe();
          set({
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Failed to verify authentication',
          });
          apiClient.clearToken();
        }
      },

      // Fetch current user
      fetchCurrentUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.getMe();
          set({
            user: response.user,
            isLoading: false,
          });
          return response.user;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to fetch user';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Fetch user status
      fetchUserStatus: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.getUserStatus();
          // Update user status if we have a user
          const state = get();
          if (state.user) {
            set({
              user: {
                ...state.user,
                status: response.status,
                rejectionReason: response.rejectionReason,
              },
            });
          }
          set({ isLoading: false });
          return response.status;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to fetch status';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Reset store
      reset: () => set(initialState),
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }), // Only persist these fields
    }
  )
);
