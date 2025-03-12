'use client';

import React from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import Label from "@/components/atoms/login/Label";
import Input from "@/components/atoms/login/Input";
import {Button} from "@/components/atoms/Button";


interface LoginFormProps {
    isLogin: boolean;
    email: string;
    password: string;
    name: string;
    onEmailChange: (email: string) => void;
    onPasswordChange: (password: string) => void;
    onNameChange: (name: string) => void;
    onSubmit: (e: React.FormEvent) => void;
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
                                             }) => (
    <form onSubmit={onSubmit} className="space-y-4">
        {!isLogin && (
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    type="text"
                    value={name}
                    placeholder="Enter your complete name"
                    onChange={onNameChange}
                    required
                />
            </div>
        )}
        <div>
            <Label htmlFor="email">Email</Label>
            <Input
                id="email"
                type="email"
                value={email}
                placeholder="email@email.com"
                onChange={onEmailChange}
                required
            />
        </div>
        <div>
            <Label htmlFor="password">Password</Label>
            <Input
                id="password"
                type="password"
                value={password}
                placeholder="*******"
                onChange={onPasswordChange}
                required
            />
        </div>
        <Button type="submit">
            {isLogin ? (
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
