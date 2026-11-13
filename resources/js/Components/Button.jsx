import React from 'react';

export default function Button({
    type = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    children,
    onClick,
    ...props
}) {
    const variants = {
        primary: 'bg-[#F6851B] hover:bg-[#E2761B] text-white shadow-[0_4px_16px_rgba(246,133,27,0.3)] active:scale-[0.98] border border-[#F6851B]',
        secondary: 'bg-[#1F2226] hover:bg-[#2A2E35] text-[#F2F4F6] border border-[#373C44] active:scale-[0.98]',
        outline: 'bg-transparent hover:bg-[#F6851B]/10 text-[#F6851B] border border-[#F6851B]/60 active:scale-[0.98]',
        danger: 'bg-[#D73A49] hover:bg-[#BA2F3D] text-white shadow-[0_4px_14px_rgba(215,58,73,0.3)] active:scale-[0.98] border border-[#D73A49]',
        ghost: 'bg-transparent hover:bg-white/5 text-[#BBC0C5] hover:text-white',
        success: 'bg-[#28A745] hover:bg-[#218838] text-white shadow-[0_4px_14px_rgba(40,167,69,0.3)] active:scale-[0.98] border border-[#28A745]',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
        md: 'px-4 py-2.5 text-sm rounded-xl gap-2 font-medium',
        lg: 'px-6 py-3.5 text-base rounded-2xl gap-2.5 font-semibold',
        icon: 'p-2 rounded-xl',
    };

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`inline-flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none select-none ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
