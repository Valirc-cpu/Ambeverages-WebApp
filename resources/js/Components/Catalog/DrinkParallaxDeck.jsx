import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DrinkCard from './DrinkCard';
import { MousePointer } from 'lucide-react';

export default function DrinkParallaxDeck({ drinks = [], onAddToCart }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const sectionRef = useRef(null);
    const activeIndexRef = useRef(activeIndex);
    activeIndexRef.current = activeIndex;

    const hasMultiple = drinks.length > 1;

    // Reset when category/search filter changes
    useEffect(() => {
        setActiveIndex(0);
    }, [drinks.length]);

    // Intercept scroll: when user scrolls over catalog, website DOES NOT scroll; card scrolls first!
    useEffect(() => {
        const el = sectionRef.current;
        if (!el || !hasMultiple) return;

        let accumulatedDelta = 0;
        let lastStepTime = 0;

        const onWheel = (e) => {
            const now = Date.now();
            const delta = e.deltaY;

            // If scrolling down and NOT at last card -> LOCK PAGE SCROLL & scroll cards!
            if (delta > 0 && activeIndexRef.current < drinks.length - 1) {
                e.preventDefault();
                accumulatedDelta += delta;

                if (Math.abs(accumulatedDelta) > 30 && now - lastStepTime > 340) {
                    lastStepTime = now;
                    accumulatedDelta = 0;
                    setActiveIndex((prev) => Math.min(drinks.length - 1, prev + 1));
                }
                return;
            }

            // If scrolling up and NOT at first card -> LOCK PAGE SCROLL & scroll cards!
            if (delta < 0 && activeIndexRef.current > 0) {
                e.preventDefault();
                accumulatedDelta += delta;

                if (Math.abs(accumulatedDelta) > 30 && now - lastStepTime > 340) {
                    lastStepTime = now;
                    accumulatedDelta = 0;
                    setActiveIndex((prev) => Math.max(0, prev - 1));
                }
                return;
            }

            // If at the boundary (last card going down, or first card going up), let page scroll naturally!
            accumulatedDelta = 0;
        };

        // Attach non-passive listener to reliably preventDefault
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [hasMultiple, drinks.length]);

    // Touch swipe support for mobile
    useEffect(() => {
        const el = sectionRef.current;
        if (!el || !hasMultiple) return;

        let startY = 0;
        let lastStepTime = 0;

        const onTouchStart = (e) => {
            startY = e.touches[0].clientY;
        };

        const onTouchMove = (e) => {
            const currentY = e.touches[0].clientY;
            const diff = startY - currentY;
            const now = Date.now();

            if (diff > 35 && activeIndexRef.current < drinks.length - 1) {
                e.preventDefault();
                if (now - lastStepTime > 340) {
                    lastStepTime = now;
                    setActiveIndex((prev) => Math.min(drinks.length - 1, prev + 1));
                    startY = currentY;
                }
            } else if (diff < -35 && activeIndexRef.current > 0) {
                e.preventDefault();
                if (now - lastStepTime > 340) {
                    lastStepTime = now;
                    setActiveIndex((prev) => Math.max(0, prev - 1));
                    startY = currentY;
                }
            }
        };

        el.addEventListener('touchstart', onTouchStart, { passive: true });
        el.addEventListener('touchmove', onTouchMove, { passive: false });

        return () => {
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove', onTouchMove);
        };
    }, [hasMultiple, drinks.length]);

    if (drinks.length === 0) return null;

    if (!hasMultiple) {
        return (
            <div className="w-full max-w-4xl mx-auto">
                <DrinkCard
                    drink={drinks[0]}
                    onAddToCart={onAddToCart}
                    isHighlighted={true}
                />
            </div>
        );
    }

    const prevDrink = activeIndex > 0 ? drinks[activeIndex - 1] : null;
    const currentDrink = drinks[activeIndex];
    const nextDrink = activeIndex < drinks.length - 1 ? drinks[activeIndex + 1] : null;

    return (
        <section
            ref={sectionRef}
            className="w-full py-4 select-none relative"
            style={{ perspective: '1400px' }}
        >
            {/* Minimal Parallax Navigation Indicator (Zero Buttons) */}
            <div className="flex items-center justify-between text-xs font-bold text-[#6B7280] dark:text-[#9CA3AF] max-w-4xl mx-auto px-2 mb-3">
                <div className="flex items-center gap-2">
                    <MousePointer className="w-3.5 h-3.5 text-[#121417] dark:text-white" />
                    <span>Scroll pada katalog untuk menggulir kartu</span>
                </div>

                <div className="flex items-center gap-2 font-mono">
                    <span className="font-extrabold text-[#121417] dark:text-white">
                        {String(activeIndex + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[#9CA3AF]">/</span>
                    <span className="text-[#9CA3AF]">{String(drinks.length).padStart(2, '0')}</span>
                </div>
            </div>

            {/* True 3D Parallax Perspective Card Deck Stack */}
            <div className="relative min-h-[460px] sm:min-h-[480px] flex flex-col items-center justify-center gap-3">
                {/* 1. Previous Card (3D Receded Above: rotateX 10deg, scale 0.91, opacity 0.35) */}
                {prevDrink && (
                    <motion.div
                        key={`prev-${prevDrink.id}`}
                        initial={{ opacity: 0, y: -45, scale: 0.88, rotateX: 14 }}
                        animate={{ opacity: 0.35, y: -20, scale: 0.91, rotateX: 9 }}
                        exit={{ opacity: 0, y: -60, scale: 0.84, rotateX: 18 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 24, mass: 0.85 }}
                        onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                        className="w-full max-w-4xl mx-auto cursor-pointer hover:opacity-60 transition-opacity z-10"
                        title="Klik untuk kembali ke menu sebelumnya"
                    >
                        <DrinkCard
                            drink={prevDrink}
                            onAddToCart={onAddToCart}
                            isHighlighted={false}
                        />
                    </motion.div>
                )}

                {/* 2. Active Card (Prominent Center: scale 1.03, y 0, rotateX 0deg, full opacity) */}
                <motion.div
                    key={`active-${currentDrink.id}`}
                    layoutId={`deck-card-${currentDrink.id}`}
                    initial={{ opacity: 0, scale: 0.93, y: 30, rotateX: -10 }}
                    animate={{ opacity: 1, scale: 1.03, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.93, y: -30, rotateX: 10 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 24, mass: 0.8 }}
                    className="w-full max-w-4xl mx-auto z-20"
                >
                    <DrinkCard
                        drink={currentDrink}
                        onAddToCart={onAddToCart}
                        isHighlighted={true}
                    />
                </motion.div>

                {/* 3. Next Card (3D Receded Below: rotateX -10deg, scale 0.91, opacity 0.35) */}
                {nextDrink && (
                    <motion.div
                        key={`next-${nextDrink.id}`}
                        initial={{ opacity: 0, y: 45, scale: 0.88, rotateX: -14 }}
                        animate={{ opacity: 0.35, y: 20, scale: 0.91, rotateX: -9 }}
                        exit={{ opacity: 0, y: 60, scale: 0.84, rotateX: -18 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 24, mass: 0.85 }}
                        onClick={() => setActiveIndex((prev) => Math.min(drinks.length - 1, prev + 1))}
                        className="w-full max-w-4xl mx-auto cursor-pointer hover:opacity-60 transition-opacity z-10"
                        title="Klik untuk lanjut ke menu berikutnya"
                    >
                        <DrinkCard
                            drink={nextDrink}
                            onAddToCart={onAddToCart}
                            isHighlighted={false}
                        />
                    </motion.div>
                )}
            </div>
        </section>
    );
}
