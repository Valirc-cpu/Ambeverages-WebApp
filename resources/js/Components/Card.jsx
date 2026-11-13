import React from 'react';

export default function Card({ children, className = '', hover = false, onClick, ...props }) {
    return (
        <div
            onClick={onClick}
            className={`bg-[#181A1D] border border-[#2B2F36] rounded-2xl p-5 text-[#F2F4F6] shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-200 ${
                hover ? 'hover:border-[#F6851B]/50 hover:bg-[#1E2125] hover:-translate-y-0.5' : ''
            } ${onClick ? 'cursor-pointer' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
