import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export function Input({label, className = '',type, ...props}: InputProps) {
    const isLat = label.toLowerCase().includes("latitude");
    const isLng = label.toLowerCase().includes("longitude");
    return (
        <div>
            <label className="block text-[1.1rem] font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type={type || "text"}
                className={`block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-blue-500 focus:ring focus:ring-blue-200 ${className}`}
                min={isLat ? "-90" : isLng ? "-180" : undefined}
                max={isLat ? "90" : isLng ? "180" : undefined}
                step="any"
                {...props}
            />
        </div>
    );
}