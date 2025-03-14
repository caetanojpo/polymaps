import React from 'react';
import {Input} from "@/components/atoms/Inputs/Input";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export function Field({ label, error, ...props }: FieldProps) {
    return (
        <div className="space-y-1">
            <Input label={label} className="text-[1.4rem] p-2" {...props} />
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}