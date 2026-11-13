import React from 'react';

export default function Card({ children, className = '', hover = false, onClick, ...props }) {
    return (
        <div
            onClick={onClick}
            className={`bg-white dark:bg-[#15171C] border border-[#E5E8EC] dark:border-[#262A32] rounded-[26px] p-6 text-[#121417] dark:text-[#F2F4F7] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-200 ${
                hover ? 'hover:border-[#121417]/20 dark:hover:border-[#383E4A] hover:shadow-[0_14px_36px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_14px_36px_rgba(0,0,0,0.5)] hover:-translate-y-1' : ''
            } ${onClick ? 'cursor-pointer' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
