import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function ParallaxVectors() {
    const { scrollY } = useScroll();

    // Smooth spring physics for scroll movement
    const springConfig = { damping: 25, stiffness: 90, mass: 0.8 };

    // Vector 1 (Top Left): Curved Big Ribbon / Arch
    const y1 = useSpring(useTransform(scrollY, [0, 1500], [0, 320]), springConfig);
    const r1 = useSpring(useTransform(scrollY, [0, 1500], [0, 45]), springConfig);

    // Vector 2 (Top Right): 8-Point Playful Geometric Starburst
    const y2 = useSpring(useTransform(scrollY, [0, 1500], [0, -280]), springConfig);
    const r2 = useSpring(useTransform(scrollY, [0, 1500], [0, 180]), springConfig);

    // Vector 3 (Middle Left): Bold Organic Squiggle / Steam Wave
    const y3 = useSpring(useTransform(scrollY, [0, 2000], [0, -350]), springConfig);
    const r3 = useSpring(useTransform(scrollY, [0, 2000], [-15, 30]), springConfig);

    // Vector 4 (Middle Right): Concentric Donut / Torus Ring
    const y4 = useSpring(useTransform(scrollY, [0, 2000], [0, 420]), springConfig);
    const s4 = useSpring(useTransform(scrollY, [0, 1000], [1, 1.25]), springConfig);

    // Vector 5 (Bottom Left): Scalloped Wave Arc
    const y5 = useSpring(useTransform(scrollY, [0, 2500], [0, -400]), springConfig);
    const r5 = useSpring(useTransform(scrollY, [0, 2500], [0, -60]), springConfig);

    // Vector 6 (Bottom Right): Fun Half-Moon Smiley Geometry
    const y6 = useSpring(useTransform(scrollY, [0, 2500], [0, 250]), springConfig);
    const r6 = useSpring(useTransform(scrollY, [0, 2500], [20, 140]), springConfig);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
            {/* 1. Top-Left: Bold Wavy Arch (Electric Orange) */}
            <motion.div
                style={{ y: y1, rotate: r1 }}
                whileHover={{ scale: 1.15, rotate: 60 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="absolute -top-10 -left-12 sm:left-4 w-44 h-44 sm:w-56 sm:h-56 pointer-events-auto cursor-pointer opacity-85 dark:opacity-75"
                title="Fun Vector: Wavy Arch"
            >
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                    <path
                        d="M20 120 C 40 40, 140 40, 160 120 C 180 170, 90 190, 40 150 Z"
                        fill="currentColor"
                        className="text-[#FA4B00] dark:text-[#FF661F]"
                    />
                    <circle cx="90" cy="95" r="24" fill="currentColor" className="text-white dark:text-[#090A0D]" />
                    <circle cx="90" cy="95" r="10" fill="currentColor" className="text-[#121417] dark:text-[#B9F24B]" />
                </svg>
            </motion.div>

            {/* 2. Top-Right: 8-Point Playful Starburst (Neon Lime Volt) */}
            <motion.div
                style={{ y: y2, rotate: r2 }}
                whileHover={{ scale: 1.2, rotate: 220 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="absolute top-28 -right-12 sm:right-6 w-36 h-36 sm:w-48 sm:h-48 pointer-events-auto cursor-pointer opacity-90 dark:opacity-80"
                title="Fun Vector: Neon Starburst"
            >
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                    <path
                        d="M100 0 L125 75 L200 100 L125 125 L100 200 L75 125 L0 100 L75 75 Z"
                        fill="currentColor"
                        className="text-[#B9F24B] dark:text-[#C5FF3B]"
                    />
                    <circle cx="100" cy="100" r="18" fill="currentColor" className="text-[#121417] dark:text-[#090A0D]" />
                </svg>
            </motion.div>

            {/* 3. Middle-Left: Organic Squiggle Wave (Vibrant Lavender Purple) */}
            <motion.div
                style={{ y: y3, rotate: r3 }}
                whileHover={{ scale: 1.15, rotate: 45 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="absolute top-[45%] -left-10 sm:left-6 w-40 h-40 sm:w-52 sm:h-52 pointer-events-auto cursor-pointer opacity-85 dark:opacity-75"
                title="Fun Vector: Lavender Squiggle"
            >
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                    <path
                        d="M30 60 Q 70 10, 110 60 T 170 70 Q 180 140, 130 150 T 40 120 Z"
                        fill="currentColor"
                        className="text-[#C66EF5] dark:text-[#D489FF]"
                    />
                    <path
                        d="M60 80 Q 90 40, 120 80 T 150 90"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeLinecap="round"
                        className="text-white dark:text-[#090A0D]"
                    />
                </svg>
            </motion.div>

            {/* 4. Middle-Right: Concentric Donut / Torus Ring (Electric Cyan) */}
            <motion.div
                style={{ y: y4, scale: s4 }}
                whileHover={{ scale: 1.25, rotate: -45 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="absolute top-[58%] -right-14 sm:right-8 w-44 h-44 sm:w-56 sm:h-56 pointer-events-auto cursor-pointer opacity-85 dark:opacity-75"
                title="Fun Vector: Electric Torus"
            >
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                    <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="24" className="text-[#38BDF8] dark:text-[#42C8FF]" />
                    <circle cx="100" cy="100" r="38" fill="currentColor" className="text-[#FA4B00] dark:text-[#FF661F]" />
                    <circle cx="100" cy="100" r="14" fill="currentColor" className="text-white dark:text-[#090A0D]" />
                </svg>
            </motion.div>

            {/* 5. Bottom-Left: Scalloped Sunny Wave (Warm Golden Amber) */}
            <motion.div
                style={{ y: y5, rotate: r5 }}
                whileHover={{ scale: 1.18, rotate: -90 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="absolute bottom-32 -left-12 sm:left-4 w-44 h-44 sm:w-56 sm:h-56 pointer-events-auto cursor-pointer opacity-90 dark:opacity-75"
                title="Fun Vector: Golden Scallop"
            >
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                    <path
                        d="M20 100 A 80 80 0 0 1 180 100 L 170 140 Q 100 180, 30 140 Z"
                        fill="currentColor"
                        className="text-[#F59E0B] dark:text-[#FBBF24]"
                    />
                    <path
                        d="M50 100 A 50 50 0 0 1 150 100"
                        stroke="currentColor"
                        strokeWidth="12"
                        strokeLinecap="round"
                        className="text-white dark:text-[#090A0D]"
                    />
                </svg>
            </motion.div>

            {/* 6. Bottom-Right: Chunky Half-Moon Capsule Geometry (Fresh Neon Lime / Orange Combo) */}
            <motion.div
                style={{ y: y6, rotate: r6 }}
                whileHover={{ scale: 1.2, rotate: 180 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="absolute -bottom-10 -right-10 sm:right-6 w-40 h-40 sm:w-52 sm:h-52 pointer-events-auto cursor-pointer opacity-90 dark:opacity-80"
                title="Fun Vector: Half-Moon Geo"
            >
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                    <path
                        d="M100 20 C 144 20, 180 56, 180 100 C 180 144, 144 180, 100 180 Z"
                        fill="currentColor"
                        className="text-[#B9F24B] dark:text-[#C5FF3B]"
                    />
                    <circle cx="100" cy="100" r="35" fill="currentColor" className="text-[#121417] dark:text-[#090A0D]" />
                    <circle cx="100" cy="100" r="16" fill="currentColor" className="text-[#FA4B00] dark:text-[#FF661F]" />
                </svg>
            </motion.div>
        </div>
    );
}
