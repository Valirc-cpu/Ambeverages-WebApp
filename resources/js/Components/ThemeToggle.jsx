import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '' }) {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const isCurrentDark = document.documentElement.classList.contains('dark');
        setIsDark(isCurrentDark);
    }, []);

    const toggleTheme = () => {
        const nextDark = !isDark;
        setIsDark(nextDark);

        if (nextDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('metadrink_theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('metadrink_theme', 'light');
        }
    };

    if (!mounted) {
        return (
            <div className={`w-10 h-10 rounded-full bg-[#ECEFF2] dark:bg-[#1A1D22] ${className}`} />
        );
    }

    return (
        <motion.button
            type="button"
            onClick={toggleTheme}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className={`relative flex items-center justify-center w-10 h-10 rounded-full bg-[#ECEFF2] dark:bg-[#1D2026] text-[#121417] dark:text-[#F2F4F7] border border-[#DCE0E5] dark:border-[#2C313A] shadow-xs cursor-pointer select-none transition-colors ${className}`}
            title={isDark ? 'Beralih ke Mode Terang (Light)' : 'Beralih ke Mode Gelap (Dark)'}
            aria-label="Toggle Theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                    <motion.div
                        key="moon"
                        initial={{ opacity: 0, rotate: -60, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 60, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Moon className="w-4 h-4 text-[#B9F24B] fill-[#B9F24B]/30" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ opacity: 0, rotate: 60, scale: 0.5 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: -60, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Sun className="w-4 h-4 text-[#FA4B00] fill-[#FA4B00]/30" />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
