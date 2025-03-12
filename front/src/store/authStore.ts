import {create} from 'zustand';
import {User} from '@/types';

export interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, name: string) => Promise<void>;
    signOut: () => Promise<void>;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    loading: false,
    setUser: (user) => set({user}),
    setToken: (token) => set({token}),
    signIn: async (email, password) => {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        });
        const data = await response.json();
        console.log(data);
        if (data.status === "error") {
            throw new Error(data.message || 'Login failed');
        }
        set({user: data.data.mappedUser, token: data.data.token});
    },
    signUp: async (email, password, name) => {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, email, password})
        });
        const data = await response.json();
        console.log(data);
        if (data.status === "error") {
            throw new Error(data.message || 'Sign up failed');
        }
        await get().signIn(email, password);
    },
    signOut: async () => {
        set({user: null});
    }
}));
