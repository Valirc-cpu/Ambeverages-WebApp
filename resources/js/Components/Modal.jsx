import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
                onClick={onClose}
            />

            {/* Modal Dialog */}
            <div
                className={`relative w-full ${maxWidth} bg-white border border-[#E5E8EC] rounded-[32px] shadow-[0_25px_70px_rgba(0,0,0,0.25)] p-7 z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150`}
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#F0F2F5] mb-5">
                    <h3 className="text-xl font-extrabold text-[#121417] tracking-tight">
                        {title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full text-[#6B7280] hover:text-[#121417] hover:bg-[#F2F4F7] transition-colors"
                        aria-label="Tutup"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto pr-1 flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}
