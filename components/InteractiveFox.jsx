import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function InteractiveFox({ size = 110 }) {
    const cardRef = useRef(null);

    // Mouse coordinates relative to card center
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring physics
    const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
    const rotateX = useSpring(useTransform(y, [-80, 80], [18, -18]), springConfig);
    const rotateY = useSpring(useTransform(x, [-80, 80], [-18, 18]), springConfig);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 600,
                rotateX,
                rotateY,
                width: size,
                height: size,
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="cursor-pointer select-none inline-flex items-center justify-center p-3 rounded-3xl bg-white dark:bg-[#17191E] border border-[#E5E8EC] dark:border-[#2A2E36] shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-colors"
            title="Ambeverages Official Logo"
        >
            <img
                src="/logo.svg"
                alt="Ambeverages Logo Badge"
                className="w-full h-full object-contain pointer-events-none drop-shadow-sm select-none"
                loading="eager"
            />
        </motion.div>
    );
}
