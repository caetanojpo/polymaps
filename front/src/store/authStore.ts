import { create } from 'zustand';
import { User } from '@/types';

export interface AuthState {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: false,
    setUser: (user) => set({ user }),
    signIn: async (email, password) => {
        // Mock successful login
        const mockUser: User = {
            id: '1',
            name: 'Test User',
            email,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        set({ user: mockUser });
    },
    signUp: async (email, password, name) => {
        const mockUser: User = {
            id: '1',
            name,
            email,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        set({ user: mockUser });
    },
    signOut: async () => {
        set({ user: null });
    },
}));