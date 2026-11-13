import React from 'react';

export default function Card({ children, className = '', hover = false, onClick, ...props }) {
    return (
        <div
            onClick={onClick}
            className={`bg-white border border-[#E5E8EC] rounded-[26px] p-6 text-[#121417] shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-200 ${
                hover ? 'hover:border-[#121417]/20 hover:shadow-[0_14px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1' : ''
            } ${onClick ? 'cursor-pointer' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
