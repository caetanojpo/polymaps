'use client';

import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import Label from "@/components/atoms/Labels/Label";
import InputLogin from "@/components/atoms/Inputs/InputLogin";
import { Button } from "@/components/atoms/Buttons/Button";

interface LoginFormProps {
    isLogin: boolean;
    email: string;
    password: string;
    name: string;
    onEmailChange: (email: string) => void;
    onPasswordChange: (password: string) => void;
    onNameChange: (name: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    disabled?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
                                                 isLogin,
                                                 email,
                                                 password,
                                                 name,
                                                 onEmailChange,
                                                 onPasswordChange,
                                                 onNameChange,
                                                 onSubmit,
                                                 disabled = false,
                                             }) => (
    <form onSubmit={onSubmit} className="space-y-4">
        {!isLogin && (
            <div>
                <Label htmlFor="name">Name</Label>
                <InputLogin
                    id="name"
                    type="text"
                    value={name}
                    placeholder="Enter your complete name"
                    onChange={onNameChange}
                    required
                    disabled={disabled}
                />
            </div>
        )}
        <div>
            <Label htmlFor="email">Email</Label>
            <InputLogin
                id="email"
                type="email"
                value={email}
                placeholder="email@email.com"
                onChange={onEmailChange}
                required
                disabled={disabled}
            />
        </div>
        <div>
            <Label htmlFor="password">Password</Label>
            <InputLogin
                id="password"
                type="password"
                value={password}
                placeholder="*******"
                onChange={onPasswordChange}
                required
                disabled={disabled}
            />
        </div>
        <Button type="submit" disabled={disabled}>
            {disabled ? (
                <span>Loading...</span>
            ) : isLogin ? (
                <>
                    <LogIn className="w-8 h-8 mr-4" />
                    Sign In
                </>
            ) : (
                <>
                    <UserPlus className="w-8 h-8 mr-4" />
                    Sign Up
                </>
            )}
        </Button>
    </form>
);

export default LoginForm;
