import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function ParallaxVectors() {
    const { scrollY } = useScroll();

    // Balanced spring physics for organic motion
    const springConfig = { damping: 25, stiffness: 85, mass: 0.85 };

    // --- Parallax Scroll Transforms ---
    // 1. Top-Left Starburst
    const y1 = useSpring(useTransform(scrollY, [0, 1500], [0, 160]), springConfig);
    const r1 = useSpring(useTransform(scrollY, [0, 1500], [0, 90]), springConfig);

    // 2. Top-Center GIGANTIC Sunburst Gear (520px)
    const y3 = useSpring(useTransform(scrollY, [0, 1500], [0, 180]), springConfig);
    const r3 = useSpring(useTransform(scrollY, [0, 1500], [0, -80]), springConfig);

    // 3. Top-Mid-Right Dual Torus
    const y4 = useSpring(useTransform(scrollY, [0, 1500], [0, 200]), springConfig);
    const s4 = useSpring(useTransform(scrollY, [0, 1000], [0.95, 1.12]), springConfig);

    // 4. Right-Mid Edge Modern Orbiting Capsule
    const y7 = useSpring(useTransform(scrollY, [0, 2000], [0, 320]), springConfig);
    const r7 = useSpring(useTransform(scrollY, [0, 2000], [0, -120]), springConfig);

    // 5. Bottom-Left Scalloped Sunny Wave
    const y8 = useSpring(useTransform(scrollY, [0, 2500], [0, 260]), springConfig);
    const r8 = useSpring(useTransform(scrollY, [0, 2500], [15, -45]), springConfig);

    // 6. Bottom-Right 8-Petal Rosette Daisy
    const y9 = useSpring(useTransform(scrollY, [0, 2500], [0, -320]), springConfig);
    const r9 = useSpring(useTransform(scrollY, [0, 2500], [0, 160]), springConfig);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
            {/* ============================================================== */}
            {/* 1. TOP-LEFT: 8-Point Geometric Starburst (Ambmanggo Orange)    */}
            {/* ============================================================== */}
            <motion.div
                style={{ y: y1, rotate: r1 }}
                className="absolute -top-10 left-[2%] sm:left-[6%] w-44 h-44 sm:w-56 sm:h-56 pointer-events-auto cursor-pointer z-10 opacity-80 dark:opacity-65"
                title="Top-Left Starburst"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 42, ease: 'linear' }}
                    whileHover={{ scale: 1.15, transition: { duration: 0.25 } }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path
                            d="M125 0 L155 95 L250 125 L155 155 L125 250 L95 155 L0 125 L95 95 Z"
                            fill="currentColor"
                            className="text-[#FA4B00] dark:text-[#FF661F]"
                        />
                        <circle cx="125" cy="125" r="36" fill="currentColor" className="text-[#121417] dark:text-[#090A0D]" />
                        <circle cx="125" cy="125" r="15" fill="currentColor" className="text-white dark:text-[#ECEFF2]" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* ============================================================== */}
            {/* 2. TOP-CENTER: GIGANTIC 12-Ray Sunburst Gear (Mango & Amber)   */}
            {/* ============================================================== */}
            <motion.div
                style={{ y: y3, rotate: r3 }}
                className="absolute -top-28 left-[34%] sm:left-[38%] w-80 h-80 sm:w-[520px] sm:h-[520px] pointer-events-auto cursor-pointer z-0 opacity-75 dark:opacity-60"
                title="Top-Center Mega Sunburst Gear"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 52, ease: 'linear' }}
                    whileHover={{ scale: 1.12, transition: { duration: 0.25 } }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        {/* 12 Radiating Petals */}
                        <g fill="currentColor" className="text-[#F59E0B] dark:text-[#FBBF24]">
                            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                                <rect
                                    key={deg}
                                    x="138"
                                    y="16"
                                    width="24"
                                    height="82"
                                    rx="12"
                                    transform={`rotate(${deg} 150 150)`}
                                />
                            ))}
                        </g>
                        <circle cx="150" cy="150" r="68" fill="currentColor" className="text-[#FA4B00] dark:text-[#FF661F]" />
                        <circle cx="150" cy="150" r="34" fill="currentColor" className="text-[#121417] dark:text-[#090A0D]" />
                        <circle cx="150" cy="150" r="12" fill="currentColor" className="text-white dark:text-[#FBBF24]" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* ============================================================== */}
            {/* 3. TOP-MID-RIGHT: Dual Torus Portal (Amberry Ruby & Pineapple) */}
            {/* ============================================================== */}
            <motion.div
                style={{ y: y4, scale: s4 }}
                className="absolute top-4 left-[68%] sm:left-[72%] w-36 h-36 sm:w-48 sm:h-48 pointer-events-auto cursor-pointer z-10 opacity-80 dark:opacity-65"
                title="Top-Mid-Right Torus"
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
                    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <circle cx="150" cy="150" r="115" stroke="currentColor" strokeWidth="24" strokeDasharray="25 15" className="text-[#BE123C] dark:text-[#E11D48]" />
                        <circle cx="150" cy="150" r="70" stroke="currentColor" strokeWidth="16" className="text-[#EAB308] dark:text-[#FACC15]" />
                        <circle cx="150" cy="150" r="28" fill="currentColor" className="text-[#121417] dark:text-[#090A0D]" />
                        <circle cx="150" cy="150" r="10" fill="currentColor" className="text-[#FA4B00] dark:text-[#FF661F]" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* ============================================================== */}
            {/* 4. RIGHT-MID EDGE: Modern Orbiting Capsule (Pineapple & Berry) */}
            {/* ============================================================== */}
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
                    <svg viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <rect x="75" y="30" width="100" height="190" rx="50" fill="currentColor" className="text-[#EAB308] dark:text-[#CA8A04]" />
                        <circle cx="125" cy="80" r="32" fill="currentColor" className="text-[#121417] dark:text-[#090A0D]" />
                        <circle cx="125" cy="80" r="14" fill="currentColor" className="text-[#BE123C] dark:text-[#9F1239]" />
                        <circle cx="125" cy="165" r="22" stroke="currentColor" strokeWidth="8" className="text-white dark:text-[#FA4B00]" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* ============================================================== */}
            {/* 5. BOTTOM-LEFT: Scalloped Sunny Wave Tunnel (Mango & Berry)    */}
            {/* ============================================================== */}
            <motion.div
                style={{ y: y8, rotate: r8 }}
                className="absolute -bottom-16 -left-6 sm:left-[3%] w-68 h-68 sm:w-88 sm:h-88 pointer-events-auto cursor-pointer z-0 opacity-75 dark:opacity-60"
                title="Bottom-Left Scallop Wave"
            >
                <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [-4, 6, -4] }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
                    whileHover={{ scale: 1.15, rotate: -40, transition: { duration: 0.25 } }}
                    className="w-full h-full"
                >
                    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
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
                        <circle cx="150" cy="110" r="16" fill="currentColor" className="text-[#BE123C] dark:text-[#E11D48]" />
                    </svg>
                </motion.div>
            </motion.div>

            {/* ============================================================== */}
            {/* 6. BOTTOM-RIGHT: 8-Petal Rosette Daisy (Amberry Ruby & Mango)  */}
            {/* ============================================================== */}
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
                    <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <g fill="currentColor" className="text-[#BE123C] dark:text-[#E11D48]">
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
                        <circle cx="150" cy="150" r="22" fill="currentColor" className="text-[#FA4B00] dark:text-[#FF661F]" />
                    </svg>
                </motion.div>
            </motion.div>
        </div>
    );
}
