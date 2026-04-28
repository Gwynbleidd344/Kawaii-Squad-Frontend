import { create } from 'zustand';
import { apiClient } from '../lib/api';
import type {
  UserPublic,
  Pagination,
  CreateAdminRequest,
  IdentityStatus,
} from '../types/index';

export interface AdminStore {
  // State — identity list
  identities: UserPublic[];
  pagination: Pagination | null;
  selectedIdentity: UserPublic | null;
  statusFilter: IdentityStatus | undefined;
  isLoading: boolean;
  error: string | null;

  // Actions
  setStatusFilter: (status: IdentityStatus | undefined) => void;

  // Admin CRUD
  createAdmin: (data: CreateAdminRequest, adminSecret?: string) => Promise<UserPublic>;

  // Identity management
  fetchPendingIdentities: (page?: number, limit?: number) => Promise<void>;
  fetchAllIdentities: (page?: number, limit?: number) => Promise<void>;
  fetchIdentityDetail: (id: string) => Promise<UserPublic>;
  approveIdentity: (id: string) => Promise<UserPublic>;
  rejectIdentity: (id: string, reason: string) => Promise<UserPublic>;

  // Clear
  clearSelected: () => void;
  reset: () => void;
}

const initialState = {
  identities: [] as UserPublic[],
  pagination: null as Pagination | null,
  selectedIdentity: null as UserPublic | null,
  statusFilter: undefined as IdentityStatus | undefined,
  isLoading: false,
  error: null as string | null,
};

export const useAdminStore = create<AdminStore>()((set, get) => ({
  ...initialState,

  setStatusFilter: (status) => set({ statusFilter: status }),

  // Create admin account
  createAdmin: async (data, adminSecret) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.createAdmin(data, adminSecret);
      set({ isLoading: false });
      return response.admin;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to create admin';
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  // Fetch PENDING identities
  fetchPendingIdentities: async (page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getPendingIdentities(page, limit);
      set({
        identities: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to fetch identities';
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  // Fetch ALL identities with optional filter
  fetchAllIdentities: async (page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    try {
      const filter = get().statusFilter;
      const response = await apiClient.getAllIdentities(page, limit, filter);
      set({
        identities: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to fetch identities';
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  // Fetch single identity detail
  fetchIdentityDetail: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getIdentityDetail(id);
      set({ selectedIdentity: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to fetch identity';
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  // Approve identity
  approveIdentity: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.approveIdentity(id);
      // Update the identity in the list
      const identities = get().identities.map((i) =>
        i.id === id ? response.user : i
      );
      set({
        identities,
        selectedIdentity: response.user,
        isLoading: false,
      });
      return response.user;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to approve identity';
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  // Reject identity
  rejectIdentity: async (id, reason) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.rejectIdentity(id, { reason });
      // Update the identity in the list
      const identities = get().identities.map((i) =>
        i.id === id ? response.user : i
      );
      set({
        identities,
        selectedIdentity: response.user,
        isLoading: false,
      });
      return response.user;
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to reject identity';
      set({ error: msg, isLoading: false });
      throw error;
    }
  },

  clearSelected: () => set({ selectedIdentity: null }),
  reset: () => set(initialState),
}));
