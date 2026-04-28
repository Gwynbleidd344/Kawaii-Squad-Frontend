import { create } from 'zustand';
import { apiClient } from '../lib/api';
import type { CinResponse } from '../types/index';

export interface CinStore {
  cin: CinResponse | null;
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;

  fetchCin: () => Promise<void>;
  createCin: (cinPhoto: File) => Promise<CinResponse>;
  reset: () => void;
}

const initialState = {
  cin: null as CinResponse | null,
  isLoading: false,
  error: null as string | null,
  hasFetched: false,
};

export const useCinStore = create<CinStore>()((set) => ({
  ...initialState,

  fetchCin: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getMyCin();
      set({ cin: response.cin, isLoading: false, hasFetched: true });
    } catch (error: any) {
      // 404 = no CIN yet, that's not a real error
      if (error?.status === 404) {
        set({ cin: null, isLoading: false, hasFetched: true });
        return;
      }
      const msg = error instanceof Error ? error.message : 'Failed to fetch CIN';
      set({ error: msg, isLoading: false, hasFetched: true });
    }
  },

  createCin: async (cinPhoto: File) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.createCin(cinPhoto);
      set({ cin: response.cin, isLoading: false, hasFetched: true });
      return response.cin;
    } catch (error: any) {
      // 409 = already exists, set the returned CIN
      if (error?.status === 409 && error?.data?.cin) {
        set({ cin: error.data.cin, isLoading: false, hasFetched: true });
        throw error;
      }
      const msg = error instanceof Error ? error.message : 'Failed to create CIN';
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  reset: () => set(initialState),
}));
