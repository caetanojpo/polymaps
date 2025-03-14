import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps {
    id: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
}

const InputLogin: React.FC<InputProps> = ({
                                              id,
                                              type,
                                              value,
                                              onChange,
                                              placeholder = '',
                                              required = false,
                                              disabled = false,
                                          }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const inputType = type === 'password' && isPasswordVisible ? 'text' : type;

    return (
        <div className="relative">
            <input
                id={id}
                type={inputType}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="p-3 mt-1 block w-full text-[1.2rem] text-dark rounded-md border-gray-200 border border-solid shadow-sm"
                required={required}
            />
            {type === 'password' && (
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={disabled}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    aria-label="Toggle password visibility"
                >
                    {isPasswordVisible ? (
                        <EyeOff className="w-8 h-8 text-subprimary-700 cursor-pointer" />
                    ) : (
                        <Eye className="w-8 h-8 text-subprimary-700 cursor-pointer" />
                    )}
                </button>
            )}
        </div>
    );
};

export default InputLogin;
