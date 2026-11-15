import React from 'react';

export default function MetaMaskLogo({ className = 'w-9 h-9', showText = true, textSize = 'text-xl' }) {
    return (
        <div className="flex items-center gap-3 select-none">
            {/* Official Ambeverages Vector Logo */}
            <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
                <img
                    src="/logo.svg"
                    alt="Ambeverages Logo"
                    className="w-full h-full object-contain select-none"
                    loading="eager"
                />
            </div>
            {showText && (
                <div className="flex flex-col">
                    <span className={`font-extrabold tracking-tight text-[#121417] dark:text-white leading-none ${textSize}`}>
                        Am<span className="text-[#FA4B00]">beverages</span>
                    </span>
                    <span className="text-[10px] font-bold tracking-widest text-[#8F96A0] dark:text-[#9CA3AF] mt-0.5">
                        I Am Beverages.
                    </span>
                </div>
            )}
        </div>
    );
}
