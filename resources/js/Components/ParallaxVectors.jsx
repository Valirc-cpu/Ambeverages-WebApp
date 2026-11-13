import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function ParallaxVectors() {
    const { scrollY } = useScroll();

    // Smooth spring physics for natural, buttery scroll inertia
    const springConfig = { damping: 25, stiffness: 85, mass: 0.85 };

    // --- Parallax Scroll Transforms (All Distributed Across Top Zone) ---
    // 1. Top-Far-Left: Starburst
    const y1 = useSpring(useTransform(scrollY, [0, 1500], [0, 180]), springConfig);
    const r1 = useSpring(useTransform(scrollY, [0, 1500], [0, 90]), springConfig);

    // 2. Top-Mid-Left: Wavy Ribbon Arch
    const y2 = useSpring(useTransform(scrollY, [0, 1500], [0, 240]), springConfig);
    const r2 = useSpring(useTransform(scrollY, [0, 1500], [-8, 25]), springConfig);

    // 3. Top-Center: Sunburst Gear
    const y3 = useSpring(useTransform(scrollY, [0, 1500], [0, 160]), springConfig);
    const r3 = useSpring(useTransform(scrollY, [0, 1500], [0, -75]), springConfig);

    // 4. Top-Mid-Right: Dual Torus Portal
    const y4 = useSpring(useTransform(scrollY, [0, 1500], [0, 220]), springConfig);
    const s4 = useSpring(useTransform(scrollY, [0, 1000], [0.95, 1.12]), springConfig);

    // 5. Top-Far-Right: Half-Moon Geo & Rosette
    const y5 = useSpring(useTransform(scrollY, [0, 1500], [0, 190]), springConfig);
    const r5 = useSpring(useTransform(scrollY, [0, 1500], [10, -60]), springConfig);

    return (
        <div className="fixed inset-x-0 top-0 h-[500px] pointer-events-none overflow-hidden select-none z-0">
            {/* ============================================================== */}
            {/* 1. TOP-FAR-LEFT: 8-Point Geometric Starburst (Orange & Lime)   */}
            {/* Position: Far left corner, z-10                                */}
            {/* ============================================================== */}
            <motion.div
                style={{ y: y1, rotate: r1 }}
                className="absolute -top-12 -left-10 sm:left-[2%] w-52 h-52 sm:w-72 sm:h-72 pointer-events-auto cursor-pointer z-10 opacity-80 dark:opacity-65"
                title="Top-Left Starburst: Slow Spin"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 42, ease: 'linear' }}
                    whileHover={{ scale: 1.15, transition: { duration: 0.25 } }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                        <path
                            d="M125 0 L155 95 L250 125 L155 155 L125 250 L95 155 L0 125 L95 95 Z"
                            fill="currentColor"
                            className="text-[#FA4B00] dark:text-[#FF661F]"
                        />
                        <circle cx="125" cy="125" r="36" fill="currentColor" className="text-[#121417] dark:text-[#090A0D]" />
                        <circle cx="125" cy="125" r="15" fill="currentColor" className="text-[#B9F24B] dark:text-[#C5FF3B]" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* ============================================================== */}
            {/* 2. TOP-MID-LEFT: Wavy Liquid Ribbon Arch (Lavender Purple)     */}
            {/* Position: Mid-left horizon, z-0 (deep background)             */}
            {/* ============================================================== */}
            <motion.div
                style={{ y: y2, rotate: r2 }}
                className="absolute top-4 left-[20%] sm:left-[24%] w-56 h-56 sm:w-72 sm:h-72 pointer-events-auto cursor-pointer z-0 opacity-75 dark:opacity-60"
                title="Top-Mid-Left Ribbon: Swaying Drift"
            >
                <motion.div
                    animate={{
                        y: [0, -14, 0],
                        rotate: [-6, 8, -6],
                    }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
                    whileHover={{ scale: 1.14, transition: { duration: 0.25 } }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                        <path
                            d="M30 180 C 40 70, 160 50, 220 120 C 270 180, 200 260, 120 240 C 60 220, 20 230, 30 180 Z"
                            fill="currentColor"
                            className="text-[#C66EF5] dark:text-[#D489FF]"
                        />
                        <path
                            d="M70 160 Q 140 100, 190 150"
                            stroke="currentColor"
                            strokeWidth="16"
                            strokeLinecap="round"
                            className="text-white dark:text-[#090A0D]"
                        />
                        <circle cx="190" cy="150" r="16" fill="currentColor" className="text-[#FA4B00] dark:text-[#FF661F]" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* ============================================================== */}
            {/* 3. TOP-CENTER: 12-Ray Sunburst Gear (Golden Amber & Orange)    */}
            {/* Position: Center horizon, z-0 (behind center title)           */}
            {/* ============================================================== */}
            <motion.div
                style={{ y: y3, rotate: r3 }}
                className="absolute -top-16 left-[44%] sm:left-[48%] w-60 h-60 sm:w-80 sm:h-80 pointer-events-auto cursor-pointer z-0 opacity-70 dark:opacity-55"
                title="Top-Center Sunburst: Continuous Spin"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 50, ease: 'linear' }}
                    whileHover={{ scale: 1.15, transition: { duration: 0.25 } }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                        {/* 12 Radiating Petals */}
                        <g fill="currentColor" className="text-[#F59E0B] dark:text-[#FBBF24]">
                            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                                <rect
                                    key={deg}
                                    x="138"
                                    y="20"
                                    width="24"
                                    height="75"
                                    rx="12"
                                    transform={`rotate(${deg} 150 150)`}
                                />
                            ))}
                        </g>
                        <circle cx="150" cy="150" r="60" fill="currentColor" className="text-[#FA4B00] dark:text-[#FF661F]" />
                        <circle cx="150" cy="150" r="30" fill="currentColor" className="text-[#121417] dark:text-[#090A0D]" />
                        <circle cx="150" cy="150" r="10" fill="currentColor" className="text-[#B9F24B] dark:text-[#C5FF3B]" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* ============================================================== */}
            {/* 4. TOP-MID-RIGHT: Dual Torus Portal (Electric Cyan & Lime)     */}
            {/* Position: Mid-right horizon near Fox, z-10                    */}
            {/* ============================================================== */}
            <motion.div
                style={{ y: y4, scale: s4 }}
                className="absolute top-2 left-[68%] sm:left-[72%] w-52 h-52 sm:w-68 sm:h-68 pointer-events-auto cursor-pointer z-10 opacity-80 dark:opacity-65"
                title="Top-Mid-Right Cyan Torus: Breathing Spin"
            >
                <motion.div
                    animate={{ rotate: -360, scale: [1, 1.06, 1] }}
                    transition={{
                        rotate: { repeat: Infinity, duration: 38, ease: 'linear' },
                        scale: { repeat: Infinity, duration: 6, ease: 'easeInOut' },
                    }}
                    whileHover={{ scale: 1.18, transition: { duration: 0.25 } }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                        <circle cx="150" cy="150" r="115" stroke="currentColor" strokeWidth="24" strokeDasharray="25 15" className="text-[#38BDF8] dark:text-[#42C8FF]" />
                        <circle cx="150" cy="150" r="70" stroke="currentColor" strokeWidth="16" className="text-[#B9F24B] dark:text-[#C5FF3B]" />
                        <circle cx="150" cy="150" r="28" fill="currentColor" className="text-[#121417] dark:text-[#090A0D]" />
                        <circle cx="150" cy="150" r="10" fill="currentColor" className="text-[#FA4B00] dark:text-[#FF661F]" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* ============================================================== */}
            {/* 5. TOP-FAR-RIGHT: Scalloped Half-Moon & Star (Lime & Orange)   */}
            {/* Position: Far right corner, z-20 (foreground accent)          */}
            {/* ============================================================== */}
            <motion.div
                style={{ y: y5, rotate: r5 }}
                className="absolute -top-10 -right-8 sm:right-[2%] w-56 h-56 sm:w-72 sm:h-72 pointer-events-auto cursor-pointer z-20 opacity-85 dark:opacity-75"
                title="Top-Right Half-Moon: Rocking Sway"
            >
                <motion.div
                    animate={{ rotate: [-8, 12, -8] }}
                    transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
                    whileHover={{ scale: 1.15, rotate: 30, transition: { duration: 0.25 } }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                        <path
                            d="M30 130 C 30 60, 90 20, 160 20 C 220 20, 240 80, 240 140 C 240 200, 180 230, 120 230 C 50 230, 30 190, 30 130 Z"
                            fill="currentColor"
                            className="text-[#B9F24B] dark:text-[#C5FF3B]"
                        />
                        <circle cx="145" cy="120" r="40" fill="currentColor" className="text-[#121417] dark:text-[#090A0D]" />
                        <circle cx="145" cy="120" r="18" fill="currentColor" className="text-[#FA4B00] dark:text-[#FF661F]" />
                        <circle cx="145" cy="120" r="6" fill="currentColor" className="text-white" />
                    </svg>
                </motion.div>
            </motion.div>
        </div>
    );
}
