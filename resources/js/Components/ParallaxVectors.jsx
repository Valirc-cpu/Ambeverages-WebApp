import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function ParallaxVectors() {
    const { scrollY } = useScroll();

    // Smooth spring physics for natural, buttery scroll inertia
    const springConfig = { damping: 25, stiffness: 85, mass: 0.85 };

    // --- Parallax Scroll Transforms ---
    // Top Zone (Loved by user)
    const y1 = useSpring(useTransform(scrollY, [0, 1500], [0, 160]), springConfig);
    const r1 = useSpring(useTransform(scrollY, [0, 1500], [0, 90]), springConfig);

    const y2 = useSpring(useTransform(scrollY, [0, 1500], [0, 220]), springConfig);
    const r2 = useSpring(useTransform(scrollY, [0, 1500], [-8, 25]), springConfig);

    const y3 = useSpring(useTransform(scrollY, [0, 1500], [0, 150]), springConfig);
    const r3 = useSpring(useTransform(scrollY, [0, 1500], [0, -75]), springConfig);

    const y4 = useSpring(useTransform(scrollY, [0, 1500], [0, 200]), springConfig);
    const s4 = useSpring(useTransform(scrollY, [0, 1000], [0.95, 1.12]), springConfig);

    const y5 = useSpring(useTransform(scrollY, [0, 1500], [0, 180]), springConfig);
    const r5 = useSpring(useTransform(scrollY, [0, 1500], [10, -60]), springConfig);

    // Left, Right & Bottom Balanced Additions
    const y6 = useSpring(useTransform(scrollY, [0, 2000], [0, -280]), springConfig);
    const r6 = useSpring(useTransform(scrollY, [0, 2000], [-15, 35]), springConfig);

    const y7 = useSpring(useTransform(scrollY, [0, 2000], [0, 320]), springConfig);
    const r7 = useSpring(useTransform(scrollY, [0, 2000], [0, -120]), springConfig);

    const y8 = useSpring(useTransform(scrollY, [0, 2500], [0, 260]), springConfig);
    const r8 = useSpring(useTransform(scrollY, [0, 2500], [15, -45]), springConfig);

    const y9 = useSpring(useTransform(scrollY, [0, 2500], [0, -320]), springConfig);
    const r9 = useSpring(useTransform(scrollY, [0, 2500], [0, 160]), springConfig);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
            {/* ============================================================== */}
            {/* --- TOP CANOPY ZONE (Preserved as requested) ---              */}
            {/* ============================================================== */}

            {/* 1. Top-Far-Left: 8-Point Geometric Starburst (Orange & Lime) - Medium (w-56) */}
            <motion.div
                style={{ y: y1, rotate: r1 }}
                className="absolute -top-10 -left-8 sm:left-[2%] w-44 h-44 sm:w-56 sm:h-56 pointer-events-auto cursor-pointer z-10 opacity-80 dark:opacity-65"
                title="Top-Left Starburst"
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

            {/* 2. Top-Mid-Left: Wavy Liquid Ribbon Arch (Lavender Purple) - Large (w-72) */}
            <motion.div
                style={{ y: y2, rotate: r2 }}
                className="absolute top-3 left-[20%] sm:left-[24%] w-56 h-56 sm:w-72 sm:h-72 pointer-events-auto cursor-pointer z-0 opacity-75 dark:opacity-60"
                title="Top-Mid-Left Ribbon Arch"
            >
                <motion.div
                    animate={{
                        y: [0, -12, 0],
                        rotate: [-5, 7, -5],
                    }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
                    whileHover={{ scale: 1.12, transition: { duration: 0.25 } }}
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

            {/* 3. Top-Center: 12-Ray Sunburst Gear (Golden Amber) - Extra Large (w-80) */}
            <motion.div
                style={{ y: y3, rotate: r3 }}
                className="absolute -top-16 left-[44%] sm:left-[48%] w-60 h-60 sm:w-80 sm:h-80 pointer-events-auto cursor-pointer z-0 opacity-70 dark:opacity-55"
                title="Top-Center Sunburst Gear"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 50, ease: 'linear' }}
                    whileHover={{ scale: 1.14, transition: { duration: 0.25 } }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
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

            {/* 4. Top-Mid-Right: Dual Torus Portal (Electric Cyan & Lime) - Compact (w-48) */}
            <motion.div
                style={{ y: y4, scale: s4 }}
                className="absolute top-4 left-[68%] sm:left-[72%] w-36 h-36 sm:w-48 sm:h-48 pointer-events-auto cursor-pointer z-10 opacity-80 dark:opacity-65"
                title="Top-Mid-Right Cyan Torus"
            >
                <motion.div
                    animate={{ rotate: -360, scale: [1, 1.06, 1] }}
                    transition={{
                        rotate: { repeat: Infinity, duration: 38, ease: 'linear' },
                        scale: { repeat: Infinity, duration: 6, ease: 'easeInOut' },
                    }}
                    whileHover={{ scale: 1.16, transition: { duration: 0.25 } }}
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

            {/* 5. Top-Far-Right: Half-Moon Geo & Eye (Lime & Orange) - Medium-Large (w-64) */}
            <motion.div
                style={{ y: y5, rotate: r5 }}
                className="absolute -top-8 -right-6 sm:right-[3%] w-52 h-52 sm:w-64 sm:h-64 pointer-events-auto cursor-pointer z-20 opacity-85 dark:opacity-75"
                title="Top-Right Half-Moon"
            >
                <motion.div
                    animate={{ rotate: [-6, 10, -6] }}
                    transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
                    whileHover={{ scale: 1.14, rotate: 25, transition: { duration: 0.25 } }}
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

            {/* ============================================================== */}
            {/* --- BALANCED PERIPHERY ADDITIONS (Left, Right & Bottom) ---    */}
            {/* ============================================================== */}

            {/* 6. LEFT-MID EDGE: Organic Steam Arch (Electric Orange & Lime) - Compact (w-48) */}
            <motion.div
                style={{ y: y6, rotate: r6 }}
                className="absolute top-[44%] -left-10 sm:-left-14 w-36 h-36 sm:w-48 sm:h-48 pointer-events-auto cursor-pointer z-0 opacity-75 dark:opacity-60"
                title="Left Mid-Edge Arch"
            >
                <motion.div
                    animate={{ rotate: [-8, 12, -8] }}
                    transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
                    whileHover={{ scale: 1.15, transition: { duration: 0.25 } }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                        <path
                            d="M20 120 C 40 40, 140 40, 160 120 C 180 170, 90 190, 40 150 Z"
                            fill="currentColor"
                            className="text-[#FA4B00] dark:text-[#FF661F]"
                        />
                        <circle cx="90" cy="95" r="24" fill="currentColor" className="text-white dark:text-[#090A0D]" />
                        <circle cx="90" cy="95" r="10" fill="currentColor" className="text-[#B9F24B] dark:text-[#C5FF3B]" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* 7. RIGHT-MID EDGE: Modern Orbiting Capsule (Cyan & Volt Lime) - Large (w-76) */}
            <motion.div
                style={{ y: y7, rotate: r7 }}
                className="absolute top-[56%] -right-14 sm:-right-20 w-56 h-56 sm:w-76 sm:h-76 pointer-events-auto cursor-pointer z-10 opacity-80 dark:opacity-70"
                title="Right Mid-Edge Capsule"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 34, ease: 'linear' }}
                    whileHover={{ scale: 1.14, transition: { duration: 0.25 } }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                        <rect x="75" y="30" width="100" height="190" rx="50" fill="currentColor" className="text-[#38BDF8] dark:text-[#42C8FF]" />
                        <circle cx="125" cy="80" r="32" fill="currentColor" className="text-[#121417] dark:text-[#090A0D]" />
                        <circle cx="125" cy="80" r="14" fill="currentColor" className="text-[#B9F24B] dark:text-[#C5FF3B]" />
                        <circle cx="125" cy="165" r="22" stroke="currentColor" strokeWidth="8" className="text-white dark:text-[#FA4B00]" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* 8. BOTTOM-LEFT CORNER: Scalloped Sunny Wave Tunnel (Golden Amber) - Extra Large (w-88) */}
            <motion.div
                style={{ y: y8, rotate: r8 }}
                className="absolute -bottom-16 -left-16 sm:-left-24 w-68 h-68 sm:w-88 sm:h-88 pointer-events-auto cursor-pointer z-0 opacity-75 dark:opacity-60"
                title="Bottom-Left Scallop Wave"
            >
                <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [-4, 6, -4] }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
                    whileHover={{ scale: 1.15, rotate: -40, transition: { duration: 0.25 } }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                        <path
                            d="M30 150 A 120 120 0 0 1 270 150 L 255 210 Q 150 270, 45 210 Z"
                            fill="currentColor"
                            className="text-[#F59E0B] dark:text-[#FBBF24]"
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

            {/* 9. BOTTOM-RIGHT CORNER: 8-Petal Rosette Daisy (Volt Lime & Lavender) - Medium (w-60) */}
            <motion.div
                style={{ y: y9, rotate: r9 }}
                className="absolute -bottom-12 -right-8 sm:right-[3%] w-48 h-48 sm:w-60 sm:h-60 pointer-events-auto cursor-pointer z-10 opacity-80 dark:opacity-65"
                title="Bottom-Right Rosette Daisy"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 44, ease: 'linear' }}
                    whileHover={{ scale: 1.16, transition: { duration: 0.25 } }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
                        <g fill="currentColor" className="text-[#B9F24B] dark:text-[#C5FF3B]">
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
                        <circle cx="150" cy="150" r="22" fill="currentColor" className="text-[#C66EF5] dark:text-[#D489FF]" />
                    </svg>
                </motion.div>
            </motion.div>
        </div>
    );
}
