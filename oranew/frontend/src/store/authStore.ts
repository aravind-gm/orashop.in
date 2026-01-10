import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  role: string;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        localStorage.setItem('ora_token', token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('ora_token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (user) => set({ user }),
      setToken: (token) => {
        localStorage.setItem('ora_token', token);
        set({ token, isAuthenticated: true });
      },
      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },
    }),
    {
      name: 'ora-auth',
    }
  )
);
