import React from 'react';
import {DivideIcon as LucideIcon} from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'link';
    type?: 'button' | 'submit' | 'reset';
    icon?: typeof LucideIcon;
    children: React.ReactNode;
}

export function Button({
                           variant = 'primary',
                           type = 'button',
                           icon: Icon,
                           children,
                           className = '',
                           ...props
                       }: ButtonProps) {
    const baseStyles = "w-full flex  items-center mt-10 justify-center px-4 py-2 rounded-md text-[1.8rem] font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer transition duration-200";

    const variants = {
        primary: "bg-primary hover:bg-subprimary-700 text-white border-transparent",
        secondary: "border border-primary text-subprimary-700 hover:bg-subprimary-50",
        link: "text-subprimary-600 hover:text-subprimary-800"
    };

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {Icon && <Icon className="w-10 h-10 mr-2"/>}
            {children}
        </button>
    );
}