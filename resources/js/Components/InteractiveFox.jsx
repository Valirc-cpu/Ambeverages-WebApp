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
            className="cursor-pointer select-none inline-flex items-center justify-center p-2 rounded-2xl bg-white border border-[#E5E8EC] shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
            title="Arahkan kursor untuk menggerakkan Fox!"
        >
            <svg
                viewBox="0 0 318.6 315.9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <path fill="#E2761B" stroke="#E2761B" strokeWidth="2" d="M274.1 35.5l-99.5 73.9L194 65.4z" />
                <path fill="#E4761B" stroke="#E4761B" strokeWidth="2" d="M44.4 35.5l119.1 30-20.9 44z" />
                <path fill="#E4761B" stroke="#E4761B" strokeWidth="2" d="M238.3 206.8l-30 45.9 59.8 16.5 17.2-59.2z" />
                <path fill="#E4761B" stroke="#E4761B" strokeWidth="2" d="M33.3 210l17.3 59.2 59.7-16.5-29.9-45.9z" />
                <path fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="2" d="M87.8 131.7l-21.4 32.5 59.3 2.7-2-63.5z" />
                <path fill="#233447" stroke="#233447" strokeWidth="2" d="M87.8 131.7l35.9-28.3-37.9-38z" />
                <path fill="#CD6116" stroke="#CD6116" strokeWidth="2" d="M85.8 65.4l37.9 38-37.9 28.3z" />
                <path fill="#E4751F" stroke="#E4751F" strokeWidth="2" d="M125.7 103.4l-37.9-38 37.9 38z" />
                <path fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="2" d="M230.8 131.7l-35.9-28.3-2 63.5 59.3-2.7z" />
                <path fill="#233447" stroke="#233447" strokeWidth="2" d="M230.8 131.7l2-66.3-37.9 38z" />
                <path fill="#CD6116" stroke="#CD6116" strokeWidth="2" d="M232.8 65.4l-37.9 38 37.9 28.3z" />
                <path fill="#141618" stroke="#141618" strokeWidth="2" d="M106.8 190.9l-20.9 31.9 44.9-1.9z" />
                <path fill="#141618" stroke="#141618" strokeWidth="2" d="M211.8 190.9l-24 30 44.9 1.9z" />
                <path fill="#F6851B" stroke="#F6851B" strokeWidth="2" d="M159.3 162.2l-33.6-58.8-40 28.3 39.9 33.2z" />
                <path fill="#F6851B" stroke="#F6851B" strokeWidth="2" d="M159.3 162.2l33.8-58.8 40.2 28.3-40.4 33.2z" />
                <path fill="#C0AD9E" stroke="#C0AD9E" strokeWidth="2" d="M159.3 227.1l-28.5-5.3-3 20.3 31.5 5.9z" />
                <path fill="#C0AD9E" stroke="#C0AD9E" strokeWidth="2" d="M159.3 227.1l28.5-5.3 3 20.3-31.5 5.9z" />
                <path fill="#161616" stroke="#161616" strokeWidth="2" d="M159.3 248l-31.5-5.9 15.7 34.6 15.8-28.7z" />
                <path fill="#161616" stroke="#161616" strokeWidth="2" d="M159.3 248l31.5-5.9-15.7 34.6-15.8-28.7z" />
                <path fill="#763D16" stroke="#763D16" strokeWidth="2" d="M159.3 162.2l-33.6 28.7 33.6 36.2 33.8-36.2z" />
            </svg>
        </motion.div>
    );
}
