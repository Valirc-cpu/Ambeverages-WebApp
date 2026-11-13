import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function ParallaxVectors() {
    const { scrollY } = useScroll();

    // Smooth spring physics for natural, buttery scroll inertia
    const springConfig = { damping: 26, stiffness: 85, mass: 0.9 };

    // --- Parallax Scroll Transforms ---
    // 1. Giant Center-Top Sunburst
    const y1 = useSpring(useTransform(scrollY, [0, 2000], [0, 480]), springConfig);
    const r1 = useSpring(useTransform(scrollY, [0, 2000], [0, 120]), springConfig);

    // 2. Wavy Liquid Squiggle Ribbon (Drifts across center)
    const y2 = useSpring(useTransform(scrollY, [0, 2000], [0, -380]), springConfig);
    const x2 = useSpring(useTransform(scrollY, [0, 2000], [0, 160]), springConfig);
    const r2 = useSpring(useTransform(scrollY, [0, 2000], [-10, 35]), springConfig);

    // 3. Giant Dual Torus Portal (Center-Right)
    const y3 = useSpring(useTransform(scrollY, [0, 2000], [0, 520]), springConfig);
    const s3 = useSpring(useTransform(scrollY, [0, 1500], [0.95, 1.18]), springConfig);

    // 4. Geometric Archway with Staring Eye (Left-Center)
    const y4 = useSpring(useTransform(scrollY, [0, 2500], [0, -420]), springConfig);
    const r4 = useSpring(useTransform(scrollY, [0, 2500], [0, -75]), springConfig);

    // 5. Giant 8-Petal Rosette Daisy (Center-Bottom)
    const y5 = useSpring(useTransform(scrollY, [0, 2500], [0, -500]), springConfig);
    const r5 = useSpring(useTransform(scrollY, [0, 2500], [0, 180]), springConfig);

    // 6. Scalloped Sunny Wave Tunnel (Bottom-Left)
    const y6 = useSpring(useTransform(scrollY, [0, 2500], [0, 360]), springConfig);
    const r6 = useSpring(useTransform(scrollY, [0, 2500], [20, -60]), springConfig);

    // 7. Modern Floating Capsule (Foreground Layer - Right)
    const y7 = useSpring(useTransform(scrollY, [0, 2000], [0, -320]), springConfig);
    const r7 = useSpring(useTransform(scrollY, [0, 2000], [-20, 60]), springConfig);

    // 8. Geometric Starburst Sparkle (Upper-Left)
    const y8 = useSpring(useTransform(scrollY, [0, 1800], [0, 280]), springConfig);
    const r8 = useSpring(useTransform(scrollY, [0, 1800], [0, 140]), springConfig);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
            {/* ============================================================== */}
            {/* 1. Giant Center-Top Sunburst Gear (Electric Orange & Volt Lime) */}
            {/* Positioned behind Hero title and Fox in background (z-0)       */}
            {/* ============================================================== */}
            <motion.div
                style={{ y: y1, rotate: r1 }}
                className="absolute -top-20 left-[24%] sm:left-[35%] w-80 h-80 sm:w-[500px] sm:h-[500px] pointer-events-auto cursor-pointer z-0 opacity-70 dark:opacity-55"
                title="Interactive Mega Sunburst: Hover & Scroll"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 55, ease: 'linear' }}
                    whileHover={{ scale: 1.15, transition: { duration: 0.3 } }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                        {/* 12 Sunburst Rays */}
                        <g fill="currentColor" className="text-[#FA4B00] dark:text-[#FF661F]">
                            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                                <rect
                                    key={deg}
                                    x="138"
                                    y="15"
                                    width="24"
                                    height="85"
                                    rx="12"
                                    transform={`rotate(${deg} 150 150)`}
                                />
                            ))}
                        </g>
                        {/* Inner Concentric Disc */}
                        <circle cx="150" cy="150" r="70" fill="currentColor" className="text-[#B9F24B] dark:text-[#C5FF3B]" />
                        <circle cx="150" cy="150" r="38" fill="currentColor" className="text-[#121417] dark:text-[#090A0D]" />
                        <circle cx="150" cy="150" r="14" fill="currentColor" className="text-white dark:text-[#FA4B00]" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* ============================================================== */}
            {/* 2. Massive Wavy Liquid Squiggle Ribbon (Lavender Purple)       */}
            {/* Positioned drifting across the center canvas                   */}
            {/* ============================================================== */}
            <motion.div
                style={{ y: y2, x: x2, rotate: r2 }}
                className="absolute top-[42%] left-[16%] sm:left-[24%] w-[380px] sm:w-[620px] h-48 sm:h-64 pointer-events-auto cursor-pointer z-0 opacity-80 dark:opacity-65"
                title="Interactive Wave Squiggle"
            >
                <motion.div
                    animate={{
                        y: [0, -18, 0],
                        rotate: [-3, 4, -3],
                    }}
                    transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
                    whileHover={{ scale: 1.12, transition: { duration: 0.3 } }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 600 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                        <path
                            d="M20 100 C 100 20, 180 180, 260 100 C 340 20, 420 180, 500 100 C 540 60, 580 80, 580 100 C 580 140, 500 180, 440 140 C 360 80, 280 180, 200 120 C 140 80, 60 160, 20 100 Z"
                            fill="currentColor"
                            className="text-[#C66EF5] dark:text-[#D489FF]"
                        />
                        <path
                            d="M80 100 Q 180 40, 260 100 T 440 100"
                            stroke="currentColor"
                            strokeWidth="14"
                            strokeLinecap="round"
                            className="text-white dark:text-[#090A0D]"
                        />
                        <circle cx="260" cy="100" r="16" fill="currentColor" className="text-[#FA4B00] dark:text-[#FF661F]" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* ============================================================== */}
            {/* 3. Giant Dual Torus Portal (Electric Cyan & Orange)            */}
            {/* Positioned at center-right canvas (z-10)                       */}
            {/* ============================================================== */}
            <motion.div
                style={{ y: y3, scale: s3 }}
                className="absolute top-[28%] right-[8%] sm:right-[15%] w-72 h-72 sm:w-[440px] sm:h-[440px] pointer-events-auto cursor-pointer z-10 opacity-75 dark:opacity-65"
                title="Interactive Cyan Portal: Slow Continuous Spin"
            >
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 42, ease: 'linear' }}
                    whileHover={{ scale: 1.15, rotate: -45, transition: { duration: 0.3 } }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                        <circle cx="150" cy="150" r="120" stroke="currentColor" strokeWidth="26" strokeDasharray="30 15" className="text-[#38BDF8] dark:text-[#42C8FF]" />
                        <circle cx="150" cy="150" r="75" stroke="currentColor" strokeWidth="18" className="text-[#FA4B00] dark:text-[#FF661F]" />
                        <circle cx="150" cy="150" r="32" fill="currentColor" className="text-[#121417] dark:text-[#090A0D]" />
                        <circle cx="150" cy="150" r="12" fill="currentColor" className="text-[#B9F24B] dark:text-[#C5FF3B]" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* ============================================================== */}
            {/* 4. Geometric Archway with Staring Eye (Volt Lime & Carbon)     */}
            {/* Positioned at left-center canvas                               */}
            {/* ============================================================== */}
            <motion.div
                style={{ y: y4, rotate: r4 }}
                className="absolute top-[52%] -left-12 sm:left-[3%] w-72 h-72 sm:w-[420px] sm:h-[420px] pointer-events-auto cursor-pointer z-10 opacity-80 dark:opacity-70"
                title="Interactive Archway: Pendulum Sway"
            >
                <motion.div
                    animate={{ rotate: [-8, 12, -8] }}
                    transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }}
                    whileHover={{ scale: 1.15, rotate: 30, transition: { duration: 0.3 } }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                        <path
                            d="M40 260 C 40 120, 100 40, 200 40 C 270 40, 280 120, 280 200 C 280 270, 200 280, 150 240 C 100 200, 40 280, 40 260 Z"
                            fill="currentColor"
                            className="text-[#B9F24B] dark:text-[#C5FF3B]"
                        />
                        <circle cx="170" cy="140" r="42" fill="currentColor" className="text-[#121417] dark:text-[#090A0D]" />
                        <circle cx="170" cy="140" r="20" fill="currentColor" className="text-[#FA4B00] dark:text-[#FF661F]" />
                        <circle cx="170" cy="140" r="7" fill="currentColor" className="text-white" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* ============================================================== */}
            {/* 5. Giant 8-Petal Rosette Daisy (Volt Lime & Amber Golden)      */}
            {/* Positioned at center-bottom canvas (z-0)                       */}
            {/* ============================================================== */}
            <motion.div
                style={{ y: y5, rotate: r5 }}
                className="absolute bottom-10 left-[38%] sm:left-[45%] w-80 h-80 sm:w-[480px] sm:h-[480px] pointer-events-auto cursor-pointer z-0 opacity-75 dark:opacity-60"
                title="Interactive Rosette Daisy: Clockwise Spin"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 48, ease: 'linear' }}
                    whileHover={{ scale: 1.18, transition: { duration: 0.3 } }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                        {/* 8 Elliptical Petals */}
                        <g fill="currentColor" className="text-[#F59E0B] dark:text-[#FBBF24]">
                            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                                <ellipse
                                    key={deg}
                                    cx="150"
                                    cy="65"
                                    rx="28"
                                    ry="50"
                                    transform={`rotate(${deg} 150 150)`}
                                />
                            ))}
                        </g>
                        <circle cx="150" cy="150" r="54" fill="currentColor" className="text-[#121417] dark:text-[#090A0D]" />
                        <circle cx="150" cy="150" r="22" fill="currentColor" className="text-[#B9F24B] dark:text-[#C5FF3B]" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* ============================================================== */}
            {/* 6. Scalloped Sunny Wave Tunnel (Golden Amber & Orange)         */}
            {/* Positioned at bottom-left canvas                               */}
            {/* ============================================================== */}
            <motion.div
                style={{ y: y6, rotate: r6 }}
                className="absolute -bottom-16 -left-10 sm:left-[8%] w-72 h-72 sm:w-[450px] sm:h-[450px] pointer-events-auto cursor-pointer z-0 opacity-75 dark:opacity-60"
                title="Interactive Scallop Wave"
            >
                <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [-4, 6, -4] }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
                    whileHover={{ scale: 1.16, rotate: -45, transition: { duration: 0.3 } }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                        <path
                            d="M30 150 A 120 120 0 0 1 270 150 L 255 210 Q 150 270, 45 210 Z"
                            fill="currentColor"
                            className="text-[#FA4B00] dark:text-[#FF661F]"
                        />
                        <path
                            d="M75 150 A 75 75 0 0 1 225 150"
                            stroke="currentColor"
                            strokeWidth="18"
                            strokeLinecap="round"
                            className="text-white dark:text-[#090A0D]"
                        />
                        <circle cx="150" cy="110" r="16" fill="currentColor" className="text-[#B9F24B] dark:text-[#C5FF3B]" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* ============================================================== */}
            {/* 7. Modern Floating Pill Capsule with Orbit (Cobalt & Lime)     */}
            {/* Positioned foreground layer (z-20) overlapping right margin   */}
            {/* ============================================================== */}
            <motion.div
                style={{ y: y7, rotate: r7 }}
                className="absolute top-[60%] -right-10 sm:right-[3%] w-60 h-60 sm:w-80 sm:h-80 pointer-events-auto cursor-pointer z-20 opacity-85 dark:opacity-75"
                title="Interactive Orbit Capsule: Foreground Float"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 32, ease: 'linear' }}
                    whileHover={{ scale: 1.2, transition: { duration: 0.3 } }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                        <rect x="75" y="30" width="100" height="190" rx="50" fill="currentColor" className="text-[#B9F24B] dark:text-[#C5FF3B]" />
                        <circle cx="125" cy="80" r="32" fill="currentColor" className="text-[#121417] dark:text-[#090A0D]" />
                        <circle cx="125" cy="80" r="14" fill="currentColor" className="text-[#FA4B00] dark:text-[#FF661F]" />
                        <circle cx="125" cy="165" r="22" stroke="currentColor" strokeWidth="8" className="text-[#121417] dark:text-[#090A0D]" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* ============================================================== */}
            {/* 8. 8-Point Playful Geometric Starburst (Upper-Left Diagonal)   */}
            {/* Positioned at upper center-left canvas (z-10)                  */}
            {/* ============================================================== */}
            <motion.div
                style={{ y: y8, rotate: r8 }}
                className="absolute top-[12%] left-[4%] sm:left-[10%] w-64 h-64 sm:w-80 sm:h-80 pointer-events-auto cursor-pointer z-10 opacity-80 dark:opacity-70"
                title="Interactive Starburst: Slow Continuous Spin"
            >
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 36, ease: 'linear' }}
                    whileHover={{ scale: 1.22, rotate: 180, transition: { duration: 0.3 } }}
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
        </div>
    );
}
