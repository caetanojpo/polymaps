import React from 'react';

interface LabelProps {
    htmlFor: string;
    children: React.ReactNode;
}

const Label: React.FC<LabelProps> = ({htmlFor, children}) => (
    <label htmlFor={htmlFor} className="block text-[1.2rem] font-medium text-dark">
        {children}
    </label>
);

export default Label;