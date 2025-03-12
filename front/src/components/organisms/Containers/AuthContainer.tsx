'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import LoginForm from '@/components/molecules/Forms/LoginForm';

export default function AuthContainer() {
    const router = useRouter();
    const signIn = useAuthStore((state) => state.signIn);
    const signUp = useAuthStore((state) => state.signUp);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const preValidateData = (errors: string[]) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Please enter a valid email.');
        }
        if (!isLogin) {
            if (name.trim().length < 2) {
                errors.push('Name must be at least 2 characters long.');
            }
        }
        if (password.length < 6) {
            errors.push('Password must be at least 6 characters long.');
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
        if (!passwordRegex.test(password)) {
            errors.push('Password must include at least one uppercase letter, one number, and one special character.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        const errors: string[] = [];
        preValidateData(errors);

        if (errors.length > 0) {
            setError(errors.join(' '));
            setIsSubmitting(false);
            return;
        }

        try {
            if (isLogin) {
                await signIn(email, password);
            } else {
                await signUp(email, password, name);
            }
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen w-screen min-h-screen bg-dark flex items-center justify-center">
            <div className="bg-secondary p-8 rounded-lg shadow-md w-full max-w-xl">
                <h2 className="text-[2rem] text-dark font-bold mb-6 text-center">
                    {isLogin ? 'Sign In' : 'Create Account'}
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 overflow-x-scroll">
                        {error}
                    </div>
                )}

                <LoginForm
                    isLogin={isLogin}
                    email={email}
                    password={password}
                    name={name}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    onNameChange={setName}
                    onSubmit={handleSubmit}
                    disabled={isSubmitting}
                />

                <div className="mt-4 text-center">
                    <button
                        disabled={isSubmitting}
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[1.4rem] text-dark hover:text-subprimary-800 cursor-pointer transition duration-200 disabled:opacity-50"
                    >
                        {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
}
