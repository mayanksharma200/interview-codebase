import { create } from 'zustand';
export const useAuthStore = create((set) => ({
  token: null,
  login: (token) => set({ token }),
  logout: () => set({ token: null }),
}));
