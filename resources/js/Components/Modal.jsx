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
                className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-200"
                onClick={onClose}
            />

            {/* Modal Dialog */}
            <div
                className={`relative w-full ${maxWidth} bg-[#16181B] border border-[#2F343C] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] p-6 z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150`}
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[#262A30] mb-4">
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                        {title}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-full text-[#8F96A0] hover:text-white hover:bg-white/10 transition-colors"
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
